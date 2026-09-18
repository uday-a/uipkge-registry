<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { DialogTrigger } from 'reka-ui'

const props = defineProps<{
  class?: HTMLAttributes['class']
  asChild?: boolean
  dialog?: any
}>()
</script>

<template>
  <DialogTrigger data-uipkge data-slot="dialog-trigger" :class="props.class" :as-child="props.asChild">
    <slot />
  </DialogTrigger>
</template>
