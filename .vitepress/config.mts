// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'vitepress'
import { published, specLink, specs } from './specs'

// GitHub Pages serves the site below the repository path; the deploy passes it in.
const base = `/${(process.env.VITEPRESS_BASE ?? '').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

// Each specification has a sidebar of its own sections, each collapsible; the specification menu
// above it moves between specifications (theme/SpecMenu.vue).
const sidebar = Object.fromEntries(
  published.map((spec) => [
    specLink(spec),
    spec.sections.map((section) => ({
      text: section.title,
      collapsed: false,
      items: section.pages.map(([text, slug]) => ({ text, link: specLink(spec, slug) }))
    }))
  ])
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
  // A specification in progress keeps its draft pages in the repository, unpublished.
  srcExclude: ['README.md', ...specs.filter((spec) => spec.status === 'in-progress').map((spec) => `specs/${spec.id}/**`)],
  lastUpdated: true,
  // Dark by default, like permguard.com; the toggle still offers light.
  appearance: 'dark',
  themeConfig: {
    // Open Governance's own mark, in Permguard's colours; Permguard itself signs the footer.
    logo: { src: '/logo.svg', alt: 'Open Governance' },
    siteTitle: 'Open Governance',
    specs: published,
    nav: [
      { text: 'Specifications', items: published.map((spec) => ({ text: spec.title, link: specLink(spec) })) }
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
