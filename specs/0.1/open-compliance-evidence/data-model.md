# Data Model

OCE describes compliance processes with five concepts and maps each onto the OpenTelemetry trace data model.
Nothing is added to OTLP: a concept is either the resource, a span, or an attribute of one.

<Diagram of="oce/data-model" />

## Concepts

| Concept          | Is                                                                                  | In OpenTelemetry                                      |
| ---------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **Organisation** | the party the obligations fall on: a provider, a deployer, a controller, a bank     | the resource attribute `oce.organization.id`          |
| **Case**         | one compliance process, from an event to its close; it may last days or months      | the attribute `oce.case.id` on every span of the case |
| **Trigger**      | the event that opened the case, the subject it concerns, and when it became known   | a `trigger` span: one per case                        |
| **Obligation**   | one thing a law asks because of the event: its law and article, its action, its due | an `obligation` span: one per obligation              |
| **Action**       | one thing done towards an obligation: assessed, reviewed, notified, informed, fixed | an `action` span, naming its obligation               |

A **subject** is what the case is about: an AI system, a product, a service, a processing activity.
It is named on the trigger with `oce.subject.id`, and is how a materializer adds up the cases of one system ([Obligations and State](./state#the-state-of-a-subject)).

## From a case to its traces

A case lasts as long as its obligations, so it is never one trace.
A producer MAY put the trigger and the obligations assessed with it in one trace, the obligations as children of the trigger; every later action is a trace of its own.
What joins them is `oce.case.id`, never the trace.

```text
resource   oce.version = "0.1"   oce.organization.id = "northwind-hr"
│
├─ trace (assessment)
│   └─ trigger span ─────────────────────────────── serious_incident · cv-screening
│        ├─ obligation span   ai-act-26-5    AI Act 26(5)   inform
│        └─ obligation span   ai-act-73-2    AI Act 73(2)   notify   due 29 Dec
├─ trace   action span   inform     → ai-act-26-5
├─ trace   action span   notify     → ai-act-73-2
├─ trace   obligation span   ai-act-73-6   AI Act 73(6)   remediate          added later
├─ trace   action span   remediate  → ai-act-73-6
└─ trace   close span    closed
```

## Identity

| What            | Identified by                                    | Stable across                 |
| --------------- | ------------------------------------------------ | ----------------------------- |
| An organisation | `oce.organization.id`                            | every case                    |
| A case          | `oce.case.id`, a UUIDv7                          | the case only                 |
| A subject       | `oce.subject.id`, unique within its organisation | every case about it           |
| An obligation   | `oce.obligation.id`, unique within its case      | the case only                 |
| An action       | the trace id and span id of its span             | the record only               |
| A person        | `oce.actor.id`, a pseudonymous id                | every case the person acts in |

A case id SHOULD be a UUIDv7, so that cases sort by the time they opened.
An obligation id SHOULD read as its law and article, `ai-act-73-2`, so that a person reading a span knows it without its obligation record.
An actor id MUST NOT be a person's name or address: it is an id the organisation can resolve, and nobody else needs to ([Attributes](./attributes#value-rules)).
