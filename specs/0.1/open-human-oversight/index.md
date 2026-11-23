# Open Human Oversight

Open Human Oversight will standardise every point where a person is in the loop of an automated system: a request for a human decision, the approval, rejection or escalation that answers it, and the override of a decision already taken.

| Status  | Version | Model                                                        |
| ------- | ------- | ------------------------------------------------------------ |
| Planned | 0.1     | [Span-Native Governance](/specs/0.1/span-native-governance/) |

<Diagram of="oho/overview" />

## The idea

AI agents and automated systems act faster than anyone can watch them, and the rules that govern them, among them Article 14 of the EU AI Act for high-risk AI systems, require that people can oversee them, step in and stop them.
That oversight is only real if it is recorded: who was asked, what they saw, what they decided, and on whose authority.

In Open Human Oversight each of these moments is a record, sent as an OpenTelemetry span, linked to the record it answers with the relations of [Span-Native Governance](/specs/0.1/span-native-governance/records#links): an approval `approves` the request, an override `supersedes` the decision it reverses.
What is waiting for a human, and the history of every human decision, are materialised from them.

## What it will cover

| Subject    | Recorded as                                                          |
| ---------- | -------------------------------------------------------------------- |
| Request    | an agent or a system asking for a human decision, and what it showed |
| Review     | a person approving, rejecting or changing what was asked             |
| Escalation | a request passed to a higher authority                               |
| Override   | a person reversing a decision a system already took                  |
| Authority  | who may decide what, and who delegated it                            |

::: info Planned
This page sketches the direction.
The records, attributes and views of Open Human Oversight are not written yet.
:::
