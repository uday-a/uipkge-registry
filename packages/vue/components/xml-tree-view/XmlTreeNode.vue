<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-vue-next";
import type { XmlNode } from "./types";
import { isExpandable, serializeXml } from "./types";

// Self-reference for recursive rendering — use defineAsyncComponent to avoid circular import
const XmlTreeNode = defineAsyncComponent(() => import("./XmlTreeNode.vue"));

interface Props {
  node: XmlNode;
  path: string[];
  isRoot?: boolean;
  search?: string;
  maxDepth?: number;
  matchesSearch: (node: XmlNode) => boolean;
  isExpanded: (path: string[]) => boolean;
  toggle: (path: string[]) => void;
  tagColor: string;
  attrNameColor: string;
  attrValueColor: string;
  textColor: string;
  commentColor: string;
  punctColor: string;
  copiedPath?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isRoot: false,
  search: "",
  maxDepth: 100,
  copiedPath: null,
});

const emit = defineEmits<{
  copy: [value: string, path: string[]];
}>();

function pathKey(path: string[]): string {
  return path.length ? "/" + path.join("/") : "/";
}

const key = computed(() => pathKey(props.path));
const open = computed(() => props.isExpanded(props.path));
const expandable = computed(() => isExpandable(props.node));
const dimmed = computed(
  () => !!props.search && !props.matchesSearch(props.node),
);
const indent = computed(() => (props.isRoot ? 0 : 20));

const parentKey = computed(() => {
  if (!props.path.length) return null;
  return pathKey(props.path.slice(0, -1));
});

/** Child path segments with sibling indices for duplicate tag names. */
const childEntries = computed(() => {
  const counts = new Map<string, number>();
  const totals = new Map<string, number>();
  for (const c of props.node.children) {
    if (c.type === "element") {
      totals.set(c.name, (totals.get(c.name) ?? 0) + 1);
    }
  }
  return props.node.children.map((child, i) => {
    let segment: string;
    if (child.type === "element") {
      const n = (counts.get(child.name) ?? 0) + 1;
      counts.set(child.name, n);
      const total = totals.get(child.name) ?? 1;
      segment = total > 1 ? `${child.name}[${n}]` : child.name;
    } else if (child.type === "comment") {
      segment = `comment()[${i}]`;
    } else if (child.type === "cdata") {
      segment = `text()[${i}]`;
    } else {
      segment = `text()[${i}]`;
    }
    return { child, segment, path: [...props.path, segment] as string[] };
  });
});

const childCount = computed(
  () => props.node.children.filter((c) => c.type === "element").length,
);

const collapsedPreview = computed(() => {
  if (open.value || !expandable.value) return "";
  const tags = props.node.children
    .filter((c) => c.type === "element")
    .slice(0, 3);
  const parts = tags.map(
    (c) => `<${c.name}${c.attributes.length ? " …" : ""}>`,
  );
  const suffix = childCount.value > 3 ? " …" : "";
  return parts.join(" ") + suffix;
});

const textOnlyChild = computed(() => {
  if (props.node.type !== "element") return null;
  if (
    props.node.children.length === 1 &&
    props.node.children[0]!.type === "text"
  ) {
    return props.node.children[0]!.text;
  }
  return null;
});

function onCopy() {
  const value =
    props.node.type === "element" ? serializeXml(props.node) : props.node.text;
  emit("copy", value, props.path);
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
    e.preventDefault();
    if (expandable.value) props.toggle(props.path);
    else onCopy();
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (expandable.value && !open.value) {
      props.toggle(props.path);
    } else if (expandable.value && open.value) {
      const rows = getTreeRows(target);
      const idx = rows.indexOf(target);
      if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1]);
    }
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (expandable.value && open.value) {
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
    :aria-expanded="expandable ? open : undefined"
  >
    <!-- Element node -->
    <template v-if="node.type === 'element'">
      <!-- Expandable element header -->
      <div
        v-if="expandable"
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
        <span :class="punctColor" class="select-none">&lt;</span>
        <span :class="tagColor" class="select-none">{{ node.name }}</span>
        <template v-for="attr in node.attributes" :key="attr.name">
          <span class="select-none">&nbsp;</span>
          <span :class="attrNameColor" class="select-none">{{
            attr.name
          }}</span>
          <span :class="punctColor" class="select-none">=</span>
          <span :class="attrValueColor" class="select-none"
            >"{{ attr.value }}"</span
          >
        </template>
        <span :class="punctColor" class="select-none">&gt;</span>
        <span v-if="open" class="text-muted-foreground ml-0.5 text-xs">
          {{ childCount }} {{ childCount === 1 ? "child" : "children" }}
        </span>
        <span
          v-else
          class="text-muted-foreground ml-1 truncate text-xs select-none"
          >{{ collapsedPreview }}</span
        >
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
          title="Copy subtree"
          aria-label="Copy subtree"
          tabindex="-1"
          @click.stop="onCopy"
        >
          <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
          <Copy v-else class="size-3" />
        </button>
      </div>

      <!-- Expandable children -->
      <div v-if="expandable && open" role="group">
        <XmlTreeNode
          v-for="entry in childEntries"
          :key="entry.segment"
          :node="entry.child"
          :path="entry.path"
          :is-root="false"
          :search="search"
          :max-depth="maxDepth"
          :matches-search="matchesSearch"
          :is-expanded="isExpanded"
          :toggle="toggle"
          :tag-color="tagColor"
          :attr-name-color="attrNameColor"
          :attr-value-color="attrValueColor"
          :text-color="textColor"
          :comment-color="commentColor"
          :punct-color="punctColor"
          :copied-path="copiedPath"
          @copy="(val, p) => emit('copy', val, p)"
        />
        <div
          class="flex items-center gap-0.5 py-0.5 select-none"
          :style="{ paddingLeft: `${indent}px` }"
        >
          <span class="inline-flex size-4 shrink-0" />
          <span :class="punctColor">&lt;/</span>
          <span :class="tagColor">{{ node.name }}</span>
          <span :class="punctColor">&gt;</span>
        </div>
      </div>

      <!-- Inline element: text-only or empty / self-closing -->
      <div
        v-if="!expandable"
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
        <span :class="punctColor" class="select-none">&lt;</span>
        <span :class="tagColor" class="select-none">{{ node.name }}</span>
        <template v-for="attr in node.attributes" :key="attr.name">
          <span class="select-none">&nbsp;</span>
          <span :class="attrNameColor" class="select-none">{{
            attr.name
          }}</span>
          <span :class="punctColor" class="select-none">=</span>
          <span :class="attrValueColor" class="select-none"
            >"{{ attr.value }}"</span
          >
        </template>
        <template v-if="textOnlyChild !== null">
          <span :class="punctColor" class="select-none">&gt;</span>
          <span :class="textColor" class="truncate">{{ textOnlyChild }}</span>
          <span :class="punctColor" class="shrink-0 select-none">&lt;/</span>
          <span :class="tagColor" class="shrink-0 select-none">{{
            node.name
          }}</span>
          <span :class="punctColor" class="shrink-0 select-none">&gt;</span>
        </template>
        <template v-else>
          <span :class="punctColor" class="select-none"> /&gt;</span>
        </template>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
          title="Copy value"
          aria-label="Copy value"
          tabindex="-1"
          @click.stop="onCopy"
        >
          <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
          <Copy v-else class="size-3" />
        </button>
      </div>
    </template>

    <!-- Comment -->
    <div
      v-else-if="node.type === 'comment'"
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
      <span :class="commentColor" class="truncate italic select-none"
        >&lt;!--{{ node.text }}--&gt;</span
      >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy comment"
        aria-label="Copy comment"
        tabindex="-1"
        @click.stop="onCopy"
      >
        <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
        <Copy v-else class="size-3" />
      </button>
    </div>

    <!-- CDATA -->
    <div
      v-else-if="node.type === 'cdata'"
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
      <span :class="punctColor" class="select-none">&lt;![CDATA[</span>
      <span :class="textColor" class="truncate">{{ node.text }}</span>
      <span :class="punctColor" class="shrink-0 select-none">]]&gt;</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy CDATA"
        aria-label="Copy CDATA"
        tabindex="-1"
        @click.stop="onCopy"
      >
        <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
        <Copy v-else class="size-3" />
      </button>
    </div>

    <!-- Bare text (rare when not folded into parent) -->
    <div
      v-else
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
      <span :class="textColor" class="truncate">{{ node.text }}</span>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring ml-auto inline-flex size-5 shrink-0 items-center justify-center rounded opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-1"
        title="Copy text"
        aria-label="Copy text"
        tabindex="-1"
        @click.stop="onCopy"
      >
        <Check v-if="copiedPath === key" class="size-3 text-emerald-500" />
        <Copy v-else class="size-3" />
      </button>
    </div>
  </div>
</template>
