# Obligations and State

Nobody reports that an obligation was met on time, that a case is overdue, or that a system is clear.
A materializer derives it from the records, as [Span-Native Governance](/specs/0.1/span-native-governance/materialization) says, and this page fixes how, so that two materializers show the same compliance the same way.

<Diagram of="oce/state" />

## The state of an obligation

An action **counts** towards an obligation when all of these hold:

- it is an `action` span of the same case, naming the obligation in `oce.obligation.id`;
- its `oce.action.kind` is the obligation's `oce.obligation.action`;
- its status is not `ERROR`;
- for a `review`, its result is not `escalated`;
- it comes from a producer with authority over the organisation ([Authority](#authority)).

The obligation is **performed** once the actions that count come from as many distinct `oce.actor.id` as its quorum, 1 when absent; with a quorum of 1, an action without an actor counts.
The time it was performed is the time of the action that completed the quorum.

| State     | When                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| `waived`  | an `assess` action naming it says `not_applicable`, or its case was withdrawn            |
| `met`     | it was performed, at or before its due, or it has no due                                 |
| `late`    | it was performed after its due                                                           |
| `overdue` | it was not performed, its case is not closed, and its due has passed                     |
| `open`    | it was not performed, its case is not closed, and its due has not passed, or it has none |
| `unmet`   | it was not performed, and its case was closed                                            |

The states are checked in this order: an obligation assessed not applicable is waived, even if an action was taken on it.
`overdue` and `open` depend on the present time, the only thing besides the records a view may depend on.

An obligation that `supersedes` another replaces it: the older one, its due and its state leave the case, and the actions that named it count towards the newer one when they name the same `oce.obligation.id`.

## The state of a case

| State        | When                                                 |
| ------------ | ---------------------------------------------------- |
| `unassessed` | a trigger arrived, and no obligation and no close    |
| `withdrawn`  | its close span says `withdrawn`                      |
| `closed`     | its close span says `closed`                         |
| `overdue`    | not closed, and at least one obligation is `overdue` |
| `open`       | not closed, and none of its obligations is `overdue` |

`unassessed` is the case's unknown: an event engaged something, and nobody has said what.
A materializer MUST show it as its own state, never as `open` with nothing to do.

A closed case keeps its findings: the obligations that were `late` or `unmet` stay so in its history, and are what an auditor looks at first.

## The state of a subject

The cases of a subject, an AI system, a product, are added up by `oce.subject.id` within its organisation:

| State       | When                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| `unknown`   | no trigger names the subject                                                 |
| `attention` | a case of the subject is `overdue` or `unassessed`                           |
| `active`    | a case of the subject is `open`, and none needs attention                    |
| `clear`     | every case of the subject is `closed` or `withdrawn`, and none has findings  |
| `findings`  | every case is closed, and an obligation of one of them was `late` or `unmet` |

`unknown` is not `clear`: a system no record mentions is a system nobody has reported on.

## Authority

A record from a producer without authority over the organisation is kept and shown, and does not count.
Which producers have authority over an organisation is the materializer's configuration, by `oce.organization.id` and `service.name`, and a materializer MUST say which configuration a view was derived with.

A deployer that informs its provider does it in its own case, under its own organisation; the provider's case is the provider's, opened by a trigger that links to the deployer's action ([Cases](./cases#what-opens-a-case)).
One organisation never records actions in another's case.

## Views

| View                | Groups                                        | Shows                                                                                   |
| ------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Case                | one `oce.case.id`                             | the timeline from awareness to close: each obligation, its due, the actions that met it |
| Due                 | every obligation `open` or `overdue`          | what is due next, across cases, and what is already late                                |
| Obligation register | `oce.law.id`, `oce.law.article`, `.paragraph` | per article: how many met, late, waived, open, overdue and unmet; the time to meet      |
| Subject             | `oce.subject.id`                              | its state, its cases, its findings                                                      |
| Human review        | obligations whose action is `review`          | the quorum reached, the reviewers by id, the outcomes, and the overrides                |

The obligation register is where obligations add up across cases: *AI Act 73(2), this year: 6 met, 1 late, 0 overdue, median 9 days*.
It groups by the reference in parts, so the same register answers for a law, an article or a single paragraph.

Every value a view shows leads back to its records: the state of an obligation to its obligation record and to the actions that counted, a late report to the report itself, by its `oce.evidence.ref`.
