<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import TourMask from "./TourMask.vue";
import TourCard from "./TourCard.vue";
import { useTourTarget } from "./use-tour-target";
import type { TourStep } from ".";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    current?: number;
    steps: TourStep[];
    mask?: boolean;
    type?: "default" | "primary";
    zIndex?: number;
  }>(),
  {
    open: false,
    current: 0,
    mask: true,
    type: "default",
    zIndex: 1000,
  },
);

const emits = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "update:current", v: number): void;
  (e: "change", v: number): void;
  (e: "finish"): void;
  (e: "close"): void;
}>();

const stepIndex = ref(props.current);
watch(
  () => props.current,
  (v) => (stepIndex.value = v),
);

const currentStep = computed<TourStep | null>(
  () => props.steps[stepIndex.value] ?? null,
);

const targetRef = computed(() => currentStep.value?.target);
const { rect, attach, detach, measure } = useTourTarget(targetRef);

/** Element that held focus before the tour opened — restored on close. */
let previousFocus: HTMLElement | null = null;

watch(
  [() => props.open, stepIndex],
  async ([open], oldVal) => {
    // oldVal is undefined on the immediate first run — never destructure it.
    const wasOpen = oldVal?.[0] ?? false;
    if (!open) {
      detach();
      if (wasOpen) {
        previousFocus?.focus?.();
        previousFocus = null;
      }
      return;
    }
    if (!wasOpen && typeof document !== "undefined") {
      previousFocus = (document.activeElement as HTMLElement | null) ?? null;
    }
    await nextTick();
    attach();
    const t = currentStep.value?.target;
    if (t) {
      const el =
        typeof t === "string"
          ? (document.querySelector(t) as HTMLElement | null)
          : typeof t === "function"
            ? t()
            : t;
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
      // Re-measure after smooth scroll settles; skip long wait when reduce.
      setTimeout(measure, reduce ? 0 : 320);
    }
  },
  { immediate: true },
);

function setStep(i: number) {
  stepIndex.value = i;
  emits("update:current", i);
  emits("change", i);
}

function next() {
  if (stepIndex.value < props.steps.length - 1) setStep(stepIndex.value + 1);
}

function prev() {
  if (stepIndex.value > 0) setStep(stepIndex.value - 1);
}

function finish() {
  emits("finish");
  emits("update:open", false);
}

function skip() {
  emits("close");
  emits("update:open", false);
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === "Escape") {
    e.preventDefault();
    skip();
  }
}

watch(
  () => props.open,
  (v) => {
    if (typeof document === "undefined") return;
    if (v) document.addEventListener("keydown", onKeydown);
    else document.removeEventListener("keydown", onKeydown);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof document !== "undefined") {
    document.removeEventListener("keydown", onKeydown);
  }
  detach();
  previousFocus = null;
});

const showMask = computed(() => {
  const stepMask = currentStep.value?.mask;
  if (stepMask !== undefined) return stepMask;
  return props.mask;
});
</script>

<template>
  <Teleport to="body">
    <template v-if="open && currentStep">
      <TourMask v-if="showMask" :rect="rect" :z-index="zIndex" />
      <TourCard
        :title="currentStep.title"
        :description="currentStep.description"
        :cover="currentStep.cover"
        :rect="rect"
        :total="steps.length"
        :current="stepIndex"
        :prev-text="currentStep.prevButtonText"
        :next-text="currentStep.nextButtonText"
        :finish-text="currentStep.finishButtonText"
        :type="type"
        :z-index="zIndex"
        autofocus
        @prev="prev"
        @next="next"
        @finish="finish"
        @skip="skip"
      />
    </template>
  </Teleport>
</template>
