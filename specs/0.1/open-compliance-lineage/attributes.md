# Attributes

Every OCL attribute is in the `ocl.` namespace, with dot-separated segments in `snake_case`.
OCL reuses OpenTelemetry's attributes where one exists for the same concept.

<Diagram of="ocl/attributes" />

## Requirement levels

The requirement levels follow the [OpenTelemetry definitions](https://opentelemetry.io/docs/specs/semconv/general/attribute-requirement-level/).

| Level       | Meaning                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| Required    | the attribute MUST be set on every span the convention applies to             |
| Recommended | the attribute SHOULD be set when the information is available to the producer |
| Optional    | the attribute MAY be set                                                      |
| Not used    | the attribute SHOULD NOT be set on spans of this kind                         |

## Resource attributes

Recorded on the OpenTelemetry resource of the producer, not on its spans.
They name the organisation whose obligations the spans are about.

| Attribute               | Type   | Level       | Meaning                                                                                |
| ----------------------- | ------ | ----------- | -------------------------------------------------------------------------------------- |
| `ocl.version`           | String | Required    | `"0.1"`: the version of this specification the spans follow; it makes them OCL         |
| `ocl.organization.id`   | String | Required    | the organisation the obligations fall on, stable: `northwind-hr`                       |
| `ocl.organization.name` | String | Recommended | the name a person reads: `Northwind HR`; the id when absent                            |
| `service.name`          | String | Recommended | OpenTelemetry's own: the system that emitted the spans                                 |
| `ocl.catalog.url`       | String | Optional    | where the producer's [catalog](./catalog) is: what a person reads of the laws it cites |
| `ocl.catalog.digest`    | String | Optional    | the catalog's `sha256:`; required with `ocl.catalog.url`                               |

## Span attributes

### The case and its trigger

| Attribute          | Type   | Meaning                                                                                           |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------- |
| `ocl.span.kind`    | String | `trigger`, `obligation`, `action` or `close`                                                      |
| `ocl.case.id`      | String | the case, a UUIDv7                                                                                |
| `ocl.trigger.type` | String | what happened: `serious_incident`, `personal_data_breach`, … ([Cases](./cases#what-opens-a-case)) |
| `ocl.trigger.name` | String | the name a person reads of the event: `Personal data breach`; the type when absent                |
| `ocl.subject.id`   | String | what the case is about: `cv-screening`                                                            |
| `ocl.subject.type` | String | `ai_system`, `product`, `service`, `processing`, `ict_service`, `system`, or another              |
| `ocl.subject.name` | String | the name a person reads; the id when absent                                                       |
| `ocl.case.state`   | String | `closed` or `withdrawn`                                                                           |

### The obligation

| Attribute                        | Type     | Meaning                                                                                                                                                       |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ocl.obligation.id`              | String   | the obligation, unique within its case: `ai-act-73-2`                                                                                                         |
| `ocl.obligation.name`            | String   | what it asks, as a person reads it: `Report the serious incident`                                                                                             |
| `ocl.obligation.action`          | String   | the kind of action that meets it: one of the nine of `ocl.action.kind`                                                                                        |
| `ocl.obligation.due`             | String   | when it must be met, an RFC 3339 time; none when nobody set one                                                                                               |
| `ocl.obligation.due_basis`       | String   | what set the due when the law did not: the organisation's rule or contract, `org:ir-plan-2#sev2`                                                              |
| `ocl.obligation.anchor`          | String   | the record the due counts from: `awareness`, `classification`, `receipt`, … ([Cases](./cases#the-clock-starts-at-the-anchor))                                 |
| `ocl.obligation.owner`           | String   | who must see it done: a pseudonymous id or a team, never a name                                                                                               |
| `ocl.obligation.quorum`          | Int      | how many distinct actors must perform the action; 1 when absent                                                                                               |
| `ocl.obligation.parameter`       | String   | the organisation-defined parameter the obligation depends on, as its standard names it: `IR-06_ODP[01]`                                                       |
| `ocl.obligation.parameter_value` | String   | the value the organisation gave it: an ISO 8601 duration, `PT1H`, or text                                                                                     |
| `ocl.obligation.recurrence`      | String   | how often a standing obligation comes back, an ISO 8601 duration: `P1Y`                                                                                       |
| `ocl.law.id`                     | String   | the law or standard: `eu-ai-act`, `eu-gdpr`, `std:nist-csf-2.0`, … ([Legal References](./laws))                                                               |
| `ocl.law.name`                   | String   | the name a person reads of the law or standard: `GDPR`, `NIST CSF 2.0`, `PMLA`; the id when absent                                                            |
| `ocl.law.citation`               | String   | the reference as the law cites itself: `33(1)`, `§ 164.410(b)`, `DE.AE-08`; article, paragraph and point as sent when absent                                  |
| `ocl.law.applies_from`           | String   | from when the cited provision applies, an RFC 3339 time; before it the obligation is readiness ([Obligations and State](./state#a-materializer-knows-no-law)) |
| `ocl.law.article`                | String   | the article, or the standard's first level: `73`, `DE.AE`, `IR-6`                                                                                             |
| `ocl.law.paragraph`              | String   | the paragraph, or the second level: `2`, `08`                                                                                                                 |
| `ocl.law.point`                  | String   | the point, nested points joined by `.`: `a`, `49.b`, `d.i`                                                                                                    |
| `ocl.law.version`                | String   | the text the obligation was read from: a consolidated text by its date, `2026-07-27`, a standard by its version                                               |
| `ocl.law.celex`                  | String   | the law's CELEX number, for the EU's own: `32024R1689`                                                                                                        |
| `ocl.law.uri`                    | String   | where the text is, for a law or standard with no CELEX: a DOI or a URL                                                                                        |
| `ocl.law.supports`               | String[] | the outcomes of a standard this obligation also evidences: `std:nist-ai-rmf#MANAGE 4.3`                                                                       |
| `ocl.party.role`                 | String   | the role the law gives the organisation: `provider`, `deployer`, `controller`, …                                                                              |

### The action

| Attribute                      | Type     | Meaning                                                                                                                                                              |
| ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ocl.action.kind`              | String   | `assess`, `review`, `notify`, `inform`, `remediate`, `record`, `attest`, `escalate` or `determine`                                                                   |
| `ocl.action.result`            | String   | `applies` or `not_applicable` for an assessment; `confirmed`, `overridden`, `rejected` or `escalated` for a review; `attested` or `risk_accepted` for an attestation |
| `ocl.action.recipient`         | String   | to whom: `market_surveillance_authority`, `csirt`, `provider`, `data_subject`, …                                                                                     |
| `ocl.action.reference`         | String   | the reference the recipient gave: the number of a submitted report                                                                                                   |
| `ocl.control.objective`        | String   | the determination statement a `determine` judges, as its standard writes it: `IR-06a.`                                                                               |
| `ocl.assessment.finding`       | String   | what a `determine` found: `satisfied` or `other_than_satisfied`                                                                                                      |
| `ocl.assessment.finding_basis` | String   | why other than satisfied: `deficiency`, `insufficient_information`, `parameter_undefined`, or another                                                                |
| `ocl.assessment.method`        | String[] | how it was judged: `examine`, `interview`, `test`                                                                                                                    |
| `ocl.actor.id`                 | String   | who acted: a pseudonymous id the organisation can resolve, never a name                                                                                              |
| `ocl.actor.role`               | String   | in which role: `oversight_officer`, `dpo`, `ciso`, …                                                                                                                 |
| `ocl.evidence.ref`             | String   | a URI of what proves the action: the report, the log, the decision of the review                                                                                     |
| `ocl.evidence.digest`          | String   | its digest, `sha256:` and lower-case hexadecimal                                                                                                                     |

Any OCL span MAY also carry the business transaction it is about, `ogs.transaction.id` and `ogs.transaction.type`, as [Span-Native Governance](/specs/0.1/span-native-governance/records#business-transactions) defines them; a case takes the transaction of its current trigger.

### Levels by span kind

The level of each attribute on each kind of span: **R** Required, **Rc** Recommended, **O** Optional, **–** Not used.

| Attribute                        | trigger | obligation | action | close |
| -------------------------------- | :-----: | :--------: | :----: | :---: |
| `ocl.span.kind`                  | R       | R          | R      | R     |
| `ocl.case.id`                    | R       | R          | R      | R     |
| `ocl.trigger.type`               | R       | –          | –      | –     |
| `ocl.trigger.name`               | Rc      | –          | –      | –     |
| `ocl.subject.id`                 | R       | –          | –      | –     |
| `ocl.subject.type`               | Rc      | –          | –      | –     |
| `ocl.subject.name`               | O       | –          | –      | –     |
| `ocl.obligation.id`              | –       | R          | Rc     | –     |
| `ocl.obligation.name`            | –       | Rc         | –      | –     |
| `ocl.obligation.action`          | –       | R          | –      | –     |
| `ocl.obligation.due`             | –       | Rc         | –      | –     |
| `ocl.obligation.due_basis`       | –       | O          | –      | –     |
| `ocl.obligation.anchor`          | –       | Rc         | –      | –     |
| `ocl.obligation.owner`           | –       | O          | –      | –     |
| `ocl.obligation.quorum`          | –       | O          | –      | –     |
| `ocl.obligation.parameter`       | –       | O          | –      | –     |
| `ocl.obligation.parameter_value` | –       | O          | –      | –     |
| `ocl.obligation.recurrence`      | –       | O          | –      | –     |
| `ocl.law.id`                     | –       | R          | –      | –     |
| `ocl.law.name`                   | –       | Rc         | –      | –     |
| `ocl.law.citation`               | –       | Rc         | –      | –     |
| `ocl.law.applies_from`           | –       | O          | –      | –     |
| `ocl.law.article`                | –       | R          | –      | –     |
| `ocl.law.paragraph`              | –       | Rc         | –      | –     |
| `ocl.law.point`                  | –       | O          | –      | –     |
| `ocl.law.version`                | –       | Rc         | –      | –     |
| `ocl.law.celex`                  | –       | O          | –      | –     |
| `ocl.law.uri`                    | –       | O          | –      | –     |
| `ocl.law.supports`               | –       | O          | –      | –     |
| `ocl.party.role`                 | –       | Rc         | –      | –     |
| `ocl.action.kind`                | –       | –          | R      | –     |
| `ocl.action.result`              | –       | –          | Rc     | –     |
| `ocl.action.recipient`           | –       | –          | Rc     | –     |
| `ocl.action.reference`           | –       | –          | O      | –     |
| `ocl.control.objective`          | –       | O          | Rc     | –     |
| `ocl.assessment.finding`         | –       | –          | Rc     | –     |
| `ocl.assessment.finding_basis`   | –       | –          | O      | –     |
| `ocl.assessment.method`          | –       | –          | O      | –     |
| `ocl.actor.id`                   | –       | O          | Rc     | O     |
| `ocl.actor.role`                 | –       | O          | O      | O     |
| `ocl.evidence.ref`               | O       | O          | Rc     | O     |
| `ocl.evidence.digest`            | O       | O          | Rc     | O     |
| `ocl.case.state`                 | –       | –          | –      | R     |

Levels marked Recommended on an action apply where they make sense:

- `ocl.action.result` is Required on an `assess` and a `review`, and `ocl.actor.id` on a `review`;
- an `attest` MAY carry `ocl.action.result`, and when it does, it is `attested` or `risk_accepted`;
- `ocl.assessment.finding` is Required on a `determine`, and `ocl.control.objective` Recommended;
- `ocl.action.recipient` is Recommended on a `notify` and an `inform`.

`ocl.actor.id` on an obligation says who assessed it, or who changed it; on a close, who closed the case.

## Value rules

| Rule    | Meaning                                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types   | the OTLP primitive of the same name; a quorum MUST NOT be sent as a string                                                                                     |
| Times   | `ocl.obligation.due` is an RFC 3339 time with its offset: `2026-12-29T09:30:00Z`; a duration is ISO 8601: `P1Y`, `PT4H`                                        |
| Words   | `ocl.trigger.type`, `ocl.subject.type`, `ocl.party.role`, `ocl.obligation.anchor`, `ocl.action.recipient` and `ocl.actor.role` are `snake_case`                |
| Enums   | `ocl.span.kind`, `ocl.action.kind`, `ocl.obligation.action`, `ocl.action.result`, `ocl.assessment.finding` and `ocl.case.state` take only the values listed    |
| Empty   | an empty string is the same as an absent attribute                                                                                                             |
| Persons | an actor, an owner, an affected person or a data subject is never named: their ids are pseudonymous, and personal data for the organisation that resolves them |
| Content | a report, a complaint, a decision or a log is named by `ocl.evidence.ref` and `ocl.evidence.digest`, never copied into an attribute                            |

The last two rules matter more here than anywhere: the events that engage the law are often the ones that harmed someone.
OCL spans travel to systems that do not apply the access rules of the case; they say that a person was informed, never who.
