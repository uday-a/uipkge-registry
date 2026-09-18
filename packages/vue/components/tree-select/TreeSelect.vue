<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { ChevronDown, Loader2, Search, X } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import TreeSelectNode from './TreeSelectNode.vue'
import type { TreeSelectNode as TreeNode } from './types'

interface Props {
  modelValue?: string | string[] | null
  data: TreeNode[]
  multiple?: boolean
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  defaultExpandAll?: boolean
  size?: 'sm' | 'default' | 'lg'
  emptyText?: string
  searchPlaceholder?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  placeholder: 'Select...',
  searchable: true,
  disabled: false,
  loading: false,
  clearable: true,
  defaultExpandAll: false,
  size: 'default',
  emptyText: 'No results found.',
  searchPlaceholder: 'Search...',
})

const emits = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
  select: [node: TreeNode]
  change: [value: string | string[] | null]
  clear: []
}>()

const isOpen = ref(false)
const search = ref('')
const expandedIds = ref<Set<string>>(new Set())

function collectAllExpandable(nodes: TreeNode[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeNode[]) => {
    for (const n of list) {
      if (n.children?.length) {
        ids.push(n.value)
        walk(n.children)
      }
    }
  }
  walk(nodes)
  return ids
}

watch(
  () => props.defaultExpandAll,
  (v) => {
    if (v) expandedIds.value = new Set(collectAllExpandable(props.data))
  },
  { immediate: true },
)

const selectedValues = computed<Set<string>>(() => {
  if (props.modelValue == null) return new Set()
  if (Array.isArray(props.modelValue)) return new Set(props.modelValue)
  return new Set([props.modelValue])
})

function findNode(nodes: TreeNode[], value: string): TreeNode | undefined {
  for (const n of nodes) {
    if (n.value === value) return n
    if (n.children) {
      const found = findNode(n.children, value)
      if (found) return found
    }
  }
  return undefined
}

function findLabels(nodes: TreeNode[], values: string[]): string[] {
  return values.map((v) => findNode(nodes, v)?.label ?? v)
}

const displayLabel = computed(() => {
  if (props.multiple) {
    const vals = Array.isArray(props.modelValue) ? props.modelValue : []
    if (vals.length === 0) return props.placeholder
    const labels = findLabels(props.data, vals)
    if (labels.length <= 3) return labels.join(', ')
    return `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`
  }
  if (props.modelValue == null) return props.placeholder
  const node = findNode(props.data, props.modelValue as string)
  return node?.label ?? String(props.modelValue)
})

const hasValue = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return props.modelValue != null
})

// Search filtering: a node is visible if it or any descendant matches.
// Expand-on-match is applied in a separate watch — never mutate state inside a computed.
const filteredIds = computed<Set<string> | null>(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return null
  const visible = new Set<string>()
  const walk = (nodes: TreeNode[]): boolean => {
    let anyMatch = false
    for (const n of nodes) {
      const selfMatch = n.label.toLowerCase().includes(q)
      let childMatch = false
      if (n.children?.length) {
        childMatch = walk(n.children)
      }
      if (selfMatch || childMatch) {
        visible.add(n.value)
        anyMatch = true
      }
    }
    return anyMatch
  }
  walk(props.data)
  return visible
})

// Auto-expand ancestors of search matches without side effects in the filter computed.
watch(filteredIds, (visible) => {
  if (!visible || visible.size === 0) return
  const q = search.value.trim().toLowerCase()
  if (!q) return
  const next = new Set(expandedIds.value)
  let changed = false
  const walk = (nodes: TreeNode[]): boolean => {
    let anyMatch = false
    for (const n of nodes) {
      const selfMatch = n.label.toLowerCase().includes(q)
      let childMatch = false
      if (n.children?.length) childMatch = walk(n.children)
      if (selfMatch || childMatch) {
        anyMatch = true
        if (childMatch && !next.has(n.value)) {
          next.add(n.value)
          changed = true
        }
      }
    }
    return anyMatch
  }
  walk(props.data)
  if (changed) expandedIds.value = next
})

function toggleNode(node: TreeNode) {
  if (node.disabled) return
  const next = new Set(expandedIds.value)
  if (next.has(node.value)) next.delete(node.value)
  else next.add(node.value)
  expandedIds.value = next
}

function collectLeafValues(node: TreeNode): string[] {
  if (!node.children?.length) return [node.value]
  const vals: string[] = []
  for (const c of node.children) vals.push(...collectLeafValues(c))
  return vals
}

function selectNode(node: TreeNode) {
  if (node.disabled) return
  if (!props.multiple) {
    emits('update:modelValue', node.value)
    emits('change', node.value)
    emits('select', node)
    isOpen.value = false
    return
  }
  // Multi-select: toggle. For parent nodes, toggle all leaf descendants.
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const leaves = collectLeafValues(node)
  const allSelected = leaves.every((v) => current.includes(v))
  let next: string[]
  if (allSelected) {
    next = current.filter((v) => !leaves.includes(v))
  } else {
    next = [...current, ...leaves.filter((v) => !current.includes(v))]
  }
  emits('update:modelValue', next)
  emits('change', next)
  emits('select', node)
}

function clearAll(event?: Event) {
  event?.stopPropagation()
  if (props.disabled) return
  emits('clear')
  if (props.multiple) {
    emits('update:modelValue', [])
    emits('change', [])
  } else {
    emits('update:modelValue', null)
    emits('change', null)
  }
}

watch(isOpen, (open) => {
  if (!open) search.value = ''
})

const sizeClasses = {
  sm: 'h-8 text-xs px-2.5',
  default: 'h-9 text-sm px-3',
  lg: 'h-11 text-base px-4',
}

const triggerClasses = computed(() =>
  cn(
    'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none',
    'hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[props.size],
    props.class,
  ),
)
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        role="combobox"
        :aria-expanded="isOpen"
        :disabled="disabled || loading"
        data-uipkge
        data-slot="tree-select"
        :class="triggerClasses"
      >
        <span :class="['flex-1 truncate text-left', hasValue ? 'text-foreground' : 'text-muted-foreground']">
          {{ displayLabel }}
        </span>
        <span class="flex shrink-0 items-center gap-1">
          <Loader2 v-if="loading" class="text-muted-foreground size-4 animate-spin" />
          <span
            v-else-if="clearable && hasValue && !disabled"
            role="button"
            tabindex="0"
            aria-label="Clear"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-4 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            @click.stop="clearAll"
            @keydown.enter.prevent="clearAll"
            @keydown.space.prevent="clearAll"
          >
            <X class="size-4" />
          </span>
          <ChevronDown
            v-else
            class="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
            :class="isOpen ? 'rotate-180' : ''"
          />
        </span>
      </button>
    </PopoverTrigger>

    <PopoverContent class="p-0" align="start" :side-offset="4" :style="{ width: 'var(--reka-popover-trigger-width)' }">
      <div class="flex max-h-80 flex-col">
        <div v-if="searchable" class="border-b p-2">
          <div class="relative">
            <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <input
              v-model="search"
              :placeholder="searchPlaceholder"
              aria-label="Search tree"
              class="border-input focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
            />
          </div>
        </div>

        <div v-if="loading" class="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
          <Loader2 class="size-4 animate-spin" />
          Loading...
        </div>

        <div
          v-else-if="data.length === 0 || (filteredIds && filteredIds.size === 0)"
          class="text-muted-foreground py-6 text-center text-sm"
        >
          {{ emptyText }}
        </div>

        <div v-else class="flex-1 overflow-y-auto p-1" role="tree">
          <TreeSelectNode
            v-for="node in data"
            :key="node.value"
            :node="node"
            :depth="0"
            :multiple="multiple"
            :expanded-ids="expandedIds"
            :selected-values="selectedValues"
            :filtered-ids="filteredIds"
            @toggle="toggleNode"
            @select="selectNode"
          />
        </div>

        <div
          v-if="multiple && Array.isArray(modelValue) && modelValue.length"
          class="flex items-center justify-between border-t px-2 py-1.5 text-xs"
        >
          <span class="text-muted-foreground">{{ modelValue.length }} selected</span>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded focus-visible:ring-2 focus-visible:outline-none"
            @click="clearAll"
          >
            Clear all
          </button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
