<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

/**
 * Scroll-triggered staggered entrance for text. Each word (or character)
 * fades in, rises and un-blurs with a per-index delay when the root
 * enters the viewport.
 */
const props = withDefaults(
  defineProps<{
    text: string
    as?: string
    mode?: 'words' | 'chars'
    /** ms between segment starts */
    stagger?: number
    /** ms per segment transition */
    duration?: number
    /** ms before the first segment starts */
    delay?: number
    blur?: boolean
    /** reveal only on first intersection; false re-hides when scrolled away */
    once?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    as: 'span',
    mode: 'words',
    stagger: 40,
    duration: 600,
    delay: 0,
    blur: true,
    once: true,
  },
)

interface Segment {
  text: string
  space: boolean
}

const segments = computed<Segment[]>(() => {
  const source = props.text.replace(/\s+/g, ' ').trim()
  if (props.mode === 'chars') {
    return Array.from(source).map((ch) => ({ text: ch, space: ch === ' ' }))
  }
  const words = source.split(' ')
  // Interleave plain spaces so word spacing stays natural.
  return words.flatMap((word, i) =>
    i < words.length - 1
      ? [
          { text: word, space: false },
          { text: '', space: true },
        ]
      : [{ text: word, space: false }],
  )
})

const revealed = ref(false)
const rootRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function cleanup() {
  observer?.disconnect()
  observer = null
}

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || typeof IntersectionObserver === 'undefined') {
    revealed.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          revealed.value = true
          if (props.once) cleanup()
        } else if (!props.once) {
          revealed.value = false
        }
      }
    },
    { threshold: 0.2 },
  )
  if (rootRef.value) observer.observe(rootRef.value)
})

onBeforeUnmount(cleanup)

function segmentStyle(index: number) {
  return {
    transitionDelay: `${props.delay + index * props.stagger}ms`,
    transitionDuration: `${props.duration}ms`,
  }
}
</script>

<template>
  <component
    :is="as"
    ref="rootRef"
    data-uipkge
    data-slot="text-reveal"
    :aria-label="text"
    :class="cn('inline-block', revealed && 'is-revealed', props.class)"
  >
    <template v-for="(seg, i) in segments" :key="`${seg.text}-${i}`">
      <span v-if="seg.space" aria-hidden="true">&nbsp;</span>
      <span
        v-else
        aria-hidden="true"
        data-slot="text-reveal-segment"
        class="text-reveal-seg inline-block will-change-transform"
        :class="{ 'text-reveal-blur': blur }"
        :style="segmentStyle(i)"
        >{{ seg.text }}</span
      >
    </template>
  </component>
</template>

<style>
[data-slot='text-reveal'] .text-reveal-seg {
  opacity: 0;
  transform: translateY(0.5em);
  transition-property: opacity, transform, filter;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

[data-slot='text-reveal'].is-revealed .text-reveal-seg {
  opacity: 1;
  transform: translateY(0);
}

[data-slot='text-reveal'] .text-reveal-blur {
  filter: blur(8px);
}

[data-slot='text-reveal'].is-revealed .text-reveal-blur {
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='text-reveal'] .text-reveal-seg {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
</style>
