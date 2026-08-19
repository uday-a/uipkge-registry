<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    disabled?: boolean;
    /** Override the swatches shown below the color input. Pass [] to hide entirely. */
    presets?: string[];
    /** Hide the hex text field next to the color trigger. */
    hideHexInput?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    presets: () => [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#14b8a6",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#ffffff",
      "#d4d4d4",
      "#737373",
      "#171717",
    ],
    hideHexInput: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const swatches = computed(() => props.presets ?? []);

/** Native <input type="color"> only accepts #rrggbb — keep a safe value while typing free-form hex. */
const safeColorValue = computed(() => {
  const v = props.modelValue || "";
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : "#ffffff";
});
</script>

<template>
  <div
    data-uipkge
    data-slot="color-picker"
    :class="cn('space-y-3', props.class)"
    v-bind="$attrs"
  >
    <!-- Color trigger + hex field -->
    <div class="flex items-center gap-2">
      <div
        class="border-input relative h-10 w-10 shrink-0 overflow-hidden rounded-md border shadow-xs"
        :style="{ backgroundColor: modelValue || '#ffffff' }"
      >
        <input
          type="color"
          :value="safeColorValue"
          :disabled="disabled"
          aria-label="Pick color"
          class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          @input="
            emit('update:modelValue', ($event.target as HTMLInputElement).value)
          "
        />
      </div>
      <input
        v-if="!hideHexInput"
        type="text"
        :value="modelValue || ''"
        placeholder="#000000"
        spellcheck="false"
        autocomplete="off"
        :disabled="disabled"
        aria-label="Hex color"
        class="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 flex-1 rounded-md border px-3 text-sm uppercase shadow-xs outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>

    <!-- Preset swatches -->
    <div v-if="swatches.length" class="flex flex-wrap gap-1.5">
      <button
        type="button"
        v-for="color in swatches"
        :key="color"
        :disabled="disabled"
        :aria-label="`Select ${color}`"
        :style="{ backgroundColor: color }"
        :class="
          cn(
            'ring-offset-background focus-visible:ring-ring/40 size-6 shrink-0 rounded-md shadow-sm transition-transform outline-none hover:scale-110 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
            modelValue?.toLowerCase() === color.toLowerCase()
              ? 'ring-foreground ring-2 ring-offset-2'
              : 'ring-border/50 ring-1',
            color.toLowerCase() === '#ffffff' && 'ring-border',
          )
        "
        @click="emit('update:modelValue', color)"
      />
    </div>
  </div>
</template>
