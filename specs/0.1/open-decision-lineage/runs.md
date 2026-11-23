# Runs and Health

A pipeline does not report its own state.
A receiver derives it from the spans it received: whether each run is alive, and whether each step is healthy.
This page fixes how, so that two receivers show the same pipeline the same way.

<Diagram of="odl/runs" />

## The state of a run

| State       | When                                                                                   |
| ----------- | -------------------------------------------------------------------------------------- |
| `succeeded` | a `run` span of the run arrived with `odl.run.state = succeeded`                       |
| `failed`    | a `run` span of the run arrived with `odl.run.state = failed`                          |
| `cancelled` | a `run` span of the run arrived with `odl.run.state = cancelled`                       |
| `running`   | no `run` span arrived, and a span of the run, of any kind, ended in the last 2 minutes |
| `stalled`   | no `run` span arrived, and no span of the run arrived in the last 2 minutes            |

A run's `run` span is final: spans of the run that arrive after it do not reopen the run.
The 2 minutes are the receiver's; a producer keeps a waiting run `running` with heartbeats ([Span Kinds](./span-kinds#heartbeat)).

A run's totals are the larger of what its last heartbeat or run span reports and what its batches add up to.

## The health of a step

Over the time range a receiver shows:

| Health    | When                                                              |
| --------- | ----------------------------------------------------------------- |
| `idle`    | the step's last span started over 2 minutes ago, or there is none |
| `error`   | the step's last span has the status `ERROR`                       |
| `warning` | spans of the step failed in the range, but not its last           |
| `ok`      | none of the step's spans in the range failed                      |

For `warning`, a span failed when its status is `ERROR` or its `odl.failed.count` is above zero.

## The graph of a pipeline

A receiver rebuilds a pipeline's graph from the spans of the range:

| Element        | From                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| A step         | every `odl.step.id` the pipeline's step spans name; a step named only as an upstream is drawn with nothing of its own |
| An edge        | each `odl.step.upstream` of a step: from the upstream to the step                                                     |
| An input       | the `odl.input.stream` of a step with no upstream, drawn before it                                                    |
| An output      | the `odl.output.stream` of a step, drawn after it                                                                     |
| A retired step | a step seen in the range but not in the pipeline's newest version: the pipeline no longer runs it                     |

The graph is one per pipeline: every run and every batch of the pipeline draws on the same graph.
The newest version, the version of the pipeline's newest batch, decides its shape; steps of older versions stay on it, marked retired, while the range holds their spans.
A batch runs a path through it, which a receiver can show by itself: the steps of the batch, the streams it read and wrote, the step that failed.
