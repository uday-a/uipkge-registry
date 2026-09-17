<script setup lang="ts">
import { computed, inject, ref } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import {
  SCROLL_SPY_CONTEXT_KEY,
  SCROLL_SPY_ITEM_DEPTH_KEY,
  resolveScrollSpyColor,
} from "./context";

const props = defineProps<{
  href: string;
  title?: string;
  depth?: number;
  class?: HTMLAttributes["class"];
}>();

const ctx = inject(SCROLL_SPY_CONTEXT_KEY, null);
const itemDepth = inject(SCROLL_SPY_ITEM_DEPTH_KEY, ref(1));
const selfDepth = computed(() => props.depth ?? itemDepth.value);

const isActive = computed(() => {
  if (!ctx) return false;
  return ctx.isItemActive(props.href);
});

const isParentActive = computed(() => {
  if (!ctx) return false;
  return ctx.isItemParentActive(props.href);
});

const isScrolled = computed(() => {
  if (!ctx) return false;
  return ctx.isItemScrolled(props.href);
});

const isCircuit = computed(() => ctx?.turn.value !== "straight");
const isLeftWithRightRail = computed(
  () => ctx?.position.value === "left" && ctx?.railPosition.value === "right",
);
const hasIndicatorBar = computed(
  () =>
    ctx?.turn.value === "straight" &&
    (ctx?.indicator.value !== "segment" || ctx?.keepScrolled.value),
);

const handleColor = computed(() =>
  resolveScrollSpyColor(ctx?.color.value ?? "primary"),
);

const borderActiveClass = computed(() => {
  if (hasIndicatorBar.value) {
    if (isActive.value || isParentActive.value)
      return "text-foreground font-medium";
    if (isScrolled.value) return "text-foreground/85";
    return "text-muted-foreground hover:text-foreground";
  }
  if (isActive.value)
    return cn(handleColor.value.borderClass, "text-foreground font-medium");
  if (isParentActive.value)
    return "border-border/50 text-foreground font-medium";
  if (isScrolled.value) return "border-border/70 text-foreground/85";
  return "text-muted-foreground hover:border-foreground/40 hover:text-foreground";
});

function onClick(e: MouseEvent) {
  e.preventDefault();
  if (!ctx) return;
  ctx.scrollToHref(props.href);
}
</script>

<template>
  <a
    :href="href"
    data-slot="scroll-spy-link"
    :aria-current="isActive ? 'location' : undefined"
    :data-active="isActive ? 'true' : 'false'"
    :data-parent-active="isParentActive ? 'true' : 'false'"
    :data-scrolled="isScrolled ? 'true' : 'false'"
    :data-depth="selfDepth"
    :style="
      !isCircuit &&
      !hasIndicatorBar &&
      (isActive || isParentActive || isScrolled)
        ? {
            borderLeftWidth: isLeftWithRightRail
              ? undefined
              : `${ctx?.resolvedLineWidth.value ?? 2.5}px`,
            borderRightWidth: isLeftWithRightRail
              ? `${ctx?.resolvedLineWidth.value ?? 2.5}px`
              : undefined,
            marginLeft: isLeftWithRightRail
              ? undefined
              : `-${ctx?.resolvedLineWidth.value ?? 2.5}px`,
            marginRight: isLeftWithRightRail
              ? `-${ctx?.resolvedLineWidth.value ?? 2.5}px`
              : undefined,
            borderColor: isActive ? handleColor.customColor : undefined,
          }
        : undefined
    "
    :class="
      cn(
        'group block rounded-none leading-snug no-underline transition-[color,border-color,background-color,opacity,border-width,margin] duration-200 ease-out',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        isCircuit
          ? [
              'py-1',
              isLeftWithRightRail
                ? [
                    'text-right',
                    selfDepth <= 1 && 'pr-4 pl-2 text-sm',
                    selfDepth === 2 && 'pr-7 pl-2 text-xs',
                    selfDepth === 3 && 'pr-10 pl-2 text-xs',
                    selfDepth >= 4 && 'pr-12 pl-2 text-xs',
                  ]
                : [
                    selfDepth <= 1 && 'pr-2 pl-4 text-sm',
                    selfDepth === 2 && 'pr-2 pl-7 text-xs',
                    selfDepth === 3 && 'pr-2 pl-10 text-xs',
                    selfDepth >= 4 && 'pr-2 pl-12 text-xs',
                  ],
              isActive || isParentActive
                ? 'text-foreground font-medium'
                : isScrolled
                  ? 'text-foreground/85'
                  : 'text-muted-foreground hover:text-foreground',
            ]
          : isLeftWithRightRail
            ? [
                '-mr-px border-r border-transparent py-0.5 pr-3 pl-2 text-right',
                selfDepth <= 1 && 'text-sm',
                selfDepth === 2 && 'pr-6 text-xs',
                selfDepth === 3 && 'pr-9 text-xs',
                selfDepth >= 4 && 'pr-11 text-xs',
                borderActiveClass,
              ]
            : [
                '-ml-px border-l border-transparent py-0.5 pr-2 pl-3',
                selfDepth <= 1 && 'text-sm',
                selfDepth === 2 && 'pl-6 text-xs',
                selfDepth === 3 && 'pl-9 text-xs',
                selfDepth >= 4 && 'pl-11 text-xs',
                borderActiveClass,
              ],
        props.class,
      )
    "
    @click="onClick"
  >
    <slot>{{ title }}</slot>
  </a>
</template>
