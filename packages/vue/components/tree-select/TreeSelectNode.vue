<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import type { TreeSelectNode } from './types'

interface Props {
  node: TreeSelectNode
  depth: number
  multiple: boolean
  expandedIds: Set<string>
  selectedValues: Set<string>
  filteredIds: Set<string> | null
  parentValue?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  parentValue: null,
})
const emit = defineEmits<{
  toggle: [node: TreeSelectNode]
  select: [node: TreeSelectNode]
}>()

const hasChildren = computed(() => !!(props.node.children && props.node.children.length))
const isExpanded = computed(() => props.expandedIds.has(props.node.value))
const isChecked = computed(() => {
  if (!props.multiple) return props.selectedValues.has(props.node.value)
  if (props.selectedValues.has(props.node.value)) return true
  // Indeterminate: some (not all) descendants selected
  if (!hasChildren.value) return false
  const descendants = collectValues(props.node)
  const selected = descendants.filter((v) => props.selectedValues.has(v))
  return selected.length > 0 && selected.length < descendants.length
})
const isFullyChecked = computed(() => {
  if (!props.multiple) return false
  if (props.selectedValues.has(props.node.value)) return true
  if (!hasChildren.value) return false
  const descendants = collectValues(props.node)
  return descendants.length > 0 && descendants.every((v) => props.selectedValues.has(v))
})
const isVisible = computed(() => !props.filteredIds || props.filteredIds.has(props.node.value))
const isSelected = computed(() => {
  if (!props.multiple) return props.selectedValues.has(props.node.value)
  return isFullyChecked.value || isChecked.value
})

function collectValues(node: TreeSelectNode): string[] {
  const vals: string[] = []
  const walk = (n: TreeSelectNode) => {
    if (n.children?.length) {
      for (const c of n.children) walk(c)
    } else {
      vals.push(n.value)
    }
  }
  walk(node)
  return vals
}

function handleToggle(e: Event) {
  e.stopPropagation()
  emit('toggle', props.node)
}

function handleSelect() {
  if (props.node.disabled) return
  emit('select', props.node)
}

function handleCheckboxChange(e: Event) {
  e.stopPropagation()
  if (props.node.disabled) return
  emit('select', props.node)
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
  if (props.node.disabled) return
  const target = e.currentTarget as HTMLElement

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleSelect()
    return
  }

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    if (hasChildren.value && !isExpanded.value) {
      emit('toggle', props.node)
    } else if (hasChildren.value && isExpanded.value) {
      const rows = getTreeRows(target)
      const idx = rows.indexOf(target)
      if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
    }
    return
  }

  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    if (hasChildren.value && isExpanded.value) {
      emit('toggle', props.node)
    } else if (props.parentValue) {
      const tree = target.closest('[role="tree"]')
      const parent = tree?.querySelector<HTMLElement>(
        `[data-tree-row][data-tree-id="${CSS.escape(props.parentValue)}"]`,
      )
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

const indent = computed(() => `calc(${props.depth} * var(--tree-indent) + var(--tree-indent-offset))`)
</script>

<template>
  <div
    v-if="isVisible"
    role="treeitem"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :aria-selected="isSelected"
    style="--tree-indent: 20px; --tree-indent-offset: 8px"
  >
    <div
      data-tree-row
      :data-tree-id="node.value"
      :data-tree-parent="parentValue ?? undefined"
      :data-disabled="node.disabled ? 'true' : undefined"
      :class="
        cn(
          'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none',
          node.disabled && 'cursor-not-allowed opacity-50',
          !multiple && selectedValues.has(node.value) && 'bg-accent text-accent-foreground font-medium',
        )
      "
      :style="{ paddingLeft: indent }"
      :tabindex="node.disabled ? -1 : 0"
      @click="handleSelect"
      @keydown="handleRowKeydown"
    >
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

      <input
        v-if="multiple"
        type="checkbox"
        :checked="isFullyChecked || isChecked"
        :indeterminate.prop="isChecked && !isFullyChecked"
        :disabled="node.disabled"
        class="border-input text-primary focus:ring-ring size-3.5 shrink-0 rounded focus:ring-1"
        @change="handleCheckboxChange"
        @click.stop
      />

      <span class="flex-1 truncate">{{ node.label }}</span>
    </div>

    <div v-if="hasChildren && isExpanded" role="group">
      <TreeSelectNode
        v-for="child in node.children"
        :key="child.value"
        :node="child"
        :depth="depth + 1"
        :multiple="multiple"
        :expanded-ids="expandedIds"
        :selected-values="selectedValues"
        :filtered-ids="filteredIds"
        :parent-value="node.value"
        @toggle="emit('toggle', $event)"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
