# Lineage

Lineage is what a batch read and what it wrote, named so that a receiver can follow a decision from the log to every result made from it, and back.

## Inputs

A batch, and each step that reads from a stream, names its inputs:

| Attribute            | Names                                                  |
| -------------------- | ------------------------------------------------------ |
| `odl.input.stream`   | the stream read                                        |
| `odl.input.cursor`   | where in the stream, as the stream names its positions |
| `odl.input.ids`      | the records read, by their ids                         |
| `odl.input.group_id` | one id standing for the records read                   |
| `odl.input.count`    | how many records were read, whatever the ids list      |

The batch span names what the batch read as a whole; a source step names what it read itself.
Steps after the first take their records from their `odl.step.upstream` and SHOULD NOT repeat the input ids.

## Outputs

A step that writes to a stream names its outputs with `odl.output.stream`, `odl.output.ids`, `odl.output.group_id` and `odl.output.count`, as for inputs.
A batch's results are the sum of its steps' outputs, unless the batch span states `odl.output.count` itself.

## Streams

A stream name is a path of segments separated by `/`, the first naming the kind of stream.

| Stream                      | Holds                                                         |
| --------------------------- | ------------------------------------------------------------- |
| `decisions/<zone>/<ledger>` | the decision log of one ledger; RECOMMENDED for decision logs |
| `stix/<collection>`         | STIX objects, such as `stix/sightings`                        |
| `alerts/<queue>`            | alerts for people, such as `alerts/soc`                       |
| any other path              | whatever the pipeline writes; receivers show it as it is      |

The name is the same in every span that reads or writes the stream, so that a receiver can join them.

## Ids and group ids

An id is the record's own identifier in its stream, the one a system that holds the stream can find it by.
For a decision log, it is the id the log gives the decision record.

Some batches read thousands of records, and a span cannot carry them all.
`odl.input.ids` and `odl.output.ids` hold at most 1 000 ids.
Past that, a producer SHOULD send a group id, an identifier the producing system keeps and can resolve into the full list, and MAY send the first 1 000 ids beside it.
The count is always the truth: `odl.input.count` may be larger than the ids listed.

A group id is opaque to receivers; ODL does not say how it is built.
A useful form names the stream and the range: `decisions:commerce/order-platform@2-121`.

## Following a decision

With inputs and outputs named, a receiver answers both directions from the spans alone:

- **Forward**: the batches whose `odl.input.ids` hold a decision's id, and the outputs of their steps, are what was made of it.
- **Backward**: the batch whose step wrote a result's id, and its `odl.input.ids`, are the decisions it came from.

Where only a group id is given, the receiver names the group, and the system that produced it resolves it.
