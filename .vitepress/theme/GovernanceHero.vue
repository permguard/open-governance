<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's banner beside the title: the whole idea in one card. Sources emit spans, the
     spans are the only way in, and the state of governance is materialised from them. The spans
     shown are illustrations, not attributes of a specification. -->
<script setup lang="ts">
const sources = ['AI agents', 'Policies', 'Decision points', 'Pipelines']

const spans = [
  { name: 'policy', detail: 'ledger v42 · published', tone: 'brand', from: 2, to: 8 },
  { name: 'decision', detail: 'agent-7 · deny', tone: 'rose', from: 14, to: 18 },
  { name: 'pipeline', detail: 'privilege-escalation', tone: 'brand', from: 22, to: 44 },
  { name: 'approval', detail: 'exception · granted', tone: 'warn', from: 50, to: 62 },
  { name: 'obligation', detail: 'AI Act 73(2) · met', tone: 'ok', from: 70, to: 78 }
]

const views = [
  { title: 'Decisions', value: '12 840', line: 'with policies', tone: 'brand' },
  { title: 'Residual risk', value: 'Medium', line: 'after 3 controls', tone: 'warn' },
  { title: 'Compliance', value: 'On time', line: '14 of 14 obligations', tone: 'ok' }
]
</script>

<template>
  <div class="os-hero-card os-gov" aria-hidden="true">
    <div class="os-hero-card__bar">
      <span class="os-hero-card__dot" /><span class="os-hero-card__dot" /><span class="os-hero-card__dot" />
      <span class="os-hero-card__file">span-native governance</span>
    </div>

    <div class="os-gov__band">
      <span class="os-gov__label">Sources</span>
      <div class="os-gov__sources">
        <span v-for="source in sources" :key="source">{{ source }}</span>
      </div>
    </div>

    <div class="os-gov__pipe"><span>OTLP · spans only</span></div>

    <ol class="os-gov__spans">
      <li v-for="(span, index) in spans" :key="index" :class="`is-${span.tone}`" :style="{ '--i': index }">
        <span class="os-gov__dot" />
        <span class="os-gov__name">{{ span.name }}</span>
        <span class="os-gov__detail">{{ span.detail }}</span>
        <span class="os-gov__track">
          <i :style="{ left: `${span.from}%`, width: `${span.to - span.from}%` }" />
        </span>
      </li>
    </ol>

    <div class="os-gov__pipe"><span>materialised</span></div>

    <div class="os-gov__views">
      <div v-for="view in views" :key="view.title" class="os-gov__view" :class="`is-${view.tone}`">
        <span class="os-gov__label">{{ view.title }}</span>
        <strong>{{ view.value }}</strong>
        <span>{{ view.line }}</span>
      </div>
    </div>
  </div>
</template>
