# Schema

OCL publishes a JSON Schema of its records, so that a producer can check what it emits and a receiver or a governance platform can take the contract in as it is.

<Diagram of="ocl/schema" />

## Download

| Version | Schema                                                                                                             | `$id`                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| 0.1     | [`/specs/0.1/open-compliance-lineage/schema.json`](/specs/0.1/open-compliance-lineage/schema.json){target="_self"} | `https://opengov.permguard.com/specs/0.1/open-compliance-lineage/schema.json` |

The schema is JSON Schema 2020-12.
Its URL never changes for a version: a new version of OCL is a new schema beside it.

## The record it checks

The schema checks one span in the logical JSON form of the [AI Act Examples](./examples), with its resource beside it:

```json
{
  "resource": { "ocl.version": "0.1", "ocl.organization.id": "northwind-hr" },
  "name": "report the serious incident",
  "end_time": "2026-12-14T09:30:00Z",
  "status_code": "OK",
  "attributes": {
    "ocl.span.kind": "obligation", "ocl.case.id": "019a4b2e-7c10-7000-8000-00000000c001",
    "ocl.obligation.id": "ai-act-73-2", "ocl.obligation.action": "notify", "ocl.obligation.due": "2026-12-29T09:30:00Z",
    "ocl.law.id": "eu-ai-act", "ocl.law.article": "73", "ocl.law.paragraph": "2", "ocl.party.role": "provider"
  }
}
```

An OTLP span becomes this form by taking its resource attributes and its span attributes as maps, its times as RFC 3339, and its status code by name.

## What it checks, and what it leaves

| The schema checks                                                                                                              | It leaves to materializers ([Obligations and State](./state)) |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| the resource: `ocl.version` = `"0.1"` and an organisation                                                                      | whether an action's obligation exists in its case             |
| the values of the span kind, the nine action kinds, the results, the findings and the states                                   | whether an obligation was met on time                         |
| a law id of a known form; for a law of the EU or a country, articles and points as the law numbers them, its version as a date | whether the cited article says what the obligation says       |
| a due as an RFC 3339 time, a recurrence as an ISO 8601 duration, a quorum of at least 1, a digest with its algorithm           | the Recommended attributes: their absence is allowed          |
| the attributes each kind of span, and each kind of action, must carry                                                          | anything that takes more than one span to judge               |

Attributes OCL does not define are allowed: receivers keep them as they are.

## Using it

::: code-group

```python [Python]
import json, urllib.request
from jsonschema import Draft202012Validator

schema = json.load(urllib.request.urlopen("https://opengov.permguard.com/specs/0.1/open-compliance-lineage/schema.json"))
validator = Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)

for error in validator.iter_errors(record):
    print(error.json_path, error.message)
```

```js [Node.js]
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const schema = await (await fetch('https://opengov.permguard.com/specs/0.1/open-compliance-lineage/schema.json')).json()
const ajv = new Ajv2020({ allErrors: true })
addFormats(ajv)
const validate = ajv.compile(schema)

if (!validate(record)) console.log(validate.errors)
```

:::

## The whole schema

::: details schema.json, version 0.1

<<< @/public/specs/0.1/open-compliance-lineage/schema.json

:::
