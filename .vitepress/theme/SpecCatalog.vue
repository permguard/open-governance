<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's catalogue: every specification, grouped by its area of governance, each a card
     that opens it. -->
<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { specLink, specs } from '../specs'

const domains = computed(() => {
  const groups = new Map<string, typeof specs>()
  for (const spec of specs) groups.set(spec.domain, [...(groups.get(spec.domain) ?? []), spec])
  return [...groups]
})
</script>

<template>
  <section class="os-catalog">
    <header class="os-catalog__head">
      <h2>Specifications</h2>
      <p>Each specification is a contract any product can implement. Open one to read it.</p>
    </header>
    <section v-for="[domain, members] in domains" :key="domain" class="os-catalog__domain">
      <h3>{{ domain }}</h3>
      <div class="os-catalog__grid">
        <a v-for="spec in members" :key="spec.id" class="os-spec-card" :href="withBase(specLink(spec))">
          <span class="os-spec-card__top">
            <svg class="os-spec-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="spec.icon" />
            <span class="os-spec-card__title">{{ spec.title }}</span>
          </span>
          <span class="os-spec-card__meta">
            <span class="os-spec-card__chip">{{ spec.short }}</span>
            <span class="os-spec-card__chip">v{{ spec.version }}</span>
            <span class="os-spec-card__chip" :class="`is-${spec.status}`">{{ spec.status }}</span>
          </span>
          <span class="os-spec-card__line">{{ spec.line }}</span>
          <span class="os-spec-card__go">Read the specification <span aria-hidden="true">→</span></span>
        </a>
      </div>
    </section>
  </section>
</template>
