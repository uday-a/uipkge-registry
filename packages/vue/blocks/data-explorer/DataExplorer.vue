<script setup lang="ts" generic="T extends ExplorerRow">
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
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { EmptyState } from '@/components/ui/empty-state'
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
import DataExplorerCell from './DataExplorerCell.vue'
import DataExplorerColumnHeader from './DataExplorerColumnHeader.vue'
import DataExplorerColumnsMenu from './DataExplorerColumnsMenu.vue'
import DataExplorerDetailRow from './DataExplorerDetailRow.vue'
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
  interpolate,
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
  DEFAULT_LABELS,
  DENSITY_CELL_CLASSES,
  DENSITY_MODES,
  EXPORT_FORMATS,
  LABELS_INJECTION_KEY,
  OPERATOR_LABEL_KEYS,
  TONE_DOT_CLASSES,
  type DensityMode,
  type ExplorerCellEdit,
  type ExplorerColumn,
  type ExplorerDetailSection,
  type ExplorerFacet,
  type ExplorerFilter,
  type ExplorerLabels,
  type ExplorerPersistedState,
  type ExplorerRow,
  type ExplorerRowAction,
  type ExplorerSort,
  type ExplorerSource,
  type ExportFormat,
} from './data-explorer-types'

const props = withDefaults(
  defineProps<{
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
    /** Chevron column; each row can open an `#expanded` panel beneath it. */
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
    /** Override any UI string (see DEFAULT_LABELS); `{name}` placeholders are interpolated. */
    labels?: Partial<ExplorerLabels>
    /** Give the wrapper a height (e.g. `h-[36rem]`) to get a sticky header + internal scroll. */
    class?: string
  }>(),
  {
    columns: undefined,
    rows: undefined,
    source: undefined,
    rowKey: 'id',
    childrenKey: undefined,
    loading: false,
    error: null,
    pagination: 'pages',
    pageSize: 25,
    pageSizeOptions: () => [10, 25, 50, 100],
    virtual: false,
    rowHeight: undefined,
    selectable: false,
    expandable: false,
    groupBy: null,
    density: 'default',
    initialSort: undefined,
    initialFilters: () => [],
    initialSearch: '',
    facetColumn: undefined,
    initialFacet: '',
    searchable: true,
    searchPlaceholder: 'Search…',
    toolbar: true,
    filterChips: true,
    columnsMenu: true,
    densityMenu: true,
    exportMenu: true,
    fullscreenToggle: true,
    footer: false,
    striped: false,
    rowClass: undefined,
    rowActions: undefined,
    detail: true,
    detailSections: undefined,
    emptyTitle: 'Nothing here yet',
    emptyDescription: 'Rows appear here as soon as there is data.',
    persistKey: undefined,
    labels: undefined,
  },
)

const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'rowClick', row: T): void
  (e: 'selectionChange', rows: T[]): void
  (e: 'sortChange', sorts: ExplorerSort[]): void
  (e: 'filterChange', filters: ExplorerFilter[]): void
  (e: 'searchChange', query: string): void
  (e: 'cellEdit', edit: ExplorerCellEdit<T>): void
  (e: 'loadMore'): void
  (e: 'pageChange', page: number): void
}>()

const selectedModel = defineModel<string[]>('selected', { default: () => [] })

const rootEl = ref<HTMLElement | null>(null)

// ── Labels ──────────────────────────────────────────────────────────────

const labels = computed<ExplorerLabels>(() => ({ ...DEFAULT_LABELS, ...props.labels }))
provide(LABELS_INJECTION_KEY, labels)
const t = (key: keyof ExplorerLabels, vars?: Record<string, unknown>) => interpolate(labels.value[key], vars)
const densityLabel = (m: DensityMode) =>
  t(m === 'compact' ? 'densityCompact' : m === 'comfortable' ? 'densityComfortable' : 'densityDefault')

// ── Columns ─────────────────────────────────────────────────────────────

const usingSample = computed(() => !props.columns)

const columns = computed<ExplorerColumn<T>[]>(() => {
  const base = (props.columns ?? (PIPELINE_RUN_COLUMNS as unknown as ExplorerColumn<T>[])).slice()
  if (props.rowActions) {
    base.push({
      key: '__actions',
      label: labels.value.actions,
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
})
const columnByKey = computed(() => new Map(columns.value.map((c) => [c.key, c])))
const knownKeys = computed(() => new Set(columns.value.map((c) => c.key)))

const order = ref<string[]>(columns.value.map((c) => c.key))
const hidden = ref<Set<string>>(new Set(columns.value.filter((c) => c.hidden).map((c) => c.key)))
// User pins. A configured `column.pin` the user removed goes in `unpinned`,
// otherwise the layout would fall back to the config on every render.
const pins = ref<Record<string, 'left' | 'right'>>({})
const unpinned = ref<Set<string>>(new Set())
const widths = ref<Record<string, number>>({})

// A new column set (e.g. a consumer swaps configs) resets the layout state.
watch(
  () => columns.value.map((c) => c.key).join('|'),
  () => resetColumns(),
)

const effectivePins = computed(() => {
  const out: Record<string, 'left' | 'right'> = {}
  for (const c of columns.value) {
    const user = pins.value[c.key]
    if (user) out[c.key] = user
    else if (c.pin && !unpinned.value.has(c.key)) out[c.key] = c.pin
  }
  return out
})

const layout = computed<ColumnLayout<T>[]>(() =>
  layoutColumns(columns.value, {
    order: order.value,
    hidden: hidden.value,
    pins: effectivePins.value,
    widths: widths.value,
  }),
)
// Leading utility columns (select, expand/tree) count towards colspans + min width.
const hasExpandColumn = computed(() => props.expandable || !!props.childrenKey)
const leadingCount = computed(() => (props.selectable ? 1 : 0) + (hasExpandColumn.value ? 1 : 0))
const colCount = computed(() => layout.value.length + leadingCount.value)
const totalWidth = computed(() => layout.value.reduce((s, l) => s + l.width, 0) + leadingCount.value * 40)

// Spanning header row: consecutive visible columns that share a `group`.
const headerGroups = computed(() => {
  const runs: { label: string; span: number }[] = []
  for (const l of layout.value) {
    const label = l.column.group ?? ''
    const last = runs[runs.length - 1]
    if (last && last.label === label) last.span++
    else runs.push({ label, span: 1 })
  }
  return runs.some((r) => r.label) ? runs : []
})

function toggleHidden(key: string) {
  const next = new Set(hidden.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  hidden.value = next
}

function setPin(key: string, side: 'left' | 'right' | null) {
  const nextPins = { ...pins.value }
  const nextUnpinned = new Set(unpinned.value)
  if (side) {
    nextPins[key] = side
    nextUnpinned.delete(key)
  } else {
    delete nextPins[key]
    if (columnByKey.value.get(key)?.pin) nextUnpinned.add(key)
  }
  pins.value = nextPins
  unpinned.value = nextUnpinned
}

function moveColumn(key: string, dir: 'left' | 'right') {
  const visibleOrder = layout.value.map((l) => l.column.key)
  const i = visibleOrder.indexOf(key)
  const j = dir === 'left' ? i - 1 : i + 1
  if (i < 0 || j < 0 || j >= visibleOrder.length) return
  const full = order.value.slice()
  const a = full.indexOf(key)
  const b = full.indexOf(visibleOrder[j]!)
  if (a < 0 || b < 0) return
  full.splice(a, 1)
  full.splice(b, 0, key)
  order.value = full
}

// Drag a header onto another to move the column there.
const dragKey = ref<string | null>(null)
const dragOverKey = ref<string | null>(null)
function onHeaderDragStart(key: string, e: DragEvent) {
  dragKey.value = key
  e.dataTransfer?.setData('text/plain', key)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
function onHeaderDrop(targetKey: string) {
  const key = dragKey.value
  dragKey.value = null
  dragOverKey.value = null
  if (!key || key === targetKey) return
  const full = order.value.slice()
  const from = full.indexOf(key)
  const to = full.indexOf(targetKey)
  if (from < 0 || to < 0) return
  full.splice(from, 1)
  full.splice(to, 0, key)
  order.value = full
}

function resetColumns() {
  order.value = columns.value.map((c) => c.key)
  hidden.value = new Set(columns.value.filter((c) => c.hidden).map((c) => c.key))
  pins.value = {}
  unpinned.value = new Set()
  widths.value = {}
}

// ── Resize ──────────────────────────────────────────────────────────────

let resizing: { key: string; startX: number; startWidth: number; min: number; max: number } | null = null

function startResize(l: ColumnLayout<T>, e: PointerEvent) {
  e.preventDefault()
  e.stopPropagation()
  resizing = {
    key: l.column.key,
    startX: e.clientX,
    startWidth: l.width,
    min: l.column.minWidth ?? 60,
    max: l.column.maxWidth ?? 1200,
  }
  window.addEventListener('pointermove', onResizeMove)
  window.addEventListener('pointerup', endResize, { once: true })
}
function onResizeMove(e: PointerEvent) {
  if (!resizing) return
  const w = Math.min(resizing.max, Math.max(resizing.min, resizing.startWidth + e.clientX - resizing.startX))
  widths.value = { ...widths.value, [resizing.key]: Math.round(w) }
}
function endResize() {
  window.removeEventListener('pointermove', onResizeMove)
  resizing = null
}
function resetWidth(key: string) {
  const next = { ...widths.value }
  delete next[key]
  widths.value = next
}

// ── Slice state: search, facets, column filters, sort ───────────────────

const search = ref(props.initialSearch)
// Debounced so a half-typed query never filters (or hits the server) per keystroke.
const searchApplied = ref(props.initialSearch.trim())
let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, (v) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    searchApplied.value = v.trim()
    emit('searchChange', searchApplied.value)
  }, 250)
})

const searchInputRef = ref<{ $el?: HTMLElement } | null>(null)
function focusSearch() {
  const root = searchInputRef.value?.$el
  const input = root?.tagName?.toLowerCase() === 'input' ? (root as HTMLInputElement) : root?.querySelector('input')
  input?.focus()
}

const facetKey = computed<string | null>(() => {
  if (props.facetColumn !== undefined) return props.facetColumn
  return columns.value.find((c) => c.type === 'badge' || c.type === 'dot')?.key ?? null
})
const facetColumnDef = computed(() => (facetKey.value ? columnByKey.value.get(facetKey.value) : undefined))
const facetValue = ref(props.initialFacet)

const sorts = ref<ExplorerSort[]>(
  props.initialSort
    ? Array.isArray(props.initialSort)
      ? [...props.initialSort]
      : [props.initialSort]
    : usingSample.value
      ? [{ key: 'startedAt', dir: 'desc' }]
      : [],
)
const filters = ref<ExplorerFilter[]>([...props.initialFilters])

function filterFor(key: string) {
  return filters.value.find((f) => f.column === key)
}

// One filter per column: re-filtering a column replaces its rule rather than
// stacking a second one the header could not then represent.
function setFilter(key: string, filter: ExplorerFilter | null) {
  const rest = filters.value.filter((f) => f.column !== key)
  filters.value = filter ? [...rest, { ...filter, column: key }] : rest
  emit('filterChange', filters.value)
}

function filterChipLabel(f: ExplorerFilter) {
  const column = columnByKey.value.get(f.column)
  const value = f.operator === 'empty' ? '' : ` ${f.value}`
  return `${column?.label ?? f.column} ${labels.value[OPERATOR_LABEL_KEYS[f.operator]]}${value}`
}

/** Plain click replaces the sort; shift-click appends (or flips) for multi-sort. */
function setSort(key: string, dir: 'asc' | 'desc' | null, additive = false) {
  const rest = sorts.value.filter((s) => s.key !== key)
  if (!dir) sorts.value = rest
  else if (additive) sorts.value = [...rest, { key, dir }]
  else sorts.value = [{ key, dir }]
  emit('sortChange', sorts.value)
}

// Shift held while a header menu's sort option is chosen makes it additive.
const shiftHeld = ref(false)
function trackShift(e: KeyboardEvent | MouseEvent) {
  shiftHeld.value = e.shiftKey
}

function ariaSortFor(key: string): 'ascending' | 'descending' | 'none' {
  const s = sorts.value.find((x) => x.key === key)
  if (!s) return 'none'
  return s.dir === 'asc' ? 'ascending' : 'descending'
}

const hasActiveFilters = computed(() => !!(searchApplied.value || facetValue.value || filters.value.length))

function resetFilters() {
  search.value = ''
  searchApplied.value = ''
  facetValue.value = ''
  filters.value = []
  emit('filterChange', filters.value)
}

// ── Grouping ────────────────────────────────────────────────────────────

const groupBy = ref<string | null>(props.groupBy)
watch(
  () => props.groupBy,
  (v) => (groupBy.value = v),
)
// Tree rows and group headers are both hierarchies; the tree wins.
const groupColumn = computed(() =>
  groupBy.value && !props.childrenKey ? columnByKey.value.get(groupBy.value) : undefined,
)
const collapsed = ref<Set<string>>(new Set())
function toggleGroup(key: string) {
  const next = new Set(collapsed.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  collapsed.value = next
}

// ── Data: client rows or async source ───────────────────────────────────

const sampleRuns = createSampleRuns()
const clientRows = computed<T[]>(() => props.rows ?? (sampleRuns as unknown as T[]))
const isServer = computed(() => !!props.source)

const queried = computed(() => {
  if (isServer.value) return { rows: [] as T[], facets: [] as ExplorerFacet[] }
  return applyQuery(
    clientRows.value,
    {
      search: searchApplied.value,
      filters: filters.value,
      sort: sorts.value,
      facet: facetValue.value && facetKey.value ? { column: facetKey.value, value: facetValue.value } : null,
    },
    columns.value,
    facetKey.value,
  )
})

// Server state. `serverRows` is the current page (pages mode) or the
// accumulated list (infinite mode).
const serverRows = shallowRef<T[]>([])
const serverTotal = ref<number | null>(null)
const serverFacets = ref<ExplorerFacet[]>([])
const serverLoading = ref(!!props.source)
const serverLoadingMore = ref(false)
const serverError = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
// Monotonic token so a slow earlier response can't overwrite a newer slice.
let requestId = 0

async function fetchServer(mode: 'replace' | 'append') {
  if (!props.source) return
  const id = ++requestId
  if (mode === 'replace') serverLoading.value = true
  else serverLoadingMore.value = true
  serverError.value = null
  try {
    const res = await props.source({
      search: searchApplied.value,
      filters: filters.value,
      sort: sorts.value,
      facet: facetValue.value && facetKey.value ? { column: facetKey.value, value: facetValue.value } : null,
      page: pageIndex.value,
      pageSize: pageSize.value,
      cursor: mode === 'append' ? nextCursor.value : null,
    })
    if (id !== requestId) return
    serverRows.value = mode === 'append' ? [...serverRows.value, ...res.rows] : res.rows
    serverTotal.value = res.total ?? null
    nextCursor.value = res.nextCursor ?? null
    if (res.facets) serverFacets.value = res.facets
  } catch (err) {
    if (id !== requestId) return
    serverError.value = err instanceof Error ? err.message : String(err)
  } finally {
    if (id === requestId) {
      serverLoading.value = false
      serverLoadingMore.value = false
    }
  }
}

const facets = computed(() => (isServer.value ? serverFacets.value : queried.value.facets))

// ── Pagination ──────────────────────────────────────────────────────────

const pageSize = ref(props.pageSize)
const pageSizeOptions = computed(() => [...new Set([...props.pageSizeOptions, props.pageSize])].sort((a, b) => a - b))
const pageIndex = ref(0)
// Infinite mode (client): how many pages are unrolled.
const loadedPages = ref(1)

const total = computed(() =>
  isServer.value ? (serverTotal.value ?? serverRows.value.length) : queried.value.rows.length,
)

const visibleRows = computed<T[]>(() => {
  if (isServer.value) return serverRows.value
  if (props.pagination === 'none') return queried.value.rows
  if (props.pagination === 'infinite') return queried.value.rows.slice(0, loadedPages.value * pageSize.value)
  return paginate(queried.value.rows, pageIndex.value, pageSize.value)
})

const hasMore = computed(() => {
  if (props.pagination !== 'infinite') return false
  if (isServer.value) return !!nextCursor.value
  return visibleRows.value.length < total.value
})
const hasNext = computed(() =>
  isServer.value && serverTotal.value === null
    ? serverRows.value.length >= pageSize.value
    : (pageIndex.value + 1) * pageSize.value < total.value,
)

const rangeLabel = computed(() => {
  if (!visibleRows.value.length) return '0'
  if (props.pagination !== 'pages') return `1–${visibleRows.value.length}`
  const start = pageIndex.value * pageSize.value + 1
  return `${start}–${start + visibleRows.value.length - 1}`
})

function nextPage() {
  if (!hasNext.value) return
  pageIndex.value++
  emit('pageChange', pageIndex.value)
}
function prevPage() {
  if (pageIndex.value === 0) return
  pageIndex.value--
  emit('pageChange', pageIndex.value)
}

// One page per frame: a scroll burst at the bottom must not unroll five.
let loadMoreArmed = true
function loadMore() {
  if (!hasMore.value || serverLoadingMore.value || !loadMoreArmed) return
  loadMoreArmed = false
  requestAnimationFrame(() => (loadMoreArmed = true))
  emit('loadMore')
  if (isServer.value) fetchServer('append')
  else loadedPages.value++
}

// Any change to the slice or its ordering returns to the first page -- a page
// index is a position in one specific ordering of one specific filter set.
watch([searchApplied, facetValue, pageSize, sorts, filters, clientRows], () => {
  pageIndex.value = 0
  loadedPages.value = 1
  if (isServer.value) fetchServer('replace')
})
watch(pageIndex, () => {
  if (isServer.value && props.pagination === 'pages') fetchServer('replace')
})
watch(
  () => props.source,
  () => {
    pageIndex.value = 0
    if (isServer.value) fetchServer('replace')
  },
)

// ── Density (declared before the row pipeline that watches it) ──────────

const density = ref<DensityMode>(props.density)
watch(
  () => props.density,
  (v) => (density.value = v),
)
const cellDensityClass = computed(() => DENSITY_CELL_CLASSES[density.value])

// ── Rows to render: tree flattening, grouping, windowing ────────────────

const keyOf = (row: T, i = 0) => rowKeyOf(row, props.rowKey, i)

// Tree expansion (children) is separate from panel expansion (`#expanded`).
const treeExpanded = ref<Set<string>>(new Set())
function toggleTree(key: string) {
  const next = new Set(treeExpanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  treeExpanded.value = next
}

const flatRows = computed<FlatRow<T>[]>(() =>
  flattenTree(visibleRows.value, props.childrenKey ?? null, treeExpanded.value, keyOf),
)

const displayGroups = computed(() => {
  if (!groupColumn.value) return null
  return groupRows(visibleRows.value, groupColumn.value).map((g) => ({
    ...g,
    flat: flattenTree(g.rows, null, treeExpanded.value, keyOf),
  }))
})

const scroller = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(0)
const measuredRowHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

const effectiveRowHeight = computed(() => props.rowHeight ?? measuredRowHeight.value ?? 0)
const virtualActive = computed(() => props.virtual && !groupColumn.value && !props.expandable)
const windowState = computed(() =>
  virtualActive.value && effectiveRowHeight.value > 0
    ? computeWindow(scrollTop.value, viewportHeight.value, effectiveRowHeight.value, flatRows.value.length)
    : { start: 0, end: flatRows.value.length, padTop: 0, padBottom: 0 },
)
const windowRows = computed(() => flatRows.value.slice(windowState.value.start, windowState.value.end))

function onScroll(e: Event) {
  const el = e.target as HTMLElement
  scrollTop.value = el.scrollTop
  if (props.pagination === 'infinite' && el.scrollTop + el.clientHeight >= el.scrollHeight - 200) loadMore()
}

async function measureRow() {
  await nextTick()
  const el = scroller.value
  if (!el) return
  viewportHeight.value = el.clientHeight
  if (props.rowHeight) return
  const first = el.querySelector<HTMLElement>('tbody tr[data-row]')
  if (first) measuredRowHeight.value = first.getBoundingClientRect().height
}

// The Table primitive's root IS the scroll container; grab it after mount.
const tableRoot = ref<{ $el?: HTMLElement } | null>(null)
function bindScroller() {
  const root = tableRoot.value?.$el as HTMLElement | undefined
  const el = root?.matches?.('[data-slot="table-container"]')
    ? root
    : (root?.querySelector<HTMLElement>('[data-slot="table-container"]') ?? null)
  if (el === scroller.value) return
  scroller.value?.removeEventListener('scroll', onScroll)
  scroller.value = el
  el?.addEventListener('scroll', onScroll, { passive: true })
  if (el && typeof ResizeObserver !== 'undefined') {
    resizeObserver?.disconnect()
    resizeObserver = new ResizeObserver(() => {
      viewportHeight.value = el.clientHeight
    })
    resizeObserver.observe(el)
  }
}

watch([visibleRows, density, () => props.virtual], () => measureRow(), { flush: 'post' })

// `aria-rowcount` belongs on the <table>, which the Table primitive owns.
watch(
  [total, () => tableRoot.value],
  () => {
    const table = (tableRoot.value?.$el as HTMLElement | undefined)?.querySelector('table')
    table?.setAttribute('aria-rowcount', String(total.value))
  },
  { flush: 'post' },
)

// ── Selection ───────────────────────────────────────────────────────────

const selected = computed(() => new Set(selectedModel.value))
const selectedCount = computed(() => selected.value.size)

function setSelected(next: Set<string>) {
  selectedModel.value = [...next]
  const all = isServer.value ? serverRows.value : clientRows.value
  emit(
    'selectionChange',
    all.filter((r, i) => next.has(keyOf(r, i))),
  )
}

// Shift-click on a checkbox selects the range back to the last toggled row.
let lastToggledIndex: number | null = null
let shiftClick = false
function rememberShift(e: MouseEvent) {
  shiftClick = e.shiftKey
}

/** Sets (never toggles) so a control that reports its state twice stays idempotent. */
function setRowSelected(fr: FlatRow<T>, on: boolean) {
  if (selected.value.has(fr.key) === on && !shiftClick) return
  const next = props.selectable === 'single' ? new Set<string>() : new Set(selected.value)
  const apply = (k: string) => (on ? next.add(k) : next.delete(k))
  if (shiftClick && lastToggledIndex !== null && props.selectable !== 'single') {
    const [a, b] = [lastToggledIndex, fr.index].sort((x, y) => x - y)
    for (const other of flatRows.value.slice(a, b + 1)) apply(other.key)
  } else {
    apply(fr.key)
  }
  shiftClick = false
  lastToggledIndex = fr.index
  setSelected(next)
}
function toggleRow(fr: FlatRow<T>) {
  setRowSelected(fr, !selected.value.has(fr.key))
}
const allVisibleSelected = computed(
  () => flatRows.value.length > 0 && flatRows.value.every((fr) => selected.value.has(fr.key)),
)
const someVisibleSelected = computed(() => flatRows.value.some((fr) => selected.value.has(fr.key)))
function setAllVisible(on: boolean) {
  const next = new Set(selected.value)
  for (const fr of flatRows.value) {
    if (on) next.add(fr.key)
    else next.delete(fr.key)
  }
  setSelected(next)
}
const selectedRows = computed(() => {
  const all = isServer.value ? serverRows.value : clientRows.value
  return all.filter((r, i) => selected.value.has(keyOf(r, i)))
})
function clearSelection() {
  lastToggledIndex = null
  setSelected(new Set())
}

// ── Expansion ───────────────────────────────────────────────────────────

const expanded = ref<Set<string>>(new Set())
function toggleExpanded(key: string) {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

// ── Context menu ────────────────────────────────────────────────────────

const contextRow = ref<T | null>(null)
function onContextMenu(e: MouseEvent) {
  const tr = (e.target as HTMLElement).closest<HTMLElement>('tr[data-row]')
  const key = tr?.dataset.key
  contextRow.value = key ? (flatRows.value.find((fr) => fr.key === key)?.row ?? null) : null
}
const contextActions = computed(() => (contextRow.value && props.rowActions ? props.rowActions(contextRow.value) : []))

function onContextActionSelect(a: ExplorerRowAction<T>) {
  if (contextRow.value) a.onSelect(contextRow.value)
}

// ── Table chrome: density, fullscreen, keyboard ─────────────────────────

const isFullscreen = ref(false)
function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

/** The instance the user is working in: contains focus, or is under the pointer. */
function isActiveInstance() {
  const root = rootEl.value
  if (!root) return false
  return root.contains(document.activeElement) || root.matches(':hover')
}

function handleKeydown(e: KeyboardEvent) {
  shiftHeld.value = e.shiftKey
  // Escape leaves fullscreen from anywhere; focus may be in a cell, a
  // popover, or nowhere at all, which is why this listens on window.
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
    return
  }
  if (e.key === '/' && props.searchable && !e.metaKey && !e.ctrlKey && !e.altKey && isActiveInstance()) {
    const active = document.activeElement as HTMLElement | null
    const tag = active?.tagName?.toLowerCase()
    if (tag === 'input' || tag === 'textarea' || active?.isContentEditable) return
    e.preventDefault()
    focusSearch()
  }
}
function handleKeyup(e: KeyboardEvent) {
  shiftHeld.value = e.shiftKey
}

/** Arrow keys walk the rows; Enter opens; Space toggles selection; ⌘/Ctrl+A selects all; Esc clears. */
function onRowKeydown(e: KeyboardEvent, fr: FlatRow<T>) {
  const tr = e.currentTarget as HTMLElement
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
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a' && props.selectable && props.selectable !== 'single') {
    e.preventDefault()
    setAllVisible(true)
    return
  }
  if (e.key === 'Escape' && selectedCount.value) {
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
    if (props.selectable) toggleRow(fr)
    else activateRow(fr)
  }
}

function activateRow(fr: FlatRow<T>) {
  emit('rowClick', fr.row)
  if (props.detail) openDetail(fr.row)
  else if (props.expandable) toggleExpanded(fr.key)
  else if (fr.hasChildren) toggleTree(fr.key)
}

// ── Persistence ─────────────────────────────────────────────────────────

const storageKey = computed(() => (props.persistKey ? `${PERSIST_PREFIX}${props.persistKey}` : null))
let restoring = false

function restoreState() {
  if (!storageKey.value || typeof localStorage === 'undefined') return
  restoring = true
  try {
    const s = parsePersisted(localStorage.getItem(storageKey.value), knownKeys.value)
    if (s.sort) sorts.value = s.sort
    if (s.filters) filters.value = s.filters
    if (s.hidden) hidden.value = new Set(s.hidden)
    if (s.order?.length) order.value = [...s.order, ...order.value.filter((k) => !s.order!.includes(k))]
    if (s.pins) pins.value = s.pins
    if (s.unpinned) unpinned.value = new Set(s.unpinned)
    if (s.widths) widths.value = s.widths
    if (s.density) density.value = s.density
    if (s.pageSize) pageSize.value = s.pageSize
    if (s.groupBy !== undefined) groupBy.value = s.groupBy
  } catch {
    // Storage blocked -- run without persistence.
  } finally {
    restoring = false
  }
}

function saveState() {
  if (!storageKey.value || restoring || typeof localStorage === 'undefined') return
  const state: ExplorerPersistedState = {
    sort: sorts.value,
    filters: filters.value,
    hidden: [...hidden.value],
    order: order.value,
    pins: pins.value,
    unpinned: [...unpinned.value],
    widths: widths.value,
    density: density.value,
    pageSize: pageSize.value,
    groupBy: groupBy.value,
  }
  try {
    localStorage.setItem(storageKey.value, JSON.stringify(state))
  } catch {
    // Quota / private mode -- fail quietly.
  }
}

watch([sorts, filters, hidden, order, pins, unpinned, widths, density, pageSize, groupBy], saveState, { deep: true })

// ── Lifecycle ───────────────────────────────────────────────────────────

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)
  restoreState()
  bindScroller()
  measureRow()
  if (isServer.value) fetchServer('replace')
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
  window.removeEventListener('pointermove', onResizeMove)
  scroller.value?.removeEventListener('scroll', onScroll)
  resizeObserver?.disconnect()
  if (searchTimer) clearTimeout(searchTimer)
  if (linkTimer) clearTimeout(linkTimer)
})

// ── Export ──────────────────────────────────────────────────────────────

const exportRowsSet = computed(() => (selectedRows.value.length ? selectedRows.value : visibleRows.value))
function exportRows(format: ExportFormat) {
  const stamp = new Date().toISOString().slice(0, 10)
  const exportColumns = layout.value.map((l) => l.column)
  downloadText(
    renderExport(exportRowsSet.value, exportColumns, format.id),
    `export_${stamp}.${format.ext}`,
    format.mime,
  )
}

// ── Cell helpers ────────────────────────────────────────────────────────

function cellClassFor(l: ColumnLayout<T>, row: T, value: unknown): string {
  const c = l.column.cellClass
  const own = typeof c === 'function' ? c(value, row) : (c ?? '')
  return cn(own, l.column.wrap ? 'whitespace-normal' : '')
}

function onCellEdit(row: T, column: ExplorerColumn<T>, value: unknown) {
  const previous = getValue(row, column)
  emit('cellEdit', { row, key: column.key, value, previous })
  // Client rows: apply optimistically when the column maps to a plain field.
  if (!isServer.value && (column.accessor === undefined || typeof column.accessor === 'string')) {
    const field = (column.accessor as string | undefined) ?? column.key
    if (!field.includes('.')) (row as ExplorerRow)[field] = value
  }
}

function pinStyle(l: ColumnLayout<T>) {
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
  const m = facetColumnDef.value?.badgeMap?.[value]
  return TONE_DOT_CLASSES[m?.tone ?? (value ? 'info' : 'muted')]
}
const facetLabel = (value: string) => facetColumnDef.value?.badgeMap?.[value]?.label ?? (value || '—')

// First load shows the skeleton; a refetch over existing rows keeps them and
// shows a progress line instead, so re-sorting never blanks the table.
const bodyLoading = computed(() => props.loading || (isServer.value && serverLoading.value && !serverRows.value.length))
const refetching = computed(() => isServer.value && serverLoading.value && serverRows.value.length > 0)
const bodyError = computed(() => props.error ?? serverError.value)
function retry() {
  emit('retry')
  if (isServer.value) fetchServer('replace')
}

// ── Detail sheet ────────────────────────────────────────────────────────

const detailOpen = ref(false)
const detailRow = ref<T | null>(null)
const showAllFields = ref(false)

function openDetail(row: T) {
  detailRow.value = row
  showAllFields.value = false
  detailOpen.value = true
}

const detailSections = computed<ExplorerDetailSection[]>(() => {
  if (props.detailSections) return props.detailSections
  if (usingSample.value) return PIPELINE_RUN_SECTIONS
  return [{ title: 'Fields', fields: columns.value.filter((c) => c.type !== 'actions').map((c) => c.key) }]
})
const knownDetailFields = computed(() => new Set(detailSections.value.flatMap((s) => s.fields)))
const otherFields = computed<[string, unknown][]>(() => {
  if (!detailRow.value) return []
  return Object.entries(detailRow.value)
    .filter(
      ([k, v]) =>
        !knownDetailFields.value.has(k) &&
        k !== props.childrenKey &&
        v !== null &&
        v !== '' &&
        !(Array.isArray(v) && v.length === 0),
    )
    .sort(([a], [b]) => a.localeCompare(b))
})

function detailValue(field: string): unknown {
  if (!detailRow.value) return null
  const column = columnByKey.value.get(field)
  return column ? getValue(detailRow.value, column) : detailRow.value[field]
}
function detailText(field: string): string {
  if (!detailRow.value) return '—'
  const column = columnByKey.value.get(field)
  const value = detailValue(field)
  return column ? formatCell(column, value, detailRow.value) : fmtValue(value)
}
const detailTitle = computed(() => (detailRow.value ? keyOf(detailRow.value) : t('record')))
const detailSubtitle = computed(() => {
  if (!detailRow.value) return ''
  const first = layout.value[0]?.column
  if (!first?.sub) return ''
  return typeof first.sub === 'function' ? first.sub(detailRow.value) : String(detailRow.value[first.sub] ?? '')
})

const linkCopied = ref(false)
let linkTimer: ReturnType<typeof setTimeout> | null = null
async function copyLink() {
  if (!detailRow.value) return
  const url = `${window.location.origin}${window.location.pathname}?row=${encodeURIComponent(keyOf(detailRow.value))}`
  try {
    await navigator.clipboard.writeText(url)
    linkCopied.value = true
    if (linkTimer) clearTimeout(linkTimer)
    linkTimer = setTimeout(() => (linkCopied.value = false), 1500)
  } catch {
    // Clipboard blocked -- fail quietly.
  }
}

defineExpose({ resetFilters, clearSelection, resetColumns, refetch: () => fetchServer('replace') })
</script>

<template>
  <TooltipProvider :delay-duration="400">
    <div
      ref="rootEl"
      data-slot="data-explorer"
      :class="cn('flex min-h-0 flex-col', props.class)"
      :style="{ '--explorer-min-w': `${totalWidth}px` }"
    >
      <Card
        :class="[
          'flex min-h-0 flex-1 flex-col overflow-hidden',
          isFullscreen ? 'bg-background fixed inset-0 z-50 rounded-none' : '',
        ]"
      >
        <!-- Toolbar. Left: the slice (search, facets, reset). Right: the
             chrome (columns, density, export, fullscreen). Everything is h-7. -->
        <CardHeader
          v-if="toolbar"
          class="flex shrink-0 flex-row flex-wrap items-center justify-between gap-3 border-b p-3"
        >
          <div class="flex flex-1 flex-wrap items-center gap-2">
            <slot name="toolbar-start" />
            <div v-if="searchable" class="max-w-xs min-w-56 flex-1">
              <Input
                ref="searchInputRef"
                v-model="search"
                size="small"
                class="h-7"
                :prefix-icon="Search"
                allow-clear
                maxlength="64"
                :aria-label="t('searchAria')"
                :placeholder="searchPlaceholder"
                @keydown.esc="search ? (search = '') : focusSearch()"
              >
                <template #suffix>
                  <!-- The `/` shortcut, shown while the field is empty; once
                       there is a value the clear control owns this corner. -->
                  <Kbd v-if="!search" class="h-4 min-w-4 px-1">/</Kbd>
                </template>
              </Input>
            </div>

            <Popover v-if="facetColumnDef">
              <PopoverTrigger as-child>
                <Button variant="outline" size="xs">
                  <Filter class="size-3.5" aria-hidden="true" />
                  {{ facetColumnDef.label }}
                  <Badge v-if="facetValue" variant="secondary" class="ml-0.5 px-1.5 py-0">1</Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" class="max-h-72 w-64 overflow-y-auto p-1">
                <Button
                  v-for="f in facets"
                  :key="f.value"
                  variant="ghost"
                  size="xs"
                  :aria-pressed="facetValue === f.value"
                  class="w-full justify-between"
                  @click="facetValue = facetValue === f.value ? '' : f.value"
                >
                  <span class="flex min-w-0 items-center gap-2">
                    <span :class="cn('size-1.5 shrink-0 rounded-full', facetDot(f.value))" aria-hidden="true" />
                    <span class="truncate">{{ facetLabel(f.value) }}</span>
                  </span>
                  <span class="text-muted-foreground flex shrink-0 items-center gap-1.5 tabular-nums">
                    {{ f.count.toLocaleString() }}
                    <Check v-if="facetValue === f.value" class="size-3" aria-hidden="true" />
                  </span>
                </Button>
                <p v-if="!facets.length" class="text-muted-foreground px-2 py-1.5 text-xs">{{ t('noValues') }}</p>
                <Separator class="my-1" />
                <Button
                  variant="ghost"
                  size="xs"
                  class="text-muted-foreground w-full justify-start"
                  @click="facetValue = ''"
                >
                  {{ t('clear') }}
                </Button>
              </PopoverContent>
            </Popover>

            <Button v-if="groupBy && groupColumn" variant="outline" size="xs" @click="groupBy = null">
              <Layers class="text-muted-foreground size-3.5" aria-hidden="true" />
              {{ groupColumn.label }}
              <X class="text-muted-foreground size-3" aria-hidden="true" />
            </Button>

            <Button
              v-if="hasActiveFilters"
              variant="ghost"
              size="xs"
              class="text-muted-foreground"
              @click="resetFilters"
            >
              <RotateCcw class="size-3" aria-hidden="true" />
              {{ t('reset') }}
            </Button>
          </div>

          <div class="flex shrink-0 items-center gap-1.5">
            <slot name="toolbar-end" />

            <DataExplorerColumnsMenu
              v-if="columnsMenu"
              :columns="columns"
              :order="order"
              :hidden="hidden"
              :pins="effectivePins"
              @toggle="toggleHidden"
              @pin="setPin"
              @move="moveColumn"
              @reset="resetColumns"
            />

            <Popover v-if="densityMenu">
              <PopoverTrigger as-child>
                <Button variant="outline" size="xs" :aria-label="t('rowDensity')">
                  <Table2 class="text-muted-foreground size-3.5" aria-hidden="true" />
                  <span class="hidden sm:inline">{{ densityLabel(density) }}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" class="w-36 p-1">
                <div role="menu" :aria-label="t('rowDensity')" class="space-y-0.5">
                  <Button
                    v-for="mode in DENSITY_MODES"
                    :key="mode"
                    role="menuitemradio"
                    :aria-checked="density === mode"
                    variant="ghost"
                    size="xs"
                    :class="['w-full justify-start', density === mode ? 'bg-accent' : '']"
                    @click="density = mode"
                  >
                    <Check v-if="density === mode" class="size-3" aria-hidden="true" />
                    <span :class="density !== mode ? 'pl-4' : ''">{{ densityLabel(mode) }}</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Popover v-if="exportMenu">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  size="xs"
                  :disabled="bodyLoading || !visibleRows.length"
                  :aria-busy="bodyLoading"
                >
                  <Download class="text-muted-foreground size-3.5" aria-hidden="true" />
                  {{ t('export') }}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" class="w-48 p-1">
                <div class="space-y-0.5">
                  <Button
                    v-for="f in EXPORT_FORMATS"
                    :key="f.id"
                    variant="ghost"
                    size="xs"
                    class="w-full justify-start"
                    @click="exportRows(f)"
                  >
                    <Download class="text-muted-foreground size-3" aria-hidden="true" />
                    {{ f.label }}
                  </Button>
                </div>
                <p class="text-muted-foreground px-2.5 pt-1.5 pb-1 text-xs">
                  {{ selectedRows.length ? t('exportsSelected', { count: selectedRows.length }) : t('exportsVisible') }}
                </p>
              </PopoverContent>
            </Popover>

            <Tooltip v-if="fullscreenToggle">
              <TooltipTrigger as-child>
                <Button
                  variant="outline"
                  size="icon-xs"
                  :aria-label="isFullscreen ? t('exitFullscreen') : t('fullscreen')"
                  @click="toggleFullscreen"
                >
                  <Minimize2 v-if="isFullscreen" class="size-3.5" aria-hidden="true" />
                  <Maximize2 v-else class="size-3.5" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{{ isFullscreen ? t('exitFullscreenHint') : t('fullscreen') }}</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <!-- Active filters, spelled out: a table that is quietly filtered is a
             table people misread. Each chip removes its own rule. -->
        <div
          v-if="filterChips && (filters.length || facetValue)"
          class="flex shrink-0 flex-wrap items-center gap-1.5 border-b px-3 py-1.5 text-xs"
          role="region"
          :aria-label="t('activeFilters')"
        >
          <span class="text-muted-foreground">{{ t('filteredBy') }}</span>
          <Badge v-if="facetValue && facetColumnDef" variant="outline" class="gap-1 pr-0.5">
            <span :class="cn('size-1.5 shrink-0 rounded-full', facetDot(facetValue))" aria-hidden="true" />
            <span class="truncate">{{
              t('facetIs', { label: facetColumnDef.label, value: facetLabel(facetValue) })
            }}</span>
            <Button
              variant="ghost"
              size="icon-2xs"
              class="size-4"
              :aria-label="t('removeFilter', { label: facetColumnDef.label })"
              @click="facetValue = ''"
            >
              <X class="size-2.5" aria-hidden="true" />
            </Button>
          </Badge>
          <Badge v-for="f in filters" :key="f.column" variant="outline" class="gap-1 pr-0.5">
            <span class="truncate">{{ filterChipLabel(f) }}</span>
            <Button
              variant="ghost"
              size="icon-2xs"
              class="size-4"
              :aria-label="t('removeFilter', { label: filterChipLabel(f) })"
              @click="setFilter(f.column, null)"
            >
              <X class="size-2.5" aria-hidden="true" />
            </Button>
          </Badge>
        </div>

        <!-- Bulk bar: appears with the first selected row, in place, so the
             toolbar never jumps. -->
        <div
          v-if="selectable && selectedCount"
          class="bg-muted/40 flex shrink-0 flex-wrap items-center gap-3 border-b px-3 py-1.5 text-xs"
          role="status"
          aria-live="polite"
        >
          <span class="font-medium tabular-nums">{{ t('selected', { count: selectedCount }) }}</span>
          <div class="flex flex-1 flex-wrap items-center gap-1.5">
            <slot name="bulk-actions" :rows="selectedRows" :clear="clearSelection">
              <Button variant="outline" size="xs" @click="exportRows(EXPORT_FORMATS[0]!)">
                <Download class="text-muted-foreground size-3" aria-hidden="true" />
                {{ t('exportSelected') }}
              </Button>
            </slot>
          </div>
          <Button variant="ghost" size="xs" class="text-muted-foreground" @click="clearSelection">
            <X class="size-3" aria-hidden="true" />
            {{ t('clear') }}
          </Button>
        </div>

        <CardContent class="relative flex min-h-0 flex-1 flex-col p-0" :aria-busy="bodyLoading || refetching">
          <div
            v-if="refetching"
            class="bg-primary/60 absolute inset-x-0 top-0 z-20 h-0.5 animate-pulse motion-reduce:animate-none"
            data-slot="data-explorer-refetch"
            role="progressbar"
            :aria-label="t('refreshing')"
          />
          <!-- The scroller is the flex remainder, not a viewport fraction, and
               it is the Table's own container: a sticky header pins to the
               nearest scroll parent, so an outer wrapper would unpin it. -->
          <Table
            ref="tableRoot"
            :class="
              cn(
                'min-w-(--explorer-min-w) table-fixed [&_td]:overflow-hidden',
                refetching ? 'opacity-60 transition-opacity' : '',
              )
            "
            container-class="min-h-0 flex-1"
          >
            <colgroup>
              <col v-if="selectable" style="width: 40px" />
              <col v-if="hasExpandColumn" style="width: 40px" />
              <col v-for="l in layout" :key="l.column.key" :style="{ width: `${l.width}px` }" />
            </colgroup>
            <!-- Opaque header wash (a primary tint mixed into the card, never an
                 alpha fill: scrolled rows would show through) plus a shadow line
                 in place of border-b, which takes no part in layout. -->
            <TableHeader
              class="sticky top-0 z-10 bg-[color-mix(in_oklab,var(--primary)_3%,var(--card))] shadow-[0_1px_0_0_var(--border)]"
            >
              <!-- Spanning group titles, when any column declares a `group`. -->
              <TableRow v-if="headerGroups.length" class="hover:bg-transparent">
                <TableHead v-if="selectable" class="h-7" />
                <TableHead v-if="hasExpandColumn" class="h-7" />
                <TableHead
                  v-for="(g, i) in headerGroups"
                  :key="`${g.label}-${i}`"
                  :colspan="g.span"
                  :class="
                    cn(
                      'h-7 text-xs font-medium tracking-wide uppercase',
                      g.label ? 'text-muted-foreground border-border/60 border-b text-center' : '',
                    )
                  "
                >
                  {{ g.label }}
                </TableHead>
              </TableRow>
              <TableRow class="hover:bg-transparent">
                <TableHead v-if="selectable" class="px-2">
                  <Checkbox
                    v-if="selectable !== 'single'"
                    :model-value="allVisibleSelected ? true : someVisibleSelected ? 'indeterminate' : false"
                    size="sm"
                    :aria-label="t('selectAll')"
                    @update:model-value="(v) => setAllVisible(v === true)"
                  />
                </TableHead>
                <TableHead v-if="hasExpandColumn" class="px-2"
                  ><span class="sr-only">{{ t('expand') }}</span></TableHead
                >
                <!-- Sort, filter, pin, group and hide live on the cell they act
                     on, so there is no separate bar to keep in step. -->
                <TableHead
                  v-for="l in layout"
                  :key="l.column.key"
                  :class="
                    cn(
                      'group/head data-[drop-target]:bg-primary/[0.06] relative',
                      columnAlign(l.column) === 'right'
                        ? 'text-right'
                        : columnAlign(l.column) === 'center'
                          ? 'text-center'
                          : '',
                      pinClass(l, true),
                    )
                  "
                  :style="pinStyle(l)"
                  :aria-sort="isSortable(l.column) ? ariaSortFor(l.column.key) : undefined"
                  :draggable="l.column.type !== 'actions'"
                  :data-drop-target="dragOverKey === l.column.key && dragKey !== l.column.key ? '' : undefined"
                  @keydown="trackShift"
                  @dragstart="onHeaderDragStart(l.column.key, $event)"
                  @dragover.prevent="dragOverKey = l.column.key"
                  @dragleave="dragOverKey === l.column.key && (dragOverKey = null)"
                  @drop.prevent="onHeaderDrop(l.column.key)"
                  @dragend="((dragKey = null), (dragOverKey = null))"
                >
                  <span v-if="l.column.type === 'actions'" class="sr-only">{{ l.column.label }}</span>
                  <DataExplorerColumnHeader
                    v-else
                    :column="l.column"
                    :kind="columnKind(l.column)"
                    :align="columnAlign(l.column)"
                    :sorts="sorts"
                    :filter="filterFor(l.column.key)"
                    :sortable="isSortable(l.column)"
                    :filterable="isFilterable(l.column)"
                    :pin="l.pin"
                    :hideable="l.column.hideable !== false"
                    :groupable="
                      !childrenKey &&
                      (l.column.groupable ??
                        (l.column.type === 'badge' ||
                          l.column.type === 'dot' ||
                          l.column.type === 'avatar' ||
                          l.column.type === 'text' ||
                          !l.column.type))
                    "
                    :grouped="groupBy === l.column.key"
                    @sort="(dir) => setSort(l.column.key, dir, shiftHeld)"
                    @filter="(f) => setFilter(l.column.key, f)"
                    @pin="(side) => setPin(l.column.key, side)"
                    @group="groupBy = groupBy === l.column.key ? null : l.column.key"
                    @hide="toggleHidden(l.column.key)"
                  >
                    <slot :name="`header-${l.column.key}`" :column="l.column">{{ l.column.label }}</slot>
                  </DataExplorerColumnHeader>
                  <!-- Resize handle: a 6px strip on the column edge; drag to
                       size, double-click to reset. -->
                  <span
                    v-if="l.column.resizable !== false && l.column.type !== 'actions'"
                    class="hover:bg-border absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none opacity-0 transition-opacity select-none group-hover/head:opacity-100 focus-visible:opacity-100"
                    role="separator"
                    aria-orientation="vertical"
                    :aria-label="t('resize', { label: l.column.label })"
                    tabindex="-1"
                    @pointerdown="startResize(l, $event)"
                    @dblclick.stop="resetWidth(l.column.key)"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody v-if="bodyLoading" aria-busy="true">
              <!-- Capped: a placeholder only has to fill the viewport. The
                   leading column is wider -- a table's first column is its
                   identifier, so an even grid of bars reads as a spreadsheet. -->
              <TableRow v-for="r in Math.min(pageSize, 12)" :key="`skeleton-${r}`" class="hover:bg-transparent">
                <TableCell v-if="selectable" class="py-2" />
                <TableCell v-if="hasExpandColumn" class="py-2" />
                <TableCell v-for="(l, i) in layout" :key="l.column.key" class="py-2">
                  <span v-if="r === 1 && i === 0" role="status" class="sr-only">{{ t('loading') }}</span>
                  <Skeleton
                    variant="rounded"
                    :class="['h-3', i === 0 ? 'w-36' : 'w-20', columnAlign(l.column) === 'right' ? 'ml-auto' : '']"
                  />
                </TableCell>
              </TableRow>
            </TableBody>

            <TableBody v-else-if="bodyError">
              <TableEmpty :colspan="colCount">
                <div
                  role="alert"
                  aria-live="assertive"
                  class="border-destructive/30 bg-destructive/10 text-destructive flex max-w-md items-center gap-3 rounded-md border px-3 py-2 text-xs whitespace-normal"
                >
                  <AlertCircle class="size-4 shrink-0" aria-hidden="true" />
                  <span class="min-w-0 flex-1">{{ bodyError }}</span>
                  <Button variant="outline" size="xs" class="text-foreground shrink-0" @click="retry">
                    <RotateCw class="size-3" aria-hidden="true" />
                    {{ t('retry') }}
                  </Button>
                </div>
              </TableEmpty>
            </TableBody>

            <!-- Right-click a row for the same actions as its menu. -->
            <ContextMenu v-else>
              <ContextMenuTrigger as-child :disabled="!rowActions">
                <TableBody @contextmenu.capture="onContextMenu">
                  <!-- Virtual spacer: the rows above the window, as one tall cell. -->
                  <tr v-if="windowState.padTop > 0" aria-hidden="true">
                    <td :colspan="colCount" class="p-0" :style="{ height: `${windowState.padTop}px` }" />
                  </tr>

                  <template
                    v-for="group in displayGroups ?? [
                      { key: '__all__', value: null, label: '', rows: visibleRows, flat: windowRows },
                    ]"
                    :key="group.key"
                  >
                    <!-- Group header: one row per group with a collapse toggle and the count. -->
                    <TableRow v-if="displayGroups" class="bg-muted/30 hover:bg-muted/40">
                      <TableCell :colspan="colCount" class="py-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          class="-ml-2 gap-1.5 font-medium"
                          :aria-expanded="!collapsed.has(group.key)"
                          @click="toggleGroup(group.key)"
                        >
                          <ChevronDown
                            :class="[
                              'text-muted-foreground size-3.5 transition-transform',
                              collapsed.has(group.key) ? '-rotate-90' : '',
                            ]"
                            aria-hidden="true"
                          />
                          <slot name="group-label" :value="group.value" :label="group.label" :count="group.rows.length">
                            {{ group.label }}
                          </slot>
                          <Badge variant="secondary" class="px-1.5 py-0 tabular-nums">{{ group.rows.length }}</Badge>
                        </Button>
                      </TableCell>
                    </TableRow>

                    <template v-if="!displayGroups || !collapsed.has(group.key)">
                      <template v-for="fr in group.flat" :key="fr.key">
                        <TableRow
                          data-row
                          :data-key="fr.key"
                          tabindex="0"
                          :aria-rowindex="fr.index + 2 + (headerGroups.length ? 1 : 0)"
                          :aria-level="childrenKey ? fr.depth + 1 : undefined"
                          :aria-expanded="fr.hasChildren ? treeExpanded.has(fr.key) : undefined"
                          :aria-selected="selectable ? selected.has(fr.key) : undefined"
                          :data-state="selected.has(fr.key) ? 'selected' : undefined"
                          :data-striped="striped && fr.index % 2 === 1 ? '' : undefined"
                          :class="
                            cn(
                              'group/row hover:bg-primary/[0.04] data-[state=selected]:bg-primary/[0.06] data-[striped]:bg-muted/30 focus-visible:ring-ring/50 cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-inset',
                              rowClass?.(fr.row),
                            )
                          "
                          @click="activateRow(fr)"
                          @keydown="onRowKeydown($event, fr)"
                        >
                          <TableCell
                            v-if="selectable"
                            :class="['px-2', cellDensityClass]"
                            @click.stop
                            @click.capture="rememberShift"
                          >
                            <Checkbox
                              :model-value="selected.has(fr.key)"
                              size="sm"
                              :aria-label="t('selectRow', { key: fr.key })"
                              @update:model-value="(v) => setRowSelected(fr, v === true)"
                            />
                          </TableCell>
                          <TableCell v-if="hasExpandColumn" :class="['px-2', cellDensityClass]" @click.stop>
                            <Button
                              v-if="childrenKey ? fr.hasChildren : true"
                              variant="ghost"
                              size="icon-2xs"
                              :aria-expanded="childrenKey ? treeExpanded.has(fr.key) : expanded.has(fr.key)"
                              :aria-label="
                                (childrenKey ? treeExpanded.has(fr.key) : expanded.has(fr.key))
                                  ? t('collapseRow')
                                  : t('expandRow')
                              "
                              @click="childrenKey ? toggleTree(fr.key) : toggleExpanded(fr.key)"
                            >
                              <ChevronRight
                                :class="[
                                  'text-muted-foreground size-3.5 transition-transform',
                                  (childrenKey ? treeExpanded.has(fr.key) : expanded.has(fr.key)) ? 'rotate-90' : '',
                                ]"
                                aria-hidden="true"
                              />
                            </Button>
                          </TableCell>
                          <TableCell
                            v-for="(l, ci) in layout"
                            :key="l.column.key"
                            :class="
                              cn(
                                cellDensityClass,
                                columnAlign(l.column) === 'right'
                                  ? 'text-right'
                                  : columnAlign(l.column) === 'center'
                                    ? 'text-center'
                                    : '',
                                pinClass(l),
                                cellClassFor(l, fr.row, getValue(fr.row, l.column)),
                              )
                            "
                            :style="{
                              ...pinStyle(l),
                              ...(ci === 0 && fr.depth ? { paddingLeft: `${12 + fr.depth * 16}px` } : {}),
                            }"
                          >
                            <slot
                              :name="`cell-${l.column.key}`"
                              :row="fr.row"
                              :value="getValue(fr.row, l.column)"
                              :column="l.column"
                            >
                              <DataExplorerCell
                                :column="l.column"
                                :row="fr.row"
                                :value="getValue(fr.row, l.column)"
                                :actions="
                                  l.column.type === 'actions' && rowActions
                                    ? (rowActions(fr.row) as ExplorerRowAction[])
                                    : []
                                "
                                :editable="!!l.column.editable"
                                @edit="(v) => onCellEdit(fr.row, l.column, v)"
                              />
                            </slot>
                          </TableCell>
                        </TableRow>

                        <!-- Expanded panel: full-width, inset, default is the record as key/values. -->
                        <TableRow v-if="expandable && expanded.has(fr.key)" class="bg-muted/20 hover:bg-muted/20">
                          <TableCell :colspan="colCount" class="p-0 whitespace-normal">
                            <div class="border-l-border/60 border-l-2 px-4 py-3">
                              <slot name="expanded" :row="fr.row">
                                <dl class="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                                  <DataExplorerDetailRow
                                    v-for="c in columns.filter((c) => c.type !== 'actions')"
                                    :key="c.key"
                                    :label="c.label"
                                    :value="getValue(fr.row, c)"
                                    :hover="false"
                                  >
                                    {{ formatCell(c, getValue(fr.row, c), fr.row) }}
                                  </DataExplorerDetailRow>
                                </dl>
                              </slot>
                            </div>
                          </TableCell>
                        </TableRow>
                      </template>
                    </template>
                  </template>

                  <tr v-if="windowState.padBottom > 0" aria-hidden="true">
                    <td :colspan="colCount" class="p-0" :style="{ height: `${windowState.padBottom}px` }" />
                  </tr>

                  <!-- Infinite: the tail row says what is happening at the bottom. -->
                  <TableRow v-if="pagination === 'infinite' && visibleRows.length" class="hover:bg-transparent">
                    <TableCell :colspan="colCount" class="text-muted-foreground py-2 text-center text-xs">
                      <span v-if="serverLoadingMore" class="inline-flex items-center gap-2" role="status">
                        <Loader class="size-3.5 animate-spin" aria-hidden="true" />
                        {{ t('loadingMore') }}
                      </span>
                      <Button
                        v-else-if="hasMore"
                        variant="ghost"
                        size="xs"
                        class="text-muted-foreground"
                        @click="loadMore"
                      >
                        {{ t('loadMore') }}
                      </Button>
                      <span v-else>{{ t('allLoaded', { count: total }) }}</span>
                    </TableCell>
                  </TableRow>

                  <TableEmpty v-if="visibleRows.length === 0" :colspan="colCount">
                    <slot name="empty" :filtered="hasActiveFilters" :reset="resetFilters">
                      <!-- Two empty states: "nothing here" invites, "nothing
                           matches" offers the way back. -->
                      <EmptyState
                        :icon="hasActiveFilters ? SlidersHorizontal : Workflow"
                        :title="hasActiveFilters ? t('noMatch') : emptyTitle"
                        :description="hasActiveFilters ? t('noMatchHint') : emptyDescription"
                        class="py-2 whitespace-normal"
                      >
                        <Button v-if="hasActiveFilters" variant="outline" size="xs" class="mt-3" @click="resetFilters">
                          {{ t('resetFilters') }}
                        </Button>
                      </EmptyState>
                    </slot>
                  </TableEmpty>
                </TableBody>
              </ContextMenuTrigger>
              <ContextMenuContent v-if="rowActions" class="w-44">
                <ContextMenuItem
                  v-for="a in contextActions"
                  :key="a.label"
                  :variant="a.variant"
                  :disabled="a.disabled"
                  class="text-xs"
                  @select="onContextActionSelect(a)"
                >
                  <component :is="a.icon" v-if="a.icon" class="size-3.5" aria-hidden="true" />
                  {{ a.label }}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            <!-- Aggregates: sticky to the bottom of the scroller, over the rows on screen. -->
            <TableFooter
              v-if="footer && visibleRows.length && !bodyLoading && !bodyError"
              class="bg-card sticky bottom-0 z-10 shadow-[0_-1px_0_0_var(--border)]"
            >
              <TableRow class="hover:bg-transparent">
                <TableCell v-if="selectable" class="px-2 py-1.5" />
                <TableCell v-if="hasExpandColumn" class="px-2 py-1.5" />
                <TableCell
                  v-for="(l, i) in layout"
                  :key="l.column.key"
                  :class="
                    cn(
                      'py-1.5 text-xs font-medium tabular-nums',
                      columnAlign(l.column) === 'right' ? 'text-right' : '',
                      pinClass(l),
                      i === 0 && !l.column.aggregate ? 'text-muted-foreground font-normal' : '',
                    )
                  "
                  :style="pinStyle(l)"
                >
                  <slot :name="`footer-${l.column.key}`" :rows="visibleRows" :column="l.column">
                    {{
                      l.column.aggregate
                        ? aggregate(l.column, visibleRows)
                        : i === 0
                          ? t('rowsCount', { count: visibleRows.length })
                          : ''
                    }}
                  </slot>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>

        <div
          v-if="pagination !== 'none' || total"
          class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t p-3 text-xs"
        >
          <span class="text-muted-foreground">
            {{ t('showing') }} <span class="text-foreground tabular-nums">{{ rangeLabel }}</span> {{ t('of') }}
            <span class="text-foreground tabular-nums">{{ total.toLocaleString() }}</span>
            <template v-if="selectedCount"> · {{ t('selected', { count: selectedCount }) }}</template>
          </span>
          <div v-if="pagination === 'pages'" class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">{{ t('rowsPerPage') }}</span>
              <Select :model-value="String(pageSize)" @update:model-value="(v) => (pageSize = Number(v))">
                <SelectTrigger size="sm" class="h-7 w-16 text-xs" :aria-label="t('rowsPerPage')">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="n in pageSizeOptions" :key="n" :value="String(n)">{{ n }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    :aria-label="t('previousPage')"
                    :disabled="pageIndex === 0 || bodyLoading"
                    @click="prevPage"
                  >
                    <ChevronLeft class="size-3.5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ t('previousPage') }}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    :aria-label="t('nextPage')"
                    :disabled="!hasNext || bodyLoading"
                    @click="nextPage"
                  >
                    <ChevronRight class="size-3.5" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{{ t('nextPage') }}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>

      <!-- Record detail: sectioned key/value rows in mono, every value one
           click to select and one hover to copy. -->
      <Sheet v-model:open="detailOpen">
        <SheetContent class="w-full! gap-0 overflow-hidden p-0 sm:max-w-xl">
          <SheetHeader class="gap-1 border-b p-5 pr-12">
            <div class="flex min-w-0 items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2">
                <Workflow class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                <SheetTitle class="truncate text-base leading-tight">{{ detailTitle }}</SheetTitle>
              </div>
              <div class="flex shrink-0 items-center gap-1.5">
                <Button variant="outline" size="xs" @click="copyLink">
                  <Check v-if="linkCopied" class="text-success size-3" aria-hidden="true" />
                  <Link2 v-else class="text-muted-foreground size-3" aria-hidden="true" />
                  <span role="status">{{ linkCopied ? t('copied') : t('copyLink') }}</span>
                </Button>
                <slot name="detail-actions" :row="detailRow" />
              </div>
            </div>
            <SheetDescription class="truncate font-mono text-xs">{{ detailSubtitle }}</SheetDescription>
          </SheetHeader>

          <div v-if="detailRow" class="min-h-0 flex-1 overflow-y-auto p-3">
            <slot name="detail" :row="detailRow">
              <div class="divide-y rounded-lg border">
                <section v-for="section in detailSections" :key="section.title" class="p-4">
                  <h3 class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                    {{ section.title }}
                  </h3>
                  <dl class="space-y-1.5">
                    <DataExplorerDetailRow v-for="f in section.fields" :key="f" :label="f" :value="detailValue(f)">
                      {{ detailText(f) }}
                    </DataExplorerDetailRow>
                  </dl>
                </section>

                <section v-if="otherFields.length" class="p-4">
                  <h3 class="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                    {{ t('otherFields') }}
                  </h3>
                  <Button
                    variant="link"
                    size="xs"
                    class="px-0"
                    :aria-expanded="showAllFields"
                    @click="showAllFields = !showAllFields"
                  >
                    {{
                      showAllFields
                        ? t('hideOtherFields', { count: otherFields.length })
                        : t('showOtherFields', { count: otherFields.length })
                    }}
                  </Button>
                  <dl v-if="showAllFields" class="mt-3 space-y-1.5">
                    <DataExplorerDetailRow
                      v-for="[k, v] in otherFields"
                      :key="k"
                      :label="k"
                      :value="v"
                      :hover="false"
                    />
                  </dl>
                </section>
              </div>
            </slot>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </TooltipProvider>
</template>
