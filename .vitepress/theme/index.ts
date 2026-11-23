// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SpecMenu from './SpecMenu.vue'
import SiteFooter from './SiteFooter.vue'
import GovernanceHero from './GovernanceHero.vue'
import HeroEyebrow from './HeroEyebrow.vue'
import HomePillars from './HomePillars.vue'
import HomeAreas from './HomeAreas.vue'
import Diagram from './diagrams/Diagram.vue'
import SpecCatalog from './SpecCatalog.vue'
import './custom.css'

// VitePress's default theme in Permguard's colours: the model of the specifications in the home
// banner, their rules and catalogue under it, the specification menu above every sidebar, the
// diagrams that open its pages, and Permguard's band at the bottom of every page.
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Diagram', Diagram)
    app.component('SpecCatalog', SpecCatalog)
    app.component('HomePillars', HomePillars)
    app.component('HomeAreas', HomeAreas)
  },
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(HeroEyebrow),
      'home-hero-image': () => h(GovernanceHero),
      'sidebar-nav-before': () => h(SpecMenu),
      'layout-bottom': () => h(SiteFooter)
    })
} satisfies Theme
