# Open Decision Lineage

Open Decision Lineage (ODL) is a semantic convention for OpenTelemetry traces.
It lets the pipelines that analyse authorization decision logs say what they did with them, so that anyone receiving their traces can rebuild the pipelines, follow their runs and trace each decision to what was made of it.

| Status      | Version | Namespace | Signal               |
| ----------- | ------- | --------- | -------------------- |
| Development | 0.1     | `odl.*`   | OpenTelemetry Traces |

<Diagram of="odl/architecture" />

## The picture

An authorization engine takes a decision for every request it is asked about, and records each one in a **decision log**: who asked, for what, on which resource, and the outcome.

The log is read by **consumers**, and every consumer is a **pipeline**.
A SOC rule looks for privilege escalation, a threat intelligence feed turns denials into sightings, an anomaly model scores the requests of a service account.
Several pipelines can read the same log, each for its own purpose.

How a pipeline processes the log is its own choice, and ODL does not constrain it:

| A pipeline is free to                   | For example                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| take decisions one at a time, or many   | one decision per batch, 1 : 1, or every decision since the last batch, 1 : n |
| have one step, or many                  | a single `detect`, or `read`, `enrich`, `detect` and `write`                 |
| run its steps in series, or in parallel | two enrichments of the same records at once, joined by the next step         |
| run as one worker, or many              | one process, or a job per partition of the log                               |
| last minutes, or months                 | a nightly sweep, or a consumer that never stops                              |
| write to one stream, or several         | alerts for the SOC and STIX sightings from the same finding                  |

What ODL fixes is how a pipeline **describes** itself, whatever shape it has.

- Every pipeline has an **id**, a **name** and a **version**. The version names the pipeline's shape: two runs of the same version have the same steps, in the same order, so what a receiver draws is never a mix of two shapes.
- Inside the pipeline are its **steps**. For every batch of work, each step reports what it read, what it wrote, how long it took and whether it failed.
- From these reports a **receiver** composes the rest: the graph of the pipeline, the state of each run, the health of each step, and the lineage of each decision.

All of it travels as standard OpenTelemetry spans, sent by any OpenTelemetry SDK to any OTLP endpoint.
ODL only gives meaning to their `odl.*` attributes.

## What it answers

Once several pipelines read the same decisions, questions follow that no single pipeline answers:

- Which pipelines read this decision, and what did each produce from it?
- Which decisions did this alert come from?
- Is every pipeline keeping up, and which step is failing?

ODL answers them from the spans alone, without access to the pipelines themselves.

## Principles

| Principle            | Meaning                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Standard wire        | ODL adds no signal and no wire format: every ODL trace is a valid OTLP trace, sent by any OpenTelemetry SDK |
| Attributes only      | the specification gives meaning to span and resource attributes; the data model is OpenTelemetry's          |
| Describe, not impose | a pipeline keeps its own shape; ODL gives it the words to describe whichever shape it has                   |
| Versioned shape      | a pipeline's version names its shape; a new shape is a new version                                          |
| Shape is observed    | a pipeline never sends its graph: its steps and their order are rebuilt from the spans it emits             |
| Lineage by reference | a batch names the decision log records it read and the results it wrote, by id or by a group id             |
| Bounded              | id lists are capped; the counts stay the truth, and a group id stands for what is not listed                |

## Reading this specification

The pages go from the whole to the detail: the shape of a pipeline first, then how it maps onto traces, then every attribute, then what a receiver derives.

| Page                         | What it holds                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------- |
| [Pipelines](./pipelines)     | The shapes a pipeline can take, and how its id and version name them            |
| [Data Model](./data-model)   | Pipelines, runs, jobs, batches, steps and streams, and how they map onto traces |
| [Span Kinds](./span-kinds)   | The four kinds of ODL span, and what each carries                               |
| [Attributes](./attributes)   | Every attribute, its type and its requirement level                             |
| [Lineage](./lineage)         | How a batch names what it read and what it wrote                                |
| [Schema](./schema)           | The JSON Schema of a record, to validate what a producer emits                  |
| [Runs and Health](./runs)    | How a run's state, a step's health and a pipeline's graph are derived           |
| [Receivers](./receivers)     | What a receiver must accept, refuse and rebuild                                 |
| [Field Guide](./field-guide) | Spans as a producer emits them, and a producer in Python                        |

The reference receiver is [Permguard Admin](https://github.com/permguard/permguard-admin), whose Traces section shows the pipelines of a workspace.

## Conformance

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this specification are to be interpreted as described in BCP 14 ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)) when, and only when, they appear in all capitals.

A **producer** is a pipeline, or its instrumentation, that emits ODL spans.
A **receiver** is a system that accepts OTLP traces and interprets ODL spans.
A producer is conformant when every span it marks as ODL satisfies the requirements of [Span Kinds](./span-kinds) and [Attributes](./attributes); a receiver is conformant when it satisfies [Receivers](./receivers).

Version 0.1 is in development: an attribute may still change type or requirement level.
Attributes are deprecated, never removed or renamed.

## Relation to other conventions

ODL is a specification of [Span-Native Governance](/specs/0.1/span-native-governance/), the model every specification of this site follows: its records are spans, and what a receiver shows, pipelines, runs, health and lineage, is materialised from them.

ODL builds on the [OpenTelemetry trace data model](https://opentelemetry.io/docs/concepts/signals/traces/) unchanged and reuses its attributes where one exists for the same concept, such as `service.name`.

The [OpenInference](https://github.com/Arize-ai/openinference) conventions use the `decision.*` namespace for calls to decision models, models that score or select among options.
Those are not authorization decisions.
ODL never uses `decision.*`, and in this specification "decision" always means an authorization decision recorded in a decision log.
