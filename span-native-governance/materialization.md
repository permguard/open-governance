# Materialization

A view is what a materializer derives from the stored records: a decision history, a risk register, the state of a control.
It is never written by a producer, never edited by hand, and can always be thrown away and rebuilt.
This page fixes how views are derived, so that two materializers show the same governance the same way.

<Diagram of="sng/materialization" />

## Deterministic

A view MUST be a function of the set of stored records, and of nothing else but the present time.

- The order in which records arrived MUST NOT change a view: a record that arrives late lands where its time puts it.
- A record stored twice MUST count once.
- Deleting every view and deriving them again from the store MUST give the same views.

This is what makes the store the truth: whatever a view says can be traced back to the records that made it.

## Event time

Records are ordered by their time, the end of their span ([Records](./records#time)).
Where two records about the same subject have the same time, the order is by trace id, then span id, so that every materializer breaks the tie the same way.

## Not last-wins

The newest record about a subject is not necessarily its state.
Each specification defines the state of its subjects with three questions:

| Question  | Means                                                                                                 |
| --------- | ----------------------------------------------------------------------------------------------------- |
| Validity  | how long a record holds: an evaluation valid for 24 hours says nothing after them                     |
| Authority | which producers may assert the state: a record from any other is kept, shown, and does not count      |
| Revision  | a record that `supersedes` another replaces it; a record that does not, adds to the history beside it |

Two valid records from authoritative producers that disagree, without one superseding the other, are a **conflict**.
A materializer MUST show a conflict as such, never pick one of the two in silence.

## Unknown

A state is unknown when no valid, authoritative record establishes it.

- A control never evaluated is unknown, not passed.
- A control whose last evaluation is no longer valid is unknown, not passed.
- A system no record mentions is unknown, not compliant.

A materializer MUST show unknown as its own state, distinct from every outcome.
The absence of a failure is never a success.

## Views name their records

Every value a view shows SHOULD lead back to the records it was derived from: the decision to the record of it, the state of a control to the evaluation and the approval behind it.
A view that cannot say why it shows what it shows is not a governance view.
