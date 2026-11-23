<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- One box of a nesting, and the boxes it holds, drawn by the same component. -->
<script setup lang="ts">
import type { NestBox } from './types'
import Soft from './Soft.vue'

defineOptions({ name: 'NestLayout' })
defineProps<{ box: NestBox }>()
</script>

<template>
  <div class="os-nest" :class="[box.tone && `is-${box.tone}`, box.many && 'is-many']">
    <div class="os-nest__head">
      <strong>{{ box.title }}</strong>
      <span v-if="box.many" class="os-nest__many">× n</span>
      <span v-if="box.tag" class="os-nest__tag">{{ box.tag }}</span>
    </div>
    <div v-if="box.chips?.length" class="os-nest__chips">
      <code v-for="chip in box.chips" :key="chip"><Soft :text="chip" /></code>
    </div>
    <div v-if="box.children?.length" class="os-nest__children" :class="box.row && 'is-row'">
      <NestLayout v-for="child in box.children" :key="child.title" :box="child" />
    </div>
  </div>
</template>
