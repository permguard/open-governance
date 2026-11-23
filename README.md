# Open Governance

Open governance specifications for how organisations decide, control and account.

The site is published at [opengov.permguard.com](https://opengov.permguard.com) on every commit to `main`.

| Specification                                               | Status      | Schema                                                   |
| ----------------------------------------------------------- | ----------- | -------------------------------------------------------- |
| [Span-Native Governance](specs/span-native-governance/)     | Draft       | [v0](public/specs/span-native-governance/v0/schema.json) |
| [Open Decision Lineage](specs/open-decision-lineage/)       | Development | [v1](public/specs/open-decision-lineage/v1/schema.json)  |
| [Open Compliance Evidence](specs/open-compliance-evidence/) | Planned     |                                                          |
| Open Human Oversight                                        | Planned     |                                                          |
| Open Agentic Loop                                           | Planned     |                                                          |

## Develop

The specifications are a [VitePress](https://vitepress.dev) site.
With [Task](https://taskfile.dev) and Node.js:

```bash
task docs      # live preview at http://localhost:5173
task check     # every schema against its valid and invalid examples
task build     # the static site in .vitepress/dist
task preview   # the built site at http://localhost:4173
```

A new specification is a folder of pages under `specs/` and an entry in `.vitepress/specs.ts`: the specification menu, its sidebar and the home page follow from it.
Its schema goes in `public/specs/<id>/v<version>/schema.json`, and its examples in `tests/schemas/<id>/valid` and `invalid`.
