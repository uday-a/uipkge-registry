<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/audit-log`.
// Visit /audit-log-demo after install.
import AuditLog from '../components/blocks/AuditLog.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">audit-log demo</h1>
    </header>
    <main class="p-8">
      <AuditLog />
    </main>
  </div>
</template>
