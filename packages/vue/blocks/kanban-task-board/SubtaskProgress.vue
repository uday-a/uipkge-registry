<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'

const props = defineProps<{
  done: number
  total: number
  barHeight?: string
}>()

const percent = computed(() => (props.total > 0 ? Math.round((props.done / props.total) * 100) : 0))
const isComplete = computed(() => props.done === props.total && props.total > 0)
</script>

<template>
  <div data-slot="kanban-board" v-if="total > 0">
    <div class="mb-1 flex items-center justify-between">
      <span class="text-muted-foreground text-xs">
        <CheckCircle2 v-if="isComplete" class="text-success mr-0.5 inline size-3" />
        {{ done }}/{{ total }} subtasks
      </span>
      <span class="text-muted-foreground text-xs font-medium tabular-nums">{{ percent }}%</span>
    </div>
    <div :class="['bg-muted overflow-hidden rounded-full', barHeight ?? 'h-1.5']">
      <div
        :class="['h-full rounded-full transition-all duration-500', isComplete ? 'bg-success' : 'bg-primary']"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
