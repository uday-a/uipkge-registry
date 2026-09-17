<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, onMounted, ref, useId } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  required?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();

const isFocused = ref(false);
const hasValue = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);
const fallbackId = useId();
const controlId = ref(fallbackId);

const isFloating = computed(() => isFocused.value || hasValue.value);

function checkValue(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return;
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    hasValue.value = !!el.value;
  } else if (el instanceof HTMLSelectElement) {
    hasValue.value = !!el.value;
  } else {
    const input = el.querySelector?.("input, textarea, select") as
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (input) hasValue.value = !!input.value;
  }
}

function handleFocusin(event: FocusEvent) {
  isFocused.value = true;
  checkValue(event.target);
}

function handleFocusout(event: FocusEvent) {
  isFocused.value = false;
  checkValue(event.target);
}

function handleInput(event: Event) {
  checkValue(event.target);
}

// Check for prefilled value on mount + associate label with the control.
onMounted(() => {
  if (!wrapperRef.value) return;
  const input = wrapperRef.value.querySelector("input, textarea, select") as
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  if (!input) return;
  hasValue.value = !!input.value;
  if (input.id) {
    controlId.value = input.id;
  } else {
    input.id = fallbackId;
    controlId.value = fallbackId;
  }
});

const wrapperClasses = computed(() =>
  cn(
    "relative flex flex-col",
    props.disabled && "opacity-50 cursor-not-allowed",
    props.class,
  ),
);

const labelClasses = computed(() =>
  cn(
    "text-muted-foreground pointer-events-none absolute left-3 z-10 bg-transparent px-1 text-sm transition-[color,background-color,top,translate,scale] duration-200",
    !isFloating.value && "top-1/2 -translate-y-1/2",
    isFloating.value &&
      "top-0 -translate-y-1/2 scale-75 bg-background text-foreground",
    isFocused.value && "text-ring",
    props.required && "after:text-destructive after:ml-0.5 after:content-['*']",
  ),
);
</script>

<template>
  <div
    ref="wrapperRef"
    :class="wrapperClasses"
    data-uipkge
    data-slot="float-label"
    :data-floating="isFloating"
    @focusin="handleFocusin"
    @focusout="handleFocusout"
    @input="handleInput"
    @change="handleInput"
  >
    <label :for="controlId" :class="labelClasses">
      {{ label }}
    </label>
    <slot />
  </div>
</template>
