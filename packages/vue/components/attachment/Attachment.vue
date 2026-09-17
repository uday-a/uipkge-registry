<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import {
  FileCode,
  FileText,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-vue-next";
import { cn } from "@/lib/utils";
import {
  attachmentMediaVariants,
  attachmentVariants,
} from "./attachment.variants";

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    state?: "idle" | "uploading" | "processing" | "error" | "done";
    size?: "default" | "sm" | "xs";
    orientation?: "horizontal" | "vertical";
    media?: "file" | "image" | "code";
    src?: string;
    alt?: string;
    removable?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    state: "done",
    size: "default",
    orientation: "horizontal",
    media: "file",
    alt: "",
    removable: false,
  },
);

const emit = defineEmits<{
  remove: [];
}>();

const busy = computed(
  () => props.state === "uploading" || props.state === "processing",
);
</script>

<template>
  <div
    data-uipkge
    data-slot="attachment"
    :data-state="state"
    :data-size="size"
    :data-orientation="orientation"
    :class="cn(attachmentVariants({ size, orientation }), props.class)"
  >
    <div
      data-slot="attachment-media"
      :class="cn(attachmentMediaVariants({ size }))"
    >
      <img
        v-if="src && media === 'image' && !busy"
        :src="src"
        :alt="alt"
        class="size-full object-cover"
      />
      <Loader2
        v-else-if="busy"
        class="size-4 motion-safe:animate-spin"
        aria-hidden="true"
      />
      <FileCode v-else-if="media === 'code'" aria-hidden="true" />
      <ImageIcon v-else-if="media === 'image'" aria-hidden="true" />
      <FileText v-else aria-hidden="true" />
    </div>
    <div data-slot="attachment-content" class="min-w-0 flex-1 leading-tight">
      <span
        data-slot="attachment-title"
        :class="cn('block truncate font-medium', busy && 'animate-pulse')"
      >
        {{ title }}
      </span>
      <span
        v-if="description"
        data-slot="attachment-description"
        :class="
          cn(
            'text-muted-foreground mt-0.5 block truncate text-xs',
            state === 'error' && 'text-destructive/80',
          )
        "
      >
        {{ description }}
      </span>
    </div>
    <button
      v-if="removable"
      type="button"
      data-slot="attachment-remove"
      class="text-muted-foreground hover:bg-accent hover:text-foreground relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
      :aria-label="`Remove ${title}`"
      @click="emit('remove')"
    >
      <X class="size-3.5" />
    </button>
  </div>
</template>
