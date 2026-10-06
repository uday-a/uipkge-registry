<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TreeSelectNode as TreeNode } from './types'

  // Omit DOM event props shadowed by component callbacks (payloads, not events).
  export interface TreeSelectProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onchange' | 'onselect'> {
    /** Renamed from Vue's `modelValue`: the Svelte twin binds `value`. */
    value?: string | string[] | null
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
    onselect?: (node: TreeNode) => void
    onchange?: (value: string | string[] | null) => void
    /** React parity alias for `onchange` — both fire on every commit. */
    onValueChange?: (value: string | string[] | null) => void
    onclear?: () => void
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { ChevronDown, Loader2, Search, X } from '@lucide/svelte'
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
  import { cn } from '$lib/utils'
  import { treeSelectTriggerVariants } from './tree-select.variants'
  import TreeSelectNode from './TreeSelectNode.svelte'

  let {
    value = $bindable(),
    data,
    multiple = false,
    placeholder = 'Select...',
    searchable = true,
    disabled = false,
    loading = false,
    clearable = true,
    defaultExpandAll = false,
    size = 'default',
    emptyText = 'No results found.',
    searchPlaceholder = 'Search...',
    onselect,
    onchange,
    onValueChange,
    onclear,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: TreeSelectProps = $props()

  function emitChange(next: string | string[] | null) {
    onchange?.(next)
    onValueChange?.(next)
  }

  let isOpen = $state(false)
  let search = $state('')
  let expandedIds = $state<Set<string>>(new Set())

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

  $effect(() => {
    const expand = defaultExpandAll
    // Mirror the Vue watcher: react to the flag only, not to data identity.
    if (expand) expandedIds = new Set(collectAllExpandable(untrack(() => data)))
  })

  const selectedValues = $derived.by((): Set<string> => {
    if (value == null) return new Set()
    if (Array.isArray(value)) return new Set(value)
    return new Set([value])
  })

  function findNode(nodes: TreeNode[], val: string): TreeNode | undefined {
    for (const n of nodes) {
      if (n.value === val) return n
      if (n.children) {
        const found = findNode(n.children, val)
        if (found) return found
      }
    }
    return undefined
  }

  function findLabels(nodes: TreeNode[], values: string[]): string[] {
    return values.map((v) => findNode(nodes, v)?.label ?? v)
  }

  const displayLabel = $derived.by(() => {
    if (multiple) {
      const vals = Array.isArray(value) ? value : []
      if (vals.length === 0) return placeholder
      const labels = findLabels(data, vals)
      if (labels.length <= 3) return labels.join(', ')
      return `${labels.slice(0, 3).join(', ')} +${labels.length - 3}`
    }
    if (value == null) return placeholder
    const node = findNode(data, value as string)
    return node?.label ?? String(value)
  })

  const hasValue = $derived.by(() => {
    if (multiple) return Array.isArray(value) && value.length > 0
    return value != null
  })

  // Search filtering: a node is visible if it or any descendant matches.
  // Expand-on-match is applied in a separate effect — never mutate state inside a derived.
  const filteredIds = $derived.by((): Set<string> | null => {
    const q = search.trim().toLowerCase()
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
    walk(data)
    return visible
  })

  // Auto-expand ancestors of search matches without side effects in the filter derived.
  $effect(() => {
    const visible = filteredIds
    if (!visible || visible.size === 0) return
    const q = search.trim().toLowerCase()
    if (!q) return
    const next = new Set(expandedIds)
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
    walk(untrack(() => data))
    if (changed) expandedIds = next
  })

  function toggleNode(node: TreeNode) {
    if (node.disabled) return
    const next = new Set(expandedIds)
    if (next.has(node.value)) next.delete(node.value)
    else next.add(node.value)
    expandedIds = next
  }

  function collectLeafValues(node: TreeNode): string[] {
    if (!node.children?.length) return [node.value]
    const vals: string[] = []
    for (const c of node.children) vals.push(...collectLeafValues(c))
    return vals
  }

  function selectNode(node: TreeNode) {
    if (node.disabled) return
    if (!multiple) {
      value = node.value
      emitChange(node.value)
      onselect?.(node)
      isOpen = false
      return
    }
    // Multi-select: toggle. For parent nodes, toggle all leaf descendants.
    const current = Array.isArray(value) ? [...value] : []
    const leaves = collectLeafValues(node)
    const allSelected = leaves.every((v) => current.includes(v))
    let next: string[]
    if (allSelected) {
      next = current.filter((v) => !leaves.includes(v))
    } else {
      next = [...current, ...leaves.filter((v) => !current.includes(v))]
    }
    value = next
    emitChange(next)
    onselect?.(node)
  }

  function clearAll(event?: Event) {
    event?.stopPropagation()
    if (disabled) return
    onclear?.()
    if (multiple) {
      value = []
      emitChange([])
    } else {
      value = null
      emitChange(null)
    }
  }

  function onClearKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      clearAll()
    }
  }

  $effect(() => {
    if (!isOpen) search = ''
  })

  // Match the panel width to the trigger (the Vue twin reads the popover's
  // trigger-width CSS var; measuring locally keeps this port self-contained).
  let triggerWidth = $state<number | null>(null)
  $effect(() => {
    const el = ref
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      triggerWidth = el.getBoundingClientRect().width
    })
    ro.observe(el)
    triggerWidth = el.getBoundingClientRect().width
    return () => ro.disconnect()
  })
  const contentStyle = $derived(triggerWidth ? `width: ${triggerWidth}px` : undefined)

  const triggerClasses = $derived(cn(treeSelectTriggerVariants({ size }), className))
</script>

<Popover bind:open={isOpen}>
  <PopoverTrigger>
    <button
      bind:this={ref}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      disabled={disabled || loading}
      data-uipkge
      data-slot="tree-select"
      class={triggerClasses}
      {...restProps}
    >
      <span class="flex-1 truncate text-left {hasValue ? 'text-foreground' : 'text-muted-foreground'}">
        {displayLabel}
      </span>
      <span class="flex shrink-0 items-center gap-1">
        {#if loading}
          <Loader2 class="size-4 animate-spin text-muted-foreground" />
        {:else if clearable && hasValue && !disabled}
          <span
            role="button"
            tabindex="0"
            aria-label="Clear"
            class="flex size-4 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            onclick={clearAll}
            onkeydown={onClearKeydown}
          >
            <X class="size-4" />
          </span>
        {:else}
          <ChevronDown
            class="size-4 shrink-0 text-muted-foreground transition-transform duration-200 {isOpen
              ? 'rotate-180'
              : ''}"
          />
        {/if}
      </span>
    </button>
  </PopoverTrigger>

  <PopoverContent class="p-0" align="start" sideOffset={4} style={contentStyle}>
    <div class="flex max-h-80 flex-col">
      {#if searchable}
        <div class="border-b p-2">
          <div class="relative">
            <Search class="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              bind:value={search}
              placeholder={searchPlaceholder}
              aria-label="Search tree"
              class="h-9 w-full rounded-md border border-input bg-transparent pl-8 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </div>
      {/if}

      {#if loading}
        <div class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 class="size-4 animate-spin" />
          Loading...
        </div>
      {:else if data.length === 0 || (filteredIds && filteredIds.size === 0)}
        <div class="py-6 text-center text-sm text-muted-foreground">
          {emptyText}
        </div>
      {:else}
        <div class="flex-1 overflow-y-auto p-1" role="tree">
          {#each data as node (node.value)}
            <TreeSelectNode
              {node}
              depth={0}
              {multiple}
              {expandedIds}
              {selectedValues}
              {filteredIds}
              ontoggle={toggleNode}
              onselect={selectNode}
            />
          {/each}
        </div>
      {/if}

      {#if multiple && Array.isArray(value) && value.length}
        <div class="flex items-center justify-between border-t px-2 py-1.5 text-xs">
          <span class="text-muted-foreground">{value.length} selected</span>
          <button
            type="button"
            class="rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            onclick={() => clearAll()}
          >
            Clear all
          </button>
        </div>
      {/if}
    </div>
  </PopoverContent>
</Popover>
