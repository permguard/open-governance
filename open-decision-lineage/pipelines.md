# Pipelines

A pipeline is a consumer of decision logs: a logical analysis, such as `privilege-escalation`, that reads decisions and does something with them.
This page is about its shape, before any attribute: what a pipeline may look like, and how ODL names it.

<Diagram of="odl/shapes" />

## Free in shape

ODL does not tell a pipeline how to work.
It may be one step or ten, serial or parallel, one process or a hundred, one decision at a time or thousands.
Whatever the shape, the same few concepts describe it:

| The pipeline has                | ODL describes it with                                                   |
| ------------------------------- | ----------------------------------------------------------------------- |
| one step                        | one `step` span in every batch                                          |
| several steps in series         | each step naming the one before it in `odl.step.upstream`               |
| steps in parallel               | two steps naming the same upstream; the step that joins them names both |
| one decision per batch, 1 : 1   | a batch per decision, `odl.input.count` = 1                             |
| many decisions per batch, 1 : n | a batch per group of decisions, their ids in `odl.input.ids`            |
| several workers                 | a job per worker or partition, `odl.job.id`, inside the same run        |
| several outputs                 | one step per stream written, each with its `odl.output.stream`          |
| a life of minutes or of months  | a run, `odl.run.id`, kept alive by heartbeats and closed by a run span  |

The pipeline never sends this shape as a document.
A receiver rebuilds it from the spans of each batch, as [Runs and Health](./runs#the-graph-of-a-pipeline) says, so the picture is always the one the pipeline actually runs.

## Identity and version

Three resource attributes name a pipeline:

| Attribute              | Is                                                                | Example                |
| ---------------------- | ----------------------------------------------------------------- | ---------------------- |
| `odl.pipeline.id`      | the pipeline, stable for as long as it does the same analysis     | `privilege-escalation` |
| `odl.pipeline.version` | the shape of the pipeline: its steps, their kinds and their order | `3`                    |
| `odl.pipeline.name`    | the name a person reads                                           | `Privilege escalation` |

The version is what keeps a pipeline consistent.

- Every producer of a pipeline MUST send `odl.pipeline.id` and `odl.pipeline.version`.
- Every worker of the same version MUST run the same steps, with the same ids, kinds and upstreams.
- A producer MUST change the version when it adds, removes or renames a step, or changes a step's kind or upstreams.
- A producer MAY change the version for any other reason; a version is a name, not a number to compare.

A receiver therefore draws one graph per pipeline, from its newest version, and shows the steps that only older versions ran as retired.
Two versions are never merged into one shape.

## Steps and their state

A step is one stage of the pipeline: it reads, reshapes, enriches, detects, aggregates or writes.
In every batch, each step that runs reports, on its own span:

| What                        | How                                                       |
| --------------------------- | --------------------------------------------------------- |
| which step it is            | `odl.step.id`, stable across runs and versions            |
| what it does                | `odl.step.kind`: `source`, `enrich`, `detect`, …          |
| where its records came from | `odl.step.upstream`, or `odl.input.stream` for the first  |
| what it wrote               | `odl.output.stream`, `odl.output.ids`, `odl.output.count` |
| how it went                 | the span status, `odl.failed.count`, the span's duration  |

The state of a step is never sent as such.
A receiver composes it from these reports, batch after batch: a step whose last batch failed is in error, one that failed earlier but not since is in warning, one that has not run for two minutes is idle.

## What a receiver composes

| From the spans of a pipeline | A receiver shows                                                      |
| ---------------------------- | --------------------------------------------------------------------- |
| its steps and upstreams      | the graph of the pipeline, its inputs and its outputs                 |
| its runs' spans              | the state of each run: running, stalled, succeeded, failed, cancelled |
| each step's outcomes         | the health of each step, its throughput and its latency               |
| its batches' ids             | the lineage of each decision, forward and back                        |

The [Data Model](./data-model) shows how these concepts map onto OpenTelemetry traces.
