<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/role-matrix`.
// Visit /role-matrix-demo after install.
import RoleMatrix from '../components/blocks/RoleMatrix.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">role-matrix demo</h1>
    </header>
    <main class="p-8">
      <RoleMatrix />
    </main>
  </div>
</template>
