<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { injectNumberFieldRootContext } from "reka-ui";
import { cn } from "@/lib/utils";
import { injectNumberFieldContext } from "./NumberFieldContext";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const rootContext = injectNumberFieldRootContext();
const uiContext = injectNumberFieldContext();

const inputRef = ref<HTMLInputElement>();

onMounted(() => {
  if (inputRef.value) {
    rootContext.onInputElement(inputRef.value);
  }
});

const displayValue = ref("");
const isUserTyping = ref(false);

function updateDisplayValue(val: number | undefined) {
  const formatter = uiContext.formatter.value;
  if (formatter) {
    displayValue.value = formatter(val);
  } else {
    displayValue.value = rootContext.textValue.value;
  }
}

watch(
  () => rootContext.modelValue.value,
  (val) => {
    if (!isUserTyping.value) {
      updateDisplayValue(val);
    }
  },
  { immediate: true },
);

watch(
  () => rootContext.textValue.value,
  (val) => {
    if (!isUserTyping.value && !uiContext.formatter.value) {
      displayValue.value = val;
    }
  },
);

function handleFocus() {
  isUserTyping.value = true;
}

function handleInput(event: Event) {
  displayValue.value = (event.target as HTMLInputElement).value;
}

function commitValue() {
  isUserTyping.value = false;
  const raw = displayValue.value.trim();

  if (raw === "") {
    rootContext.modelValue.value = undefined;
  } else {
    const parser = uiContext.parser.value;
    let num: number | undefined;
    if (parser) {
      num = parser(raw);
    } else {
      num = Number(raw);
    }

    if (num !== undefined && !Number.isNaN(num)) {
      rootContext.applyInputValue(String(num));
    }
  }

  nextTick(() => {
    updateDisplayValue(rootContext.modelValue.value);
  });
}

function handleBlur() {
  commitValue();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowUp") {
    if (uiContext.keyboard.value) {
      event.preventDefault();
      rootContext.handleIncrease();
    }
  } else if (event.key === "ArrowDown") {
    if (uiContext.keyboard.value) {
      event.preventDefault();
      rootContext.handleDecrease();
    }
  } else if (event.key === "PageUp") {
    if (uiContext.keyboard.value) {
      event.preventDefault();
      rootContext.handleIncrease(10);
    }
  } else if (event.key === "PageDown") {
    if (uiContext.keyboard.value) {
      event.preventDefault();
      rootContext.handleDecrease(10);
    }
  } else if (event.key === "Home") {
    if (uiContext.keyboard.value) {
      event.preventDefault();
      rootContext.handleMinMaxValue("min");
    }
  } else if (event.key === "End") {
    if (uiContext.keyboard.value) {
      event.preventDefault();
      rootContext.handleMinMaxValue("max");
    }
  } else if (event.key === "Enter") {
    commitValue();
  }
}

function handleWheel(event: WheelEvent) {
  if (rootContext.disableWheelChange.value) return;
  if (event.target !== document.activeElement) return;
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  if (event.deltaY > 0) {
    rootContext.invertWheelChange.value
      ? rootContext.handleDecrease()
      : rootContext.handleIncrease();
  } else {
    rootContext.invertWheelChange.value
      ? rootContext.handleIncrease()
      : rootContext.handleDecrease();
  }
}

const isRight = computed(() => uiContext.controlsPosition.value === "right");

const sizeClasses = computed(() => {
  switch (uiContext.size.value) {
    case "small":
      return "h-7 text-xs px-2 py-0.5";
    case "large":
      return "h-11 text-base px-4 py-2";
    default:
      return "h-9 text-sm px-3 py-1";
  }
});

const statusClasses = computed(() => {
  switch (uiContext.status.value) {
    case "error":
      return "border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 aria-invalid:border-destructive";
    case "warning":
      return "border-warning focus-visible:ring-warning/20";
    default:
      return "";
  }
});
</script>

<template>
  <div
    data-uipkge
    data-slot="input"
    :class="
      cn('relative flex-1', isRight && 'col-span-1 row-span-2', props.class)
    "
  >
    <span
      v-if="uiContext.prefix.value"
      class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm"
    >
      {{ uiContext.prefix.value }}
    </span>
    <input
      ref="inputRef"
      v-model="displayValue"
      type="text"
      role="spinbutton"
      :aria-valuenow="
        rootContext.modelValue.value !== undefined &&
        !Number.isNaN(rootContext.modelValue.value)
          ? rootContext.modelValue.value
          : undefined
      "
      :aria-valuemin="rootContext.min.value"
      :aria-valuemax="rootContext.max.value"
      :inputmode="rootContext.inputMode.value"
      :disabled="rootContext.disabled.value"
      :readonly="rootContext.readonly.value"
      :aria-invalid="uiContext.status.value === 'error' ? true : undefined"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      aria-roledescription="Number field"
      @focus="handleFocus"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @wheel="handleWheel"
      :class="
        cn(
          'placeholder:text-muted-foreground w-full bg-transparent text-center shadow-sm transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50',
          !isRight &&
            'border-input focus-visible:ring-ring rounded-md border focus-visible:ring-1',
          isRight && 'rounded-none border-0 focus-visible:ring-0',
          uiContext.prefix.value && 'pl-6',
          uiContext.suffix.value && 'pr-6',
          sizeClasses,
          !isRight && statusClasses,
        )
      "
    />
    <span
      v-if="uiContext.suffix.value"
      class="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-sm"
    >
      {{ uiContext.suffix.value }}
    </span>
  </div>
</template>
