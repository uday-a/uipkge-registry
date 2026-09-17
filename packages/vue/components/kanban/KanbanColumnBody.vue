<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="kanban-column-body" :class="cn('flex flex-1 flex-col gap-2 overflow-y-auto py-1', props.class)">
    <slot />
  </div>
</template>
