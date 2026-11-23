<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's banner beside the title: the whole idea in one card. Sources emit spans, the
     spans are the only way in, and the state of governance is materialised from them. The spans
     shown are illustrations, not attributes of a specification. -->
<script setup lang="ts">
const sources = ['AI agents', 'Decision points', 'SOC · CTI', 'Controls']

const spans = [
  { name: 'decision', detail: 'agent-7 · deny', tone: 'brand', from: 2, to: 9 },
  { name: 'control', detail: 'CTRL-002 · failed', tone: 'error', from: 16, to: 24 },
  { name: 'approval', detail: 'exception · granted', tone: 'warn', from: 30, to: 46 },
  { name: 'risk', detail: 'payment-service · high', tone: 'warn', from: 52, to: 60 },
  { name: 'control', detail: 'CTRL-002 · passed', tone: 'ok', from: 70, to: 78 }
]

const views = [
  { title: 'Decision history', value: '12 840', line: 'with their inputs', tone: 'brand' },
  { title: 'Risk posture', value: 'High', line: 'payment-service', tone: 'warn' },
  { title: 'Compliance', value: 'Compliant', line: '2 of 2 controls', tone: 'ok' }
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
