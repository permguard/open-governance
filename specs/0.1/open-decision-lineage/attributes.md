# Attributes

Every ODL attribute is in the `odl.` namespace, with dot-separated segments in `snake_case`.
ODL reuses OpenTelemetry's attributes where one exists for the same concept.

<Diagram of="odl/attributes" />

## Requirement levels

The requirement levels follow the [OpenTelemetry definitions](https://opentelemetry.io/docs/specs/semconv/general/attribute-requirement-level/).

| Level       | Meaning                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| Required    | the attribute MUST be set on every span the convention applies to             |
| Recommended | the attribute SHOULD be set when the information is available to the producer |
| Optional    | the attribute MAY be set                                                      |
| Not used    | the attribute SHOULD NOT be set on spans of this kind                         |

## Resource attributes

Recorded on the OpenTelemetry resource of the producer, not on its spans.
They identify the pipeline the spans belong to.

| Attribute              | Type   | Level       | Meaning                                                                        |
| ---------------------- | ------ | ----------- | ------------------------------------------------------------------------------ |
| `odl.version`          | String | Required    | `"0.1"`: the version of this specification the spans follow; it makes them ODL |
| `odl.pipeline.id`      | String | Required    | the logical pipeline, stable across runs: `privilege-escalation`               |
| `odl.pipeline.name`    | String | Recommended | the name a person reads: `Privilege escalation`; the id when absent            |
| `odl.pipeline.version` | String | Required    | the pipeline's shape: `3`; not the version of this specification               |
| `service.name`         | String | Recommended | OpenTelemetry's own: the worker that emitted the spans                         |

## Span attributes

| Attribute             | Type     | Meaning                                                                   |
| --------------------- | -------- | ------------------------------------------------------------------------- |
| `odl.span.kind`       | String   | `batch`, `step`, `heartbeat` or `run`                                     |
| `odl.run.id`          | String   | the run, a UUIDv7                                                         |
| `odl.job.id`          | String   | the job inside the run: one per worker or partition of the work           |
| `odl.run.state`       | String   | `running` on a heartbeat; `succeeded`, `failed` or `cancelled` on a run   |
| `odl.step.id`         | String   | the step, stable across runs: `enrich-identity`                           |
| `odl.step.name`       | String   | the name a person reads; the id when absent                               |
| `odl.step.kind`       | String   | `source`, `transform`, `enrich`, `detect`, `aggregate` or `sink`          |
| `odl.step.upstream`   | String[] | the step ids this step takes its records from; none for the first step    |
| `odl.input.stream`    | String   | what was read: `decisions/<zone>/<ledger>` for a decision log             |
| `odl.input.cursor`    | String   | where in the stream, as the stream names it: `offset-9182`                |
| `odl.input.ids`       | String[] | the ids of the records read, at most 1 000                                |
| `odl.input.group_id`  | String   | one id standing for the records read, which the producing system resolves |
| `odl.input.count`     | Int      | how many records were read; the truth when the ids are a part or a group  |
| `odl.output.stream`   | String   | where the results went: `stix/sightings`                                  |
| `odl.output.ids`      | String[] | the ids of the results written, at most 1 000                             |
| `odl.output.group_id` | String   | one id standing for the results written                                   |
| `odl.output.count`    | Int      | how many results were written                                             |
| `odl.failed.count`    | Int      | how many records failed; 0 when absent                                    |
| `odl.processed.total` | Int      | the records the run processed so far, or in all on a run span             |
| `odl.failed.total`    | Int      | the records the run failed so far, or in all on a run span                |

### Levels by span kind

The level of each attribute on each kind of span: **R** Required, **Rc** Recommended, **O** Optional, **–** Not used.

| Attribute             | batch | step | heartbeat | run |
| --------------------- | :---: | :--: | :-------: | :-: |
| `odl.span.kind`       | R     | R    | R         | R   |
| `odl.run.id`          | R     | R    | R         | R   |
| `odl.job.id`          | R     | R    | R         | R   |
| `odl.run.state`       | –     | –    | R         | R   |
| `odl.step.id`         | –     | R    | –         | –   |
| `odl.step.name`       | –     | O    | –         | –   |
| `odl.step.kind`       | –     | R    | –         | –   |
| `odl.step.upstream`   | –     | Rc   | –         | –   |
| `odl.input.stream`    | Rc    | Rc   | –         | –   |
| `odl.input.cursor`    | O     | O    | –         | –   |
| `odl.input.ids`       | Rc    | Rc   | –         | –   |
| `odl.input.group_id`  | O     | O    | –         | –   |
| `odl.input.count`     | Rc    | Rc   | –         | –   |
| `odl.output.stream`   | –     | Rc   | –         | –   |
| `odl.output.ids`      | –     | Rc   | –         | –   |
| `odl.output.group_id` | –     | O    | –         | –   |
| `odl.output.count`    | O     | Rc   | –         | –   |
| `odl.failed.count`    | O     | Rc   | –         | –   |
| `odl.processed.total` | –     | –    | Rc        | Rc  |
| `odl.failed.total`    | –     | –    | Rc        | Rc  |

A step that writes findings, a detection, an alert, a sighting, MAY name the business transactions they are about with `ogs.transaction.ids`, at most 1 000, as [Span-Native Governance](/specs/0.1/span-native-governance/records#business-transactions) defines it.
A compliance case that takes up a finding names the same transaction, so that the transaction's flow shows both; the link from the case to the step stays the evidence.

Levels marked Recommended on a step apply where they make sense: `odl.input.*` on a step that reads from a stream, `odl.output.*` on a step that writes to one, `odl.failed.count` on a step that failed records.

## Value rules

| Rule      | Meaning                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types     | the OTLP primitive of the same name; `String[]` is an OTLP array of strings, never a JSON string                                                   |
| Counts    | non-negative integers; a producer MUST NOT send a count as a string                                                                                |
| Id lists  | at most 1 000 ids; past that, a producer SHOULD send a group id and the count, and MAY send the first 1 000 ids as well; `ogs.transaction.ids` too |
| Enums     | `odl.span.kind`, `odl.run.state` and `odl.step.kind` take only the values listed; receivers refuse a span that does not                            |
| Empty     | an empty string is the same as an absent attribute                                                                                                 |
| Sensitive | ids identify records, they never carry their content: a decision's subject, resource or context MUST NOT be an attribute                           |

The last rule matters: a decision log may hold personal data in clear, and ODL spans travel to systems that do not apply the log's access rules.
A pipeline names the decisions it read; it never copies them.
