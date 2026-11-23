# Open specs

Open governance specifications for how organisations decide, control and account.

| Specification                                   | Status      |
| ----------------------------------------------- | ----------- |
| [Open Decision Lineage](open-decision-lineage/) | Development |

## Develop

The specifications are a [VitePress](https://vitepress.dev) site.
With [Task](https://taskfile.dev) and Node.js:

```bash
task docs      # live preview at http://localhost:5173
task build     # the static site in .vitepress/dist
task preview   # the built site at http://localhost:4173
```

A new specification is a folder of pages and an entry in `.vitepress/specs.ts`: the specification menu, its sidebar and the home page follow from it.
