// Public contract of the DataExplorer block. Everything a consumer configures
// lives here; the engine (`data-explorer-core.ts`) and the sample dataset
// (`data-explorer-data.ts`) both build on these types.

export type ExplorerRow = Record<string, unknown>

/** Which operator set a column's filter popover offers. */
export type ColumnKind = 'string' | 'date' | 'number'

export type ExplorerOperator = 'contains' | 'equals' | 'empty' | 'after' | 'before' | 'gt' | 'lt'

export type StatusTone = 'ok' | 'warn' | 'danger' | 'info' | 'running' | 'muted'

export type ExplorerCellType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'bytes'
  | 'duration'
  | 'date'
  | 'datetime'
  | 'relative'
  | 'boolean'
  | 'badge'
  | 'dot'
  | 'progress'
  | 'sparkline'
  | 'avatar'
  | 'link'
  | 'tags'
  | 'actions'

export interface BadgeMapping {
  label: string
  tone: StatusTone
}

export type ExplorerAggregate = 'sum' | 'avg' | 'min' | 'max' | 'count'

export interface ExplorerColumn<T extends ExplorerRow = ExplorerRow> {
  /** Unique id; also the default accessor (`row[key]`) and the slot suffix (`cell-<key>`). */
  key: string
  label: string
  /** Header tooltip. */
  description?: string
  /** Field path or function. Defaults to `row[key]`. */
  accessor?: string | ((row: T) => unknown)
  /** Cell renderer. Defaults to `text`. Override any type with a `#cell-<key>` slot. */
  type?: ExplorerCellType
  /** Filter operator set. Defaults from `type` (dates → date, numerics → number, else string). */
  kind?: ColumnKind
  sortable?: boolean
  filterable?: boolean
  hideable?: boolean
  groupable?: boolean
  resizable?: boolean
  align?: 'left' | 'right' | 'center'
  /** Initial width in px. Defaults to 160. */
  width?: number
  minWidth?: number
  maxWidth?: number
  pin?: 'left' | 'right'
  hidden?: boolean
  /** Monospace primary text (identifiers, hashes). */
  mono?: boolean
  /** Second line under the primary value — the two-line identifier pattern. */
  sub?: string | ((row: T) => string)
  /** Monospace sub line (container numbers, table names). */
  subMono?: boolean
  /** Hover-revealed copy control for the primary value. */
  copyable?: boolean
  /** Custom text formatter; receives the accessed value. */
  format?: (value: unknown, row: T) => string
  /** `number`: render as signed drift with success/destructive colour. */
  delta?: boolean
  /** `currency`: ISO code, default USD. */
  currency?: string
  /** `badge` / `dot`: value → label + tone. Unknown values render muted. */
  badgeMap?: Record<string, BadgeMapping>
  /** `link`: href builder. */
  href?: (row: T) => string
  /** `tags`: how many chips before "+N". Default 3. */
  maxTags?: number
  /** Footer aggregate over the rows on screen. */
  aggregate?: ExplorerAggregate | ((rows: T[]) => string)
  /** Double-click to edit in place; emits `cellEdit`. */
  editable?: boolean | 'text' | 'number'
  /** Extra classes on every cell of this column. */
  cellClass?: string | ((value: unknown, row: T) => string)
  /** Sort by a derived value instead of the displayed one (e.g. a rank behind a label). */
  sortValue?: (row: T) => unknown
  /** Allow the cell to wrap onto multiple lines instead of truncating. */
  wrap?: boolean
  /** Spanning header: adjacent columns with the same group share a title row above. */
  group?: string
}

export interface ExplorerSort {
  key: string
  dir: 'asc' | 'desc'
}

export interface ExplorerFilter {
  column: string
  operator: ExplorerOperator
  value: string
}

export interface ExplorerFacet {
  value: string
  count: number
}

/** Everything the block sends to a `source`; mirrors the client-side query. */
export interface ExplorerQuery {
  search: string
  filters: ExplorerFilter[]
  sort: ExplorerSort[]
  facet: { column: string; value: string } | null
  page: number
  pageSize: number
  /** Set in `infinite` pagination after the first page (from the previous `nextCursor`). */
  cursor: string | null
}

export interface ExplorerPage<T extends ExplorerRow = ExplorerRow> {
  rows: T[]
  /** Total matching rows. Drives the range label and the Next button. */
  total?: number
  /** `infinite`: opaque token for the next page; null/undefined = no more. */
  nextCursor?: string | null
  /** Facet counts for `facetColumn`; computed client-side when omitted. */
  facets?: ExplorerFacet[]
}

export type ExplorerSource<T extends ExplorerRow = ExplorerRow> = (query: ExplorerQuery) => Promise<ExplorerPage<T>>

export interface ExplorerRowAction<T extends ExplorerRow = ExplorerRow> {
  label: string
  icon?: unknown
  variant?: 'default' | 'destructive'
  disabled?: boolean
  onSelect: (row: T) => void
}

export interface ExplorerDetailSection {
  title: string
  fields: string[]
}

export interface ExplorerCellEdit<T extends ExplorerRow = ExplorerRow> {
  row: T
  key: string
  value: unknown
  previous: unknown
}

export type DensityMode = 'compact' | 'default' | 'comfortable'

export const DENSITY_MODES: readonly DensityMode[] = ['compact', 'default', 'comfortable']

export const DENSITY_LABELS: Record<DensityMode, string> = {
  compact: 'Compact',
  default: 'Default',
  comfortable: 'Comfortable',
}

/** Type size stays text-xs at every density -- density changes room, not type. */
export const DENSITY_CELL_CLASSES: Record<DensityMode, string> = {
  compact: 'py-1 text-xs',
  default: 'py-2 text-xs',
  comfortable: 'py-3 text-xs',
}

export const TONE_DOT_CLASSES: Record<StatusTone, string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-info',
  running: 'bg-primary animate-pulse motion-reduce:animate-none',
  muted: 'bg-muted-foreground/40',
}

export const OPERATORS_BY_KIND: Record<ColumnKind, readonly ExplorerOperator[]> = {
  string: ['contains', 'equals', 'empty'],
  date: ['after', 'before', 'empty'],
  number: ['gt', 'lt', 'equals', 'empty'],
}

/** What the operator reads as in the menu -- the phrase, not the identifier. */
export const OPERATOR_LABELS: Record<ExplorerOperator, string> = {
  contains: 'contains',
  equals: 'is',
  empty: 'is empty',
  after: 'is after',
  before: 'is before',
  gt: 'greater than',
  lt: 'less than',
}

export const VALUE_PLACEHOLDERS: Record<ColumnKind, string> = {
  string: 'Value',
  date: 'YYYY-MM-DD',
  number: 'Number',
}

export type ExportFormatId = 'csv' | 'json' | 'tsv' | 'markdown'

export interface ExportFormat {
  id: ExportFormatId
  label: string
  ext: string
  mime: string
}

export const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'csv', label: 'CSV', ext: 'csv', mime: 'text/csv' },
  { id: 'json', label: 'JSON', ext: 'json', mime: 'application/json' },
  { id: 'tsv', label: 'TSV', ext: 'tsv', mime: 'text/tab-separated-values' },
  { id: 'markdown', label: 'Markdown', ext: 'md', mime: 'text/markdown' },
]

/** The slice of UI state that `persistKey` writes to localStorage. */
export interface ExplorerPersistedState {
  sort?: ExplorerSort[]
  filters?: ExplorerFilter[]
  hidden?: string[]
  order?: string[]
  pins?: Record<string, 'left' | 'right'>
  /** Columns whose configured pin the user removed. */
  unpinned?: string[]
  widths?: Record<string, number>
  density?: DensityMode
  pageSize?: number
  groupBy?: string | null
}

// ── Labels ──────────────────────────────────────────────────────────────
//
// Every string the block renders, overridable through the `labels` prop.
// `{name}` placeholders are interpolated by `interpolate()` in the core.

export interface ExplorerLabels {
  searchAria: string
  clear: string
  reset: string
  noValues: string
  columns: string
  resetColumns: string
  pinColumn: string
  unpinColumn: string
  moveUp: string
  moveDown: string
  rowDensity: string
  densityCompact: string
  densityDefault: string
  densityComfortable: string
  export: string
  exportSelected: string
  exportsSelected: string
  exportsVisible: string
  fullscreen: string
  exitFullscreen: string
  exitFullscreenHint: string
  filteredBy: string
  activeFilters: string
  removeFilter: string
  facetIs: string
  selected: string
  selectAll: string
  selectRow: string
  expand: string
  expandRow: string
  collapseRow: string
  loading: string
  retry: string
  loadMore: string
  loadingMore: string
  allLoaded: string
  noMatch: string
  noMatchHint: string
  resetFilters: string
  showing: string
  of: string
  rowsPerPage: string
  previousPage: string
  nextPage: string
  rowsCount: string
  record: string
  copyLink: string
  copied: string
  otherFields: string
  showOtherFields: string
  hideOtherFields: string
  refreshing: string
  actions: string
  rowActions: string
  columnOptions: string
  sortAsc: string
  sortDesc: string
  clearSort: string
  filterBy: string
  filterValue: string
  apply: string
  pinLeft: string
  pinRight: string
  unpin: string
  groupBy: string
  ungroup: string
  hideColumn: string
  resize: string
  copy: string
  edit: string
  yes: string
  no: string
  opContains: string
  opEquals: string
  opEmpty: string
  opAfter: string
  opBefore: string
  opGt: string
  opLt: string
  phString: string
  phDate: string
  phNumber: string
}

export const DEFAULT_LABELS: ExplorerLabels = {
  searchAria: 'Search rows',
  clear: 'Clear',
  reset: 'Reset',
  noValues: 'No values',
  columns: 'Columns',
  resetColumns: 'Reset columns',
  pinColumn: 'Pin {label} left',
  unpinColumn: 'Unpin {label}',
  moveUp: 'Move {label} up',
  moveDown: 'Move {label} down',
  rowDensity: 'Row density',
  densityCompact: 'Compact',
  densityDefault: 'Default',
  densityComfortable: 'Comfortable',
  export: 'Export',
  exportSelected: 'Export selected',
  exportsSelected: 'Exports the {count} selected rows.',
  exportsVisible: 'Exports the rows on screen.',
  fullscreen: 'Fullscreen',
  exitFullscreen: 'Exit fullscreen',
  exitFullscreenHint: 'Exit fullscreen (Esc)',
  filteredBy: 'Filtered by',
  activeFilters: 'Active filters',
  removeFilter: 'Remove {label} filter',
  facetIs: '{label} is {value}',
  selected: '{count} selected',
  selectAll: 'Select all rows on this page',
  selectRow: 'Select row {key}',
  expand: 'Expand',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  loading: 'Loading…',
  retry: 'Retry',
  loadMore: 'Load more',
  loadingMore: 'Loading more…',
  allLoaded: 'All {count} rows loaded',
  noMatch: 'No rows match these filters',
  noMatchHint: 'Try widening the search or clearing a column filter.',
  resetFilters: 'Reset filters',
  showing: 'Showing',
  of: 'of',
  rowsPerPage: 'Rows per page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  rowsCount: '{count} rows',
  record: 'Record',
  copyLink: 'Copy link',
  copied: 'Copied',
  otherFields: 'Other fields',
  showOtherFields: 'Show {count} other fields',
  hideOtherFields: 'Hide {count} other fields',
  refreshing: 'Refreshing rows',
  actions: 'Actions',
  rowActions: 'Row actions',
  columnOptions: '{label} — column options',
  sortAsc: 'Sort ascending',
  sortDesc: 'Sort descending',
  clearSort: 'Clear sort',
  filterBy: 'Filter {label} by',
  filterValue: 'Filter {label} value',
  apply: 'Apply',
  pinLeft: 'Pin left',
  pinRight: 'Pin right',
  unpin: 'Unpin',
  groupBy: 'Group by {label}',
  ungroup: 'Ungroup',
  hideColumn: 'Hide column',
  resize: 'Resize {label}',
  copy: 'Copy {label}',
  edit: 'Edit {label}',
  yes: 'Yes',
  no: 'No',
  opContains: 'contains',
  opEquals: 'is',
  opEmpty: 'is empty',
  opAfter: 'is after',
  opBefore: 'is before',
  opGt: 'greater than',
  opLt: 'less than',
  phString: 'Value',
  phDate: 'YYYY-MM-DD',
  phNumber: 'Number',
}

/** Injection key under which the block provides its resolved labels + `t()`. */
export const LABELS_INJECTION_KEY = 'data-explorer:labels'

export const OPERATOR_LABEL_KEYS: Record<ExplorerOperator, keyof ExplorerLabels> = {
  contains: 'opContains',
  equals: 'opEquals',
  empty: 'opEmpty',
  after: 'opAfter',
  before: 'opBefore',
  gt: 'opGt',
  lt: 'opLt',
}

export const PLACEHOLDER_LABEL_KEYS: Record<ColumnKind, keyof ExplorerLabels> = {
  string: 'phString',
  date: 'phDate',
  number: 'phNumber',
}
