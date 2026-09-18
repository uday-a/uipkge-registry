<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="kanban-card-header" :class="cn('flex flex-col gap-1', props.class)">
    <slot />
  </div>
</template>
