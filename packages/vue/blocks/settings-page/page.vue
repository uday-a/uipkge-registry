<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/settings-page`.
// Visit /settings-page-demo after install.
import SettingsPage from '../components/blocks/SettingsPage.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">settings-page demo</h1>
    </header>
    <main class="p-8">
      <SettingsPage />
    </main>
  </div>
</template>
