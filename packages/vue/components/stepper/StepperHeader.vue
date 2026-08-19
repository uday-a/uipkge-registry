<!--
  StepperHeader Component
  
  Container for the stepper header row. Used to wrap StepperItems.
  
  @example
  <StepperHeader>
    <StepperItem>...</StepperItem>
    <StepperSeparator />
    <StepperItem>...</StepperItem>
  </StepperHeader>
-->
<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="cn('stepper-header flex items-center gap-0', props.class)">
    <slot />
  </div>
</template>
