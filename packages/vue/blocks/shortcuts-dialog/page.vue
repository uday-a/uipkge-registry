<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/shortcuts-dialog`.
// Visit /shortcuts-dialog-demo after install.
import ShortcutsDialog from '../components/blocks/ShortcutsDialog.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">shortcuts-dialog demo</h1>
    </header>
    <main class="p-8">
      <ShortcutsDialog />
    </main>
  </div>
</template>
