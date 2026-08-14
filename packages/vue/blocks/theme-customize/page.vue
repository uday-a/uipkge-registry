<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/theme-customize`.
// Visit /theme-customize-demo after install.
import ThemeCustomize from '../components/blocks/ThemeCustomize.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest uppercase">theme-customize demo</h1>
    </header>
    <main class="p-8">
      <ThemeCustomize />
    </main>
  </div>
</template>
