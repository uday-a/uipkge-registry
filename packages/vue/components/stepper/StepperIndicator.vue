<script setup lang="ts">
import { computed } from 'vue'
import type { Component, HTMLAttributes } from 'vue'
import { Check, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { stepperIndicatorVariants } from './stepper.variants'
import type { StepperSize, StepperStatus } from './context'

interface Props {
  status?: StepperStatus
  size?: StepperSize
  index?: number
  icon?: Component
  clickable?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  status: 'pending',
  size: 'default',
  clickable: false,
})

const emit = defineEmits<{
  click: []
}>()

const fallbackIcon = computed(() => {
  if (props.icon) return props.icon
  if (props.status === 'completed') return Check
  if (props.status === 'error') return X
  return null
})
</script>

<template>
  <button
    type="button"
    data-slot="stepper-indicator"
    :data-status="status"
    :class="
      cn(
        stepperIndicatorVariants({ status, size }),
        'ring-background relative z-10 ring-4 transition-[color,background-color,box-shadow,transform] duration-200 outline-none',
        clickable && 'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
        !clickable && 'cursor-default',
        props.class,
      )
    "
    :disabled="!clickable"
    :aria-current="status === 'active' ? 'step' : undefined"
    @click="emit('click')"
  >
    <slot>
      <component
        :is="fallbackIcon"
        v-if="fallbackIcon"
        class="size-4"
        data-slot="stepper-indicator-icon"
        aria-hidden="true"
      />
      <span v-else-if="index !== undefined" class="font-medium" data-slot="stepper-indicator-label">{{ index }}</span>
    </slot>
  </button>
</template>

<style>
@keyframes stepper-indicator-pop {
  0% {
    transform: scale(0.92);
  }
  55% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

/* Same curve as pop; distinct name so status changes re-trigger. */
@keyframes stepper-indicator-fill {
  0% {
    transform: scale(0.92);
  }
  55% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes stepper-indicator-error {
  0% {
    transform: scale(0.92);
  }
  55% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes stepper-icon-in {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* One-shot pop when a step becomes active / completed / error.
   Distinct animation names so active→completed restarts the pop. */
[data-slot='stepper-indicator'][data-status='active'] {
  animation: stepper-indicator-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}

[data-slot='stepper-indicator'][data-status='completed'] {
  animation: stepper-indicator-fill 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}

[data-slot='stepper-indicator'][data-status='error'] {
  animation: stepper-indicator-error 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
}

/* Check / error / custom icon settles in with the fill. */
[data-slot='stepper-indicator'][data-status='completed'] [data-slot='stepper-indicator-icon'],
[data-slot='stepper-indicator'][data-status='error'] [data-slot='stepper-indicator-icon'],
[data-slot='stepper-indicator'][data-status='active'] [data-slot='stepper-indicator-icon'] {
  animation: stepper-icon-in 220ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='stepper-indicator'],
  [data-slot='stepper-indicator'] [data-slot='stepper-indicator-icon'],
  [data-slot='stepper-indicator'] [data-slot='stepper-indicator-label'] {
    animation: none !important;
    transition: none !important;
  }
}
</style>
