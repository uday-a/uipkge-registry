<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { AVATAR_INJECTION_KEY } from './context'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    src?: string
    alt?: string
    loading?: 'eager' | 'lazy'
    referrerpolicy?:
      | 'no-referrer'
      | 'no-referrer-when-downgrade'
      | 'origin'
      | 'origin-when-cross-origin'
      | 'same-origin'
      | 'strict-origin'
      | 'strict-origin-when-cross-origin'
      | 'unsafe-url'
      | ''
    crossorigin?: 'anonymous' | 'use-credentials'
  }>(),
  {
    // Radix's React AvatarImage has no lazy default; lazily-loaded avatars below
    // the fold would sit on their fallback initials and diverge from the React
    // mirror, so eager is the parity-correct default.
    loading: 'eager',
  },
)

const emit = defineEmits<{
  error: [event: Event]
  load: [event: Event]
}>()

// Sibling AvatarFallback shows when image is not loaded — match Radix composition.
const ctx = inject(AVATAR_INJECTION_KEY, null)
const status = computed(() => ctx?.imageStatus.value ?? 'idle')

watch(
  () => props.src,
  (src) => {
    ctx?.setImageStatus(src ? 'loading' : 'idle')
  },
  { immediate: true },
)

const imageRef = ref<HTMLImageElement | null>(null)

// An image that finished before this component attached its listener never
// fires `load`/`error`, so reconcile from the element state on mount: a
// complete image with pixels is loaded; a complete image without them failed.
onMounted(() => {
  const el = imageRef.value
  if (!el?.complete) return
  ctx?.setImageStatus(el.naturalWidth > 0 ? 'loaded' : 'error')
})

onBeforeUnmount(() => {
  ctx?.setImageStatus('idle')
})

function handleError(event: Event) {
  ctx?.setImageStatus('error')
  emit('error', event)
}

function handleLoad(event: Event) {
  ctx?.setImageStatus('loaded')
  emit('load', event)
}
</script>

<template>
  <img
    v-if="src && status !== 'error'"
    ref="imageRef"
    :src="src"
    :alt="alt"
    :loading="loading"
    :referrerpolicy="referrerpolicy"
    :crossorigin="crossorigin"
    :class="cn('aspect-square size-full object-cover', props.class)"
    data-uipkge
    data-slot="avatar-image"
    @error="handleError"
    @load="handleLoad"
  />
</template>
