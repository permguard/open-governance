// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

/**
 * The diagrams that open the pages of a specification. Each is data: a page names it with
 * `<Diagram of="..." />`, and one of four layouts draws it, in both themes and at every width.
 */
export type Tone = 'brand' | 'muted' | 'ok' | 'warn' | 'error'

/** Stages from left to right, joined by arrows; top to bottom on a narrow screen. */
export interface FlowDiagram {
  type: 'flow'
  stages: { title: string; items: { label: string; sub?: string; tone?: Tone }[] }[]
  /** The label of each arrow, between a stage and the next. */
  arrows?: string[]
  caption: string
}

/** Boxes inside boxes: what holds what. */
export interface NestBox {
  title: string
  /** What the box is in the underlying standard: `resource`, `trace`, `span`. */
  tag?: string
  /** The box repeats inside its parent. */
  many?: boolean
  chips?: string[]
  children?: NestBox[]
  /** Children side by side rather than stacked. */
  row?: boolean
  tone?: Tone
}

export interface NestDiagram {
  type: 'nest'
  root: NestBox
  caption: string
}

/** Small graphs side by side, each a shape a pipeline can take. */
export interface Shape {
  title: string
  line: string
  /** At most three columns, so that a card stays readable on a phone. */
  nodes: { id: string; label: string; col: number; row: number; tone?: Tone }[]
  edges: [from: string, to: string][]
}

export interface ShapesDiagram {
  type: 'shapes'
  shapes: Shape[]
  caption: string
}

/** Spans on a time line, one lane each, as a trace viewer draws them. */
export interface LanesDiagram {
  type: 'lanes'
  lanes: { label: string; depth?: number; bars: { from: number; to: number; label?: string; tone?: Tone }[] }[]
  /** What the start and the end of the time line are. */
  axis: [start: string, end: string]
  caption: string
}

export type Diagram = FlowDiagram | NestDiagram | ShapesDiagram | LanesDiagram
