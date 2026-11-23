# Field Guide

OCE as a producer emits it: the rules that matter in practice, and a producer in every major language.
The [AI Act Examples](./examples) show the records; this page shows the code that sends them.

<Diagram of="oce/field-guide" />

## In practice

| Do                                                                       | Because                                                                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| emit OCE through a tracer provider of its own, with an always-on sampler | a governance record is never sampled ([Delivery](/specs/0.1/span-native-governance/delivery)) |
| set the trigger's end to the moment of awareness, from your own clock    | every deadline counts from it                                                                 |
| compute the due when you assess the obligation, and send it              | the law often leaves a choice, and the record must say which was made                         |
| send an obligation as soon as its due can be computed                    | a final report counting from a notification is emitted after it                               |
| use pseudonymous actor ids, and keep the mapping to persons at home      | OCE spans travel beyond the access rules of the case                                          |
| name the report, the log or the decision by URI and digest               | the evidence stays where it is protected; the span proves it existed                          |
| keep the same trace and span ids when you send a record again            | the receiver keeps it once                                                                    |
| flush before the process stops                                           | an action that never arrives is an obligation that looks unmet                                |

## A producer in your language

Any OpenTelemetry SDK produces OCE; no library of its own is needed.
Each example below sets the OCE resource, then emits the case of [Two people before anyone acts](./examples#two-people-before-anyone-acts): a trigger with its obligation as a child, then one review in a trace of its own.
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
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(resource.NewSchemaless(
			attribute.String("service.name", "harbor-oversight"),
			attribute.String("oce.version", "0.1"),
			attribute.String("oce.organization.id", "harbor-transit"),
		)),
	)
	defer provider.Shutdown(ctx)
	tracer := provider.Tracer("compliance")
	caseID := attribute.String("oce.case.id", "0195d1f0-9e00-7000-8000-00000000c001")

	tctx, trigger := tracer.Start(ctx, "identification match", trace.WithAttributes(caseID,
		attribute.String("oce.span.kind", "trigger"),
		attribute.String("oce.trigger.type", "identification_match"),
		attribute.String("oce.subject.id", "gate-watch"),
		attribute.String("oce.subject.type", "ai_system"),
	))
	_, obligation := tracer.Start(tctx, "separate verification", trace.WithAttributes(caseID,
		attribute.String("oce.span.kind", "obligation"),
		attribute.String("oce.obligation.id", "ai-act-14-5"),
		attribute.String("oce.obligation.action", "review"),
		attribute.Int("oce.obligation.quorum", 2),
		attribute.String("oce.law.id", "eu-ai-act"),
		attribute.String("oce.law.article", "14"),
		attribute.String("oce.law.paragraph", "5"),
		attribute.String("oce.party.role", "deployer"),
	))
	obligation.End()
	trigger.End()

	_, review := tracer.Start(ctx, "verification", trace.WithAttributes(caseID,
		attribute.String("oce.span.kind", "action"),
		attribute.String("oce.action.kind", "review"),
		attribute.String("oce.obligation.id", "ai-act-14-5"),
		attribute.String("oce.action.result", "confirmed"),
		attribute.String("oce.actor.id", "officer-4f1c"),
	))
	review.End()
}
```

```java [Java]
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.context.Scope;
import io.opentelemetry.exporter.otlp.trace.OtlpGrpcSpanExporter;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor;
import io.opentelemetry.sdk.trace.samplers.Sampler;

public class Compliance {
  public static void main(String[] args) {
    SdkTracerProvider provider = SdkTracerProvider.builder()
        .setSampler(Sampler.alwaysOn())
        .setResource(Resource.create(Attributes.builder()
            .put("service.name", "harbor-oversight")
            .put("oce.version", "0.1")
            .put("oce.organization.id", "harbor-transit")
            .build()))
        .addSpanProcessor(BatchSpanProcessor.builder(
            OtlpGrpcSpanExporter.builder().setEndpoint("http://127.0.0.1:14317").build()).build())
        .build();
    Tracer tracer = provider.get("compliance");
    String caseId = "0195d1f0-9e00-7000-8000-00000000c001";

    Span trigger = tracer.spanBuilder("identification match").setNoParent()
        .setAttribute("oce.span.kind", "trigger")
        .setAttribute("oce.case.id", caseId)
        .setAttribute("oce.trigger.type", "identification_match")
        .setAttribute("oce.subject.id", "gate-watch")
        .setAttribute("oce.subject.type", "ai_system")
        .startSpan();
    try (Scope scope = trigger.makeCurrent()) {
      tracer.spanBuilder("separate verification")
          .setAttribute("oce.span.kind", "obligation")
          .setAttribute("oce.case.id", caseId)
          .setAttribute("oce.obligation.id", "ai-act-14-5")
          .setAttribute("oce.obligation.action", "review")
          .setAttribute("oce.obligation.quorum", 2)
          .setAttribute("oce.law.id", "eu-ai-act")
          .setAttribute("oce.law.article", "14")
          .setAttribute("oce.law.paragraph", "5")
          .setAttribute("oce.party.role", "deployer")
          .startSpan().end();
    } finally {
      trigger.end();
    }

    tracer.spanBuilder("verification").setNoParent()
        .setAttribute("oce.span.kind", "action")
        .setAttribute("oce.case.id", caseId)
        .setAttribute("oce.action.kind", "review")
        .setAttribute("oce.obligation.id", "ai-act-14-5")
        .setAttribute("oce.action.result", "confirmed")
        .setAttribute("oce.actor.id", "officer-4f1c")
        .startSpan().end();
    provider.close();
  }
}
```

```csharp [.NET]
using System.Diagnostics;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var source = new ActivitySource("compliance");
using var provider = Sdk.CreateTracerProviderBuilder()
    .SetSampler(new AlwaysOnSampler())
    .SetResourceBuilder(ResourceBuilder.CreateEmpty().AddAttributes(new Dictionary<string, object>
    {
        ["service.name"] = "harbor-oversight",
        ["oce.version"] = "0.1",
        ["oce.organization.id"] = "harbor-transit",
    }))
    .AddSource("compliance")
    .AddOtlpExporter(options => options.Endpoint = new Uri("http://127.0.0.1:14317"))
    .Build();

Activity? Start(string name, string kind) => source.StartActivity(name)
    ?.SetTag("oce.span.kind", kind)
    .SetTag("oce.case.id", "0195d1f0-9e00-7000-8000-00000000c001");

using (var trigger = Start("identification match", "trigger"))
{
    trigger?.SetTag("oce.trigger.type", "identification_match")
        .SetTag("oce.subject.id", "gate-watch")
        .SetTag("oce.subject.type", "ai_system");

    using var obligation = Start("separate verification", "obligation");
    obligation?.SetTag("oce.obligation.id", "ai-act-14-5")
        .SetTag("oce.obligation.action", "review")
        .SetTag("oce.obligation.quorum", 2)
        .SetTag("oce.law.id", "eu-ai-act")
        .SetTag("oce.law.article", "14")
        .SetTag("oce.law.paragraph", "5")
        .SetTag("oce.party.role", "deployer");
}

using (var review = Start("verification", "action"))
{
    review?.SetTag("oce.action.kind", "review")
        .SetTag("oce.obligation.id", "ai-act-14-5")
        .SetTag("oce.action.result", "confirmed")
        .SetTag("oce.actor.id", "officer-4f1c");
}
```

```js [Node.js]
import { NodeTracerProvider, BatchSpanProcessor, AlwaysOnSampler } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { resourceFromAttributes } from '@opentelemetry/resources'

const provider = new NodeTracerProvider({
  sampler: new AlwaysOnSampler(),
  resource: resourceFromAttributes({
    'service.name': 'harbor-oversight',
    'oce.version': '0.1',
    'oce.organization.id': 'harbor-transit',
  }),
  spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: 'http://127.0.0.1:14317' }))],
})
provider.register()
const tracer = provider.getTracer('compliance')
const ofCase = { 'oce.case.id': '0195d1f0-9e00-7000-8000-00000000c001' }

tracer.startActiveSpan('identification match', {
  attributes: {
    ...ofCase, 'oce.span.kind': 'trigger',
    'oce.trigger.type': 'identification_match', 'oce.subject.id': 'gate-watch', 'oce.subject.type': 'ai_system',
  },
}, (trigger) => {
  tracer.startSpan('separate verification', {
    attributes: {
      ...ofCase, 'oce.span.kind': 'obligation',
      'oce.obligation.id': 'ai-act-14-5', 'oce.obligation.action': 'review', 'oce.obligation.quorum': 2,
      'oce.law.id': 'eu-ai-act', 'oce.law.article': '14', 'oce.law.paragraph': '5', 'oce.party.role': 'deployer',
    },
  }).end()
  trigger.end()
})

tracer.startSpan('verification', {
  root: true,
  attributes: {
    ...ofCase, 'oce.span.kind': 'action', 'oce.action.kind': 'review',
    'oce.obligation.id': 'ai-act-14-5', 'oce.action.result': 'confirmed', 'oce.actor.id': 'officer-4f1c',
  },
}).end()

await provider.shutdown()
```

```python [Python]
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.trace.sampling import ALWAYS_ON

provider = TracerProvider(sampler=ALWAYS_ON, resource=Resource.create({
    "service.name": "harbor-oversight",
    "oce.version": "0.1",
    "oce.organization.id": "harbor-transit",
}))
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint="http://127.0.0.1:14317", insecure=True)))
tracer = provider.get_tracer("compliance")

case = {"oce.case.id": "0195d1f0-9e00-7000-8000-00000000c001"}

with tracer.start_as_current_span("identification match", attributes={
    **case, "oce.span.kind": "trigger",
    "oce.trigger.type": "identification_match", "oce.subject.id": "gate-watch", "oce.subject.type": "ai_system",
}):
    with tracer.start_as_current_span("separate verification", attributes={
        **case, "oce.span.kind": "obligation",
        "oce.obligation.id": "ai-act-14-5", "oce.obligation.action": "review", "oce.obligation.quorum": 2,
        "oce.law.id": "eu-ai-act", "oce.law.article": "14", "oce.law.paragraph": "5", "oce.party.role": "deployer",
    }):
        pass

with tracer.start_as_current_span("verification", attributes={
    **case, "oce.span.kind": "action", "oce.action.kind": "review",
    "oce.obligation.id": "ai-act-14-5", "oce.action.result": "confirmed", "oce.actor.id": "officer-4f1c",
}):
    pass

provider.shutdown()
```

```rust [Rust]
use opentelemetry::trace::{TraceContextExt, Tracer, TracerProvider as _};
use opentelemetry::KeyValue;
use opentelemetry_otlp::{SpanExporter, WithExportConfig};
use opentelemetry_sdk::trace::{Sampler, SdkTracerProvider};
use opentelemetry_sdk::Resource;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let exporter = SpanExporter::builder()
        .with_tonic()
        .with_endpoint("http://127.0.0.1:14317")
        .build()?;
    let provider = SdkTracerProvider::builder()
        .with_sampler(Sampler::AlwaysOn)
        .with_batch_exporter(exporter)
        .with_resource(
            Resource::builder_empty()
                .with_attributes([
                    KeyValue::new("service.name", "harbor-oversight"),
                    KeyValue::new("oce.version", "0.1"),
                    KeyValue::new("oce.organization.id", "harbor-transit"),
                ])
                .build(),
        )
        .build();
    let tracer = provider.tracer("compliance");
    let case = KeyValue::new("oce.case.id", "0195d1f0-9e00-7000-8000-00000000c001");

    tracer.in_span("identification match", |cx| {
        cx.span().set_attributes([
            case.clone(),
            KeyValue::new("oce.span.kind", "trigger"),
            KeyValue::new("oce.trigger.type", "identification_match"),
            KeyValue::new("oce.subject.id", "gate-watch"),
            KeyValue::new("oce.subject.type", "ai_system"),
        ]);
        tracer.in_span("separate verification", |cx| {
            cx.span().set_attributes([
                case.clone(),
                KeyValue::new("oce.span.kind", "obligation"),
                KeyValue::new("oce.obligation.id", "ai-act-14-5"),
                KeyValue::new("oce.obligation.action", "review"),
                KeyValue::new("oce.obligation.quorum", 2_i64),
                KeyValue::new("oce.law.id", "eu-ai-act"),
                KeyValue::new("oce.law.article", "14"),
                KeyValue::new("oce.law.paragraph", "5"),
                KeyValue::new("oce.party.role", "deployer"),
            ]);
        });
    });

    tracer.in_span("verification", |cx| {
        cx.span().set_attributes([
            case.clone(),
            KeyValue::new("oce.span.kind", "action"),
            KeyValue::new("oce.action.kind", "review"),
            KeyValue::new("oce.obligation.id", "ai-act-14-5"),
            KeyValue::new("oce.action.result", "confirmed"),
            KeyValue::new("oce.actor.id", "officer-4f1c"),
        ]);
    });

    provider.shutdown()?;
    Ok(())
}
```

:::

A real producer sets the times of its spans from the case itself: the trigger's start when the event happened and its end when it became known, each action's end when it was done.
It links a trigger to the record that caused it, and a review to what it reviewed, as [Span Kinds](./span-kinds) says.
