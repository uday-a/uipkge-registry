<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  /** A single phrase or a list cycled type -> pause -> delete -> next. */
  phrases: string | string[];
  /** Milliseconds per typed character. */
  typingSpeed?: number;
  /** Milliseconds per deleted character. */
  deletingSpeed?: number;
  /** Milliseconds a completed phrase holds before deleting. */
  pause?: number;
  /** Milliseconds before the first character types. */
  startDelay?: number;
  /** When false, stops after fully typing the last phrase (caret keeps blinking). */
  loop?: boolean;
  showCaret?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  typingSpeed: 45,
  deletingSpeed: 25,
  pause: 1600,
  startDelay: 0,
  loop: true,
  showCaret: true,
});

const phraseList = computed(() =>
  Array.isArray(props.phrases) ? props.phrases : [props.phrases],
);
const srText = computed(() => phraseList.value.join(". "));

// Starts empty on server AND client first paint; sequencing begins in
// onMounted only, so SSR markup and hydration output always match.
const text = ref("");
const reduced = ref(false);

let timer: ReturnType<typeof setTimeout> | null = null;

function clearTimer() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

function schedule(fn: () => void, delay: number) {
  clearTimer();
  timer = setTimeout(() => {
    timer = null;
    fn();
  }, delay);
}

function run() {
  clearTimer();
  const list = phraseList.value;
  if (list.length === 0) return;

  let index = 0;
  let chars = 0;
  let deleting = false;

  function step() {
    const current = list[index] ?? "";
    if (!deleting) {
      chars += 1;
      text.value = current.slice(0, chars);
      if (chars < current.length) {
        schedule(step, props.typingSpeed);
      } else if (props.loop || index < list.length - 1) {
        schedule(() => {
          deleting = true;
          step();
        }, props.pause);
      }
      // loop=false on the last phrase: stop here; the caret keeps blinking.
    } else {
      chars -= 1;
      text.value = current.slice(0, chars);
      if (chars > 0) {
        schedule(step, props.deletingSpeed);
      } else {
        deleting = false;
        index = (index + 1) % list.length;
        step();
      }
    }
  }

  if (props.startDelay > 0) schedule(step, props.startDelay);
  else step();
}

onMounted(() => {
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced.value) {
    // Skip the animation entirely: render the phrase in full with a static caret.
    text.value = phraseList.value[0] ?? "";
    return;
  }
  run();
});

// Restart the sequence when the phrases prop changes.
watch(
  () => props.phrases,
  () => {
    if (reduced.value) {
      text.value = phraseList.value[0] ?? "";
      return;
    }
    run();
  },
);

onBeforeUnmount(clearTimer);
</script>

<template>
  <span data-uipkge data-slot="typewriter" :class="cn(props.class)">
    <span class="sr-only">{{ srText }}</span>
    <span aria-hidden="true" class="whitespace-pre-wrap"
      ><span>{{ text }}</span
      ><span
        v-if="props.showCaret"
        :class="[
          'inline-block h-[1em] w-[0.5ch] bg-current align-baseline',
          !reduced && 'animate-caret-blink',
        ]"
    /></span>
  </span>
</template>
