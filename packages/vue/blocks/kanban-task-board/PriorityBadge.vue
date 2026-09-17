<script setup lang="ts">
import { computed } from 'vue'
import { priorityConfig } from '@/composables/useKanban'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    priority: string
    iconSize?: string
    class?: string
  }>(),
  {
    iconSize: 'size-3.5',
  },
)

const config = computed(() => priorityConfig[props.priority])
</script>

<template>
  <div data-slot="kanban-board" v-if="config" :class="cn('flex items-center gap-1', props.class)">
    <component :is="config.icon" :class="[iconSize, config.class]" />
    <span :class="['text-xs font-semibold', config.class]">{{ config.label }}</span>
  </div>
</template>
