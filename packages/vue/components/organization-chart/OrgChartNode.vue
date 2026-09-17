<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";
import { ChevronDown, ChevronRight } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { OrgNode } from "./types";

// Self-reference for recursive rendering
// Self-referencing recursion. Typing the lazy self-import as a loose
// Component breaks the circular slot-prop inference (otherwise vue-tsc
// cannot resolve slotProps for the recursive <OrgChartNode> usage).
const OrgChartNode = defineAsyncComponent(
  () => import("./OrgChartNode.vue"),
) as unknown as Component;

interface Props {
  node: OrgNode;
  depth: number;
  isRoot?: boolean;
  direction?: "top-down" | "left-right";
  showConnectors?: boolean;
  isExpanded: (node: OrgNode) => boolean;
  toggle: (node: OrgNode) => void;
}

const props = withDefaults(defineProps<Props>(), {
  isRoot: false,
  direction: "top-down",
  showConnectors: true,
});

const emit = defineEmits<{
  nodeClick: [node: OrgNode];
}>();

function onChildNodeClick(n: OrgNode) {
  emit("nodeClick", n);
}

const open = computed(() => props.isExpanded(props.node));
const hasChildren = computed(() => !!props.node.children?.length);
const isHorizontal = computed(() => props.direction === "left-right");
const childCount = computed(() => props.node.children?.length ?? 0);
const isOnlyChild = computed(() => childCount.value <= 1);

function onClick() {
  emit("nodeClick", props.node);
}

function onToggle(e: Event) {
  e.stopPropagation();
  if (hasChildren.value) props.toggle(props.node);
}

function onCardKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onClick();
  }
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
</script>

<template>
  <!-- ══ Top-down (vertical) layout ══ -->
  <div v-if="!isHorizontal" class="org-v" :data-root="isRoot ? '' : undefined">
    <!-- Node card -->
    <div class="org-v-card">
      <div
        role="button"
        tabindex="0"
        :aria-label="node.title ? `${node.name}, ${node.title}` : node.name"
        class="bg-card hover:bg-accent/50 border-border group focus-visible:ring-ring relative flex w-52 cursor-pointer flex-col rounded-lg border p-3 shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        :class="isRoot ? 'ring-primary/20 ring-2' : ''"
        @click="onClick"
        @keydown="onCardKeydown"
      >
        <div class="flex items-center gap-2.5">
          <img
            v-if="node.avatar"
            :src="node.avatar"
            :alt="node.name"
            class="border-border size-10 shrink-0 rounded-full border object-cover"
          />
          <div
            v-else
            class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            aria-hidden="true"
          >
            {{ initials(node.name) }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ node.name }}</p>
            <p v-if="node.title" class="text-muted-foreground truncate text-xs">
              {{ node.title }}
            </p>
          </div>
          <button
            v-if="hasChildren"
            type="button"
            class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-5 shrink-0 items-center justify-center rounded"
            :aria-expanded="open"
            :aria-label="open ? 'Collapse' : 'Expand'"
            @click="onToggle"
          >
            <ChevronDown v-if="open" class="size-3.5" aria-hidden="true" />
            <ChevronRight v-else class="size-3.5" aria-hidden="true" />
          </button>
        </div>
        <slot name="node" :node="node" />
      </div>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && open" class="org-v-children">
      <!-- Vertical line from parent to horizontal sibling bar -->
      <div v-if="showConnectors" class="org-v-line-down" />
      <div
        class="org-v-children-row"
        :data-single="isOnlyChild ? '' : undefined"
      >
        <!-- Horizontal bar connecting siblings (only for 2+ children) -->
        <div v-if="showConnectors && !isOnlyChild" class="org-v-line-across" />
        <OrgChartNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :depth="depth + 1"
          :is-root="false"
          :direction="direction"
          :show-connectors="showConnectors"
          :is-expanded="isExpanded"
          :toggle="toggle"
          @node-click="onChildNodeClick"
        >
          <template #node="slotProps">
            <slot name="node" v-bind="slotProps" />
          </template>
        </OrgChartNode>
      </div>
    </div>
  </div>

  <!-- ══ Left-right (horizontal) layout ══ -->
  <div v-else class="org-h" :data-root="isRoot ? '' : undefined">
    <div class="flex items-start">
      <!-- Node card -->
      <div class="org-h-card">
        <div
          role="button"
          tabindex="0"
          :aria-label="node.title ? `${node.name}, ${node.title}` : node.name"
          class="bg-card hover:bg-accent/50 border-border group focus-visible:ring-ring relative flex w-52 cursor-pointer flex-col rounded-lg border p-3 shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="isRoot ? 'ring-primary/20 ring-2' : ''"
          @click="onClick"
          @keydown="onCardKeydown"
        >
          <div class="flex items-center gap-2.5">
            <img
              v-if="node.avatar"
              :src="node.avatar"
              :alt="node.name"
              class="border-border size-10 shrink-0 rounded-full border object-cover"
            />
            <div
              v-else
              class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              aria-hidden="true"
            >
              {{ initials(node.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ node.name }}</p>
              <p
                v-if="node.title"
                class="text-muted-foreground truncate text-xs"
              >
                {{ node.title }}
              </p>
            </div>
            <button
              v-if="hasChildren"
              type="button"
              class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-5 shrink-0 items-center justify-center rounded"
              :aria-expanded="open"
              :aria-label="open ? 'Collapse' : 'Expand'"
              @click="onToggle"
            >
              <ChevronDown v-if="open" class="size-3.5" aria-hidden="true" />
              <ChevronRight v-else class="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <slot name="node" :node="node" />
        </div>
      </div>

      <!-- Children -->
      <template v-if="hasChildren && open">
        <div v-if="showConnectors" class="org-h-line-right" />
        <div class="org-h-children">
          <OrgChartNode
            v-for="child in node.children"
            :key="child.id"
            :node="child"
            :depth="depth + 1"
            :is-root="false"
            :direction="direction"
            :show-connectors="showConnectors"
            :is-expanded="isExpanded"
            :toggle="toggle"
            @node-click="onChildNodeClick"
          >
            <template #node="slotProps">
              <slot name="node" v-bind="slotProps" />
            </template>
          </OrgChartNode>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ══ Vertical (top-down) layout ══ */
.org-v {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Vertical line from horizontal bar up to each child card */
.org-v:not([data-root]) .org-v-card {
  position: relative;
  padding-top: 20px;
}
.org-v:not([data-root]) .org-v-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 20px;
  background: var(--color-border, hsl(var(--border)));
}

.org-v-children {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Vertical line from parent down to the sibling bar */
.org-v-line-down {
  width: 1px;
  height: 20px;
  background: var(--color-border, hsl(var(--border)));
}

.org-v-children-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  position: relative;
  padding-top: 20px;
}

/* Horizontal bar: spans from the center of the first child to the center
   of the last child. We use a full-width bar with the first/last child
   vertical lines connecting to it. The bar itself is positioned using
   the half-width of the first and last cards (w-52 = 208px, half = 104px). */
.org-v-line-across {
  position: absolute;
  top: 0;
  left: 104px; /* half of w-52 (208px) — center of first child */
  right: 104px; /* half of w-52 — center of last child */
  height: 1px;
  background: var(--color-border, hsl(var(--border)));
}

/* When single child, no horizontal bar needed — just the vertical line */
.org-v-children-row[data-single] .org-v-line-across {
  display: none;
}

/* ══ Horizontal (left-right) layout ══ */
.org-h {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Horizontal line from parent to children column */
.org-h-line-right {
  width: 20px;
  height: 1px;
  background: var(--color-border, hsl(var(--border)));
  margin-top: 40px;
  flex-shrink: 0;
}

.org-h-children {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

/* Vertical line connecting siblings in horizontal mode */
.org-h-children::before {
  content: "";
  position: absolute;
  left: 0;
  top: 40px;
  bottom: 40px;
  width: 1px;
  background: var(--color-border, hsl(var(--border)));
}

/* Horizontal line from vertical bar to each child */
.org-h:not([data-root]) .org-h-card {
  position: relative;
  padding-left: 20px;
}
.org-h:not([data-root]) .org-h-card::before {
  content: "";
  position: absolute;
  top: 40px;
  left: 0;
  width: 20px;
  height: 1px;
  background: var(--color-border, hsl(var(--border)));
}
</style>
