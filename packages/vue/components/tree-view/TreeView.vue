<script setup lang="ts">
import {
  onMounted,
  provide,
  ref,
  toRef,
  watch,
  type HTMLAttributes,
} from "vue";
import { cn } from "@/lib/utils";
import { TREE_VIEW_CONTEXT } from "./context";
import type { TreeViewItem } from "./types";
// Explicit import required for non-Nuxt consumers (shadcn-vue copies source as-is).
import TreeViewNode from "./TreeViewNode.vue";

interface Props {
  items: TreeViewItem[];
  class?: HTMLAttributes["class"];
  showIcons?: boolean;
  showCheckboxes?: boolean;
  defaultExpanded?: boolean;
  selectedId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  showIcons: true,
  showCheckboxes: false,
  defaultExpanded: false,
  selectedId: null,
});

const emit = defineEmits<{
  select: [item: TreeViewItem];
  toggle: [item: TreeViewItem];
  "update:selectedId": [id: string | null];
}>();

const expandedIds = ref<Set<string>>(new Set());
const selectedId = ref<string | null>(props.selectedId);

watch(
  () => props.selectedId,
  (val) => {
    selectedId.value = val;
  },
);

function toggle(item: TreeViewItem) {
  if (item.disabled) return;
  const next = new Set(expandedIds.value);
  if (next.has(item.id)) next.delete(item.id);
  else next.add(item.id);
  expandedIds.value = next;
  emit("toggle", item);
}

function select(item: TreeViewItem) {
  if (item.disabled) return;
  selectedId.value = item.id;
  emit("select", item);
  emit("update:selectedId", item.id);
}

provide(TREE_VIEW_CONTEXT, {
  expandedIds,
  selectedId,
  showIcons: toRef(props, "showIcons"),
  showCheckboxes: toRef(props, "showCheckboxes"),
  toggle,
  select,
});

onMounted(() => {
  if (!props.defaultExpanded) return;
  const next = new Set<string>();
  const walk = (items: TreeViewItem[]) => {
    for (const it of items) {
      if (it.children?.length) {
        next.add(it.id);
        walk(it.children);
      }
    }
  };
  walk(props.items);
  expandedIds.value = next;
});
</script>

<template>
  <div :class="cn('text-sm', props.class)" role="tree">
    <TreeViewNode
      v-for="(item, i) in items"
      :key="item.id"
      :item="item"
      :depth="0"
      :is-last="i === items.length - 1"
    />
  </div>
</template>
