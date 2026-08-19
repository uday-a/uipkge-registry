<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-vue-next";
import type { JsonValue } from "./types";

// Self-reference for recursive rendering — use defineAsyncComponent to avoid circular import
const JsonTreeNode = defineAsyncComponent(() => import("./JsonTreeNode.vue"));

interface Props {
  data: JsonValue;
  path: (string | number)[];
  label: string;
  isRoot?: boolean;
  search?: string;
  maxDepth?: number;
  matchesSearch: (val: JsonValue) => boolean;
  isExpanded: (path: (string | number)[]) => boolean;
  toggle: (path: (string | number)[]) => void;
  typeOf: (
    val: JsonValue,
  ) => "object" | "array" | "string" | "number" | "boolean" | "null";
  formatValue: (val: JsonValue) => string;
  typeColor: Record<string, string>;
  keyColor: string;
  copiedPath?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isRoot: false,
  search: "",
  maxDepth: 100,
  copiedPath: null,
});

const emit = defineEmits<{
  copy: [value: JsonValue, path: (string | number)[]];
}>();

function pathKey(path: (string | number)[]): string {
  return path.length
    ? path.map((p) => (typeof p === "number" ? `[${p}]` : `.${p}`)).join("")
    : "$";
}

const key = computed(() => pathKey(props.path));
const type = computed(() => props.typeOf(props.data));
const open = computed(() => props.isExpanded(props.path));
const isContainer = computed(
  () => type.value === "object" || type.value === "array",
);
const dimmed = computed(
  () => !!props.search && !props.matchesSearch(props.data),
);

const entries = computed<[string | number, JsonValue][]>(() => {
  const val = props.data;
  if (Array.isArray(val)) return val.map((v, i) => [i, v] as const);
  if (val !== null && typeof val === "object")
    return Object.entries(val) as [string, JsonValue][];
  return [];
});

const count = computed(() => entries.value.length);
const indent = computed(() => (props.isRoot ? 0 : 20));

// Collapsed preview: show first few items inline
const collapsedPreview = computed(() => {
  if (open.value || !isContainer.value) return "";
  const items = entries.value.slice(0, 3);
  const parts = items.map(([k, v]) => {
    const vt = props.typeOf(v);
    let valStr: string;
    if (vt === "string") valStr = `"${String(v).slice(0, 20)}"`;
    else if (vt === "array") valStr = "[…]";
    else if (vt === "object") valStr = "{…}";
    else valStr = props.formatValue(v);
    return `${Array.isArray(props.data) ? "" : `"${k}": `}${valStr}`;
  });
  const suffix = count.value > 3 ? ", …" : "";
  const open2 = type.value === "array" ? "[" : "{";
  const close = type.value === "array" ? "]" : "}";
  return `${open2}${parts.join(", ")}${suffix}${close}`;
});

const parentKey = computed(() => {
  if (!props.path.length) return null;
  return pathKey(props.path.slice(0, -1));
});

function onCopy() {
  emit("copy", props.data, props.path);
}

function getTreeRows(from: HTMLElement): HTMLElement[] {
  const tree = from.closest('[role="tree"]');
  if (!tree) return [];
  return Array.from(tree.querySelectorAll<HTMLElement>("[data-tree-row]"));
}

function focusRow(row: HTMLElement | null | undefined) {
  row?.focus();
}

function handleRowKeydown(e: KeyboardEvent) {
  const target = e.currentTarget as HTMLElement;

  if (e.key === "Enter" || e.key === " ") {
    if (isContainer.value) {
      e.preventDefault();
      props.toggle(props.path);
    } else {
      e.preventDefault();
      onCopy();
    }
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (isContainer.value && !open.value) {
      props.toggle(props.path);
    } else if (isContainer.value && open.value) {
      const rows = getTreeRows(target);
      const idx = rows.indexOf(target);
      if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1]);
    }
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (isContainer.value && open.value) {
      props.toggle(props.path);
    } else if (parentKey.value) {
      const tree = target.closest('[role="tree"]');
      const parent = tree?.querySelector<HTMLElement>(
        `[data-tree-row][data-tree-id="${CSS.escape(parentKey.value)}"]`,
      );
      focusRow(parent);
    }
    return;
  }

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const rows = getTreeRows(target);
    const idx = rows.indexOf(target);
    if (idx < 0) return;
    focusRow(e.key === "ArrowDown" ? rows[idx + 1] : rows[idx - 1]);
    return;
  }

  if (e.key === "Home") {
    e.preventDefault();
    focusRow(getTreeRows(target)[0]);
    return;
  }

  if (e.key === "End") {
    e.preventDefault();
    const rows = getTreeRows(target);
    focusRow(rows[rows.length - 1]);
  }
}
</script>

<template>
  <div
    :data-dimmed="dimmed ? '' : undefined"
    :class="dimmed ? 'opacity-30' : ''"
    role="treeitem"
    :aria-expanded="isContainer ? open : undefined"
  >
    <!-- Container header row (object/array) -->
    <div
      v-if="isContainer"
      data-tree-row
      :data-tree-id="key"
      :data-tree-parent="parentKey ?? undefined"
      tabindex="0"
      class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      :style="{ paddingLeft: `${indent}px` }"
      @click="toggle(path)"
      @keydown="handleRowKeydown"
    >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-4 shrink-0 items-center justify-center rounded"
        :aria-expanded="open"
        :aria-label="open ? 'Collapse' : 'Expand'"
        tabindex="-1"
        @click.stop="toggle(path)"
      >
        <ChevronDown v-if="open" class="size-3.5" />
        <ChevronRight v-else class="size-3.5" />
      </button>
      <span :class="keyColor" class="select-none">
        {{ isRoot ? label : `"${label}"` }}
      </span>
      <span class="text-muted-foreground">:</span>
      <span v-if="open" class="text-muted-foreground select-none">{{
        type === "array" ? "[" : "{"
      }}</span>
      <span v-else class="text-muted-foreground select-none">{{
        collapsedPreview
      }}</span>
      <span v-if="open" class="text-muted-foreground ml-0.5 text-xs"
        >{{ count }} {{ count === 1 ? "item" : "items" }}</span
      >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy value"
        aria-label="Copy value"
        tabindex="-1"
        @click.stop="onCopy"
      >
        <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
        <Copy v-else class="size-3" />
      </button>
    </div>

    <!-- Container children -->
    <div v-if="isContainer && open" role="group">
      <JsonTreeNode
        v-for="[k, v] in entries"
        :key="String(k)"
        :data="v"
        :path="[...path, k]"
        :label="String(k)"
        :is-root="false"
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
        @copy="(val, p) => emit('copy', val, p)"
      />
      <div
        class="text-muted-foreground py-0.5 select-none"
        :style="{ paddingLeft: `${indent}px` }"
      >
        {{ type === "array" ? "]" : "}" }}
      </div>
    </div>

    <!-- Primitive leaf -->
    <div
      v-if="!isContainer"
      data-tree-row
      :data-tree-id="key"
      :data-tree-parent="parentKey ?? undefined"
      tabindex="0"
      class="group hover:bg-accent/40 focus-visible:ring-ring/50 -mx-1 flex items-center gap-0.5 rounded px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      :style="{ paddingLeft: `${indent}px` }"
      @click="onCopy"
      @keydown="handleRowKeydown"
    >
      <span class="inline-flex size-4 shrink-0" />
      <span v-if="isRoot" class="text-muted-foreground select-none">{{
        label
      }}</span>
      <span v-else :class="keyColor" class="select-none">"{{ label }}"</span>
      <span class="text-muted-foreground">:</span>
      <span
        :class="typeColor[type] ?? 'text-foreground'"
        class="rounded text-left font-mono"
      >
        {{ formatValue(data) }}
      </span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy value"
        aria-label="Copy value"
        tabindex="-1"
        @click.stop="onCopy"
      >
        <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
        <Copy v-else class="size-3" />
      </button>
    </div>
  </div>
</template>
