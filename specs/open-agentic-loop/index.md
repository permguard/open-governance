# Open Agentic Loop

Open Agentic Loop will standardise what an AI agent does in its loop, plan, ask, act, observe, as governance records: each step it took, the authorization decision that allowed it, and the authority that decision rested on.

| Status  | Version | Model                                                    |
| ------- | ------- | -------------------------------------------------------- |
| Planned | 0       | [Span-Native Governance](/specs/span-native-governance/) |

<Diagram of="oal/overview" />

## The idea

An agent works in a loop: it plans a step, acts with a tool, observes the result and goes round again, often for many steps and on behalf of someone else.
Tracing conventions such as [OpenInference](https://github.com/Arize-ai/openinference) already describe the model calls and tool calls of that loop, for debugging and evaluation.
What they do not record is governance: whether each action was allowed, by which decision, on whose authority, and whether the loop stayed within what it was given.

In Open Agentic Loop each turn of the loop is a record, sent as an OpenTelemetry span, that links to the authorization decision behind it and to the human oversight it needed, with the relations of [Span-Native Governance](/specs/span-native-governance/records#links).
It links to a convention's own spans of the same loop rather than repeating them.

## What it will cover

| Subject   | Recorded as                                                       |
| --------- | ----------------------------------------------------------------- |
| Goal      | what the agent was asked to do, and by whom                       |
| Step      | one turn of the loop: what the agent planned and did              |
| Action    | a tool call, with the authorization decision that allowed it      |
| Authority | whose authority the agent acted on, and how it was delegated      |
| Bounds    | the budget, the limits, and a loop that ran past them             |

::: info Planned
This page sketches the direction.
The records, attributes and views of Open Agentic Loop are not written yet.
:::
