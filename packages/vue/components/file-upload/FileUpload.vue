<script setup lang="ts">
import { ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  modelValue?: File[];
}>();

const emit = defineEmits<{
  "update:modelValue": [files: File[]];
}>();

const inputRef = ref<HTMLInputElement>();
const isDragging = ref(false);

function handleFiles(files: FileList | null) {
  if (props.disabled || !files) return;
  const fileArray = Array.from(files);
  const first = fileArray[0];
  emit("update:modelValue", props.multiple ? fileArray : first ? [first] : []);
}

function handleInputChange(e: Event) {
  handleFiles((e.target as HTMLInputElement).files);
}

function handleDrop(e: DragEvent) {
  isDragging.value = false;
  if (props.disabled) return;
  handleFiles(e.dataTransfer?.files ?? null);
}

function handleDragOver(e: DragEvent) {
  if (props.disabled) return;
  e.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function openFilePicker() {
  if (props.disabled) return;
  inputRef.value?.click();
}

function onDropzoneKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openFilePicker();
  }
}
</script>

<template>
  <div :class="cn('space-y-3', props.class)" v-bind="$attrs">
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="sr-only"
      tabindex="-1"
      @change="handleInputChange"
    />

    <div
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      :aria-label="multiple ? 'Upload files' : 'Upload file'"
      :class="[
        'border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50 focus-visible:ring-ring flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
        isDragging && 'border-primary bg-primary/5',
        disabled && 'pointer-events-none opacity-50',
      ]"
      @click="openFilePicker"
      @keydown="onDropzoneKeydown"
      @drop.prevent="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
    >
      <slot name="icon">
        <svg
          class="text-muted-foreground mb-2 size-10"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </slot>
      <slot>
        <p class="text-muted-foreground text-sm">
          <span class="text-foreground font-semibold">Click to upload</span> or
          drag and drop
        </p>
        <p v-if="accept" class="text-muted-foreground/70 mt-1 text-xs">
          {{ accept }}
        </p>
      </slot>
    </div>

    <slot name="content" />
  </div>
</template>
