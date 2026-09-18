<script setup lang="ts">
import { computed, inject } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { STEPPER_CONTEXT } from './context'
import type { StepperStep } from './types'

interface Props {
  step: StepperStep
  index: number
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const _maybeCtx = inject(STEPPER_CONTEXT)
if (!_maybeCtx) throw new Error('StepperItem must be used inside <Stepper>')
const ctx: NonNullable<typeof _maybeCtx> = _maybeCtx

const status = computed(() => ctx.getStatus(props.index))
const orientation = computed(() => ctx.orientation.value)
const size = computed(() => ctx.size.value)
const isFirst = computed(() => props.index === 0)
const isLast = computed(() => props.index === ctx.steps.value.length - 1)
const clickable = computed(() => ctx.isClickable(props.index) && !props.step.disabled)

// Indicator row must match stepperIndicatorVariants sizes (sm 7 / default 9 / lg 11).
// Full class strings so Tailwind's scanner keeps them.
const indicatorAxisClass = computed(() => {
  if (orientation.value === 'horizontal') {
    return (
      {
        sm: 'h-7 w-full items-center justify-center',
        default: 'h-9 w-full items-center justify-center',
        lg: 'h-11 w-full items-center justify-center',
      } as const
    )[size.value]
  }
  return (
    {
      sm: 'w-7 flex-col items-center justify-start self-stretch',
      default: 'w-9 flex-col items-center justify-start self-stretch',
      lg: 'w-11 flex-col items-center justify-start self-stretch',
    } as const
  )[size.value]
})

// A connector "segment" is the line drawn between this indicator and the
// adjacent one. We split it into left/right halves so each item owns its
// own piece — they butt up at item boundaries for pixel alignment.
const leftSegmentCompleted = computed(() => props.index < ctx.activeStep.value)
const rightSegmentCompleted = computed(() => props.index < ctx.activeStep.value - 1)

function handleNavigate() {
  if (clickable.value) ctx.goToStep(props.index + 1)
}
</script>

<template>
  <li
    data-slot="stepper-item"
    :class="
      cn(
        'group/stepper-item relative min-w-0',
        orientation === 'horizontal'
          ? 'flex flex-1 flex-col items-center gap-2'
          : 'flex flex-row items-start gap-3 pb-6 last:pb-0',
        step.disabled && 'opacity-50',
        props.class,
      )
    "
    role="tab"
    :aria-selected="status === 'active'"
    :aria-disabled="step.disabled || undefined"
    :data-status="status"
  >
    <!-- Indicator row: contains the indicator + connector segments -->
    <div :class="cn('relative flex shrink-0', indicatorAxisClass)">
      <!-- Connector segments (absolute, butt up at item boundaries).
           Track is always border; fill scales in when the segment completes. -->
      <span
        v-if="!isFirst"
        aria-hidden="true"
        data-slot="stepper-connector"
        :data-orientation="orientation"
        :data-edge="orientation === 'horizontal' ? 'left' : 'top'"
        :class="
          cn(
            'bg-border pointer-events-none absolute overflow-hidden',
            orientation === 'horizontal'
              ? 'top-1/2 right-1/2 left-0 h-px -translate-y-1/2'
              : 'top-0 bottom-1/2 left-1/2 w-px -translate-x-1/2',
          )
        "
      >
        <span
          data-slot="stepper-connector-fill"
          :data-completed="leftSegmentCompleted ? 'true' : 'false'"
          :data-orientation="orientation"
          class="bg-primary absolute inset-0"
        />
      </span>
      <span
        v-if="!isLast"
        aria-hidden="true"
        data-slot="stepper-connector"
        :data-orientation="orientation"
        :data-edge="orientation === 'horizontal' ? 'right' : 'bottom'"
        :class="
          cn(
            'bg-border pointer-events-none absolute overflow-hidden',
            orientation === 'horizontal'
              ? 'top-1/2 right-0 left-1/2 h-px -translate-y-1/2'
              : 'top-1/2 bottom-0 left-1/2 w-px -translate-x-1/2',
          )
        "
      >
        <span
          data-slot="stepper-connector-fill"
          :data-completed="rightSegmentCompleted ? 'true' : 'false'"
          :data-orientation="orientation"
          class="bg-primary absolute inset-0"
        />
      </span>

      <StepperIndicator
        :status="status"
        :size="size"
        :index="index + 1"
        :icon="step.icon"
        :clickable="clickable"
        class="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
        @click="handleNavigate"
      />
    </div>

    <!-- Title + description -->
    <div
      data-slot="stepper-item-content"
      :class="cn('min-w-0', orientation === 'horizontal' ? 'max-w-[12rem] text-center' : 'flex-1 pt-1.5')"
    >
      <button
        type="button"
        :class="
          cn(
            'text-foreground text-sm font-medium text-balance transition-colors duration-200 outline-none',
            clickable &&
              'hover:text-primary focus-visible:text-primary focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
            !clickable && 'cursor-default',
            status === 'pending' && 'text-muted-foreground',
            status === 'error' && 'text-destructive',
          )
        "
        :disabled="!clickable"
        @click="handleNavigate"
      >
        {{ step.title }}
      </button>
      <p v-if="step.description" class="text-muted-foreground mt-0.5 text-xs text-balance">
        {{ step.description }}
      </p>
    </div>
  </li>
</template>

<style>
/* Connector progress: fill scales along the track with a soft ease. */
[data-slot='stepper-connector-fill'] {
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

[data-slot='stepper-connector-fill'][data-orientation='horizontal'] {
  transform-origin: left center;
  transform: scaleX(0);
}

[data-slot='stepper-connector-fill'][data-orientation='horizontal'][data-completed='true'] {
  transform: scaleX(1);
}

[data-slot='stepper-connector-fill'][data-orientation='vertical'] {
  transform-origin: center top;
  transform: scaleY(0);
}

[data-slot='stepper-connector-fill'][data-orientation='vertical'][data-completed='true'] {
  transform: scaleY(1);
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='stepper-connector-fill'] {
    transition: none !important;
  }
}
</style>
