<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- Stages joined by arrows: across the page when it is wide enough, down it when it is not. -->
<script setup lang="ts">
import type { FlowDiagram } from './types'
import Soft from './Soft.vue'

defineProps<{ diagram: FlowDiagram }>()
</script>

<template>
  <div class="os-flow">
    <template v-for="(stage, index) in diagram.stages" :key="stage.title">
      <div v-if="index > 0" class="os-flow__arrow">
        <span v-if="diagram.arrows?.[index - 1]" class="os-flow__via">{{ diagram.arrows[index - 1] }}</span>
      </div>
      <section class="os-flow__stage">
        <h4 class="os-flow__title">{{ stage.title }}</h4>
        <div v-for="item in stage.items" :key="item.label" class="os-flow__item" :class="item.tone && `is-${item.tone}`">
          <strong><Soft :text="item.label" /></strong>
          <span v-if="item.sub"><Soft :text="item.sub" /></span>
        </div>
      </section>
    </template>
  </div>
</template>
