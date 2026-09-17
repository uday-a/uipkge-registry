<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ArrowUp } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { backTopVariants } from "./back-top.variants";

// Inlined union: SFC compiler can't extract runtime props from
// `BackTopVariants['size']` / `BackTopVariants['position']`.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    /** Visibility threshold in pixels. Button appears once scroll passes it. */
    threshold?: number;
    /** Target container. Defaults to the window. Pass a CSS selector or an HTMLElement. */
    target?: string | HTMLElement | Window;
    /** Scroll behavior: 'smooth' or 'auto' (instant). */
    behavior?: ScrollBehavior;
    /** Size variant. */
    size?: "sm" | "default" | "lg";
    /** Edge anchor position. */
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    /** Distance from the viewport edge (px). */
    offset?: number;
    /** Use absolute positioning (for section-level containers) instead of fixed (viewport). */
    absolute?: boolean;
    /** Accessible label. */
    ariaLabel?: string;
  }>(),
  {
    threshold: 200,
    target: () =>
      typeof window !== "undefined" ? window : (undefined as unknown as Window),
    behavior: "smooth",
    size: "default",
    position: "bottom-right",
    offset: 24,
    absolute: false,
    ariaLabel: "Scroll to top",
  },
);

const emit = defineEmits<{
  visible: [value: boolean];
  click: [event: MouseEvent];
}>();

const visible = ref(false);

function resolveTarget(): HTMLElement | Window | null {
  if (typeof window === "undefined") return null;
  if (props.target === undefined || props.target === null) return window;
  if (typeof props.target === "string") {
    const el = document.querySelector<HTMLElement>(props.target);
    return el ?? window;
  }
  return props.target;
}

function getScrollTop(el: HTMLElement | Window): number {
  if (el === window) {
    return (
      window.scrollY ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0
    );
  }
  return (el as HTMLElement).scrollTop;
}

function scrollToTop(el: HTMLElement | Window) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduceMotion ? "auto" : props.behavior;
  if (el === window) {
    window.scrollTo({ top: 0, behavior });
  } else {
    (el as HTMLElement).scrollTo({ top: 0, behavior });
  }
}

let currentTarget: HTMLElement | Window | null = null;

function handleScroll() {
  if (!currentTarget) return;
  const scrollTop = getScrollTop(currentTarget);
  // `>=` so threshold={0} always shows (size/position demos, forced-visible cases).
  const next = scrollTop >= props.threshold;
  if (next !== visible.value) {
    visible.value = next;
    emit("visible", next);
  }
}

function handleClick(e: MouseEvent) {
  emit("click", e);
  if (currentTarget) scrollToTop(currentTarget);
}

const positionStyle = computed(() => {
  const offsetVar = `var(--back-top-offset, ${props.offset}px)`;
  switch (props.position) {
    case "bottom-left":
      return {
        left: offsetVar,
        bottom: offsetVar,
        "--back-top-offset": `${props.offset}px`,
      };
    case "top-right":
      return {
        right: offsetVar,
        top: offsetVar,
        "--back-top-offset": `${props.offset}px`,
      };
    case "top-left":
      return {
        left: offsetVar,
        top: offsetVar,
        "--back-top-offset": `${props.offset}px`,
      };
    default:
      return {
        right: offsetVar,
        bottom: offsetVar,
        "--back-top-offset": `${props.offset}px`,
      };
  }
});

onMounted(() => {
  currentTarget = resolveTarget();
  if (!currentTarget) return;
  const listenEl: HTMLElement | Window = currentTarget;
  listenEl.addEventListener("scroll", handleScroll, { passive: true });
  // If target is a container, also listen to window scroll for safety on resize.
  if (currentTarget !== window) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  handleScroll();
});

onBeforeUnmount(() => {
  if (currentTarget) {
    currentTarget.removeEventListener("scroll", handleScroll);
    if (currentTarget !== window) {
      window.removeEventListener("scroll", handleScroll);
    }
  }
});

watch(
  () => props.target,
  () => {
    if (currentTarget) {
      currentTarget.removeEventListener("scroll", handleScroll);
      if (currentTarget !== window) {
        window.removeEventListener("scroll", handleScroll);
      }
    }
    currentTarget = resolveTarget();
    if (currentTarget) {
      currentTarget.addEventListener("scroll", handleScroll, { passive: true });
      if (currentTarget !== window) {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
    }
    handleScroll();
  },
);
</script>

<template>
  <Transition name="back-top">
    <button
      v-show="visible"
      data-uipkge
      data-slot="back-top"
      :data-state="visible ? 'open' : 'closed'"
      :data-size="size"
      :data-position="position"
      type="button"
      :aria-label="ariaLabel"
      :class="
        cn(
          backTopVariants({ size, position }),
          props.absolute ? 'absolute' : 'fixed',
          props.class,
        )
      "
      :style="positionStyle"
      @click="handleClick"
    >
      <slot name="icon">
        <ArrowUp aria-hidden="true" />
      </slot>
    </button>
  </Transition>
</template>

<style scoped>
.back-top-enter-active,
.back-top-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
