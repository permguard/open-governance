# Writing a Specification

Every specification of this site has the same parts, in the same order, and follows the same naming rules.
A reader who knows one knows where to look in the next; a receiver that implements one knows what the next will ask.

<Diagram of="sng/writing" />

## The parts

| Part                 | Holds                                                                           | In Open Decision Lineage                                                                         |
| -------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Overview             | the picture first: what the specification is for, a diagram, what it leaves out | [Overview](/open-decision-lineage/)                                                              |
| Concepts             | its subjects, their keys, and how they map onto spans                           | [Pipelines](/open-decision-lineage/pipelines), [Data Model](/open-decision-lineage/data-model)   |
| Records              | its kinds of record, and every attribute with its type and level                | [Span Kinds](/open-decision-lineage/span-kinds), [Attributes](/open-decision-lineage/attributes) |
| Interoperability     | how its records link to those of other specifications                           | [Lineage](/open-decision-lineage/lineage)                                                        |
| Materialization      | its views, and how each is derived: validity, authority, revision, unknown      | [Runs and Health](/open-decision-lineage/runs)                                                   |
| Receivers            | what a receiver accepts, refuses and normalises                                 | [Receivers](/open-decision-lineage/receivers)                                                    |
| Security and privacy | what its records may and may not carry                                          | [Attributes](/open-decision-lineage/attributes#value-rules)                                      |
| In practice          | records as producers emit them, and a producer in every major language          | [Field Guide](/open-decision-lineage/field-guide)                                                |

Every page opens with a diagram, then goes from the whole to the detail.

## Naming

| Rule                 | Requirement                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Own prefix           | a specification's attributes MUST live under a prefix of its own, short and lower case: `odl.`                                                |
| No foreign namespace | a prefix MUST NOT be a namespace of OpenTelemetry's semantic conventions or of another known convention, such as `decision.` of OpenInference |
| Shared attributes    | attributes every specification uses live under `ogs.`, and only this foundation defines them                                                  |
| Reuse                | where OpenTelemetry already has an attribute for the same concept, such as `service.name`, a specification uses it                            |
| Version              | a specification MUST define `<prefix>.version`, on the resource, whose presence makes a span one of its records                               |
| Segments             | names are dot-separated segments in `snake_case`                                                                                              |

## Versioning

| Status      | Means                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Draft       | a direction: anything may change                                                           |
| Development | implemented by at least one receiver; an attribute may still change type or level          |
| Stable      | an attribute is deprecated, never removed or renamed; a change of meaning is a new version |

A receiver recognises the versions it supports by the value of `<prefix>.version`, and MUST NOT interpret records of a version it does not know.
