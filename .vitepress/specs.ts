// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

/**
 * Every specification of the site, in the order the specification menu lists them. A new
 * specification is a folder of pages and one entry here: the menu, its sidebar and the home page
 * follow from it.
 */
export interface Spec {
  /** The folder under `specs/<version>/`, and the segment after `/specs/<version>/` of every route of the specification. */
  id: string
  title: string
  /** The short name the specification goes by. */
  short: string
  /** One line: what the specification is for. */
  line: string
  /** The area of governance it belongs to, under which the home page lists it. */
  domain: string
  /** How far it can be relied on: `planned`, then `draft`, `development`, `stable` and `deprecated`. */
  status: 'planned' | 'draft' | 'development' | 'stable' | 'deprecated'
  /** Only announced: the home page shows its card, dimmed, and none of its pages is published. */
  announced?: true
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
    version: '0.1',
    // Lucide `waypoints`: spans joined into a trace, the icon of the Traces section of Permguard Admin,
    // where these records arrive. Not `layers`, which is the Admin's ledgers.
    icon: '<circle cx="12" cy="4.5" r="2.5"/><path d="m10.2 6.3-3.9 3.9"/><circle cx="4.5" cy="12" r="2.5"/><path d="M7 12h10"/><circle cx="19.5" cy="12" r="2.5"/><path d="m13.8 17.7 3.9-3.9"/><circle cx="12" cy="19.5" r="2.5"/>',
    sections: [
      { title: 'Foundation', pages: [['Overview', '']] },
      {
        title: 'Model',
        pages: [['Records', 'records'], ['Delivery', 'delivery'], ['Materialization', 'materialization'], ['Privacy', 'privacy']]
      },
      { title: 'Reference', pages: [['Schema', 'schema']] },
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
    version: '0.1',
    // Lucide `workflow`, as on the Decision Lineage page of Permguard Admin.
    icon: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
    sections: [
      { title: 'Specification', pages: [['Overview', '']] },
      { title: 'Concepts', pages: [['Pipelines', 'pipelines'], ['Data Model', 'data-model'], ['Span Kinds', 'span-kinds']] },
      { title: 'Reference', pages: [['Attributes', 'attributes'], ['Lineage', 'lineage'], ['Schema', 'schema']] },
      { title: 'Interpretation', pages: [['Runs and Health', 'runs'], ['Receivers', 'receivers']] },
      { title: 'In Practice', pages: [['Field Guide', 'field-guide']] }
    ]
  },
  {
    id: 'open-compliance-evidence',
    title: 'Open Compliance Evidence',
    short: 'OCE',
    line: 'Events that engage the law, the obligations they open article by article, and what was done to meet each, from awareness to close.',
    domain: 'Compliance',
    status: 'draft',
    version: '0.1',
    // Lucide `gavel`: the law, which compliance answers to.
    icon: '<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
    sections: [
      { title: 'Specification', pages: [['Overview', '']] },
      { title: 'Concepts', pages: [['Cases', 'cases'], ['Data Model', 'data-model'], ['Span Kinds', 'span-kinds']] },
      { title: 'Reference', pages: [['Attributes', 'attributes'], ['Legal References', 'laws'], ['Schema', 'schema']] },
      { title: 'Interpretation', pages: [['Obligations and State', 'state'], ['Receivers', 'receivers']] },
      { title: 'In Practice', pages: [['AI Act Examples', 'examples'], ['Field Guide', 'field-guide']] }
    ]
  },
  {
    id: 'open-human-oversight',
    title: 'Open Human Oversight',
    short: 'OHO',
    line: 'People in the loop: requests for a human decision, approvals, escalations and overrides, and who held the authority.',
    domain: 'Human Oversight',
    status: 'planned',
    announced: true,
    version: '0.1',
    // Lucide `user-check`.
    icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    sections: [{ title: 'Specification', pages: [['Overview', '']] }]
  },
  {
    id: 'open-agentic-loop',
    title: 'Open Agentic Loop',
    short: 'OAL',
    line: 'What an AI agent does in its loop, goal, step, tool call, and the authority each action rested on.',
    domain: 'Agentic AI',
    status: 'planned',
    announced: true,
    version: '0.1',
    // Lucide `iteration-cw`: the loop. Not `bot`, which is the service accounts of Permguard Admin.
    icon: '<path d="M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8H4"/><polyline points="8 22 4 18 8 14"/>',
    sections: [{ title: 'Specification', pages: [['Overview', '']] }]
  }
]

/** The specifications the site publishes: one only announced has a card on the home page and nothing else. */
export const published = specs.filter((spec) => !spec.announced)

/**
 * The releases of the specifications, newest first. A release is a folder, `specs/<version>/`, holding
 * every specification as it was published in it; a new release is a new folder, and the old ones stay.
 */
export const versions = ['0.1']

/** The release the home page, the menus and every link without a version point to. */
export const current = versions[0]

/** Every specification lives under `/specs/<version>/`, beside the pages about the site itself. */
export const specLink = (spec: Spec, slug = '', version = current) => `/specs/${version}/${spec.id}/${slug}`
