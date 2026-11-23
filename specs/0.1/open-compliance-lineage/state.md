# Obligations and State

Nobody reports that an obligation was met by its due, that a case is overdue, or that a system has no findings.
A materializer derives it from the records, as [Span-Native Governance](/specs/0.1/span-native-governance/materialization) says, and this page fixes how, so that two materializers show the same records the same way.

<Diagram of="ocl/state" />

## The rules

A state is a function of three things: the records, the present time and the authority the view is derived with.
Nothing else changes it, and never the order in which the records arrived.

| Rule                | Meaning                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A function          | a view is a function of the records, the present time and the authority: nothing else, never the order of arrival                                                              |
| Event time          | a record's time is its end; ties go by trace id, then span id                                                                                                                  |
| Not from the future | a record whose time is after now is shown, flagged, and does not count                                                                                                         |
| Authority           | a record from a producer without authority over the organisation is shown, flagged, and does not count ([Authority](#authority))                                               |
| Current records     | a `supersedes` link takes effect within one case, between records of the same kind, from an authoritative producer, to an earlier record; any other is an anomaly, shown       |
| Conflict            | two current records that disagree, two obligations of one id, two closes of different states, `applies` beside `not_applicable`: the state is `conflict`, never one of the two |
| Before the close    | an action counts only if its time is at or before the close; one after is shown and counts for nothing                                                                         |
| Quorum              | distinct, non-empty actor ids; with a quorum of 1, an action without an actor counts                                                                                           |
| Orphans             | an action naming an obligation its case does not have is shown, and counts for nothing; a case with no trigger is `untriggered`                                                |
| History             | a superseded obligation stays in the case's history: a changed due is shown as changed, with when and by whom                                                                  |

The same trace id and span id received twice with different content are a conflict too: the records they name are in conflict, and so is their case when they are its trigger or its close.

## A materializer knows no law

Everything a materializer shows of a law, a standard or an event comes from the records and from the [catalog](./catalog) they point to, never from a table of its own: OCL is the same for a law of the European Union, of India, of the United States, or for an organisation's own rule.
The producer maps its laws to the contract; the materializer reads the contract.
In the table, each value comes from the record first, then from the catalog, then as said.

| What it shows                   | From                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| the name of a law               | `ocl.law.name`; the id when absent                                                                   |
| how a reference is cited        | `ocl.law.citation`; article, paragraph and point as sent when absent                                 |
| whether a provision applies yet | `ocl.law.applies_from`: before it, the obligation is readiness, its state derived as any other's     |
| the name of an event            | `ocl.trigger.name`; the type when absent                                                             |
| a due                           | `ocl.obligation.due`, as the producer computed it from the law or from its own rule                  |
| a law, a standard or a rule     | the namespace of `ocl.law.id`: `std:` a standard, `org:` the organisation's rule, any other id a law |

A law shows as readiness while every one of its obligations in the view applies only later.

## The state of an obligation

An action **counts** towards an obligation when all of these hold:

- it is an `action` span of the same case, naming the obligation in `ocl.obligation.id`;
- its `ocl.action.kind` is the obligation's `ocl.obligation.action`;
- its status is not `ERROR`;
- for a `review`, its result is not `escalated`;
- it is current, not from the future, at or before the case's close, and from a producer with authority.

The obligation is **performed** once the actions that count come from as many distinct `ocl.actor.id` as its quorum, 1 when absent.
The time it was performed is the time of the action that completed the quorum.

An `assess` action naming the obligation, whatever the obligation's own action, says whether it applies; the same conditions decide whether it counts.

The states, checked in this order, the first that holds:

| State            | When                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `conflict`       | its records, or its case's, disagree                                                                                          |
| `not_applicable` | an `assess` that counts says `not_applicable`, or its case was withdrawn                                                      |
| `met`            | performed at or before its due                                                                                                |
| `late`           | performed after its due                                                                                                       |
| `performed`      | performed, and it has no due: the time since its anchor is shown beside it                                                    |
| `unmet`          | not performed, and its case closed                                                                                            |
| `overdue`        | not performed, and its due has passed                                                                                         |
| `pending`        | not performed, no due, and waiting for what its due counts from: an anchor other than awareness, or a parameter with no value |
| `open`           | not performed, before its due or with none                                                                                    |

An obligation assessed not applicable is `not_applicable` even if an action was taken on it.
`overdue`, `pending` and `open` depend on the present time, the only thing besides the records and the authority a view may depend on.

On screen the states read as what they mean: *performed by the due*, *performed after the due*, *performed, no deadline*, *assessed not applicable*, *waiting for its anchor*.
A state never reads as a verdict: never *compliant*, *on time* as praise, *clear* or *passed*.

An obligation that `supersedes` another replaces it: the older one, its due and its state leave the case, and the actions that named it count towards the newer one when they name the same `ocl.obligation.id`.

## A finding is not a state

A `determine` action records what a control assessment found, `satisfied` or `other_than_satisfied`.
The obligation it meets is the obligation to assess: `met` when the assessment was done by its due, whatever it found.

| Records                                                  | Shown                                                                      |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| a finding `satisfied`, before the next assessment is due | satisfied, current                                                         |
| a finding past the due of the next assessment            | unknown: never satisfied by default                                        |
| a finding `other_than_satisfied`                         | the weakness, with its basis, and the `weakness_identified` case it opened |
| an `attest` with `risk_accepted`                         | the risk accepted, by whom; the finding stays other than satisfied         |

## The state of a case

| State         | When                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| `conflict`    | its triggers name different events or subjects, or its closes disagree |
| `withdrawn`   | its close span says `withdrawn`                                        |
| `closed`      | its close span says `closed`                                           |
| `untriggered` | it has records, and no trigger                                         |
| `unassessed`  | a trigger arrived, and no obligation and no close                      |
| `overdue`     | at least one of its obligations is `overdue`                           |
| `open`        | none of its obligations is `overdue`                                   |

`unassessed` is the case's unknown: an event engaged something, and nobody has said what.
A materializer MUST show it as its own state, with how long it has been so, never as `open` with nothing to do.

A closed case keeps its findings: the obligations that were `late` or `unmet` stay so in its history, and are what an auditor looks at first.

## The state of a subject

The cases of a subject, an AI system, a product, are added up by `ocl.subject.id` within its organisation:

| State         | When                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| `unknown`     | no trigger names the subject                                                 |
| `attention`   | a case of the subject is `overdue`, `unassessed` or in `conflict`            |
| `active`      | a case of the subject is `open`, and none needs attention                    |
| `no_findings` | every case of the subject is `closed` or `withdrawn`, and none has findings  |
| `findings`    | every case is closed, and an obligation of one of them was `late` or `unmet` |

`unknown` is not `no_findings`: a system no record mentions is a system nobody has reported on.
`no_findings` says only that no finding was recorded, never that the system meets its obligations.

## Authority

A record from a producer without authority over the organisation is kept and shown, and does not count.
Which producers have authority over an organisation is the materializer's configuration, by `ocl.organization.id` and `service.name`, and a materializer MUST say, on every view, which configuration the view was derived with, how many records it read, and as of when.

A deployer that informs its provider does it in its own case, under its own organisation; the provider's case is the provider's, opened by a trigger that links to the deployer's action ([Cases](./cases#what-opens-a-case)).
One organisation never records actions in another's case.

## Changes after the fact

Some records are legitimate one by one and telling together.
A materializer MUST count them beside the figures, never hide them:

| Shown                       | When                                                                       |
| --------------------------- | -------------------------------------------------------------------------- |
| a due moved after it passed | an obligation superseded after its due, by one with another due            |
| a waiver after the due      | an `assess` with `not_applicable` whose time is after the obligation's due |
| a withdrawal after a due    | a case withdrawn after the due of one of its obligations not performed     |

## Views

| View                | Groups                                          | Shows                                                                                                                      |
| ------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Case                | one `ocl.case.id`                               | the timeline from awareness to close: each obligation, its due, the actions that counted, and those that did not, with why |
| Due                 | every obligation `open`, `pending` or `overdue` | what is due next, across cases, what is waiting for its anchor, and what is already late                                   |
| Obligation register | `ocl.law.id`, `ocl.law.article`, `.paragraph`   | per article: how many in each state; the median time from the anchor to performed                                          |
| Subject             | `ocl.subject.id`                                | its state, its cases, its findings                                                                                         |
| Human review        | obligations whose action is `review`            | the quorum reached, the reviewers by id, the outcomes, and the overrides                                                   |
| Posture             | the organisation                                | the running clocks, the counts that need someone, the register by law, the changes after the fact                          |

The obligation register is where obligations add up across cases: *AI Act 73(2), this year: 6 performed by the due, 1 after the due, 0 overdue, median 9 days*.
It groups by the reference in parts, so the same register answers for a law, an article or a single paragraph, and it counts laws, standards and the organisation's own rules apart ([Legal References](./laws#law-ids)).

A posture leads with counts and clocks, never with a score.
Where a ratio is shown, it is *performed by the recorded due, n of N*, over the obligations whose due has passed, per law; with none, it is not shown.
The obligations that depend on the present, `open`, `pending`, `overdue`, show whatever the range; the others follow the range by their due.

Every value a view shows leads back to its records: the state of an obligation to its obligation record and to the actions that counted, a late report to the report itself, by its `ocl.evidence.ref`.

::: info Notice
These figures are derived from records the organisation supplied.
They show what was recorded, against deadlines the organisation entered.
They are not legal advice, not an audit, and not a certification, conformity assessment or attestation of compliance with any law.
Whether an obligation applies, its deadline and its fulfilment are for the organisation, its counsel and the competent authorities.
:::
