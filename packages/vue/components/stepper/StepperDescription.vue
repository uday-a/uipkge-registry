<!--
  StepperDescription Component
  
  Description text for a stepper item.
  
  @example
  <StepperDescription>Create your account to get started</StepperDescription>
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
  <span :class="cn('text-muted-foreground text-xs', props.class)">
    <slot />
  </span>
</template>
