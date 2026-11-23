# Receivers

A receiver accepts OTLP traces, recognises the OCE spans among them, and keeps them as [Span-Native Governance](/specs/0.1/span-native-governance/delivery) says: never sampled, stored before it answers, kept once.
This page says what it must accept, refuse and normalise.

<Diagram of="oce/receivers" />

## Transport

A receiver SHOULD accept both OTLP transports:

| Transport | Endpoint                                                     | Encoding                                                      |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| OTLP/gRPC | `opentelemetry.proto.collector.trace.v1.TraceService/Export` | protobuf, gzip accepted                                       |
| OTLP/HTTP | `POST /v1/traces`                                            | `application/x-protobuf` or `application/json`, gzip accepted |

It answers each export as OTLP says, with `partial_success` counting the spans it refused.

## Recognising an OCE span

A span is an OCE span when its resource carries `oce.version` equal to a version the receiver supports, `"0.1"` for this one.
A receiver MUST NOT interpret a span as OCE from its span attributes alone.

## Refusing a span

An OCE span is refused, whole, when:

| Refused when                                                                                             | Reason given                                     |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| the resource carries no `oce.organization.id`                                                            | the resource carries no `oce.organization.id`    |
| `oce.span.kind` is not `trigger`, `obligation`, `action` or `close`                                      | `oce.span.kind` must be one of the four          |
| `oce.case.id` is absent                                                                                  | a span carries no `oce.case.id`                  |
| a trigger carries no `oce.trigger.type` or no `oce.subject.id`                                           | the trigger names no event or no subject         |
| an obligation carries no `oce.obligation.id`, `oce.obligation.action`, `oce.law.id` or `oce.law.article` | the obligation is not identified or cites no law |
| `oce.obligation.due` is not an RFC 3339 time                                                             | no valid `oce.obligation.due`                    |
| `oce.obligation.action` or `oce.action.kind` is not among the six                                        | the kind of action is unknown                    |
| an `assess` or a `review` carries no valid `oce.action.result`, or a review no `oce.actor.id`            | the action has no valid result or actor          |
| a close span's `oce.case.state` is not `closed` or `withdrawn`                                           | no valid `oce.case.state`                        |
| the trace id is not 16 bytes, or the span id not 8                                                       | no valid trace or span id                        |

The refused spans are counted in `partial_success.rejected_spans`; `partial_success.error_message` gives the reason of the first.
The other spans of the export are accepted: one invalid span never refuses its neighbours.

A receiver MUST NOT refuse a span because it is late, out of order, or names a case it has not seen: the trigger of a case may arrive after its actions.

## Normalising

| Rule    | Meaning                                                                               |
| ------- | ------------------------------------------------------------------------------------- |
| Ids     | trace and span ids are kept as lower-case hexadecimal, whatever the sender's encoding |
| Due     | `oce.obligation.due` is kept as sent, and compared as an instant                      |
| Root    | a span whose parent id is empty or all zeros is a root                                |
| End     | a span whose end precedes its start ends at its start                                 |
| Unknown | attributes this specification does not define are kept as they are, never refused     |

## Security

OCE spans say that a serious incident happened, that a person contested a decision, that two officers verified an identification.
Even without names, that is sensitive: a receiver MUST restrict who can read them, and SHOULD authenticate its senders, since a forged action would make an unmet obligation look met.
A receiver that listens beyond its own machine SHOULD say so to whoever turns it on.
