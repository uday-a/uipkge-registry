<script setup lang="ts">
import { computed, onMounted, watch, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  /** Text to search within. */
  text: string;
  /** Query string or RegExp to highlight. */
  query: string | RegExp;
  /** HTML tag used to wrap matched substrings. Default 'mark'. */
  highlightTag?: "mark" | "span";
  /** Class applied to each highlight wrapper. */
  highlightClass?: HTMLAttributes["class"];
  /** Inline style applied to each highlight wrapper. */
  highlightStyle?: HTMLAttributes["style"];
  /** Case-sensitive matching. Default false. */
  caseSensitive?: boolean;
  /** Match whole words only. Default false. */
  wholeWord?: boolean;
  /** Cap the number of highlights rendered. 0 = unlimited. Default 0. */
  maxHighlights?: number;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  highlightTag: "mark",
  caseSensitive: false,
  wholeWord: false,
  maxHighlights: 0,
});

const emit = defineEmits<{
  /** Total match count before maxHighlights cap. Mirrors React `onTotalMatchCount`. */
  matchCount: [count: number];
  /** Highlights actually rendered after maxHighlights cap. Mirrors React `onMatchCount`. */
  renderedMatchCount: [count: number];
}>();

interface Segment {
  text: string;
  match: boolean;
}

const segments = computed<Segment[]>(() => {
  const text = props.text;
  const query = props.query;
  if (!text) return [];
  if (!query) return [{ text, match: false }];

  let pattern: RegExp;
  if (query instanceof RegExp) {
    const flags = query.flags.includes("g") ? query.flags : query.flags + "g";
    pattern = new RegExp(query.source, flags);
  } else {
    if (!query) return [{ text, match: false }];
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const body = props.wholeWord ? `\\b${escaped}\\b` : escaped;
    const flags = props.caseSensitive ? "g" : "gi";
    pattern = new RegExp(body, flags);
  }

  const out: Segment[] = [];
  let last = 0;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last)
      out.push({ text: text.slice(last, m.index), match: false });
    out.push({ text: m[0], match: true });
    last = m.index + m[0].length;
    count++;
    if (props.maxHighlights > 0 && count >= props.maxHighlights) break;
    if (m[0] === "") pattern.lastIndex++;
  }
  if (last < text.length) out.push({ text: text.slice(last), match: false });

  return out;
});

// Total match count (uncapped) — emitted via watch to avoid side-effects in computed
const totalMatchCount = computed(() => {
  const text = props.text;
  const query = props.query;
  if (!text || !query) return 0;

  let pattern: RegExp;
  if (query instanceof RegExp) {
    const flags = query.flags.includes("g") ? query.flags : query.flags + "g";
    pattern = new RegExp(query.source, flags);
  } else {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const body = props.wholeWord ? `\\b${escaped}\\b` : escaped;
    const flags = props.caseSensitive ? "g" : "gi";
    pattern = new RegExp(body, flags);
  }

  let total = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    total++;
    if (m[0] === "") pattern.lastIndex++;
  }
  return total;
});

const renderedMatchCount = computed(
  () => segments.value.filter((s) => s.match).length,
);

watch(totalMatchCount, (n) => emit("matchCount", n));
watch(renderedMatchCount, (n) => emit("renderedMatchCount", n));
onMounted(() => {
  emit("matchCount", totalMatchCount.value);
  emit("renderedMatchCount", renderedMatchCount.value);
});
</script>

<template>
  <span data-uipkge data-slot="highlight" :class="cn(props.class)">
    <template v-for="(seg, i) in segments" :key="i">
      <component
        :is="highlightTag"
        v-if="seg.match"
        data-slot="highlight-match"
        :class="
          cn(
            'bg-accent text-accent-foreground dark:bg-accent/30 dark:text-accent-foreground rounded px-0.5 font-medium',
            highlightClass,
          )
        "
        :style="highlightStyle"
        >{{ seg.text }}</component
      >
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>
