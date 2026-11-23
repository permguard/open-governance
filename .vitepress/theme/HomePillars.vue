<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's statement of the model: four rules every specification of the site keeps. -->
<script setup lang="ts">
import { withBase } from 'vitepress'

const pillars = [
  {
    mark: '01',
    title: 'One way in',
    text: 'OTLP traces are the only ingestion. No log format, no event bus, no bespoke API: any OpenTelemetry SDK is already a producer.'
  },
  {
    mark: '02',
    title: 'State is derived',
    text: 'Nobody writes “compliant” into a table. Decisions, risk and compliance are materialised from spans, and can be thrown away and rebuilt.'
  },
  {
    mark: '03',
    title: 'Durable by contract',
    text: 'A governance record is never sampled, acknowledged only once stored, and safe to send twice.'
  },
  {
    mark: '04',
    title: 'Unknown is a state',
    text: 'Missing evidence never reads as success. What no span proves is shown as unknown, never as fine.'
  }
]
</script>

<template>
  <section class="os-pillars">
    <header class="os-catalog__head">
      <h2>Governance, rebuilt from spans</h2>
      <p>
        Every specification here follows the same model,
        <a :href="withBase('/specs/0.1/span-native-governance/')">Span-Native Governance</a>: four rules, and everything else follows.
      </p>
    </header>
    <div class="os-pillars__grid">
      <article v-for="pillar in pillars" :key="pillar.mark" class="os-pillar">
        <span class="os-pillar__mark">{{ pillar.mark }}</span>
        <h3>{{ pillar.title }}</h3>
        <p>{{ pillar.text }}</p>
      </article>
    </div>
  </section>
</template>
