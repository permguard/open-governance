# Records

A governance record is one OpenTelemetry span that a specification gives meaning to.
This page fixes what every record has, whatever its specification.

<Diagram of="sng/records" />

## A record is a span

| Part of the span   | In a governance record                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Resource           | who emitted it, and the specification it follows, with `<spec>.version`                        |
| Trace id + span id | the identity of the record: the same pair is the same record, however often it is sent         |
| Start and end      | when the operation ran; for a fact, both are the moment it became true                         |
| Status             | the outcome where the specification uses it: `ERROR` for a failure, with the reason as message |
| Attributes         | the specification's own, under its prefix: what the record is about, and what it says          |
| Links              | the other records it relates to, with `ogs.link.relation`                                      |
| Events             | details inside the record's duration; never a record of their own                              |

A span is a governance record when its resource carries the version attribute of a specification, such as `odl.version`.
A receiver MUST NOT treat a span as a record of a specification from its span attributes alone.

## Two identities

A record has two identities, and they answer different questions.

| Identity        | Is                                                       | Answers                              |
| --------------- | -------------------------------------------------------- | ------------------------------------ |
| Of the delivery | the trace id and span id                                 | is this the same record, sent again? |
| Of the subject  | the keys the specification defines, such as a control id | what is this record about?           |

A trace id says which execution a record came from; it is not the identity of a decision, a control or a risk, whose life spans many executions.
Each specification MUST define the keys of its subjects as attributes, stable across executions and across producers.

## Time

The time of a record is its end: the moment the operation ended, or the fact became true.
Producers MUST set it from their own clock at the moment of the fact, not when the record is exported.
Materializers order records by this time, never by when they arrived ([Materialization](./materialization)).

## Links

A record that relates to another record, in the same trace or not, says so with an OpenTelemetry span link.
The link's attribute `ogs.link.relation` names the relation:

| `ogs.link.relation` | The linking record                                                       |
| ------------------- | ------------------------------------------------------------------------ |
| `supersedes`        | replaces the linked record: a correction, a revision, a newer assessment |
| `evidence`          | rests on the linked record as its proof                                  |
| `approves`          | approves, or with an `ERROR` status rejects, what the linked record asks |
| `caused_by`         | was triggered by the linked record                                       |

A specification MAY define further relations, under its own prefix.
A link without `ogs.link.relation` is an ordinary OpenTelemetry link, and carries no governance meaning.

## Limits

OpenTelemetry SDKs cap what a span holds: by default, 128 attributes, 128 events and 128 links.
A specification MUST keep its records within these defaults, and MUST cap any list it defines, as Open Decision Lineage caps its id lists at 1 000.
What does not fit is named by reference, never truncated silently ([Privacy](./privacy)).
