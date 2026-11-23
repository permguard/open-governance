# Receivers

A receiver accepts OTLP traces, recognises the OCL spans among them, and keeps them as [Span-Native Governance](/specs/0.1/span-native-governance/delivery) says: never sampled, stored before it answers, kept once.
This page says what it must accept, refuse and normalise.

<Diagram of="ocl/receivers" />

## Transport

A receiver SHOULD accept both OTLP transports:

| Transport | Endpoint                                                     | Encoding                                                      |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| OTLP/gRPC | `opentelemetry.proto.collector.trace.v1.TraceService/Export` | protobuf, gzip accepted                                       |
| OTLP/HTTP | `POST /v1/traces`                                            | `application/x-protobuf` or `application/json`, gzip accepted |

It answers each export as OTLP says, with `partial_success` counting the spans it refused.

## Recognising an OCL span

A span is an OCL span when its resource carries `ocl.version` equal to a version the receiver supports, `"0.1"` for this one.
A receiver MUST NOT interpret a span as OCL from its span attributes alone.

| The resource carries                                       | The spans are                                      |
| ---------------------------------------------------------- | -------------------------------------------------- |
| `ocl.version` = `"0.1"`, and no other version attribute    | OCL, checked as below                              |
| `ocl.version` and the version of another specification     | refused: a record follows one specification        |
| `ocl.version` with another value                           | refused, unless the receiver supports that version |
| no version attribute of a specification the receiver keeps | refused: no kind it keeps                          |

## Refusing a span

An OCL span is refused, whole, when:

| Refused when                                                                                               | Reason given                                     |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| the resource carries no `ocl.organization.id`                                                              | the resource carries no `ocl.organization.id`    |
| `ocl.span.kind` is not `trigger`, `obligation`, `action` or `close`                                        | `ocl.span.kind` must be one of the four          |
| `ocl.case.id` is absent                                                                                    | a span carries no `ocl.case.id`                  |
| a trigger carries no `ocl.trigger.type` or no `ocl.subject.id`                                             | the trigger names no event or no subject         |
| an obligation carries no `ocl.obligation.id`, `ocl.obligation.action`, `ocl.law.id` or `ocl.law.article`   | the obligation is not identified or cites no law |
| `ocl.obligation.action` or `ocl.action.kind` is not among the nine                                         | the kind of action is unknown                    |
| `ocl.obligation.due` is present and not an RFC 3339 time                                                   | no valid `ocl.obligation.due`                    |
| `ocl.law.applies_from` is present and not an RFC 3339 time                                                 | no valid `ocl.law.applies_from`                  |
| an `assess` or a `review` carries no valid `ocl.action.result`, or a review no `ocl.actor.id`              | the action has no valid result or actor          |
| an `attest` carries an `ocl.action.result` other than `attested` or `risk_accepted`                        | the action has no valid result or actor          |
| a `determine` carries no `ocl.assessment.finding`, or one other than `satisfied` or `other_than_satisfied` | the action has no valid result or actor          |
| a close span's `ocl.case.state` is not `closed` or `withdrawn`                                             | no valid `ocl.case.state`                        |
| the trace id is not 16 bytes, or the span id not 8                                                         | no valid trace or span id                        |

The nine kinds of action are `assess`, `review`, `notify`, `inform`, `remediate`, `record`, `attest`, `escalate` and `determine` ([Span Kinds](./span-kinds#action)).
Every other check of the [Schema](./schema), a law id of a known form, a digest with its algorithm, is for producers: a receiver MAY warn about it, and keeps the span.

The refused spans are counted in `partial_success.rejected_spans`; `partial_success.error_message` gives the reason of the first.
The other spans of the export are accepted: one invalid span never refuses its neighbours.

A receiver MUST NOT refuse a span because it is late, out of order, or names a case it has not seen: the trigger of a case may arrive after its actions.

## Normalising

| Rule      | Meaning                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------- |
| Ids       | trace and span ids are kept as lower-case hexadecimal, whatever the sender's encoding                |
| Due       | `ocl.obligation.due` is kept as sent, and compared as an instant                                     |
| Root      | a span whose parent id is empty or all zeros is a root                                               |
| End       | a span whose end precedes its start ends at its start                                                |
| Unknown   | attributes this specification does not define are kept as they are, never refused                    |
| Lists     | `ogs.transaction.ids` is cut at 1 000 ids                                                            |
| Durable   | a record is on disk before the export that carried it is answered                                    |
| Kept once | the same trace and span ids are kept once; sent again with other content, they are a conflict, shown |

## Security

OCL spans say that a serious incident happened, that a person contested a decision, that two officers verified an identification.
Even without names, that is sensitive: a receiver MUST restrict who can read them, and SHOULD authenticate its senders, since a forged action would make an unmet obligation look met.
A receiver that listens beyond its own machine SHOULD say so to whoever turns it on.
