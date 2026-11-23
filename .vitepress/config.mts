// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import { existsSync } from 'node:fs'
import { defineConfig } from 'vitepress'
import { current, published, specLink, specs, versions } from './specs'

// GitHub Pages serves the site below the repository path; the deploy passes it in.
const base = `/${(process.env.VITEPRESS_BASE ?? '').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

// The page of a specification in a release, if that release has it.
const has = (version: string, id: string, slug: string) => existsSync(`specs/${version}/${id}/${slug || 'index'}.md`)

// Each specification of each release has a sidebar of its own sections, each collapsible, listing the
// pages that release has; the specification menu above it moves between specifications
// (theme/SpecMenu.vue).
const sidebar = Object.fromEntries(
  versions.flatMap((version) =>
    published
      .filter((spec) => has(version, spec.id, ''))
      .map((spec) => [
        specLink(spec, '', version),
        spec.sections
          .map((section) => ({
            text: section.title,
            collapsed: false,
            items: section.pages
              .filter(([, slug]) => has(version, spec.id, slug))
              .map(([text, slug]) => ({ text, link: specLink(spec, slug, version) }))
          }))
          .filter((section) => section.items.length)
      ])
  )
)

export default defineConfig({
  base,
  title: 'Open Governance',
  description: 'Open governance specifications for how organisations decide, control and account.',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }]],
  cleanUrls: true,
  // The site's home: opengov.permguard.com, where the schemas' ids point.
  sitemap: { hostname: 'https://opengov.permguard.com' },
  // The repository's own files are not pages of the site.
  // A specification only announced keeps its draft pages in the repository, unpublished.
  srcExclude: ['README.md', ...specs.filter((spec) => spec.announced).map((spec) => `specs/*/${spec.id}/**`)],
  lastUpdated: true,
  // Dark by default, like permguard.com; the toggle still offers light.
  appearance: 'dark',
  themeConfig: {
    // Open Governance's own mark, in Permguard's colours; Permguard itself signs the footer.
    logo: { src: '/logo.svg', alt: 'Open Governance' },
    siteTitle: 'Open Governance',
    specs: published,
    versions,
    nav: [
      { text: 'Specifications', items: published.map((spec) => ({ text: spec.title, link: specLink(spec) })) },
      // The releases, each opening its own page; the label names the current one.
      {
        text: `v${current}`,
        items: versions.map((version) => ({
          text: version === current ? `${version} · current` : version,
          link: `/specs/${version}/`
        }))
      }
    ],
    sidebar,
    outline: { level: [2, 3] },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/permguard/open-governance' }],
    editLink: {
      pattern: 'https://github.com/permguard/open-governance/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
