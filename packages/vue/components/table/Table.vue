<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed } from "vue";
import { cn } from "@/lib/utils";

// Match DataTable's density enum so consumers can opt into the same
// runtime feel without wiring DataTable. `cozy` is the canonical default
// for bare tables (cells: py-2, head: h-10); the other two are escape
// hatches for high-density admin lists and roomy patient-facing views.
const props = defineProps<{
  class?: HTMLAttributes["class"];
  // Extra classes for the scroll container div (e.g. `min-h-0 flex-1` inside a
  // flex column). A sticky TableHeader pins to THIS div -- an outer overflow
  // wrapper around <Table> breaks stickiness, so size the scroller here.
  containerClass?: HTMLAttributes["class"];
  density?: "compact" | "cozy" | "comfortable";
}>();

const densityClass = computed(() => {
  if (props.density === "compact")
    return "[&_td]:py-1.5 [&_td]:text-xs [&_th]:h-8 [&_th]:text-xs";
  if (props.density === "comfortable") return "[&_td]:py-3 [&_th]:h-12";
  // cozy is the new TableCell/TableHead baseline (py-2 / h-10) -- no override.
  return "";
});
</script>

<template>
  <div
    data-uipkge
    data-slot="table-container"
    :class="cn('relative w-full overflow-auto', props.containerClass)"
  >
    <table
      data-uipkge
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm', densityClass, props.class)"
    >
      <slot />
    </table>
  </div>
</template>
