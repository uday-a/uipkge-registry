<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import type { TreeTableColumn, TreeTableRow } from './types'

  // Omit the DOM event prop shadowed by the component callback (ids payload, not an event).
  export interface TreeTableProps<T extends TreeTableRow = TreeTableRow>
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onselect'> {
    /** Tree-structured row data. */
    data: TreeTableRow<T>[]
    /** Column configuration. */
    columns: TreeTableColumn<T>[]
    /** Indent per nesting level in pixels. Default 24. */
    indent?: number
    /** Expand all rows on mount. Default false. */
    defaultExpanded?: boolean
    /** Show row selection checkboxes. Default false. */
    selectable?: boolean
    /** Loading state — shows a spinner overlay. Default false. */
    loading?: boolean
    /** Empty state message. Default 'No data.'. */
    emptyText?: string
    /** Controlled selected row ids (bind:selected). */
    selected?: string[]
    /** Replaces the default expand chevron. */
    expandIcon?: Snippet<[{ expanded: boolean }]>
    /** Replaces default cell text. Branch on `column.key` for per-column cells. */
    cell?: Snippet<[{ row: TreeTableRow<T>; column: TreeTableColumn<T>; depth: number }]>
    onSelectedChange?: (ids: string[]) => void
    onselect?: (ids: string[]) => void
    onexpand?: (id: string, expanded: boolean) => void
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts" generics="T extends TreeTableRow">
  import { onMount, untrack } from 'svelte'
  import { ChevronRight, FileBox } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Spinner } from '$lib/components/ui/spinner'
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table'

  let {
    data,
    columns,
    indent = 24,
    defaultExpanded = false,
    selectable = false,
    loading = false,
    emptyText = 'No data.',
    selected = $bindable(),
    expandIcon,
    cell,
    onSelectedChange,
    onselect,
    onexpand,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: TreeTableProps<T> = $props()

  function collectExpandedIds(rows: TreeTableRow<T>[]): Set<string> {
    const s = new Set<string>()
    const walk = (items: TreeTableRow<T>[]) => {
      for (const row of items) {
        if (row.children?.length) {
          s.add(row.id)
          walk(row.children as TreeTableRow<T>[])
        }
      }
    }
    walk(rows)
    return s
  }

  let expanded = $state<Set<string>>(untrack(() => (defaultExpanded ? collectExpandedIds(data) : new Set())))

  const selectedSet = $derived(new Set(selected ?? []))

  interface FlatRow {
    row: TreeTableRow<T>
    depth: number
    hasChildren: boolean
    parentId: string | null
  }

  const flatRows = $derived.by((): FlatRow[] => {
    const out: FlatRow[] = []
    const walk = (rows: TreeTableRow<T>[], depth: number, parentId: string | null) => {
      for (const row of rows) {
        const hasChildren = !!row.children?.length
        out.push({ row, depth, hasChildren, parentId })
        if (hasChildren && expanded.has(row.id)) {
          walk(row.children as TreeTableRow<T>[], depth + 1, row.id)
        }
      }
    }
    walk(data, 0, null)
    return out
  })

  function toggleExpand(row: TreeTableRow<T>) {
    const next = new Set(expanded)
    if (next.has(row.id)) next.delete(row.id)
    else next.add(row.id)
    expanded = next
    onexpand?.(row.id, next.has(row.id))
  }

  function toggleSelect(row: TreeTableRow<T>) {
    const next = new Set(selectedSet)
    if (next.has(row.id)) next.delete(row.id)
    else next.add(row.id)
    const ids = [...next]
    selected = ids
    onSelectedChange?.(ids)
    onselect?.(ids)
  }

  function isSelected(id: string): boolean {
    return selectedSet.has(id)
  }

  function isExpanded(id: string): boolean {
    return expanded.has(id)
  }

  function getTreeRows(from: HTMLElement): HTMLElement[] {
    const root = from.closest('[data-slot="tree-table"]')
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>('[data-tree-row]'))
  }

  function focusRow(row: HTMLElement | null | undefined) {
    row?.focus()
  }

  function onRowKeydown(e: KeyboardEvent, fr: FlatRow) {
    const target = e.currentTarget as HTMLElement

    if (e.key === 'Enter' || e.key === ' ') {
      if (selectable) {
        e.preventDefault()
        toggleSelect(fr.row)
      } else if (fr.hasChildren) {
        e.preventDefault()
        toggleExpand(fr.row)
      }
      return
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (fr.hasChildren && !isExpanded(fr.row.id)) {
        toggleExpand(fr.row)
      } else if (fr.hasChildren && isExpanded(fr.row.id)) {
        const rows = getTreeRows(target)
        const idx = rows.indexOf(target)
        if (idx >= 0 && idx < rows.length - 1) focusRow(rows[idx + 1])
      }
      return
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (fr.hasChildren && isExpanded(fr.row.id)) {
        toggleExpand(fr.row)
      } else if (fr.parentId) {
        const root = target.closest('[data-slot="tree-table"]')
        const parent = root?.querySelector<HTMLElement>(
          `[data-tree-row][data-tree-id="${CSS.escape(fr.parentId)}"]`,
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

  function onRowClick(e: MouseEvent, fr: FlatRow) {
    if ((e.target as HTMLElement).closest('button, input, a')) return
    if (selectable) {
      toggleSelect(fr.row)
    } else if (fr.hasChildren) {
      toggleExpand(fr.row)
    }
  }

  function expandAll() {
    const next = new Set<string>()
    const walk = (rows: TreeTableRow<T>[]) => {
      for (const row of rows) {
        if (row.children?.length) {
          next.add(row.id)
          walk(row.children as TreeTableRow<T>[])
        }
      }
    }
    walk(data)
    expanded = next
  }

  onMount(() => {
    if (defaultExpanded) expandAll()
  })

  // Reset expanded state when data identity changes.
  let prevData = untrack(() => data)
  $effect(() => {
    if (data !== prevData) {
      prevData = data
      if (defaultExpanded) expandAll()
    }
  })

  const isEmpty = $derived(flatRows.length === 0)
</script>

<div
  bind:this={ref}
  data-uipkge
  data-slot="tree-table"
  role="treegrid"
  class={cn('relative w-full', className)}
  style="--tree-indent: {indent}px"
  {...restProps}
>
  <Table>
    <TableHeader>
      <TableRow>
        {#if selectable}
          <TableHead class="w-10">
            <span class="sr-only">Select</span>
          </TableHead>
        {/if}
        {#each columns as col (col.key)}
          <TableHead class={cn(col.headerClass)}>
            {col.label}
          </TableHead>
        {/each}
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each flatRows as fr (fr.row.id)}
        <TableRow
          data-tree-row
          data-tree-id={fr.row.id}
          data-tree-parent={fr.parentId ?? undefined}
          data-depth={fr.depth}
          data-expanded={fr.hasChildren ? isExpanded(fr.row.id) : undefined}
          data-selected={isSelected(fr.row.id) ? '' : undefined}
          role="row"
          aria-expanded={fr.hasChildren ? isExpanded(fr.row.id) : undefined}
          aria-selected={selectable ? isSelected(fr.row.id) : undefined}
          tabindex={0}
          class="focus-visible:bg-muted/50 focus-visible:outline-none"
          onkeydown={(e: KeyboardEvent) => onRowKeydown(e, fr)}
          onclick={(e: MouseEvent) => onRowClick(e, fr)}
        >
          <!-- Selection checkbox -->
          {#if selectable}
            <TableCell class="w-10">
              <Checkbox
                checked={isSelected(fr.row.id)}
                aria-label={`Select ${String(fr.row[columns[0]?.key ?? 'id'] ?? fr.row.id)}`}
                onCheckedChange={() => toggleSelect(fr.row)}
                onclick={(e: MouseEvent) => e.stopPropagation()}
              />
            </TableCell>
          {/if}

          <!-- Data cells -->
          {#each columns as col, ci (col.key)}
            <TableCell class={cn(ci === 0 && 'font-medium', col.cellClass)}>
              <div
                class="flex items-center"
                style={ci === 0 ? `padding-left: calc(${fr.depth} * var(--tree-indent))` : undefined}
              >
                <!-- Expand toggle on the first column -->
                {#if ci === 0 && fr.hasChildren}
                  <button
                    type="button"
                    class="mr-1.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={isExpanded(fr.row.id) ? 'Collapse' : 'Expand'}
                    aria-expanded={isExpanded(fr.row.id)}
                    tabindex="-1"
                    onclick={(e) => {
                      e.stopPropagation()
                      toggleExpand(fr.row)
                    }}
                  >
                    {#if expandIcon}
                      {@render expandIcon({ expanded: isExpanded(fr.row.id) })}
                    {:else}
                      <ChevronRight
                        class="size-4 transition-transform duration-150 {isExpanded(fr.row.id)
                          ? 'rotate-90'
                          : ''}"
                      />
                    {/if}
                  </button>
                {:else if ci === 0}
                  <span class="mr-1.5 w-5 shrink-0"></span>
                {/if}

                {#if cell}
                  {@render cell({ row: fr.row, column: col, depth: fr.depth })}
                {:else}
                  {col.render ? col.render(fr.row as T) : fr.row[col.key]}
                {/if}
              </div>
            </TableCell>
          {/each}
        </TableRow>
      {/each}

      <!-- Empty state -->
      {#if isEmpty && !loading}
        <TableRow>
          <TableCell colspan={columns.length + (selectable ? 1 : 0)} class="h-24 text-center">
            <div class="flex flex-col items-center gap-2 text-muted-foreground">
              <FileBox class="size-8" />
              <span class="text-sm">{emptyText}</span>
            </div>
          </TableCell>
        </TableRow>
      {/if}
    </TableBody>
  </Table>

  <!-- Loading overlay -->
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <Spinner size="lg" />
    </div>
  {/if}
</div>
