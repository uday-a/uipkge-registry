<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/error-pages`.
// Visit /error-pages-demo after install.
import ErrorPages from '../components/blocks/ErrorPages.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">error-pages demo</h1>
    </header>
    <main class="p-8">
      <ErrorPages />
    </main>
  </div>
</template>
