<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { BOARD_CONTEXT } from "./context";

interface Props {
  class?: HTMLAttributes["class"];
  /** Override the TransitionGroup name. Defaults to the board-level motion preset. */
  motion?: string;
}

const props = defineProps<Props>();

const board = inject(BOARD_CONTEXT, null);
const motionName = () => props.motion ?? board?.motion.value ?? "motion-list";

// Framework-agnostic mount gate (replaces Nuxt-only <ClientOnly>). Vue 3
// TransitionGroup can emit Fragment vnodes during SSR and real elements on the
// client, which trips hydration mismatches. Render a plain div until mounted.
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <!-- Inner padding (py-1 / px-0.5) reserves breathing room for the
       per-card hover-lift (-translate-y-0.5), the focus / drag / moved
       rings (ring-2 + ring-offset-1 ≈ 3px outward), and the hover
       shadow halo. Without it, the first / last cards' hover state
       crops against the overflow-y-auto edge. pr-1 still wins on the
       right so the thin scrollbar has a gutter. -->
  <div
    data-uipkge
    data-slot="board-lane-body"
    :class="
      cn(
        'flex min-h-0 flex-1 [scrollbar-width:thin] flex-col gap-2 overflow-y-auto px-0.5 py-1 pr-1',
        props.class,
      )
    "
  >
    <TransitionGroup
      v-if="mounted"
      :name="motionName()"
      tag="div"
      class="relative flex flex-col gap-2"
    >
      <slot />
    </TransitionGroup>
    <div v-else class="relative flex flex-col gap-2">
      <slot />
    </div>
  </div>
</template>
