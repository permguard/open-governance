# Span Kinds

Every OCL span says what it is with the attribute `ocl.span.kind`.
It is distinct from OpenTelemetry's own `SpanKind`, which describes a span's position in a network call; OCL spans SHOULD use `SpanKind.INTERNAL`.

<Diagram of="ocl/span-kinds" />

| `ocl.span.kind` | Is                                        | Time of the record                       |
| --------------- | ----------------------------------------- | ---------------------------------------- |
| `trigger`       | the event that opens a case               | when the organisation became aware of it |
| `obligation`    | one thing a law asks because of the event | when the obligation was assessed         |
| `action`        | one thing done towards an obligation      | when the action was completed            |
| `close`         | the end of the case, sent once            | when the case was closed                 |

Every OCL span MUST carry `ocl.span.kind` and `ocl.case.id`.
A span whose resource does not carry `ocl.version` is not an OCL span, whatever its attributes; a span whose resource carries the version of another specification too is refused.

## trigger

The event that opens the case.
Its start is when the event happened, as far as it is known; its end, the time of the record, is when the organisation became aware of it, the anchor most clocks count from ([Cases](./cases#the-clock-starts-at-the-anchor)).

A trigger span MUST carry `ocl.trigger.type` and `ocl.subject.id`, and SHOULD carry `ocl.subject.type`.
A case has one trigger; a trigger that is reclassified, a malfunction found to be a serious incident, is a new trigger record that `supersedes` the first.

## obligation

One thing a law asks because of the event.
An obligation span MUST carry `ocl.obligation.id`, `ocl.obligation.action`, `ocl.law.id` and `ocl.law.article`, and SHOULD carry `ocl.law.paragraph`, `ocl.law.version`, `ocl.party.role`, `ocl.obligation.anchor` and, where a deadline is set, `ocl.obligation.due`.
It MAY name who must see it done with `ocl.obligation.owner`.

`ocl.obligation.action` is the kind of action that meets the obligation: `notify` for a report to an authority, `review` for a human review, and so on below.
`ocl.obligation.quorum` says how many distinct actors must perform it; two for the separate verification Article 14(5) of the AI Act asks for.

An obligation that the law sets without a deadline, *without undue delay*, *immediately*, carries no `ocl.obligation.due`, and a producer MAY set one of its own policy, naming that policy in `ocl.obligation.due_basis`.
A due the organisation sets is always labelled so: it is a policy, never the law's.
An obligation whose deadline counts from another record, a final report one month after the incident notification, is emitted once that record exists, with the due it gives; until then it MAY be emitted without a due, naming its anchor, and it is `pending`.
An obligation whose due depends on a parameter the organisation defines names it in `ocl.obligation.parameter`, and its value in `ocl.obligation.parameter_value`; one whose parameter has no value is `pending` too ([Obligations and State](./state)).

## action

One thing done towards an obligation.
An action span MUST carry `ocl.action.kind`, and SHOULD carry `ocl.obligation.id`, the obligation it works towards.

| `ocl.action.kind` | The action                                                                     | Carries also                                                                |
| ----------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `assess`          | judges whether an obligation applies                                           | `ocl.action.result`: `applies`, `not_applicable`                            |
| `review`          | a person reviews an output, a decision or an identification                    | `ocl.action.result`, `ocl.actor.id`                                         |
| `notify`          | reports to an authority: a market surveillance authority, a CSIRT, a regulator | `ocl.action.recipient`, `ocl.action.reference`                              |
| `inform`          | tells a party: a provider, an affected person, the workers, the clients        | `ocl.action.recipient`                                                      |
| `remediate`       | corrects: suspends a system, retrains a model, patches a product               | `ocl.evidence.ref`                                                          |
| `record`          | keeps what the law asks to keep: a log, a documentation of the breach          | `ocl.evidence.ref`, `ocl.evidence.digest`                                   |
| `attest`          | a person with the authority to do so signs off: an approval, an accepted risk  | `ocl.actor.id`, optionally `ocl.action.result`: `attested`, `risk_accepted` |
| `escalate`        | hands the matter to someone with more authority, or more resources             | `ocl.action.recipient`                                                      |
| `determine`       | judges one determination statement of a control assessment                     | `ocl.assessment.finding`, `ocl.control.objective`                           |

A `review` MUST carry `ocl.action.result` and `ocl.actor.id`:

| `ocl.action.result` | The person                                                       |
| ------------------- | ---------------------------------------------------------------- |
| `confirmed`         | agreed with what was reviewed                                    |
| `overridden`        | replaced it with a decision of their own                         |
| `rejected`          | refused it, without a decision of their own                      |
| `escalated`         | handed it to someone with more authority; it counts as no review |

A review SHOULD link to the record it reviewed, the decision or the identification, with `ogs.link.relation = ocl.reviews`.

A `determine` records a finding, `satisfied` or `other_than_satisfied`, with its basis and its method.
The finding is data, not the obligation's state: the obligation to assess is met by assessing on time, whatever was found, and a finding other than satisfied opens a `weakness_identified` case of its own ([Cases](./cases#what-opens-a-case)).
A risk accepted is an `attest` with `risk_accepted`, by the person with the authority to accept it; it never makes an obligation not applicable.

The action span's status is whether the action succeeded: a report the authority's platform refused is `ERROR`, with the reason as the status message, and meets nothing.
An action SHOULD link with `evidence` to the records it rests on, and SHOULD name what proves it with `ocl.evidence.ref` and `ocl.evidence.digest`.

## close

The end of the case, sent once.
A close span MUST carry `ocl.case.state`: `closed`, or `withdrawn` when the event turned out not to engage the law.
Spans of the case that arrive after it are kept, and do not reopen it.
