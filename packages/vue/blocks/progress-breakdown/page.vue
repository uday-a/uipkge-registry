<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/progress-breakdown`.
// Visit /progress-breakdown-demo after install.
import ProgressBreakdown from '../components/blocks/ProgressBreakdown.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest uppercase">progress-breakdown demo</h1>
    </header>
    <main class="p-8">
      <ProgressBreakdown />
    </main>
  </div>
</template>
