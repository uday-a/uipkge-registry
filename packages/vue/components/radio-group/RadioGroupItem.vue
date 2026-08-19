<script setup lang="ts">
import type { RadioGroupItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { computed, inject } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { Circle } from "lucide-vue-next";
import { RadioGroupIndicator, RadioGroupItem, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";

// CLAUDE.md mandate: avoid `interface extends ReakUiX` (SFC compiler bails
// in Vue 3.5+ because reka-ui has no exports.types). Intersection form below.
export type RadioGroupItemPropsExtended = Omit<
  RadioGroupItemProps,
  "defaultChecked"
> & {
  class?: HTMLAttributes["class"];
  /** Size of the radio item */
  size?: "sm" | "md" | "lg";
  /** Custom color for the checked state */
  color?:
    "primary" | "secondary" | "success" | "warning" | "error" | "info" | string;
  /** Label text displayed next to the radio item */
  label?: string;
  /** Hint text shown below the radio item */
  hint?: string;
  /** Error message to display */
  errorMessages?: string | string[];
  /** Whether to show error state */
  error?: boolean;
  /** Density of the radio item */
  density?: "compact" | "default" | "comfortable";
  /** Label position - before or after the radio */
  labelPosition?: "before" | "after";
  /** Loading state */
  loading?: boolean;
  /** Hide the indicator icon */
  hideIcon?: boolean;
};

const props = withDefaults(defineProps<RadioGroupItemPropsExtended>(), {
  size: "md",
  density: "default",
  color: "primary",
  labelPosition: "after",
  hideIcon: false,
});

const delegatedProps = reactiveOmit(
  props,
  "class",
  "size",
  "color",
  "label",
  "hint",
  "errorMessages",
  "error",
  "density",
  "labelPosition",
  "loading",
  "hideIcon",
);

const forwardedProps = useForwardProps(delegatedProps);

const groupContext = inject<{
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  optionType?: "default" | "button";
  buttonVariant?: "outline" | "solid";
  orientation?: "horizontal" | "vertical";
}>("radioGroup", {});

const effectiveDisabled = computed(
  () =>
    Boolean(props.loading) ||
    Boolean(props.disabled ?? groupContext.disabled ?? false),
);

// Size classes
const sizeClasses = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

const indicatorSizes = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
};

// Color classes
const colorClasses: Record<string, string> = {
  primary: "data-[state=checked]:border-primary",
  secondary: "data-[state=checked]:border-secondary",
  success:
    "data-[state=checked]:border-success data-[state=checked]:text-success",
  warning:
    "data-[state=checked]:border-warning data-[state=checked]:text-warning",
  error:
    "data-[state=checked]:border-destructive data-[state=checked]:text-destructive",
  info: "data-[state=checked]:border-info data-[state=checked]:text-info",
};

// Density classes
const densityClasses = {
  compact: "gap-1",
  default: "gap-2",
  comfortable: "gap-3",
};

// Build error state
const hasError = computed(() => {
  if (props.error) return true;
  if (
    props.errorMessages &&
    (typeof props.errorMessages === "string"
      ? props.errorMessages
      : props.errorMessages.length > 0)
  )
    return true;
  return false;
});
</script>

<template>
  <div class="flex flex-col" :class="[densityClasses[density]]">
    <div class="flex items-center">
      <label
        v-if="label && labelPosition === 'before'"
        :for="id"
        class="mr-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        :class="[
          hasError ? 'text-destructive' : '',
          effectiveDisabled && 'cursor-not-allowed opacity-50',
        ]"
      >
        {{ label }}
      </label>

      <RadioGroupItem
        v-bind="forwardedProps"
        :id="id"
        data-uipkge
        data-slot="radio-group-item"
        :value="value"
        :disabled="effectiveDisabled"
        :aria-busy="loading || undefined"
        :aria-invalid="hasError || undefined"
        :class="
          cn(
            'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square shrink-0 rounded-full border shadow-sm transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            colorClasses[color] || colorClasses.primary,
            hasError && 'border-destructive',
            loading && 'opacity-50',
            props.class,
          )
        "
      >
        <RadioGroupIndicator
          data-uipkge
          data-slot="radio-group-indicator"
          class="relative flex items-center justify-center"
        >
          <slot>
            <Circle
              v-if="!hideIcon"
              :class="
                cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-current text-current',
                  indicatorSizes[size],
                )
              "
            />
          </slot>
        </RadioGroupIndicator>
      </RadioGroupItem>

      <label
        v-if="label && labelPosition === 'after'"
        :for="id"
        class="ml-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        :class="[
          hasError ? 'text-destructive' : '',
          effectiveDisabled && 'cursor-not-allowed opacity-50',
        ]"
      >
        {{ label }}
      </label>
    </div>

    <p v-if="hint && !hasError" class="text-muted-foreground ml-6 text-xs">
      {{ hint }}
    </p>

    <div v-if="hasError" class="ml-6 flex flex-col gap-0.5">
      <p
        v-if="typeof errorMessages === 'string'"
        class="text-destructive text-xs"
      >
        {{ errorMessages }}
      </p>
      <template v-else>
        <p
          v-for="(msg, i) in errorMessages"
          :key="i"
          class="text-destructive text-xs"
        >
          {{ msg }}
        </p>
      </template>
    </div>
  </div>
</template>
