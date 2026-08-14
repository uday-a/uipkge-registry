<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/billing-usage-center`.
// Visit /billing-usage-center-demo after install.
import BillingUsageCenter from '../components/blocks/BillingUsageCenter.vue'
</script>

<template>
  <div class="bg-background min-h-svh">
    <header class="border-border border-b px-8 py-4">
      <h1 class="text-muted-foreground font-mono text-sm tracking-widest break-all uppercase">
        billing-usage-center demo
      </h1>
    </header>
    <main class="p-8">
      <BillingUsageCenter />
    </main>
  </div>
</template>
