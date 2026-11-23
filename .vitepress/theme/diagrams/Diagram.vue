<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- A diagram that opens a page: `<Diagram of="odl/architecture" />` draws the diagram of that
     name in its layout, with its caption under it. -->
<script setup lang="ts">
import { computed } from 'vue'
import { diagrams } from '../../diagrams'
import FlowLayout from './FlowLayout.vue'
import NestLayout from './NestLayout.vue'
import ShapesLayout from './ShapesLayout.vue'
import LanesLayout from './LanesLayout.vue'

const props = defineProps<{ of: string }>()
const diagram = computed(() => diagrams[props.of])
</script>

<template>
  <figure v-if="diagram" class="os-diagram dark">
    <FlowLayout v-if="diagram.type === 'flow'" :diagram="diagram" />
    <NestLayout v-else-if="diagram.type === 'nest'" :box="diagram.root" />
    <ShapesLayout v-else-if="diagram.type === 'shapes'" :diagram="diagram" />
    <LanesLayout v-else-if="diagram.type === 'lanes'" :diagram="diagram" />
    <figcaption>{{ diagram.caption }}</figcaption>
  </figure>
  <p v-else class="os-diagram-missing">No diagram named {{ of }}.</p>
</template>
