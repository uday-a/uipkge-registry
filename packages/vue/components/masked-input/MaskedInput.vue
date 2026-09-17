<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, nextTick, ref, watch } from "vue";
import { cn } from "@/lib/utils";

export type MaskTokens = Record<string, RegExp>;

const DEFAULT_TOKENS: MaskTokens = {
  "#": /^[0-9]$/,
  A: /^[a-zA-Z]$/,
  "*": /^[a-zA-Z0-9]$/,
};

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    mask: string;
    replacement?: string;
    tokens?: MaskTokens;
    placeholderChar?: string;
    placeholder?: string;
    showMask?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    error?: string | boolean;
    errorMessage?: string;
    validate?: (masked: string, raw: string) => boolean | string;
    class?: HTMLAttributes["class"];
  }>(),
  {
    replacement: "#",
    placeholderChar: "_",
    showMask: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  complete: [value: string];
  validate: [
    payload: {
      isValid: boolean;
      isComplete: boolean;
      rawValue: string;
      maskedValue: string;
    },
  ];
}>();

const inputRef = ref<HTMLInputElement>();
const isFocused = ref(false);

const activeTokens = computed<MaskTokens>(() => ({
  ...DEFAULT_TOKENS,
  ...(props.tokens ?? {}),
}));

// Mapping of mask index -> token character (for editable slots)
const editableSlots = computed(() => {
  const slots: Array<{ index: number; tokenChar: string }> = [];
  for (let i = 0; i < props.mask.length; i++) {
    const char = props.mask[i]!;
    if (char === props.replacement || activeTokens.value[char]) {
      slots.push({
        index: i,
        tokenChar: char === props.replacement ? props.replacement : char,
      });
    }
  }
  return slots;
});

const editablePositions = computed(() =>
  editableSlots.value.map((s) => s.index),
);
const maxLength = computed(() => editablePositions.value.length);

function getSlotPattern(slotIndex: number): RegExp {
  const slot = editableSlots.value[slotIndex];
  if (!slot) return /.*/;
  return (
    activeTokens.value[slot.tokenChar] ??
    activeTokens.value[props.replacement] ??
    /.*/
  );
}

function isValidCharForSlot(char: string, slotIndex: number): boolean {
  const regex = getSlotPattern(slotIndex);
  return regex.test(char);
}

function isSeparatorChar(char: string, index?: number): boolean {
  if (index !== undefined) {
    return !editablePositions.value.includes(index);
  }
  return (
    props.mask.includes(char) &&
    !editableSlots.value.some((s) => s.tokenChar === char)
  );
}

function unmask(value: string): string {
  let result = "";
  let slotIndex = 0;
  for (const char of value) {
    if (char === props.placeholderChar || char === " ") continue;
    if (slotIndex < maxLength.value && isValidCharForSlot(char, slotIndex)) {
      result += char;
      slotIndex++;
    }
  }
  return result;
}

function applyMask(rawValue: string): string {
  let result = "";
  let rawIndex = 0;

  for (let i = 0; i < props.mask.length; i++) {
    const isEditable = editablePositions.value.includes(i);
    if (isEditable) {
      const slotIdx = editablePositions.value.indexOf(i);
      if (
        rawIndex < rawValue.length &&
        isValidCharForSlot(rawValue[rawIndex]!, slotIdx)
      ) {
        result += rawValue[rawIndex];
        rawIndex++;
      } else if (
        props.showMask &&
        (isFocused.value || !props.placeholder || props.modelValue)
      ) {
        result += props.placeholderChar;
      } else {
        break;
      }
    } else {
      result += props.mask[i];
    }
  }

  return result;
}

const isComplete = computed(() => {
  const raw = unmask(props.modelValue ?? "");
  return raw.length === maxLength.value;
});

const validationError = computed(() => {
  if (!props.validate) return null;
  const currentMasked = props.modelValue ?? "";
  const currentRaw = unmask(currentMasked);
  const result = props.validate(currentMasked, currentRaw);
  if (typeof result === "string") return result;
  if (result === false) return "Invalid format";
  return null;
});

const isInvalid = computed(() => {
  if (props.invalid || props.error === true) return true;
  if (typeof props.error === "string" && props.error.length > 0) return true;
  if (validationError.value) return true;
  return false;
});

const displayErrorMessage = computed(() => {
  if (typeof props.error === "string" && props.error.length > 0)
    return props.error;
  if (props.errorMessage) return props.errorMessage;
  if (validationError.value) return validationError.value;
  return null;
});

// Watch for completion & validation
watch(isComplete, (complete) => {
  if (complete) emit("complete", props.modelValue ?? "");
});

watch(
  () => props.modelValue,
  (val) => {
    const raw = unmask(val ?? "");
    emit("validate", {
      isValid: !isInvalid.value,
      isComplete: isComplete.value,
      rawValue: raw,
      maskedValue: val ?? "",
    });
  },
  { immediate: true },
);

function getNextEditablePos(currentPos: number): number {
  for (const pos of editablePositions.value) {
    if (pos >= currentPos) return pos;
  }
  return (
    editablePositions.value[editablePositions.value.length - 1] ??
    props.mask.length
  );
}

function getPrevEditablePos(currentPos: number): number {
  for (let i = editablePositions.value.length - 1; i >= 0; i--) {
    const p = editablePositions.value[i];
    if (p !== undefined && p < currentPos) return p;
  }
  return editablePositions.value[0] ?? 0;
}

function findRawIndexAtCursor(cursorPos: number): number {
  let rawIndex = 0;
  for (let i = 0; i < cursorPos && i < props.mask.length; i++) {
    if (editablePositions.value.includes(i)) rawIndex++;
  }
  return rawIndex;
}

function findCursorPosFromRaw(rawIndex: number): number {
  if (rawIndex >= editablePositions.value.length) return props.mask.length;
  return editablePositions.value[rawIndex] ?? props.mask.length;
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const oldValue = props.modelValue ?? "";
  const newValue = target.value;
  const cursorPos = target.selectionStart ?? 0;

  // Filter raw characters strictly through token validation
  const rawNew = unmask(newValue);
  const rawOld = unmask(oldValue);
  const clampedRaw = rawNew.slice(0, maxLength.value);
  const masked = applyMask(clampedRaw);

  let newCursorPos: number;
  if (clampedRaw.length > rawOld.length) {
    const addedIndex = clampedRaw.length - 1;
    newCursorPos = findCursorPosFromRaw(addedIndex) + 1;
    newCursorPos = getNextEditablePos(newCursorPos);
  } else if (clampedRaw.length < rawOld.length) {
    newCursorPos = getPrevEditablePos(cursorPos) + 1;
  } else {
    newCursorPos = cursorPos;
  }

  emit("update:modelValue", masked);

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(newCursorPos, newCursorPos);
    }
  });
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement;
  const cursorPos = target.selectionStart ?? 0;

  // Block non-matching characters right away if single printable key
  if (
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    const rawIndex = findRawIndexAtCursor(cursorPos);
    if (rawIndex >= maxLength.value) {
      event.preventDefault();
      return;
    }
    if (!isValidCharForSlot(event.key, rawIndex)) {
      event.preventDefault();
      return;
    }
  }

  if (event.key === "Backspace") {
    const raw = unmask(props.modelValue ?? "");
    const rawIndex = findRawIndexAtCursor(cursorPos);

    if (rawIndex > 0) {
      const newRaw = raw.slice(0, rawIndex - 1) + raw.slice(rawIndex);
      const masked = applyMask(newRaw);
      emit("update:modelValue", masked);

      const newPos = findCursorPosFromRaw(rawIndex - 1);
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.setSelectionRange(newPos, newPos);
        }
      });
    }
    event.preventDefault();
  } else if (event.key === "Delete") {
    const raw = unmask(props.modelValue ?? "");
    const rawIndex = findRawIndexAtCursor(cursorPos);

    if (rawIndex < raw.length) {
      const newRaw = raw.slice(0, rawIndex) + raw.slice(rawIndex + 1);
      const masked = applyMask(newRaw);
      emit("update:modelValue", masked);

      const newPos = findCursorPosFromRaw(rawIndex);
      nextTick(() => {
        if (inputRef.value) {
          inputRef.value.setSelectionRange(newPos, newPos);
        }
      });
    }
    event.preventDefault();
  } else if (event.key === "ArrowLeft") {
    const newPos = getPrevEditablePos(cursorPos);
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.setSelectionRange(newPos, newPos);
      }
    });
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    const newPos = getNextEditablePos(cursorPos + 1);
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.setSelectionRange(newPos, newPos);
      }
    });
    event.preventDefault();
  }
}

function handleFocus() {
  isFocused.value = true;
  if (!props.modelValue && props.showMask) {
    emit("update:modelValue", applyMask(""));
  }
  nextTick(() => {
    if (inputRef.value) {
      const firstEditable = editablePositions.value[0] ?? 0;
      inputRef.value.setSelectionRange(firstEditable, firstEditable);
    }
  });
}

function handleBlur() {
  isFocused.value = false;
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData("text") ?? "";
  const raw = unmask(props.modelValue ?? "");
  const cursorPos = inputRef.value?.selectionStart ?? 0;
  const rawIndex = findRawIndexAtCursor(cursorPos);

  // Filter pasted content strictly
  let filteredPasted = "";
  let currSlot = rawIndex;
  for (const char of pasted) {
    if (currSlot < maxLength.value && isValidCharForSlot(char, currSlot)) {
      filteredPasted += char;
      currSlot++;
    }
  }

  const newRaw = (
    raw.slice(0, rawIndex) +
    filteredPasted +
    raw.slice(rawIndex)
  ).slice(0, maxLength.value);
  const masked = applyMask(newRaw);
  emit("update:modelValue", masked);

  const newPos = findCursorPosFromRaw(
    Math.min(rawIndex + filteredPasted.length, maxLength.value),
  );
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(newPos, newPos);
    }
  });
}

const displayValue = computed(() => {
  if (!props.modelValue && !isFocused.value && props.placeholder) return "";
  if (!props.modelValue && !props.showMask) return "";
  return props.modelValue ?? "";
});
</script>

<template>
  <div class="relative w-full" data-slot="masked-input-wrapper">
    <input
      ref="inputRef"
      :value="displayValue"
      :placeholder="placeholder"
      data-uipkge
      data-slot="masked-input"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="isInvalid ? 'true' : undefined"
      :class="
        cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          isInvalid &&
            'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 text-destructive',
          props.class,
        )
      "
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
      @paste="handlePaste"
    />
    <p
      v-if="displayErrorMessage"
      data-slot="masked-input-error"
      class="text-destructive mt-1.5 text-xs font-medium"
      role="alert"
    >
      {{ displayErrorMessage }}
    </p>
  </div>
</template>
