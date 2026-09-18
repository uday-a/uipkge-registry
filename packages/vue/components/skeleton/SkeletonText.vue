<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  lines?: number
  lastLineWidth?: string
  firstLineWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  lines: 3,
  lastLineWidth: '80%',
  firstLineWidth: '100%',
})

const lineWidths = computed(() => {
  return Array.from({ length: props.lines }, (_, i) => {
    if (i === 0) return props.firstLineWidth
    if (i === props.lines - 1) return props.lastLineWidth
    return '100%'
  })
})
</script>

<template>
  <div data-uipkge data-slot="skeleton-text" aria-hidden="true" :class="cn('space-y-2', props.class)">
    <div v-for="(width, i) in lineWidths" :key="i" class="skeleton-shimmer h-4 rounded" :style="{ width }" />
  </div>
</template>

<style scoped>
/* Match Skeleton.vue shimmer so text lines don't flash a different motion language. */
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--muted) 100%, transparent) 0%,
    color-mix(in srgb, var(--muted) 60%, var(--foreground) 8%) 50%,
    color-mix(in srgb, var(--muted) 100%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s linear infinite;
}
@keyframes skeleton-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background: var(--muted);
  }
}
</style>
