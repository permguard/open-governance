# Open Governance

Open governance specifications for how organisations decide, control and account.

The site is published at [opengov.permguard.com](https://opengov.permguard.com) on every commit to `main`.

The current release is 0.1.

| Specification           | Version | Status      | Pages                                                                   | Schema                                                              |
| ----------------------- | ------- | ----------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Span-Native Governance  | 0.1     | Draft       | [specs/0.1/span-native-governance](specs/0.1/span-native-governance/)   | [schema.json](public/specs/0.1/span-native-governance/schema.json)  |
| Open Decision Lineage   | 0.1     | Development | [specs/0.1/open-decision-lineage](specs/0.1/open-decision-lineage/)     | [schema.json](public/specs/0.1/open-decision-lineage/schema.json)   |
| Open Compliance Lineage | 0.1     | Draft       | [specs/0.1/open-compliance-lineage](specs/0.1/open-compliance-lineage/) | [schema.json](public/specs/0.1/open-compliance-lineage/schema.json) |
| Open Human Oversight    | 0.1     | Planned     | announced, not published                                                |                                                                     |
| Open Agentic Loop       | 0.1     | Planned     | announced, not published                                                |                                                                     |

## Develop

The specifications are a [VitePress](https://vitepress.dev) site.
With [Task](https://taskfile.dev) and Node.js:

```bash
task docs      # live preview at http://localhost:5173
task check     # every schema against its valid and invalid examples
task build     # the static site in .vitepress/dist
task preview   # the built site at http://localhost:4173
```

Everything is kept by release, a folder per version:

| What           | Where                                           |
| -------------- | ----------------------------------------------- |
| Pages          | `specs/<version>/<id>/`                         |
| Schema         | `public/specs/<version>/<id>/schema.json`       |
| Examples       | `tests/schemas/<version>/<id>/valid`, `invalid` |
| Published path | `/specs/<version>/<id>/`                        |

A new specification is a folder of pages in the current release and an entry in `.vitepress/specs.ts`: the specification menu, its sidebar and the home page follow from it.
A new release is a copy of the current release's folders under the new version, added first to `versions` in `.vitepress/specs.ts`; the older release stays published as it was.
