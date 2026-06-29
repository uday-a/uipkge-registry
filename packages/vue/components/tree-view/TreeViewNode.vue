<script setup lang="ts">
import { computed, inject } from 'vue'
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { TREE_VIEW_CONTEXT } from './context'
import type { TreeViewItem } from './types'

interface Props {
  item: TreeViewItem
  depth: number
  isLast?: boolean
  parentId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isLast: false,
  parentId: null,
})

const _maybeCtx = inject(TREE_VIEW_CONTEXT)
if (!_maybeCtx) throw new Error('TreeViewNode must be used inside <TreeView>')
const ctx: NonNullable<typeof _maybeCtx> = _maybeCtx

const isExpanded = computed(() => ctx.expandedIds.value.has(props.item.id))
const isSelected = computed(() => ctx.selectedId.value === props.item.id)
const hasChildren = computed(() => !!(props.item.children && props.item.children.length))

const Icon = computed(() => {
  if (!ctx.showIcons.value) return null
  if (props.item.icon) return props.item.icon
  if (!hasChildren.value) return File
  return isExpanded.value ? FolderOpen : Folder
})

function handleToggle(e?: Event) {
  e?.stopPropagation()
  ctx.toggle(props.item)
}

function handleSelect() {
  if (props.item.disabled) return
  ctx.select(props.item)
}

function getTreeRows(from: HTMLElement): HTMLElement[] {
  const tree = from.closest('[role="tree"]')
  if (!tree) return []
  return Array.from(tree.querySelectorAll<HTMLElement>('[data-tree-row]:not([data-disabled="true"])'))
}

function focusRow(row: HTMLElement | null | undefined) {
  row?.focus()
}

function handleRowKeydown(e: KeyboardEvent) {
  if (props.item.disabled) return
  const target = e.currentTarget as HTMLElement

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleSelect()
    return
  }

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (hasChildren.value && !isExpanded.value) {
      handleToggle()
    } else if (hasChildren.value && isExpanded.value) {
      // Move into first visible child (next row in flattened list).
      const rows = getTreeRows(target)
      const idx = rows.indexOf(target)
      if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
    }
    return
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (hasChildren.value && isExpanded.value) {
      handleToggle()
    } else if (props.parentId) {
      const tree = target.closest('[role="tree"]')
      const parent = tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(props.parentId)}"]`)
      focusRow(parent)
    }
    return
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const rows = getTreeRows(target)
    const idx = rows.indexOf(target)
    if (idx < 0) return
    focusRow(e.key === 'ArrowDown' ? rows[idx + 1] : rows[idx - 1])
    return
  }

  if (e.key === 'Home') {
    e.preventDefault()
    focusRow(getTreeRows(target)[0])
    return
  }

  if (e.key === 'End') {
    e.preventDefault()
    const rows = getTreeRows(target)
    focusRow(rows[rows.length - 1])
  }
}

// 20px per level. Connector lives in parent's gutter (depth - 1).
const rowPadLeft = computed(() => `calc(${props.depth} * var(--tree-indent) + var(--tree-row-offset))`)
const connectorLeft = computed(() => `calc((${props.depth - 1}) * var(--tree-indent) + var(--tree-connector-offset))`)
</script>

<template>
  <div
    role="treeitem"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :aria-selected="isSelected"
    class="relative"
    style="--tree-indent: 20px; --tree-row-offset: 4px; --tree-connector-offset: 10px"
  >
    <!-- Discord-style elbow + trunk for non-root nodes. The elbow points
         from the parent's chevron column down to this row's center; the
         trunk continues to the next sibling at this depth (omitted on the
         last sibling). -->
    <span
      v-if="depth > 0"
      aria-hidden="true"
      class="border-border pointer-events-none absolute top-0 h-4 w-3 rounded-bl-md border-b border-l"
      :style="{ left: connectorLeft }"
    />
    <span
      v-if="depth > 0 && !isLast"
      aria-hidden="true"
      class="bg-border pointer-events-none absolute top-4 bottom-0 w-px"
      :style="{ left: connectorLeft }"
    />

    <!-- Row -->
    <div
      data-tree-row
      :data-tree-id="item.id"
      :data-tree-parent="parentId ?? undefined"
      :data-disabled="item.disabled ? 'true' : undefined"
      :class="
        cn(
          'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
          item.disabled && 'cursor-not-allowed opacity-50',
          isSelected && 'bg-accent text-accent-foreground font-medium',
        )
      "
      :style="{ paddingLeft: rowPadLeft }"
      :tabindex="item.disabled ? -1 : 0"
      @click="handleSelect"
      @keydown="handleRowKeydown"
    >
      <!-- Chevron (or 16px spacer for leaves so labels align) -->
      <button
        v-if="hasChildren"
        type="button"
        :class="
          cn(
            'focus-visible:ring-ring flex size-4 shrink-0 items-center justify-center rounded transition-transform duration-150 focus-visible:ring-2 focus-visible:outline-none',
            'hover:bg-foreground/10',
            isExpanded && 'rotate-90',
          )
        "
        :aria-label="isExpanded ? 'Collapse' : 'Expand'"
        tabindex="-1"
        @click="handleToggle"
      >
        <ChevronRight class="text-muted-foreground size-3.5" aria-hidden="true" />
      </button>
      <span v-else class="size-4 shrink-0" />

      <!-- Checkbox: reflect live selection, not the static item.selected seed field -->
      <input
        v-if="ctx.showCheckboxes.value"
        type="checkbox"
        :checked="isSelected"
        :disabled="item.disabled"
        :aria-label="item.label"
        class="border-input bg-background text-primary focus:ring-ring focus-visible:ring-ring size-3.5 shrink-0 rounded focus:ring-1 focus-visible:ring-2 focus-visible:outline-none"
        @change="handleSelect"
        @click.stop
      />

      <!-- Icon -->
      <component
        :is="Icon"
        v-if="Icon"
        :class="cn('size-4 shrink-0', hasChildren ? 'text-primary' : 'text-muted-foreground')"
      />

      <!-- Label -->
      <span class="flex-1 truncate">{{ item.label }}</span>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" role="group">
      <TreeViewNode
        v-for="(child, j) in item.children"
        :key="child.id"
        :item="child"
        :depth="depth + 1"
        :parent-id="item.id"
        :is-last="j === (item.children?.length ?? 0) - 1"
      />
    </div>
  </div>
</template>
