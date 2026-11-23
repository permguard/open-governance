# Legal References

An obligation cites the law or the standard that asks for it, down to the point, so that obligations can be added up by law and by article across every case.
This page fixes how a reference is written, which laws and standards have an id, and what the obligations of five EU laws look like as OCE records.

<Diagram of="oce/laws" />

::: info Notice
This page is a reading aid, not legal advice.
Whether an obligation applies, its deadline and its fulfilment are for the organisation, its counsel and the competent authorities.
The texts cited are consolidated versions, which have no legal effect: only the texts published in the Official Journal of the European Union are authentic.
:::

## A reference, in parts

A law cites itself as *Article 23(4)(a)*; OCE records the same reference in parts, so that a materializer can group by any of them.

| As the text reads                | `oce.law.id`           | `.article` | `.paragraph` | `.point` |
| -------------------------------- | ---------------------- | ---------- | ------------ | -------- |
| AI Act, Article 73(2)            | `eu-ai-act`            | `73`       | `2`          |          |
| AI Act, Article 3, point (49)(b) | `eu-ai-act`            | `3`        |              | `49.b`   |
| GDPR, Article 33(1)              | `eu-gdpr`              | `33`       | `1`          |          |
| NIS2, Article 23(4)(a)           | `eu-nis2`              | `23`       | `4`          | `a`      |
| NIS2, Article 23(4)(d)(i)        | `eu-nis2`              | `23`       | `4`          | `d.i`    |
| NIST CSF 2.0, DE.AE-08           | `std:nist-csf-2.0`     | `DE.AE`    | `08`         |          |
| SP 800-53, IR-6b                 | `std:nist-sp-800-53r5` | `IR-6`     |              | `b`      |

Article and paragraph are strings, so that an inserted article, *5a*, or point, *ba*, keeps its name.
A point nested in a point is written with `.`, outermost first.

A text changes.
`oce.law.version` names the text the obligation was read from: a law by the date of its consolidated version, a standard by its version or the date of its release.
The AI Act read here is the consolidation of 27 July 2026, after Regulation (EU) 2026/1744.
Two obligations under the same article, read from two versions, are both kept; a materializer can show them apart.

## Law ids

| `oce.law.id`       | Law                                                                               | CELEX        |
| ------------------ | --------------------------------------------------------------------------------- | ------------ |
| `eu-ai-act`        | Regulation (EU) 2024/1689, the Artificial Intelligence Act                        | `32024R1689` |
| `eu-gdpr`          | Regulation (EU) 2016/679, the General Data Protection Regulation                  | `32016R0679` |
| `eu-nis2`          | Directive (EU) 2022/2555, NIS 2                                                   | `32022L2555` |
| `eu-dora`          | Regulation (EU) 2022/2554, Digital Operational Resilience                         | `32022R2554` |
| `eu-dora-2025-301` | Delegated Regulation (EU) 2025/301, the content and time limits of DORA's reports | `32025R0301` |
| `eu-cra`           | Regulation (EU) 2024/2847, the Cyber Resilience Act                               | `32024R2847` |

Another EU act takes `eu-` and a short name of its own, with its CELEX number in `oce.law.celex`; an act that implements or supplements another has an id of its own, as the delegated regulation of DORA has.
A national law takes its country's ISO 3166 code: `it:dlgs-138-2024`, the Italian transposition of NIS2.
An organisation's own rule takes `org:` and its id: `org:ai-policy-4`, so that internal obligations are counted beside the law's and never mistaken for it.
A standard takes `std:` and its id ([Standards](#standards)).

A directive is cited as it is, `eu-nis2`; the national law that transposes it MAY be cited instead, or as a second obligation beside it.

A materializer counts laws, standards and the organisation's own rules apart: an obligation under `std:` or `org:` is never added to a law's figures.

## Standards

A standard is not a law.
An obligation that cites one records an outcome the organisation adopted, in its profile, its statement of applicability, its plan or a contract, never a duty the standard imposes by itself.
None of the standards below sets a deadline of its own: the due is always the organisation's, and `oce.obligation.due_basis` names the rule or the contract that sets it.

| `oce.law.id`             | Standard                                               | `.article`              | `.paragraph`      | `.point`             | `.version`   | `oce.law.uri`                               |
| ------------------------ | ------------------------------------------------------ | ----------------------- | ----------------- | -------------------- | ------------ | ------------------------------------------- |
| `std:nist-csf-2.0`       | NIST Cybersecurity Framework 2.0 (CSWP 29)             | category, `DE.AE`       | subcategory, `08` |                      | `2024-02-26` | `https://doi.org/10.6028/NIST.CSWP.29`      |
| `std:nist-sp-800-61r3`   | NIST SP 800-61 Rev. 3, incident response               | category, `RS.CO`       | subcategory, `02` | recommendation, `R5` | `2025-04`    | `https://doi.org/10.6028/NIST.SP.800-61r3`  |
| `std:nist-ai-rmf`        | NIST AI Risk Management Framework (AI 100-1)           | function, `GOVERN`      | `1.1`             |                      | `1.0`        | `https://doi.org/10.6028/NIST.AI.100-1`     |
| `std:nist-ai-600-1`      | NIST AI 600-1, the Generative AI Profile               | function, `GOVERN`      | `1.1`             | action, `001`        | `2024-07`    | `https://doi.org/10.6028/NIST.AI.600-1`     |
| `std:nist-sp-800-53r5`   | NIST SP 800-53 Rev. 5, with SP 800-53A for assessing   | control, `IR-6`         | enhancement, `1`  | item, `b`            | the release  | `https://doi.org/10.6028/NIST.SP.800-53r5`  |
| `std:nist-sp-800-171r3`  | NIST SP 800-171 Rev. 3                                 | requirement, `03.06.02` | item, `b`         | `01`                 | `2024-05`    | `https://doi.org/10.6028/NIST.SP.800-171r3` |
| `std:iso-iec-27001-2022` | ISO/IEC 27001:2022                                     | clause, `9.2`           |                   |                      | `2022`       |                                             |
| `std:iso-iec-27002-2022` | ISO/IEC 27002:2022                                     | control, `8.16`         |                   |                      | `2022`       |                                             |
| `std:itu-t-x1051`        | ITU-T X.1051 (06/2023), the text of ISO/IEC 27011:2024 | control, `5.24`         |                   |                      | `2023-06-13` |                                             |

| Rule               | Meaning                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Revision in the id | only where the numbering changed between revisions: SP 800-171 r2 numbers `3.6.2`, r3 `03.06.02`; otherwise the date or release is `.version`           |
| One id per text    | X.1051 and ISO/IEC 27011:2024 are one text: `std:itu-t-x1051` for both, so that a control is never counted twice                                        |
| As printed         | the parts follow the standard's own levels, written as it prints them; a typo of the source is corrected when cited                                     |
| The text cited     | cite the document whose text sets the duty: a control X.1051 only adopts from ISO/IEC 27002 is cited under `std:iso-iec-27002-2022`                     |
| Parameters         | a value the standard leaves to the organisation, `IR-06_ODP[01]`, is named in `oce.obligation.parameter`, its value in `.parameter_value`               |
| Objectives         | an assessment of a control judges determination statements, `IR-06a.`, as SP 800-53A writes them, in `oce.control.objective`                            |
| Crosswalk          | a law's obligation that also evidences a standard's outcome lists it in `oce.law.supports`, `std:nist-ai-rmf#MANAGE 4.3`: it counts once, under the law |

A view of standards shows each one as *adopted, voluntary*, its outcomes by category, and *no record* where nothing was recorded, never *clear*.
A tier, a profile or a maturity level is what the organisation attested, with who and when; a materializer never derives one, and never shows a score.

## The obligations of five laws

The tables below are a reading aid: the obligations each law's articles set when an event happens, written as OCE obligation records.
They are not legal advice, and not complete.
Which obligations an event engages, whether its thresholds are reached, which role the organisation plays, is the organisation's assessment, and OCE records it as such ([Cases](./cases)).

Each row names the anchor its due counts from ([Cases](./cases#the-clock-starts-at-the-anchor)).
Where a law says *without undue delay and in any event within*, both limbs bind: the hours are the outer limit, never an allowance, and the due records the outer limit.
A period expressed in hours starts at the beginning of the hour after the event (Regulation (EEC, Euratom) No 1182/71, Article 3(1)); a producer that sets the due by a stricter reading says so in `oce.obligation.due_basis`.

### AI Act

Regulation (EU) 2024/1689, consolidated text of 27 July 2026.
Its obligations for the high-risk AI systems of Annex III apply from 2 December 2027, and for those of Annex I from 2 August 2028 (Article 113, third paragraph).
A high-risk system placed on the market or put into service before those dates falls under them only once significantly changed in its design (Article 111(2)); systems used by public authorities by 2 August 2030.
Articles 73 and 86 apply from 2 August 2026, and bite on a system once its classification as high-risk applies.

| Event                  | Reference            | Party      | Action      | Due                                                             | Anchor    | What                                                                                                               |
| ---------------------- | -------------------- | ---------- | ----------- | --------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| `serious_incident`     | 26(5)                | `deployer` | `inform`    | immediately                                                     | awareness | inform first the provider, then the importer or distributor and the market surveillance authorities                |
| `serious_incident`     | 73(2)                | `provider` | `notify`    | immediately after a causal link is established; at most 15 days | awareness | report to the market surveillance authorities of each Member State where it occurred                               |
| `serious_incident`     | 73(3)                | `provider` | `notify`    | immediately; at most 2 days                                     | awareness | the same, for a widespread infringement or a serious and irreversible disruption of critical infrastructure        |
| `serious_incident`     | 73(4)                | `provider` | `notify`    | immediately; at most 10 days                                    | awareness | the same, for the death of a person, once a causal link is established or suspected                                |
| `serious_incident`     | 73(6)                | `provider` | `remediate` | without delay                                                   | previous  | investigate, assess the risk and take corrective action, after the report                                          |
| `identification_match` | 26(1)–(2) with 14(5) | `deployer` | `review`    | before any action or decision, quorum 2                         | awareness | separate verification and confirmation by at least two natural persons with the competence, training and authority |
| `risk_identified`      | 26(5)                | `deployer` | `inform`    | without undue delay                                             | awareness | inform the provider or distributor and the relevant market surveillance authority                                  |
| `risk_identified`      | 26(5)                | `deployer` | `remediate` | without undue delay                                             | awareness | suspend the use of the system                                                                                      |
| `risk_identified`      | 20(2)                | `provider` | `remediate` | immediately                                                     | awareness | investigate the causes, and inform the market surveillance authorities and the notified body                       |
| `contested_decision`   | 86(1)                | `deployer` | `inform`    | none set                                                        | receipt   | a clear and meaningful explanation of the system's role and of the decision, on request                            |
| standing               | 26(6)                | `deployer` | `record`    | kept at least six months                                        |           | keep the logs the system generated, as far as they are under the deployer's control                                |

The provider's 15 days of Article 73(2) count from the provider's own awareness.
A deployer that cannot reach the provider reports itself, and Article 73 then applies to it (Article 26(5), first subparagraph).
Article 73(5) allows an initial report that is incomplete, followed by a complete one: both are `notify` actions on the same obligation; the first meets its deadline, and the complete one is still owed.
Article 73(6) forbids altering the system in a way that may affect the evaluation of the causes before informing the authorities: a `remediate` that precedes the report is shown as such.

Article 14 is a requirement of the system's design, binding the provider (Article 16(a)); what the deployer owes is to use the system as its instructions say and to assign the oversight to competent persons (Article 26(1) and (2)), which is why the verification of 14(5) is cited through them.
The second subparagraph of Article 14(5) exempts law enforcement, migration, border control and asylum where Union or national law deems the requirement disproportionate: an `assess` with `not_applicable`, citing the ground.

Article 86(3) gives the right to an explanation only where it is not otherwise provided under Union law, such as GDPR Articles 22(3) and 15(1)(h): an `assess` on `ai-act-86-1` records which.

### GDPR

Regulation (EU) 2016/679.

| Event                  | Reference | Party        | Action   | Due                                                              | Anchor    | What                                                                                          |
| ---------------------- | --------- | ------------ | -------- | ---------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| `personal_data_breach` | 33(1)     | `controller` | `notify` | without undue delay and, where feasible, not later than 72 hours | awareness | notify the competent supervisory authority, unless the breach is unlikely to result in a risk |
| `personal_data_breach` | 33(2)     | `processor`  | `inform` | without undue delay                                              | awareness | notify the controller, from the processor's own awareness                                     |
| `personal_data_breach` | 33(4)     | `controller` | `notify` | without undue further delay                                      | previous  | the information not available at first, in phases                                             |
| `personal_data_breach` | 33(5)     | `controller` | `record` | none set                                                         | awareness | document every breach, its effects and the remedial action                                    |
| `personal_data_breach` | 34(1)     | `controller` | `inform` | without undue delay                                              | awareness | communicate the breach to the data subjects, when the risk is high                            |
| `data_subject_request` | 12(3)     | `controller` | `inform` | without undue delay, and within one month                        | receipt   | inform the data subject of the action taken on a request under Articles 15 to 22              |
| `data_subject_request` | 12(4)     | `controller` | `inform` | without delay, and at the latest within one month                | receipt   | where no action is taken: the reasons, and the right to complain and to a judicial remedy     |
| `contested_decision`   | 22(3)     | `controller` | `review` | none set                                                         | receipt   | human intervention, the person's point of view, the contest of the decision                   |

A notification after 72 hours carries the reasons for the delay (Article 33(1), second sentence): it is recorded as it was, `late`, with the reasons as its evidence.
The exception of Article 33(1), a breach unlikely to result in a risk, is an `assess` action with `not_applicable`; Article 33(5) still asks that the breach be documented.
The exemptions of Article 34(3) are `assess` actions with `not_applicable`, citing the ground and its evidence; a supervisory authority may still require the communication (Article 34(4)), which reopens it as a new obligation.

The month of Article 12(3) may be extended by two further months, where the data subject is told of the extension and its reasons within the first month: the extended obligation `supersedes` the first, and the telling is an obligation of its own.
Article 22(3) applies only to decisions under Article 22(2)(a) or (c).

### NIS2

Directive (EU) 2022/2555, as transposed by each Member State.

| Event                  | Reference | Party                                  | Action   | Due                                                            | Anchor    | What                                                          |
| ---------------------- | --------- | -------------------------------------- | -------- | -------------------------------------------------------------- | --------- | ------------------------------------------------------------- |
| `significant_incident` | 23(4)(a)  | `essential_entity`, `important_entity` | `notify` | without undue delay, and in any event within 24 hours          | awareness | early warning to the CSIRT or the competent authority         |
| `significant_incident` | 23(4)(b)  | `essential_entity`, `important_entity` | `notify` | without undue delay, and in any event within 72 hours          | awareness | incident notification                                         |
| `significant_incident` | 23(4)(b)  | `trust_service_provider`               | `notify` | within 24 hours                                                | awareness | incident notification, for an incident of its trust services  |
| `authority_request`    | 23(4)(c)  | `essential_entity`, `important_entity` | `notify` | none set                                                       | request   | intermediate report, on request of the CSIRT or authority     |
| `significant_incident` | 23(4)(d)  | `essential_entity`, `important_entity` | `notify` | not later than one month after the incident notification       | previous  | final report                                                  |
| `significant_incident` | 23(4)(e)  | `essential_entity`, `important_entity` | `notify` | at the time of the final report, then one month after handling | previous  | a progress report, where the incident is still ongoing        |
| `significant_incident` | 23(1)     | `essential_entity`, `important_entity` | `inform` | without undue delay                                            | awareness | the recipients of the service likely to be adversely affected |

The clock of Article 23(4) starts at awareness of the incident as significant, which is an assessment first.

### DORA

Regulation (EU) 2022/2554, with the time limits of Delegated Regulation (EU) 2025/301, Article 5.
Its event is an ICT-related incident; the classification as major, under Article 18(1) and Delegated Regulation (EU) 2024/1772, is an `assess` action, and the initial notification counts from it.

| Event                | Reference                       | Party              | Action   | Due                                                                                   | Anchor         | What                                               |
| -------------------- | ------------------------------- | ------------------ | -------- | ------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------- |
| `major_ict_incident` | 18(1)                           | `financial_entity` | `assess` | none set                                                                              | awareness      | classify the incident                              |
| `major_ict_incident` | 19(4)(a), with 2025/301 5(1)(a) | `financial_entity` | `notify` | within four hours from classification as major, no later than 24 hours from awareness | classification | initial notification to the competent authority    |
| `major_ict_incident` | 19(4)(b), with 2025/301 5(1)(b) | `financial_entity` | `notify` | within 72 hours from the submission of the initial notification                       | previous       | intermediate report                                |
| `major_ict_incident` | 19(4)(c), with 2025/301 5(1)(c) | `financial_entity` | `notify` | no later than one month after the latest intermediate report                          | previous       | final report                                       |
| `major_ict_incident` | 19(3)                           | `financial_entity` | `inform` | without undue delay                                                                   | awareness      | the clients whose financial interests are affected |

The initial notification's due is the earlier of its two limits; an incident classified as major more than 24 hours after awareness has four hours from its classification (Article 5(2)).
The due cites the delegated regulation: `oce.obligation.due_basis` = `eu-dora-2025-301#5`.
Informing the authority that a limit cannot be met (Article 5(3)) is an `inform` of its own, and never meets the report.
A limit that ends on a weekend or a bank holiday may move to noon of the next working day (Article 5(4)), except for the initial and intermediate reports of credit institutions, central counterparties, trading venues and entities that are essential or important under NIS2 (Article 5(5)): the producer sets the due accordingly, and says so.

DORA is the specific law for financial entities: a financial entity records DORA 19, not NIS2 23, for the same incident (DORA Article 1(2), NIS2 Article 4).
Where a Member State asks for a copy to its NIS2 CSIRT, that is a second obligation, citing the national law.

### Cyber Resilience Act

Regulation (EU) 2024/2847.
Its reporting obligations of Article 14 apply from 11 September 2026, also to products already on the market (Articles 69(3) and 71(2)).
Reports go to the CSIRT designated as coordinator and to ENISA at once, through the single reporting platform (Article 14(1), (3) and (7)).

| Event                     | Reference | Party          | Action   | Due                                                                         | Anchor    | What                                          |
| ------------------------- | --------- | -------------- | -------- | --------------------------------------------------------------------------- | --------- | --------------------------------------------- |
| `exploited_vulnerability` | 14(2)(a)  | `manufacturer` | `notify` | without undue delay, and in any event within 24 hours                       | awareness | early warning                                 |
| `exploited_vulnerability` | 14(2)(b)  | `manufacturer` | `notify` | without undue delay, and in any event within 72 hours                       | awareness | vulnerability notification                    |
| `exploited_vulnerability` | 14(2)(c)  | `manufacturer` | `notify` | no later than 14 days after a corrective or mitigating measure is available | release   | final report                                  |
| `severe_incident`         | 14(4)(a)  | `manufacturer` | `notify` | without undue delay, and in any event within 24 hours                       | awareness | early warning                                 |
| `severe_incident`         | 14(4)(b)  | `manufacturer` | `notify` | without undue delay, and in any event within 72 hours                       | awareness | incident notification                         |
| `severe_incident`         | 14(4)(c)  | `manufacturer` | `notify` | within one month after the incident notification                            | previous  | final report                                  |
| `authority_request`       | 14(6)     | `manufacturer` | `notify` | none set                                                                    | request   | an intermediate report the CSIRT asks for     |
| `exploited_vulnerability` | 14(8)     | `manufacturer` | `inform` | none set                                                                    | awareness | the impacted users, and where appropriate all |

The notifications and the reports under 14(2)(b), (c) and 14(4)(b), (c) are owed *unless the information has already been provided*: an earlier report that carried it meets the later obligation, recorded as a `notify` naming it, with the earlier report's reference.

## One event, several laws

An event often engages more than one law at once.
A breach of the patient records an emergency triage system works on, at a hospital that is an essential entity, engages the GDPR and NIS2 in the same case:

| `oce.obligation.id` | Reference     | Due                          | Anchor    |
| ------------------- | ------------- | ---------------------------- | --------- |
| `nis2-23-4-a`       | NIS2 23(4)(a) | awareness + 24 hours         | awareness |
| `gdpr-33-1`         | GDPR 33(1)    | awareness + 72 hours         | awareness |
| `nis2-23-4-b`       | NIS2 23(4)(b) | awareness + 72 hours         | awareness |
| `gdpr-34-1`         | GDPR 34(1)    | none: without undue delay    | awareness |
| `nis2-23-4-d`       | NIS2 23(4)(d) | the notification + one month | previous  |

Each obligation is counted under its own law; the case is one ([AI Act Examples](./examples#one-breach-two-laws)).

The same event may engage a standard the organisation adopted beside the law: an adverse event declared an incident under NIST CSF DE.AE-08, then reported under the law.
The law's obligation carries the law's clock; the standard's is a separate `std:` obligation with the organisation's due, or a `oce.law.supports` entry on the law's own.
