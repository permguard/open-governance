# Open Compliance Evidence

Open Compliance Evidence will standardise the evidence of compliance and how its state is derived from it: the controls evaluated, the evidence behind them, the exceptions granted, and the state every system and requirement is in because of them.

| Status  | Version | Model                                                    |
| ------- | ------- | -------------------------------------------------------- |
| Planned | 0       | [Span-Native Governance](/specs/span-native-governance/) |

<Diagram of="oce/overview" />

## The idea

Compliance today is a state someone writes down: a spreadsheet cell, a ticket, a dashboard tile.
It is out of date the day after, and it cannot say why it is what it is.

In Open Compliance Evidence nobody writes the state: only the evidence is recorded.
Every control evaluation, every piece of evidence and every exception is a record, sent as an OpenTelemetry span, and the state of compliance is materialised from them, as [Span-Native Governance](/specs/span-native-governance/materialization) says:

- an evaluation holds for as long as it is valid, and the state is unknown once it is not;
- only the producers with authority over a control can assert it;
- an exception covers a failed control for as long as it was granted, and says who granted it;
- a system no record mentions is unknown, never compliant.

## What it will cover

| Subject     | Recorded as                                                       |
| ----------- | ----------------------------------------------------------------- |
| Requirement | what a regulation or a policy asks, and the controls that meet it |
| Control     | each evaluation of a control on a system, and its outcome         |
| Evidence    | what an evaluation rests on, by reference and digest              |
| Exception   | a failed control accepted, by whom and until when                 |
| State       | not recorded: derived, per system and per requirement             |

::: info Planned
This page sketches the direction.
The records, attributes and views of Open Compliance Evidence are not written yet.
:::
