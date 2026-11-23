# AI Act Examples

Four cases under the AI Act, span by span, from the event to the close.
The spans are shown in the logical JSON form of the [Schema](./schema), with only the attributes that matter to the example; the organisations and systems are invented, the articles are not.

<Diagram of="ocl/examples" />

The examples cite the consolidated text of the AI Act of 27 July 2026, and are dated in 2028.
Every system in them was placed on the market or put into service after 2 December 2027, when the AI Act's obligations for the high-risk systems of Annex III apply: a system placed before then falls under them only once significantly changed (Article 111(2)).
They show how the law is recorded, not how it must be read: which obligations an event engages is each organisation's assessment, and where an example follows a policy stricter than the law, it says so.

::: info Notice
The examples are a reading aid, not legal advice.
Whether an obligation applies, its deadline and its fulfilment are for the organisation, its counsel and the competent authorities.
:::

## A serious incident, from deployer to provider

Northwind HR uses **CV screening**, a high-risk AI system for the recruitment of natural persons (Annex III, point 4(a)), provided by Lumen AI and placed on the market in January 2028.
On 10 March 2028 an internal audit shows that, since 6 March, the system filtered out applicants by a criterion tied to their origin: an infringement of obligations that protect fundamental rights, a serious incident under Article 3, point (49)(c).

Two organisations, two cases, joined by a link.

| When          | Organisation | Record                                                               | Reference    |
| ------------- | ------------ | -------------------------------------------------------------------- | ------------ |
| 10 Mar, 09:30 | Northwind HR | trigger `serious_incident`, aware                                    |              |
| 10 Mar, 09:30 | Northwind HR | obligations: inform the provider; inform the authority               | 26(5)        |
| 10 Mar, 10:05 | Northwind HR | action `inform`, recipient `provider`                                | 26(5)        |
| 10 Mar, 10:40 | Northwind HR | action `inform`, recipient `market_surveillance_authority`           | 26(5)        |
| 10 Mar, 10:05 | Lumen AI     | trigger `serious_incident`, `caused_by` the inform                   |              |
| 10 Mar, 11:00 | Lumen AI     | obligation: report to the authority, due 25 Mar 09:30, by its policy | 73(2)        |
| 11 Mar, 15:00 | Lumen AI     | action `assess`: a causal link with the system is established        | 73(2)        |
| 11 Mar, 17:20 | Lumen AI     | action `notify`, an initial, incomplete report                       | 73(2), 73(5) |
| 11 Mar, 17:30 | Lumen AI     | obligation: investigate and correct, after the report                | 73(6)        |
| 17 Mar, 16:20 | Lumen AI     | action `notify`, the complete report                                 | 73(5)        |
| 18 Mar        | Lumen AI     | action `inform`: the authority told of the planned correction        | 73(6)        |
| 2 Apr         | Lumen AI     | action `remediate`, criterion removed, model retrained               | 73(6)        |
| 9 Apr         | Lumen AI     | close `closed`                                                       |              |

The deployer's trigger: its start is when the incident began, its end when Northwind HR became aware.

```json
{
  "resource": { "service.name": "northwind-grc", "ocl.version": "0.1", "ocl.organization.id": "northwind-hr" },
  "name": "serious incident",
  "start_time": "2028-03-06T00:00:00Z",
  "end_time": "2028-03-10T09:30:00Z",
  "attributes": {
    "ocl.span.kind": "trigger",
    "ocl.case.id": "0195c8a2-4b00-7000-8000-00000000a001",
    "ocl.trigger.type": "serious_incident",
    "ocl.subject.id": "cv-screening",
    "ocl.subject.type": "ai_system",
    "ocl.subject.name": "CV screening"
  }
}
```

Its first obligation, and the action that meets it 35 minutes later; the second, informing the market surveillance authority, is performed at 10:40:

```json
[
  { "ocl.span.kind": "obligation", "ocl.case.id": "0195c8a2-4b00-7000-8000-00000000a001",
    "ocl.obligation.id": "ai-act-26-5", "ocl.obligation.name": "Inform the provider of the serious incident",
    "ocl.obligation.action": "inform",
    "ocl.law.id": "eu-ai-act", "ocl.law.article": "26", "ocl.law.paragraph": "5", "ocl.law.version": "2026-07-27",
    "ocl.party.role": "deployer" },
  { "ocl.span.kind": "action", "ocl.case.id": "0195c8a2-4b00-7000-8000-00000000a001",
    "ocl.action.kind": "inform", "ocl.obligation.id": "ai-act-26-5",
    "ocl.action.recipient": "provider", "ocl.actor.id": "compliance-07" }
]
```

Article 26(5) says *immediately*, and sets no time: the obligation has no due, and is `performed` as soon as the action arrives, with the 35 minutes since awareness shown beside it.
Article 26(5) asks to inform first the provider, then the importer or distributor and the market surveillance authorities: each recipient is an obligation of its own, so that informing only the provider never reads as done.

Lumen AI opens its own case, linked to the deployer's action:

```json
{
  "resource": { "service.name": "lumen-incidents", "ocl.version": "0.1", "ocl.organization.id": "lumen-ai" },
  "name": "serious incident",
  "end_time": "2028-03-10T10:05:00Z",
  "attributes": {
    "ocl.span.kind": "trigger",
    "ocl.case.id": "0195c8a2-4b00-7000-8000-00000000b001",
    "ocl.trigger.type": "serious_incident",
    "ocl.subject.id": "cv-screening-3",
    "ocl.subject.type": "ai_system"
  },
  "links": [
    { "context": { "trace_id": "4c0a7e1d2b3f40a18e5d6c7b8a9f0e11", "span_id": "9a1b2c3d4e5f6071" },
      "attributes": { "ogs.link.relation": "caused_by" } }
  ]
}
```

Article 73(2) asks for the report *immediately* after the provider establishes a causal link, and not later than 15 days after the provider became aware: 25 March 10:05.
Lumen AI's own incident policy counts the 15 days from the deployer's awareness, 10 March 09:30, the earlier moment; that is a policy, stricter than the law, and the record says so in `ocl.obligation.due_basis`:

```json
{ "ocl.span.kind": "obligation", "ocl.case.id": "0195c8a2-4b00-7000-8000-00000000b001",
  "ocl.obligation.id": "ai-act-73-2", "ocl.obligation.name": "Report the serious incident to the market surveillance authority",
  "ocl.obligation.action": "notify", "ocl.obligation.due": "2028-03-25T09:30:00Z",
  "ocl.obligation.anchor": "awareness", "ocl.obligation.due_basis": "org:incident-policy-3#earliest-awareness",
  "ocl.law.id": "eu-ai-act", "ocl.law.article": "73", "ocl.law.paragraph": "2", "ocl.law.version": "2026-07-27",
  "ocl.law.celex": "32024R1689", "ocl.party.role": "provider" }
```

That is why the due is data and not a formula: the record says which reading set it, and a policy is never mistaken for the law.

Lumen AI establishes the causal link on 11 March and reports the same afternoon, incomplete, as Article 73(5) allows; the complete report follows on day 7, with the reference the authority gave the first:

```json
{ "ocl.span.kind": "action", "ocl.case.id": "0195c8a2-4b00-7000-8000-00000000b001",
  "ocl.action.kind": "notify", "ocl.obligation.id": "ai-act-73-2",
  "ocl.action.recipient": "market_surveillance_authority", "ocl.action.reference": "MSA-2028-00412",
  "ocl.evidence.ref": "https://evidence.lumen.example/cases/b001/initial-report.pdf",
  "ocl.evidence.digest": "sha256:3b7c0e9a5d14f2c8b6a0e7d3c9f1b2a4e6d8c0b2a4f6e8d0c2b4a6f8e0d2c4b6" }
```

| Obligation        | Due           | Performed     | State       |
| ----------------- | ------------- | ------------- | ----------- |
| `ai-act-26-5`     | none          | 10 Mar, 10:05 | `performed` |
| `ai-act-26-5-msa` | none          | 10 Mar, 10:40 | `performed` |
| `ai-act-73-2`     | 25 Mar, 09:30 | 11 Mar, 17:20 | `met`       |
| `ai-act-73-6`     | none          | 2 Apr         | `performed` |

Both reports are `notify` actions on `ai-act-73-2`: the first meets the deadline, and the complete one is still owed and recorded.
The obligation of Article 73(6) counts from the report, its anchor `previous`; Article 73(6) forbids altering the system in a way that may affect the evaluation of the causes before informing the authorities, which is why the `inform` of 18 March precedes the retraining.
Lumen AI's own duties as a provider under Article 20, corrective action and informing the deployers, are recorded the same way, as obligations of its case.

## Two people before anyone acts

Harbor Transit, a public transport operator, deploys **Gate watch**, a remote biometric identification system (Annex III, point 1(a)), put into service in March 2028, where national law permits it.
At 09:12 the system reports a match against its reference database.
Article 14(5) forbids any action on it until at least two natural persons with the competence, training and authority to do so have separately verified and confirmed it.
Article 14 binds the system's design, and so its provider; Harbor Transit owes the verification as the deployer that must use the system as its instructions say and give its oversight to competent persons (Article 26(1) and (2)), and records it under 14(5), the text that sets it.

The match is the trigger, linked to the system's own record of it; the verification is an obligation with a quorum of two:

```json
[
  { "ocl.span.kind": "trigger", "ocl.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "ocl.trigger.type": "identification_match", "ocl.subject.id": "gate-watch", "ocl.subject.type": "ai_system" },
  { "ocl.span.kind": "obligation", "ocl.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "ocl.obligation.id": "ai-act-14-5", "ocl.obligation.name": "Separate verification by two persons",
    "ocl.obligation.action": "review", "ocl.obligation.quorum": 2,
    "ocl.obligation.anchor": "awareness",
    "ocl.law.id": "eu-ai-act", "ocl.law.article": "14", "ocl.law.paragraph": "5", "ocl.law.version": "2026-07-27",
    "ocl.party.role": "deployer" }
]
```

Two officers review it, each on their own, each linking to the match they verified:

```json
[
  { "ocl.span.kind": "action", "ocl.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "ocl.action.kind": "review", "ocl.obligation.id": "ai-act-14-5", "ocl.action.result": "confirmed",
    "ocl.actor.id": "officer-4f1c", "ocl.actor.role": "oversight_officer" },
  { "ocl.span.kind": "action", "ocl.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "ocl.action.kind": "review", "ocl.obligation.id": "ai-act-14-5", "ocl.action.result": "confirmed",
    "ocl.actor.id": "officer-9a07", "ocl.actor.role": "oversight_officer" }
]
```

Each review carries `ogs.link.relation = ocl.reviews` to the match, and its start and end are the time the officer spent on it.

| Reviews                             | `ai-act-14-5`  | The identification                     |
| ----------------------------------- | -------------- | -------------------------------------- |
| none                                | `open`         | may not be acted upon                  |
| one `confirmed`                     | `open`, 1 of 2 | may not be acted upon                  |
| two `confirmed`, by distinct actors | `performed`    | confirmed by two                       |
| one `confirmed`, one `rejected`     | `performed`    | not confirmed: may not be acted upon   |
| two `confirmed`, by the same actor  | `open`, 1 of 2 | the quorum counts persons, not reviews |

The law sets no time, only an order: *before any action or decision*.
The obligation has no due, and is `performed` once two distinct persons have reviewed; a producer whose own policy sets a time, four hours, sets the due and names that policy in `ocl.obligation.due_basis`.

The obligation is performed when the verification has been done; whether its outcome allows an action is what the reviews say, and the Human review view shows both.
Article 12(3)(d) asks the system's own logs to identify the persons involved in the verification; the actor ids are Harbor Transit's pseudonyms for them, resolvable only inside Harbor Transit, and complement those logs, never replace them.

Harbor Transit provides a public service, so it also owes a fundamental rights impact assessment before first using Gate watch (Article 27(1)): a standing obligation, recorded once, outside this case.

## A contested credit decision

Fjord Bank evaluates creditworthiness with **Credit score**, a high-risk AI system (Annex III, point 5(b)) put into service in February 2028, and refuses a loan by a decision based solely on its output, which Article 22(2)(a) GDPR allows for entering into a contract.
On 3 May 2028 the applicant contests the refusal and asks why.
The decision itself is an authorization decision recorded by the bank's decision point; the trigger links to it with `caused_by`.

| `ocl.obligation.id` | Reference     | Action   | Due        | Anchor  | What                                                                   |
| ------------------- | ------------- | -------- | ---------- | ------- | ---------------------------------------------------------------------- |
| `gdpr-22-3`         | GDPR 22(3)    | `review` | none       | receipt | human intervention: a credit officer looks at the decision again       |
| `gdpr-15-1-h`       | GDPR 15(1)(h) | `inform` | none       | receipt | meaningful information about the logic involved                        |
| `ai-act-86-1`       | AI Act 86(1)  | `inform` | none       | receipt | a clear explanation of the system's role, where not otherwise provided |
| `gdpr-12-3`         | GDPR 12(3)    | `inform` | 3 Jun 2028 | receipt | tell the applicant what was done about the request, within a month     |

The credit officer reviews the decision and replaces it:

```json
{ "ocl.span.kind": "action", "ocl.case.id": "0195e2b4-1a00-7000-8000-00000000d001",
  "ocl.action.kind": "review", "ocl.obligation.id": "gdpr-22-3", "ocl.action.result": "overridden",
  "ocl.actor.id": "credit-officer-12", "ocl.actor.role": "credit_officer",
  "ocl.evidence.ref": "https://records.fjord.example/reviews/d001" }
```

The review links with `ocl.reviews` to the original decision, and the new decision, recorded by the decision point, links with `supersedes` to the old one.
Nothing in the spans says who the applicant is, or why the loan was refused: the evidence reference leads there, inside the bank.

Article 86(3) gives the right to an explanation only where Union law does not otherwise provide it; here GDPR Articles 15(1)(h) and 22(3) do, so the bank records an `assess` on `ai-act-86-1` with `not_applicable`, citing them.
The explanation and the answer are two `inform` actions with `ocl.action.recipient = data_subject`, one per obligation, sent on 20 May.

| Obligation    | State                         |
| ------------- | ----------------------------- |
| `gdpr-22-3`   | `performed`                   |
| `gdpr-15-1-h` | `performed`                   |
| `ai-act-86-1` | `not_applicable`              |
| `gdpr-12-3`   | `met`, 14 days before its due |

As the deployer of a system that takes decisions about natural persons, Fjord Bank also owes them the information of Article 26(11), and a fundamental rights impact assessment before first use (Article 27(1), for Annex III point 5(b)): standing obligations, recorded once, outside this case.

## One breach, two laws

St. Aurel Hospital, an essential entity under NIS2, deploys **Triage**, an AI system that establishes priority in emergency healthcare (Annex III, point 5(d)).
On 14 June 2028 at 22:40 the hospital learns that an attacker copied the system's patient records the night before.
One event, two laws, one case:

| When          | Record                                                                                                                                   | State at close                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 14 Jun, 22:40 | trigger `personal_data_breach`, subject `triage`                                                                                         |                                |
| 14 Jun, 23:30 | obligations `nis2-23-4-a` (due 15 Jun 22:40), `nis2-23-4-b` and `gdpr-33-1` (due 17 Jun 22:40), `gdpr-34-1`, `gdpr-33-5`, `ai-act-26-5`  |                                |
| 15 Jun, 08:10 | action `notify`, early warning to the `csirt`                                                                                            | `nis2-23-4-a` `met`            |
| 15 Jun, 14:00 | action `assess` on `gdpr-34-1`: `not_applicable`, the records were encrypted and the key out of reach (GDPR 34(3)(a)), with the evidence | `gdpr-34-1` `not_applicable`   |
| 15 Jun, 15:00 | action `assess` on `ai-act-26-5`: `not_applicable`, the breach did not stem from Triage's functioning                                    | `ai-act-26-5` `not_applicable` |
| 17 Jun, 11:00 | action `notify`, incident notification to the `csirt`                                                                                    | `nis2-23-4-b` `met`            |
| 18 Jun, 09:15 | action `notify`, to the `supervisory_authority`, with the reasons for the delay                                                          | `gdpr-33-1` `late`             |
| 18 Jun, 09:20 | obligation `nis2-23-4-d`, due 17 Jul 11:00: one month after the notification                                                             |                                |
| 10 Jul        | action `record`, the breach documented                                                                                                   | `gdpr-33-5` `performed`        |
| 15 Jul        | action `notify`, final report                                                                                                            | `nis2-23-4-d` `met`            |
| 20 Jul        | close `closed`                                                                                                                           |                                |

The final report's obligation is emitted once the notification it counts from exists, with the due that gives.
The GDPR notification went out 10 hours and 35 minutes after its 72 hours, with the reasons for the delay that Article 33(1) asks of a late notification; OCL records it as it was, `late`, and the reasons are its evidence.
Whether the breach engages the AI Act too is an assessment, recorded: Triage is a high-risk system, and a serious incident of it would oblige the hospital, as deployer, to inform the provider (Article 26(5)).
The case closes with one finding, and the register keeps it.

## What a materializer shows

Added up by law and article, the four cases give the obligation register:

| Law    | Article | By the due | After the due | Performed, no due | Not applicable | Open | Overdue | Unmet |
| ------ | ------- | ---------: | ------------: | ----------------: | -------------: | ---: | ------: | ----: |
| AI Act | 14(5)   | 0          | 0             | 1                 | 0              | 0    | 0       | 0     |
| AI Act | 26(5)   | 0          | 0             | 2                 | 1              | 0    | 0       | 0     |
| AI Act | 73(2)   | 1          | 0             | 0                 | 0              | 0    | 0       | 0     |
| AI Act | 73(6)   | 0          | 0             | 1                 | 0              | 0    | 0       | 0     |
| AI Act | 86(1)   | 0          | 0             | 0                 | 1              | 0    | 0       | 0     |
| GDPR   | 12(3)   | 1          | 0             | 0                 | 0              | 0    | 0       | 0     |
| GDPR   | 15(1)   | 0          | 0             | 1                 | 0              | 0    | 0       | 0     |
| GDPR   | 22(3)   | 0          | 0             | 1                 | 0              | 0    | 0       | 0     |
| GDPR   | 33(1)   | 0          | 1             | 0                 | 0              | 0    | 0       | 0     |
| GDPR   | 33(5)   | 0          | 0             | 1                 | 0              | 0    | 0       | 0     |
| GDPR   | 34(1)   | 0          | 0             | 0                 | 1              | 0    | 0       | 0     |
| NIS2   | 23(4)   | 3          | 0             | 0                 | 0              | 0    | 0       | 0     |

Each row leads back to its cases, each case to its records, each record to its evidence.
Nobody wrote this table: it is what the spans say, against the deadlines the organisations entered, and it is no verdict on whether they met the law.
