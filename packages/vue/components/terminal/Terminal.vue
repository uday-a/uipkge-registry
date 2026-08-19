<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type HTMLAttributes,
} from "vue";
import { cn } from "@/lib/utils";

export interface TerminalLine {
  /** Prompt prefix shown before the command. Omit for output-only lines. */
  prompt?: string;
  /** Command text shown after the prompt. */
  command?: string;
  /** Output lines rendered below the command. */
  output?: string;
  /** Override the line type: 'command' renders prompt+command, 'output' renders plain text. */
  type?: "command" | "output";
}

interface Props {
  /** Command history to render. */
  lines: TerminalLine[];
  /** Window title shown in the title bar. Default 'bash'. */
  title?: string;
  /** Prompt character. Default '$'. */
  promptChar?: string;
  /** Color theme. Default 'dark'. */
  theme?: "dark" | "light";
  /** Auto-scroll to bottom when new lines arrive. Default true. */
  autoScroll?: boolean;
  /** Animate lines typing in one-by-one. Default false. */
  typing?: boolean;
  /** Typing speed in ms per line. Default 120. */
  typingSpeed?: number;
  /** Max height before scrolling. Default '400px'. */
  maxHeight?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  title: "bash",
  promptChar: "$",
  theme: "dark",
  autoScroll: true,
  typing: false,
  typingSpeed: 120,
  maxHeight: "400px",
});

const bodyRef = ref<HTMLElement | null>(null);
const visibleCount = ref(props.typing ? 0 : props.lines.length);

const resolvedLines = computed(() =>
  props.lines.map((l) => ({
    ...l,
    type: l.type ?? (l.prompt || l.command ? "command" : "output"),
    prompt: l.prompt ?? (l.type === "output" ? "" : props.promptChar),
  })),
);

const shownLines = computed(() =>
  resolvedLines.value.slice(0, visibleCount.value),
);

function scrollToBottom() {
  if (!props.autoScroll || !bodyRef.value) return;
  nextTick(() => {
    if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
  });
}

watch(
  () => props.lines.length,
  () => {
    if (props.typing) {
      // Reset typing animation when lines change.
      visibleCount.value = 0;
      runTyping();
    } else {
      visibleCount.value = props.lines.length;
      scrollToBottom();
    }
  },
);

let typingTimer: ReturnType<typeof setTimeout> | null = null;
function runTyping() {
  if (typingTimer) clearTimeout(typingTimer);
  const tick = () => {
    if (visibleCount.value < props.lines.length) {
      visibleCount.value++;
      scrollToBottom();
      typingTimer = setTimeout(tick, props.typingSpeed);
    }
  };
  typingTimer = setTimeout(tick, props.typingSpeed);
}

onMounted(() => {
  if (props.typing) runTyping();
  else scrollToBottom();
});

onBeforeUnmount(() => {
  if (typingTimer) clearTimeout(typingTimer);
});
</script>

<template>
  <div
    data-uipkge
    data-slot="terminal"
    :data-theme="theme"
    :class="
      cn(
        'relative overflow-hidden rounded-lg border font-mono text-sm shadow-sm',
        theme === 'dark'
          ? 'bg-card text-card-foreground border-border'
          : 'bg-muted border-border',
        props.class,
      )
    "
  >
    <!-- Title bar -->
    <div
      :class="
        cn(
          'flex items-center gap-2 border-b px-4 py-2.5',
          theme === 'dark'
            ? 'border-border bg-muted'
            : 'border-border bg-muted',
        )
      "
    >
      <div class="flex gap-1.5">
        <span class="bg-destructive size-3 rounded-full" />
        <span class="bg-warning size-3 rounded-full" />
        <span class="bg-success size-3 rounded-full" />
      </div>
      <span :class="cn('text-muted-foreground ml-2 text-xs')">{{ title }}</span>
    </div>

    <!-- Body -->
    <div
      ref="bodyRef"
      class="overflow-auto p-4 leading-relaxed"
      :style="{ maxHeight: props.maxHeight }"
    >
      <div
        v-for="(line, i) in shownLines"
        :key="i"
        data-slot="terminal-line"
        class="break-words whitespace-pre-wrap"
      >
        <slot name="line" :line="line" :index="i">
          <div
            v-if="line.type === 'command'"
            data-slot="terminal-command"
            class="flex flex-wrap items-baseline gap-x-1.5"
          >
            <span :class="cn('text-success shrink-0 font-semibold')">{{
              line.prompt
            }}</span>
            <span>{{ line.command }}</span>
          </div>
          <div
            v-if="line.output"
            data-slot="terminal-output"
            class="text-muted-foreground"
          >
            {{ line.output }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>
