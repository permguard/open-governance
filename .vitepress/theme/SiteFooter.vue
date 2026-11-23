<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<script setup lang="ts">
import { withBase } from 'vitepress'

const year = new Date().getFullYear()
</script>

<!-- The site footer, shared by every page through the theme layout: Permguard's band. -->
<template>
  <footer class="os-footer">
    <div class="os-footer__inner">
      <a class="os-footer__logo" href="https://permguard.com/" target="_blank" rel="noopener noreferrer" aria-label="Permguard">
        <img class="os-footer__wordmark os-footer__wordmark--dark" :src="withBase('/permguard/nav-wordmark-white.svg')" alt="Permguard" width="150" height="38">
        <img class="os-footer__wordmark os-footer__wordmark--light" :src="withBase('/permguard/nav-wordmark-dark.svg')" alt="Permguard" width="150" height="38">
      </a>
      <p class="os-footer__tagline">The security overlay for the agentic era<span>.</span></p>
      <a class="os-footer__site" href="https://permguard.com/" target="_blank" rel="noopener noreferrer">permguard.com</a>
      <p class="os-footer__legal">
        <a href="https://permguard.com/" target="_blank" rel="noopener noreferrer">Permguard</a>® is a registered trademark
        · © {{ year }} All rights reserved
        · Brought to you by <a href="https://www.nitroagility.com/" target="_blank" rel="noopener noreferrer">Nitro Agility S.r.l.</a>
      </p>
    </div>
  </footer>
</template>
