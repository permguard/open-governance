# Legal References

An obligation cites the law that asks for it, down to the point, so that obligations can be added up by law and by article across every case.
This page fixes how a reference is written, which laws have an id, and what the obligations of five EU laws look like as OCE records.

<Diagram of="oce/laws" />

## A reference, in parts

A law cites itself as *Article 23(4)(a)*; OCE records the same reference in parts, so that a materializer can group by any of them.

| As the law reads                 | `oce.law.id` | `.article` | `.paragraph` | `.point` |
| -------------------------------- | ------------ | ---------- | ------------ | -------- |
| AI Act, Article 73(2)            | `eu-ai-act`  | `73`       | `2`          |          |
| AI Act, Article 14(5)            | `eu-ai-act`  | `14`       | `5`          |          |
| AI Act, Article 3, point (49)(b) | `eu-ai-act`  | `3`        |              | `49.b`   |
| GDPR, Article 33(1)              | `eu-gdpr`    | `33`       | `1`          |          |
| NIS2, Article 23(4)(a)           | `eu-nis2`    | `23`       | `4`          | `a`      |
| NIS2, Article 23(4)(d)(i)        | `eu-nis2`    | `23`       | `4`          | `d.i`    |

Article and paragraph are strings, so that an inserted article, *5a*, or point, *ba*, keeps its name.
A point nested in a point is written with `.`, outermost first.

A law changes.
`oce.law.version` names the text the obligation was read from, by the date of its consolidated version: the AI Act read here is the consolidation of 27 July 2026, after Regulation (EU) 2026/1744.
Two obligations under the same article, read from two versions, are both kept; a materializer can show them apart.

## Law ids

| `oce.law.id` | Law                                                              | CELEX        |
| ------------ | ---------------------------------------------------------------- | ------------ |
| `eu-ai-act`  | Regulation (EU) 2024/1689, the Artificial Intelligence Act       | `32024R1689` |
| `eu-gdpr`    | Regulation (EU) 2016/679, the General Data Protection Regulation | `32016R0679` |
| `eu-nis2`    | Directive (EU) 2022/2555, NIS 2                                  | `32022L2555` |
| `eu-dora`    | Regulation (EU) 2022/2554, Digital Operational Resilience        | `32022R2554` |
| `eu-cra`     | Regulation (EU) 2024/2847, the Cyber Resilience Act              | `32024R2847` |

Another EU act takes `eu-` and a short name of its own, with its CELEX number in `oce.law.celex`.
A national law takes its country's ISO 3166 code: `it:dlgs-138-2024`, the Italian transposition of NIS2.
An organisation's own rule takes `org:` and its id: `org:ai-policy-4`, so that internal obligations are counted beside the law's and never mistaken for it.

A directive is cited as it is, `eu-nis2`; the national law that transposes it MAY be cited instead, or as a second obligation beside it.

## The obligations of five laws

The tables below are a reading aid: the obligations each law's articles set when an event happens, written as OCE obligation records.
They are not legal advice, and not complete.
Which obligations an event engages, whether its thresholds are reached, which role the organisation plays, is the organisation's assessment, and OCE records it as such ([Cases](./cases)).

The deadlines run from awareness of the event, the end of the trigger span, unless the row says otherwise.

### AI Act

Regulation (EU) 2024/1689, consolidated text of 27 July 2026.
Its obligations for high-risk AI systems of Annex III apply from 2 December 2027, and for those of Annex I from 2 August 2028 (Article 113).

| Event                  | Reference | Party      | Action      | Due                         | What                                                                                |
| ---------------------- | --------- | ---------- | ----------- | --------------------------- | ----------------------------------------------------------------------------------- |
| `serious_incident`     | 26(5)     | `deployer` | `inform`    | immediately                 | inform first the provider, then the importer or distributor and the authorities     |
| `serious_incident`     | 73(2)     | `provider` | `notify`    | 15 days                     | report to the market surveillance authority of the Member State where it occurred   |
| `serious_incident`     | 73(3)     | `provider` | `notify`    | 2 days                      | the same, for a widespread infringement or a disruption of critical infrastructure  |
| `serious_incident`     | 73(4)     | `provider` | `notify`    | 10 days                     | the same, for the death of a person                                                 |
| `serious_incident`     | 73(6)     | `provider` | `remediate` | without delay               | investigate, assess the risk and take corrective action                             |
| `identification_match` | 14(5)     | `deployer` | `review`    | before any action, quorum 2 | separate verification and confirmation by two competent natural persons             |
| `contested_decision`   | 86(1)     | `deployer` | `inform`    | none set                    | clear and meaningful explanation of the AI system's role and of the decision        |
| `risk_identified`      | 26(5)     | `deployer` | `remediate` | without undue delay         | suspend the use of the system, and inform the provider and the authority            |
| any                    | 26(6)     | `deployer` | `record`    | kept at least six months    | keep the logs the system generated, as far as they are under the deployer's control |

Article 73(5) allows an initial report that is incomplete, followed by a complete one: both are `notify` actions on the same obligation, and the first one meets its deadline.

### GDPR

Regulation (EU) 2016/679.

| Event                  | Reference | Party        | Action   | Due                        | What                                                                                |
| ---------------------- | --------- | ------------ | -------- | -------------------------- | ----------------------------------------------------------------------------------- |
| `personal_data_breach` | 33(1)     | `controller` | `notify` | 72 hours                   | notify the supervisory authority, unless the breach is unlikely to result in a risk |
| `personal_data_breach` | 33(2)     | `processor`  | `inform` | without undue delay        | notify the controller                                                               |
| `personal_data_breach` | 33(5)     | `controller` | `record` | none set                   | document the breach, its effects and the remedial action                            |
| `personal_data_breach` | 34(1)     | `controller` | `inform` | without undue delay        | communicate the breach to the data subjects, when the risk is high                  |
| `contested_decision`   | 22(3)     | `controller` | `review` | none set                   | human intervention, on a decision based solely on automated processing              |
| `contested_decision`   | 12(3)     | `controller` | `inform` | one month from the request | inform the data subject of the action taken on the request                          |

The exception of Article 33(1), a breach unlikely to result in a risk, is an `assess` action with `not_applicable`; Article 33(5) still asks that the breach be documented.

### NIS2

Directive (EU) 2022/2555, as transposed by each Member State.

| Event                  | Reference | Party                                  | Action   | Due                                       | What                                             |
| ---------------------- | --------- | -------------------------------------- | -------- | ----------------------------------------- | ------------------------------------------------ |
| `significant_incident` | 23(4)(a)  | `essential_entity`, `important_entity` | `notify` | 24 hours                                  | early warning to the CSIRT or authority          |
| `significant_incident` | 23(4)(b)  | `essential_entity`, `important_entity` | `notify` | 72 hours                                  | incident notification                            |
| `significant_incident` | 23(4)(d)  | `essential_entity`, `important_entity` | `notify` | one month after the incident notification | final report                                     |
| `significant_incident` | 23(1)     | `essential_entity`, `important_entity` | `inform` | without undue delay                       | the recipients of the service, where appropriate |

### DORA

Regulation (EU) 2022/2554.

| Event                | Reference | Party              | Action   | Due                                  | What                                               |
| -------------------- | --------- | ------------------ | -------- | ------------------------------------ | -------------------------------------------------- |
| `major_ict_incident` | 19(4)(a)  | `financial_entity` | `notify` | the time limits set under Article 20 | initial notification to the competent authority    |
| `major_ict_incident` | 19(4)(b)  | `financial_entity` | `notify` | the time limits set under Article 20 | intermediate report                                |
| `major_ict_incident` | 19(4)(c)  | `financial_entity` | `notify` | the time limits set under Article 20 | final report                                       |
| `major_ict_incident` | 19(3)     | `financial_entity` | `inform` | without undue delay                  | the clients whose financial interests are affected |

DORA leaves its time limits to the technical standards adopted under Article 20; a producer sets `oce.obligation.due` from the standard in force, and cites it in `oce.law.version`.

### Cyber Resilience Act

Regulation (EU) 2024/2847.

| Event                     | Reference | Party          | Action   | Due                                             | What                                               |
| ------------------------- | --------- | -------------- | -------- | ----------------------------------------------- | -------------------------------------------------- |
| `exploited_vulnerability` | 14(2)(a)  | `manufacturer` | `notify` | 24 hours                                        | early warning, to the coordinating CSIRT and ENISA |
| `exploited_vulnerability` | 14(2)(b)  | `manufacturer` | `notify` | 72 hours                                        | vulnerability notification                         |
| `exploited_vulnerability` | 14(2)(c)  | `manufacturer` | `notify` | 14 days after a corrective measure is available | final report                                       |
| `severe_incident`         | 14(4)(a)  | `manufacturer` | `notify` | 24 hours                                        | early warning                                      |
| `severe_incident`         | 14(4)(b)  | `manufacturer` | `notify` | 72 hours                                        | incident notification                              |
| `severe_incident`         | 14(4)(c)  | `manufacturer` | `notify` | one month after the incident notification       | final report                                       |

## One event, several laws

An event often engages more than one law at once.
A breach of the patient records an emergency triage system works on, at a hospital that is an essential entity, engages the GDPR and NIS2 in the same case:

| `oce.obligation.id` | Reference     | Due                          |
| ------------------- | ------------- | ---------------------------- |
| `nis2-23-4-a`       | NIS2 23(4)(a) | awareness + 24 hours         |
| `gdpr-33-1`         | GDPR 33(1)    | awareness + 72 hours         |
| `nis2-23-4-b`       | NIS2 23(4)(b) | awareness + 72 hours         |
| `gdpr-34-1`         | GDPR 34(1)    | none: without undue delay    |
| `nis2-23-4-d`       | NIS2 23(4)(d) | the notification + one month |

Each obligation is counted under its own law; the case is one ([AI Act Examples](./examples#one-breach-two-laws)).
