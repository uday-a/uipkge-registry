<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

// Responsive CSS-grid container. Pass an integer for fixed column count, or
// a breakpoint map for responsive layouts: `{ base: 1, sm: 2, lg: 3 }`.
//
// Examples:
//   <Grid :cols="3" :gap="4">...</Grid>
//   <Grid :cols="{ base: 1, sm: 2, lg: 4 }" :gap="6">...</Grid>
//
// Tailwind v4's content scanner cannot see classnames built from
// `grid-cols-${n}` template strings, so we map each supported value
// to a complete class string. The scanner sees the literal classes
// and emits them in the consumer's production CSS.
type ColIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Cols =
  ColIndex | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", ColIndex>>;
type GapToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

const COLS_BASE: Record<ColIndex, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};
const COLS_SM: Record<ColIndex, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  7: "sm:grid-cols-7",
  8: "sm:grid-cols-8",
  9: "sm:grid-cols-9",
  10: "sm:grid-cols-10",
  11: "sm:grid-cols-11",
  12: "sm:grid-cols-12",
};
const COLS_MD: Record<ColIndex, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  7: "md:grid-cols-7",
  8: "md:grid-cols-8",
  9: "md:grid-cols-9",
  10: "md:grid-cols-10",
  11: "md:grid-cols-11",
  12: "md:grid-cols-12",
};
const COLS_LG: Record<ColIndex, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
  8: "lg:grid-cols-8",
  9: "lg:grid-cols-9",
  10: "lg:grid-cols-10",
  11: "lg:grid-cols-11",
  12: "lg:grid-cols-12",
};
const COLS_XL: Record<ColIndex, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
  7: "xl:grid-cols-7",
  8: "xl:grid-cols-8",
  9: "xl:grid-cols-9",
  10: "xl:grid-cols-10",
  11: "xl:grid-cols-11",
  12: "xl:grid-cols-12",
};
const GAP: Record<GapToken, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
};

const props = withDefaults(
  defineProps<{
    cols?: Cols;
    gap?: GapToken;
    class?: HTMLAttributes["class"];
  }>(),
  {
    cols: 1,
    gap: 4,
  },
);

const colsClass = computed(() => {
  const c = props.cols;
  if (typeof c === "number") return COLS_BASE[c];
  return [
    c.base != null ? COLS_BASE[c.base] : "",
    c.sm != null ? COLS_SM[c.sm] : "",
    c.md != null ? COLS_MD[c.md] : "",
    c.lg != null ? COLS_LG[c.lg] : "",
    c.xl != null ? COLS_XL[c.xl] : "",
  ]
    .filter(Boolean)
    .join(" ");
});

const gapClass = computed(() => GAP[props.gap]);
</script>

<template>
  <div
    data-uipkge
    data-slot="grid"
    :class="cn('grid', colsClass, gapClass, props.class)"
  >
    <slot />
  </div>
</template>
