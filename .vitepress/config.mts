// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'vitepress'
import { specLink, specs } from './specs'

// GitHub Pages serves the site below the repository path; the deploy passes it in.
const base = `/${(process.env.VITEPRESS_BASE ?? '').replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

// Each specification has a sidebar of its own sections, each collapsible; the specification menu
// above it moves between specifications (theme/SpecMenu.vue).
const sidebar = Object.fromEntries(
  specs.map((spec) => [
    `/${spec.id}/`,
    spec.sections.map((section) => ({
      text: section.title,
      collapsed: false,
      items: section.pages.map(([text, slug]) => ({ text, link: specLink(spec, slug) }))
    }))
  ])
)

export default defineConfig({
  base,
  title: 'Open Specs',
  description: 'Open specifications for modern software and intelligent systems.',
  head: [['link', { rel: 'icon', type: 'image/x-icon', href: `${base}permguard/favicon.ico` }]],
  cleanUrls: true,
  // The repository's own files are not pages of the site.
  srcExclude: ['README.md'],
  lastUpdated: true,
  // Dark by default, like permguard.com; the toggle still offers light.
  appearance: 'dark',
  themeConfig: {
    logo: { light: '/permguard/symbol.svg', dark: '/permguard/symbol.svg', alt: 'Permguard' },
    siteTitle: 'Open Specs',
    specs,
    nav: [
      { text: 'Specifications', items: specs.map((spec) => ({ text: spec.title, link: specLink(spec) })) }
    ],
    sidebar,
    outline: { level: [2, 3] },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/permguard/open-specs' }],
    editLink: {
      pattern: 'https://github.com/permguard/open-specs/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
