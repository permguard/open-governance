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
  /** `development`, `stable` or `deprecated`: how far the specification can be relied on. */
  status: 'development' | 'stable' | 'deprecated'
  version: string
  /** A Lucide icon's SVG body, drawn at 24 x 24 with a 2 px stroke. */
  icon: string
  pages: [title: string, slug: string][]
}

export const specs: Spec[] = [
  {
    id: 'open-decision-lineage',
    title: 'Open Decision Lineage',
    short: 'ODL',
    line: 'What pipelines that analyse authorization decision logs do with them, as OpenTelemetry traces.',
    status: 'development',
    version: '1',
    // Lucide `workflow`.
    icon: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
    pages: [
      ['Overview', ''],
      ['Data Model', 'data-model'],
      ['Span Kinds', 'span-kinds'],
      ['Attributes', 'attributes'],
      ['Lineage', 'lineage'],
      ['Runs and Health', 'runs'],
      ['Receivers', 'receivers'],
      ['Examples', 'examples']
    ]
  }
]

export const specLink = (spec: Spec, slug = '') => `/${spec.id}/${slug}`
