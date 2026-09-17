<script setup lang="ts">
import HeaderMegaMenu from '@/components/blocks/header-mega-menu/HeaderMegaMenu.vue'
// HeaderMegaMenu is the block file the user installs. Open
// `components/blocks/HeaderMegaMenu.vue` after install to edit the `menus`
// array — panel columns derive from it, so a new group needs no markup.
</script>

<template>
  <Story
    title="Header — Mega Menu"
    description="Navbar with full-width mega panels. Product and Resources open grouped link lists with descriptions and a highlighted card; arrow keys move between items and Escape closes."
  >
    <HeaderMegaMenu />
  </Story>
</template>
