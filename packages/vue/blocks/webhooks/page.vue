<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/webhooks`.
// Visit /webhooks-demo after install.
import Webhooks from '../components/blocks/Webhooks.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">webhooks demo</h1>
    </header>
    <main class="p-8">
      <Webhooks />
    </main>
  </div>
</template>
