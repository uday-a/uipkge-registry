<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  title?: string;
  subtitle?: string;
  description?: string;
  divider?: boolean;
  headingLevel?: "h2" | "h3" | "h4" | "h5";
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-uipkge
    data-slot="form-section"
    :class="cn('space-y-3', props.class)"
  >
    <div
      v-if="divider || title || subtitle"
      :class="divider && 'border-t pt-4'"
    >
      <div v-if="title || subtitle" class="space-y-1">
        <component
          :is="props.headingLevel ?? 'h4'"
          v-if="title"
          class="text-sm font-semibold"
          >{{ title }}</component
        >
        <p v-if="subtitle" class="text-muted-foreground text-xs">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <p v-if="description" class="text-muted-foreground text-xs">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
