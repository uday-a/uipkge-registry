<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  variant?: 'rectangular' | 'rounded' | 'circular' | 'text' | 'avatar' | 'image' | 'card' | 'table-row'
  width?: string
  height?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rectangular',
  loading: true,
})

const variantClasses = {
  rectangular: '',
  rounded: 'rounded-md',
  circular: 'rounded-full',
  text: 'rounded h-4 w-full',
  avatar: 'rounded-full size-10',
  image: 'rounded-lg size-24',
  card: 'rounded-xl size-full min-h-30',
  'table-row': 'rounded h-10 w-full',
}

const variantStyles = computed(() => {
  const base: Record<string, string> = {}
  if (props.width) base.width = props.width
  if (props.height) base.height = props.height
  return Object.keys(base).length > 0 ? base : undefined
})
</script>

<template>
  <div
    v-if="loading"
    data-uipkge
    data-slot="skeleton"
    aria-hidden="true"
    :class="cn('skeleton-shimmer', variantClasses[variant || 'rectangular'], props.class)"
    :style="variantStyles"
  />
  <slot v-else />
</template>

<style scoped>
/* Slow left-to-right gradient sweep. Per NN/g, slow shimmer reads as
   faster loading than a pulse. 1.8s loop is the documented sweet spot. */
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
