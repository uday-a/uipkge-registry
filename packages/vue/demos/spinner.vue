<script setup lang="ts">
import { Spinner } from "@/components/ui/spinner";
</script>

<template>
  <Story
    title="Sizes"
    description="Use size-* and text-* utilities to scale and tint."
  >
    <div class="flex items-center gap-6">
      <Spinner />
      <Spinner class="size-6" />
      <Spinner class="text-primary size-8" />
      <Spinner class="size-10 text-emerald-500" />
    </div>
  </Story>

  <Story
    title="Inline"
    description="Place inside a button or label for inline loading."
  >
    <div class="flex items-center gap-2 text-sm">
      <Spinner class="size-4" /> Loading…
    </div>
  </Story>
</template>
