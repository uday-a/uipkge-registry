<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type Placeholder = 'skeleton' | 'none'

const props = withDefaults(
  defineProps<{
    src: string
    srcset?: string
    sizes?: string
    alt: string
    aspectRatio?: string | number
    width?: string | number
    height?: string | number
    placeholder?: Placeholder
    cover?: boolean
    eager?: boolean
    fallback?: string
    transition?: boolean
    class?: HTMLAttributes['class']
    imgClass?: HTMLAttributes['class']
  }>(),
  {
    placeholder: 'skeleton',
    cover: true,
    eager: false,
    transition: true,
  },
)

const emits = defineEmits<{
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
}>()

const root = ref<HTMLElement | null>(null)
const state = ref<'idle' | 'loading' | 'loaded' | 'error'>('idle')
const visible = ref(props.eager)

const aspectStyle = computed((): Record<string, string> => {
  const r = props.aspectRatio
  if (r === undefined) return {}
  if (typeof r === 'number') return { aspectRatio: String(r) }
  return { aspectRatio: r }
})

const sizeStyle = computed((): Record<string, string> => {
  const out: Record<string, string> = {}
  if (props.width !== undefined) out.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  if (props.height !== undefined) out.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  return out
})

const containerStyle = computed(() => ({ ...aspectStyle.value, ...sizeStyle.value }))

let observer: IntersectionObserver | null = null

function teardownObserver() {
  observer?.disconnect()
  observer = null
}

function setupObserver() {
  teardownObserver()
  if (props.eager || typeof IntersectionObserver === 'undefined' || !root.value) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true
          teardownObserver()
          return
        }
      }
    },
    { rootMargin: '200px' },
  )
  observer.observe(root.value)
}

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  teardownObserver()
})

watch(
  () => props.src,
  () => {
    state.value = 'idle'
    if (props.eager) {
      visible.value = true
      return
    }
    visible.value = false
    setupObserver()
  },
)

watch(visible, (v) => {
  if (v && state.value === 'idle') state.value = 'loading'
})

function onLoad(e: Event) {
  state.value = 'loaded'
  emits('load', e)
}

function onError(e: Event) {
  state.value = 'error'
  emits('error', e)
}
</script>

<template>
  <div
    ref="root"
    data-uipkge
    data-slot="lazy-image"
    :class="cn('bg-muted relative overflow-hidden', props.class)"
    :style="containerStyle"
  >
    <Skeleton
      v-if="placeholder === 'skeleton' && state !== 'loaded' && state !== 'error'"
      class="absolute inset-0 size-full rounded-none"
    />

    <img
      v-if="visible && state !== 'error'"
      :src="src"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :decoding="eager ? 'sync' : 'async'"
      :class="
        cn(
          'block size-full',
          cover ? 'object-cover' : 'object-contain',
          transition && 'transition-opacity duration-300',
          state === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClass,
        )
      "
      @load="onLoad"
      @error="onError"
    />

    <template v-if="state === 'error'">
      <slot name="fallback">
        <img
          v-if="fallback"
          :src="fallback"
          :alt="alt"
          :class="cn('block size-full', cover ? 'object-cover' : 'object-contain', imgClass)"
        />
        <div
          v-else
          role="img"
          class="text-muted-foreground absolute inset-0 flex items-center justify-center text-xs"
          aria-label="Image failed to load"
        >
          <span aria-hidden="true">Image unavailable</span>
        </div>
      </slot>
    </template>
  </div>
</template>
