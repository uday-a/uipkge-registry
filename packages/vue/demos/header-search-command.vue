<script setup lang="ts">
import HeaderSearchCommand from '@/components/blocks/header-search-command/HeaderSearchCommand.vue'
// HeaderSearchCommand is the block file the user installs. Open
// `components/blocks/HeaderSearchCommand.vue` after install to wire the
// `groups` array to a real index. The ⌘K listener is registered on mount.
</script>

<template>
  <Story
    title="Header — Inline Search"
    description="Navbar with inline search. Click the field or press ⌘K to open a command palette of grouped results; Escape closes and the shortcut hint stays visible in the trigger."
  >
    <HeaderSearchCommand />
  </Story>
</template>
