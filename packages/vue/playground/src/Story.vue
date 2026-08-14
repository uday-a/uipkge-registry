<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="my-6 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs">
    <div class="border-b border-border bg-muted/30 px-5 py-3.5 flex flex-col gap-1">
      <h3 class="text-sm font-semibold tracking-tight text-foreground">{{ title }}</h3>
      <p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
    </div>
    <div class="p-6 bg-background/50 flex flex-col gap-4">
      <slot />
    </div>
  </section>
</template>
