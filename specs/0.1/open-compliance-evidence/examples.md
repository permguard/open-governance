# AI Act Examples

Four cases under the AI Act, span by span, from the event to the close.
The spans are shown in the logical JSON form of the [Schema](./schema), with only the attributes that matter to the example; the organisations and systems are invented, the articles are not.

<Diagram of="oce/examples" />

The examples cite the consolidated text of the AI Act of 27 July 2026, and are dated after 2 December 2027, when its obligations for the high-risk systems of Annex III apply.
They show how the law is recorded, not how it must be read: which obligations an event engages is each organisation's assessment.

## A serious incident, from deployer to provider

Northwind HR uses **CV screening**, a high-risk AI system for the recruitment of natural persons (Annex III, point 4(a)), provided by Lumen AI.
On 10 March 2028 an internal audit shows that, since 6 March, the system filtered out applicants by a criterion tied to their origin: an infringement of obligations that protect fundamental rights, a serious incident under Article 3, point (49)(c).

Two organisations, two cases, joined by a link.

| When          | Organisation | Record                                                 | Reference |
| ------------- | ------------ | ------------------------------------------------------ | --------- |
| 10 Mar, 09:30 | Northwind HR | trigger `serious_incident`, aware                      |           |
| 10 Mar, 09:30 | Northwind HR | obligation: inform the provider                        | 26(5)     |
| 10 Mar, 10:05 | Northwind HR | action `inform`, recipient `provider`                  | 26(5)     |
| 10 Mar, 10:05 | Lumen AI     | trigger `serious_incident`, `caused_by` the inform     |           |
| 10 Mar, 11:00 | Lumen AI     | obligation: report to the authority, due 25 Mar 09:30  | 73(2)     |
| 10 Mar, 11:00 | Lumen AI     | obligation: investigate and correct                    | 73(6)     |
| 17 Mar, 16:20 | Lumen AI     | action `notify`, initial report                        | 73(2)     |
| 2 Apr         | Lumen AI     | action `remediate`, criterion removed, model retrained | 73(6)     |
| 9 Apr         | Lumen AI     | close `closed`                                         |           |

The deployer's trigger: its start is when the incident began, its end when Northwind HR became aware.

```json
{
  "resource": { "service.name": "northwind-grc", "oce.version": "0.1", "oce.organization.id": "northwind-hr" },
  "name": "serious incident",
  "start_time": "2028-03-06T00:00:00Z",
  "end_time": "2028-03-10T09:30:00Z",
  "attributes": {
    "oce.span.kind": "trigger",
    "oce.case.id": "0195c8a2-4b00-7000-8000-00000000a001",
    "oce.trigger.type": "serious_incident",
    "oce.subject.id": "cv-screening",
    "oce.subject.type": "ai_system",
    "oce.subject.name": "CV screening"
  }
}
```

Its obligation, and the action that meets it 35 minutes later:

```json
[
  { "oce.span.kind": "obligation", "oce.case.id": "0195c8a2-4b00-7000-8000-00000000a001",
    "oce.obligation.id": "ai-act-26-5", "oce.obligation.name": "Inform the provider of the serious incident",
    "oce.obligation.action": "inform",
    "oce.law.id": "eu-ai-act", "oce.law.article": "26", "oce.law.paragraph": "5", "oce.law.version": "2026-07-27",
    "oce.party.role": "deployer" },
  { "oce.span.kind": "action", "oce.case.id": "0195c8a2-4b00-7000-8000-00000000a001",
    "oce.action.kind": "inform", "oce.obligation.id": "ai-act-26-5",
    "oce.action.recipient": "provider", "oce.actor.id": "compliance-07" }
]
```

Article 26(5) says *immediately*, and sets no time: the obligation has no due, and is `met` as soon as the action arrives.

Lumen AI opens its own case, linked to the deployer's action:

```json
{
  "resource": { "service.name": "lumen-incidents", "oce.version": "0.1", "oce.organization.id": "lumen-ai" },
  "name": "serious incident",
  "end_time": "2028-03-10T10:05:00Z",
  "attributes": {
    "oce.span.kind": "trigger",
    "oce.case.id": "0195c8a2-4b00-7000-8000-00000000b001",
    "oce.trigger.type": "serious_incident",
    "oce.subject.id": "cv-screening-3",
    "oce.subject.type": "ai_system"
  },
  "links": [
    { "context": { "trace_id": "4c0a7e1d2b3f40a18e5d6c7b8a9f0e11", "span_id": "9a1b2c3d4e5f6071" },
      "attributes": { "ogs.link.relation": "caused_by" } }
  ]
}
```

Article 73(2) counts the 15 days from when the provider *or, where applicable, the deployer* became aware.
Lumen AI reads the deadline from the deployer's awareness, 10 March 09:30, the earlier of the two, and sets the due itself:

```json
{ "oce.span.kind": "obligation", "oce.case.id": "0195c8a2-4b00-7000-8000-00000000b001",
  "oce.obligation.id": "ai-act-73-2", "oce.obligation.name": "Report the serious incident to the market surveillance authority",
  "oce.obligation.action": "notify", "oce.obligation.due": "2028-03-25T09:30:00Z",
  "oce.law.id": "eu-ai-act", "oce.law.article": "73", "oce.law.paragraph": "2", "oce.law.version": "2026-07-27",
  "oce.law.celex": "32024R1689", "oce.party.role": "provider" }
```

That is why the due is data and not a formula: the law leaves a choice, and the record says which one was made.

The report, submitted on day 7 with the reference the authority gave it:

```json
{ "oce.span.kind": "action", "oce.case.id": "0195c8a2-4b00-7000-8000-00000000b001",
  "oce.action.kind": "notify", "oce.obligation.id": "ai-act-73-2",
  "oce.action.recipient": "market_surveillance_authority", "oce.action.reference": "MSA-2028-00412",
  "oce.evidence.ref": "https://evidence.lumen.example/cases/b001/initial-report.pdf",
  "oce.evidence.digest": "sha256:3b7c0e9a5d14f2c8b6a0e7d3c9f1b2a4e6d8c0b2a4f6e8d0c2b4a6f8e0d2c4b6" }
```

| Obligation    | Due           | Performed     | State |
| ------------- | ------------- | ------------- | ----- |
| `ai-act-26-5` | none          | 10 Mar, 10:05 | `met` |
| `ai-act-73-2` | 25 Mar, 09:30 | 17 Mar, 16:20 | `met` |
| `ai-act-73-6` | none          | 2 Apr         | `met` |

Article 73(5) would also have allowed an incomplete initial report followed by a complete one: both would be `notify` actions on `ai-act-73-2`, and the first would meet the deadline.

## Two people before anyone acts

Harbor Transit deploys **Gate watch**, a remote biometric identification system (Annex III, point 1(a)), where national law permits it.
At 09:12 the system reports a match against its reference database.
Article 14(5) forbids any action on it until two natural persons with the competence, training and authority to do so have separately verified and confirmed it.

The match is the trigger, linked to the system's own record of it; the verification is an obligation with a quorum of two:

```json
[
  { "oce.span.kind": "trigger", "oce.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "oce.trigger.type": "identification_match", "oce.subject.id": "gate-watch", "oce.subject.type": "ai_system" },
  { "oce.span.kind": "obligation", "oce.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "oce.obligation.id": "ai-act-14-5", "oce.obligation.name": "Separate verification by two persons",
    "oce.obligation.action": "review", "oce.obligation.quorum": 2,
    "oce.law.id": "eu-ai-act", "oce.law.article": "14", "oce.law.paragraph": "5", "oce.party.role": "deployer" }
]
```

Two officers review it, each on their own, each linking to the match they verified:

```json
[
  { "oce.span.kind": "action", "oce.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "oce.action.kind": "review", "oce.obligation.id": "ai-act-14-5", "oce.action.result": "confirmed",
    "oce.actor.id": "officer-4f1c", "oce.actor.role": "oversight_officer" },
  { "oce.span.kind": "action", "oce.case.id": "0195d1f0-9e00-7000-8000-00000000c001",
    "oce.action.kind": "review", "oce.obligation.id": "ai-act-14-5", "oce.action.result": "confirmed",
    "oce.actor.id": "officer-9a07", "oce.actor.role": "oversight_officer" }
]
```

Each review carries `ogs.link.relation = oce.reviews` to the match, and its start and end are the time the officer spent on it.

| Reviews                             | `ai-act-14-5`  | The identification                     |
| ----------------------------------- | -------------- | -------------------------------------- |
| none                                | `open`         | may not be acted upon                  |
| one `confirmed`                     | `open`, 1 of 2 | may not be acted upon                  |
| two `confirmed`, by distinct actors | `met`          | confirmed by two                       |
| one `confirmed`, one `rejected`     | `met`          | not confirmed: may not be acted upon   |
| two `confirmed`, by the same actor  | `open`, 1 of 2 | the quorum counts persons, not reviews |

The obligation is met when the verification has been done; whether its outcome allows an action is what the reviews say, and the Human review view shows both.
Article 12(3)(d) asks the system's logs to identify the persons involved in the verification: the actor ids are exactly that, and resolve to them only inside Harbor Transit.

## A contested credit decision

Fjord Bank evaluates creditworthiness with **Credit score**, a high-risk AI system (Annex III, point 5(b)), and refuses a loan on its output.
On 3 May 2028 the applicant contests the refusal and asks why.
The decision itself is an authorization decision recorded by the bank's decision point; the trigger links to it with `caused_by`.

| `oce.obligation.id` | Reference    | Action   | Due        | What                                                               |
| ------------------- | ------------ | -------- | ---------- | ------------------------------------------------------------------ |
| `gdpr-22-3`         | GDPR 22(3)   | `review` | none       | human intervention: a credit officer looks at the decision again   |
| `ai-act-86-1`       | AI Act 86(1) | `inform` | none       | a clear explanation of the system's role and of the decision       |
| `gdpr-12-3`         | GDPR 12(3)   | `inform` | 3 Jun 2028 | tell the applicant what was done about the request, within a month |

The credit officer reviews the decision and replaces it:

```json
{ "oce.span.kind": "action", "oce.case.id": "0195e2b4-1a00-7000-8000-00000000d001",
  "oce.action.kind": "review", "oce.obligation.id": "gdpr-22-3", "oce.action.result": "overridden",
  "oce.actor.id": "credit-officer-12", "oce.actor.role": "credit_officer",
  "oce.evidence.ref": "https://records.fjord.example/reviews/d001" }
```

The review links with `oce.reviews` to the original decision, and the new decision, recorded by the decision point, links with `supersedes` to the old one.
Nothing in the spans says who the applicant is, or why the loan was refused: the evidence reference leads there, inside the bank.

The explanation and the answer are two `inform` actions with `oce.action.recipient = data_subject`, one per obligation, sent on 20 May.
Both obligations are `met`; `gdpr-12-3` with 14 days to spare.

## One breach, two laws

St. Aurel Hospital, an essential entity under NIS2, deploys **Triage**, an AI system that establishes priority in emergency healthcare (Annex III, point 5(d)).
On 14 June 2028 at 22:40 the hospital learns that an attacker copied the system's patient records the night before.
One event, two laws, one case:

| When          | Record                                                                                                                   | State at close       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| 14 Jun, 22:40 | trigger `personal_data_breach`, subject `triage`                                                                         |                      |
| 14 Jun, 23:30 | obligations `nis2-23-4-a` (due 15 Jun 22:40), `nis2-23-4-b` and `gdpr-33-1` (due 17 Jun 22:40), `gdpr-34-1`, `gdpr-33-5` |                      |
| 15 Jun, 08:10 | action `notify`, early warning to the `csirt`                                                                            | `nis2-23-4-a` `met`  |
| 15 Jun, 14:00 | action `assess` on `gdpr-34-1`: `not_applicable`, the records were encrypted (GDPR 34(3)(a))                             | `gdpr-34-1` `waived` |
| 17 Jun, 11:00 | action `notify`, incident notification to the `csirt`                                                                    | `nis2-23-4-b` `met`  |
| 18 Jun, 09:15 | action `notify`, to the `supervisory_authority`, with the reasons for the delay                                          | `gdpr-33-1` `late`   |
| 18 Jun, 09:20 | obligation `nis2-23-4-d`, due 17 Jul 11:00: one month after the notification                                             |                      |
| 10 Jul        | action `record`, the breach documented                                                                                   | `gdpr-33-5` `met`    |
| 15 Jul        | action `notify`, final report                                                                                            | `nis2-23-4-d` `met`  |
| 20 Jul        | close `closed`                                                                                                           |                      |

The final report's obligation is emitted once the notification it counts from exists, with the due that gives.
The GDPR notification went out 10 hours and 35 minutes after its 72 hours: Article 33(1) allows it, with the reasons for the delay, and OCE records it as it was, `late`.
The case closes with one finding, and the register keeps it.

## What a materializer shows

Added up by law and article, the four cases give the obligation register:

| Law    | Article | Met | Late | Waived | Open | Overdue | Unmet |
| ------ | ------- | --: | ---: | -----: | ---: | ------: | ----: |
| AI Act | 14(5)   | 1   | 0    | 0      | 0    | 0       | 0     |
| AI Act | 26(5)   | 1   | 0    | 0      | 0    | 0       | 0     |
| AI Act | 73(2)   | 1   | 0    | 0      | 0    | 0       | 0     |
| AI Act | 73(6)   | 1   | 0    | 0      | 0    | 0       | 0     |
| AI Act | 86(1)   | 1   | 0    | 0      | 0    | 0       | 0     |
| GDPR   | 12(3)   | 1   | 0    | 0      | 0    | 0       | 0     |
| GDPR   | 22(3)   | 1   | 0    | 0      | 0    | 0       | 0     |
| GDPR   | 33(1)   | 0   | 1    | 0      | 0    | 0       | 0     |
| GDPR   | 33(5)   | 1   | 0    | 0      | 0    | 0       | 0     |
| GDPR   | 34(1)   | 0   | 0    | 1      | 0    | 0       | 0     |
| NIS2   | 23(4)   | 3   | 0    | 0      | 0    | 0       | 0     |

Each row leads back to its cases, each case to its records, each record to its evidence.
Nobody wrote this table: it is what the spans say.
