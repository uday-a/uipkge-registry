<script setup lang="ts">
import type { ToggleGroupRootEmits } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ToggleGroupRoot, useForwardPropsEmits } from "reka-ui";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  toRef,
  watch,
} from "vue";
import { cn } from "@/lib/utils";

// Inlined unions: SFC compiler can't extract runtime props from
// `VariantProps<typeof toggleVariants>['...']`. Same for the
// reka-ui `ToggleGroupRootProps` (no exports.types). Inline the
// surface we expose.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    spacing?: number;
    asChild?: boolean;
    as?: string | object;
    type?: "single" | "multiple";
    modelValue?: string | string[];
    defaultValue?: string | string[];
    disabled?: boolean;
    loop?: boolean;
    orientation?: "horizontal" | "vertical";
    rovingFocus?: boolean;
    dir?: "ltr" | "rtl";
    /** Sliding selection indicator for single-select (default true). Multi-select keeps item chrome. */
    animated?: boolean;
  }>(),
  {
    spacing: 0,
    animated: true,
  },
);

const emits = defineEmits<ToggleGroupRootEmits>();

// Provide reactive refs so items pick up live variant/size/spacing changes.
provide("toggleGroup", {
  variant: toRef(props, "variant"),
  size: toRef(props, "size"),
  spacing: toRef(props, "spacing"),
});

const delegatedProps = reactiveOmit(
  props,
  "class",
  "size",
  "variant",
  "animated",
);
const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Sliding pill only for single-select. Multi-select paints per-item surfaces.
const indicatorActive = computed(
  () => props.animated !== false && props.type !== "multiple",
);

const listEl = ref<HTMLElement | null>(null);
const indicatorStyle = ref<Record<string, string>>({
  opacity: "0",
});
let ro: ResizeObserver | null = null;
let mo: MutationObserver | null = null;
let firstPosition = true;

function resolveListEl(node: unknown): HTMLElement | null {
  if (!node) return null;
  if (node instanceof HTMLElement) return node;
  const el = (node as { $el?: unknown }).$el;
  return el instanceof HTMLElement ? el : null;
}

function setListRef(node: unknown) {
  listEl.value = resolveListEl(node);
}

function motionSafeTransition() {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "none";
  }
  return firstPosition
    ? "none"
    : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), width 220ms cubic-bezier(0.22, 1, 0.36, 1), height 220ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 220ms cubic-bezier(0.22, 1, 0.36, 1)";
}

function updateIndicator() {
  if (!indicatorActive.value) return;
  const root = listEl.value;
  if (!root) return;
  const active = root.querySelector<HTMLElement>(
    '[data-slot="toggle-group-item"][data-state="on"]',
  );
  if (!active) {
    indicatorStyle.value = { opacity: "0" };
    return;
  }

  const listRect = root.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const left = activeRect.left - listRect.left + root.scrollLeft;
  const top = activeRect.top - listRect.top + root.scrollTop;
  const transition = motionSafeTransition();

  indicatorStyle.value = {
    width: `${activeRect.width}px`,
    height: `${activeRect.height}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    borderRadius: getComputedStyle(active).borderRadius,
    opacity: "1",
    transition,
  };
  firstPosition = false;
}

function unbindObservers() {
  ro?.disconnect();
  mo?.disconnect();
  ro = null;
  mo = null;
}

function bindObservers() {
  const root = listEl.value;
  if (!root || !indicatorActive.value) return;

  unbindObservers();

  ro = new ResizeObserver(() => updateIndicator());
  ro.observe(root);
  root
    .querySelectorAll('[data-slot="toggle-group-item"]')
    .forEach((el) => ro!.observe(el));

  mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") {
        root
          .querySelectorAll('[data-slot="toggle-group-item"]')
          .forEach((el) => ro?.observe(el));
      }
    }
    nextTick(updateIndicator);
  });
  mo.observe(root, {
    attributes: true,
    attributeFilter: ["data-state"],
    subtree: true,
    childList: true,
  });

  updateIndicator();
}

onMounted(() => {
  nextTick(() => {
    if (!listEl.value) {
      requestAnimationFrame(() => bindObservers());
    } else {
      bindObservers();
    }
  });
});

onBeforeUnmount(() => {
  unbindObservers();
});

watch(indicatorActive, (on) => {
  firstPosition = true;
  if (on) nextTick(() => bindObservers());
  else {
    unbindObservers();
    indicatorStyle.value = { opacity: "0" };
  }
});

watch(
  () => [props.spacing, props.size, props.variant, props.orientation] as const,
  () => {
    firstPosition = true;
    nextTick(updateIndicator);
  },
);
</script>

<template>
  <ToggleGroupRoot
    :ref="setListRef"
    v-slot="slotProps"
    data-uipkge
    data-slot="toggle-group"
    :data-size="size"
    :data-variant="variant"
    :data-spacing="spacing"
    :data-animated="indicatorActive ? 'true' : 'false'"
    :style="{
      '--gap': spacing,
    }"
    v-bind="forwarded"
    :class="
      cn(
        'group/toggle-group relative flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs',
        props.class,
      )
    "
  >
    <span
      v-if="indicatorActive"
      data-slot="toggle-group-indicator"
      aria-hidden="true"
      class="bg-accent pointer-events-none absolute top-0 left-0 z-0 shadow-xs will-change-transform"
      :style="indicatorStyle"
    />
    <slot v-bind="slotProps" />
  </ToggleGroupRoot>
</template>
