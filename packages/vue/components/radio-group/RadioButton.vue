<script setup lang="ts">
import type { RadioGroupItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { computed, inject } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { RadioGroupItem, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";

// CLAUDE.md mandate: avoid `interface extends ReakUiX` (SFC compiler bails
// in Vue 3.5+ because reka-ui has no exports.types). Intersection form below.
export type RadioButtonProps = Omit<RadioGroupItemProps, "defaultChecked"> & {
  class?: HTMLAttributes["class"];
  /** Size of the button radio */
  size?: "small" | "middle" | "large";
  /** Visual variant */
  variant?: "outline" | "solid";
  /** Label text */
  label?: string;
};

const props = withDefaults(defineProps<RadioButtonProps>(), {
  size: undefined,
  variant: undefined,
});

const context = inject<{
  disabled?: boolean;
  size?: "small" | "middle" | "large";
  optionType?: "default" | "button";
  buttonVariant?: "outline" | "solid";
  orientation?: "horizontal" | "vertical";
}>("radioGroup", {});

const effectiveSize = computed(() => props.size ?? context.size ?? "middle");
const effectiveVariant = computed(
  () => props.variant ?? context.buttonVariant ?? "outline",
);
const effectiveDisabled = computed(
  () => props.disabled ?? context.disabled ?? false,
);

const delegatedProps = reactiveOmit(props, "class", "size", "variant", "label");
const forwardedProps = useForwardProps(delegatedProps);

const sizeClasses = {
  small: "h-7 px-2.5 text-xs",
  middle: "h-8 px-4 text-sm",
  large: "h-10 px-4.5 text-base",
};

const variantClasses = {
  outline: cn(
    "border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50",
    "data-[state=checked]:border-primary data-[state=checked]:text-primary",
    "disabled:hover:bg-transparent",
  ),
  solid: cn(
    "border border-input bg-transparent text-foreground hover:text-foreground hover:bg-muted/50",
    "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    "disabled:hover:bg-transparent",
  ),
};

const groupClasses = computed(() => {
  if (context.orientation === "vertical") {
    return "rounded-md w-full justify-start";
  }
  return cn(
    "rounded-none first:rounded-l-md last:rounded-r-md",
    "border-l-0 first:border-l",
    "-ml-px first:ml-0",
  );
});
</script>

<template>
  <RadioGroupItem
    v-bind="forwardedProps"
    data-uipkge
    data-slot="radio-button"
    :value="value"
    :disabled="effectiveDisabled"
    :class="
      cn(
        'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-200',
        'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[effectiveSize],
        variantClasses[effectiveVariant],
        groupClasses,
        props.class,
      )
    "
  >
    <slot>
      {{ label ?? value }}
    </slot>
  </RadioGroupItem>
</template>
