# Open Decision Lineage

Open Decision Lineage (ODL) is a semantic convention for OpenTelemetry traces.
It describes what the pipelines that analyse authorization decision logs do with them: which decisions each pipeline read, the steps it ran, how long they took, what failed, and what it produced.

| Status      | Version | Namespace | Signal               |
| ----------- | ------- | --------- | -------------------- |
| Development | 1       | `odl.*`   | OpenTelemetry traces |

::: warning Development
Version 1 is in development: an attribute may still change type or requirement level.
Attributes are deprecated, never removed or renamed.
:::

## Motivation

An authorization engine records every decision it takes in a decision log: who asked, for what, on which resource, and the outcome.
The log is where analysis starts.
A SOC rule looks for privilege escalation, a threat intelligence feed turns denials into sightings, an anomaly model scores the requests of a service account.

Each of these is a pipeline: one job or many, in memory or distributed, in parallel or not, split in batches or not.
Once several pipelines read the same decisions, questions follow that no single pipeline answers:

- Which pipelines read this decision, and what did each produce from it?
- Which decisions did this alert come from?
- Is every pipeline keeping up, and which step is failing?

ODL answers them with standard telemetry.
A pipeline emits OpenTelemetry spans with the `odl.*` attributes of this specification; any OTLP receiver that understands them can show the pipelines, rebuild their shape, and follow each decision from the log to what was made of it.

## Principles

| Principle            | Meaning                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Standard wire        | ODL adds no signal and no wire format: every ODL trace is a valid OTLP trace, sent by any OpenTelemetry SDK |
| Attributes only      | the specification gives meaning to span and resource attributes; the data model is OpenTelemetry's          |
| Shape is observed    | a pipeline never declares its graph: its steps and their order are rebuilt from the spans it emits          |
| Lineage by reference | a batch names the decision log records it read and the results it wrote, by id or by a group id             |
| Bounded              | id lists are capped; the counts stay the truth, and a group id stands for what is not listed                |

## Conformance

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this specification are to be interpreted as described in BCP 14 ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)) when, and only when, they appear in all capitals.

A **producer** is a pipeline, or its instrumentation, that emits ODL spans.
A **receiver** is a system that accepts OTLP traces and interprets ODL spans.
A producer is conformant when every span it marks as ODL satisfies the requirements of [Span Kinds](./span-kinds) and [Attributes](./attributes); a receiver is conformant when it satisfies [Receivers](./receivers).

## Relation to other conventions

ODL builds on the [OpenTelemetry trace data model](https://opentelemetry.io/docs/concepts/signals/traces/) unchanged and reuses its attributes where one exists for the same concept, such as `service.name`.

The [OpenInference](https://github.com/Arize-ai/openinference) conventions use the `decision.*` namespace for calls to decision models, models that score or select among options.
Those are not authorization decisions.
ODL never uses `decision.*`, and in this specification "decision" always means an authorization decision recorded in a decision log.

## Reading this specification

| Page                       | What it holds                                                                   |
| -------------------------- | ------------------------------------------------------------------------------- |
| [Data Model](./data-model) | Pipelines, runs, jobs, batches, steps and streams, and how they map onto traces |
| [Span Kinds](./span-kinds) | The four kinds of ODL span and what each carries                                |
| [Attributes](./attributes) | Every attribute, its type and its requirement level                             |
| [Lineage](./lineage)       | How a batch names what it read and what it wrote                                |
| [Runs and Health](./runs)  | How a run's state and a step's health are derived                               |
| [Receivers](./receivers)   | What a receiver must accept, refuse and rebuild                                 |
| [Examples](./examples)     | Spans as a producer emits them, and a producer in Python                        |

The reference receiver is [Permguard Admin](https://github.com/permguard/permguard-admin), whose Traces section shows the pipelines of a workspace.
