# Field Guide

ODL as it is met in practice: the spans a pipeline emits, and a producer that emits them.
The spans are shown in a logical JSON form, as the [OpenInference specification](https://github.com/Arize-ai/openinference/tree/main/spec) does: OTLP carries the same attributes, typed.

<Diagram of="odl/field-guide" />

## A batch

A batch of the `privilege-escalation` pipeline reads 2 decisions, enriches them and writes 1 sighting.

The resource, shared by every span of the worker:

```json
{
  "service.name": "privilege-escalation-worker-a",
  "odl.version": "1",
  "odl.pipeline.id": "privilege-escalation",
  "odl.pipeline.name": "Privilege escalation",
  "odl.pipeline.version": "3"
}
```

The batch span, root of its trace:

```json
{
  "name": "privilege-escalation batch",
  "context": { "trace_id": "648b400ece17d26b658b1ef03f865761", "span_id": "a1b2c3d4e5f60718" },
  "parent_id": null,
  "status_code": "OK",
  "attributes": {
    "odl.span.kind": "batch",
    "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001",
    "odl.job.id": "job-1",
    "odl.input.stream": "decisions/commerce/order-platform",
    "odl.input.ids": ["01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b"],
    "odl.input.count": 2,
    "odl.output.count": 1
  }
}
```

Its three steps, children of the batch span:

```json
[
  {
    "name": "read-decisions",
    "attributes": {
      "odl.span.kind": "step", "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1",
      "odl.step.id": "read-decisions", "odl.step.kind": "source",
      "odl.input.stream": "decisions/commerce/order-platform",
      "odl.input.ids": ["01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b"],
      "odl.input.count": 2
    }
  },
  {
    "name": "enrich-identity",
    "attributes": {
      "odl.span.kind": "step", "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1",
      "odl.step.id": "enrich-identity", "odl.step.kind": "enrich",
      "odl.step.upstream": ["read-decisions"]
    }
  },
  {
    "name": "detect-escalation",
    "attributes": {
      "odl.span.kind": "step", "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1",
      "odl.step.id": "detect-escalation", "odl.step.kind": "detect",
      "odl.step.upstream": ["enrich-identity"],
      "odl.output.stream": "stix/sightings",
      "odl.output.ids": ["sighting--4c1e7a0b-5d3f-4a2c-8e6b-0d2f4a6c8e0b"],
      "odl.output.count": 1
    }
  }
]
```

## A batch read by group

A pipeline that reads hundreds of decisions at once names the group, and the count:

```json
{
  "odl.span.kind": "batch",
  "odl.run.id": "01a2b3c4-0000-7000-8000-000000000002",
  "odl.job.id": "job-1",
  "odl.input.stream": "decisions/commerce/order-platform",
  "odl.input.group_id": "decisions:commerce/order-platform@2-121",
  "odl.input.count": 120
}
```

## A run alive, then ended

While it waits for decisions, the run sends heartbeats; when it ends, it says how:

```json
[
  { "odl.span.kind": "heartbeat", "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1",
    "odl.run.state": "running", "odl.processed.total": 1840, "odl.failed.total": 3 },
  { "odl.span.kind": "run", "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1",
    "odl.run.state": "succeeded", "odl.processed.total": 2412, "odl.failed.total": 3 }
]
```

## A producer in Python

Any OpenTelemetry SDK produces ODL; no library of its own is needed.
With the Python SDK, a resource per worker and explicit times per span:

```python
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

resource = Resource.create({
    "service.name": "privilege-escalation-worker-a",
    "odl.version": "1",
    "odl.pipeline.id": "privilege-escalation",
    "odl.pipeline.name": "Privilege escalation",
    "odl.pipeline.version": "3",
})
provider = TracerProvider(resource=resource)
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint="http://127.0.0.1:14317", insecure=True)))
tracer = provider.get_tracer("my-pipeline")

run = {"odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1"}
ids = [decision.id for decision in batch]

with tracer.start_as_current_span("privilege-escalation batch", attributes={
    "odl.span.kind": "batch", **run,
    "odl.input.stream": "decisions/commerce/order-platform", "odl.input.ids": ids, "odl.input.count": len(ids),
}):
    with tracer.start_as_current_span("read-decisions", attributes={
        "odl.span.kind": "step", **run, "odl.step.id": "read-decisions", "odl.step.kind": "source",
        "odl.input.stream": "decisions/commerce/order-platform", "odl.input.ids": ids, "odl.input.count": len(ids),
    }):
        records = read(batch)
    with tracer.start_as_current_span("detect-escalation", attributes={
        "odl.span.kind": "step", **run, "odl.step.id": "detect-escalation", "odl.step.kind": "detect",
        "odl.step.upstream": ["read-decisions"], "odl.output.stream": "stix/sightings",
    }) as step:
        sightings = detect(records)
        step.set_attribute("odl.output.ids", [sighting.id for sighting in sightings])
        step.set_attribute("odl.output.count", len(sightings))
```

The [Permguard Admin playground](https://github.com/permguard/permguard-admin-releases/tree/main/playground) runs three such pipelines against a live decision log, `playground/pipelines/app.py`.
