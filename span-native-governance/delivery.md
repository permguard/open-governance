# Delivery

A governance record that is lost is a decision nobody can explain or a control nobody can prove.
Telemetry tolerates loss; governance does not.
This page fixes how a record travels from its producer to a store without being lost, and is kept only once.

<Diagram of="sng/delivery" />

## Producers

| Rule              | Requirement                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Never sampled     | a producer MUST NOT sample governance records: their tracer uses an always-on sampler, whatever the rest of the process uses                              |
| Own pipeline      | a producer SHOULD emit governance records through a tracer provider of their own, so that the sampling and limits of ordinary tracing never apply to them |
| Bounded queue     | an exporter's queue drops when full; a producer SHOULD size it for its peak, and SHOULD record, as a metric or a log, every record it dropped             |
| Same ids on retry | a record sent again MUST keep its trace id and span id, so that it is recognised as the same record                                                       |
| Flush on exit     | a producer MUST flush its records before it stops                                                                                                         |

A producer that cannot afford to lose a record at all SHOULD export it synchronously, or keep it in a durable buffer of its own until a receiver acknowledges it.

## Transport

Records travel over OTLP, gRPC or HTTP, as any trace does.
A collector between producer and receiver MUST NOT sample, filter or drop governance records, and SHOULD keep its sending queue on disk, so that a restart loses nothing it had accepted.

## Receivers

| Rule               | Requirement                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Store, then answer | a receiver MUST answer an export with success only once its records are stored durably                            |
| Refuse, never drop | a record a receiver will not keep is refused and counted in the OTLP partial success, never ignored               |
| Stored once        | a record whose trace id and span id are already stored is a duplicate: kept once, and still answered with success |
| Append-only        | a stored record is never edited; a correction is a new record that `supersedes` it                                |

## The store

The records, as received, are the source of truth.
A receiver MAY keep them in any form, files, a database, an object store, provided it can give every record back as it came.
Everything else a system keeps about governance, indexes, tables, dashboards, is a view of the store and can be rebuilt from it ([Materialization](./materialization)).

A store keeps records for as long as its governance requires, and no shorter.
Retention is a policy of the receiver; a specification MAY say how long its records are worth keeping.
