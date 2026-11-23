// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

// Every specification's schema, checked against its examples: each record under
// tests/schemas/<spec>/valid must pass, each under invalid must fail. A schema that lets an invalid
// record through, or refuses a valid one, fails the check, and so does a schema that does not compile.
// Strict mode stays on, but for `required` inside `if`/`then`, the usual way to require attributes by
// kind of span, which it would flag.

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const schemas = 'public/specs'
const tests = 'tests/schemas'
let failures = 0
let checked = 0

const json = async (path) => JSON.parse(await readFile(path, 'utf8'))
const list = async (path) => (await readdir(path).catch(() => [])).filter((name) => name.endsWith('.json')).sort()

for (const spec of (await readdir(schemas)).sort()) {
  for (const version of (await readdir(join(schemas, spec))).sort()) {
    const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false, allowUnionTypes: true })
    addFormats(ajv)
    const validate = ajv.compile(await json(join(schemas, spec, version, 'schema.json')))
    for (const [expected, folder] of [[true, 'valid'], [false, 'invalid']]) {
      for (const name of await list(join(tests, spec, folder))) {
        checked++
        const passed = validate(await json(join(tests, spec, folder, name)))
        if (passed !== expected) {
          failures++
          const why = passed ? 'was accepted' : ajv.errorsText(validate.errors)
          console.error(`${spec}/${version} ${folder}/${name}: ${why}`)
        }
      }
    }
  }
}

// A record of a specification is a governance record too: it must pass the foundation's envelope.
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false, allowUnionTypes: true })
addFormats(ajv)
const envelope = ajv.compile(await json(join(schemas, 'span-native-governance', 'v0', 'schema.json')))
for (const spec of (await readdir(tests)).filter((name) => name !== 'span-native-governance')) {
  for (const name of await list(join(tests, spec, 'valid'))) {
    checked++
    if (!envelope(await json(join(tests, spec, 'valid', name)))) {
      failures++
      console.error(`span-native-governance/v0 ${spec}/valid/${name}: ${ajv.errorsText(envelope.errors)}`)
    }
  }
}

console.log(`${checked} records checked against their schemas, ${failures} wrong`)
process.exit(failures ? 1 : 0)
