<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/changelog`.
// Visit /changelog-demo after install.
import Changelog from '../components/blocks/Changelog.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">changelog demo</h1>
    </header>
    <main class="p-8">
      <Changelog />
    </main>
  </div>
</template>
