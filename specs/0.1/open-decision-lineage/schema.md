# Schema

ODL publishes a JSON Schema of its records, so that a producer can check what it emits and a receiver or a governance platform can take the contract in as it is.

<Diagram of="odl/schema" />

## Download

| Version | Schema                                                                                                         | `$id`                                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 0.1     | [`/specs/0.1/open-decision-lineage/schema.json`](/specs/0.1/open-decision-lineage/schema.json){target="_self"} | `https://opengov.permguard.com/specs/0.1/open-decision-lineage/schema.json` |

The schema is JSON Schema 2020-12.
Its URL never changes for a version: a new version of ODL is a new schema beside it.

## The record it checks

The schema checks one span in the logical JSON form of the [Field Guide](./field-guide), with its resource beside it:

```json
{
  "resource": { "odl.version": "0.1", "odl.pipeline.id": "privilege-escalation", "odl.pipeline.version": "3" },
  "name": "detect",
  "status_code": "OK",
  "attributes": {
    "odl.span.kind": "step", "odl.run.id": "01a2b3c4-0000-7000-8000-000000000001", "odl.job.id": "job-1",
    "odl.step.id": "detect", "odl.step.kind": "detect", "odl.step.upstream": ["read"]
  }
}
```

An OTLP span becomes this form by taking its resource attributes and its span attributes as maps, and its status code by name.

## What it checks, and what it leaves

| The schema checks                                                    | It leaves to receivers ([Receivers](./receivers))     |
| -------------------------------------------------------------------- | ----------------------------------------------------- |
| the resource: `odl.version` = `"0.1"`, a pipeline id and version     | whether a step's upstreams are steps the pipeline has |
| every attribute's type: strings, string lists, non-negative integers | whether a run's spans agree with one another          |
| the values of `odl.span.kind`, `odl.step.kind` and `odl.run.state`   | the Recommended attributes: their absence is allowed  |
| the attributes each kind of span must carry                          | the Not used attributes: their presence is allowed    |
| id lists of at most 1 000                                            | anything that takes more than one span to judge       |

Attributes ODL does not define are allowed: receivers keep them as they are.

## Using it

::: code-group

```python [Python]
import json, urllib.request
from jsonschema import Draft202012Validator

schema = json.load(urllib.request.urlopen("https://opengov.permguard.com/specs/0.1/open-decision-lineage/schema.json"))
validator = Draft202012Validator(schema)

for error in validator.iter_errors(record):
    print(error.json_path, error.message)
```

```js [Node.js]
import Ajv2020 from 'ajv/dist/2020.js'

const schema = await (await fetch('https://opengov.permguard.com/specs/0.1/open-decision-lineage/schema.json')).json()
const validate = new Ajv2020({ allErrors: true }).compile(schema)

if (!validate(record)) console.log(validate.errors)
```

:::

## The whole schema

::: details schema.json, version 0.1

<<< @/public/specs/0.1/open-decision-lineage/schema.json

:::
