<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/toggle-setting-list`.
// Visit /toggle-setting-list-demo after install.
import ToggleSettingList from '../components/blocks/ToggleSettingList.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest uppercase">toggle-setting-list demo</h1>
    </header>
    <main class="p-8">
      <ToggleSettingList />
    </main>
  </div>
</template>
