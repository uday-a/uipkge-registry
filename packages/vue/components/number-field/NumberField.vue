<script setup lang="ts">
import type { NumberFieldRootEmits, NumberFieldRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { NumberFieldRoot, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";
import { provideNumberFieldContext } from "./NumberFieldContext";

export type NumberFieldSize = "small" | "middle" | "large";
export type NumberFieldStatus = "error" | "warning";
export type NumberFieldControlsPosition = "default" | "right";

// Use intersection in defineProps<> instead of `interface Props extends`:
// Vue 3.5+'s SFC compiler has its own mini-resolver for the `extends`
// clause that bails when the external package's package.json lacks
// `exports.types` (true for reka-ui). The defineProps<T & U>() path
// delegates type extraction to the project's installed `typescript`
// package, which is shipped by init.json -- this works reliably.
interface ExtraProps {
  class?: HTMLAttributes["class"];
  size?: NumberFieldSize;
  status?: NumberFieldStatus;
  controlsPosition?: NumberFieldControlsPosition;
  keyboard?: boolean;
  precision?: number;
  formatter?: (value: number | undefined) => string;
  parser?: (displayValue: string) => number | undefined;
  prefix?: string;
  suffix?: string;
}

const props = withDefaults(defineProps<NumberFieldRootProps & ExtraProps>(), {
  step: 1,
  keyboard: true,
  controlsPosition: "default",
});

const emits = defineEmits<NumberFieldRootEmits>();

const delegatedProps = reactiveOmit(
  props,
  "class",
  "size",
  "status",
  "controlsPosition",
  "keyboard",
  "precision",
  "formatter",
  "parser",
  "prefix",
  "suffix",
  "formatOptions",
);

const formatOptions = computed(() => {
  if (props.precision !== undefined) {
    return {
      ...props.formatOptions,
      minimumFractionDigits: props.precision,
      maximumFractionDigits: props.precision,
    };
  }
  return props.formatOptions;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

provideNumberFieldContext({
  size: computed(() => props.size ?? "middle"),
  status: computed(() => props.status),
  controlsPosition: computed(() => props.controlsPosition),
  keyboard: computed(() => props.keyboard),
  formatter: computed(() => props.formatter),
  parser: computed(() => props.parser),
  prefix: computed(() => props.prefix),
  suffix: computed(() => props.suffix),
});
</script>

<template>
  <NumberFieldRoot
    v-slot="slotProps"
    data-uipkge
    data-slot="number-field"
    v-bind="forwarded"
    :format-options="formatOptions"
    :class="cn('inline-flex', props.class)"
  >
    <slot v-bind="slotProps" />
  </NumberFieldRoot>
</template>
