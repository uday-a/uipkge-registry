<script setup lang="ts">
import HeaderCenteredLogo from '@/components/blocks/header-centered-logo/HeaderCenteredLogo.vue'
// HeaderCenteredLogo is the block file the user installs. Open
// `components/blocks/HeaderCenteredLogo.vue` after install to rebalance the
// `leftLinks` / `rightLinks` arrays — the centre mark stays centred.
</script>

<template>
  <Story
    title="Header — Centered Logo"
    description="Symmetrical navbar: wordmark centred between two nav halves with a utility cluster on the right. Below the breakpoint the split collapses into one sheet trigger."
  >
    <HeaderCenteredLogo />
  </Story>
</template>
