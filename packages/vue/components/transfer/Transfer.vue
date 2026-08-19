<script setup lang="ts">
import { computed, provide, ref, toRef } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import TransferList from "./TransferList.vue";
import TransferOperation from "./TransferOperation.vue";
import {
  TRANSFER_INJECTION_KEY,
  type TransferDragPayload,
  type TransferItem,
  type TransferSide,
} from "./context";

const props = withDefaults(
  defineProps<{
    targetKeys?: string[];
    dataSource: TransferItem[];
    titles?: [string, string];
    showSearch?: boolean;
    filterFn?: (query: string, item: TransferItem) => boolean;
    height?: number | string;
    pagination?: boolean | { pageSize: number };
    oneWay?: boolean;
    disabled?: boolean;
    draggable?: boolean;
    selectable?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    targetKeys: () => [],
    titles: () => ["Source", "Target"],
    showSearch: false,
    height: 320,
    pagination: false,
    oneWay: false,
    disabled: false,
    draggable: false,
    selectable: true,
  },
);

const emits = defineEmits<{
  (e: "update:targetKeys", keys: string[]): void;
  (
    e: "change",
    keys: string[],
    direction: "left" | "right",
    moved: string[],
  ): void;
  (e: "search", payload: { direction: "left" | "right"; query: string }): void;
  (e: "select-change", payload: { left: string[]; right: string[] }): void;
}>();

const dataMap = computed(
  () => new Map(props.dataSource.map((i) => [i.key, i])),
);

const sourceItems = computed(() =>
  props.dataSource.filter((i) => !props.targetKeys.includes(i.key)),
);

// When draggable, target order follows targetKeys exactly so reorder persists.
// Otherwise keep legacy dataSource ordering for backwards compat.
const targetItems = computed<TransferItem[]>(() => {
  if (props.draggable) {
    const out: TransferItem[] = [];
    for (const k of props.targetKeys) {
      const item = dataMap.value.get(k);
      if (item) out.push(item);
    }
    return out;
  }
  return props.dataSource.filter((i) => props.targetKeys.includes(i.key));
});

const selectedLeft = ref<string[]>([]);
const selectedRight = ref<string[]>([]);

const pageSize = computed<number | null>(() => {
  if (props.pagination === false) return null;
  if (props.pagination === true) return 10;
  return props.pagination.pageSize;
});

const defaultFilter = (q: string, item: TransferItem) =>
  item.label.toLowerCase().includes(q.toLowerCase());

const dragPayload = ref<TransferDragPayload | null>(null);

function startDrag(payload: TransferDragPayload) {
  dragPayload.value = payload;
}

function endDrag() {
  dragPayload.value = null;
}

function drop(toSide: TransferSide, beforeKey: string | null) {
  const payload = dragPayload.value;
  dragPayload.value = null;
  if (!payload || props.disabled) return;
  const keys = payload.keys.filter((k) => {
    const item = dataMap.value.get(k);
    return item && !item.disabled;
  });
  if (keys.length === 0) return;

  // left → left: reorder source not supported (parent owns dataSource order). No-op.
  if (payload.fromSide === "left" && toSide === "left") return;

  // right → left: remove from targetKeys (skip when oneWay).
  if (payload.fromSide === "right" && toSide === "left") {
    if (props.oneWay) return;
    const removeSet = new Set(keys);
    const next = props.targetKeys.filter((k) => !removeSet.has(k));
    selectedRight.value = selectedRight.value.filter((k) => !removeSet.has(k));
    emits("update:targetKeys", next);
    emits("change", next, "left", keys);
    emits("select-change", {
      left: selectedLeft.value,
      right: selectedRight.value,
    });
    return;
  }

  // → right: insert (cross-list move) or reorder (within-target).
  const movingSet = new Set(keys);
  const without = props.targetKeys.filter((k) => !movingSet.has(k));
  let insertAt = without.length;
  if (beforeKey != null) {
    const idx = without.indexOf(beforeKey);
    if (idx >= 0) insertAt = idx;
  }
  const next = [
    ...without.slice(0, insertAt),
    ...keys,
    ...without.slice(insertAt),
  ];
  if (payload.fromSide === "left") {
    const movedSet = new Set(keys);
    selectedLeft.value = selectedLeft.value.filter((k) => !movedSet.has(k));
    emits("update:targetKeys", next);
    emits("change", next, "right", keys);
    emits("select-change", {
      left: selectedLeft.value,
      right: selectedRight.value,
    });
  } else {
    // right → right: pure reorder, no change event (target set unchanged).
    emits("update:targetKeys", next);
  }
}

function onLeftSelected(keys: string[]) {
  selectedLeft.value = keys;
  emits("select-change", { left: keys, right: selectedRight.value });
}

function onRightSelected(keys: string[]) {
  selectedRight.value = keys;
  emits("select-change", { left: selectedLeft.value, right: keys });
}

function moveRight(keys?: string[]) {
  if (props.disabled) return;
  const moved = keys?.length ? [...keys] : [...selectedLeft.value];
  if (moved.length === 0) return;
  const next = [
    ...props.targetKeys,
    ...moved.filter((k) => !props.targetKeys.includes(k)),
  ];
  selectedLeft.value = selectedLeft.value.filter((k) => !moved.includes(k));
  emits("update:targetKeys", next);
  emits("change", next, "right", moved);
  emits("select-change", {
    left: selectedLeft.value,
    right: selectedRight.value,
  });
}

function moveLeft(keys?: string[]) {
  if (props.disabled || props.oneWay) return;
  const moved = keys?.length ? [...keys] : [...selectedRight.value];
  if (moved.length === 0) return;
  const remove = new Set(moved);
  const next = props.targetKeys.filter((k) => !remove.has(k));
  selectedRight.value = selectedRight.value.filter((k) => !remove.has(k));
  emits("update:targetKeys", next);
  emits("change", next, "left", moved);
  emits("select-change", {
    left: selectedLeft.value,
    right: selectedRight.value,
  });
}

provide(TRANSFER_INJECTION_KEY, {
  disabled: toRef(props, "disabled"),
  showSearch: toRef(props, "showSearch"),
  height: toRef(props, "height"),
  pageSize,
  filterFn: props.filterFn ?? defaultFilter,
  draggable: toRef(props, "draggable"),
  selectable: toRef(props, "selectable"),
  oneWay: toRef(props, "oneWay"),
  dragPayload,
  startDrag,
  endDrag,
  drop,
  moveRight,
  moveLeft,
});
</script>

<template>
  <div
    :class="cn('flex items-stretch gap-3', props.class)"
    data-uipkge
    data-slot="transfer"
  >
    <div class="min-w-0 flex-1">
      <TransferList
        side="left"
        :title="titles[0]"
        :items="sourceItems"
        :selected="selectedLeft"
        @update:selected="onLeftSelected"
        @search="emits('search', { direction: 'left', query: $event })"
      >
        <template v-if="$slots['footer-left']" #footer>
          <slot name="footer-left" />
        </template>
      </TransferList>
    </div>
    <TransferOperation
      :can-move-right="selectedLeft.length > 0 && !disabled"
      :can-move-left="selectedRight.length > 0 && !disabled"
      :one-way="oneWay"
      @move-right="moveRight"
      @move-left="moveLeft"
    />
    <div class="min-w-0 flex-1">
      <TransferList
        side="right"
        :title="titles[1]"
        :items="targetItems"
        :selected="selectedRight"
        @update:selected="onRightSelected"
        @search="emits('search', { direction: 'right', query: $event })"
      >
        <template v-if="$slots['footer-right']" #footer>
          <slot name="footer-right" />
        </template>
      </TransferList>
    </div>
  </div>
</template>
