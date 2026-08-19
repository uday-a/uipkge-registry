<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import type { HTMLAttributes } from "vue";
import { Check, Copy } from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    /** Text to copy to the clipboard. */
    text?: string;
    /** Optional visible label next to the icon. */
    label?: string;
    /** Disable the button (no copy, no tooltip). */
    disabled?: boolean;
    /** Hide the copy icon (useful when a label is shown). */
    hideIcon?: boolean;
    /** Tooltip text shown on hover before copying. */
    tooltip?: string;
    /** Feedback text shown after a successful copy. */
    successText?: string;
    /** Feedback text shown after a failed copy. */
    errorText?: string;
    /** How long (ms) the success/error feedback stays before resetting. */
    timeout?: number;
    /** Show the feedback as a tooltip rather than swapping the icon. */
    feedbackTooltip?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    text: "",
    label: "",
    disabled: false,
    hideIcon: false,
    tooltip: "Copy",
    successText: "Copied!",
    errorText: "Failed",
    timeout: 2000,
    feedbackTooltip: true,
  },
);

const emit = defineEmits<{
  (e: "copy", text: string): void;
  (e: "success", text: string): void;
  (e: "error", error: Error): void;
}>();

type State = "idle" | "success" | "error";
const state = ref<State>("idle");
let resetTimer: ReturnType<typeof setTimeout> | null = null;

function setFeedback(nextState: State) {
  state.value = nextState;
  if (resetTimer) clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    state.value = "idle";
  }, props.timeout);
}

async function copy() {
  if (props.disabled) return;
  const value = props.text;
  emit("copy", value);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      // Legacy fallback for non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (!ok) throw new Error("execCommand copy failed");
    }
    setFeedback("success");
    emit("success", value);
  } catch (err) {
    setFeedback("error");
    emit("error", err as Error);
  }
}

const currentTooltip = computed(() => {
  if (state.value === "success") return props.successText;
  if (state.value === "error") return props.errorText;
  return props.tooltip;
});

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer);
});
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <Tooltip>
      <TooltipTrigger as-child>
        <button
          type="button"
          data-uipkge
          data-slot="clipboard"
          :data-feedback-state="state"
          :disabled="disabled"
          :class="
            cn(
              'inline-flex items-center gap-2 rounded-md text-sm transition-colors',
              'text-muted-foreground hover:text-foreground',
              'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              props.class,
            )
          "
          :aria-label="currentTooltip"
          @click="copy"
        >
          <span v-if="!hideIcon" data-slot="clipboard-icon" class="inline-flex">
            <Check v-if="state === 'success'" class="size-4 text-emerald-500" />
            <Copy v-else class="size-4" />
          </span>
          <span v-if="label" data-slot="clipboard-label">{{ label }}</span>
          <slot :state="state" />
        </button>
      </TooltipTrigger>
      <TooltipContent v-if="feedbackTooltip || state === 'idle'">
        {{ currentTooltip }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
