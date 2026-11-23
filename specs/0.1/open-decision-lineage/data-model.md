# Data Model

ODL describes pipelines with six concepts and maps each onto the OpenTelemetry trace data model.
Nothing is added to OTLP: a concept is either the resource, a span, or an attribute of one.

<Diagram of="odl/data-model" />

## Concepts

| Concept      | Is                                                                                                   | In OpenTelemetry                                          |
| ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Pipeline** | a logical analysis of decision logs, in a given shape: `privilege-escalation`, version `3`           | the resource attributes `odl.pipeline.id` and `.version`  |
| **Run**      | one execution of a pipeline, from its start to its end; it may last minutes or months                | the attribute `odl.run.id` on every span of the run       |
| **Job**      | one worker or partition of the work inside a run                                                     | the attribute `odl.job.id` on every span of the run       |
| **Batch**    | one unit of work through the pipeline: some records read, the steps run on them, the results written | one trace, whose root span is the `batch` span            |
| **Step**     | one stage of the pipeline working on a batch: read, enrich, detect, write                            | a `step` span, child of the `batch` span or of a step     |
| **Stream**   | where records are read from or written to: a decision log, a queue of alerts, a feed                 | the attributes `odl.input.stream` and `odl.output.stream` |

A **record** is one item of a stream; in an input stream that is a decision log, a record is one authorization decision, identified by the id the decision log gives it.

## From a pipeline to its traces

A run lasts as long as its pipeline consumes, so it is never one trace: a trace that never ends is never received.
A batch is the trace, and the run is the attribute every span of it carries.

```text
resource   odl.version = "0.1"   odl.pipeline.id = "privilege-escalation"   odl.pipeline.version = "3"
│
├─ trace (batch 1)
│   └─ batch span ──────────────────────────────────────────────── odl.run.id = R, odl.job.id = job-1
│        ├─ step span   read-decisions     source     reads  decisions/commerce/order-platform
│        ├─ step span   enrich-identity    enrich     upstream read-decisions
│        └─ step span   detect-escalation  detect     upstream enrich-identity, writes stix/sightings
├─ trace (batch 2) ...
├─ trace (heartbeat)  heartbeat span        odl.run.state = running, totals so far
└─ trace (run end)    run span              odl.run.state = succeeded, final totals
```

The pipeline's graph is the union of the steps its spans name and of their `odl.step.upstream` edges.
It is never declared: a pipeline that adds, removes or reorders a step shows the change in the next batch, under a new `odl.pipeline.version` ([Pipelines](./pipelines#identity-and-version)).

## Identity

| What       | Identified by                                                   | Stable across                       |
| ---------- | --------------------------------------------------------------- | ----------------------------------- |
| A pipeline | `odl.pipeline.id`                                               | every run, every version            |
| Its shape  | `odl.pipeline.id` and `odl.pipeline.version`                    | every run and worker of the version |
| A run      | `odl.run.id`, a UUIDv7                                          | the run only                        |
| A job      | `odl.job.id`, unique within its run                             | the run only                        |
| A batch    | the trace id of its trace                                       | the batch only                      |
| A step     | `odl.step.id`, unique within its pipeline                       | every run in which the step exists  |
| A record   | the id its stream gives it; for a decision log, the record's id | its stream                          |

A run id SHOULD be a UUIDv7, so that runs sort by the time they started.
A pipeline id and a step id SHOULD be lower-case words separated by `-`, readable by a person.
