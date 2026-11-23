<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's scope: every area of governance the specifications cover, those already
     written linking to their specification, the others marked planned. -->
<script setup lang="ts">
import { withBase } from 'vitepress'
import { specLink, specs } from '../specs'

const areas = [
  { title: 'Decision governance', line: 'Decisions by people, applications and agents: their context, rationale, outcome and lineage.', spec: 'open-decision-lineage' },
  { title: 'Risk', line: 'Risks assessed, scored and treated: appetite, acceptance, and the residual risk that remains.' },
  { title: 'Compliance', line: 'Requirements, controls and the state of compliance, with the evidence behind every claim.' },
  { title: 'Security operations', line: 'Signals from the SOC and threat intelligence, the findings they raise, the response they get.' },
  { title: 'Human oversight', line: 'Approvals, reviews, escalations and overrides: who decided, on whose authority.' },
  { title: 'Policy and enforcement', line: 'Policies evaluated and enforced, with their obligations, exceptions and conflicts.' },
  { title: 'Audit and evidence', line: 'Verifiable records, chains of custody, and evidence that holds up in an audit.' },
  { title: 'Identity and access', line: 'Who and what acts: people, workloads and agents, their grants and elevations.' },
  { title: 'Data governance', line: 'Classification, lineage, purpose, residency and retention of data.' },
  { title: 'Incidents and remediation', line: 'Incidents from triage to postmortem, and the remediation that closes them.' },
  { title: 'Change and third parties', line: 'Inventories, dependencies, changes, and the suppliers a system relies on.' },
  { title: 'Operations', line: 'The health of the systems governance depends on, and the controls that watch them.' }
]

const specOf = (id?: string) => specs.find((spec) => spec.id === id)
</script>

<template>
  <section class="os-areas">
    <header class="os-catalog__head">
      <h2>Every part of governance</h2>
      <p>One model, one specification per contract, across every area an organisation has to govern, from IT operations to the board.</p>
    </header>
    <div class="os-areas__grid">
      <component
        :is="specOf(area.spec) ? 'a' : 'div'"
        v-for="area in areas"
        :key="area.title"
        class="os-area"
        :class="specOf(area.spec) ? 'is-live' : 'is-planned'"
        :href="specOf(area.spec) ? withBase(specLink(specOf(area.spec)!)) : undefined"
      >
        <span class="os-area__head">
          <strong>{{ area.title }}</strong>
          <span class="os-area__state">{{ specOf(area.spec) ? specOf(area.spec)!.short : 'planned' }}</span>
        </span>
        <span class="os-area__line">{{ area.line }}</span>
      </component>
    </div>
  </section>
</template>
