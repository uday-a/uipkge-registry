<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/integrations-directory`.
// Visit /integrations-directory-demo after install.
import IntegrationsDirectory from '../components/blocks/integrations-directory/IntegrationsDirectory.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">
        integrations-directory demo
      </h1>
    </header>
    <main class="p-8">
      <IntegrationsDirectory />
    </main>
  </div>
</template>
