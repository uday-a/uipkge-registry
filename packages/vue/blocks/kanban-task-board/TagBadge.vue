<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  label: string
  color: string
  class?: string
}>()
</script>

<template>
  <span
    data-slot="kanban-board"
    :class="cn('rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset', color, $props.class)"
  >
    {{ label }}
  </span>
</template>
