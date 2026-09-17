<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  toRef,
  useTemplateRef,
  watch,
} from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import type { ScrollSpyItem } from ".";
import {
  SCROLL_SPY_CONTEXT_KEY,
  type ScrollSpyTurn,
  type ScrollSpyVariant,
  type ScrollSpyIndicatorMode,
  type ScrollSpyPosition,
  type ScrollSpyRailPosition,
  type ScrollSpyLineWidth,
  type ScrollSpyColor,
  type RegisteredItem,
} from "./context";
import ScrollSpyTitle from "./ScrollSpyTitle.vue";
import ScrollSpyList from "./ScrollSpyList.vue";
import ScrollSpyIndicator from "./ScrollSpyIndicator.vue";
import ScrollSpyItemComp from "./ScrollSpyItem.vue";
import ScrollSpyLink from "./ScrollSpyLink.vue";
import ScrollSpyStepper from "./ScrollSpyStepper.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    items?: ScrollSpyItem[];
    title?: string;
    offsetTop?: number;
    bounds?: number;
    scrollContainer?: HTMLElement | string | null;
    affix?: boolean;
    variant?: ScrollSpyVariant;
    turn?: ScrollSpyTurn;
    indicator?: ScrollSpyIndicatorMode;
    keepScrolled?: boolean;
    highlightParent?: boolean;
    lineWidth?: ScrollSpyLineWidth;
    color?: ScrollSpyColor;
    position?: ScrollSpyPosition;
    railPosition?: ScrollSpyRailPosition;
    class?: HTMLAttributes["class"];
  }>(),
  {
    modelValue: "",
    items: () => [],
    title: undefined,
    offsetTop: 0,
    bounds: 5,
    scrollContainer: null,
    affix: false,
    variant: undefined,
    turn: undefined,
    indicator: "line",
    keepScrolled: false,
    highlightParent: true,
    lineWidth: "default",
    color: "primary",
    position: "right",
    railPosition: undefined,
  },
);

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "progress", value: number): void;
}>();

const resolvedPosition = computed<ScrollSpyPosition>(
  () => props.position ?? "right",
);
const resolvedRailPosition = computed<ScrollSpyRailPosition>(() => {
  if (props.railPosition) return props.railPosition;
  return props.position === "left" ? "right" : "left";
});

const resolvedTurn = computed<ScrollSpyTurn>(() => {
  if (props.turn) return props.turn;
  if (props.variant === "angle" || props.variant === "rounded")
    return "rounded";
  if (props.variant === "sharp") return "sharp";
  if (props.variant === "line" || props.variant === "default")
    return "straight";
  return "straight";
});

const resolvedVariant = computed<ScrollSpyVariant>(() => {
  if (props.variant) return props.variant;
  if (props.turn === "sharp") return "angle";
  if (props.turn === "rounded") return "rounded";
  if (props.position === "top" || props.position === "bottom") return "stepper";
  return "line";
});

const resolvedIndicator = computed<ScrollSpyIndicatorMode>(
  () => props.indicator ?? "line",
);

const internalActive = ref(props.modelValue || (props.items[0]?.href ?? ""));
const activeValue = computed({
  get: () => props.modelValue || internalActive.value,
  set: (val: string) => {
    if (internalActive.value !== val) {
      internalActive.value = val;
      emits("update:modelValue", val);
      emits("change", val);
    }
  },
});

function flattenItems(rawItems: ScrollSpyItem[]): RegisteredItem[] {
  const result: RegisteredItem[] = [];
  function walk(
    list: ScrollSpyItem[],
    depth = 1,
    parentVal: string | null = null,
  ) {
    for (const it of list) {
      result.push({
        value: it.href,
        depth: it.depth ?? depth,
        el: null,
        title: it.title,
        parentValue: parentVal,
      });
      if (it.children && it.children.length > 0) {
        walk(it.children, depth + 1, it.href);
      }
    }
  }
  walk(rawItems);
  return result;
}

const registeredItems = ref<RegisteredItem[]>(
  props.items && props.items.length > 0 ? flattenItems(props.items) : [],
);
const listEl = ref<HTMLElement | null>(null);
const resolvedContainer = ref<HTMLElement | Window | null>(null);
const readingProgress = ref(0);
const scrollProgressSmooth = ref(true);

function resolveContainer(): HTMLElement | Window | null {
  if (typeof window === "undefined") return null;
  const sc = props.scrollContainer;
  if (!sc) return window;
  if (typeof sc === "function") {
    return (sc as () => HTMLElement | Window | null)() ?? window;
  }
  if (typeof sc === "string") {
    return (document.querySelector(sc) as HTMLElement) ?? window;
  }
  return sc as HTMLElement | Window;
}

function registerItem(item: RegisteredItem) {
  const existingIdx = registeredItems.value.findIndex(
    (i) => i.value === item.value,
  );
  if (existingIdx >= 0) {
    registeredItems.value[existingIdx] = {
      ...registeredItems.value[existingIdx]!,
      ...item,
      title: item.title ?? registeredItems.value[existingIdx]!.title,
    };
  } else {
    registeredItems.value.push(item);
  }
  if (!activeValue.value && registeredItems.value.length > 0) {
    activeValue.value = registeredItems.value[0]!.value;
  }
}

watch(
  () => props.items,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      const flattened = flattenItems(newItems);
      const existingMap = new Map(
        registeredItems.value.map((i) => [i.value, i]),
      );
      registeredItems.value = flattened.map((item) => {
        const existing = existingMap.get(item.value);
        return {
          ...item,
          el: existing?.el ?? null,
          title: item.title ?? existing?.title,
        };
      });
      if (!activeValue.value && registeredItems.value.length > 0) {
        activeValue.value = registeredItems.value[0]!.value;
      }
    }
  },
  { deep: true },
);

function unregisterItem(value: string) {
  registeredItems.value = registeredItems.value.filter(
    (i) => i.value !== value,
  );
}

function setActiveValue(value: string) {
  activeValue.value = value;
}

function scrollToHref(href: string) {
  setActiveValue(href);
  const container = resolvedContainer.value || resolveContainer();
  const offset = props.offsetTop;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = smooth ? "smooth" : "auto";

  if (container && container !== window) {
    const cEl = container as HTMLElement;
    const target = cEl.querySelector(href) as HTMLElement | null;
    if (target) {
      const cRect = cEl.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const top = cEl.scrollTop + (tRect.top - cRect.top) - offset;
      cEl.scrollTo({ top, behavior });
    }
  } else {
    const target = document.querySelector(href) as HTMLElement | null;
    if (target) {
      const top = window.scrollY + target.getBoundingClientRect().top - offset;
      window.scrollTo({ top, behavior });
    }
  }

  if (typeof history !== "undefined") {
    history.replaceState(null, "", href);
  }
}

function goToPrev() {
  const list = registeredItems.value;
  const active = activeValue.value;
  const idx = list.findIndex(
    (i) =>
      i.value === active ||
      i.value.replace(/^#/, "") === active.replace(/^#/, ""),
  );
  if (idx > 0 && list[idx - 1]) {
    scrollToHref(list[idx - 1]!.value);
  }
}

function goToNext() {
  const list = registeredItems.value;
  const active = activeValue.value;
  const idx = list.findIndex(
    (i) =>
      i.value === active ||
      i.value.replace(/^#/, "") === active.replace(/^#/, ""),
  );
  if (idx >= 0 && idx < list.length - 1 && list[idx + 1]) {
    scrollToHref(list[idx + 1]!.value);
  }
}

const activeIndex = computed(() => {
  const current = activeValue.value;
  if (!current) return -1;
  const clean = current.replace(/^#/, "");
  return registeredItems.value.findIndex(
    (i) => i.value === current || i.value.replace(/^#/, "") === clean,
  );
});

function isItemActive(value: string): boolean {
  if (!value || !activeValue.value) return false;
  const cleanVal = value.replace(/^#/, "");
  const cleanActive = activeValue.value.replace(/^#/, "");
  return cleanVal === cleanActive;
}

function isItemParentActive(value: string): boolean {
  if (!props.highlightParent || !value || !activeValue.value) return false;
  const cleanVal = value.replace(/^#/, "");
  const cleanActive = activeValue.value.replace(/^#/, "");
  if (cleanVal === cleanActive) return false;

  const activeItem = registeredItems.value.find(
    (i) =>
      i.value === activeValue.value ||
      i.value.replace(/^#/, "") === cleanActive,
  );
  let parent = activeItem?.parentValue;
  while (parent) {
    if (parent === value || parent.replace(/^#/, "") === cleanVal) return true;
    const pItem = registeredItems.value.find(
      (i) =>
        i.value === parent ||
        i.value.replace(/^#/, "") === parent!.replace(/^#/, ""),
    );
    parent = pItem?.parentValue;
  }
  return false;
}

function isItemScrolled(value: string): boolean {
  if (!props.keepScrolled || activeIndex.value < 0) return false;
  const cleanVal = value.replace(/^#/, "");
  const idx = registeredItems.value.findIndex(
    (i) => i.value === value || i.value.replace(/^#/, "") === cleanVal,
  );
  return idx >= 0 && idx <= activeIndex.value;
}

const resolvedLineWidth = computed<number>(() => {
  const lw = props.lineWidth;
  if (typeof lw === "number") return Math.max(1, lw);
  if (lw === "thin") return 1.5;
  if (lw === "thick") return 3.5;
  return 2.5;
});

provide(SCROLL_SPY_CONTEXT_KEY, {
  activeValue,
  setActiveValue,
  scrollProgress: readingProgress,
  registerItem,
  unregisterItem,
  variant: resolvedVariant,
  turn: resolvedTurn,
  indicator: resolvedIndicator,
  keepScrolled: toRef(props, "keepScrolled"),
  highlightParent: toRef(props, "highlightParent"),
  lineWidth: toRef(props, "lineWidth"),
  resolvedLineWidth,
  color: toRef(props, "color"),
  position: resolvedPosition,
  railPosition: resolvedRailPosition,
  scrollProgressSmooth,
  scrollContainer: resolvedContainer,
  offsetTop: toRef(props, "offsetTop"),
  items: registeredItems,
  getListEl: () => listEl.value,
  setListEl: (el) => {
    listEl.value = el;
  },
  scrollToHref,
  goToPrev,
  goToNext,
  isItemActive,
  isItemParentActive,
  isItemScrolled,
});

// Scroll Spy tracking for both local container and window, plus reading progress
function recomputeActive() {
  const container = resolvedContainer.value;
  if (!container || registeredItems.value.length === 0) return;

  const isWin = container === window;
  let currentScroll = 0;
  let maxScroll = 0;

  if (isWin) {
    currentScroll = window.scrollY;
    maxScroll = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  } else {
    const cEl = container as HTMLElement;
    currentScroll = cEl.scrollTop;
    maxScroll = Math.max(1, cEl.scrollHeight - cEl.clientHeight);
  }

  const prog = Math.min(1, Math.max(0, currentScroll / maxScroll));
  readingProgress.value = prog;
  emits("progress", prog);

  const containerTop = isWin
    ? 0
    : (container as HTMLElement).getBoundingClientRect().top;
  const triggerThreshold = containerTop + props.offsetTop + props.bounds + 40;

  let currentTarget = "";

  for (const item of registeredItems.value) {
    const selector = item.value.startsWith("#") ? item.value : `#${item.value}`;
    const target = isWin
      ? document.querySelector(selector)
      : (container as HTMLElement).querySelector(selector);

    if (!target) continue;
    const targetRect = target.getBoundingClientRect();
    if (targetRect.top <= triggerThreshold) {
      currentTarget = item.value;
    } else if (currentTarget) {
      break;
    }
  }

  const atBottom = isWin
    ? window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 6
    : (container as HTMLElement).scrollTop +
        (container as HTMLElement).clientHeight >=
      (container as HTMLElement).scrollHeight - 6;

  if (atBottom && registeredItems.value.length > 0) {
    currentTarget =
      registeredItems.value[registeredItems.value.length - 1]!.value;
  }

  if (!currentTarget && registeredItems.value.length > 0) {
    currentTarget = registeredItems.value[0]!.value;
  }

  if (currentTarget && currentTarget !== activeValue.value) {
    activeValue.value = currentTarget;
  }
}

let rafScroll = 0;
function onScroll() {
  if (typeof cancelAnimationFrame !== "undefined") {
    cancelAnimationFrame(rafScroll);
  }
  if (typeof requestAnimationFrame !== "undefined") {
    rafScroll = requestAnimationFrame(() => {
      recomputeActive();
    });
  } else {
    recomputeActive();
  }
}

function bindScrollListener() {
  unbindScrollListener();
  resolvedContainer.value = resolveContainer();
  const c = resolvedContainer.value;
  if (c && typeof (c as EventTarget).addEventListener === "function") {
    (c as EventTarget).addEventListener("scroll", onScroll, { passive: true });
  }
}

function unbindScrollListener() {
  if (typeof cancelAnimationFrame !== "undefined") {
    cancelAnimationFrame(rafScroll);
  }
  const c = resolvedContainer.value;
  if (c && typeof (c as EventTarget).removeEventListener === "function") {
    (c as EventTarget).removeEventListener("scroll", onScroll);
  }
}

let mountTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  bindScrollListener();
  recomputeActive();
  mountTimer = setTimeout(() => {
    bindScrollListener();
    recomputeActive();
  }, 100);
});

onBeforeUnmount(() => {
  if (mountTimer) {
    clearTimeout(mountTimer);
    mountTimer = null;
  }
  unbindScrollListener();
});

watch(
  () => props.scrollContainer,
  () => {
    bindScrollListener();
    recomputeActive();
  },
);

const navRef = useTemplateRef<HTMLElement>("navRef");
</script>

<template>
  <nav
    ref="navRef"
    data-uipkge
    data-slot="scroll-spy"
    :data-position="resolvedPosition"
    :data-rail-position="resolvedRailPosition"
    :data-variant="resolvedVariant"
    :data-turn="resolvedTurn"
    :data-indicator="resolvedIndicator"
    :data-keep-scrolled="keepScrolled ? 'true' : undefined"
    :data-highlight-parent="highlightParent ? 'true' : undefined"
    :data-line-width="lineWidth"
    :data-color="color"
    aria-label="Scroll spy navigation"
    :class="
      cn(
        'relative flex text-sm',
        resolvedPosition === 'top' || resolvedPosition === 'bottom'
          ? 'w-full flex-col'
          : 'flex-col',
        affix && (resolvedPosition === 'bottom' ? 'sticky bottom-4' : 'sticky'),
        props.class,
      )
    "
    :style="
      affix && resolvedPosition !== 'bottom'
        ? { top: `${offsetTop}px` }
        : undefined
    "
  >
    <template v-if="items && items.length > 0">
      <!-- Top Sticky Stepper Mode -->
      <ScrollSpyStepper v-if="resolvedPosition === 'top'" />

      <!-- Standard Left or Right Vertical Rail -->
      <template v-else-if="resolvedPosition !== 'bottom'">
        <ScrollSpyTitle v-if="title">{{ title }}</ScrollSpyTitle>
        <ScrollSpyList>
          <ScrollSpyIndicator />
          <template v-for="(item, itemIdx) in items" :key="item.href">
            <ScrollSpyItemComp
              :value="item.href"
              :depth="item.depth ?? 1"
              :class="
                itemIdx > 0 && items[itemIdx - 1]?.children?.length
                  ? 'mt-2'
                  : undefined
              "
            >
              <ScrollSpyLink :href="item.href" :title="item.title" />
            </ScrollSpyItemComp>
            <template
              v-for="(child, childIdx) in item.children ?? []"
              :key="child.href"
            >
              <ScrollSpyItemComp
                :value="child.href"
                :depth="child.depth ?? 2"
                :class="
                  childIdx === 0 ||
                  (childIdx > 0 &&
                    item.children?.[childIdx - 1]?.children?.length)
                    ? 'mt-2'
                    : undefined
                "
              >
                <ScrollSpyLink :href="child.href" :title="child.title" />
              </ScrollSpyItemComp>
              <template
                v-for="(grandchild, gIdx) in child.children ?? []"
                :key="grandchild.href"
              >
                <ScrollSpyItemComp
                  :value="grandchild.href"
                  :depth="grandchild.depth ?? 3"
                  :class="gIdx === 0 ? 'mt-2' : undefined"
                >
                  <ScrollSpyLink
                    :href="grandchild.href"
                    :title="grandchild.title"
                  />
                </ScrollSpyItemComp>
              </template>
            </template>
          </template>
        </ScrollSpyList>
      </template>

      <!-- Bottom Floating Stepper Capsule Mode -->
      <ScrollSpyStepper v-if="resolvedPosition === 'bottom'" />
    </template>
    <slot v-else />
  </nav>
</template>
