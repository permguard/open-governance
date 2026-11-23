<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The two menus of the nav bar that depend on the release in view, drawn with VitePress's own menu
     group: `specifications` opens each specification in the release being read, `releases` is
     labelled with that release and opens the page of each one. An older release never reads as, or
     leads to, the current one. -->
<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import VPNavMenuGroup from 'vitepress/dist/client/theme-default/components/VPNavMenuGroup.vue'
import { current, specLink, versions, type Spec } from '../specs'

const props = defineProps<{ menu: 'specifications' | 'releases'; screenMenu?: boolean }>()

const { theme } = useData()
const route = useRoute()
const shown = computed(() => {
  const version = /\/specs\/([^/]+)\//.exec(route.path)?.[1]
  return version && versions.includes(version) ? version : current
})
const item = computed(() =>
  props.menu === 'specifications'
    ? {
        text: 'Specifications',
        items: ((theme.value.specs ?? []) as Spec[]).map((spec) => ({ text: spec.title, link: specLink(spec, '', shown.value) }))
      }
    : {
        text: `v${shown.value}`,
        items: versions.map((version) => ({
          text: version === current ? `${version} · current` : version,
          link: `/specs/${version}/`
        }))
      }
)
</script>

<template>
  <VPNavMenuGroup :item="item" :screen="screenMenu" />
</template>
