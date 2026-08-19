<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, toRef, watch } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import type { AnchorItem } from ".";
import { ANCHOR_INJECTION_KEY } from "./context";
import AnchorLink from "./AnchorLink.vue";

const props = withDefaults(
  defineProps<{
    items?: AnchorItem[];
    offsetTop?: number;
    /**
     * Pixel leeway for the active-section band (top of the IntersectionObserver
     * rootMargin). Larger values activate a heading slightly earlier as you scroll.
     */
    bounds?: number;
    scrollContainer?: HTMLElement | string | null;
    affix?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    items: () => [],
    offsetTop: 0,
    bounds: 5,
    scrollContainer: null,
    affix: false,
  },
);

const emits = defineEmits<{
  (e: "change", href: string): void;
}>();

const activeHref = ref<string | null>(null);
const registered = ref<Set<string>>(new Set());
const resolvedContainer = ref<HTMLElement | Window>(
  typeof window !== "undefined" ? window : (null as any),
);

function resolveContainer(): HTMLElement | Window {
  if (!props.scrollContainer) return window;
  if (typeof props.scrollContainer === "string") {
    return (
      (document.querySelector(props.scrollContainer) as HTMLElement) ?? window
    );
  }
  return props.scrollContainer;
}

let observer: IntersectionObserver | null = null;
const observed = new Map<string, Element>();

function rebuildObserver() {
  if (observer) {
    observer.disconnect();
    observed.clear();
  }
  const root =
    resolvedContainer.value === window
      ? null
      : (resolvedContainer.value as HTMLElement);
  observer = new IntersectionObserver(
    (entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length === 0) return;
      intersecting.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
      );
      const id = "#" + intersecting[0]!.target.id;
      if (id !== activeHref.value) {
        activeHref.value = id;
        emits("change", id);
      }
    },
    {
      root,
      // bounds softens the top edge so a section can activate slightly before
      // its heading hits offsetTop exactly (ant-design-style leeway).
      rootMargin: `-${Math.max(0, props.offsetTop - props.bounds)}px 0px -60% 0px`,
      threshold: [0, 1],
    },
  );
  for (const href of registered.value) {
    const el = document.querySelector(href);
    if (el) {
      observed.set(href, el);
      observer.observe(el);
    }
  }
}

function setActive(href: string) {
  activeHref.value = href;
  emits("change", href);
}

function register(href: string) {
  registered.value.add(href);
  if (!observer) return;
  const el = document.querySelector(href);
  if (el && !observed.has(href)) {
    observed.set(href, el);
    observer.observe(el);
  }
}

function unregister(href: string) {
  registered.value.delete(href);
  const el = observed.get(href);
  if (el && observer) observer.unobserve(el);
  observed.delete(href);
}

provide(ANCHOR_INJECTION_KEY, {
  activeHref,
  setActive,
  register,
  unregister,
  scrollContainer: resolvedContainer,
  offsetTop: toRef(props, "offsetTop"),
});

onMounted(() => {
  resolvedContainer.value = resolveContainer();
  rebuildObserver();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

watch(
  () => props.scrollContainer,
  () => {
    resolvedContainer.value = resolveContainer();
    rebuildObserver();
  },
);

watch(
  () => [props.offsetTop, props.bounds] as const,
  () => {
    rebuildObserver();
  },
);
</script>

<template>
  <nav
    data-uipkge
    data-slot="anchor"
    aria-label="Table of contents"
    :class="
      cn(
        'border-border flex flex-col gap-1 border-l text-sm',
        affix && 'sticky',
        props.class,
      )
    "
    :style="
      affix
        ? {
            top: 'var(--anchor-offset-top, 0px)',
            '--anchor-offset-top': `${offsetTop}px`,
          }
        : undefined
    "
  >
    <template v-if="items.length">
      <AnchorLink
        v-for="item in items"
        :key="item.href"
        :href="item.href"
        :title="item.title"
      >
        <AnchorLink
          v-for="child in item.children ?? []"
          :key="child.href"
          :href="child.href"
          :title="child.title"
        />
      </AnchorLink>
    </template>
    <slot v-else />
  </nav>
</template>
