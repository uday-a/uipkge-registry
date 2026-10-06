<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TreeViewItem } from './types'

  export interface TreeViewNodeProps extends HTMLAttributes<HTMLDivElement> {
    item: TreeViewItem
    depth: number
    isLast?: boolean
    parentId?: string | null
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { ChevronRight, File, Folder, FolderOpen } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getTreeViewContext } from './context'
  import TreeViewNode from './TreeViewNode.svelte'

  let { item, depth, isLast = false, parentId = null, ref = $bindable(null) }: TreeViewNodeProps = $props()

  const ctx = getTreeViewContext()

  const isExpanded = $derived(ctx.expandedIds.has(item.id))
  const isSelected = $derived(ctx.selectedId === item.id)
  const hasChildren = $derived(!!(item.children && item.children.length))

  const Icon = $derived(
    !ctx.showIcons ? null : (item.icon ?? (!hasChildren ? File : isExpanded ? FolderOpen : Folder)),
  )

  function handleToggle(e?: Event) {
    e?.stopPropagation()
    ctx.toggle(item)
  }

  function handleSelect() {
    if (item.disabled) return
    ctx.select(item)
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
    if (item.disabled) return
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect()
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (hasChildren && !isExpanded) {
        handleToggle()
      } else if (hasChildren && isExpanded) {
        // Move into first visible child (next row in flattened list).
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (hasChildren && isExpanded) {
        handleToggle()
      } else if (parentId) {
        const tree = target.closest('[role="tree"]')
        const parent = tree?.querySelector<HTMLElement>(`[data-tree-row][data-tree-id="${CSS.escape(parentId)}"]`)
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
  const rowPadLeft = $derived(`calc(${depth} * var(--tree-indent) + var(--tree-row-offset))`)
  const connectorLeft = $derived(`calc((${depth - 1}) * var(--tree-indent) + var(--tree-connector-offset))`)
</script>

<div
  bind:this={ref}
  role="treeitem"
  aria-expanded={hasChildren ? isExpanded : undefined}
  aria-selected={isSelected}
  class="relative"
  style="--tree-indent: 20px; --tree-row-offset: 4px; --tree-connector-offset: 10px"
>
  <!-- Discord-style elbow + trunk for non-root nodes. The elbow points
       from the parent's chevron column down to this row's center; the
       trunk continues to the next sibling at this depth (omitted on the
       last sibling). -->
  {#if depth > 0}
    <span
      aria-hidden="true"
      class="pointer-events-none absolute top-0 h-4 w-3 rounded-bl-md border-b border-l border-border"
      style="left: {connectorLeft}"
    ></span>
  {/if}
  {#if depth > 0 && !isLast}
    <span aria-hidden="true" class="pointer-events-none absolute top-4 bottom-0 w-px bg-border" style="left: {connectorLeft}"
    ></span>
  {/if}

  <!-- Row -->
  <div
    data-tree-row
    data-tree-id={item.id}
    data-tree-parent={parentId ?? undefined}
    data-disabled={item.disabled ? 'true' : undefined}
    class={cn(
      'group relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
      item.disabled && 'cursor-not-allowed opacity-50',
      isSelected && 'bg-accent text-accent-foreground font-medium',
    )}
    style="padding-left: {rowPadLeft}"
    tabindex={item.disabled ? -1 : 0}
    onclick={handleSelect}
    onkeydown={handleRowKeydown}
  >
    <!-- Chevron (or 16px spacer for leaves so labels align) -->
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

    <!-- Checkbox: reflect live selection, not the static item.selected seed field -->
    {#if ctx.showCheckboxes}
      <input
        type="checkbox"
        checked={isSelected}
        disabled={item.disabled}
        aria-label={item.label}
        class="size-3.5 shrink-0 rounded border-input bg-background text-primary focus:ring-1 focus:ring-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        onchange={handleSelect}
        onclick={(e) => e.stopPropagation()}
      />
    {/if}

    <!-- Icon -->
    {#if Icon}
      <Icon class={cn('size-4 shrink-0', hasChildren ? 'text-primary' : 'text-muted-foreground')} />
    {/if}

    <!-- Label -->
    <span class="flex-1 truncate">{item.label}</span>
  </div>

  <!-- Children -->
  {#if hasChildren && isExpanded}
    <div role="group">
      {#each item.children ?? [] as child, j (child.id)}
        <TreeViewNode
          item={child}
          depth={depth + 1}
          parentId={item.id}
          isLast={j === (item.children?.length ?? 0) - 1}
        />
      {/each}
    </div>
  {/if}
</div>
