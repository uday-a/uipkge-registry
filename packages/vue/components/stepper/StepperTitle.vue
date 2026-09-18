<!--
  StepperTitle Component
  
  Title text for a stepper item.
  
  @example
  <StepperTitle>Account Setup</StepperTitle>
-->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <span :class="cn('text-foreground text-sm font-medium', props.class)">
    <slot />
  </span>
</template>
