# Catalog

A record cites a law by its id and its parts: `eu-gdpr`, article `33`, paragraph `1`.
What a person reads of it, the name of the law, how the reference is cited, from when it applies, the title of the provision, the name of an event, can come with every record, or once, in a catalog the producer publishes and its records point to.
A materializer knows no law of its own: what it shows of one comes from the record, then from the catalog, then from the id as it was sent.

<Diagram of="ocl/catalog" />

## Pointing to a catalog

| Attribute            | Type   | Level    | Meaning                                                                                     |
| -------------------- | ------ | -------- | ------------------------------------------------------------------------------------------- |
| `ocl.catalog.url`    | String | Optional | where the catalog is: `https://`, or `http://` to the loopback                              |
| `ocl.catalog.digest` | String | Optional | the catalog's digest, `sha256:` and lower-case hexadecimal; required with `ocl.catalog.url` |

Both are resource attributes: a producer declares its catalog once, and every span it sends cites through it.
The same pattern as OpenTelemetry's schema URL: a versioned document, read once and kept.

## What a materializer reads, in this order

| What it shows                 | First                  | Then, from the catalog                         | Last                                 |
| ----------------------------- | ---------------------- | ---------------------------------------------- | ------------------------------------ |
| the name of a law             | `ocl.law.name`         | the law's `name`                               | `ocl.law.id`                         |
| how a reference is cited      | `ocl.law.citation`     | the provision's `citation`                     | article, paragraph and point as sent |
| from when a provision applies | `ocl.law.applies_from` | the provision's `applies_from`, else the law's | nothing: it applies                  |
| what an obligation asks       | `ocl.obligation.name`  | the provision's `title`                        | `ocl.obligation.id`                  |
| the name of an event          | `ocl.trigger.name`     | the trigger type's `name`                      | `ocl.trigger.type`                   |

A provision is looked up from the most precise reference to the least: `33.1.a`, then `33.1`, then `33`.
A value of the record always wins: a catalog fills in, it never overrides.

## The document

A catalog is one JSON document, valid against [its schema](/specs/0.1/open-compliance-lineage/catalog.schema.json).

```json
{
  "ocl_catalog": "0.1",
  "id": "northwind-financial/legal",
  "version": "2026-11-23",
  "default_language": "en",
  "laws": {
    "eu-gdpr": {
      "name": { "en": "GDPR" },
      "title": { "en": "General Data Protection Regulation", "it": "Regolamento generale sulla protezione dei dati" },
      "jurisdiction": "eu",
      "uri": "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
      "provisions": {
        "33.1": { "citation": { "en": "33(1)" }, "title": { "en": "Notify the supervisory authority", "it": "Notificare all'autorità di controllo" } }
      }
    },
    "in:pmla": {
      "name": { "en": "PMLA" },
      "jurisdiction": "in",
      "provisions": { "12.1.b": { "citation": { "en": "§ 12(1)(b)" } } }
    }
  },
  "triggers": {
    "personal_data_breach": { "name": { "en": "Personal data breach", "it": "Violazione di dati personali" } }
  }
}
```

| Field              | Meaning                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `ocl_catalog`      | the version of this format, `"0.1"`                                                                               |
| `id`, `version`    | what the catalog is and which edition: shown with what it names                                                   |
| `default_language` | the BCP 47 tag every text carries; a text in the reader's language is read first                                  |
| `laws`             | by `ocl.law.id`: `name`, `title`, `jurisdiction`, `uri`, `version`, `applies_from`, and `provisions` by reference |
| `provisions`       | by article, paragraph and point joined by `.`: `citation`, `title`, `applies_from`                                |
| `triggers`         | by `ocl.trigger.type`: `name`, `description`                                                                      |

A text is an object of BCP 47 tags, so one catalog serves every language and stays one document with one digest: a materializer never asks the producer for a language.

## Rules

| Rule          | Meaning                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| By digest     | a materializer uses a catalog only when the SHA-256 of its bytes is the digest the records name: a view does not change because a document changed under a URL |
| Kept          | a materializer keeps every catalog it used, by digest, beside the records: what it showed can be shown again, and checked, without the network                 |
| Never refused | a span is never refused because of its catalog: a catalog unreachable, too large or invalid leaves the record as it is, shown with what it carries             |
| Sources       | a materializer reads catalogs only from the loopback and from the hosts its configuration lists, by `https://`, at most 1 MiB, with a time limit               |
| Data only     | a catalog is data: nothing in it is run, and what it says is shown as text                                                                                     |
| A new edition | a catalog that changes is a new document with a new digest; records sent before keep pointing to the edition they were read with                               |

The records stay the evidence: a catalog names what they cite, it never says whether an obligation was met.
