# Span Kinds

Every ODL span says what it is with the attribute `odl.span.kind`.
It is distinct from OpenTelemetry's own `SpanKind`, which describes a span's position in a network call; ODL spans SHOULD use `SpanKind.INTERNAL`.

<Diagram of="odl/span-kinds" />

| `odl.span.kind` | Is                                                             | Parent             | Trace                  |
| --------------- | -------------------------------------------------------------- | ------------------ | ---------------------- |
| `batch`         | one unit of work through the pipeline                          | none: it is a root | its own, one per batch |
| `step`          | one step working on that batch                                 | a batch or a step  | the batch's            |
| `heartbeat`     | a run alive while it waits: no work, only its state and totals | none: it is a root | its own                |
| `run`           | the end of a run, sent once                                    | none: it is a root | its own                |

Every ODL span MUST carry `odl.span.kind`, `odl.run.id` and `odl.job.id`.
A span whose resource does not carry `odl.version` is not an ODL span, whatever its attributes.

## batch

The root of a batch's trace.
Its duration is the batch's, from the first record read to the last result written.

A batch span SHOULD name what the batch read, with `odl.input.stream` and either `odl.input.ids` or `odl.input.group_id`, and SHOULD carry `odl.input.count`.
It MAY carry `odl.output.count` and `odl.failed.count` for the whole batch; a receiver that finds them absent sums them from the batch's steps.

The batch span's status is the batch's outcome: `ERROR` when the batch failed, with the reason as the status message.

## step

One step of the pipeline working on the batch.
A step span MUST carry `odl.step.id` and `odl.step.kind`, and SHOULD carry `odl.step.upstream` unless it is the first step of the batch.

| `odl.step.kind` | The step                                                        |
| --------------- | --------------------------------------------------------------- |
| `source`        | reads records from a stream                                     |
| `transform`     | reshapes records without adding knowledge                       |
| `enrich`        | adds knowledge to records: an identity, a reputation, a context |
| `detect`        | finds what the pipeline looks for: an escalation, an anomaly    |
| `aggregate`     | combines records: counts, correlations, scores                  |
| `sink`          | writes results to a stream                                      |

A step that reads from a stream carries `odl.input.stream`; a step that writes carries `odl.output.stream`, and SHOULD carry `odl.output.count` and `odl.output.ids` or `odl.output.group_id`.

The step span's status is the step's outcome.
A step that failed MUST set the status to `ERROR` with the reason as the status message, and SHOULD carry `odl.failed.count`, the records it could not process.
Steps that depend on a failed step SHOULD NOT be emitted for that batch: they did not run.

A step MAY record span events, a retry, a skip, a rule that matched; receivers show them as they are.

## heartbeat

A run that waits for records still lives.
A heartbeat span says so, without work: it MUST carry `odl.run.state` set to `running`, and SHOULD carry `odl.processed.total` and `odl.failed.total`, the run's totals so far.

A producer SHOULD emit a heartbeat at least every 30 seconds while a run has no batch to emit, so that receivers do not take the run for stalled ([Runs and Health](./runs)).

## run

The end of a run, sent once, when the run ends.
A run span MUST carry `odl.run.state` set to `succeeded`, `failed` or `cancelled`, and SHOULD carry `odl.processed.total` and `odl.failed.total`, the run's final totals.
A run that ends without its run span is taken by receivers for stalled once its spans stop arriving.
