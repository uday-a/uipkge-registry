<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, useSlots } from "vue";
import { cn } from "@/lib/utils";
import { blockUiVariants } from "./block-ui.variants";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  modelValue?: boolean;
  message?: string;
  opacity?: number;
  overlayColor?: string;
  blur?: boolean;
  showSpinner?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  message: "Loading...",
  opacity: 0.6,
  overlayColor: "",
  blur: false,
  showSpinner: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const slots = useSlots();

const overlayStyle = computed(() => {
  const style: Record<string, string> = {
    "--block-ui-opacity": String(props.opacity),
    opacity: "var(--block-ui-opacity)",
  };
  if (props.overlayColor) style.backgroundColor = props.overlayColor;
  return style;
});
</script>

<template>
  <div
    data-uipkge
    data-slot="block-ui"
    :data-blocked="modelValue ? '' : undefined"
    :class="cn(blockUiVariants(), props.class)"
  >
    <!-- Wrapped content — always non-interactive while blocked (not only when blur is on). -->
    <div
      :class="
        cn(
          'block-ui-content',
          modelValue && 'pointer-events-none',
          blur && modelValue && 'blur-sm transition-[filter]',
        )
      "
      :inert="modelValue || undefined"
      :aria-hidden="modelValue || undefined"
    >
      <slot />
    </div>

    <!-- Blocking overlay -->
    <Transition name="block-ui-fade">
      <div
        v-if="modelValue"
        class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <!-- Background layer (opacity only affects this layer) -->
        <div
          class="absolute inset-0"
          :style="overlayStyle"
          :class="!overlayColor && 'bg-background'"
        />
        <!-- Content layer (spinner + message stay fully opaque) -->
        <slot name="icon">
          <Spinner v-if="showSpinner" size="lg" />
        </slot>
        <!-- Message slot may contain block markup — keep it out of a <p>. -->
        <div v-if="slots.message" class="text-foreground text-sm font-medium">
          <slot name="message" />
        </div>
        <p v-else-if="message" class="text-foreground text-sm font-medium">
          {{ message }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.block-ui-fade-enter-active,
.block-ui-fade-leave-active {
  transition: opacity 0.2s ease;
}
.block-ui-fade-enter-from,
.block-ui-fade-leave-to {
  opacity: 0;
}
</style>
