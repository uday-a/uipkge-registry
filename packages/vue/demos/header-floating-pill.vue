<script setup lang="ts">
import HeaderFloatingPill from '@/components/blocks/header-floating-pill/HeaderFloatingPill.vue'
// HeaderFloatingPill is the block file the user installs. Open
// `components/blocks/HeaderFloatingPill.vue` after install to edit the links.
// The indicator measures the active element, so label length does not matter.
</script>

<template>
  <Story
    title="Header — Floating Pill"
    description="Detached pill navbar floating above the page. A sliding indicator tracks the active link on hover and selection; the CTA stays pinned on the right."
  >
    <HeaderFloatingPill />
  </Story>
</template>
