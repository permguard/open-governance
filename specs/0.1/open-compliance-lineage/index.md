# Open Compliance Lineage

Open Compliance Lineage (OCL) is a semantic convention for OpenTelemetry traces.
It records what happens when an event engages the law: the event itself, the obligations it opens, article by article, and every action taken to meet them, from the moment the organisation became aware to the moment the case is closed.
From these records alone, anyone receiving them can rebuild each case, see which obligations were performed by their due, after it, or are overdue, and add them up by law and by article.

| Status | Version | Namespace | Signal               |
| ------ | ------- | --------- | -------------------- |
| Draft  | 0.1     | `ocl.*`   | OpenTelemetry Traces |

<Diagram of="ocl/overview" />

## The picture

A recruitment AI turns out to have filtered out candidates by a criterion it should never have used.
A remote identification system reports a match that no officer may act upon until two people have checked it.
A customer contests a credit decision taken by a model.
A breach exposes the patient records an emergency triage system works on.

Each is an **event that engages the law**, and each starts the same kind of process:

1. Somebody becomes **aware** of the event, and the clocks of the law start running.
2. The event is **assessed**: which laws apply, which articles, which obligations, by when.
3. Each obligation is **met** by an action: a report to an authority, a person informed, a human review, a correction, a record kept.
4. When nothing is left to do, the **case** is closed.

OCL gives that process one shape, whatever the law.
The AI Act, the GDPR, NIS2, DORA and the Cyber Resilience Act each ask for different things, but in the same form: because of this event, this party must do this, by then.
OCL records exactly that, and nothing else:

| Record         | Says                                                                   | For example                                                         |
| -------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Trigger**    | what happened, to which system, and when the organisation became aware | a serious incident of the CV screening system                       |
| **Obligation** | what the law asks because of it: law, article, action, deadline        | AI Act, Article 73(2): report to the authority within 15 days       |
| **Action**     | what was done towards an obligation, by whom, with what evidence       | the report, submitted to the market surveillance authority on day 7 |
| **Close**      | that the case is over                                                  | closed, or withdrawn because the event was not what it seemed       |

All four travel as standard OpenTelemetry spans, sent by any OpenTelemetry SDK to any OTLP endpoint.
OCL only gives meaning to their `ocl.*` attributes.

## What it answers

- Which obligations does this incident engage, and where does each stand against its due?
- Which reports are due this week, and which are already late?
- How many AI Act Article 73 reports did we make this year, and how many by their due?
- Did two people verify this identification before anyone acted on it, and who?
- What did we do about this contested decision, and when did we tell the person?

OCL answers them from the spans alone, without access to the systems that emitted them.

## Principles

| Principle              | Meaning                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| One process            | every law is read the same way: an event engages obligations, and actions meet them                           |
| Cited, not interpreted | an obligation names its law or standard, article, paragraph and point; OCL never encodes what the text means  |
| The producer decides   | which obligations an event engages is the organisation's assessment, recorded as such, never this spec's      |
| Deadlines are data     | an obligation carries its due time and what it counts from; met, late and overdue are derived, never reported |
| Humans are recorded    | a human review is an action like any other, with its actor and its result, and may need more than one actor   |
| Evidence by reference  | an action names what proves it, by URI and digest; it never carries it                                        |
| Unknown is a state     | an event nobody assessed is unassessed, never fine; an obligation nobody met is open, then overdue            |

## Reading this specification

The pages go from the whole to the detail: the case first, then how it maps onto traces, then every attribute, then what a materializer derives.

| Page                             | What it holds                                                                    |
| -------------------------------- | -------------------------------------------------------------------------------- |
| [Cases](./cases)                 | The process from an event to its close, and what opens and links a case          |
| [Data Model](./data-model)       | Organisations, cases, triggers, obligations and actions, as spans                |
| [Span Kinds](./span-kinds)       | The four kinds of OCL span, and what each carries                                |
| [Attributes](./attributes)       | Every attribute, its type and its requirement level                              |
| [Legal References](./laws)       | How an obligation cites its law or standard, and the obligations of five EU laws |
| [Schema](./schema)               | The JSON Schema of a record, to validate what a producer emits                   |
| [Obligations and State](./state) | How the state of an obligation, a case and a system is derived                   |
| [Receivers](./receivers)         | What a receiver must accept, refuse and derive                                   |
| [AI Act Examples](./examples)    | Four cases under the AI Act, span by span                                        |
| [Field Guide](./field-guide)     | A producer in every major language                                               |

## Conformance

The keywords "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this specification are to be interpreted as described in BCP 14 ([RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174)) when, and only when, they appear in all capitals.

A **producer** is a system, or its instrumentation, that emits OCL spans: a case management tool, a GRC platform, an incident response runbook, the AI system itself.
A **receiver** accepts OTLP traces and keeps OCL spans; a **materializer** derives cases, obligation states and registers from them.
A producer is conformant when every span it marks as OCL satisfies [Span Kinds](./span-kinds) and [Attributes](./attributes); a receiver when it satisfies [Receivers](./receivers); a materializer when it derives state as [Obligations and State](./state) says.

::: warning Draft
Open Compliance Lineage is a draft, version 0.1: its attributes may still change, and it is not legal advice.
It records how an organisation reads and meets its obligations; whether that reading is right is for the organisation, its counsel and its authorities.
What a materializer derives from it is not an audit, and not a certification, conformity assessment or attestation of compliance with any law.
:::

## Relation to other specifications

OCL is a specification of [Span-Native Governance](/specs/0.1/span-native-governance/): its records are spans, a case and its obligations are materialised from them, and what no record establishes is unknown.

A trigger often comes from another specification's record.
An [Open Decision Lineage](/specs/0.1/open-decision-lineage/) pipeline that detects an anomaly, or the authorization decision a person contests, is linked from the trigger with `caused_by`, so a case can be followed back to the decision it is about ([Cases](./cases#what-opens-a-case)).

Open Human Oversight, planned, will record every point where a person is in the loop of an automated system.
OCL records a human review only where the law asks for one, as the action that meets that obligation.
