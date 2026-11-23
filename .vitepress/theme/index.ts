// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import SpecMenu from './SpecMenu.vue'
import SiteFooter from './SiteFooter.vue'
import SpecHero from './SpecHero.vue'
import './custom.css'

// VitePress's default theme in Permguard's colours: a specification card in the home banner, the
// specification menu above every sidebar, and Permguard's band at the bottom of every page.
export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h(SpecHero),
      'sidebar-nav-before': () => h(SpecMenu),
      'layout-bottom': () => h(SiteFooter)
    })
} satisfies Theme
