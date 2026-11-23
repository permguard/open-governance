# Schema

Span-Native Governance publishes the schema of the envelope every governance record shares, whatever its specification.
Each specification publishes its own schema beside it, for its own attributes.

<Diagram of="sng/schema" />

## Download

| Version | Schema                                                                                                         | `$id`                                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 0       | [`/specs/span-native-governance/v0/schema.json`](/specs/span-native-governance/v0/schema.json){target="_self"} | `https://opengov.permguard.com/specs/span-native-governance/v0/schema.json` |

The schema is JSON Schema 2020-12.

## What it checks

| Part       | Checked                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Resource   | present, with attribute names in dotted lower case                                                       |
| Identity   | a trace id of 32 and a span id of 16 lower-case hexadecimal digits                                       |
| Time       | start and end as RFC 3339 times                                                                          |
| Attributes | dotted lower-case names, at most 128                                                                     |
| Links      | at most 128, each to a trace id and span id                                                              |
| Relations  | `ogs.link.relation` is `supersedes`, `evidence`, `approves`, `caused_by`, or prefixed by a specification |

A record that passes a specification's schema also passes this one: the check of this site validates every example of every specification against both.

## Publishing a schema

Every specification MUST publish the schema of its records at `/specs/<id>/v<version>/schema.json`, with that URL on `opengov.permguard.com` as its `$id`, and MUST keep it unchanged once its version is stable ([Writing a Specification](./writing)).

## The whole schema

::: details schema.json, version 0

<<< @/public/specs/span-native-governance/v0/schema.json

:::
