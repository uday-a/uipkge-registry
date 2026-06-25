<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { STEPPER_CONTEXT, type StepperOrientation, type StepperSize, type StepperStatus } from './context'
import type { StepperStep } from './types'

interface Props {
  steps?: StepperStep[]
  modelValue?: number
  orientation?: StepperOrientation
  size?: StepperSize
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  modelValue: 1,
  orientation: 'horizontal',
  size: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const activeStep = computed(() => props.modelValue)
const stepsRef = computed(() => props.steps)

function getStatus(index: number): StepperStatus {
  const step = props.steps[index]
  if (step?.error) return 'error'
  if (index + 1 === activeStep.value) return 'active'
  if (index + 1 < activeStep.value) return 'completed'
  return 'pending'
}

function isClickable(index: number): boolean {
  return index + 1 < activeStep.value
}

function goToStep(stepIndex: number) {
  if (stepIndex < 1 || stepIndex > props.steps.length) return
  const step = props.steps[stepIndex - 1]
  if (step?.disabled) return
  emit('update:modelValue', stepIndex)
}

provide(STEPPER_CONTEXT, {
  orientation: toRef(props, 'orientation'),
  size: toRef(props, 'size'),
  activeStep,
  steps: stepsRef,
  goToStep,
  isClickable,
  getStatus,
})

defineExpose({ goToStep })
</script>

<template>
  <div
    :class="cn('w-full', props.class)"
    role="tablist"
    :aria-orientation="orientation"
    :data-orientation="orientation"
  >
    <!-- Header strip with steps -->
    <slot name="steps">
      <ol
        v-if="steps.length > 0"
        :class="cn('flex', orientation === 'horizontal' ? 'flex-row items-start' : 'flex-col items-stretch')"
      >
        <StepperItem v-for="(step, index) in steps" :key="step.id" :step="step" :index="index" />
      </ol>
    </slot>

    <!-- Content area -->
    <div v-if="$slots.default" class="mt-6 flex-1">
      <slot :active-step="activeStep" :steps="steps" />
    </div>
  </div>
</template>
