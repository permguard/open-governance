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
  "odl.version": "0.1",
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

## A producer in your language

Any OpenTelemetry SDK produces ODL; no library of its own is needed.
Each example below sets the ODL resource, then emits one batch with two steps: `read`, and `detect` after it.
They send to a receiver on `127.0.0.1:14317` over OTLP/gRPC.

::: code-group

```go [Go]
package main

import (
	"context"

	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

func main() {
	ctx := context.Background()
	exporter, err := otlptracegrpc.New(ctx,
		otlptracegrpc.WithEndpoint("127.0.0.1:14317"), otlptracegrpc.WithInsecure())
	if err != nil {
		panic(err)
	}
	provider := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(resource.NewSchemaless(
			attribute.String("service.name", "pe-worker-a"),
			attribute.String("odl.version", "0.1"),
			attribute.String("odl.pipeline.id", "privilege-escalation"),
			attribute.String("odl.pipeline.version", "3"),
		)),
	)
	defer provider.Shutdown(ctx)
	tracer := provider.Tracer("privilege-escalation")

	run := trace.WithAttributes(
		attribute.String("odl.run.id", "01a2b3c4-0000-7000-8000-000000000001"),
		attribute.String("odl.job.id", "job-1"),
	)
	ids := []string{"01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b"}

	ctx, batch := tracer.Start(ctx, "batch", run, trace.WithAttributes(
		attribute.String("odl.span.kind", "batch"),
		attribute.String("odl.input.stream", "decisions/commerce/orders"),
		attribute.StringSlice("odl.input.ids", ids),
		attribute.Int("odl.input.count", len(ids)),
	))
	_, read := tracer.Start(ctx, "read", run, trace.WithAttributes(
		attribute.String("odl.span.kind", "step"),
		attribute.String("odl.step.id", "read"),
		attribute.String("odl.step.kind", "source"),
		attribute.String("odl.input.stream", "decisions/commerce/orders"),
		attribute.Int("odl.input.count", len(ids)),
	))
	read.End()
	_, detect := tracer.Start(ctx, "detect", run, trace.WithAttributes(
		attribute.String("odl.span.kind", "step"),
		attribute.String("odl.step.id", "detect"),
		attribute.String("odl.step.kind", "detect"),
		attribute.StringSlice("odl.step.upstream", []string{"read"}),
		attribute.String("odl.output.stream", "stix/sightings"),
		attribute.StringSlice("odl.output.ids", []string{"sighting--7f3e"}),
		attribute.Int("odl.output.count", 1),
	))
	detect.End()
	batch.End()
}
```

```java [Java]
import io.opentelemetry.api.common.AttributeKey;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import java.util.List;

public class Pipeline {
  public static void main(String[] args) {
    SdkTracerProvider provider = SdkTracerProvider.builder()
        .setResource(Resource.create(Attributes.builder()
            .put("service.name", "pe-worker-a")
            .put("odl.version", "0.1")
            .put("odl.pipeline.id", "privilege-escalation")
            .put("odl.pipeline.version", "3")
            .build()))
        .addSpanProcessor(BatchSpanProcessor.builder(
            OtlpGrpcSpanExporter.builder().setEndpoint("http://127.0.0.1:14317").build()).build())
        .build();
    Tracer tracer = provider.get("privilege-escalation");

    Attributes run = Attributes.builder()
        .put("odl.run.id", "01a2b3c4-0000-7000-8000-000000000001")
        .put("odl.job.id", "job-1")
        .build();
    List<String> ids = List.of("01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b");

    Span batch = tracer.spanBuilder("batch").setAllAttributes(run)
        .setAttribute("odl.span.kind", "batch")
        .setAttribute("odl.input.stream", "decisions/commerce/orders")
        .setAttribute(AttributeKey.stringArrayKey("odl.input.ids"), ids)
        .setAttribute("odl.input.count", ids.size())
        .startSpan();
    try (Scope scope = batch.makeCurrent()) {
      tracer.spanBuilder("read").setAllAttributes(run)
          .setAttribute("odl.span.kind", "step")
          .setAttribute("odl.step.id", "read")
          .setAttribute("odl.step.kind", "source")
          .setAttribute("odl.input.stream", "decisions/commerce/orders")
          .setAttribute("odl.input.count", ids.size())
          .startSpan().end();
      tracer.spanBuilder("detect").setAllAttributes(run)
          .setAttribute("odl.span.kind", "step")
          .setAttribute("odl.step.id", "detect")
          .setAttribute("odl.step.kind", "detect")
          .setAttribute(AttributeKey.stringArrayKey("odl.step.upstream"), List.of("read"))
          .setAttribute("odl.output.stream", "stix/sightings")
          .setAttribute(AttributeKey.stringArrayKey("odl.output.ids"), List.of("sighting--7f3e"))
          .setAttribute("odl.output.count", 1)
          .startSpan().end();
    } finally {
      batch.end();
    }
    provider.close();
  }
}
```

```csharp [.NET]
using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var source = new ActivitySource("privilege-escalation");
using var provider = Sdk.CreateTracerProviderBuilder()
    .SetResourceBuilder(ResourceBuilder.CreateEmpty().AddAttributes(new Dictionary<string, object>
    {
        ["service.name"] = "pe-worker-a",
        ["odl.version"] = "0.1",
        ["odl.pipeline.id"] = "privilege-escalation",
        ["odl.pipeline.version"] = "3",
    }))
    .AddSource("privilege-escalation")
    .AddOtlpExporter(options => options.Endpoint = new Uri("http://127.0.0.1:14317"))
    .Build();

string[] ids = ["01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b"];

Activity? Start(string name, string kind) => source.StartActivity(name)
    ?.SetTag("odl.span.kind", kind)
    .SetTag("odl.run.id", "01a2b3c4-0000-7000-8000-000000000001")
    .SetTag("odl.job.id", "job-1");

using (var batch = Start("batch", "batch"))
{
    batch?.SetTag("odl.input.stream", "decisions/commerce/orders")
        .SetTag("odl.input.ids", ids)
        .SetTag("odl.input.count", ids.Length);

    using (var read = Start("read", "step"))
    {
        read?.SetTag("odl.step.id", "read")
            .SetTag("odl.step.kind", "source")
            .SetTag("odl.input.stream", "decisions/commerce/orders")
            .SetTag("odl.input.count", ids.Length);
    }
    using (var detect = Start("detect", "step"))
    {
        detect?.SetTag("odl.step.id", "detect")
            .SetTag("odl.step.kind", "detect")
            .SetTag("odl.step.upstream", new[] { "read" })
            .SetTag("odl.output.stream", "stix/sightings")
            .SetTag("odl.output.ids", new[] { "sighting--7f3e" })
            .SetTag("odl.output.count", 1);
    }
}
```

```js [Node.js]
import { NodeTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { resourceFromAttributes } from '@opentelemetry/resources'

const provider = new NodeTracerProvider({
  resource: resourceFromAttributes({
    'service.name': 'pe-worker-a',
    'odl.version': '0.1',
    'odl.pipeline.id': 'privilege-escalation',
    'odl.pipeline.version': '3',
  }),
  spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: 'http://127.0.0.1:14317' }))],
})
provider.register()
const tracer = provider.getTracer('privilege-escalation')

const run = { 'odl.run.id': '01a2b3c4-0000-7000-8000-000000000001', 'odl.job.id': 'job-1' }
const ids = ['01a1f060-abb3-7fee-9354-b608bc73992a', '01a1f060-abb3-7fee-9354-b608bc73992b']

tracer.startActiveSpan('batch', {
  attributes: {
    ...run, 'odl.span.kind': 'batch',
    'odl.input.stream': 'decisions/commerce/orders', 'odl.input.ids': ids, 'odl.input.count': ids.length,
  },
}, (batch) => {
  tracer.startSpan('read', {
    attributes: {
      ...run, 'odl.span.kind': 'step', 'odl.step.id': 'read', 'odl.step.kind': 'source',
      'odl.input.stream': 'decisions/commerce/orders', 'odl.input.count': ids.length,
    },
  }).end()
  tracer.startSpan('detect', {
    attributes: {
      ...run, 'odl.span.kind': 'step', 'odl.step.id': 'detect', 'odl.step.kind': 'detect',
      'odl.step.upstream': ['read'], 'odl.output.stream': 'stix/sightings',
      'odl.output.ids': ['sighting--7f3e'], 'odl.output.count': 1,
    },
  }).end()
  batch.end()
})

await provider.shutdown()
```

```python [Python]
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

provider = TracerProvider(resource=Resource.create({
    "service.name": "pe-worker-a",
    "odl.version": "0.1",
    "odl.pipeline.id": "privilege-escalation",
    "odl.pipeline.version": "3",
}))
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint="http://127.0.0.1:14317", insecure=True)))
tracer = provider.get_tracer("privilege-escalation")

run = {"odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1"}
ids = ["01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b"]

with tracer.start_as_current_span("batch", attributes={
    **run, "odl.span.kind": "batch",
    "odl.input.stream": "decisions/commerce/orders", "odl.input.ids": ids, "odl.input.count": len(ids),
}):
    with tracer.start_as_current_span("read", attributes={
        **run, "odl.span.kind": "step", "odl.step.id": "read", "odl.step.kind": "source",
        "odl.input.stream": "decisions/commerce/orders", "odl.input.count": len(ids),
    }):
        pass
    with tracer.start_as_current_span("detect", attributes={
        **run, "odl.span.kind": "step", "odl.step.id": "detect", "odl.step.kind": "detect",
        "odl.step.upstream": ["read"], "odl.output.stream": "stix/sightings",
        "odl.output.ids": ["sighting--7f3e"], "odl.output.count": 1,
    }):
        pass

provider.shutdown()
```

```rust [Rust]
use opentelemetry::trace::{TraceContextExt, Tracer, TracerProvider as _};
use opentelemetry::{Array, KeyValue, StringValue, Value};
use opentelemetry_otlp::{SpanExporter, WithExportConfig};
use opentelemetry_sdk::{trace::SdkTracerProvider, Resource};

fn strings(items: &[&'static str]) -> Value {
    Value::Array(Array::String(items.iter().map(|item| StringValue::from(*item)).collect()))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let exporter = SpanExporter::builder()
        .with_tonic()
        .with_endpoint("http://127.0.0.1:14317")
        .build()?;
    let provider = SdkTracerProvider::builder()
        .with_batch_exporter(exporter)
        .with_resource(
            Resource::builder_empty()
                .with_attributes([
                    KeyValue::new("service.name", "pe-worker-a"),
                    KeyValue::new("odl.version", "0.1"),
                    KeyValue::new("odl.pipeline.id", "privilege-escalation"),
                    KeyValue::new("odl.pipeline.version", "3"),
                ])
                .build(),
        )
        .build();
    let tracer = provider.tracer("privilege-escalation");

    let run = [
        KeyValue::new("odl.run.id", "01a2b3c4-0000-7000-8000-000000000001"),
        KeyValue::new("odl.job.id", "job-1"),
    ];
    let ids = ["01a1f060-abb3-7fee-9354-b608bc73992a", "01a1f060-abb3-7fee-9354-b608bc73992b"];

    tracer.in_span("batch", |cx| {
        cx.span().set_attributes(run.clone());
        cx.span().set_attributes([
            KeyValue::new("odl.span.kind", "batch"),
            KeyValue::new("odl.input.stream", "decisions/commerce/orders"),
            KeyValue::new("odl.input.ids", strings(&ids)),
            KeyValue::new("odl.input.count", ids.len() as i64),
        ]);
        tracer.in_span("read", |cx| {
            cx.span().set_attributes(run.clone());
            cx.span().set_attributes([
                KeyValue::new("odl.span.kind", "step"),
                KeyValue::new("odl.step.id", "read"),
                KeyValue::new("odl.step.kind", "source"),
                KeyValue::new("odl.input.stream", "decisions/commerce/orders"),
                KeyValue::new("odl.input.count", ids.len() as i64),
            ]);
        });
        tracer.in_span("detect", |cx| {
            cx.span().set_attributes(run.clone());
            cx.span().set_attributes([
                KeyValue::new("odl.span.kind", "step"),
                KeyValue::new("odl.step.id", "detect"),
                KeyValue::new("odl.step.kind", "detect"),
                KeyValue::new("odl.step.upstream", strings(&["read"])),
                KeyValue::new("odl.output.stream", "stix/sightings"),
                KeyValue::new("odl.output.ids", strings(&["sighting--7f3e"])),
                KeyValue::new("odl.output.count", 1_i64),
            ]);
        });
    });

    provider.shutdown()?;
    Ok(())
}
```

:::

A real pipeline sets the times of its spans from its own work, emits a heartbeat while it waits and a run span when it ends, as [Span Kinds](./span-kinds) says.

The [Permguard Admin playground](https://github.com/permguard/permguard-admin-releases/tree/main/playground) runs three such pipelines against a live decision log, `playground/pipelines/app.py`.
