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

A resource follows one specification.
A receiver MUST refuse the spans of a resource that carries the version attributes of two specifications, and count them as refused: a record never follows two contracts at once.

## Two identities

A record has two identities, and they answer different questions.

| Identity        | Is                                                       | Answers                              |
| --------------- | -------------------------------------------------------- | ------------------------------------ |
| Of the delivery | the trace id and span id                                 | is this the same record, sent again? |
| Of the subject  | the keys the specification defines, such as a control id | what is this record about?           |

The identity of the delivery is unique across specifications.
The same trace id and span id sent again with other content are not a new record: they are a **conflict**, kept, shown, and never resolved by which arrived last ([Materialization](./materialization#not-last-wins)).

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

## Business transactions

A case groups one compliance process, a batch what a pipeline read, a decision one request.
A business follows something else end to end: a loan application, a payment, an agent's task.
Records of several specifications about it are joined by a key they share, the transaction id.

| Attribute              | Type     | Level    | Meaning                                                                                            |
| ---------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------- |
| `ogs.transaction.id`   | String   | Optional | the business transaction a record is about: an opaque id, derived with a key of the organisation's |
| `ogs.transaction.type` | String   | Optional | what kind of transaction, in `snake_case`: `loan_application`, `payment`, `agent_task`             |
| `ogs.transaction.ids`  | String[] | Optional | for a record about many transactions, only on a record that writes findings: at most 1 000         |

| Rule              | Meaning                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personal data     | for the organisation that issues it, a transaction id is personal data ([Privacy](./privacy#pseudonymous-ids-are-personal-data))                          |
| Derived           | a keyed one-way derivation of the business reference, HMAC with a key the organisation holds; never the reference, an account, an IBAN, a customer number |
| Only where needed | set only where records of several systems must be joined                                                                                                  |
| Not shared        | two organisations never share an id value: there is no join across organisations                                                                          |
| Navigation only   | the evidence chain stays the links; a transaction id is for finding the records, never proof of how they relate                                           |

The type and the id are the key together: the same id under two types names two transactions.
A list cut at its cap of 1 000 MUST keep the count of what it names elsewhere, as the specification of the record says, and a materializer marks the transactions it touches as possibly incomplete.

## Limits

OpenTelemetry SDKs cap what a span holds: by default, 128 attributes, 128 events and 128 links.
A specification MUST keep its records within these defaults, and MUST cap any list it defines, as Open Decision Lineage caps its id lists at 1 000.
What does not fit is named by reference, never truncated silently ([Privacy](./privacy)).
