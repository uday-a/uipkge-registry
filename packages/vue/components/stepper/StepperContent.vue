<!--
  StepperContent Component
  
  Wrapper for step content with transition animations.
  
  @example
  <StepperContent :step="currentStep">
    <div class="step-content">
      Step content here
    </div>
  </StepperContent>
-->
<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  step?: number
  activeStep?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  activeStep: 1,
})

const isActive = computed(() => props.step === props.activeStep)
</script>

<template>
  <div
    v-show="isActive"
    data-slot="stepper-content"
    :class="
      cn(
        'stepper-content motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out',
        props.class,
      )
    "
    role="tabpanel"
    :aria-hidden="!isActive"
  >
    <slot />
  </div>
</template>
