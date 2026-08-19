<!--
  StepperStep Component
  
  A single step within a Stepper, used with step slots.
  Provides title, description, completion state, and active state.
  
  @example
  <Stepper v-model="currentStep" orientation="vertical">
    <StepperStep 
      title="Account" 
      description="Create your account"
      :completed="currentStep > 1" 
      :active="currentStep === 1"
      :error="hasAccountError"
    >
      <AccountForm @next="currentStep = 2" />
    </StepperStep>
    <StepperStep 
      title="Profile" 
      description="Set up your profile"
      :completed="currentStep > 2" 
      :active="currentStep === 2"
    >
      <ProfileForm @next="currentStep = 3" />
    </StepperStep>
    <StepperStep 
      title="Confirm" 
      description="Review and confirm"
      :completed="currentStep > 3" 
      :active="currentStep === 3"
    >
      <Confirmation @submit="handleSubmit" />
    </StepperStep>
  </Stepper>
-->
<script setup lang="ts">
import { computed } from "vue";
import type { Component, HTMLAttributes } from "vue";
import { Check } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { stepperIndicatorVariants } from "./stepper.variants";

interface Props {
  title: string;
  description?: string;
  icon?: Component;
  completed?: boolean;
  active?: boolean;
  error?: boolean;
  disabled?: boolean;
  status?: "active" | "completed" | "pending" | "error";
  index?: number;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  completed: false,
  active: false,
  error: false,
  disabled: false,
  index: undefined,
});

const computedStatus = computed(() => {
  if (props.status) return props.status;
  if (props.error) return "error";
  if (props.active) return "active";
  if (props.completed) return "completed";
  return "pending";
});
</script>

<template>
  <div
    :class="cn('stepper-step flex gap-3', props.class)"
    role="tab"
    :aria-selected="active"
    :aria-disabled="disabled"
  >
    <!-- Indicator -->
    <div
      data-slot="stepper-indicator"
      :data-status="computedStatus"
      :class="
        cn(
          stepperIndicatorVariants({
            status: computedStatus,
            size: 'default',
          }),
        )
      "
    >
      <slot name="icon">
        <Check
          v-if="computedStatus === 'completed'"
          class="size-4"
          data-slot="stepper-indicator-icon"
          aria-hidden="true"
        />
        <span v-else-if="index" data-slot="stepper-indicator-label">{{
          index
        }}</span>
      </slot>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-0.5 pt-1">
      <slot name="title">
        <span class="text-sm font-medium">{{ title }}</span>
      </slot>
      <slot name="description">
        <span v-if="description" class="text-muted-foreground text-xs">
          {{ description }}
        </span>
      </slot>
    </div>
  </div>
</template>
