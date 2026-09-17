<script setup lang="ts">
import { ref } from "vue";
import type { HTMLAttributes } from "vue";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { chipVariants } from "./chip.variants";

// Inlined unions: SFC compiler can't extract runtime props from
// `ChipVariants['variant'] | ['size']`.
const props = defineProps<{
  variant?:
    | "default"
    | "filled"
    | "outlined"
    | "outline"
    | "elevated"
    | "success"
    | "warning"
    | "destructive";
  size?: "sm" | "default" | "lg";
  /** Allow the label to wrap onto multiple lines instead of clipping. */
  wrap?: boolean;
  class?: HTMLAttributes["class"];
  closable?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const leaving = ref(false);

function onClose() {
  if (leaving.value) return;
  leaving.value = true;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(
    () => {
      emit("close");
    },
    reduce ? 0 : 160,
  );
}
</script>

<template>
  <span
    data-uipkge
    data-slot="chip"
    :data-leaving="leaving || undefined"
    :class="
      cn(
        chipVariants({ variant, size, wrap }),
        'chip-enter',
        leaving && 'chip-leave',
        props.class,
      )
    "
  >
    <slot />
    <button
      v-if="closable"
      type="button"
      aria-label="Remove item"
      class="focus-visible:ring-ring hover:bg-foreground/10 ml-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full transition-transform duration-150 focus-visible:ring-1 focus-visible:outline-none active:scale-90"
      @click.stop="onClose"
    >
      <X class="size-3" aria-hidden="true" />
    </button>
  </span>
</template>

<style>
@keyframes chip-enter {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes chip-leave {
  to {
    opacity: 0;
    transform: scale(0.88);
  }
}

[data-slot="chip"].chip-enter {
  animation: chip-enter 180ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}

[data-slot="chip"].chip-leave {
  animation: chip-leave 160ms ease-in both;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot="chip"].chip-enter,
  [data-slot="chip"].chip-leave {
    animation: none !important;
  }
}
</style>
