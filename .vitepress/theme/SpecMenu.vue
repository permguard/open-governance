<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import type { Spec } from '../specs'

// The specification menu at the top of the sidebar: one entry per specification, its icon and its
// name, the one in view marked. Below it, the sidebar lists the pages of that specification.
const { theme } = useData()
const route = useRoute()
const specs = computed(() => (theme.value.specs ?? []) as Spec[])
const current = computed(() => {
  const path = route.path.replace(/^\/+/, '/')
  return specs.value.find((spec) => path.includes(`/${spec.id}/`) || path.endsWith(`/${spec.id}`))?.id
})
</script>

<template>
  <nav class="os-spec-menu" aria-label="Specifications">
    <a
      v-for="spec in specs"
      :key="spec.id"
      class="os-spec-menu__item"
      :class="{ 'is-current': spec.id === current }"
      :href="withBase(`/${spec.id}/`)"
      :aria-current="spec.id === current ? 'page' : undefined"
    >
      <svg class="os-spec-menu__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="spec.icon" />
      <span class="os-spec-menu__text">
        <span class="os-spec-menu__title">{{ spec.title }}</span>
        <span class="os-spec-menu__meta">{{ spec.short }} · v{{ spec.version }} · {{ spec.status }}</span>
      </span>
    </a>
  </nav>
</template>
