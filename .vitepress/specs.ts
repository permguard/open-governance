// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

/**
 * Every specification of the site, in the order the specification menu lists them. A new
 * specification is a folder of pages and one entry here: the menu, its sidebar and the home page
 * follow from it.
 */
export interface Spec {
  /** The folder, and the first segment of every route of the specification. */
  id: string
  title: string
  /** The short name the specification goes by. */
  short: string
  /** One line: what the specification is for. */
  line: string
  /** The area of governance it belongs to, under which the home page lists it. */
  domain: string
  /** `draft`, `development`, `stable` or `deprecated`: how far the specification can be relied on. */
  status: 'draft' | 'development' | 'stable' | 'deprecated'
  version: string
  /** A Lucide icon's SVG body, drawn at 24 x 24 with a 2 px stroke. */
  icon: string
  /** The sections of the sidebar, each a title and its pages, as `[title, slug]`. */
  sections: { title: string; pages: [title: string, slug: string][] }[]
}

export const specs: Spec[] = [
  {
    id: 'span-native-governance',
    title: 'Span-Native Governance',
    short: 'SNG',
    line: 'The model every specification here shares: governance records as OpenTelemetry spans, state materialised from them.',
    domain: 'Foundation',
    status: 'draft',
    version: '0',
    // Lucide `layers`.
    icon: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    sections: [
      { title: 'Foundation', pages: [['Overview', '']] },
      {
        title: 'Model',
        pages: [['Records', 'records'], ['Delivery', 'delivery'], ['Materialization', 'materialization'], ['Privacy', 'privacy']]
      },
      { title: 'Authoring', pages: [['Writing a Specification', 'writing']] }
    ]
  },
  {
    id: 'open-decision-lineage',
    title: 'Open Decision Lineage',
    short: 'ODL',
    line: 'What pipelines that analyse authorization decision logs do with them, as OpenTelemetry traces.',
    domain: 'Decision Governance',
    status: 'development',
    version: '1',
    // Lucide `workflow`.
    icon: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
    sections: [
      { title: 'Specification', pages: [['Overview', '']] },
      { title: 'Concepts', pages: [['Pipelines', 'pipelines'], ['Data Model', 'data-model'], ['Span Kinds', 'span-kinds']] },
      { title: 'Reference', pages: [['Attributes', 'attributes'], ['Lineage', 'lineage']] },
      { title: 'Interpretation', pages: [['Runs and Health', 'runs'], ['Receivers', 'receivers']] },
      { title: 'In Practice', pages: [['Field Guide', 'field-guide']] }
    ]
  }
]

export const specLink = (spec: Spec, slug = '') => `/${spec.id}/${slug}`
