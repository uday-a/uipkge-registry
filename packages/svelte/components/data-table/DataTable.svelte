<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { ColumnDef, Row, Table as TanstackTable } from '@tanstack/table-core'
  import type { FilterDefinition, FilterOption } from './types'

  export type { FilterDefinition, FilterOption }

  export interface DataTableState {
    page: number
    pageSize: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
    filters: Record<string, any>
    search: string
  }

  export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterColumn?: string
    filterPlaceholder?: string
    filters?: FilterDefinition[]
    filterMode?: 'inline' | 'modal' | 'popover'
    /** Show the global search input. Default true. */
    enableSearch?: boolean
    /** Show the View column-visibility dropdown. Default false. */
    enableColumnVisibility?: boolean
    /** Show the pagination footer. Default true. */
    enablePagination?: boolean
    /** Hide the entire toolbar (search + filters + view). Default false. */
    hideToolbar?: boolean
    /** Show Export-CSV button in toolbar. Default false. */
    enableExport?: boolean
    /** Infinite-scroll mode: calls `onFetchMore` when last row enters viewport,
     *  hides the pagination footer. Combine with append-on-success on the
     *  consumer side. */
    infinite?: boolean
    /** Allow drag-to-resize on column borders. */
    enableResize?: boolean
    /** Initial column pinning. Each column id is pinned to the given side. */
    defaultColumnPinning?: { left?: string[]; right?: string[] }
    /** Allow drag-to-reorder on column headers. */
    enableReorder?: boolean
    /** Initial column ids to group by. Pass an empty array to disable grouping. */
    defaultGrouping?: string[]
    /** Virtual-scrolling mode (CSS content-visibility based). Best with large
     *  datasets and `maxHeight` for a scroll container. */
    virtual?: boolean
    /** Sticky header — keeps `<thead>` visible when scrolling. Pair with `maxHeight`. */
    stickyHeader?: boolean
    /** Density of cell padding: 'compact' | 'cozy' | 'comfortable'. Default cozy.
     *  Treated as the INITIAL density when `enableDensityToggle` is on; the user
     *  can override it at runtime from the toolbar. */
    density?: 'compact' | 'cozy' | 'comfortable'
    /** Show the density toggle in the toolbar. Default false. */
    enableDensityToggle?: boolean
    /** Strip the DataTable's borders.
     *  - `'inner'` removes toolbar bottom-divider, pagination top-divider,
     *    and filter-sheet section bgs/borders. The outer container border
     *    is kept.
     *  - `'full'` additionally removes the outer container border + rounded
     *    corners so the table renders completely flat on the canvas. */
    borderless?: 'inner' | 'full'
    /** Where the toolbar renders. `'inside'` (default) lives inside the
     *  bordered container; `'above'` floats outside it. */
    toolbarPosition?: 'inside' | 'above'
    /** Where the pagination footer renders. `'inside'` (default) or `'below'`. */
    paginationPosition?: 'inside' | 'below'
    /** Max height; enables vertical scroll inside the card. */
    maxHeight?: string
    /** Row click — when set, rows become clickable + cursor-pointer. */
    onRowClick?: (row: TData) => void
    /** Server-side mode: total row count from API (enables manual pagination) */
    totalRows?: number
    /** Server-side mode: loading state indicator */
    loading?: boolean
    /** Emitted when server-side state changes (pagination, sorting, filters) */
    onStateChange?: (state: DataTableState) => void
    /** Infinite-scroll: last row entered viewport, time to load more */
    onFetchMore?: () => void
    /** Custom empty-state content (replaces "No results."). */
    emptyState?: Snippet
    /** Expanded-row content. Receives the original row + the TanStack row. */
    renderExpanded?: Snippet<[TData, Row<TData>]>
    /** Bulk action bar content (shown above the table when rows are selected). */
    renderBulkActions?: Snippet<[Row<TData>[], () => void]>
    /** Footer (<tfoot>) content. */
    renderFooter?: Snippet<[Row<TData>[]]>
    /** Extra toolbar controls (e.g. group-by selector). */
    toolbarExtra?: Snippet
    /** Consumer-supplied custom filter UI inside the filter surface. */
    customFilters?: Snippet
    /** Enable keyboard navigation (Arrow keys, J/K, Space/X, Enter, Esc, Cmd+A, Cmd+C). Default true. */
    enableKeyboardNavigation?: boolean
    /** Placement of the bulk actions dock: 'floating' (Linear/Raycast HUD dock at bottom-center) or 'inline' (top banner). Default 'floating'. */
    bulkActionPosition?: 'floating' | 'inline'
  }

  /** Instance API, via `bind:this` (the Svelte twin of React's forwarded ref). */
  export interface DataTableHandle<TData> {
    table: TanstackTable<TData>
    exportCsv: () => void
    exportJson: () => void
    copyTsv: (rows?: Row<TData>[]) => string
    copyMarkdown: (rows?: Row<TData>[]) => string
  }
</script>

<script lang="ts" generics="TData, TValue">
  import type {
    Column,
    ColumnFiltersState,
    ColumnPinningState,
    ExpandedState,
    FilterFn,
    GroupingState,
    Header,
    RowSelectionState,
    SortingState,
    VisibilityState,
  } from '@tanstack/table-core'
  import {
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from '@tanstack/table-core'
  // `valueUpdater` lives next to the low-level table primitive (which
  // data-table depends on transitively via registryDependencies). Keep
  // `$lib/utils` reserved for the cn() helper shipped by the init
  // bootstrap -- importing valueUpdater from there would force every
  // consumer to hand-edit lib/utils.ts on install.
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    valueUpdater,
  } from '$lib/components/ui/table'
  import type { DateRange } from '$lib/components/ui/range-calendar'
  import { ChevronDown, ChevronRight, Copy, Download, Search, X } from '@lucide/svelte'

  import DataTableToolbar from './DataTableToolbar.svelte'
  import DataTableFilterSheet from './DataTableFilterSheet.svelte'
  import DataTablePagination from './DataTablePagination.svelte'
  import FlexRender from './FlexRender.svelte'
  import { createSvelteTable } from './table.svelte'
  import { resolveOption } from './types'
  import { dateToIso, isoRangeToCalendar } from './date-utils'

  interface DateRangeValue {
    from?: string
    to?: string
  }

  let {
    columns,
    data,
    filterColumn = '',
    filterPlaceholder = 'Filter...',
    filters = [],
    // Industry default (shadcn / Linear / Airtable): faceted filter chips in the
    // toolbar. Use `modal` for a right Sheet when you have many complex filters.
    filterMode = 'inline',
    enableSearch = true,
    enableColumnVisibility = false,
    enablePagination = true,
    hideToolbar = false,
    enableExport = false,
    infinite = false,
    enableResize = false,
    defaultColumnPinning = { left: [], right: [] },
    enableReorder = false,
    defaultGrouping = [],
    virtual = false,
    stickyHeader = false,
    density = 'cozy',
    enableDensityToggle = false,
    borderless,
    toolbarPosition = 'inside',
    paginationPosition = 'inside',
    maxHeight = '',
    onRowClick,
    totalRows = -1,
    loading = false,
    onStateChange,
    onFetchMore,
    emptyState,
    renderExpanded,
    renderBulkActions,
    renderFooter,
    toolbarExtra,
    customFilters,
    enableKeyboardNavigation = true,
    bulkActionPosition = 'floating',
  }: DataTableProps<TData, TValue> = $props()

  // User-mutable density -- initial value from prop, toggleable via toolbar
  // when `enableDensityToggle` is on.
  let densityOverride = $state<'compact' | 'cozy' | 'comfortable' | null>(null)
  const currentDensity = $derived(densityOverride ?? density)

  // `borderless` is an enum (`'inner'` vs `'full'`); children only need a
  // boolean "should I drop my borders?".
  const dropInnerBorders = $derived(!!borderless)

  const densityClass = $derived(
    currentDensity === 'compact'
      ? '[&_td]:py-2 [&_td]:px-3 [&_td]:text-xs [&_th]:h-8 [&_th]:px-3 [&_th]:text-xs'
      : currentDensity === 'comfortable'
        ? '[&_td]:py-3 [&_th]:h-12'
        : // cozy -- tightens TableCell/TableHead defaults (py-3 / h-12)
          '[&_td]:py-2 [&_th]:h-10',
  )

  const isServerSide = $derived(totalRows >= 0)
  let isFilterSheetOpen = $state(false)

  // ── Filter snapshot (restore on close without apply) ───────────────────
  let filterSnapshot: ColumnFiltersState | null = null
  let dateRangeSnapshot: Record<string, DateRangeValue> | null = null
  let filterApplied = false

  // ── Timers ──────────────────────────────────────────────────────────────
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
  let paginationEmitTimer: ReturnType<typeof setTimeout> | null = null
  let isMounted = false

  $effect(() => {
    isMounted = true
    return () => {
      isMounted = false
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
      if (paginationEmitTimer) clearTimeout(paginationEmitTimer)
    }
  })

  // Custom filter functions for multiselect and date range
  const multiSelectFilterFn: FilterFn<TData> = (row, columnId, filterValue: string[]) => {
    if (!filterValue || filterValue.length === 0) return true
    const cellValue = String(row.getValue(columnId)).toLowerCase()
    return filterValue.some((v: string) => v.toLowerCase() === cellValue)
  }

  const dateRangeFilterFn: FilterFn<TData> = (row, columnId, filterValue: DateRangeValue) => {
    if (!filterValue) return true
    const { from, to } = filterValue
    if (!from && !to) return true
    const cellValue = String(row.getValue(columnId))
    if (from && cellValue < from) return false
    if (to && cellValue > to) return false
    return true
  }

  // Augment columns with custom filter functions based on filter definitions
  const processedColumns = $derived(
    columns.map((col) => {
      const colId = (col as any).accessorKey || (col as any).id
      const filter = filters.find((f) => f.column === colId)
      if (!filter) return col
      if (filter.type === 'multiselect') return { ...col, filterFn: multiSelectFilterFn }
      if (filter.type === 'date') return { ...col, filterFn: dateRangeFilterFn }
      return col
    }),
  )

  // Table state slices are replaced immutably by TanStack updaters, so raw
  // state (no deep proxy) is enough and keeps reference-equality memos cheap.
  let sorting = $state.raw<SortingState>([])
  let columnFilters = $state.raw<ColumnFiltersState>([])
  let columnVisibility = $state.raw<VisibilityState>({})
  let rowSelection = $state.raw<RowSelectionState>({})
  let expanded = $state.raw<ExpandedState>({})
  // svelte-ignore state_referenced_locally: pinning / grouping props are initial values by design.
  let columnPinning = $state.raw<ColumnPinningState>({
    left: defaultColumnPinning.left ?? [],
    right: defaultColumnPinning.right ?? [],
  })
  let columnOrder = $state.raw<string[]>([])
  // svelte-ignore state_referenced_locally: initial grouping only.
  let grouping = $state.raw<GroupingState>(defaultGrouping)
  let pagination = $state.raw({ pageIndex: 0, pageSize: 10 })

  // Per-filter reactive range calendar model (ISO strings), keyed by column.
  let dateRangeModels = $state.raw<Record<string, DateRangeValue>>({})

  /** `{ value }` box over a state slice so the shared `valueUpdater` can drive it. */
  function box<T>(get: () => T, set: (v: T) => void): { value: T } {
    return {
      get value() {
        return get()
      },
      set value(v: T) {
        set(v)
      },
    }
  }

  const paginationRowModel = getPaginationRowModel<TData>()
  const sortedRowModel = getSortedRowModel<TData>()
  const filteredRowModel = getFilteredRowModel<TData>()

  export const table: TanstackTable<TData> = createSvelteTable<TData>({
    get data() {
      return data
    },
    get columns() {
      return processedColumns
    },
    getCoreRowModel: getCoreRowModel(),
    // Skip client pagination entirely when disabled (not just hide the footer UI).
    get getPaginationRowModel() {
      return isServerSide || !enablePagination ? undefined : paginationRowModel
    },
    get getSortedRowModel() {
      return isServerSide ? undefined : sortedRowModel
    },
    get getFilteredRowModel() {
      return isServerSide ? undefined : filteredRowModel
    },
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    get enableColumnResizing() {
      return enableResize
    },
    columnResizeMode: 'onChange',
    get manualPagination() {
      return isServerSide
    },
    get manualSorting() {
      return isServerSide
    },
    get manualFiltering() {
      return isServerSide
    },
    get rowCount() {
      return isServerSide ? totalRows : undefined
    },
    onSortingChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => sorting, (v) => (sorting = v)))
      if (isServerSide) {
        setTimeout(() => emitStateUpdate(), 0)
      }
    },
    onColumnFiltersChange: (updaterOrValue) => {
      // Server-side: never auto-emit on filter change — handled by Apply / search debounce
      // Client-side inline: filters apply locally via TanStack, no emit needed
      valueUpdater(updaterOrValue, box(() => columnFilters, (v) => (columnFilters = v)))
    },
    onColumnVisibilityChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => columnVisibility, (v) => (columnVisibility = v)))
    },
    onRowSelectionChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => rowSelection, (v) => (rowSelection = v)))
    },
    onExpandedChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => expanded, (v) => (expanded = v)))
    },
    onPaginationChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => pagination, (v) => (pagination = v)))
      if (isServerSide) {
        if (paginationEmitTimer) clearTimeout(paginationEmitTimer)
        paginationEmitTimer = setTimeout(() => emitStateUpdate(), 0)
      }
    },
    onColumnPinningChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => columnPinning, (v) => (columnPinning = v)))
    },
    onColumnOrderChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => columnOrder, (v) => (columnOrder = v)))
    },
    onGroupingChange: (updaterOrValue) => {
      valueUpdater(updaterOrValue, box(() => grouping, (v) => (grouping = v)))
    },
    state: {
      get sorting() {
        return sorting
      },
      get columnFilters() {
        return columnFilters
      },
      get columnVisibility() {
        return columnVisibility
      },
      get pagination() {
        return pagination
      },
      get rowSelection() {
        return rowSelection
      },
      get expanded() {
        return expanded
      },
      get columnPinning() {
        return columnPinning
      },
      get columnOrder() {
        return columnOrder
      },
      get grouping() {
        return grouping
      },
    },
  })

  /** Build and emit current server-side state */
  function emitStateUpdate() {
    if (!isMounted) return
    const s = sorting[0]
    const filterMap: Record<string, any> = {}
    for (const cf of columnFilters) {
      filterMap[cf.id] = cf.value
    }
    onStateChange?.({
      page: table.getState().pagination.pageIndex + 1,
      pageSize: table.getState().pagination.pageSize,
      sortBy: s?.id || '',
      sortOrder: s?.desc ? 'desc' : 'asc',
      filters: filterMap,
      search: (filterColumn && (table.getColumn(filterColumn)?.getFilterValue() as string)) || '',
    })
  }

  function onSearchInput(val: string) {
    if (!filterColumn || !table.getColumn(filterColumn)) return
    table.getColumn(filterColumn)?.setFilterValue(val || undefined)
    if (isServerSide) {
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
      searchDebounceTimer = setTimeout(() => {
        table.setPageIndex(0)
        emitStateUpdate()
      }, 500)
    }
  }

  // ── Filter snapshot helpers ──────────────────────────────────────────────
  function snapshotFilters() {
    filterApplied = false
    filterSnapshot = JSON.parse(JSON.stringify(columnFilters))
    dateRangeSnapshot = JSON.parse(JSON.stringify(dateRangeModels))
  }

  function maybeRestoreFilters() {
    if (!filterApplied && filterSnapshot) {
      columnFilters = filterSnapshot
      dateRangeModels = dateRangeSnapshot ?? {}
    }
    filterSnapshot = null
    dateRangeSnapshot = null
  }

  function onFilterSheetOpen() {
    snapshotFilters()
    isFilterSheetOpen = true
  }

  function onFilterSheetClose(open: boolean) {
    if (!open) maybeRestoreFilters()
    isFilterSheetOpen = open
  }

  // ── Filter helpers ─────────────────────────────────────────────────────
  function getMultiSelectValue(column: string): string[] {
    return (table.getColumn(column)?.getFilterValue() as string[]) ?? []
  }

  function getDateRangeValue(column: string): DateRangeValue {
    return (table.getColumn(column)?.getFilterValue() as DateRangeValue) ?? {}
  }

  function getCalendarModel(column: string): DateRange | undefined {
    return isoRangeToCalendar(getDateRangeValue(column))
  }

  function onCalendarUpdate(column: string, val: DateRange | undefined) {
    const from = val?.start ? dateToIso(val.start) : undefined
    const to = val?.end ? dateToIso(val.end) : undefined
    dateRangeModels = { ...dateRangeModels, [column]: { from, to } }
    const hasValue = from || to
    table.getColumn(column)?.setFilterValue(hasValue ? { from, to } : undefined)
  }

  function formatDateRange(column: string): string {
    const dr = getDateRangeValue(column)
    if (dr.from && dr.to) return `${dr.from} - ${dr.to}`
    if (dr.from) return `From ${dr.from}`
    if (dr.to) return `Until ${dr.to}`
    return ''
  }

  function toggleMultiSelectValue(column: string, option: string) {
    const current = getMultiSelectValue(column)
    const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option]
    table.getColumn(column)?.setFilterValue(next.length > 0 ? next : undefined)
  }

  function clearAllFilters() {
    filterApplied = true
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
    filters.forEach((f) => {
      table.getColumn(f.column)?.setFilterValue(undefined)
      if (f.type === 'date') {
        dateRangeModels = { ...dateRangeModels, [f.column]: {} }
      }
    })
    if (filterColumn && table.getColumn(filterColumn)) {
      table.getColumn(filterColumn)?.setFilterValue(undefined)
    }
    if (isServerSide) {
      table.setPageIndex(0)
      queueMicrotask(() => emitStateUpdate())
    }
  }

  function isFilterActive(filter: FilterDefinition): boolean {
    const value = table.getColumn(filter.column)?.getFilterValue()
    if (value === undefined || value === '') return false
    if (filter.type === 'multiselect') return Array.isArray(value) && value.length > 0
    if (filter.type === 'date') {
      const d = value as DateRangeValue
      return !!(d.from || d.to)
    }
    return true
  }

  const hasSearchValue = $derived(!!(filterColumn && (table.getColumn(filterColumn)?.getFilterValue() as string)))
  const isAnyFilterActive = $derived(hasSearchValue || filters.some(isFilterActive))

  function getFilterSelectedLabels(filter: FilterDefinition): string[] {
    const vals = getMultiSelectValue(filter.column)
    return vals.map((v) => {
      const opt = filter.options?.find((o) => resolveOption(o).value === v)
      return opt ? resolveOption(opt).label : v
    })
  }

  function clearFilter(filter: FilterDefinition) {
    table.getColumn(filter.column)?.setFilterValue(undefined)
  }

  const activeFilterCount = $derived(filters.filter(isFilterActive).length)

  function clearDateFilter(filter: FilterDefinition) {
    clearFilter(filter)
    dateRangeModels = { ...dateRangeModels, [filter.column]: {} }
  }

  function onApplyFilters() {
    filterApplied = true
    if (isServerSide) {
      if (table.getState().pagination.pageIndex === 0) {
        emitStateUpdate()
      } else {
        table.setPageIndex(0)
      }
    }
    isFilterSheetOpen = false
  }

  /**
   * Popover filter mode: handle the staged-edit commit. Walk the draft,
   * write each column's value via `setFilterValue`, and sync the calendar
   * model for date filters so a subsequent reopen reflects the just-applied
   * range.
   */
  function onCommitDraft(draft: Record<string, any>) {
    for (const f of filters) {
      if (!(f.column in draft)) continue
      const val = draft[f.column]
      if (f.type === 'date') {
        const dr = (val ?? {}) as DateRangeValue
        dateRangeModels = { ...dateRangeModels, [f.column]: { from: dr.from, to: dr.to } }
        table.getColumn(f.column)?.setFilterValue(val)
      } else {
        table.getColumn(f.column)?.setFilterValue(val)
      }
    }
    onApplyFilters()
  }

  // ── Column reorder (HTML5 drag/drop swaps dragged column with drop target) ──
  let dragColId = $state<string | null>(null)
  let dragOverColId = $state<string | null>(null)

  function onColDragStart(id: string, e: DragEvent) {
    dragColId = id
    document.body.style.cursor = 'grabbing'
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
    }
  }

  function onColDragOver(targetId: string, e: DragEvent) {
    if (!enableReorder || !dragColId) return
    e.preventDefault()
    dragOverColId = targetId
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }

  function onColDragEnd() {
    document.body.style.cursor = ''
    dragColId = null
    dragOverColId = null
  }

  function onColDrop(targetId: string) {
    const src = dragColId
    onColDragEnd()
    if (!src || src === targetId) return
    const order = (columnOrder.length ? columnOrder : table.getAllLeafColumns().map((c) => c.id)).slice()
    const from = order.indexOf(src)
    const to = order.indexOf(targetId)
    if (from === -1 || to === -1) return
    order.splice(to, 0, ...order.splice(from, 1))
    columnOrder = order
  }

  // ── Pinning — return style for sticky pinned cells (header or body) ──
  function pinStyle(col: Column<TData, unknown>): string | undefined {
    const side = col.getIsPinned()
    if (!side) return undefined
    if (side === 'left') return `position: sticky; left: ${col.getStart('left')}px; z-index: 2`
    return `position: sticky; right: ${col.getAfter('right')}px; z-index: 2`
  }

  function headStyle(header: Header<TData, unknown>): string | undefined {
    const parts: string[] = []
    if (enableResize) parts.push(`width: ${header.getSize()}px`)
    const pin = pinStyle(header.column)
    if (pin) parts.push(pin)
    return parts.length ? parts.join('; ') : undefined
  }

  // ── Infinite scroll — sentinel row triggers fetch-more when visible ──
  // Re-attaches when the sentinel mounts, `infinite` flips, or rows / the
  // callback change (so a still-visible sentinel re-fires after an append).
  let sentinelEl = $state<HTMLDivElement | null>(null)
  $effect(() => {
    const node = sentinelEl
    const fetchMore = onFetchMore
    void data
    if (!infinite || !node) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchMore?.()
      },
      { rootMargin: '100px' },
    )
    io.observe(node)
    return () => io.disconnect()
  })

  function exportableColumns() {
    return table.getVisibleLeafColumns().filter((c) => c.id !== 'select' && c.id !== 'actions' && c.id !== 'expander')
  }

  function headerLabels(cols: Column<TData, unknown>[]) {
    return cols.map((c) =>
      String(c.columnDef.header && typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id),
    )
  }

  // ── CSV export — currently filtered + visible data, skips select/actions/expander cols. ──
  export function exportCsv() {
    const visibleCols = exportableColumns()
    const headers = headerLabels(visibleCols)
    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleCols.map((c) => {
        const v = row.getValue(c.id)
        const s = v == null ? '' : String(v)
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      }),
    )
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    downloadBlob(csv, 'text/csv;charset=utf-8;', `export-${Date.now()}.csv`)
  }

  // ── JSON export — same scope as CSV, but emits underlying row.original objects ──
  export function exportJson() {
    const visibleColIds = exportableColumns().map((c) => c.id)
    const rows = table.getFilteredRowModel().rows.map((row) => {
      const original = row.original as Record<string, unknown>
      const out: Record<string, unknown> = {}
      for (const id of visibleColIds) {
        out[id] = id in original ? original[id] : row.getValue(id)
      }
      return out
    })
    const json = JSON.stringify(rows, null, 2)
    downloadBlob(json, 'application/json;charset=utf-8;', `export-${Date.now()}.json`)
  }

  function downloadBlob(content: string, type: string, filename: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function targetRowsFor(rowsToCopy?: Row<TData>[]) {
    return rowsToCopy && rowsToCopy.length > 0
      ? rowsToCopy
      : table.getSelectedRowModel().rows.length > 0
        ? table.getSelectedRowModel().rows
        : table.getFilteredRowModel().rows
  }

  // ── TSV clipboard copy — formatted for instant paste into Excel / Sheets / Notion ──
  export function copyTsv(rowsToCopy?: Row<TData>[]) {
    const visibleCols = exportableColumns()
    const headers = headerLabels(visibleCols)
    const rowData = targetRowsFor(rowsToCopy).map((row) =>
      visibleCols.map((c) => {
        const v = row.getValue(c.id)
        return v == null ? '' : String(v).replace(/[\t\n\r]/g, ' ')
      }),
    )
    const tsv = [headers.join('\t'), ...rowData.map((r) => r.join('\t'))].join('\n')
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(tsv).catch(() => {})
    }
    return tsv
  }

  // ── Markdown table copy — formatted for PR descriptions, issues, and docs ──
  export function copyMarkdown(rowsToCopy?: Row<TData>[]) {
    const visibleCols = exportableColumns()
    const headers = headerLabels(visibleCols)
    const rowData = targetRowsFor(rowsToCopy).map((row) =>
      visibleCols.map((c) => {
        const v = row.getValue(c.id)
        return v == null ? '' : String(v).replace(/[|\n\r]/g, ' ')
      }),
    )
    const sep = visibleCols.map(() => '---')
    const md = [`| ${headers.join(' | ')} |`, `| ${sep.join(' | ')} |`, ...rowData.map((r) => `| ${r.join(' | ')} |`)].join(
      '\n',
    )
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(md).catch(() => {})
    }
    return md
  }

  // ── Keyboard ergonomics & focused row tracking (Linear / Raycast craft) ───────
  let focusedRowIndex = $state(-1)
  let lastSelectedRowIndex = $state(-1)

  function onTableKeyDown(e: KeyboardEvent) {
    if (!enableKeyboardNavigation) return
    const target = e.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return
    }

    const rows = table.getRowModel().rows
    if (!rows || rows.length === 0) return

    const isDown = e.key === 'ArrowDown' || e.key === 'j'
    const isUp = e.key === 'ArrowUp' || e.key === 'k'
    const isSpace = e.key === ' ' || e.key === 'x'
    const isEnter = e.key === 'Enter'
    const isEscape = e.key === 'Escape'
    const isSelectAll = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a'
    const isCopy = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c'

    if (isDown) {
      e.preventDefault()
      const nextIdx = Math.min(focusedRowIndex + 1, rows.length - 1)
      if (e.shiftKey && focusedRowIndex >= 0) {
        const start = Math.min(focusedRowIndex, nextIdx)
        const end = Math.max(focusedRowIndex, nextIdx)
        for (let i = start; i <= end; i++) {
          rows[i]?.toggleSelected(true)
        }
      }
      focusedRowIndex = nextIdx
    } else if (isUp) {
      e.preventDefault()
      const prevIdx = Math.max(focusedRowIndex - 1, 0)
      if (e.shiftKey && focusedRowIndex >= 0) {
        const start = Math.min(focusedRowIndex, prevIdx)
        const end = Math.max(focusedRowIndex, prevIdx)
        for (let i = start; i <= end; i++) {
          rows[i]?.toggleSelected(true)
        }
      }
      focusedRowIndex = prevIdx
    } else if (isSpace) {
      if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
        e.preventDefault()
        rows[focusedRowIndex]!.toggleSelected()
        lastSelectedRowIndex = focusedRowIndex
      }
    } else if (isEnter) {
      if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
        e.preventDefault()
        onRowClick?.(rows[focusedRowIndex]!.original)
      }
    } else if (isEscape) {
      if (table.getSelectedRowModel().rows.length > 0) {
        e.preventDefault()
        table.toggleAllRowsSelected(false)
      }
      focusedRowIndex = -1
    } else if (isSelectAll) {
      e.preventDefault()
      table.toggleAllRowsSelected(true)
    } else if (isCopy) {
      const selected = table.getSelectedRowModel().rows
      if (selected.length > 0) {
        e.preventDefault()
        copyTsv(selected)
      } else if (focusedRowIndex >= 0 && focusedRowIndex < rows.length) {
        e.preventDefault()
        copyTsv([rows[focusedRowIndex]!])
      }
    }
  }

  function onRowClicked(row: Row<TData>, idx: number, event: MouseEvent) {
    focusedRowIndex = idx
    if (event.shiftKey && lastSelectedRowIndex >= 0) {
      const rows = table.getRowModel().rows
      const start = Math.min(lastSelectedRowIndex, idx)
      const end = Math.max(lastSelectedRowIndex, idx)
      for (let i = start; i <= end; i++) {
        rows[i]?.toggleSelected(true)
      }
    } else {
      lastSelectedRowIndex = idx
    }
    onRowClick?.(row.original)
  }

  const selectedRows = $derived(table.getSelectedRowModel().rows)
  const bodyRows = $derived(table.getRowModel().rows)

  const toolbarProps = $derived({
    table: table as TanstackTable<any>,
    filterColumn,
    filterPlaceholder,
    filters,
    filterMode,
    enableSearch,
    enableColumnVisibility,
    enableExport,
    enableDensityToggle,
    density: currentDensity,
    activeFilterCount,
    isAnyFilterActive,
    isServerSide,
    getMultiSelectValue,
    getDateRangeValue,
    getFilterSelectedLabels,
    formatDateRange,
    getCalendarModel,
    onSearch: onSearchInput,
    onOpenFilterSheet: onFilterSheetOpen,
    onApplyFilters,
    onClearAllFilters: clearAllFilters,
    onToggleMultiselect: toggleMultiSelectValue,
    onClearFilter: clearFilter,
    onClearDateFilter: clearDateFilter,
    onCalendarUpdate,
    onTextFilterUpdate: (col: string, val: string | undefined) => table.getColumn(col)?.setFilterValue(val),
    onCommitFilters: onCommitDraft,
    onExportCsv: exportCsv,
    onExportJson: exportJson,
    onCopyTsv: () => copyTsv(),
    onCopyMarkdown: () => copyMarkdown(),
    onDensityChange: (v: 'compact' | 'cozy' | 'comfortable') => (densityOverride = v),
    toolbarExtra,
    customFilters,
  })

</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_static_element_interactions: the table container is a focusable keyboard-navigation surface (React/Vue parity: no role). -->
<div
  data-uipkge=""
  data-slot="data-table"
  class="focus-visible:ring-border/50 relative w-full outline-none focus-visible:ring-1"
  tabindex={0}
  onkeydown={onTableKeyDown}
>
  <!-- Toolbar (above-mode: floats outside the bordered card). -->
  {#if !hideToolbar && toolbarPosition === 'above'}
    <DataTableToolbar {...toolbarProps} borderless />
  {/if}

  <div class={['bg-card text-card-foreground overflow-hidden', borderless === 'full' ? '' : 'rounded-md border'].join(' ')}>
    <!-- Toolbar (inside-mode, default). -->
    {#if !hideToolbar && toolbarPosition === 'inside'}
      <DataTableToolbar {...toolbarProps} borderless={dropInnerBorders} />
    {/if}

    <!-- Filter Sheet (modal mode) -->
    <DataTableFilterSheet
      open={isFilterSheetOpen}
      onOpenChange={onFilterSheetClose}
      table={table as TanstackTable<any>}
      {filters}
      {activeFilterCount}
      {isAnyFilterActive}
      {isServerSide}
      borderless={dropInnerBorders}
      {getMultiSelectValue}
      {getDateRangeValue}
      {formatDateRange}
      {getCalendarModel}
      onApply={onApplyFilters}
      onClearAll={clearAllFilters}
      onToggleMultiselect={toggleMultiSelectValue}
      onClearFilter={clearFilter}
      onClearDateFilter={clearDateFilter}
      {onCalendarUpdate}
      onTextFilterUpdate={(col, val) => table.getColumn(col)?.setFilterValue(val)}
      {customFilters}
    />

    <!-- Bulk action bar (inline mode) -->
    {#if bulkActionPosition === 'inline' && renderBulkActions && selectedRows.length > 0}
      <div class="bg-primary/5 border-primary/15 flex items-center gap-3 border-b px-4 py-2">
        <span class="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums">
          {selectedRows.length} selected
        </span>
        <div class="flex min-w-0 flex-1 items-center gap-2">
          {@render renderBulkActions(selectedRows, () => table.toggleAllRowsSelected(false))}
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground shrink-0 text-xs font-medium transition"
          onclick={() => table.toggleAllRowsSelected(false)}
        >
          Clear
        </button>
      </div>
    {/if}

    <!-- Table. The Table primitive wraps the <table> in its own overflow-auto
         div; neutralize that inner overflow and let the outer scroll
         container own the scroll region. -->
    <div
      class={[densityClass, 'relative [&_[data-slot=table-container]]:overflow-visible', maxHeight ? 'overflow-auto' : ''].join(
        ' ',
      )}
      style:max-height={maxHeight || undefined}
    >
      <Table>
        <TableHeader
          class={stickyHeader
            ? 'bg-card/95 sticky top-0 z-10 shadow-[0_1px_0_0_var(--border)] backdrop-blur-sm'
            : undefined}
        >
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <TableRow>
              {#each headerGroup.headers as header (header.id)}
                {@const reorderable =
                  enableReorder &&
                  header.column.id !== 'select' &&
                  header.column.id !== 'actions' &&
                  header.column.id !== 'expander'}
                {@const sortDir = header.column.getIsSorted()}
                <TableHead
                  scope="col"
                  aria-sort={header.column.getCanSort()
                    ? sortDir === 'asc'
                      ? 'ascending'
                      : sortDir === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined}
                  class={[
                    'relative transition-colors duration-150',
                    reorderable ? 'cursor-grab active:cursor-grabbing' : '',
                    dragColId === header.column.id ? 'opacity-50' : '',
                    dragOverColId === header.column.id && dragColId !== header.column.id
                      ? 'border-foreground/60 border-l-2'
                      : '',
                  ].join(' ')}
                  style={headStyle(header)}
                  draggable={reorderable}
                  ondragstart={reorderable ? (e) => onColDragStart(header.column.id, e) : undefined}
                  ondragover={reorderable ? (e) => onColDragOver(header.column.id, e) : undefined}
                  ondragend={reorderable ? () => onColDragEnd() : undefined}
                  ondrop={reorderable ? () => onColDrop(header.column.id) : undefined}
                >
                  {#if !header.isPlaceholder}
                    <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
                  {/if}
                  {#if enableResize && header.column.getCanResize()}
                    <!-- svelte-ignore a11y_no_static_element_interactions: pointer-only resize handle (React parity). -->
                    <div
                      class={[
                        'hover:bg-foreground/30 absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none transition-colors select-none',
                        header.column.getIsResizing() ? 'bg-foreground/60' : '',
                      ].join(' ')}
                      onmousedown={header.getResizeHandler()}
                      ontouchstart={header.getResizeHandler()}
                    ></div>
                  {/if}
                </TableHead>
              {/each}
            </TableRow>
          {/each}
        </TableHeader>
        <TableBody
          class={loading && bodyRows.length ? 'pointer-events-none opacity-60' : undefined}
          aria-busy={loading || undefined}
        >
          {#if loading && !bodyRows.length}
            {#each Array.from({ length: 5 }) as _, i (`sk-${i}`)}
              <TableRow class="hover:bg-transparent">
                {#each Array.from({ length: Math.max(columns.length, 1) }) as __, j (`sk-${i}-${j}`)}
                  <TableCell>
                    <div
                      class="bg-muted h-4 max-w-48 animate-pulse rounded"
                      style:width={`${48 + ((i * 17 + j * 23) % 40)}%`}
                    ></div>
                  </TableCell>
                {/each}
              </TableRow>
            {/each}
          {:else if bodyRows.length}
            {#each bodyRows as row, idx (row.id)}
              {#if row.getIsGrouped()}
                <TableRow class="bg-muted/50 hover:bg-muted/70 cursor-pointer" onclick={() => row.toggleExpanded()}>
                  <TableCell colspan={row.getVisibleCells().length}>
                    <button type="button" class="flex items-center gap-2 text-sm font-medium">
                      {#if row.getIsExpanded()}
                        <ChevronDown class="size-4" />
                      {:else}
                        <ChevronRight class="size-4" />
                      {/if}
                      <span>{String(row.groupingValue ?? '')}</span>
                      <span class="text-muted-foreground font-normal">{row.subRows.length}</span>
                    </button>
                  </TableCell>
                </TableRow>
              {:else}
                <TableRow
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  data-focused={focusedRowIndex === idx ? 'true' : undefined}
                  class={[
                    onRowClick ? 'cursor-pointer' : '',
                    focusedRowIndex === idx ? 'ring-primary/60 bg-muted/40 ring-1 ring-inset' : '',
                    virtual ? '[contain-intrinsic-size:auto_48px] [content-visibility:auto]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ') || undefined}
                  onclick={(e) => onRowClicked(row, idx, e)}
                >
                  {#each row.getVisibleCells() as cell (cell.id)}
                    <TableCell class={row.getIsSelected() ? 'bg-muted' : 'bg-card'} style={pinStyle(cell.column)}>
                      <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
                    </TableCell>
                  {/each}
                </TableRow>
                {#if row.getIsExpanded() && renderExpanded}
                  <TableRow>
                    <TableCell colspan={row.getVisibleCells().length} class="bg-muted/30 px-6 py-4">
                      {@render renderExpanded(row.original, row)}
                    </TableCell>
                  </TableRow>
                {/if}
              {/if}
            {/each}
          {:else}
            <TableRow class="hover:bg-transparent">
              <TableCell colspan={columns.length} class="h-36 text-center">
                {#if emptyState}
                  {@render emptyState()}
                {:else}
                  <div class="text-muted-foreground flex flex-col items-center justify-center gap-2 py-8">
                    <div class="bg-muted/80 text-muted-foreground grid size-10 place-items-center rounded-full">
                      <Search class="size-4" aria-hidden="true" />
                    </div>
                    <div class="space-y-1">
                      <p class="text-foreground text-sm font-medium">No results</p>
                      <p class="text-muted-foreground max-w-[28ch] text-xs leading-relaxed">
                        Try adjusting search or filters to find what you need.
                      </p>
                    </div>
                  </div>
                {/if}
              </TableCell>
            </TableRow>
          {/if}
        </TableBody>
        {#if renderFooter}
          <tfoot class="bg-muted/20 sticky bottom-0 border-t">{@render renderFooter(bodyRows)}</tfoot>
        {/if}
      </Table>
      <!-- Infinite scroll sentinel -->
      {#if infinite}
        <div bind:this={sentinelEl} class="h-1"></div>
      {/if}
      {#if infinite && loading}
        <div class="border-border text-muted-foreground border-t px-4 py-3 text-center text-sm">Loading more…</div>
      {/if}
    </div>

    <!-- Pagination (inside-mode, default) -->
    {#if enablePagination && !infinite && paginationPosition === 'inside'}
      <DataTablePagination
        table={table as TanstackTable<any>}
        {totalRows}
        {isServerSide}
        borderless={dropInnerBorders}
      />
    {/if}
  </div>

  <!-- Pagination (below-mode: floats outside the bordered card). -->
  {#if enablePagination && !infinite && paginationPosition === 'below'}
    <DataTablePagination table={table as TanstackTable<any>} {totalRows} {isServerSide} borderless />
  {/if}

  <!-- Floating Bulk Actions HUD Dock — Linear/Raycast craft dock -->
  {#if bulkActionPosition === 'floating' && selectedRows.length > 0}
    <div
      data-slot="data-table-bulk-dock"
      class="border-border/80 bg-background/95 text-foreground fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 rounded-full border px-3.5 py-1.5 shadow-xl backdrop-blur-md select-none sm:absolute"
    >
      <span
        class="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-semibold tabular-nums"
      >
        {selectedRows.length} selected
      </span>

      <div class="bg-border h-3.5 w-px"></div>

      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
        title="Copy selected rows as TSV (Excel / Sheets)"
        onclick={() => copyTsv(selectedRows)}
      >
        <Copy class="size-3" />
        Copy TSV
      </button>

      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
        title="Export table as CSV"
        onclick={exportCsv}
      >
        <Download class="size-3" />
        Export
      </button>

      {@render renderBulkActions?.(selectedRows, () => table.toggleAllRowsSelected(false))}

      <div class="bg-border h-3.5 w-px"></div>

      <button
        type="button"
        class="text-muted-foreground hover:text-foreground hover:bg-muted flex size-5 items-center justify-center rounded-full transition-colors"
        title="Deselect all (Esc)"
        aria-label="Clear selection"
        onclick={() => table.toggleAllRowsSelected(false)}
      >
        <X class="size-3.5" />
      </button>
    </div>
  {/if}
</div>
