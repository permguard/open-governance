# Cases

A case is one compliance process, from the event that started it to the moment nothing is left to do.
This page is about its shape, before any attribute: what opens a case, what happens inside it, and how it ends.

<Diagram of="oce/cases" />

## From an event to its close

| Stage    | What happens                                                                             | Recorded as                                         |
| -------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Aware    | the organisation learns of an event that may engage the law                              | a `trigger` span, ending at the moment of awareness |
| Assessed | the event is read against the law: which obligations, whose, by when                     | one `obligation` span per obligation                |
| Acted    | each obligation is worked on: assessed, reviewed, reported, informed, fixed              | `action` spans naming their obligation              |
| Closed   | every obligation is performed, assessed not applicable, or left unmet, and the case ends | one `close` span                                    |

A case lasts as long as its obligations do: two days for a widespread AI Act infringement, a month for a NIS2 final report, longer for an investigation.
It is never one trace, since a trace that never ends is never received.
Every span of the case carries `oce.case.id` instead, and the case is the set of spans that carry it, whatever their traces.

## The clock starts at the anchor

Most deadlines count from the moment the organisation **became aware** of the event, not from the moment it happened.
The trigger span records both:

| Part of the trigger span | Is                                                                   |
| ------------------------ | -------------------------------------------------------------------- |
| start                    | when the event happened, as far as it is known; the end when unknown |
| end                      | when the organisation became aware of it: the time of the record     |

A producer MUST set the end from the moment of awareness, never from the moment the span is emitted.

Not every clock starts there.
A law counts some deadlines from another moment: a classification, the receipt of a request, the submission of an earlier report, a corrective measure being available.
Each obligation names the moment its due counts from in `oce.obligation.anchor`; absent, it is awareness.

| `oce.obligation.anchor` | The due counts from                                               | For example                                                                         |
| ----------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `awareness`             | the end of the trigger                                            | GDPR 33(1), NIS2 23(4)(a) and (b), CRA 14(2)(a) and (b)                             |
| `classification`        | the classification of the event, an `assess` action               | DORA's initial notification: four hours from classification as major                |
| `receipt`               | the receipt of a request or a report                              | GDPR 12(3), one month from the receipt of the request                               |
| `request`               | a request of an authority                                         | NIS2 23(4)(c), CRA 14(6)                                                            |
| `previous`              | the submission of an earlier report, or the previous performance  | NIS2 23(4)(d), CRA 14(4)(c), DORA's intermediate and final reports, a yearly review |
| `release`               | a corrective or mitigating measure, or an update, being available | CRA 14(2)(c), SP 800-171 03.14.01.b                                                 |
| `termination`           | the end of an employment or a contract                            | SP 800-171 03.09.02.a                                                               |
| `scheduled_start`       | the start of a period the organisation's calendar sets            | a control assessment, a policy review                                               |

The list is open: a producer MAY use another value in `snake_case`.
An obligation whose anchor has not happened yet MAY be emitted without a due, naming its anchor: it is `pending` until a record that supersedes it carries the due ([Obligations and State](./state)).
Where a law gives two limits, *four hours from classification and no later than 24 hours from awareness*, the due is the earlier of the two, and `oce.obligation.due_basis` names the text that sets it.

## What opens a case

A case is opened by any event the organisation judges may engage the law.
The judgement is the producer's: OCE gives it the words, not the criteria.

| `oce.trigger.type`        | The event                                                                 | Typically engages                    |
| ------------------------- | ------------------------------------------------------------------------- | ------------------------------------ |
| `serious_incident`        | an AI system's incident that led to harm, as Article 3(49) AI Act says    | AI Act 26(5), 73                     |
| `identification_match`    | a remote biometric identification system reports a match                  | AI Act 14(5)                         |
| `contested_decision`      | a person contests a decision taken with an AI system or automatically     | GDPR 22(3), AI Act 86                |
| `personal_data_breach`    | a breach of security affecting personal data                              | GDPR 33, 34                          |
| `significant_incident`    | an incident with a significant impact on an essential or important entity | NIS2 23                              |
| `major_ict_incident`      | a major ICT-related incident of a financial entity                        | DORA 19                              |
| `exploited_vulnerability` | an actively exploited vulnerability in a product with digital elements    | CRA 14(1)                            |
| `severe_incident`         | a severe incident affecting the security of such a product                | CRA 14(3)                            |
| `risk_identified`         | a risk to health, safety or fundamental rights found in use               | AI Act 20(2), 26(5)                  |
| `authority_request`       | an authority asks for a report, information or a correction               | NIS2 23(4)(c), CRA 14(6), GDPR 58(1) |
| `adverse_event`           | an event a detection raised, not yet declared an incident                 | NIST CSF DE.AE-08                    |
| `control_assessment`      | an assessment of controls the organisation's plan calls for               | SP 800-53 CA-2                       |
| `weakness_identified`     | a finding other than satisfied, to be remediated                          | SP 800-53 CA-5                       |
| `significant_change`      | a change that calls for an assessment again                               | AI Act 27(2), GDPR 35(11), DORA 8(3) |
| `scheduled_review`        | a review the organisation's own calendar calls for                        | an organisation's rule, a standard   |

The list is open: a producer MAY use any other value in `snake_case`, and receivers show it as it is.

A `scheduled_review` trigger MUST be emitted by the calendar at the scheduled start, not when someone begins the work: a review nobody did then shows as overdue, instead of leaving no record at all.

A trigger that comes from another governance record says so with a link:

| The trigger was raised by                                              | It links to                      | With `ogs.link.relation` |
| ---------------------------------------------------------------------- | -------------------------------- | ------------------------ |
| an [ODL](/specs/0.1/open-decision-lineage/) pipeline's detection       | the `step` span that detected it | `caused_by`              |
| an authorization decision a person contests                            | the decision's record            | `caused_by`              |
| another organisation's action, such as a deployer informing a provider | that `action` span               | `caused_by`              |
| a control assessment that found a weakness                             | the `determine` action           | `caused_by`              |

The last row is how a case crosses organisations: the deployer's case and the provider's are two cases, each with its own obligations, joined by a link.

## What happens inside

Once assessed, a case holds obligations, and each obligation is met by actions.
The shape is always the same; only the law and the actions change.

```text
case 019a…c001                                  oce.case.id on every span
│
├─ trigger      serious_incident  cv-screening   aware 14 Dec 09:30
│   ├─ obligation  ai-act-26-5   AI Act 26(5)   inform the provider   immediately
│   └─ obligation  ai-act-73-2   AI Act 73(2)   notify the authority  due 29 Dec 09:30
├─ action   inform     ai-act-26-5   recipient provider                    14 Dec 10:05
├─ action   notify     ai-act-73-2   recipient market_surveillance_authority 21 Dec 15:00
├─ obligation  ai-act-73-6   AI Act 73(6)   investigate and correct           added 21 Dec
├─ action   remediate  ai-act-73-6   the criterion removed, model retrained  9 Jan
└─ close    closed                                                         20 Jan
```

An obligation may be added at any moment, as the case reveals more: a final report whose deadline counts from an earlier report, an obligation of a second law found later.
An obligation whose deadline changes, because the incident turned out graver or a request was extended, is a new obligation record that `supersedes` the old one; the old due stays in the case's history, and a due moved after it passed is shown as such ([Obligations and State](./state#changes-after-the-fact)).

## How a case ends

A case ends with its `close` span, sent once:

| `oce.case.state` | The case                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `closed`         | is over: whatever was not met by now stays unmet in its history                                  |
| `withdrawn`      | was opened by an event that turned out not to engage the law; its obligations are not applicable |

A case that never receives its close span stays open, and its obligations go overdue as their deadlines pass ([Obligations and State](./state)).
Nothing closes a case by itself.
