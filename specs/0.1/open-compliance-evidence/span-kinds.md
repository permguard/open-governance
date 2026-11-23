# Span Kinds

Every OCE span says what it is with the attribute `oce.span.kind`.
It is distinct from OpenTelemetry's own `SpanKind`, which describes a span's position in a network call; OCE spans SHOULD use `SpanKind.INTERNAL`.

<Diagram of="oce/span-kinds" />

| `oce.span.kind` | Is                                        | Time of the record                       |
| --------------- | ----------------------------------------- | ---------------------------------------- |
| `trigger`       | the event that opens a case               | when the organisation became aware of it |
| `obligation`    | one thing a law asks because of the event | when the obligation was assessed         |
| `action`        | one thing done towards an obligation      | when the action was completed            |
| `close`         | the end of the case, sent once            | when the case was closed                 |

Every OCE span MUST carry `oce.span.kind` and `oce.case.id`.
A span whose resource does not carry `oce.version` is not an OCE span, whatever its attributes.

## trigger

The event that opens the case.
Its start is when the event happened, as far as it is known; its end, the time of the record, is when the organisation became aware of it ([Cases](./cases#time-starts-at-awareness)).

A trigger span MUST carry `oce.trigger.type` and `oce.subject.id`, and SHOULD carry `oce.subject.type`.
A case has one trigger; a trigger that is reclassified, a malfunction found to be a serious incident, is a new trigger record that `supersedes` the first.

## obligation

One thing a law asks because of the event.
An obligation span MUST carry `oce.obligation.id`, `oce.obligation.action`, `oce.law.id` and `oce.law.article`, and SHOULD carry `oce.law.paragraph`, `oce.law.version`, `oce.party.role` and, where the law sets one, `oce.obligation.due`.

`oce.obligation.action` is the kind of action that meets the obligation: `notify` for a report to an authority, `review` for a human review, and so on below.
`oce.obligation.quorum` says how many distinct actors must perform it; two for the separate verification Article 14(5) of the AI Act asks for.

An obligation that the law sets without a deadline, *without undue delay*, *immediately*, carries no `oce.obligation.due`, and a producer MAY set one of its own policy.
An obligation whose deadline counts from another record, a final report one month after the incident notification, is emitted once that record exists, with the due it gives.

## action

One thing done towards an obligation.
An action span MUST carry `oce.action.kind`, and SHOULD carry `oce.obligation.id`, the obligation it works towards.

| `oce.action.kind` | The action                                                                     | Carries also                                     |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| `assess`          | judges whether an obligation applies                                           | `oce.action.result`: `applies`, `not_applicable` |
| `review`          | a person reviews an output, a decision or an identification                    | `oce.action.result`, `oce.actor.id`              |
| `notify`          | reports to an authority: a market surveillance authority, a CSIRT, a regulator | `oce.action.recipient`, `oce.action.reference`   |
| `inform`          | tells a party: a provider, an affected person, the workers, the clients        | `oce.action.recipient`                           |
| `remediate`       | corrects: suspends a system, retrains a model, patches a product               | `oce.evidence.ref`                               |
| `record`          | keeps what the law asks to keep: a log, a documentation of the breach          | `oce.evidence.ref`, `oce.evidence.digest`        |

A `review` MUST carry `oce.action.result` and `oce.actor.id`:

| `oce.action.result` | The person                                                       |
| ------------------- | ---------------------------------------------------------------- |
| `confirmed`         | agreed with what was reviewed                                    |
| `overridden`        | replaced it with a decision of their own                         |
| `rejected`          | refused it, without a decision of their own                      |
| `escalated`         | handed it to someone with more authority; it counts as no review |

A review SHOULD link to the record it reviewed, the decision or the identification, with `ogs.link.relation = oce.reviews`.

The action span's status is whether the action succeeded: a report the authority's platform refused is `ERROR`, with the reason as the status message, and meets nothing.
An action SHOULD link with `evidence` to the records it rests on, and SHOULD name what proves it with `oce.evidence.ref` and `oce.evidence.digest`.

## close

The end of the case, sent once.
A close span MUST carry `oce.case.state`: `closed`, or `withdrawn` when the event turned out not to engage the law.
Spans of the case that arrive after it are kept, and do not reopen it.
