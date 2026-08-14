<script setup lang="ts">
import MetricsGrid from '../components/blocks/MetricsGrid.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest uppercase">metrics-grid demo</h1>
    </header>
    <main class="mx-auto max-w-[1400px] max-w-full p-8">
      <MetricsGrid />
    </main>
  </div>
</template>
