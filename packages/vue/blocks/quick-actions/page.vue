<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/quick-actions`.
// Visit /quick-actions-demo after install.
import QuickActions from '../components/blocks/QuickActions.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest uppercase">quick-actions demo</h1>
    </header>
    <main class="p-8">
      <QuickActions />
    </main>
  </div>
</template>
