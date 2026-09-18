<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MoveHorizontal, MoveVertical } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { imageCompareVariants } from './image-compare.variants'

interface Props {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
  beforeLabel?: string
  afterLabel?: string
  modelValue?: number
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  showLabels?: boolean
  showHandle?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  beforeAlt: 'Before',
  afterAlt: 'After',
  beforeLabel: 'Before',
  afterLabel: 'After',
  modelValue: 50,
  orientation: 'horizontal',
  disabled: false,
  showLabels: true,
  showHandle: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const containerRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLElement | null>(null)
const dragging = ref(false)
const position = ref(props.modelValue)

watch(
  () => props.modelValue,
  (v) => {
    if (v !== position.value) position.value = v
  },
)

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

function updateFromPointer(clientX: number, clientY: number) {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (props.orientation === 'horizontal') {
    position.value = clamp(((clientX - rect.left) / rect.width) * 100)
  } else {
    position.value = clamp(((clientY - rect.top) / rect.height) * 100)
  }
  emit('update:modelValue', position.value)
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  const el = e.currentTarget as HTMLElement
  try {
    el.setPointerCapture(e.pointerId)
  } catch {
    // pointer capture can fail on synthetic / non-active pointers
  }
  updateFromPointer(e.clientX, e.clientY)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || props.disabled) return
  updateFromPointer(e.clientX, e.clientY)
}

function onPointerUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  const el = e.currentTarget as HTMLElement
  try {
    el.releasePointerCapture(e.pointerId)
  } catch {
    // pointer already released
  }
}

// Keyboard support: arrow keys move the slider by 1% (Shift = 10%)
function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) return
  const isH = props.orientation === 'horizontal'
  const step = e.shiftKey ? 10 : 1
  let next = position.value
  if (isH) {
    if (e.key === 'ArrowLeft') next -= step
    else if (e.key === 'ArrowRight') next += step
    else return
  } else {
    if (e.key === 'ArrowUp') next -= step
    else if (e.key === 'ArrowDown') next += step
    else return
  }
  e.preventDefault()
  position.value = clamp(next)
  emit('update:modelValue', position.value)
}

// "After" image is clipped to show only the right portion.
// Dragging right (higher %) reveals more of "before" on the left.
const clipStyle = computed(() => {
  const pct = position.value
  if (props.orientation === 'horizontal') {
    return { clipPath: `inset(0 0 0 ${pct}%)` }
  }
  return { clipPath: `inset(${pct}% 0 0 0)` }
})

const dividerStyle = computed(() => {
  const pct = position.value
  if (props.orientation === 'horizontal') {
    return { left: `${pct}%` }
  }
  return { top: `${pct}%` }
})

onBeforeUnmount(() => {
  dragging.value = false
})
</script>

<template>
  <div
    ref="containerRef"
    data-uipkge
    data-slot="image-compare"
    :data-orientation="orientation"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(imageCompareVariants({ orientation }), props.class)"
    style="touch-action: none"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Before (base layer, full) -->
    <img
      :src="beforeSrc"
      :alt="beforeAlt"
      class="pointer-events-none absolute inset-0 size-full object-cover select-none"
      draggable="false"
    />
    <span
      v-if="showLabels"
      class="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
    >
      {{ beforeLabel }}
    </span>

    <!-- After (clipped overlay — visible on the right side) -->
    <div class="absolute inset-0 size-full" :style="clipStyle">
      <img
        :src="afterSrc"
        :alt="afterAlt"
        class="pointer-events-none absolute inset-0 size-full object-cover select-none"
        draggable="false"
      />
      <span
        v-if="showLabels"
        class="bg-background/80 text-foreground absolute right-2 bottom-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
      >
        {{ afterLabel }}
      </span>
    </div>

    <!-- Divider + handle -->
    <div
      v-if="!disabled"
      class="bg-border absolute z-10"
      :class="orientation === 'horizontal' ? 'top-0 h-full w-0.5' : 'left-0 h-0.5 w-full'"
      :style="dividerStyle"
    >
      <button
        v-if="showHandle"
        ref="handleRef"
        type="button"
        role="slider"
        :aria-valuenow="Math.round(position)"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`Image comparison slider, ${Math.round(position)} percent`"
        :aria-orientation="orientation"
        tabindex="0"
        class="bg-background border-border focus-visible:ring-ring absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
        :class="orientation === 'vertical' ? 'cursor-ns-resize' : 'cursor-ew-resize'"
        @keydown="onKeyDown"
        @pointerdown.stop="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <slot name="handle">
          <MoveHorizontal v-if="orientation === 'horizontal'" class="text-foreground size-4" />
          <MoveVertical v-else class="text-foreground size-4" />
        </slot>
      </button>
    </div>

    <div v-if="disabled" class="bg-background/40 absolute inset-0" />
  </div>
</template>
