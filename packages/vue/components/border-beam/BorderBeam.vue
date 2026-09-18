<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { CSSProperties, HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  /** Ring thickness in px. */
  size?: number
  /** Seconds per revolution. */
  duration?: number
  /** Seconds; negative values offset the beam's starting position around the ring. */
  delay?: number
  /** Any CSS color for the beam highlight. */
  color?: string
  /** Freeze the beam in place (animation-play-state: paused). */
  paused?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 2,
  duration: 6,
  delay: 0,
  color: 'var(--primary)',
  paused: false,
})

// Honor prefers-reduced-motion by rendering a static beam at a fixed angle.
const reducedMotion = ref(false)
let query: MediaQueryList | null = null

function onChange(event: MediaQueryListEvent) {
  reducedMotion.value = event.matches
}

onMounted(() => {
  query = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = query.matches
  query.addEventListener('change', onChange)
})

onBeforeUnmount(() => {
  query?.removeEventListener('change', onChange)
})

const beamStyles = computed<CSSProperties[]>(() => [
  {
    padding: `${props.size}px`,
    background: reducedMotion.value
      ? `conic-gradient(from 45deg, transparent 0deg, transparent 290deg, ${props.color} 330deg, transparent 360deg)`
      : `conic-gradient(from var(--uipkge-border-angle), transparent 0deg, transparent 290deg, ${props.color} 330deg, transparent 360deg)`,
    animation: reducedMotion.value ? 'none' : `uipkge-border-beam ${props.duration}s linear infinite ${props.delay}s`,
    animationPlayState: !reducedMotion.value && props.paused ? 'paused' : undefined,
  },
  {
    // -webkit fallbacks first so the standard properties below win where both exist.
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
  },
])
</script>

<template>
  <span
    data-uipkge
    data-slot="border-beam"
    aria-hidden="true"
    :class="cn('pointer-events-none absolute inset-0 rounded-[inherit]', props.class)"
    :style="beamStyles"
  />
</template>
