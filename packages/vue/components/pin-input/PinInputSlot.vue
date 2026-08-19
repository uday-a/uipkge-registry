<script setup lang="ts">
import { computed, inject, nextTick, ref, watch } from "vue";
import type { PinInputInputProps } from "reka-ui";
import type { HTMLAttributes, Ref } from "vue";
import { reactiveOmit } from "@vueuse/core";
import {
  injectPinInputRootContext,
  PinInputInput,
  useForwardProps,
} from "reka-ui";
import { cn } from "@/lib/utils";

type PinInputStatus = "error" | "warning" | "success" | "default";
type PinInputSize = "sm" | "md" | "lg";

interface PinInputContext {
  mask: Ref<boolean>;
  status: Ref<PinInputStatus>;
  size: Ref<PinInputSize>;
}

const props = defineProps<
  PinInputInputProps & {
    class?: HTMLAttributes["class"];
    /** Override the inherited mask flag for this slot. */
    mask?: boolean;
  }
>();

const ctx = inject<PinInputContext | null>("pinInputContext", null);
const forwarded = useForwardProps(reactiveOmit(props, "class", "mask"));

const effectiveMask = computed(() => props.mask ?? ctx?.mask.value ?? false);
const status = computed(() => ctx?.status.value ?? "default");
const size = computed(() => ctx?.size.value ?? "md");

const inputType = computed(() => (effectiveMask.value ? "password" : "text"));

const sizeClasses = computed(() => {
  switch (size.value) {
    case "sm":
      return "h-8 w-8 text-sm";
    case "lg":
      return "h-12 w-12 text-xl";
    default:
      return "h-10 w-10 text-base";
  }
});

const statusClasses = computed(() => {
  switch (status.value) {
    case "error":
      return "border-destructive focus:border-destructive focus:ring-destructive/40 text-destructive";
    case "warning":
      return "border-warning focus:border-warning focus:ring-warning/40 text-warning";
    case "success":
      return "border-success focus:border-success focus:ring-success/40 text-success";
    default:
      return "";
  }
});

// Quiet slot pop when a character lands (paste-safe via reka root context).
const rekaRoot = injectPinInputRootContext();
const slotValue = computed(() => rekaRoot.currentModelValue.value[props.index]);
const isPopping = ref(false);
const isFirstValue = ref(true);
const prevValue = ref<string | number | undefined | null>(undefined);

watch(
  slotValue,
  (next) => {
    // immediate:true captures mount value (empty or prefilled) without animating.
    if (isFirstValue.value) {
      isFirstValue.value = false;
      prevValue.value = next;
      return;
    }
    const filled = next !== undefined && next !== null && next !== "";
    if (filled && next !== prevValue.value) {
      // Restart animation even on rapid sequential digits.
      isPopping.value = false;
      nextTick(() => {
        isPopping.value = true;
      });
    }
    prevValue.value = next;
  },
  { immediate: true },
);

function onPopEnd(event: AnimationEvent) {
  if (event.animationName === "pin-slot-pop") {
    isPopping.value = false;
  }
}
</script>

<template>
  <PinInputInput
    :type="inputType"
    data-uipkge
    data-slot="pin-input-slot"
    v-bind="forwarded"
    :class="
      cn(
        'border-input bg-background text-foreground relative -ml-px flex items-center justify-center border text-center shadow-xs outline-none first:ml-0 first:rounded-l-md last:rounded-r-md',
        'transition-[border-color,box-shadow,color,transform] duration-150 ease-out',
        'focus:border-ring focus:ring-ring/40 focus:relative focus:z-10 focus:ring-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isPopping && 'pin-slot-pop',
        sizeClasses,
        statusClasses,
        props.class,
      )
    "
    @animationend="onPopEnd"
  />
</template>

<style>
/* Quieter than payment-card char pop — whole slot, short overshoot. */
@keyframes pin-slot-pop {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

[data-slot="pin-input-slot"].pin-slot-pop {
  animation: pin-slot-pop 200ms cubic-bezier(0.22, 1.25, 0.36, 1) both;
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="pin-input-slot"].pin-slot-pop {
    animation: none !important;
  }
  [data-slot="pin-input-slot"] {
    transition-duration: 0ms !important;
  }
}
</style>
