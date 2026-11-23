<!-- Copyright (c) 2022 Nitro Agility S.r.l. -->
<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- The home page's banner beside the title: a specification as a reader meets it, a few of its
     attributes with their values, over the brand's glow. -->
<template>
  <div class="os-hero-card" aria-hidden="true">
    <div class="os-hero-card__bar">
      <span class="os-hero-card__dot" /><span class="os-hero-card__dot" /><span class="os-hero-card__dot" />
      <span class="os-hero-card__file">open-decision-lineage · v1</span>
    </div>
    <dl class="os-hero-card__rows">
      <div><dt>odl.version</dt><dd class="is-string">"1"</dd></div>
      <div><dt>odl.pipeline.id</dt><dd class="is-string">"privilege-escalation"</dd></div>
      <div><dt>odl.span.kind</dt><dd class="is-enum">batch · step · heartbeat · run</dd></div>
      <div><dt>odl.step.upstream</dt><dd class="is-string">["enrich-identity"]</dd></div>
      <div><dt>odl.input.stream</dt><dd class="is-string">"decisions/commerce/orders"</dd></div>
      <div><dt>odl.input.count</dt><dd class="is-number">128</dd></div>
      <div><dt>odl.output.stream</dt><dd class="is-string">"stix/sightings"</dd></div>
    </dl>
    <div class="os-hero-card__flow">
      <span>decisions</span><i /><span class="is-optional">read</span><i class="is-optional" /><span>detect</span><i /><span class="is-out">sightings</span>
    </div>
  </div>
</template>
