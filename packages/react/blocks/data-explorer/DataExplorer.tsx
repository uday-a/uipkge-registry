'use client'

// A configurable record explorer: the table shape a data-heavy admin tool
// converges on once search, per-column sort + filter, density, fullscreen,
// export, pagination and a detail sheet all have to share one card -- driven
// by a `columns` config and either in-memory `rows` or an async `source`,
// with selection, expansion, tree rows, grouping, pinning, resizing, virtual
// and infinite scrolling layered on the same chrome.
//
// Everything is client-side against `rows` unless `source` is given; then
// search/filter/sort/paging are the server's job and this only renders what
// comes back (keyset-paginate on `(timestamp, id)` -- never deep OFFSET).
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { EmptyState, type EmptyStateProps } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DataExplorerCell } from './DataExplorerCell'
import { DataExplorerColumnHeader } from './DataExplorerColumnHeader'
import { DataExplorerColumnsMenu } from './DataExplorerColumnsMenu'
import { DataExplorerDetailRow } from './DataExplorerDetailRow'
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Layers,
  Link2,
  Loader,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Search,
  SlidersHorizontal,
  Table2,
  Workflow,
  X,
} from './data-explorer-icons'
import {
  PERSIST_PREFIX,
  aggregate,
  applyQuery,
  columnAlign,
  columnKind,
  computeWindow,
  downloadText,
  flattenTree,
  fmtValue,
  formatCell,
  getValue,
  groupRows,
  isFilterable,
  isSortable,
  layoutColumns,
  paginate,
  parsePersisted,
  renderExport,
  rowKeyOf,
  type ColumnLayout,
  type FlatRow,
} from './data-explorer-core'
import { PIPELINE_RUN_COLUMNS, PIPELINE_RUN_SECTIONS, createSampleRuns } from './data-explorer-data'
import {
  DENSITY_CELL_CLASSES,
  DENSITY_LABELS,
  DENSITY_MODES,
  EXPORT_FORMATS,
  OPERATOR_LABELS,
  TONE_DOT_CLASSES,
  type DensityMode,
  type ExplorerCellEdit,
  type ExplorerColumn,
  type ExplorerDetailSection,
  type ExplorerFacet,
  type ExplorerFilter,
  type ExplorerPersistedState,
  type ExplorerRow,
  type ExplorerRowAction,
  type ExplorerSort,
  type ExplorerSource,
  type ExportFormat,
} from './data-explorer-types'

export interface DataExplorerProps<T extends ExplorerRow = ExplorerRow> {
  /** Column config. Omit for the built-in pipeline-run sample columns. */
  columns?: ExplorerColumn<T>[]
  /** In-memory rows. Omit for the sample dataset; pass [] for the empty state. */
  rows?: T[]
  /** Async source. When set, search/filter/sort/paging are sent to it and `rows` is ignored. */
  source?: ExplorerSource<T>
  /** Field (or function) that identifies a row. Default `id`. */
  rowKey?: string | ((row: T) => string)
  /** Field holding child rows; rows that have any get a chevron and nest beneath their parent. */
  childrenKey?: string
  /** Force the skeleton body (a `source` manages its own loading). */
  loading?: boolean
  /** Force the error banner with a Retry action. */
  error?: string | null
  /** `pages` (default), `infinite` (append on scroll) or `none` (everything at once). */
  pagination?: 'pages' | 'infinite' | 'none'
  pageSize?: number
  pageSizeOptions?: number[]
  /** Window the rows -- only what is on screen is mounted. Needs a height on the wrapper. */
  virtual?: boolean
  /** Row height for `virtual`; measured from the first row when omitted. */
  rowHeight?: number
  /** Checkbox column + bulk bar. `single` allows one row at a time. Shift-click selects a range. */
  selectable?: boolean | 'single'
  /** Chevron column; each row can open a `renderExpanded` panel beneath it. */
  expandable?: boolean
  /** Column key to group rows under collapsible headers. */
  groupBy?: string | null
  density?: DensityMode
  /** One sort or a multi-sort stack (shift-click a header's sort option to add). */
  initialSort?: ExplorerSort | ExplorerSort[]
  initialFilters?: ExplorerFilter[]
  initialSearch?: string
  /** Column that powers the facet popover. Defaults to the first badge/dot column. */
  facetColumn?: string | null
  initialFacet?: string
  searchable?: boolean
  searchPlaceholder?: string
  toolbar?: boolean
  /** Chips under the toolbar summarising the active column filters + facet. */
  filterChips?: boolean
  columnsMenu?: boolean
  densityMenu?: boolean
  exportMenu?: boolean
  fullscreenToggle?: boolean
  /** Aggregates row under the body for columns that declare `aggregate`. */
  footer?: boolean
  striped?: boolean
  /** Extra classes per row (conditional formatting). */
  rowClass?: (row: T) => string | undefined
  /** Adds a trailing actions column with a per-row menu, also offered on right-click. */
  rowActions?: (row: T) => ExplorerRowAction<T>[]
  /** Open the record in a detail Sheet on row click. Default true. */
  detail?: boolean
  detailSections?: ExplorerDetailSection[]
  emptyTitle?: string
  emptyDescription?: string
  /** localStorage key for sort, filters, columns, density and page size. */
  persistKey?: string
  /** Give the wrapper a height (e.g. `h-[36rem]`) to get a sticky header + internal scroll. */
  className?: string

  /** Selected row keys. Controlled when given; pair with `onSelectedChange`. */
  selected?: string[]
  onSelectedChange?: (keys: string[]) => void

  onRetry?: () => void
  onRowClick?: (row: T) => void
  onSelectionChange?: (rows: T[]) => void
  onSortChange?: (sorts: ExplorerSort[]) => void
  onFilterChange?: (filters: ExplorerFilter[]) => void
  onSearchChange?: (query: string) => void
  onCellEdit?: (edit: ExplorerCellEdit<T>) => void
  onLoadMore?: () => void
  onPageChange?: (page: number) => void

  /** Replaces the typed renderer for a column (keyed by column key). */
  renderCell?: Partial<Record<string, (ctx: { row: T; value: unknown; column: ExplorerColumn<T> }) => React.ReactNode>>
  /** Swaps the label inside a header control (keyed by column key). */
  renderHeader?: Partial<Record<string, (column: ExplorerColumn<T>) => React.ReactNode>>
  /** Panel under an expanded row. Default: the record as key/values. */
  renderExpanded?: (row: T) => React.ReactNode
  /** Replaces the empty state. */
  renderEmpty?: (ctx: { filtered: boolean; reset: () => void }) => React.ReactNode
  toolbarStart?: React.ReactNode
  toolbarEnd?: React.ReactNode
  /** Controls in the bulk bar. Default: Export selected. */
  renderBulkActions?: (ctx: { rows: T[]; clear: () => void }) => React.ReactNode
  /** Replaces the detail sheet body. */
  renderDetail?: (row: T) => React.ReactNode
  /** Extra controls in the detail sheet header. */
  renderDetailActions?: (row: T | null) => React.ReactNode
  /** Label inside a group header row. */
  renderGroupLabel?: (ctx: { value: unknown; label: string; count: number }) => React.ReactNode
  /** Footer cell content (keyed by column key). */
  renderFooter?: Partial<Record<string, (ctx: { rows: T[]; column: ExplorerColumn<T> }) => React.ReactNode>>
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
const NO_FILTERS: ExplorerFilter[] = []

type EmptyIcon = NonNullable<EmptyStateProps['icon']>
type ActionIcon = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>

/** Runs `effect` when `deps` change, never on mount -- the shape of a non-immediate Vue watcher. */
function useUpdateEffect(effect: React.EffectCallback, deps: React.DependencyList) {
  const prev = React.useRef<React.DependencyList | null>(null)
  React.useEffect(() => {
    const first = prev.current === null
    const changed =
      !first && (prev.current!.length !== deps.length || prev.current!.some((d, i) => !Object.is(d, deps[i])))
    prev.current = deps
    if (first || !changed) return
    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

interface Latest<T extends ExplorerRow> {
  source: ExplorerSource<T> | undefined
  searchApplied: string
  filters: ExplorerFilter[]
  sorts: ExplorerSort[]
  facetValue: string
  facetKey: string | null
  pageIndex: number
  pageSize: number
  nextCursor: string | null
  pagination: 'pages' | 'infinite' | 'none'
  hasMore: boolean
  isServer: boolean
  isFullscreen: boolean
  searchable: boolean
  rowHeight: number | undefined
}

export function DataExplorer<T extends ExplorerRow = ExplorerRow>(props: DataExplorerProps<T>) {
  const {
    columns: columnsProp,
    rows: rowsProp,
    source,
    rowKey = 'id',
    childrenKey,
    loading = false,
    error = null,
    pagination = 'pages',
    pageSize: pageSizeProp = 25,
    pageSizeOptions: pageSizeOptionsProp = DEFAULT_PAGE_SIZE_OPTIONS,
    virtual = false,
    rowHeight,
    selectable = false,
    expandable = false,
    groupBy: groupByProp = null,
    density: densityProp = 'default',
    initialSort,
    initialFilters = NO_FILTERS,
    initialSearch = '',
    facetColumn,
    initialFacet = '',
    searchable = true,
    searchPlaceholder = 'Search…',
    toolbar = true,
    filterChips = true,
    columnsMenu = true,
    densityMenu = true,
    exportMenu = true,
    fullscreenToggle = true,
    footer = false,
    striped = false,
    rowClass,
    rowActions,
    detail = true,
    detailSections: detailSectionsProp,
    emptyTitle = 'Nothing here yet',
    emptyDescription = 'Rows appear here as soon as there is data.',
    persistKey,
    className,
    selected: selectedProp,
    onSelectedChange,
    onRetry,
    onRowClick,
    onSelectionChange,
    onSortChange,
    onFilterChange,
    onSearchChange,
    onCellEdit,
    onLoadMore,
    onPageChange,
    renderCell,
    renderHeader,
    renderExpanded,
    renderEmpty,
    toolbarStart,
    toolbarEnd,
    renderBulkActions,
    renderDetail,
    renderDetailActions,
    renderGroupLabel,
    renderFooter,
  } = props

  // Everything an event handler or async callback needs to read *now*, not
  // as of the render that created it.
  const latest = React.useRef<Latest<T>>(null as unknown as Latest<T>)

  const rootEl = React.useRef<HTMLDivElement | null>(null)

  // ── Columns ─────────────────────────────────────────────────────────────

  const usingSample = !columnsProp
  const hasRowActions = !!rowActions

  const columns = React.useMemo<ExplorerColumn<T>[]>(() => {
    const base = (columnsProp ?? (PIPELINE_RUN_COLUMNS as unknown as ExplorerColumn<T>[])).slice()
    if (hasRowActions) {
      base.push({
        key: '__actions',
        label: 'Actions',
        type: 'actions',
        width: 48,
        sortable: false,
        filterable: false,
        hideable: false,
        resizable: false,
        pin: 'right',
      })
    }
    return base
  }, [columnsProp, hasRowActions])
  const columnByKey = React.useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns])
  const knownKeys = React.useMemo(() => new Set(columns.map((c) => c.key)), [columns])
  const columnsSignature = columns.map((c) => c.key).join('|')

  const [order, setOrder] = React.useState<string[]>(() => columns.map((c) => c.key))
  const [hidden, setHidden] = React.useState<Set<string>>(
    () => new Set(columns.filter((c) => c.hidden).map((c) => c.key)),
  )
  // User pins. A configured `column.pin` the user removed goes in `unpinned`,
  // otherwise the layout would fall back to the config on every render.
  const [pins, setPins] = React.useState<Record<string, 'left' | 'right'>>({})
  const [unpinned, setUnpinned] = React.useState<Set<string>>(() => new Set())
  const [widths, setWidths] = React.useState<Record<string, number>>({})

  // A new column set (e.g. a consumer swaps configs) resets the layout state.
  useUpdateEffect(() => resetColumns(), [columnsSignature])

  const effectivePins = React.useMemo(() => {
    const out: Record<string, 'left' | 'right'> = {}
    for (const c of columns) {
      const user = pins[c.key]
      if (user) out[c.key] = user
      else if (c.pin && !unpinned.has(c.key)) out[c.key] = c.pin
    }
    return out
  }, [columns, pins, unpinned])

  const layout = React.useMemo<ColumnLayout<T>[]>(
    () => layoutColumns(columns, { order, hidden, pins: effectivePins, widths }),
    [columns, order, hidden, effectivePins, widths],
  )
  // Leading utility columns (select, expand/tree) count towards colspans + min width.
  const hasExpandColumn = expandable || !!childrenKey
  const leadingCount = (selectable ? 1 : 0) + (hasExpandColumn ? 1 : 0)
  const colCount = layout.length + leadingCount
  const totalWidth = layout.reduce((s, l) => s + l.width, 0) + leadingCount * 40

  // Spanning header row: consecutive visible columns that share a `group`.
  const headerGroups = React.useMemo(() => {
    const runs: { label: string; span: number }[] = []
    for (const l of layout) {
      const label = l.column.group ?? ''
      const last = runs[runs.length - 1]
      if (last && last.label === label) last.span++
      else runs.push({ label, span: 1 })
    }
    return runs.some((r) => r.label) ? runs : []
  }, [layout])

  function toggleHidden(key: string) {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function setPin(key: string, side: 'left' | 'right' | null) {
    const nextPins = { ...pins }
    const nextUnpinned = new Set(unpinned)
    if (side) {
      nextPins[key] = side
      nextUnpinned.delete(key)
    } else {
      delete nextPins[key]
      if (columnByKey.get(key)?.pin) nextUnpinned.add(key)
    }
    setPins(nextPins)
    setUnpinned(nextUnpinned)
  }

  function moveColumn(key: string, dir: 'left' | 'right') {
    const visibleOrder = layout.map((l) => l.column.key)
    const i = visibleOrder.indexOf(key)
    const j = dir === 'left' ? i - 1 : i + 1
    if (i < 0 || j < 0 || j >= visibleOrder.length) return
    const full = order.slice()
    const a = full.indexOf(key)
    const b = full.indexOf(visibleOrder[j]!)
    if (a < 0 || b < 0) return
    full.splice(a, 1)
    full.splice(b, 0, key)
    setOrder(full)
  }

  function resetColumns() {
    setOrder(columns.map((c) => c.key))
    setHidden(new Set(columns.filter((c) => c.hidden).map((c) => c.key)))
    setPins({})
    setUnpinned(new Set())
    setWidths({})
  }

  // ── Resize ──────────────────────────────────────────────────────────────

  const resizing = React.useRef<{ key: string; startX: number; startWidth: number; min: number; max: number } | null>(
    null,
  )

  const onResizeMove = React.useCallback((e: PointerEvent) => {
    const r = resizing.current
    if (!r) return
    const w = Math.min(r.max, Math.max(r.min, r.startWidth + e.clientX - r.startX))
    setWidths((prev) => ({ ...prev, [r.key]: Math.round(w) }))
  }, [])
  const endResize = React.useCallback(() => {
    window.removeEventListener('pointermove', onResizeMove)
    resizing.current = null
  }, [onResizeMove])
  function startResize(l: ColumnLayout<T>, e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    resizing.current = {
      key: l.column.key,
      startX: e.clientX,
      startWidth: l.width,
      min: l.column.minWidth ?? 60,
      max: l.column.maxWidth ?? 1200,
    }
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', endResize, { once: true })
  }
  function resetWidth(key: string) {
    setWidths((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // ── Slice state: search, facets, column filters, sort ───────────────────

  const [search, setSearch] = React.useState(initialSearch)
  // Debounced so a half-typed query never filters (or hits the server) per keystroke.
  const [searchApplied, setSearchApplied] = React.useState(initialSearch.trim())
  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // Detail-sheet "Copied" reset; declared here so the unmount cleanup can clear it.
  const linkTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  function updateSearch(v: string) {
    setSearch(v)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      const applied = v.trim()
      setSearchApplied(applied)
      onSearchChange?.(applied)
    }, 250)
  }

  const searchInputRef = React.useRef<HTMLInputElement | null>(null)
  function focusSearch() {
    searchInputRef.current?.focus()
  }

  const facetKey = React.useMemo<string | null>(() => {
    if (facetColumn !== undefined) return facetColumn
    return columns.find((c) => c.type === 'badge' || c.type === 'dot')?.key ?? null
  }, [facetColumn, columns])
  const facetColumnDef = facetKey ? columnByKey.get(facetKey) : undefined
  const [facetValue, setFacetValue] = React.useState(initialFacet)

  const [sorts, setSorts] = React.useState<ExplorerSort[]>(() =>
    initialSort
      ? Array.isArray(initialSort)
        ? [...initialSort]
        : [initialSort]
      : usingSample
        ? [{ key: 'startedAt', dir: 'desc' }]
        : [],
  )
  const [filters, setFilters] = React.useState<ExplorerFilter[]>(() => [...initialFilters])

  function filterFor(key: string) {
    return filters.find((f) => f.column === key)
  }

  // One filter per column: re-filtering a column replaces its rule rather than
  // stacking a second one the header could not then represent.
  function setFilter(key: string, filter: ExplorerFilter | null) {
    const rest = filters.filter((f) => f.column !== key)
    const next = filter ? [...rest, { ...filter, column: key }] : rest
    setFilters(next)
    onFilterChange?.(next)
  }

  function filterChipLabel(f: ExplorerFilter) {
    const column = columnByKey.get(f.column)
    const value = f.operator === 'empty' ? '' : ` ${f.value}`
    return `${column?.label ?? f.column} ${OPERATOR_LABELS[f.operator]}${value}`
  }

  /** Plain click replaces the sort; shift-click appends (or flips) for multi-sort. */
  function setSort(key: string, dir: 'asc' | 'desc' | null, additive = false) {
    const rest = sorts.filter((s) => s.key !== key)
    const next = !dir ? rest : additive ? [...rest, { key, dir }] : [{ key, dir }]
    setSorts(next)
    onSortChange?.(next)
  }

  // Shift held while a header menu's sort option is chosen makes it additive.
  const shiftHeld = React.useRef(false)
  function trackShift(e: React.KeyboardEvent | React.MouseEvent) {
    shiftHeld.current = e.shiftKey
  }

  function ariaSortFor(key: string): 'ascending' | 'descending' | 'none' {
    const s = sorts.find((x) => x.key === key)
    if (!s) return 'none'
    return s.dir === 'asc' ? 'ascending' : 'descending'
  }

  const hasActiveFilters = !!(searchApplied || facetValue || filters.length)

  function resetFilters() {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (search) searchTimer.current = setTimeout(() => onSearchChange?.(''), 250)
    setSearch('')
    setSearchApplied('')
    setFacetValue('')
    setFilters([])
    onFilterChange?.([])
  }

  // ── Grouping ────────────────────────────────────────────────────────────

  const [groupBy, setGroupBy] = React.useState<string | null>(groupByProp)
  useUpdateEffect(() => setGroupBy(groupByProp), [groupByProp])
  // Tree rows and group headers are both hierarchies; the tree wins.
  const groupColumn = groupBy && !childrenKey ? columnByKey.get(groupBy) : undefined
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() => new Set())
  function toggleGroup(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // ── Data: client rows or async source ───────────────────────────────────

  const [sampleRuns] = React.useState(() => createSampleRuns())
  const clientRows = React.useMemo<T[]>(() => rowsProp ?? (sampleRuns as unknown as T[]), [rowsProp, sampleRuns])
  const isServer = !!source
  // Bumped after an optimistic in-place edit so the client slice re-derives.
  const [mutationVersion, setMutationVersion] = React.useState(0)

  const queried = React.useMemo(() => {
    if (isServer) return { rows: [] as T[], facets: [] as ExplorerFacet[] }
    return applyQuery(
      clientRows,
      {
        search: searchApplied,
        filters,
        sort: sorts,
        facet: facetValue && facetKey ? { column: facetKey, value: facetValue } : null,
      },
      columns,
      facetKey,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isServer, clientRows, searchApplied, filters, sorts, facetValue, facetKey, columns, mutationVersion])

  // Server state. `serverRows` is the current page (pages mode) or the
  // accumulated list (infinite mode).
  const [serverRows, setServerRows] = React.useState<T[]>([])
  const [serverTotal, setServerTotal] = React.useState<number | null>(null)
  const [serverFacets, setServerFacets] = React.useState<ExplorerFacet[]>([])
  const [serverLoading, setServerLoading] = React.useState(!!source)
  const [serverLoadingMore, setServerLoadingMore] = React.useState(false)
  const serverLoadingMoreRef = React.useRef(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [nextCursor, setNextCursor] = React.useState<string | null>(null)
  // Monotonic token so a slow earlier response can't overwrite a newer slice.
  const requestId = React.useRef(0)

  const fetchServer = React.useCallback(async (mode: 'replace' | 'append', override: { page?: number } = {}) => {
    const cur = latest.current
    if (!cur.source) return
    const id = ++requestId.current
    if (mode === 'replace') setServerLoading(true)
    else {
      serverLoadingMoreRef.current = true
      setServerLoadingMore(true)
    }
    setServerError(null)
    try {
      const res = await cur.source({
        search: cur.searchApplied,
        filters: cur.filters,
        sort: cur.sorts,
        facet: cur.facetValue && cur.facetKey ? { column: cur.facetKey, value: cur.facetValue } : null,
        page: override.page ?? cur.pageIndex,
        pageSize: cur.pageSize,
        cursor: mode === 'append' ? cur.nextCursor : null,
      })
      if (id !== requestId.current) return
      setServerRows((prev) => (mode === 'append' ? [...prev, ...res.rows] : res.rows))
      setServerTotal(res.total ?? null)
      setNextCursor(res.nextCursor ?? null)
      if (res.facets) setServerFacets(res.facets)
    } catch (err) {
      if (id !== requestId.current) return
      setServerError(err instanceof Error ? err.message : String(err))
    } finally {
      if (id === requestId.current) {
        setServerLoading(false)
        serverLoadingMoreRef.current = false
        setServerLoadingMore(false)
      }
    }
  }, [])

  const facets = isServer ? serverFacets : queried.facets

  // ── Pagination ──────────────────────────────────────────────────────────

  const [pageSize, setPageSize] = React.useState(pageSizeProp)
  const pageSizeOptions = React.useMemo(
    () => [...new Set([...pageSizeOptionsProp, pageSizeProp])].sort((a, b) => a - b),
    [pageSizeOptionsProp, pageSizeProp],
  )
  const [pageIndex, setPageIndex] = React.useState(0)
  // Infinite mode (client): how many pages are unrolled.
  const [loadedPages, setLoadedPages] = React.useState(1)

  const total = isServer ? (serverTotal ?? serverRows.length) : queried.rows.length

  const visibleRows = React.useMemo<T[]>(() => {
    if (isServer) return serverRows
    if (pagination === 'none') return queried.rows
    if (pagination === 'infinite') return queried.rows.slice(0, loadedPages * pageSize)
    return paginate(queried.rows, pageIndex, pageSize)
  }, [isServer, serverRows, pagination, queried, loadedPages, pageSize, pageIndex])

  const hasMore = (() => {
    if (pagination !== 'infinite') return false
    if (isServer) return !!nextCursor
    return visibleRows.length < total
  })()
  const hasNext = isServer && serverTotal === null ? serverRows.length >= pageSize : (pageIndex + 1) * pageSize < total

  const rangeLabel = (() => {
    if (!visibleRows.length) return '0'
    if (pagination !== 'pages') return `1–${visibleRows.length}`
    const start = pageIndex * pageSize + 1
    return `${start}–${start + visibleRows.length - 1}`
  })()

  function nextPage() {
    if (!hasNext) return
    const next = pageIndex + 1
    setPageIndex(next)
    onPageChange?.(next)
  }
  function prevPage() {
    if (pageIndex === 0) return
    const next = pageIndex - 1
    setPageIndex(next)
    onPageChange?.(next)
  }

  // One page per frame: a scroll burst at the bottom must not unroll five.
  const loadMoreArmed = React.useRef(true)
  const loadMore = React.useCallback(() => {
    const cur = latest.current
    if (!cur.hasMore || serverLoadingMoreRef.current || !loadMoreArmed.current) return
    loadMoreArmed.current = false
    requestAnimationFrame(() => (loadMoreArmed.current = true))
    onLoadMore?.()
    if (cur.isServer) fetchServer('append')
    else setLoadedPages((p) => p + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchServer, onLoadMore])

  // Any change to the slice or its ordering returns to the first page -- a page
  // index is a position in one specific ordering of one specific filter set.
  useUpdateEffect(() => {
    setPageIndex(0)
    setLoadedPages(1)
    if (latest.current.isServer) fetchServer('replace', { page: 0 })
  }, [searchApplied, facetValue, pageSize, sorts, filters, clientRows])
  useUpdateEffect(() => {
    if (latest.current.isServer && latest.current.pagination === 'pages') fetchServer('replace', { page: pageIndex })
  }, [pageIndex])
  useUpdateEffect(() => {
    setPageIndex(0)
    if (source) fetchServer('replace', { page: 0 })
  }, [source])

  // ── Density (declared before the row pipeline that watches it) ──────────

  const [density, setDensity] = React.useState<DensityMode>(densityProp)
  useUpdateEffect(() => setDensity(densityProp), [densityProp])
  const cellDensityClass = DENSITY_CELL_CLASSES[density]

  // ── Rows to render: tree flattening, grouping, windowing ────────────────

  const keyOf = React.useCallback((row: T, i = 0) => rowKeyOf(row, rowKey, i), [rowKey])

  // Tree expansion (children) is separate from panel expansion (`renderExpanded`).
  const [treeExpanded, setTreeExpanded] = React.useState<Set<string>>(() => new Set())
  function toggleTree(key: string) {
    setTreeExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const flatRows = React.useMemo<FlatRow<T>[]>(
    () => flattenTree(visibleRows, childrenKey ?? null, treeExpanded, keyOf),
    [visibleRows, childrenKey, treeExpanded, keyOf],
  )

  const displayGroups = React.useMemo(() => {
    if (!groupColumn) return null
    return groupRows(visibleRows, groupColumn).map((g) => ({
      ...g,
      flat: flattenTree(g.rows, null, treeExpanded, keyOf),
    }))
  }, [groupColumn, visibleRows, treeExpanded, keyOf])

  const tableRef = React.useRef<HTMLTableElement | null>(null)
  const scroller = React.useRef<HTMLElement | null>(null)
  const [scrollTop, setScrollTop] = React.useState(0)
  const [viewportHeight, setViewportHeight] = React.useState(0)
  const [measuredRowHeight, setMeasuredRowHeight] = React.useState(0)
  const resizeObserver = React.useRef<ResizeObserver | null>(null)

  const effectiveRowHeight = rowHeight ?? measuredRowHeight ?? 0
  const virtualActive = virtual && !groupColumn && !expandable
  const windowState = React.useMemo(
    () =>
      virtualActive && effectiveRowHeight > 0
        ? computeWindow(scrollTop, viewportHeight, effectiveRowHeight, flatRows.length)
        : { start: 0, end: flatRows.length, padTop: 0, padBottom: 0 },
    [virtualActive, effectiveRowHeight, scrollTop, viewportHeight, flatRows.length],
  )
  const windowRows = React.useMemo(
    () => flatRows.slice(windowState.start, windowState.end),
    [flatRows, windowState.start, windowState.end],
  )

  const onScroll = React.useCallback(
    (e: Event) => {
      const el = e.target as HTMLElement
      setScrollTop(el.scrollTop)
      if (latest.current.pagination === 'infinite' && el.scrollTop + el.clientHeight >= el.scrollHeight - 200)
        loadMore()
    },
    [loadMore],
  )

  function measureRow() {
    const el = scroller.current
    if (!el) return
    setViewportHeight(el.clientHeight)
    if (latest.current.rowHeight) return
    const first = el.querySelector<HTMLElement>('tbody tr[data-row]')
    if (first) setMeasuredRowHeight(first.getBoundingClientRect().height)
  }

  // The Table primitive's root IS the scroll container; grab it after mount.
  function bindScroller() {
    const el = tableRef.current?.closest<HTMLElement>('[data-slot="table-container"]') ?? null
    if (el === scroller.current) return
    scroller.current?.removeEventListener('scroll', onScroll)
    scroller.current = el
    el?.addEventListener('scroll', onScroll, { passive: true })
    if (el && typeof ResizeObserver !== 'undefined') {
      resizeObserver.current?.disconnect()
      resizeObserver.current = new ResizeObserver(() => {
        setViewportHeight(el.clientHeight)
      })
      resizeObserver.current.observe(el)
    }
  }

  React.useEffect(() => {
    bindScroller()
    measureRow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleRows, density, virtual])

  // ── Selection ───────────────────────────────────────────────────────────

  const [internalSelected, setInternalSelected] = React.useState<string[]>([])
  const selectedKeys = selectedProp ?? internalSelected
  const selected = React.useMemo(() => new Set(selectedKeys), [selectedKeys])
  const selectedCount = selected.size

  function setSelected(next: Set<string>) {
    const keys = [...next]
    if (selectedProp === undefined) setInternalSelected(keys)
    onSelectedChange?.(keys)
    const all = isServer ? serverRows : clientRows
    onSelectionChange?.(all.filter((r, i) => next.has(keyOf(r, i))))
  }

  // Shift-click on a checkbox selects the range back to the last toggled row.
  const lastToggledIndex = React.useRef<number | null>(null)
  const shiftClick = React.useRef(false)
  function rememberShift(e: React.MouseEvent) {
    shiftClick.current = e.shiftKey
  }

  /** Sets (never toggles) so a control that reports its state twice stays idempotent. */
  function setRowSelected(fr: FlatRow<T>, on: boolean) {
    if (selected.has(fr.key) === on && !shiftClick.current) return
    const next = selectable === 'single' ? new Set<string>() : new Set(selected)
    const apply = (k: string) => (on ? next.add(k) : next.delete(k))
    if (shiftClick.current && lastToggledIndex.current !== null && selectable !== 'single') {
      const [a, b] = [lastToggledIndex.current, fr.index].sort((x, y) => x - y) as [number, number]
      for (const other of flatRows.slice(a, b + 1)) apply(other.key)
    } else {
      apply(fr.key)
    }
    shiftClick.current = false
    lastToggledIndex.current = fr.index
    setSelected(next)
  }
  function toggleRow(fr: FlatRow<T>) {
    setRowSelected(fr, !selected.has(fr.key))
  }
  const allVisibleSelected = flatRows.length > 0 && flatRows.every((fr) => selected.has(fr.key))
  const someVisibleSelected = flatRows.some((fr) => selected.has(fr.key))
  function setAllVisible(on: boolean) {
    const next = new Set(selected)
    for (const fr of flatRows) {
      if (on) next.add(fr.key)
      else next.delete(fr.key)
    }
    setSelected(next)
  }
  const selectedRows = React.useMemo(() => {
    const all = isServer ? serverRows : clientRows
    return all.filter((r, i) => selected.has(keyOf(r, i)))
  }, [isServer, serverRows, clientRows, selected, keyOf])
  function clearSelection() {
    lastToggledIndex.current = null
    setSelected(new Set())
  }

  // ── Expansion ───────────────────────────────────────────────────────────

  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())
  function toggleExpanded(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // ── Context menu ────────────────────────────────────────────────────────

  const [contextRow, setContextRow] = React.useState<T | null>(null)
  function onContextMenu(e: React.MouseEvent) {
    const tr = (e.target as HTMLElement).closest<HTMLElement>('tr[data-row]')
    const key = tr?.dataset.key
    setContextRow(key ? (flatRows.find((fr) => fr.key === key)?.row ?? null) : null)
  }
  const contextActions = contextRow && rowActions ? rowActions(contextRow) : []

  // ── Table chrome: fullscreen, keyboard ──────────────────────────────────

  const [isFullscreen, setIsFullscreen] = React.useState(false)
  function toggleFullscreen() {
    setIsFullscreen((v) => !v)
  }

  /** The instance the user is working in: contains focus, or is under the pointer. */
  const isActiveInstance = React.useCallback(() => {
    const root = rootEl.current
    if (!root) return false
    return root.contains(document.activeElement) || root.matches(':hover')
  }, [])

  const handleKeydown = React.useCallback(
    (e: KeyboardEvent) => {
      shiftHeld.current = e.shiftKey
      // Escape leaves fullscreen from anywhere; focus may be in a cell, a
      // popover, or nowhere at all, which is why this listens on window.
      if (e.key === 'Escape' && latest.current.isFullscreen) {
        setIsFullscreen(false)
        return
      }
      if (e.key === '/' && latest.current.searchable && !e.metaKey && !e.ctrlKey && !e.altKey && isActiveInstance()) {
        const active = document.activeElement as HTMLElement | null
        const tag = active?.tagName?.toLowerCase()
        if (tag === 'input' || tag === 'textarea' || active?.isContentEditable) return
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    },
    [isActiveInstance],
  )
  const handleKeyup = React.useCallback((e: KeyboardEvent) => {
    shiftHeld.current = e.shiftKey
  }, [])

  /** Arrow keys walk the rows; Enter opens; Space toggles selection; ⌘/Ctrl+A selects all; Esc clears. */
  function onRowKeydown(e: React.KeyboardEvent<HTMLTableRowElement>, fr: FlatRow<T>) {
    const tr = e.currentTarget
    // Keys typed into a control inside the row (checkbox, menu, editor) are its own.
    if (e.target !== tr) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      let sib = e.key === 'ArrowDown' ? tr.nextElementSibling : tr.previousElementSibling
      while (sib && !(sib as HTMLElement).hasAttribute('tabindex')) {
        sib = e.key === 'ArrowDown' ? sib.nextElementSibling : sib.previousElementSibling
      }
      ;(sib as HTMLElement | null)?.focus()
      return
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a' && selectable && selectable !== 'single') {
      e.preventDefault()
      setAllVisible(true)
      return
    }
    if (e.key === 'Escape' && selectedCount) {
      clearSelection()
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      activateRow(fr)
      return
    }
    if (e.key === ' ') {
      e.preventDefault()
      if (selectable) toggleRow(fr)
      else activateRow(fr)
    }
  }

  function activateRow(fr: FlatRow<T>) {
    onRowClick?.(fr.row)
    if (detail) openDetail(fr.row)
    else if (expandable) toggleExpanded(fr.key)
    else if (fr.hasChildren) toggleTree(fr.key)
  }

  // ── Persistence ─────────────────────────────────────────────────────────

  const storageKey = persistKey ? `${PERSIST_PREFIX}${persistKey}` : null

  function restoreState() {
    if (!storageKey || typeof localStorage === 'undefined') return
    try {
      const s = parsePersisted(localStorage.getItem(storageKey), knownKeys)
      if (s.sort) setSorts(s.sort)
      if (s.filters) setFilters(s.filters)
      if (s.hidden) setHidden(new Set(s.hidden))
      if (s.order?.length) setOrder((prev) => [...s.order!, ...prev.filter((k) => !s.order!.includes(k))])
      if (s.pins) setPins(s.pins)
      if (s.unpinned) setUnpinned(new Set(s.unpinned))
      if (s.widths) setWidths(s.widths)
      if (s.density) setDensity(s.density)
      if (s.pageSize) setPageSize(s.pageSize)
      if (s.groupBy !== undefined) setGroupBy(s.groupBy)
    } catch {
      // Storage blocked -- run without persistence.
    }
  }

  useUpdateEffect(() => {
    if (!storageKey || typeof localStorage === 'undefined') return
    const state: ExplorerPersistedState = {
      sort: sorts,
      filters,
      hidden: [...hidden],
      order,
      pins,
      unpinned: [...unpinned],
      widths,
      density,
      pageSize,
      groupBy,
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {
      // Quota / private mode -- fail quietly.
    }
  }, [sorts, filters, hidden, order, pins, unpinned, widths, density, pageSize, groupBy])

  // ── Lifecycle ───────────────────────────────────────────────────────────

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
    restoreState()
    bindScroller()
    measureRow()
    if (latest.current.isServer) fetchServer('replace')
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('keyup', handleKeyup)
      window.removeEventListener('pointermove', onResizeMove)
      scroller.current?.removeEventListener('scroll', onScroll)
      scroller.current = null
      resizeObserver.current?.disconnect()
      if (searchTimer.current) clearTimeout(searchTimer.current)
      if (linkTimer.current) clearTimeout(linkTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Export ──────────────────────────────────────────────────────────────

  const exportRowsSet = selectedRows.length ? selectedRows : visibleRows
  function exportRows(format: ExportFormat) {
    const stamp = new Date().toISOString().slice(0, 10)
    const exportColumns = layout.map((l) => l.column)
    downloadText(renderExport(exportRowsSet, exportColumns, format.id), `export_${stamp}.${format.ext}`, format.mime)
  }

  // ── Cell helpers ────────────────────────────────────────────────────────

  function cellClassFor(l: ColumnLayout<T>, row: T, value: unknown): string {
    const c = l.column.cellClass
    const own = typeof c === 'function' ? c(value, row) : (c ?? '')
    return cn(own, l.column.wrap ? 'whitespace-normal' : '')
  }

  function handleCellEdit(row: T, column: ExplorerColumn<T>, value: unknown) {
    const previous = getValue(row, column)
    onCellEdit?.({ row, key: column.key, value, previous })
    // Client rows: apply optimistically when the column maps to a plain field.
    if (!isServer && (column.accessor === undefined || typeof column.accessor === 'string')) {
      const field = (column.accessor as string | undefined) ?? column.key
      if (!field.includes('.')) {
        ;(row as ExplorerRow)[field] = value
        setMutationVersion((v) => v + 1)
      }
    }
  }

  function pinStyle(l: ColumnLayout<T>): React.CSSProperties | undefined {
    if (!l.pin) return undefined
    return l.pin === 'left' ? { left: `${l.offset}px` } : { right: `${l.offset}px` }
  }

  // Pinned cells must be opaque to cover scrolled content, so they mix the
  // row's hover / selected / striped tint into the card colour themselves.
  function pinClass(l: ColumnLayout<T>, header = false) {
    if (!l.pin) return ''
    return cn(
      'sticky z-[1]',
      header
        ? 'z-20 bg-[color-mix(in_oklab,var(--primary)_3%,var(--card))]'
        : 'bg-card group-hover/row:bg-[color-mix(in_oklab,var(--primary)_4%,var(--card))] group-data-[state=selected]/row:bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))] group-data-[striped]/row:bg-[color-mix(in_oklab,var(--muted)_30%,var(--card))]',
      l.edge && l.pin === 'left' ? 'shadow-[inset_-1px_0_0_var(--border)]' : '',
      l.edge && l.pin === 'right' ? 'shadow-[inset_1px_0_0_var(--border)]' : '',
    )
  }

  const facetDot = (value: string) => {
    const m = facetColumnDef?.badgeMap?.[value]
    return TONE_DOT_CLASSES[m?.tone ?? (value ? 'info' : 'muted')]
  }
  const facetLabel = (value: string) => facetColumnDef?.badgeMap?.[value]?.label ?? (value || '—')

  // First load shows the skeleton; a refetch over existing rows keeps them and
  // shows a progress line instead, so re-sorting never blanks the table.
  const bodyLoading = loading || (isServer && serverLoading && !serverRows.length)
  const refetching = isServer && serverLoading && serverRows.length > 0
  const bodyError = error ?? serverError
  function retry() {
    onRetry?.()
    if (isServer) fetchServer('replace')
  }

  // ── Detail sheet ────────────────────────────────────────────────────────

  const [detailOpen, setDetailOpen] = React.useState(false)
  const [detailRow, setDetailRow] = React.useState<T | null>(null)
  const [showAllFields, setShowAllFields] = React.useState(false)

  function openDetail(row: T) {
    setDetailRow(row)
    setShowAllFields(false)
    setDetailOpen(true)
  }

  const detailSections = React.useMemo<ExplorerDetailSection[]>(() => {
    if (detailSectionsProp) return detailSectionsProp
    if (usingSample) return PIPELINE_RUN_SECTIONS
    return [{ title: 'Fields', fields: columns.filter((c) => c.type !== 'actions').map((c) => c.key) }]
  }, [detailSectionsProp, usingSample, columns])
  const knownDetailFields = React.useMemo(() => new Set(detailSections.flatMap((s) => s.fields)), [detailSections])
  const otherFields = React.useMemo<[string, unknown][]>(() => {
    if (!detailRow) return []
    return Object.entries(detailRow)
      .filter(
        ([k, v]) =>
          !knownDetailFields.has(k) &&
          k !== childrenKey &&
          v !== null &&
          v !== '' &&
          !(Array.isArray(v) && v.length === 0),
      )
      .sort(([a], [b]) => a.localeCompare(b))
  }, [detailRow, knownDetailFields, childrenKey])

  function detailValue(field: string): unknown {
    if (!detailRow) return null
    const column = columnByKey.get(field)
    return column ? getValue(detailRow, column) : detailRow[field]
  }
  function detailText(field: string): string {
    if (!detailRow) return '—'
    const column = columnByKey.get(field)
    const value = detailValue(field)
    return column ? formatCell(column, value, detailRow) : fmtValue(value)
  }
  const detailTitle = detailRow ? keyOf(detailRow) : 'Record'
  const detailSubtitle = (() => {
    if (!detailRow) return ''
    const first = layout[0]?.column
    if (!first?.sub) return ''
    return typeof first.sub === 'function' ? first.sub(detailRow) : String(detailRow[first.sub] ?? '')
  })()

  const [linkCopied, setLinkCopied] = React.useState(false)
  async function copyLink() {
    if (!detailRow) return
    const url = `${window.location.origin}${window.location.pathname}?row=${encodeURIComponent(keyOf(detailRow))}`
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      if (linkTimer.current) clearTimeout(linkTimer.current)
      linkTimer.current = setTimeout(() => setLinkCopied(false), 1500)
    } catch {
      // Clipboard blocked -- fail quietly.
    }
  }

  latest.current = {
    source,
    searchApplied,
    filters,
    sorts,
    facetValue,
    facetKey,
    pageIndex,
    pageSize,
    nextCursor,
    pagination,
    hasMore,
    isServer,
    isFullscreen,
    searchable,
    rowHeight,
  }

  const groups = displayGroups ?? [
    { key: '__all__', value: null as unknown, label: '', rows: visibleRows, flat: windowRows },
  ]

  const rowIndexOffset = 2 + (headerGroups.length ? 1 : 0)

  const tableBody = (
    <TableBody onContextMenuCapture={onContextMenu}>
      {/* Virtual spacer: the rows above the window, as one tall cell. */}
      {windowState.padTop > 0 ? (
        <tr aria-hidden="true">
          <td colSpan={colCount} className="p-0" style={{ height: `${windowState.padTop}px` }} />
        </tr>
      ) : null}

      {groups.map((group) => (
        <React.Fragment key={group.key}>
          {/* Group header: one row per group with a collapse toggle and the count. */}
          {displayGroups ? (
            <TableRow className="bg-muted/30 hover:bg-muted/40">
              <TableCell colSpan={colCount} className="py-1">
                <Button
                  variant="ghost"
                  size="xs"
                  className="-ml-2 gap-1.5 font-medium"
                  aria-expanded={!collapsed.has(group.key)}
                  onClick={() => toggleGroup(group.key)}
                >
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground size-3.5 transition-transform',
                      collapsed.has(group.key) ? '-rotate-90' : '',
                    )}
                    aria-hidden="true"
                  />
                  {renderGroupLabel?.({ value: group.value, label: group.label, count: group.rows.length }) ??
                    group.label}
                  <Badge variant="secondary" className="px-1.5 py-0 tabular-nums">
                    {group.rows.length}
                  </Badge>
                </Button>
              </TableCell>
            </TableRow>
          ) : null}

          {!displayGroups || !collapsed.has(group.key)
            ? group.flat.map((fr) => {
                const isOpen = childrenKey ? treeExpanded.has(fr.key) : expanded.has(fr.key)
                return (
                  <React.Fragment key={fr.key}>
                    <TableRow
                      data-row=""
                      data-key={fr.key}
                      tabIndex={0}
                      aria-rowindex={fr.index + rowIndexOffset}
                      aria-level={childrenKey ? fr.depth + 1 : undefined}
                      aria-expanded={fr.hasChildren ? treeExpanded.has(fr.key) : undefined}
                      aria-selected={selectable ? selected.has(fr.key) : undefined}
                      data-state={selected.has(fr.key) ? 'selected' : undefined}
                      data-striped={striped && fr.index % 2 === 1 ? '' : undefined}
                      className={cn(
                        'group/row hover:bg-primary/[0.04] data-[state=selected]:bg-primary/[0.06] data-[striped]:bg-muted/30 focus-visible:ring-ring/50 cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-inset',
                        rowClass?.(fr.row),
                      )}
                      onClick={() => activateRow(fr)}
                      onKeyDown={(e) => onRowKeydown(e, fr)}
                    >
                      {selectable ? (
                        <TableCell
                          className={cn('px-2', cellDensityClass)}
                          onClick={(e) => e.stopPropagation()}
                          onClickCapture={rememberShift}
                        >
                          <Checkbox
                            checked={selected.has(fr.key)}
                            size="sm"
                            aria-label={`Select row ${fr.key}`}
                            onCheckedChange={(v) => setRowSelected(fr, v === true)}
                          />
                        </TableCell>
                      ) : null}
                      {hasExpandColumn ? (
                        <TableCell className={cn('px-2', cellDensityClass)} onClick={(e) => e.stopPropagation()}>
                          {(childrenKey ? fr.hasChildren : true) ? (
                            <Button
                              variant="ghost"
                              size="icon-2xs"
                              aria-expanded={isOpen}
                              aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                              onClick={() => (childrenKey ? toggleTree(fr.key) : toggleExpanded(fr.key))}
                            >
                              <ChevronRight
                                className={cn(
                                  'text-muted-foreground size-3.5 transition-transform',
                                  isOpen ? 'rotate-90' : '',
                                )}
                                aria-hidden="true"
                              />
                            </Button>
                          ) : null}
                        </TableCell>
                      ) : null}
                      {layout.map((l, ci) => {
                        const value = getValue(fr.row, l.column)
                        return (
                          <TableCell
                            key={l.column.key}
                            className={cn(
                              cellDensityClass,
                              columnAlign(l.column) === 'right'
                                ? 'text-right'
                                : columnAlign(l.column) === 'center'
                                  ? 'text-center'
                                  : '',
                              pinClass(l),
                              cellClassFor(l, fr.row, value),
                            )}
                            style={{
                              ...pinStyle(l),
                              ...(ci === 0 && fr.depth ? { paddingLeft: `${12 + fr.depth * 16}px` } : {}),
                            }}
                          >
                            {renderCell?.[l.column.key]?.({ row: fr.row, value, column: l.column }) ?? (
                              <DataExplorerCell
                                column={l.column}
                                row={fr.row}
                                value={value}
                                actions={l.column.type === 'actions' && rowActions ? rowActions(fr.row) : []}
                                editable={!!l.column.editable}
                                onEdit={(v) => handleCellEdit(fr.row, l.column, v)}
                              />
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>

                    {/* Expanded panel: full-width, inset, default is the record as key/values. */}
                    {expandable && expanded.has(fr.key) ? (
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={colCount} className="p-0 whitespace-normal">
                          <div className="border-l-border/60 border-l-2 px-4 py-3">
                            {renderExpanded?.(fr.row) ?? (
                              <dl className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                                {columns
                                  .filter((c) => c.type !== 'actions')
                                  .map((c) => (
                                    <DataExplorerDetailRow
                                      key={c.key}
                                      label={c.label}
                                      value={getValue(fr.row, c)}
                                      hover={false}
                                    >
                                      {formatCell(c, getValue(fr.row, c), fr.row)}
                                    </DataExplorerDetailRow>
                                  ))}
                              </dl>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </React.Fragment>
                )
              })
            : null}
        </React.Fragment>
      ))}

      {windowState.padBottom > 0 ? (
        <tr aria-hidden="true">
          <td colSpan={colCount} className="p-0" style={{ height: `${windowState.padBottom}px` }} />
        </tr>
      ) : null}

      {/* Infinite: the tail row says what is happening at the bottom. */}
      {pagination === 'infinite' && visibleRows.length ? (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={colCount} className="text-muted-foreground py-2 text-center text-xs">
            {serverLoadingMore ? (
              <span className="inline-flex items-center gap-2" role="status">
                <Loader className="size-3.5 animate-spin" aria-hidden="true" />
                Loading more…
              </span>
            ) : hasMore ? (
              <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={loadMore}>
                Load more
              </Button>
            ) : (
              <span>All {total.toLocaleString()} rows loaded</span>
            )}
          </TableCell>
        </TableRow>
      ) : null}

      {visibleRows.length === 0 ? (
        <TableEmpty colSpan={colCount}>
          {renderEmpty?.({ filtered: hasActiveFilters, reset: resetFilters }) ?? (
            // Two empty states: "nothing here" invites, "nothing
            // matches" offers the way back.
            <EmptyState
              icon={(hasActiveFilters ? SlidersHorizontal : Workflow) as unknown as EmptyIcon}
              title={hasActiveFilters ? 'No rows match these filters' : emptyTitle}
              description={hasActiveFilters ? 'Try widening the search or clearing a column filter.' : emptyDescription}
              className="py-2 whitespace-normal"
            >
              {hasActiveFilters ? (
                <Button variant="outline" size="xs" className="mt-3" onClick={resetFilters}>
                  Reset filters
                </Button>
              ) : null}
            </EmptyState>
          )}
        </TableEmpty>
      ) : null}
    </TableBody>
  )

  return (
    <TooltipProvider delayDuration={400}>
      <div
        ref={rootEl}
        data-slot="data-explorer"
        className={cn('flex min-h-0 flex-col', className)}
        style={{ '--explorer-min-w': `${totalWidth}px` } as React.CSSProperties}
      >
        <Card
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-hidden',
            isFullscreen ? 'bg-background fixed inset-0 z-50 rounded-none' : '',
          )}
        >
          {/* Toolbar. Left: the slice (search, facets, reset). Right: the
              chrome (columns, density, export, fullscreen). Everything is h-7. */}
          {toolbar ? (
            <CardHeader className="flex shrink-0 flex-row flex-wrap items-center justify-between gap-3 border-b p-3">
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {toolbarStart}
                {searchable ? (
                  <div className="max-w-xs min-w-56 flex-1">
                    <Input
                      ref={searchInputRef}
                      value={search}
                      onChange={(e) => updateSearch(e.target.value)}
                      size="small"
                      className="h-7"
                      prefixIcon={<Search className="size-4" aria-hidden="true" />}
                      allowClear
                      maxLength={64}
                      aria-label="Search rows"
                      placeholder={searchPlaceholder}
                      onKeyDown={(e) => {
                        if (e.key !== 'Escape') return
                        if (search) updateSearch('')
                        else focusSearch()
                      }}
                      // The `/` shortcut, shown while the field is empty; once
                      // there is a value the clear control owns this corner.
                      suffix={!search ? <Kbd className="h-4 min-w-4 px-1">/</Kbd> : undefined}
                    />
                  </div>
                ) : null}

                {facetColumnDef ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="xs">
                        <Filter className="size-3.5" aria-hidden="true" />
                        {facetColumnDef.label}
                        {facetValue ? (
                          <Badge variant="secondary" className="ml-0.5 px-1.5 py-0">
                            1
                          </Badge>
                        ) : null}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="max-h-72 w-64 overflow-y-auto p-1">
                      {facets.map((f) => (
                        <Button
                          key={f.value}
                          variant="ghost"
                          size="xs"
                          aria-pressed={facetValue === f.value}
                          className="w-full justify-between"
                          onClick={() => setFacetValue(facetValue === f.value ? '' : f.value)}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span
                              className={cn('size-1.5 shrink-0 rounded-full', facetDot(f.value))}
                              aria-hidden="true"
                            />
                            <span className="truncate">{facetLabel(f.value)}</span>
                          </span>
                          <span className="text-muted-foreground flex shrink-0 items-center gap-1.5 tabular-nums">
                            {f.count.toLocaleString()}
                            {facetValue === f.value ? <Check className="size-3" aria-hidden="true" /> : null}
                          </span>
                        </Button>
                      ))}
                      {!facets.length ? <p className="text-muted-foreground px-2 py-1.5 text-xs">No values</p> : null}
                      <Separator className="my-1" />
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-muted-foreground w-full justify-start"
                        onClick={() => setFacetValue('')}
                      >
                        Clear
                      </Button>
                    </PopoverContent>
                  </Popover>
                ) : null}

                {groupBy && groupColumn ? (
                  <Button variant="outline" size="xs" onClick={() => setGroupBy(null)}>
                    <Layers className="text-muted-foreground size-3.5" aria-hidden="true" />
                    {groupColumn.label}
                    <X className="text-muted-foreground size-3" aria-hidden="true" />
                  </Button>
                ) : null}

                {hasActiveFilters ? (
                  <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={resetFilters}>
                    <RotateCcw className="size-3" aria-hidden="true" />
                    Reset
                  </Button>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {toolbarEnd}

                {columnsMenu ? (
                  <DataExplorerColumnsMenu
                    columns={columns}
                    order={order}
                    hidden={hidden}
                    pins={effectivePins}
                    onToggle={toggleHidden}
                    onPin={setPin}
                    onMove={moveColumn}
                    onReset={resetColumns}
                  />
                ) : null}

                {densityMenu ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="xs" aria-label="Row density">
                        <Table2 className="text-muted-foreground size-3.5" aria-hidden="true" />
                        <span className="hidden sm:inline">{DENSITY_LABELS[density]}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-36 p-1">
                      <div role="menu" aria-label="Row density" className="space-y-0.5">
                        {DENSITY_MODES.map((mode) => (
                          <Button
                            key={mode}
                            role="menuitemradio"
                            aria-checked={density === mode}
                            variant="ghost"
                            size="xs"
                            className={cn('w-full justify-start', density === mode ? 'bg-accent' : '')}
                            onClick={() => setDensity(mode)}
                          >
                            {density === mode ? <Check className="size-3" aria-hidden="true" /> : null}
                            <span className={density !== mode ? 'pl-4' : ''}>{DENSITY_LABELS[mode]}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : null}

                {exportMenu ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={bodyLoading || !visibleRows.length}
                        aria-busy={bodyLoading}
                      >
                        <Download className="text-muted-foreground size-3.5" aria-hidden="true" />
                        Export
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48 p-1">
                      <div className="space-y-0.5">
                        {EXPORT_FORMATS.map((f) => (
                          <Button
                            key={f.id}
                            variant="ghost"
                            size="xs"
                            className="w-full justify-start"
                            onClick={() => exportRows(f)}
                          >
                            <Download className="text-muted-foreground size-3" aria-hidden="true" />
                            {f.label}
                          </Button>
                        ))}
                      </div>
                      <p className="text-muted-foreground px-2.5 pt-1.5 pb-1 text-xs">
                        {selectedRows.length
                          ? `Exports the ${selectedRows.length} selected rows.`
                          : 'Exports the rows on screen.'}
                      </p>
                    </PopoverContent>
                  </Popover>
                ) : null}

                {fullscreenToggle ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Maximize2 className="size-3.5" aria-hidden="true" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}</TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            </CardHeader>
          ) : null}

          {/* Active filters, spelled out: a table that is quietly filtered is a
              table people misread. Each chip removes its own rule. */}
          {filterChips && (filters.length || facetValue) ? (
            <div
              className="flex shrink-0 flex-wrap items-center gap-1.5 border-b px-3 py-1.5 text-xs"
              role="region"
              aria-label="Active filters"
            >
              <span className="text-muted-foreground">Filtered by</span>
              {facetValue && facetColumnDef ? (
                <Badge variant="outline" className="gap-1 pr-0.5">
                  <span className={cn('size-1.5 shrink-0 rounded-full', facetDot(facetValue))} aria-hidden="true" />
                  <span className="truncate">
                    {facetColumnDef.label} is {facetLabel(facetValue)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-2xs"
                    className="size-4"
                    aria-label={`Remove ${facetColumnDef.label} filter`}
                    onClick={() => setFacetValue('')}
                  >
                    <X className="size-2.5" aria-hidden="true" />
                  </Button>
                </Badge>
              ) : null}
              {filters.map((f) => (
                <Badge key={f.column} variant="outline" className="gap-1 pr-0.5">
                  <span className="truncate">{filterChipLabel(f)}</span>
                  <Button
                    variant="ghost"
                    size="icon-2xs"
                    className="size-4"
                    aria-label={`Remove ${filterChipLabel(f)}`}
                    onClick={() => setFilter(f.column, null)}
                  >
                    <X className="size-2.5" aria-hidden="true" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : null}

          {/* Bulk bar: appears with the first selected row, in place, so the
              toolbar never jumps. */}
          {selectable && selectedCount ? (
            <div
              className="bg-muted/40 flex shrink-0 flex-wrap items-center gap-3 border-b px-3 py-1.5 text-xs"
              role="status"
              aria-live="polite"
            >
              <span className="font-medium tabular-nums">{selectedCount.toLocaleString()} selected</span>
              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {renderBulkActions?.({ rows: selectedRows, clear: clearSelection }) ?? (
                  <Button variant="outline" size="xs" onClick={() => exportRows(EXPORT_FORMATS[0]!)}>
                    <Download className="text-muted-foreground size-3" aria-hidden="true" />
                    Export selected
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="xs" className="text-muted-foreground" onClick={clearSelection}>
                <X className="size-3" aria-hidden="true" />
                Clear
              </Button>
            </div>
          ) : null}

          <CardContent className="relative flex min-h-0 flex-1 flex-col p-0" aria-busy={bodyLoading || refetching}>
            {refetching ? (
              <div
                className="bg-primary/60 absolute inset-x-0 top-0 z-20 h-0.5 animate-pulse"
                role="progressbar"
                aria-label="Refreshing rows"
              />
            ) : null}
            {/* The scroller is the flex remainder, not a viewport fraction, and
                it is the Table's own container: a sticky header pins to the
                nearest scroll parent, so an outer wrapper would unpin it. */}
            <Table
              ref={tableRef}
              className={cn(
                'min-w-(--explorer-min-w) table-fixed [&_td]:overflow-hidden',
                refetching ? 'opacity-60 transition-opacity' : '',
              )}
              containerClassName="min-h-0 flex-1"
              aria-rowcount={total}
            >
              <colgroup>
                {selectable ? <col style={{ width: 40 }} /> : null}
                {hasExpandColumn ? <col style={{ width: 40 }} /> : null}
                {layout.map((l) => (
                  <col key={l.column.key} style={{ width: `${l.width}px` }} />
                ))}
              </colgroup>
              {/* Opaque header wash (a primary tint mixed into the card, never an
                  alpha fill: scrolled rows would show through) plus a shadow line
                  in place of border-b, which takes no part in layout. */}
              <TableHeader className="sticky top-0 z-10 bg-[color-mix(in_oklab,var(--primary)_3%,var(--card))] shadow-[0_1px_0_0_var(--border)]">
                {/* Spanning group titles, when any column declares a `group`. */}
                {headerGroups.length ? (
                  <TableRow className="hover:bg-transparent">
                    {selectable ? <TableHead className="h-7" /> : null}
                    {hasExpandColumn ? <TableHead className="h-7" /> : null}
                    {headerGroups.map((g, i) => (
                      <TableHead
                        key={`${g.label}-${i}`}
                        colSpan={g.span}
                        className={cn(
                          'h-7 text-xs font-medium tracking-wide uppercase',
                          g.label ? 'text-muted-foreground border-border/60 border-b text-center' : '',
                        )}
                      >
                        {g.label}
                      </TableHead>
                    ))}
                  </TableRow>
                ) : null}
                <TableRow className="hover:bg-transparent">
                  {selectable ? (
                    <TableHead className="px-2">
                      {selectable !== 'single' ? (
                        <Checkbox
                          checked={allVisibleSelected ? true : someVisibleSelected ? 'indeterminate' : false}
                          size="sm"
                          aria-label="Select all rows on this page"
                          onCheckedChange={(v) => setAllVisible(v === true)}
                        />
                      ) : null}
                    </TableHead>
                  ) : null}
                  {hasExpandColumn ? (
                    <TableHead className="px-2">
                      <span className="sr-only">Expand</span>
                    </TableHead>
                  ) : null}
                  {/* Sort, filter, pin, group and hide live on the cell they act
                      on, so there is no separate bar to keep in step. */}
                  {layout.map((l) => (
                    <TableHead
                      key={l.column.key}
                      className={cn(
                        'group/head relative',
                        columnAlign(l.column) === 'right'
                          ? 'text-right'
                          : columnAlign(l.column) === 'center'
                            ? 'text-center'
                            : '',
                        pinClass(l, true),
                      )}
                      style={pinStyle(l)}
                      aria-sort={isSortable(l.column) ? ariaSortFor(l.column.key) : undefined}
                      onKeyDown={trackShift}
                    >
                      {l.column.type === 'actions' ? (
                        <span className="sr-only">{l.column.label}</span>
                      ) : (
                        <DataExplorerColumnHeader
                          column={l.column}
                          kind={columnKind(l.column)}
                          align={columnAlign(l.column)}
                          sorts={sorts}
                          filter={filterFor(l.column.key)}
                          sortable={isSortable(l.column)}
                          filterable={isFilterable(l.column)}
                          pin={l.pin}
                          hideable={l.column.hideable !== false}
                          groupable={
                            !childrenKey &&
                            (l.column.groupable ??
                              (l.column.type === 'badge' ||
                                l.column.type === 'dot' ||
                                l.column.type === 'avatar' ||
                                l.column.type === 'text' ||
                                !l.column.type))
                          }
                          grouped={groupBy === l.column.key}
                          onSort={(dir) => setSort(l.column.key, dir, shiftHeld.current)}
                          onFilter={(f) => setFilter(l.column.key, f)}
                          onPin={(side) => setPin(l.column.key, side)}
                          onGroup={() => setGroupBy(groupBy === l.column.key ? null : l.column.key)}
                          onHide={() => toggleHidden(l.column.key)}
                        >
                          {renderHeader?.[l.column.key]?.(l.column) ?? l.column.label}
                        </DataExplorerColumnHeader>
                      )}
                      {/* Resize handle: a 6px strip on the column edge; drag to
                          size, double-click to reset. */}
                      {l.column.resizable !== false && l.column.type !== 'actions' ? (
                        <span
                          className="hover:bg-border absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none opacity-0 transition-opacity select-none group-hover/head:opacity-100 focus-visible:opacity-100"
                          role="separator"
                          aria-orientation="vertical"
                          aria-label={`Resize ${l.column.label}`}
                          tabIndex={-1}
                          onPointerDown={(e) => startResize(l, e)}
                          onDoubleClick={(e) => {
                            e.stopPropagation()
                            resetWidth(l.column.key)
                          }}
                        />
                      ) : null}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {bodyLoading ? (
                <TableBody aria-busy="true">
                  {/* Capped: a placeholder only has to fill the viewport. The
                      leading column is wider -- a table's first column is its
                      identifier, so an even grid of bars reads as a spreadsheet. */}
                  {Array.from({ length: Math.min(pageSize, 12) }, (_, k) => k + 1).map((r) => (
                    <TableRow key={`skeleton-${r}`} className="hover:bg-transparent">
                      {selectable ? <TableCell className="py-2" /> : null}
                      {hasExpandColumn ? <TableCell className="py-2" /> : null}
                      {layout.map((l, i) => (
                        <TableCell key={l.column.key} className="py-2">
                          {r === 1 && i === 0 ? (
                            <span role="status" className="sr-only">
                              Loading…
                            </span>
                          ) : null}
                          <Skeleton
                            variant="rounded"
                            className={cn(
                              'h-3',
                              i === 0 ? 'w-36' : 'w-20',
                              columnAlign(l.column) === 'right' ? 'ml-auto' : '',
                            )}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              ) : bodyError ? (
                <TableBody>
                  <TableEmpty colSpan={colCount}>
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="border-destructive/30 bg-destructive/10 text-destructive flex max-w-md items-center gap-3 rounded-md border px-3 py-2 text-xs whitespace-normal"
                    >
                      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1">{bodyError}</span>
                      <Button variant="outline" size="xs" className="text-foreground shrink-0" onClick={retry}>
                        <RotateCw className="size-3" aria-hidden="true" />
                        Retry
                      </Button>
                    </div>
                  </TableEmpty>
                </TableBody>
              ) : (
                // Right-click a row for the same actions as its menu.
                <ContextMenu>
                  <ContextMenuTrigger asChild disabled={!rowActions}>
                    {tableBody}
                  </ContextMenuTrigger>
                  {rowActions ? (
                    <ContextMenuContent className="w-44">
                      {contextActions.map((a) => {
                        const Icon = a.icon as ActionIcon | undefined
                        return (
                          <ContextMenuItem
                            key={a.label}
                            variant={a.variant}
                            disabled={a.disabled}
                            className="text-xs"
                            onSelect={() => contextRow && a.onSelect(contextRow)}
                          >
                            {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
                            {a.label}
                          </ContextMenuItem>
                        )
                      })}
                    </ContextMenuContent>
                  ) : null}
                </ContextMenu>
              )}

              {/* Aggregates: sticky to the bottom of the scroller, over the rows on screen. */}
              {footer && visibleRows.length && !bodyLoading && !bodyError ? (
                <TableFooter className="bg-card sticky bottom-0 z-10 shadow-[0_-1px_0_0_var(--border)]">
                  <TableRow className="hover:bg-transparent">
                    {selectable ? <TableCell className="px-2 py-1.5" /> : null}
                    {hasExpandColumn ? <TableCell className="px-2 py-1.5" /> : null}
                    {layout.map((l, i) => (
                      <TableCell
                        key={l.column.key}
                        className={cn(
                          'py-1.5 text-xs font-medium tabular-nums',
                          columnAlign(l.column) === 'right' ? 'text-right' : '',
                          pinClass(l),
                          i === 0 && !l.column.aggregate ? 'text-muted-foreground font-normal' : '',
                        )}
                        style={pinStyle(l)}
                      >
                        {renderFooter?.[l.column.key]?.({ rows: visibleRows, column: l.column }) ??
                          (l.column.aggregate
                            ? aggregate(l.column, visibleRows)
                            : i === 0
                              ? `${visibleRows.length.toLocaleString()} rows`
                              : '')}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableFooter>
              ) : null}
            </Table>
          </CardContent>

          {pagination !== 'none' || total ? (
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t p-3 text-xs">
              <span className="text-muted-foreground">
                Showing <span className="text-foreground tabular-nums">{rangeLabel}</span> of{' '}
                <span className="text-foreground tabular-nums">{total.toLocaleString()}</span>
                {selectedCount ? (
                  <>
                    {' '}
                    · <span className="text-foreground tabular-nums">{selectedCount.toLocaleString()}</span> selected
                  </>
                ) : null}
              </span>
              {pagination === 'pages' ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Rows per page</span>
                    <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                      <SelectTrigger size="sm" className="h-7 w-16 text-xs" aria-label="Rows per page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pageSizeOptions.map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          aria-label="Previous page"
                          disabled={pageIndex === 0 || bodyLoading}
                          onClick={prevPage}
                        >
                          <ChevronLeft className="size-3.5" aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Previous page</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          aria-label="Next page"
                          disabled={!hasNext || bodyLoading}
                          onClick={nextPage}
                        >
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Next page</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </Card>

        {/* Record detail: sectioned key/value rows in mono, every value one
            click to select and one hover to copy. */}
        <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
          <SheetContent className="w-full! gap-0 overflow-hidden p-0 sm:max-w-xl">
            <SheetHeader className="gap-1 border-b p-5 pr-12">
              <div className="flex min-w-0 items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <Workflow className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                  <SheetTitle className="truncate text-base leading-tight">{detailTitle}</SheetTitle>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button variant="outline" size="xs" onClick={copyLink}>
                    {linkCopied ? (
                      <Check className="text-success size-3" aria-hidden="true" />
                    ) : (
                      <Link2 className="text-muted-foreground size-3" aria-hidden="true" />
                    )}
                    <span role="status">{linkCopied ? 'Copied' : 'Copy link'}</span>
                  </Button>
                  {renderDetailActions?.(detailRow)}
                </div>
              </div>
              <SheetDescription className="truncate font-mono text-xs">{detailSubtitle}</SheetDescription>
            </SheetHeader>

            {detailRow ? (
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {renderDetail?.(detailRow) ?? (
                  <div className="divide-y rounded-lg border">
                    {detailSections.map((section) => (
                      <section key={section.title} className="p-4">
                        <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                          {section.title}
                        </h3>
                        <dl className="space-y-1.5">
                          {section.fields.map((f) => (
                            <DataExplorerDetailRow key={f} label={f} value={detailValue(f)}>
                              {detailText(f)}
                            </DataExplorerDetailRow>
                          ))}
                        </dl>
                      </section>
                    ))}

                    {otherFields.length ? (
                      <section className="p-4">
                        <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                          Other fields
                        </h3>
                        <Button
                          variant="link"
                          size="xs"
                          className="px-0"
                          aria-expanded={showAllFields}
                          onClick={() => setShowAllFields((v) => !v)}
                        >
                          {showAllFields
                            ? `Hide ${otherFields.length} other fields`
                            : `Show ${otherFields.length} other fields`}
                        </Button>
                        {showAllFields ? (
                          <dl className="mt-3 space-y-1.5">
                            {otherFields.map(([k, v]) => (
                              <DataExplorerDetailRow key={k} label={k} value={v} hover={false} />
                            ))}
                          </dl>
                        ) : null}
                      </section>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  )
}
