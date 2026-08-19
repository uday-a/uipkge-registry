<script setup lang="ts" generic="T extends TreeTableRow">
import { computed, onMounted, ref, watch, type HTMLAttributes } from "vue";
import { ChevronRight, FileBox } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TreeTableColumn, TreeTableRow } from "./types";

interface Props {
  /** Tree-structured row data. */
  data: TreeTableRow<T>[];
  /** Column configuration. */
  columns: TreeTableColumn<T>[];
  /** Indent per nesting level in pixels. Default 24. */
  indent?: number;
  /** Expand all rows on mount. Default false. */
  defaultExpanded?: boolean;
  /** Show row selection checkboxes. Default false. */
  selectable?: boolean;
  /** Loading state — shows a spinner overlay. Default false. */
  loading?: boolean;
  /** Empty state message. Default 'No data.'. */
  emptyText?: string;
  /** Controlled selected row ids (v-model:selected). */
  selected?: string[];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  indent: 24,
  defaultExpanded: false,
  selectable: false,
  loading: false,
  emptyText: "No data.",
});

const emit = defineEmits<{
  "update:selected": [ids: string[]];
  select: [ids: string[]];
  expand: [id: string, expanded: boolean];
}>();

function collectExpandedIds(rows: TreeTableRow<T>[]): Set<string> {
  const s = new Set<string>();
  const walk = (items: TreeTableRow<T>[]) => {
    for (const row of items) {
      if (row.children?.length) {
        s.add(row.id);
        walk(row.children as TreeTableRow<T>[]);
      }
    }
  };
  walk(rows);
  return s;
}

const expanded = ref<Set<string>>(
  props.defaultExpanded ? collectExpandedIds(props.data) : new Set(),
);
const internalSelected = ref<Set<string>>(new Set());

const selectedSet = computed(() =>
  props.selected ? new Set(props.selected) : internalSelected.value,
);

interface FlatRow {
  row: TreeTableRow<T>;
  depth: number;
  hasChildren: boolean;
  parentId: string | null;
}

const flatRows = computed<FlatRow[]>(() => {
  const out: FlatRow[] = [];
  const walk = (
    rows: TreeTableRow<T>[],
    depth: number,
    parentId: string | null,
  ) => {
    for (const row of rows) {
      const hasChildren = !!row.children?.length;
      out.push({ row, depth, hasChildren, parentId });
      if (hasChildren && expanded.value.has(row.id)) {
        walk(row.children as TreeTableRow<T>[], depth + 1, row.id);
      }
    }
  };
  walk(props.data, 0, null);
  return out;
});

function toggleExpand(row: TreeTableRow<T>) {
  const next = new Set(expanded.value);
  if (next.has(row.id)) next.delete(row.id);
  else next.add(row.id);
  expanded.value = next;
  emit("expand", row.id, next.has(row.id));
}

function toggleSelect(row: TreeTableRow<T>) {
  const next = new Set(selectedSet.value);
  if (next.has(row.id)) next.delete(row.id);
  else next.add(row.id);
  const ids = [...next];
  if (props.selected === undefined) internalSelected.value = next;
  emit("update:selected", ids);
  emit("select", ids);
}

function isSelected(id: string): boolean {
  return selectedSet.value.has(id);
}

function isExpanded(id: string): boolean {
  return expanded.value.has(id);
}

function getTreeRows(from: HTMLElement): HTMLElement[] {
  const root = from.closest('[data-slot="tree-table"]');
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>("[data-tree-row]"));
}

function focusRow(row: HTMLElement | null | undefined) {
  row?.focus();
}

function onRowKeydown(e: KeyboardEvent, fr: FlatRow) {
  const target = e.currentTarget as HTMLElement;

  if (e.key === "Enter" || e.key === " ") {
    if (props.selectable) {
      e.preventDefault();
      toggleSelect(fr.row);
    } else if (fr.hasChildren) {
      e.preventDefault();
      toggleExpand(fr.row);
    }
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    if (fr.hasChildren && !isExpanded(fr.row.id)) {
      toggleExpand(fr.row);
    } else if (fr.hasChildren && isExpanded(fr.row.id)) {
      const rows = getTreeRows(target);
      const idx = rows.indexOf(target);
      if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1]);
    }
    return;
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    if (fr.hasChildren && isExpanded(fr.row.id)) {
      toggleExpand(fr.row);
    } else if (fr.parentId) {
      const root = target.closest('[data-slot="tree-table"]');
      const parent = root?.querySelector<HTMLElement>(
        `[data-tree-row][data-tree-id="${CSS.escape(fr.parentId)}"]`,
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

function expandAll() {
  const next = new Set<string>();
  const walk = (rows: TreeTableRow<T>[]) => {
    for (const row of rows) {
      if (row.children?.length) {
        next.add(row.id);
        walk(row.children as TreeTableRow<T>[]);
      }
    }
  };
  walk(props.data);
  expanded.value = next;
}

onMounted(() => {
  if (props.defaultExpanded) expandAll();
});

// Reset expanded state when data identity changes.
watch(
  () => props.data,
  () => {
    if (props.defaultExpanded) expandAll();
  },
  { deep: false },
);

const isEmpty = computed(() => flatRows.value.length === 0);

const indentStyle = computed(() => ({
  "--tree-indent": `${props.indent}px`,
}));
</script>

<template>
  <div
    data-uipkge
    data-slot="tree-table"
    role="treegrid"
    :class="cn('relative w-full', props.class)"
    :style="indentStyle"
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-if="selectable" class="w-10">
            <span class="sr-only">Select</span>
          </TableHead>
          <TableHead
            v-for="col in columns"
            :key="col.key"
            :class="cn(col.headerClass)"
          >
            {{ col.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="fr in flatRows"
          :key="fr.row.id"
          data-tree-row
          :data-tree-id="fr.row.id"
          :data-tree-parent="fr.parentId ?? undefined"
          :data-depth="fr.depth"
          :data-expanded="fr.hasChildren ? isExpanded(fr.row.id) : undefined"
          :data-selected="isSelected(fr.row.id) ? '' : undefined"
          role="row"
          :aria-expanded="fr.hasChildren ? isExpanded(fr.row.id) : undefined"
          :aria-selected="selectable ? isSelected(fr.row.id) : undefined"
          tabindex="0"
          class="focus-visible:bg-muted/50 focus-visible:outline-none"
          @keydown="(e: KeyboardEvent) => onRowKeydown(e, fr)"
          @click="
            (e: MouseEvent) => {
              if ((e.target as HTMLElement).closest('button, input, a')) return;
              if (selectable) {
                toggleSelect(fr.row);
              } else if (fr.hasChildren) {
                toggleExpand(fr.row);
              }
            }
          "
        >
          <!-- Selection checkbox -->
          <TableCell v-if="selectable" class="w-10">
            <Checkbox
              :model-value="isSelected(fr.row.id)"
              :aria-label="`Select ${String(fr.row[columns[0]?.key ?? 'id'] ?? fr.row.id)}`"
              @update:model-value="toggleSelect(fr.row)"
            />
          </TableCell>

          <!-- Data cells -->
          <TableCell
            v-for="(col, ci) in columns"
            :key="col.key"
            :class="cn(ci === 0 && 'font-medium', col.cellClass)"
          >
            <div
              class="flex items-center"
              :style="
                ci === 0
                  ? { paddingLeft: `calc(${fr.depth} * var(--tree-indent))` }
                  : {}
              "
            >
              <!-- Expand toggle on the first column -->
              <button
                v-if="ci === 0 && fr.hasChildren"
                type="button"
                class="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring mr-1.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                :aria-label="isExpanded(fr.row.id) ? 'Collapse' : 'Expand'"
                :aria-expanded="isExpanded(fr.row.id)"
                tabindex="-1"
                @click.stop="toggleExpand(fr.row)"
              >
                <slot name="expand-icon" :expanded="isExpanded(fr.row.id)">
                  <ChevronRight
                    class="size-4 transition-transform duration-150"
                    :class="isExpanded(fr.row.id) ? 'rotate-90' : ''"
                  />
                </slot>
              </button>
              <span v-else-if="ci === 0" class="mr-1.5 w-5 shrink-0" />

              <slot :name="`cell-${col.key}`" :row="fr.row" :depth="fr.depth">
                {{ col.render ? col.render(fr.row as T) : fr.row[col.key] }}
              </slot>
            </div>
          </TableCell>
        </TableRow>

        <!-- Empty state -->
        <TableRow v-if="isEmpty && !loading">
          <TableCell
            :colspan="columns.length + (selectable ? 1 : 0)"
            class="h-24 text-center"
          >
            <div class="text-muted-foreground flex flex-col items-center gap-2">
              <FileBox class="size-8" />
              <span class="text-sm">{{ emptyText }}</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur-sm"
    >
      <Spinner size="lg" />
    </div>
  </div>
</template>
