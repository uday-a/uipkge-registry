<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/invite-members`.
// Visit /invite-members-demo after install.
import InviteMembers from '../components/blocks/InviteMembers.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">invite-members demo</h1>
    </header>
    <main class="p-8">
      <InviteMembers />
    </main>
  </div>
</template>
