<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, ref, watch, nextTick } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    mask: string;
    replacement?: string;
    placeholderChar?: string;
    showMask?: boolean;
    disabled?: boolean;
    readonly?: boolean;
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
}>();

const inputRef = ref<HTMLInputElement>();

// Positions in the mask that are editable (not separators)
const editablePositions = computed(() => {
  const positions: number[] = [];
  for (let i = 0; i < props.mask.length; i++) {
    if (props.mask[i] === props.replacement) positions.push(i);
  }
  return positions;
});

// Total number of editable slots
const maxLength = computed(() => editablePositions.value.length);

// Is the input fully filled?
const isComplete = computed(() => {
  const raw = unmask(props.modelValue ?? "");
  return raw.length === maxLength.value;
});

// Watch for completion
watch(isComplete, (complete) => {
  if (complete) emit("complete", props.modelValue ?? "");
});

function unmask(value: string): string {
  let result = "";
  for (const char of value) {
    if (
      char !== props.placeholderChar &&
      char !== " " &&
      !isSeparatorChar(char)
    ) {
      result += char;
    }
  }
  return result;
}

function isSeparatorChar(char: string): boolean {
  // Check if char exists in mask at a non-replacement position
  for (let i = 0; i < props.mask.length; i++) {
    if (props.mask[i] !== props.replacement && props.mask[i] === char) {
      return true;
    }
  }
  return false;
}

function applyMask(rawValue: string): string {
  const chars = rawValue.split("");
  let result = "";
  let charIndex = 0;

  for (let i = 0; i < props.mask.length; i++) {
    if (props.mask[i] === props.replacement) {
      if (charIndex < chars.length) {
        result += chars[charIndex];
        charIndex++;
      } else if (props.showMask) {
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
    if (props.mask[i] === props.replacement) rawIndex++;
  }
  return rawIndex;
}

function findCursorPosFromRaw(rawIndex: number): number {
  let count = 0;
  for (let i = 0; i < props.mask.length; i++) {
    if (props.mask[i] === props.replacement) {
      if (count === rawIndex) return i;
      count++;
    }
  }
  return props.mask.length;
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const oldValue = props.modelValue ?? "";
  const newValue = target.value;
  const cursorPos = target.selectionStart ?? 0;

  // Extract raw characters from new value
  const rawNew = unmask(newValue);
  const rawOld = unmask(oldValue);

  // Limit to max length
  const clampedRaw = rawNew.slice(0, maxLength.value);

  // Apply mask
  const masked = applyMask(clampedRaw);

  // Determine new cursor position
  let newCursorPos: number;

  if (clampedRaw.length > rawOld.length) {
    // Character added - move to next editable position
    const addedIndex = clampedRaw.length - 1;
    newCursorPos = findCursorPosFromRaw(addedIndex) + 1;
    newCursorPos = getNextEditablePos(newCursorPos);
  } else if (clampedRaw.length < rawOld.length) {
    // Character removed
    newCursorPos = getPrevEditablePos(cursorPos) + 1;
  } else {
    // Same length, try to maintain relative position
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

  if (event.key === "Backspace") {
    const raw = unmask(props.modelValue ?? "");
    const rawIndex = findRawIndexAtCursor(cursorPos);

    if (rawIndex > 0) {
      const newRaw = raw.slice(0, rawIndex - 1) + raw.slice(rawIndex);
      const masked = applyMask(newRaw);
      emit("update:modelValue", masked);

      const newPos = findCursorPosFromRaw(rawIndex - 1) + 1;
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

      const newPos = findCursorPosFromRaw(rawIndex) + 1;
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
        inputRef.value.setSelectionRange(newPos + 1, newPos + 1);
      }
    });
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    const newPos = getNextEditablePos(cursorPos + 1);
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.setSelectionRange(newPos + 1, newPos + 1);
      }
    });
    event.preventDefault();
  }
}

function handleFocus() {
  if (!props.modelValue && props.showMask) {
    emit("update:modelValue", applyMask(""));
  }
  nextTick(() => {
    if (inputRef.value) {
      // Place the caret at the first editable slot (not after it).
      const firstEditable = editablePositions.value[0] ?? 0;
      inputRef.value.setSelectionRange(firstEditable, firstEditable);
    }
  });
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData("text") ?? "";
  const raw = unmask(props.modelValue ?? "");
  const cursorPos = inputRef.value?.selectionStart ?? 0;
  const rawIndex = findRawIndexAtCursor(cursorPos);
  const newRaw = raw.slice(0, rawIndex) + unmask(pasted) + raw.slice(rawIndex);
  const clamped = newRaw.slice(0, maxLength.value);
  const masked = applyMask(clamped);
  emit("update:modelValue", masked);

  const newPos =
    findCursorPosFromRaw(
      Math.min(rawIndex + unmask(pasted).length, maxLength.value),
    ) + 1;
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.setSelectionRange(newPos, newPos);
    }
  });
}

const displayValue = computed(() => {
  if (!props.modelValue && !props.showMask) return "";
  return props.modelValue ?? "";
});
</script>

<template>
  <input
    ref="inputRef"
    :value="displayValue"
    data-uipkge
    data-slot="masked-input"
    :disabled="disabled"
    :readonly="readonly"
    :class="
      cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        props.class,
      )
    "
    @input="handleInput"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @paste="handlePaste"
  />
</template>
