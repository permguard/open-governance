# Attributes

Every OCE attribute is in the `oce.` namespace, with dot-separated segments in `snake_case`.
OCE reuses OpenTelemetry's attributes where one exists for the same concept.

<Diagram of="oce/attributes" />

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

| Attribute               | Type   | Level       | Meaning                                                                        |
| ----------------------- | ------ | ----------- | ------------------------------------------------------------------------------ |
| `oce.version`           | String | Required    | `"0.1"`: the version of this specification the spans follow; it makes them OCE |
| `oce.organization.id`   | String | Required    | the organisation the obligations fall on, stable: `northwind-hr`               |
| `oce.organization.name` | String | Recommended | the name a person reads: `Northwind HR`; the id when absent                    |
| `service.name`          | String | Recommended | OpenTelemetry's own: the system that emitted the spans                         |

## Span attributes

### The case and its trigger

| Attribute          | Type   | Meaning                                                                                           |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------- |
| `oce.span.kind`    | String | `trigger`, `obligation`, `action` or `close`                                                      |
| `oce.case.id`      | String | the case, a UUIDv7                                                                                |
| `oce.trigger.type` | String | what happened: `serious_incident`, `personal_data_breach`, … ([Cases](./cases#what-opens-a-case)) |
| `oce.subject.id`   | String | what the case is about: `cv-screening`                                                            |
| `oce.subject.type` | String | `ai_system`, `product`, `service`, `processing`, `ict_service`, `system`, or another              |
| `oce.subject.name` | String | the name a person reads; the id when absent                                                       |
| `oce.case.state`   | String | `closed` or `withdrawn`                                                                           |

### The obligation

| Attribute                        | Type     | Meaning                                                                                                                       |
| -------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `oce.obligation.id`              | String   | the obligation, unique within its case: `ai-act-73-2`                                                                         |
| `oce.obligation.name`            | String   | what it asks, as a person reads it: `Report the serious incident`                                                             |
| `oce.obligation.action`          | String   | the kind of action that meets it: one of the nine of `oce.action.kind`                                                        |
| `oce.obligation.due`             | String   | when it must be met, an RFC 3339 time; none when nobody set one                                                               |
| `oce.obligation.due_basis`       | String   | what set the due when the law did not: the organisation's rule or contract, `org:ir-plan-2#sev2`                              |
| `oce.obligation.anchor`          | String   | the record the due counts from: `awareness`, `classification`, `receipt`, … ([Cases](./cases#the-clock-starts-at-the-anchor)) |
| `oce.obligation.owner`           | String   | who must see it done: a pseudonymous id or a team, never a name                                                               |
| `oce.obligation.quorum`          | Int      | how many distinct actors must perform the action; 1 when absent                                                               |
| `oce.obligation.parameter`       | String   | the organisation-defined parameter the obligation depends on, as its standard names it: `IR-06_ODP[01]`                       |
| `oce.obligation.parameter_value` | String   | the value the organisation gave it: an ISO 8601 duration, `PT1H`, or text                                                     |
| `oce.obligation.recurrence`      | String   | how often a standing obligation comes back, an ISO 8601 duration: `P1Y`                                                       |
| `oce.law.id`                     | String   | the law or standard: `eu-ai-act`, `eu-gdpr`, `std:nist-csf-2.0`, … ([Legal References](./laws))                               |
| `oce.law.article`                | String   | the article, or the standard's first level: `73`, `DE.AE`, `IR-6`                                                             |
| `oce.law.paragraph`              | String   | the paragraph, or the second level: `2`, `08`                                                                                 |
| `oce.law.point`                  | String   | the point, nested points joined by `.`: `a`, `49.b`, `d.i`                                                                    |
| `oce.law.version`                | String   | the text the obligation was read from: a consolidated text by its date, `2026-07-27`, a standard by its version               |
| `oce.law.celex`                  | String   | the law's CELEX number, for the EU's own: `32024R1689`                                                                        |
| `oce.law.uri`                    | String   | where the text is, for a law or standard with no CELEX: a DOI or a URL                                                        |
| `oce.law.supports`               | String[] | the outcomes of a standard this obligation also evidences: `std:nist-ai-rmf#MANAGE 4.3`                                       |
| `oce.party.role`                 | String   | the role the law gives the organisation: `provider`, `deployer`, `controller`, …                                              |

### The action

| Attribute                      | Type     | Meaning                                                                                                                                                              |
| ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oce.action.kind`              | String   | `assess`, `review`, `notify`, `inform`, `remediate`, `record`, `attest`, `escalate` or `determine`                                                                   |
| `oce.action.result`            | String   | `applies` or `not_applicable` for an assessment; `confirmed`, `overridden`, `rejected` or `escalated` for a review; `attested` or `risk_accepted` for an attestation |
| `oce.action.recipient`         | String   | to whom: `market_surveillance_authority`, `csirt`, `provider`, `data_subject`, …                                                                                     |
| `oce.action.reference`         | String   | the reference the recipient gave: the number of a submitted report                                                                                                   |
| `oce.control.objective`        | String   | the determination statement a `determine` judges, as its standard writes it: `IR-06a.`                                                                               |
| `oce.assessment.finding`       | String   | what a `determine` found: `satisfied` or `other_than_satisfied`                                                                                                      |
| `oce.assessment.finding_basis` | String   | why other than satisfied: `deficiency`, `insufficient_information`, `parameter_undefined`, or another                                                                |
| `oce.assessment.method`        | String[] | how it was judged: `examine`, `interview`, `test`                                                                                                                    |
| `oce.actor.id`                 | String   | who acted: a pseudonymous id the organisation can resolve, never a name                                                                                              |
| `oce.actor.role`               | String   | in which role: `oversight_officer`, `dpo`, `ciso`, …                                                                                                                 |
| `oce.evidence.ref`             | String   | a URI of what proves the action: the report, the log, the decision of the review                                                                                     |
| `oce.evidence.digest`          | String   | its digest, `sha256:` and lower-case hexadecimal                                                                                                                     |

Any OCE span MAY also carry the business transaction it is about, `ogs.transaction.id` and `ogs.transaction.type`, as [Span-Native Governance](/specs/0.1/span-native-governance/records#business-transactions) defines them; a case takes the transaction of its current trigger.

### Levels by span kind

The level of each attribute on each kind of span: **R** Required, **Rc** Recommended, **O** Optional, **–** Not used.

| Attribute                        | trigger | obligation | action | close |
| -------------------------------- | :-----: | :--------: | :----: | :---: |
| `oce.span.kind`                  | R       | R          | R      | R     |
| `oce.case.id`                    | R       | R          | R      | R     |
| `oce.trigger.type`               | R       | –          | –      | –     |
| `oce.subject.id`                 | R       | –          | –      | –     |
| `oce.subject.type`               | Rc      | –          | –      | –     |
| `oce.subject.name`               | O       | –          | –      | –     |
| `oce.obligation.id`              | –       | R          | Rc     | –     |
| `oce.obligation.name`            | –       | Rc         | –      | –     |
| `oce.obligation.action`          | –       | R          | –      | –     |
| `oce.obligation.due`             | –       | Rc         | –      | –     |
| `oce.obligation.due_basis`       | –       | O          | –      | –     |
| `oce.obligation.anchor`          | –       | Rc         | –      | –     |
| `oce.obligation.owner`           | –       | O          | –      | –     |
| `oce.obligation.quorum`          | –       | O          | –      | –     |
| `oce.obligation.parameter`       | –       | O          | –      | –     |
| `oce.obligation.parameter_value` | –       | O          | –      | –     |
| `oce.obligation.recurrence`      | –       | O          | –      | –     |
| `oce.law.id`                     | –       | R          | –      | –     |
| `oce.law.article`                | –       | R          | –      | –     |
| `oce.law.paragraph`              | –       | Rc         | –      | –     |
| `oce.law.point`                  | –       | O          | –      | –     |
| `oce.law.version`                | –       | Rc         | –      | –     |
| `oce.law.celex`                  | –       | O          | –      | –     |
| `oce.law.uri`                    | –       | O          | –      | –     |
| `oce.law.supports`               | –       | O          | –      | –     |
| `oce.party.role`                 | –       | Rc         | –      | –     |
| `oce.action.kind`                | –       | –          | R      | –     |
| `oce.action.result`              | –       | –          | Rc     | –     |
| `oce.action.recipient`           | –       | –          | Rc     | –     |
| `oce.action.reference`           | –       | –          | O      | –     |
| `oce.control.objective`          | –       | O          | Rc     | –     |
| `oce.assessment.finding`         | –       | –          | Rc     | –     |
| `oce.assessment.finding_basis`   | –       | –          | O      | –     |
| `oce.assessment.method`          | –       | –          | O      | –     |
| `oce.actor.id`                   | –       | O          | Rc     | O     |
| `oce.actor.role`                 | –       | O          | O      | O     |
| `oce.evidence.ref`               | O       | O          | Rc     | O     |
| `oce.evidence.digest`            | O       | O          | Rc     | O     |
| `oce.case.state`                 | –       | –          | –      | R     |

Levels marked Recommended on an action apply where they make sense:

- `oce.action.result` is Required on an `assess` and a `review`, and `oce.actor.id` on a `review`;
- an `attest` MAY carry `oce.action.result`, and when it does, it is `attested` or `risk_accepted`;
- `oce.assessment.finding` is Required on a `determine`, and `oce.control.objective` Recommended;
- `oce.action.recipient` is Recommended on a `notify` and an `inform`.

`oce.actor.id` on an obligation says who assessed it, or who changed it; on a close, who closed the case.

## Value rules

| Rule    | Meaning                                                                                                                                                        |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types   | the OTLP primitive of the same name; a quorum MUST NOT be sent as a string                                                                                     |
| Times   | `oce.obligation.due` is an RFC 3339 time with its offset: `2026-12-29T09:30:00Z`; a duration is ISO 8601: `P1Y`, `PT4H`                                        |
| Words   | `oce.trigger.type`, `oce.subject.type`, `oce.party.role`, `oce.obligation.anchor`, `oce.action.recipient` and `oce.actor.role` are `snake_case`                |
| Enums   | `oce.span.kind`, `oce.action.kind`, `oce.obligation.action`, `oce.action.result`, `oce.assessment.finding` and `oce.case.state` take only the values listed    |
| Empty   | an empty string is the same as an absent attribute                                                                                                             |
| Persons | an actor, an owner, an affected person or a data subject is never named: their ids are pseudonymous, and personal data for the organisation that resolves them |
| Content | a report, a complaint, a decision or a log is named by `oce.evidence.ref` and `oce.evidence.digest`, never copied into an attribute                            |

The last two rules matter more here than anywhere: the events that engage the law are often the ones that harmed someone.
OCE spans travel to systems that do not apply the access rules of the case; they say that a person was informed, never who.
