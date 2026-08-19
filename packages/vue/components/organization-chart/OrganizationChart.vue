<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { organizationChartVariants } from "./organization-chart.variants";
import OrgChartNode from "./OrgChartNode.vue";
import type { OrgNode } from "./types";

interface Props {
  data: OrgNode;
  direction?: "top-down" | "left-right";
  defaultExpanded?: boolean;
  showConnectors?: boolean;
  zoomable?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  direction: "top-down",
  defaultExpanded: true,
  showConnectors: true,
  zoomable: false,
});

const emit = defineEmits<{
  nodeClick: [node: OrgNode];
  toggle: [node: OrgNode, expanded: boolean];
}>();

const expanded = ref<Set<string>>(new Set());

function collectIds(node: OrgNode, acc: string[] = []): string[] {
  acc.push(node.id);
  if (node.children) for (const c of node.children) collectIds(c, acc);
  return acc;
}

function defaultExpand() {
  if (props.defaultExpanded) {
    expanded.value = new Set(collectIds(props.data));
  } else {
    expanded.value = new Set([props.data.id]);
  }
}

watch(
  () => [props.data, props.defaultExpanded],
  () => defaultExpand(),
  { immediate: true },
);

function toggleNode(node: OrgNode) {
  const next = new Set(expanded.value);
  if (next.has(node.id)) next.delete(node.id);
  else next.add(node.id);
  expanded.value = next;
  emit("toggle", node, next.has(node.id));
}

function isExpanded(node: OrgNode): boolean {
  return expanded.value.has(node.id);
}

function expandAll() {
  expanded.value = new Set(collectIds(props.data));
}

function collapseAll() {
  expanded.value = new Set([props.data.id]);
}

const zoom = ref(1);
function zoomIn() {
  zoom.value = Math.min(2, zoom.value + 0.1);
}
function zoomOut() {
  zoom.value = Math.max(0.5, zoom.value - 0.1);
}
function resetZoom() {
  zoom.value = 1;
}

const containerStyle = computed(() => ({
  transform: `scale(${zoom.value})`,
  transformOrigin: "top center",
}));

defineExpose({ expandAll, collapseAll, zoomIn, zoomOut, resetZoom });
</script>

<template>
  <div
    data-uipkge
    data-slot="organization-chart"
    :data-direction="direction"
    :class="cn(organizationChartVariants(), props.class)"
  >
    <div
      v-if="zoomable"
      class="border-border flex items-center gap-2 border-b px-3 py-2"
    >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
        aria-label="Zoom out"
        @click="zoomOut"
      >
        −
      </button>
      <span class="text-muted-foreground w-12 text-center text-xs tabular-nums"
        >{{ Math.round(zoom * 100) }}%</span
      >
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent inline-flex size-7 items-center justify-center rounded-md text-sm"
        aria-label="Zoom in"
        @click="zoomIn"
      >
        +
      </button>
      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-accent ml-1 rounded-md px-2 py-1 text-xs"
        aria-label="Reset zoom"
        @click="resetZoom"
      >
        Reset
      </button>
      <div class="ml-auto flex gap-1">
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
          aria-label="Expand all"
          @click="expandAll"
        >
          Expand all
        </button>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-2 py-1 text-xs"
          aria-label="Collapse all"
          @click="collapseAll"
        >
          Collapse all
        </button>
      </div>
    </div>
    <div class="overflow-auto p-4">
      <div :style="containerStyle" class="transition-transform duration-200">
        <OrgChartNode
          :node="data"
          :depth="0"
          :is-root="true"
          :direction="direction"
          :show-connectors="showConnectors"
          :is-expanded="isExpanded"
          :toggle="toggleNode"
          @node-click="(n) => emit('nodeClick', n)"
        >
          <template #node="{ node }">
            <slot name="node" :node="node" />
          </template>
        </OrgChartNode>
      </div>
    </div>
  </div>
</template>
