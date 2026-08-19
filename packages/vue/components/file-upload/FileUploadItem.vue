<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { FileIcon, X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const file = defineModel<File>({ required: true });

defineEmits<{
  (e: "remove"): void;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'bg-muted/50 flex items-center gap-3 rounded-md border p-3',
        props.class,
      )
    "
  >
    <FileIcon class="text-muted-foreground size-8 shrink-0" />
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium">{{ file.name }}</p>
      <p class="text-muted-foreground text-xs">
        {{ (file.size / 1024).toFixed(1) }} KB
      </p>
    </div>
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto rounded-sm transition-colors duration-200 focus-visible:ring-1 focus-visible:outline-none"
      @click="$emit('remove')"
    >
      <X class="size-4" aria-hidden="true" />
      <span class="sr-only">Remove file</span>
    </button>
  </div>
</template>
