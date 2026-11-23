<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- Spans on a time line: a lane each, its bars placed by percent of the line. -->
<script setup lang="ts">
import type { LanesDiagram } from './types'

defineProps<{ diagram: LanesDiagram }>()
</script>

<template>
  <div class="os-lanes">
    <div v-for="lane in diagram.lanes" :key="lane.label" class="os-lane">
      <span class="os-lane__label" :style="{ paddingLeft: `${(lane.depth ?? 0) * 14}px` }">
        <span v-if="lane.depth" class="os-lane__elbow">└</span>{{ lane.label }}
      </span>
      <div class="os-lane__track">
        <span
          v-for="bar in lane.bars"
          :key="bar.from"
          class="os-lane__bar"
          :class="bar.tone && `is-${bar.tone}`"
          :style="{ left: `${bar.from}%`, width: `${Math.max(bar.to - bar.from, 1.2)}%` }"
          :title="bar.label"
        >{{ bar.label }}</span>
      </div>
    </div>
    <div class="os-lane os-lane--axis">
      <span class="os-lane__label" />
      <div class="os-lane__axis"><span>{{ diagram.axis[0] }}</span><span>{{ diagram.axis[1] }}</span></div>
    </div>
  </div>
</template>
