<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, ref, watch } from "vue";
import { Search, Braces, FoldVertical, UnfoldVertical } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import JsonTreeNode from "./JsonTreeNode.vue";
import type { JsonValue } from "./types";

export type { JsonValue } from "./types";

interface Props {
  data: JsonValue;
  expandDepth?: number;
  maxDepth?: number;
  showSearch?: boolean;
  showToolbar?: boolean;
  rootLabel?: string;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  expandDepth: 1,
  maxDepth: 100,
  showSearch: true,
  showToolbar: true,
  rootLabel: "root",
});

const emit = defineEmits<{
  copy: [value: string, path: string];
}>();

const expanded = ref<Set<string>>(new Set());
const search = ref("");
const copiedPath = ref<string | null>(null);

function pathKey(path: (string | number)[]): string {
  return path.length
    ? path.map((p) => (typeof p === "number" ? `[${p}]` : `.${p}`)).join("")
    : "$";
}

function defaultExpanded(): Set<string> {
  const next = new Set<string>();
  const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
    if (depth >= props.expandDepth) return;
    if (val !== null && typeof val === "object") {
      next.add(pathKey(path));
      const entries = Array.isArray(val)
        ? val.map((v, i) => [i, v] as const)
        : Object.entries(val);
      for (const [k, v] of entries) {
        walk(v as JsonValue, [...path, k], depth + 1);
      }
    }
  };
  walk(props.data);
  return next;
}

watch(
  () => [props.data, props.expandDepth],
  () => {
    expanded.value = defaultExpanded();
  },
  { immediate: true },
);

function toggle(path: (string | number)[]) {
  const key = pathKey(path);
  const next = new Set(expanded.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  expanded.value = next;
}

function isExpanded(path: (string | number)[]): boolean {
  return expanded.value.has(pathKey(path));
}

function expandAll() {
  const next = new Set<string>();
  const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
    if (depth >= props.maxDepth) return;
    if (val !== null && typeof val === "object") {
      next.add(pathKey(path));
      const entries = Array.isArray(val)
        ? val.map((v, i) => [i, v] as const)
        : Object.entries(val);
      for (const [k, v] of entries) {
        walk(v as JsonValue, [...path, k], depth + 1);
      }
    }
  };
  walk(props.data);
  expanded.value = next;
}

function collapseAll() {
  expanded.value = new Set();
}

// Auto-expand nodes that contain search matches
watch(search, (q) => {
  if (!q) {
    expanded.value = defaultExpanded();
    return;
  }
  const next = new Set<string>();
  const walk = (val: JsonValue, path: (string | number)[] = [], depth = 0) => {
    if (depth >= props.maxDepth) return;
    if (val !== null && typeof val === "object") {
      if (matchesSearch(val)) next.add(pathKey(path));
      const entries = Array.isArray(val)
        ? val.map((v, i) => [i, v] as const)
        : Object.entries(val);
      for (const [k, v] of entries) {
        walk(v as JsonValue, [...path, k], depth + 1);
      }
    }
  };
  walk(props.data);
  expanded.value = next;
});

function matchesSearch(val: JsonValue): boolean {
  if (!search.value) return true;
  const term = search.value.toLowerCase();
  const walk = (v: JsonValue): boolean => {
    if (v === null) return "null".includes(term);
    if (typeof v === "string") return v.toLowerCase().includes(term);
    if (typeof v === "number" || typeof v === "boolean")
      return String(v).includes(term);
    if (Array.isArray(v)) return v.some(walk);
    if (typeof v === "object")
      return Object.entries(v).some(
        ([k, val]) => k.toLowerCase().includes(term) || walk(val),
      );
    return false;
  };
  return walk(val);
}

function typeOf(
  val: JsonValue,
): "object" | "array" | "string" | "number" | "boolean" | "null" {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val as "object" | "string" | "number" | "boolean";
}

function formatValue(val: JsonValue): string {
  if (val === null) return "null";
  if (typeof val === "string") return JSON.stringify(val);
  return String(val);
}

const typeColor: Record<string, string> = {
  string: "text-emerald-600 dark:text-emerald-400",
  number: "text-blue-600 dark:text-blue-400",
  boolean: "text-amber-600 dark:text-amber-400",
  null: "text-muted-foreground italic",
  object: "text-foreground",
  array: "text-foreground",
};

const keyColor = "text-violet-600 dark:text-violet-400";

async function copyValue(val: JsonValue, path: (string | number)[]) {
  const str = typeof val === "string" ? val : JSON.stringify(val, null, 2);
  const p = pathKey(path);
  try {
    await navigator.clipboard.writeText(str);
    copiedPath.value = p;
    emit("copy", str, p);
    setTimeout(() => {
      if (copiedPath.value === p) copiedPath.value = null;
    }, 1200);
  } catch {
    // clipboard unavailable
  }
}

const summary = computed(() => {
  const t = typeOf(props.data);
  if (t === "array") return `Array(${(props.data as JsonValue[]).length})`;
  if (t === "object")
    return `Object(${Object.keys(props.data as object).length})`;
  return t;
});

const searchMatchCount = computed(() => {
  if (!search.value) return 0;
  let count = 0;
  const walk = (v: JsonValue) => {
    if (v === null) {
      if ("null".includes(search.value.toLowerCase())) count++;
      return;
    }
    if (typeof v === "string") {
      if (v.toLowerCase().includes(search.value.toLowerCase())) count++;
      return;
    }
    if (typeof v === "number" || typeof v === "boolean") {
      if (String(v).includes(search.value)) count++;
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (typeof v === "object") {
      Object.entries(v).forEach(([k, val]) => {
        if (k.toLowerCase().includes(search.value.toLowerCase())) count++;
        walk(val);
      });
    }
  };
  walk(props.data);
  return count;
});
</script>

<template>
  <div
    data-uipkge
    data-slot="json-tree-view"
    :class="
      cn(
        'bg-background flex flex-col overflow-hidden rounded-lg border font-mono text-sm',
        props.class,
      )
    "
  >
    <!-- Toolbar -->
    <div
      v-if="showToolbar || showSearch"
      class="border-border flex items-center gap-2 border-b px-3 py-2"
    >
      <div class="flex items-center gap-1.5">
        <Braces class="text-muted-foreground size-4" />
        <span class="text-muted-foreground text-xs">{{ summary }}</span>
      </div>
      <div class="ml-auto flex items-center gap-1">
        <div v-if="showSearch" class="relative">
          <Search
            class="text-muted-foreground absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Filter..."
            aria-label="Filter JSON tree"
            class="border-input bg-muted/40 focus:border-ring focus:ring-ring/30 h-7 w-32 rounded-md pr-2 pl-7 text-xs transition-[width] outline-none focus:w-44 focus:ring-2"
          />
        </div>
        <span v-if="search" class="text-muted-foreground text-xs"
          >{{ searchMatchCount }} match{{
            searchMatchCount === 1 ? "" : "es"
          }}</span
        >
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
          title="Expand all"
          aria-label="Expand all"
          @click="expandAll"
        >
          <UnfoldVertical class="size-4" />
        </button>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md transition-colors"
          title="Collapse all"
          aria-label="Collapse all"
          @click="collapseAll"
        >
          <FoldVertical class="size-4" />
        </button>
      </div>
    </div>

    <!-- Tree -->
    <div
      class="min-h-0 flex-1 overflow-auto p-2"
      role="tree"
      :aria-label="rootLabel"
    >
      <JsonTreeNode
        :data="data"
        :path="[]"
        :label="rootLabel"
        :is-root="true"
        :search="search"
        :max-depth="maxDepth"
        :matches-search="matchesSearch"
        :is-expanded="isExpanded"
        :toggle="toggle"
        :type-of="typeOf"
        :format-value="formatValue"
        :type-color="typeColor"
        :key-color="keyColor"
        :copied-path="copiedPath"
        @copy="copyValue"
      />
    </div>
  </div>
</template>
