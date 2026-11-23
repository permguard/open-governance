# Release 0.1

The specifications of Open Governance as published in release 0.1.
A release is published whole: its pages stay as they are once a newer release comes out, under its own path, `/specs/0.1/`.

<SpecCatalog version="0.1" />

## Changes

Release 0.1 is a draft: it gains attributes as the first implementations prove it, and keeps what a receiver already knows.

### 23 November 2026

| Specification           | Change                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Span-Native Governance  | business transaction ids, `ogs.transaction.id`, `.type` and `.ids`; one specification per resource; the same ids with other content are a conflict                                                                        |
| Span-Native Governance  | records from the future do not count; conflict is a state; the authority is part of every view; the transaction flow; pseudonymous ids are personal data                                                                  |
| Open Compliance Lineage | actions `attest`, `escalate` and `determine`; `ocl.obligation.anchor`, `.owner`, `.due_basis`, `.parameter`, `.parameter_value`, `.recurrence`                                                                            |
| Open Compliance Lineage | `ocl.law.uri`, `ocl.law.supports`, `ocl.control.objective`, `ocl.assessment.finding`, `.finding_basis`, `.method`; the `std:` namespace for standards                                                                     |
| Open Compliance Lineage | the states `conflict`, `not_applicable`, `performed` and `pending`, in a fixed order; `waived` is now `not_applicable`; the case states `conflict` and `untriggered`; the subject state `no_findings` in place of `clear` |
| Open Compliance Lineage | triggers `authority_request`, `data_subject_request`, `adverse_event`, `control_assessment`, `weakness_identified`, `significant_change`; the legal references corrected, with an anchor per obligation                   |
| Open Decision Lineage   | `ogs.transaction.ids` on a step that writes findings                                                                                                                                                                      |
| Open Compliance Lineage | renamed from Open Compliance Evidence, OCE: the namespace moved with it, `oce.*` is now `ocl.*`, the relation `oce.reviews` is `ocl.reviews`, and the pages are under `/specs/0.1/open-compliance-lineage/`               |
