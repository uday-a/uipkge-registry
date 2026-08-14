<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/api-keys`.
// Visit /api-keys-demo after install.
import ApiKeys from '../components/blocks/ApiKeys.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">api-keys demo</h1>
    </header>
    <main class="p-8">
      <ApiKeys />
    </main>
  </div>
</template>
