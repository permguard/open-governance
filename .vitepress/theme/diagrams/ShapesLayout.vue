<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- Small graphs in cards: each node at its column and row, each edge from the right of one node
     to the left of the next. -->
<script setup lang="ts">
import type { Shape, ShapesDiagram } from './types'

defineProps<{ diagram: ShapesDiagram }>()

const COL = 84
const ROW = 34
const W = 66
const H = 24
const PAD = 4

const size = (shape: Shape) => {
  const cols = Math.max(...shape.nodes.map(node => node.col)) + 1
  const rows = Math.max(...shape.nodes.map(node => node.row)) + 1
  return { width: (cols - 1) * COL + W + PAD * 2, height: (rows - 1) * ROW + H + PAD * 2 }
}

const at = (shape: Shape, id: string) => {
  const node = shape.nodes.find(candidate => candidate.id === id)!
  return { x: PAD + node.col * COL, y: PAD + node.row * ROW }
}

const path = (shape: Shape, from: string, to: string) => {
  const a = at(shape, from)
  const b = at(shape, to)
  const x1 = a.x + W
  const y1 = a.y + H / 2
  const x2 = b.x - 5
  const y2 = b.y + H / 2
  const mid = (x1 + x2) / 2
  return `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`
}

const head = (shape: Shape, to: string) => {
  const b = at(shape, to)
  const y = b.y + H / 2
  return `${b.x},${y} ${b.x - 6},${y - 3.5} ${b.x - 6},${y + 3.5}`
}
</script>

<template>
  <div class="os-shapes">
    <section v-for="shape in diagram.shapes" :key="shape.title" class="os-shape">
      <h4>{{ shape.title }}</h4>
      <svg
        :viewBox="`0 0 ${size(shape).width} ${size(shape).height}`"
        :width="size(shape).width"
        role="img"
        :aria-label="shape.title"
      >
        <g v-for="[from, to] in shape.edges" :key="from + to" class="os-shape__edge">
          <path :d="path(shape, from, to)" />
          <polygon :points="head(shape, to)" />
        </g>
        <g v-for="node in shape.nodes" :key="node.id" class="os-shape__node" :class="node.tone && `is-${node.tone}`">
          <rect :x="PAD + node.col * COL" :y="PAD + node.row * ROW" :width="W" :height="H" rx="5" />
          <text :x="PAD + node.col * COL + W / 2" :y="PAD + node.row * ROW + H / 2 + 4">{{ node.label }}</text>
        </g>
      </svg>
      <p>{{ shape.line }}</p>
    </section>
  </div>
</template>
