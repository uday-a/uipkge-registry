<script setup lang="ts">
import type { SelectTriggerProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ChevronDown, Loader } from "lucide-vue-next";
import { SelectIcon, SelectTrigger, useForwardProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<
    SelectTriggerProps & {
      class?: HTMLAttributes["class"];
      size?: "sm" | "default" | "lg";
      state?: "default" | "error" | "success";
      loading?: boolean;
    }
  >(),
  { size: "default", state: "default", loading: false },
);

const delegatedProps = reactiveOmit(props, "class", "size", "state", "loading");
const forwardedProps = useForwardProps(delegatedProps);

const sizeClasses = {
  sm: "h-8 text-sm px-2.5 py-1.5",
  default: "h-9 text-sm px-3 py-2",
  lg: "h-11 text-base px-4 py-2.5",
};

const stateClasses = {
  default: "border-input dark:hover:bg-input/50",
  error:
    "border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  success: "border-success focus-visible:border-success",
};
</script>

<template>
  <SelectTrigger
    data-uipkge
    data-slot="select-trigger"
    :data-size="size"
    :data-state-value="state"
    v-bind="forwardedProps"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :class="
      cn(
        'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        stateClasses[state],
        props.class,
      )
    "
  >
    <slot />
    <SelectIcon v-if="!loading" as-child>
      <ChevronDown class="size-4 opacity-50" aria-hidden="true" />
    </SelectIcon>
    <Loader v-else class="size-4 animate-spin opacity-50" aria-hidden="true" />
  </SelectTrigger>
</template>
