<script setup lang="ts">
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { getDueStatus, formatDueDate } from '@/composables/useKanban'
import { cn } from '@/lib/utils'

const props = defineProps<{
  dueDate: string
  variant?: 'chip' | 'inline'
  class?: string
}>()

const status = computed(() => getDueStatus(props.dueDate))
const formatted = computed(() => formatDueDate(props.dueDate))

const chipClasses = computed(() => {
  switch (status.value) {
    case 'overdue':
      return 'bg-destructive/10 text-destructive'
    case 'soon':
      return 'bg-warning/10 text-warning'
    default:
      return 'text-muted-foreground bg-muted'
  }
})

const inlineClasses = computed(() => {
  switch (status.value) {
    case 'overdue':
      return 'text-destructive'
    case 'soon':
      return 'text-warning'
    default:
      return 'text-foreground'
  }
})
</script>

<template>
  <div
    data-slot="kanban-board"
    v-if="variant === 'chip'"
    :class="cn('flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium', chipClasses, props.class)"
  >
    <Clock class="size-3" />
    {{ formatted }}
  </div>

  <p v-else :class="cn('flex items-center gap-1 text-sm leading-tight font-medium', inlineClasses, props.class)">
    <Clock class="size-3" />
    {{ formatted }}
  </p>
</template>
