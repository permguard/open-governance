<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's catalogue: every specification side by side, each a card that names its area of
     governance and opens it; one only announced is shown, dimmed and planned, and opens nothing. -->
<script setup lang="ts">
import { withBase } from 'vitepress'
import { specLink, specs } from '../specs'
</script>

<template>
  <section class="os-catalog">
    <header class="os-catalog__head">
      <h2>Specifications</h2>
      <p>Each specification is a contract any product can implement. Open one to read it.</p>
    </header>
    <div class="os-catalog__grid">
      <component
        :is="spec.announced ? 'div' : 'a'"
        v-for="spec in specs"
        :key="spec.id"
        class="os-spec-card"
        :class="spec.announced && 'is-announced'"
        :href="spec.announced ? undefined : withBase(specLink(spec))"
      >
        <span class="os-spec-card__domain">{{ spec.domain }}</span>
        <span class="os-spec-card__top">
          <svg class="os-spec-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="spec.icon" />
          <span class="os-spec-card__title">{{ spec.title }}</span>
        </span>
        <span class="os-spec-card__meta">
          <span class="os-spec-card__chip">{{ spec.short }}</span>
          <span class="os-spec-card__chip">v{{ spec.version }}</span>
          <span v-if="spec.announced" class="os-spec-card__chip">{{ spec.status }}</span>
        </span>
        <span class="os-spec-card__line">{{ spec.line }}</span>
        <span v-if="spec.announced" class="os-spec-card__soon">Not yet published</span>
        <span v-else class="os-spec-card__go">Read the specification <span aria-hidden="true">→</span></span>
      </component>
    </div>
  </section>
</template>
