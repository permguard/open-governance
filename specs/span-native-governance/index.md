# Span-Native Governance

Span-Native Governance is the model every specification of this site follows.
Governance records, the decisions taken, the controls evaluated, the risks assessed, the approvals given, arrive as OpenTelemetry spans and only as spans.
Every view of governance, a decision history, a risk register, a compliance state, is derived from them, and can be thrown away and rebuilt from them at any time.

| Status | Version | Namespace       | Signal               |
| ------ | ------- | --------------- | -------------------- |
| Draft  | 0       | `ogs.*`, shared | OpenTelemetry traces |

<Diagram of="sng/model" />

## Why spans

Governance today is assembled from a different format per source: a log here, an event bus there, a spreadsheet for the controls, a ticket for the approval.
Each format needs its own connector, and the answers to the questions that matter, why this was allowed, what this risk rests on, whether this system is compliant now, are spread across all of them.

OpenTelemetry is already in almost every stack.
Its SDKs exist for every major language, its collectors route and buffer, and its trace model already carries what governance needs: who emitted a record, when, what it is about, how it relates to others.
Making the span the one way in means any instrumented system is already a governance source, and one receiver can derive every view.

## The model

| Rule                 | Meaning                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| One way in           | a governance record is an OTLP span; no other ingestion format is defined                                          |
| The store is truth   | the records, kept as they came, append-only, are the only source of truth                                          |
| State is derived     | a decision history, a risk register or a compliance state is a view materialised from the records, never written   |
| Deterministic        | the same records give the same views, whatever their order of arrival and however often each was sent              |
| Unknown is a state   | what no valid record proves is unknown; the absence of a failure is never a success                                |
| References, not data | a record names the content it is about, with ids, digests and references; it never carries it                      |
| Modular              | each specification standardises one contract, under its own attribute prefix, and links to the others by reference |

## What this page set defines

| Page                                 | What it holds                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| [Records](./records)                 | What a governance record is, and how it maps onto a span                     |
| [Delivery](./delivery)               | How a record reaches a receiver without being lost, and is kept only once    |
| [Materialization](./materialization) | How views are derived from records: event time, validity, authority, unknown |
| [Privacy](./privacy)                 | What never goes in a span, and what goes instead                             |
| [Writing a Specification](./writing) | The parts every specification has, and the rules for naming its attributes   |

A specification of this site, such as [Open Decision Lineage](/specs/open-decision-lineage/), defines its own records and views and follows these rules for everything else.

## Spans for facts

OpenTelemetry describes a span as an operation, with a start and an end, and recommends events for things that happen at an instant.
Span-Native Governance deliberately uses spans for both.

- A record of an operation, a pipeline's batch, an evaluation that takes time, is a span with its real start and end.
- A record of a fact, a decision taken, an approval given, is a span whose end equals its start.

A span reaches every OpenTelemetry backend and SDK the same way, carries links and a status, and is kept whole by every collector.
One shape for every record keeps a single ingestion path, which is the point of the model.

## Conformance

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this specification are to be interpreted as described in BCP 14 ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)) when, and only when, they appear in all capitals.

| Role         | Is                                                              | Conformant when it satisfies                 |
| ------------ | --------------------------------------------------------------- | -------------------------------------------- |
| Producer     | a system, or its instrumentation, that emits governance records | [Records](./records), [Delivery](./delivery) |
| Receiver     | a system that accepts records over OTLP and keeps them          | [Delivery](./delivery)                       |
| Materializer | a system that derives views from kept records                   | [Materialization](./materialization)         |

One system may play all three roles, as [Permguard Admin](https://github.com/permguard/permguard-admin) does for Open Decision Lineage.

::: warning Draft
Span-Native Governance is a draft, version 0: it states the direction every specification here takes, and may change while the first specifications prove it.
:::
