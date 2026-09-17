<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/notification-center`.
// Visit /notification-center-demo after install.
import NotificationCenter from '../components/blocks/NotificationCenter.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">
        notification-center demo
      </h1>
    </header>
    <main class="p-8">
      <NotificationCenter />
    </main>
  </div>
</template>
