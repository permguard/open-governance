# Receivers

A receiver accepts OTLP traces, recognises the ODL spans among them, and interprets them as this specification says.
It may store them, show them, forward them or all three; ODL says what it must accept and refuse, not how it keeps what it accepts.

<Diagram of="odl/receivers" />

## Transport

A receiver SHOULD accept both OTLP transports:

| Transport | Endpoint                                                     | Encoding                                                      |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| OTLP/gRPC | `opentelemetry.proto.collector.trace.v1.TraceService/Export` | protobuf, gzip accepted                                       |
| OTLP/HTTP | `POST /v1/traces`                                            | `application/x-protobuf` or `application/json`, gzip accepted |

It answers each export as OTLP says, with `partial_success` counting the spans it refused.

## Recognising an ODL span

A span is an ODL span when its resource carries `odl.version` equal to a version the receiver supports, `"1"` for this one.
A receiver MUST NOT interpret a span as ODL from its span attributes alone.

## Refusing a span

A receiver that keeps only ODL spans refuses the others; a receiver that keeps every span MAY keep them, but MUST NOT interpret them as ODL.
An ODL span is refused, whole, when:

| Refused when                                                                            | Reason given                                       |
| --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| the resource carries no `odl.version = "1"`                                             | not Open Decision Lineage                          |
| the resource carries no `odl.pipeline.id`                                               | the resource carries no `odl.pipeline.id`          |
| the resource carries no `odl.pipeline.version`                                          | the resource carries no `odl.pipeline.version`     |
| `odl.span.kind` is not `batch`, `step`, `heartbeat` or `run`                            | `odl.span.kind` must be one of the four            |
| `odl.run.id` or `odl.job.id` is absent                                                  | a span carries no `odl.run.id` or `odl.job.id`     |
| a step span carries no `odl.step.id`, or an `odl.step.kind` not among the six           | the step is not identified, or its kind is unknown |
| a heartbeat's `odl.run.state` is not `running`, or a run span's is `running` or unknown | no valid `odl.run.state`                           |
| the trace id is not 16 bytes, or the span id not 8                                      | no valid trace or span id                          |

The refused spans are counted in `partial_success.rejected_spans`; `partial_success.error_message` gives the reason of the first.
The other spans of the export are accepted: one invalid span never refuses its neighbours.

## Normalising

| Rule     | Meaning                                                                                                  |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Ids      | trace and span ids are kept as lower-case hexadecimal, whatever the sender's encoding                    |
| Id lists | `odl.input.ids` and `odl.output.ids` longer than 1 000 are cut to their first 1 000; the counts are kept |
| Root     | a span whose parent id is empty or all zeros is a root                                                   |
| End      | a span whose end precedes its start ends at its start                                                    |
| Unknown  | attributes this specification does not define are kept as they are, never refused                        |

## Interpreting

A receiver that shows pipelines derives their runs, their steps' health and their graphs as [Runs and Health](./runs) says, and their lineage as [Lineage](./lineage) says.
A receiver that holds the decision logs the input ids name SHOULD resolve them, showing each decision's outcome beside its id.

## Security

ODL spans name decisions; they do not carry them ([Attributes](./attributes#value-rules)).
A receiver SHOULD still treat them as sensitive: the ids of the decisions a pipeline found suspicious are themselves information.
A receiver that listens beyond its own machine SHOULD say so to whoever turns it on, and SHOULD authenticate its senders once it can.
