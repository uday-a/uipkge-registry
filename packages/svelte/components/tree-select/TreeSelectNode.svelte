<script lang="ts" module>
  import type { TreeSelectNode } from './types'

  export interface TreeSelectNodeRowProps {
    node: TreeSelectNode
    depth: number
    multiple: boolean
    expandedIds: Set<string>
    selectedValues: Set<string>
    filteredIds: Set<string> | null
    parentValue?: string | null
    ontoggle?: (node: TreeSelectNode) => void
    onselect?: (node: TreeSelectNode) => void
  }
</script>

<script lang="ts">
  import { ChevronRight } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import TreeSelectNodeRow from './TreeSelectNode.svelte'

  let {
    node,
    depth,
    multiple,
    expandedIds,
    selectedValues,
    filteredIds,
    parentValue = null,
    ontoggle,
    onselect,
  }: TreeSelectNodeRowProps = $props()

  const hasChildren = $derived(!!(node.children && node.children.length))
  const isExpanded = $derived(expandedIds.has(node.value))
  const isChecked = $derived.by(() => {
    if (!multiple) return selectedValues.has(node.value)
    if (selectedValues.has(node.value)) return true
    // Indeterminate: some (not all) descendants selected
    if (!hasChildren) return false
    const descendants = collectValues(node)
    const selected = descendants.filter((v) => selectedValues.has(v))
    return selected.length > 0 && selected.length < descendants.length
  })
  const isFullyChecked = $derived.by(() => {
    if (!multiple) return false
    if (selectedValues.has(node.value)) return true
    if (!hasChildren) return false
    const descendants = collectValues(node)
    return descendants.length > 0 && descendants.every((v) => selectedValues.has(v))
  })
  const isVisible = $derived(!filteredIds || filteredIds.has(node.value))
  const isSelected = $derived.by(() => {
    if (!multiple) return selectedValues.has(node.value)
    return isFullyChecked || isChecked
  })

  function collectValues(root: TreeSelectNode): string[] {
    const vals: string[] = []
    const walk = (n: TreeSelectNode) => {
      if (n.children?.length) {
        for (const c of n.children) walk(c)
      } else {
        vals.push(n.value)
      }
    }
    walk(root)
    return vals
  }

  function handleToggle(e: Event) {
    e.stopPropagation()
    ontoggle?.(node)
  }

  function handleSelect() {
    if (node.disabled) return
    onselect?.(node)
  }

  function handleCheckboxChange(e: Event) {
    e.stopPropagation()
    if (node.disabled) return
    onselect?.(node)
  }

  function indeterminate(el: HTMLInputElement, value: boolean) {
    el.indeterminate = value
    return {
      update(value: boolean) {
        el.indeterminate = value
      },
    }
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
    if (node.disabled) return
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (hasChildren && !isExpanded) {
        ontoggle?.(node)
      } else if (hasChildren && isExpanded) {
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (hasChildren && isExpanded) {
        ontoggle?.(node)
      } else if (parentValue) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(
          `[data-tree-row][data-tree-id="${CSS.escape(parentValue)}"]`,
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

  const indent = $derived(`calc(${depth} * var(--tree-indent) + var(--tree-indent-offset))`)
</script>

{#if isVisible}
  <div
    role="treeitem"
    aria-expanded={hasChildren ? isExpanded : undefined}
    aria-selected={isSelected}
    style="--tree-indent: 20px; --tree-indent-offset: 8px"
  >
    <div
      data-tree-row
      data-tree-id={node.value}
      data-tree-parent={parentValue ?? undefined}
      data-disabled={node.disabled ? 'true' : undefined}
      class={cn(
        'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
        node.disabled && 'cursor-not-allowed opacity-50',
        !multiple && selectedValues.has(node.value) && 'bg-accent text-accent-foreground font-medium',
      )}
      style="padding-left: {indent}"
      tabindex={node.disabled ? -1 : 0}
      onclick={handleSelect}
      onkeydown={handleRowKeydown}
    >
      {#if hasChildren}
        <button
          type="button"
          class={cn(
            'flex size-4 shrink-0 items-center justify-center rounded transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            'hover:bg-foreground/10',
            isExpanded && 'rotate-90',
          )}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          tabindex="-1"
          onclick={handleToggle}
        >
          <ChevronRight class="size-3.5 text-muted-foreground" aria-hidden="true" />
        </button>
      {:else}
        <span class="size-4 shrink-0"></span>
      {/if}

      {#if multiple}
        <input
          type="checkbox"
          checked={isFullyChecked || isChecked}
          use:indeterminate={isChecked && !isFullyChecked}
          disabled={node.disabled}
          class="size-3.5 shrink-0 rounded border-input text-primary focus:ring-1 focus:ring-ring"
          onchange={handleCheckboxChange}
          onclick={(e) => e.stopPropagation()}
        />
      {/if}

      <span class="flex-1 truncate">{node.label}</span>
    </div>

    {#if hasChildren && isExpanded}
      <div role="group">
        {#each node.children ?? [] as child (child.value)}
          <TreeSelectNodeRow
            node={child}
            depth={depth + 1}
            {multiple}
            {expandedIds}
            {selectedValues}
            {filteredIds}
            parentValue={node.value}
            {ontoggle}
            {onselect}
          />
        {/each}
      </div>
    {/if}
  </div>
{/if}
