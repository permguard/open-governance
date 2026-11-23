<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- Text that wraps at the separators of its identifiers, after `.`, `/` and `_`, rather than inside
     a word; the break is a <wbr>, so the text copies as it is written. -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ text: string }>()
const parts = computed(() => props.text.split(/(?<=[./_])(?=\S)/))
</script>

<template><template v-for="(part, index) in parts" :key="index"><wbr v-if="index > 0" />{{ part }}</template></template>
