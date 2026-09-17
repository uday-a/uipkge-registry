// The engine behind DataExplorer: pure functions over rows + column config.
// No Vue in here, so it is unit-testable and the React mirror shares it verbatim.
import {
  type ColumnKind,
  type ExplorerAggregate,
  type ExplorerColumn,
  type ExplorerFacet,
  type ExplorerFilter,
  type ExplorerPage,
  type ExplorerPersistedState,
  type ExplorerQuery,
  type ExplorerRow,
  type ExplorerSort,
  type ExplorerSource,
  type ExportFormatId,
  DENSITY_MODES,
} from './data-explorer-types'

// ── Access ──────────────────────────────────────────────────────────────

export function getValue<T extends ExplorerRow>(row: T, column: ExplorerColumn<T>): unknown {
  const acc = column.accessor
  if (typeof acc === 'function') return acc(row)
  const path = acc ?? column.key
  if (!path.includes('.')) return row[path]
  return path
    .split('.')
    .reduce<unknown>((v, p) => (v && typeof v === 'object' ? (v as ExplorerRow)[p] : undefined), row)
}

export function getSub<T extends ExplorerRow>(row: T, column: ExplorerColumn<T>): string {
  const sub = column.sub
  if (!sub) return ''
  return typeof sub === 'function' ? sub(row) : String(row[sub] ?? '')
}

const NUMERIC_TYPES = new Set(['number', 'currency', 'percent', 'bytes', 'duration', 'progress'])
const DATE_TYPES = new Set(['date', 'datetime', 'relative'])

export function columnKind<T extends ExplorerRow>(column: ExplorerColumn<T>): ColumnKind {
  if (column.kind) return column.kind
  if (NUMERIC_TYPES.has(column.type ?? '')) return 'number'
  if (DATE_TYPES.has(column.type ?? '')) return 'date'
  return 'string'
}

export function columnAlign<T extends ExplorerRow>(column: ExplorerColumn<T>): 'left' | 'right' | 'center' {
  if (column.align) return column.align
  return NUMERIC_TYPES.has(column.type ?? '') ? 'right' : 'left'
}

export function isSortable<T extends ExplorerRow>(column: ExplorerColumn<T>): boolean {
  if (column.sortable !== undefined) return column.sortable
  return column.type !== 'sparkline' && column.type !== 'actions'
}

export function isFilterable<T extends ExplorerRow>(column: ExplorerColumn<T>): boolean {
  if (column.filterable !== undefined) return column.filterable
  return column.type !== 'sparkline' && column.type !== 'actions' && column.type !== 'progress'
}

export function rowKeyOf<T extends ExplorerRow>(row: T, rowKey: string | ((row: T) => string), index: number): string {
  if (typeof rowKey === 'function') return rowKey(row)
  const v = row[rowKey]
  return v === undefined || v === null ? `row-${index}` : String(v)
}

// ── Formatting ──────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0')

export function toDate(v: unknown): Date | null {
  if (v === null || v === undefined || v === '') return null
  const d = v instanceof Date ? v : new Date(v as string | number)
  return Number.isNaN(d.getTime()) ? null : d
}

/** `2026-09-09` in local time; the em dash stands in for a missing value. */
export function fmtDate(v: unknown): string {
  const d = toDate(v)
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : '—'
}

/** `2026-09-09 14:32` in local time. */
export function fmtDateTime(v: unknown): string {
  const d = toDate(v)
  return d ? `${fmtDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}` : '—'
}

/** `2h ago` / `in 3d` -- pair with the absolute value in `title`. */
export function fmtRelative(v: unknown, now: Date = new Date()): string {
  const d = toDate(v)
  if (!d) return '—'
  const diff = d.getTime() - now.getTime()
  const abs = Math.abs(diff)
  const unit =
    abs < 60_000
      ? [Math.round(abs / 1000), 's']
      : abs < 3_600_000
        ? [Math.round(abs / 60_000), 'm']
        : abs < 86_400_000
          ? [Math.round(abs / 3_600_000), 'h']
          : [Math.round(abs / 86_400_000), 'd']
  return diff < 0 ? `${unit[0]}${unit[1]} ago` : `in ${unit[0]}${unit[1]}`
}

export function fmtNumber(v: unknown): string {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—'
  return Number(v).toLocaleString()
}

export function fmtCurrency(v: unknown, currency = 'USD'): string {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—'
  return Number(v).toLocaleString(undefined, { style: 'currency', currency, maximumFractionDigits: 2 })
}

export function fmtPercent(v: unknown): string {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—'
  return `${Math.round(Number(v) * 10) / 10}%`
}

export function fmtBytes(v: unknown): string {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—'
  const bytes = Number(v)
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let n = bytes / 1024
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(n >= 100 ? 0 : 1)} ${units[i]}`
}

/** Minutes → `14m` / `1h 12m`. */
export function fmtDuration(v: unknown): string {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—'
  const minutes = Number(v)
  if (minutes < 1) return `${Math.round(minutes * 60)}s`
  if (minutes < 60) return `${Math.round(minutes * 10) / 10}m`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes - h * 60)
  return m ? `${h}h ${m}m` : `${h}h`
}

/** Signed drift: `+4.2`, `-1.1`, `0.0` (unit appended by the caller's format). */
export function fmtDelta(v: unknown): string {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—'
  const d = Math.round(Number(v) * 10) / 10
  return d > 0 ? `+${d.toFixed(1)}` : d.toFixed(1)
}

/** Generic detail-sheet formatter for any field value. */
export function fmtValue(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—'
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (typeof v === 'number') return v.toLocaleString()
  if (v instanceof Date) return fmtDateTime(v)
  if (Array.isArray(v)) return v.length ? v.map(fmtValue).join(', ') : '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

/** The plain-text rendering of a cell, used by export, the detail sheet and search. */
export function formatCell<T extends ExplorerRow>(column: ExplorerColumn<T>, value: unknown, row: T): string {
  if (column.format) return column.format(value, row)
  switch (column.type) {
    case 'number':
      return column.delta ? fmtDelta(value) : fmtNumber(value)
    case 'currency':
      return fmtCurrency(value, column.currency)
    case 'percent':
      return fmtPercent(value)
    case 'bytes':
      return fmtBytes(value)
    case 'duration':
      return fmtDuration(value)
    case 'date':
      return fmtDate(value)
    case 'datetime':
      return fmtDateTime(value)
    case 'relative':
      return fmtRelative(value)
    case 'badge':
    case 'dot':
      return column.badgeMap?.[String(value)]?.label ?? fmtValue(value)
    case 'avatar':
      return typeof value === 'object' && value ? String((value as { name?: string }).name ?? '') : fmtValue(value)
    case 'sparkline':
      return Array.isArray(value) ? fmtValue(value[value.length - 1]) : '—'
    default:
      return fmtValue(value)
  }
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]!)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** SVG path for a sparkline in a `w`×`h` box; returns '' for fewer than two points. */
export function sparklinePath(values: number[], w: number, h: number): string {
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = w / (values.length - 1)
  return values
    .map(
      (v, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(h - ((v - min) / span) * (h - 2) - 1).toFixed(1)}`,
    )
    .join(' ')
}

// ── Query ───────────────────────────────────────────────────────────────

export function matchesFilter<T extends ExplorerRow>(
  row: T,
  filter: ExplorerFilter,
  column: ExplorerColumn<T>,
): boolean {
  const raw = getValue(row, column)
  const isEmpty = raw === null || raw === undefined || raw === '' || (Array.isArray(raw) && raw.length === 0)
  if (filter.operator === 'empty') return isEmpty
  if (isEmpty) return false
  const needle = filter.value.trim().toLowerCase()
  const text =
    `${formatCell(column, raw, row)} ${getSub(row, column)} ${Array.isArray(raw) ? raw.join(' ') : String(raw)}`
      .trim()
      .toLowerCase()
  switch (filter.operator) {
    case 'contains':
      return text.includes(needle)
    case 'equals': {
      if (typeof raw === 'number') return raw === Number(needle)
      // `equals` on a two-line cell matches the primary value, the sub-line
      // or the raw value -- whichever the user could see and type back.
      return [formatCell(column, raw, row), getSub(row, column), String(raw)].some((s) => s.toLowerCase() === needle)
    }
    case 'after':
      return (toDate(raw)?.getTime() ?? Number.NaN) > new Date(filter.value).getTime()
    case 'before':
      return (toDate(raw)?.getTime() ?? Number.NaN) < new Date(filter.value).getTime()
    case 'gt':
      return Number(raw) > Number(needle)
    case 'lt':
      return Number(raw) < Number(needle)
  }
  return true
}

export function matchesSearch<T extends ExplorerRow>(row: T, query: string, columns: ExplorerColumn<T>[]): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return columns.some((c) => {
    if (c.type === 'sparkline' || c.type === 'actions') return false
    const raw = getValue(row, c)
    if (raw === null || raw === undefined) return false
    const hay = Array.isArray(raw)
      ? raw.join(' ')
      : typeof raw === 'object'
        ? JSON.stringify(raw)
        : `${String(raw)} ${formatCell(c, raw, row)} ${getSub(row, c)}`
    return hay.toLowerCase().includes(q)
  })
}

export function compareRows<T extends ExplorerRow>(
  a: T,
  b: T,
  sorts: ExplorerSort[],
  columns: ExplorerColumn<T>[],
): number {
  for (const sort of sorts) {
    const column = columns.find((c) => c.key === sort.key)
    if (!column) continue
    let av = column.sortValue ? column.sortValue(a) : getValue(a, column)
    let bv = column.sortValue ? column.sortValue(b) : getValue(b, column)
    if (column.type === 'sparkline' && !column.sortValue) {
      av = Array.isArray(av) ? av[av.length - 1] : null
      bv = Array.isArray(bv) ? bv[bv.length - 1] : null
    }
    if (column.type === 'avatar' && !column.sortValue) {
      av = typeof av === 'object' && av ? (av as { name?: string }).name : av
      bv = typeof bv === 'object' && bv ? (bv as { name?: string }).name : bv
    }
    const aEmpty = av === null || av === undefined || av === ''
    const bEmpty = bv === null || bv === undefined || bv === ''
    // Empty values sink to the bottom in either direction.
    if (aEmpty && bEmpty) continue
    if (aEmpty) return 1
    if (bEmpty) return -1
    let cmp: number
    if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
    else if (typeof av === 'boolean' && typeof bv === 'boolean') cmp = Number(av) - Number(bv)
    else if (DATE_TYPES.has(column.type ?? '')) cmp = (toDate(av)?.getTime() ?? 0) - (toDate(bv)?.getTime() ?? 0)
    else cmp = String(av).localeCompare(String(bv))
    if (cmp !== 0) return sort.dir === 'asc' ? cmp : -cmp
  }
  return 0
}

export function computeFacets<T extends ExplorerRow>(rows: T[], column: ExplorerColumn<T>): ExplorerFacet[] {
  const counts = new Map<string, number>()
  for (const r of rows) {
    const v = getValue(r, column)
    const key = v === null || v === undefined || v === '' ? '' : String(v)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count)
}

/**
 * The client-side stand-in for a server query: search → column filters →
 * facets (counted before the facet filter so the other options stay
 * comparable) → facet filter → sort.
 */
export function applyQuery<T extends ExplorerRow>(
  rows: T[],
  query: Omit<ExplorerQuery, 'page' | 'pageSize' | 'cursor'>,
  columns: ExplorerColumn<T>[],
  facetColumnKey?: string | null,
): { rows: T[]; facets: ExplorerFacet[] } {
  const byKey = new Map(columns.map((c) => [c.key, c]))
  const narrowed = rows.filter(
    (r) =>
      matchesSearch(r, query.search, columns) &&
      query.filters.every((f) => {
        const column = byKey.get(f.column)
        return column ? matchesFilter(r, f, column) : true
      }),
  )
  const facetColumn = facetColumnKey ? byKey.get(facetColumnKey) : undefined
  const facets = facetColumn ? computeFacets(narrowed, facetColumn) : []
  const faceted =
    query.facet && facetColumn
      ? narrowed.filter((r) => String(getValue(r, facetColumn) ?? '') === query.facet!.value)
      : narrowed
  const sorted = query.sort.length ? [...faceted].sort((a, b) => compareRows(a, b, query.sort, columns)) : faceted
  return { rows: sorted, facets }
}

export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  return rows.slice(page * pageSize, (page + 1) * pageSize)
}

// ── Tree rows ───────────────────────────────────────────────────────────

export interface FlatRow<T extends ExplorerRow = ExplorerRow> {
  row: T
  key: string
  /** Position in the flattened list -- what range selection and aria-rowindex use. */
  index: number
  depth: number
  hasChildren: boolean
  parentKey: string | null
}

/**
 * Flattens `rows` (and, for expanded keys, their `childrenKey` arrays) into
 * the list the table renders. Depth drives the indent of the leading cell.
 */
export function flattenTree<T extends ExplorerRow>(
  rows: T[],
  childrenKey: string | null,
  expanded: Set<string>,
  keyOf: (row: T, index: number) => string,
): FlatRow<T>[] {
  const out: FlatRow<T>[] = []
  const walk = (list: T[], depth: number, parentKey: string | null) => {
    list.forEach((row, i) => {
      const key = keyOf(row, i)
      const children = childrenKey ? row[childrenKey] : undefined
      const hasChildren = Array.isArray(children) && children.length > 0
      out.push({ row, key, index: out.length, depth, hasChildren, parentKey })
      if (hasChildren && expanded.has(key)) walk(children as T[], depth + 1, key)
    })
  }
  walk(rows, 0, null)
  return out
}

// ── Grouping + aggregates ───────────────────────────────────────────────

export interface ExplorerGroup<T extends ExplorerRow = ExplorerRow> {
  key: string
  value: unknown
  label: string
  rows: T[]
}

export function groupRows<T extends ExplorerRow>(rows: T[], column: ExplorerColumn<T>): ExplorerGroup<T>[] {
  const groups = new Map<string, ExplorerGroup<T>>()
  for (const row of rows) {
    const value = getValue(row, column)
    const key = value === null || value === undefined || value === '' ? '__empty__' : String(value)
    let g = groups.get(key)
    if (!g) {
      g = { key, value, label: key === '__empty__' ? '—' : formatCell(column, value, row), rows: [] }
      groups.set(key, g)
    }
    g.rows.push(row)
  }
  return [...groups.values()]
}

export function aggregate<T extends ExplorerRow>(column: ExplorerColumn<T>, rows: T[]): string {
  const agg = column.aggregate
  if (!agg) return ''
  if (typeof agg === 'function') return agg(rows)
  const nums = rows
    .map((r) => getValue(r, column))
    .map((v) => (Array.isArray(v) ? v[v.length - 1] : v))
    .filter((v): v is number => typeof v === 'number' && !Number.isNaN(v))
  if (agg === 'count') return fmtNumber(rows.length)
  if (!nums.length) return '—'
  const total = nums.reduce((s, n) => s + n, 0)
  const value: Record<Exclude<ExplorerAggregate, 'count'>, number> = {
    sum: total,
    avg: total / nums.length,
    min: Math.min(...nums),
    max: Math.max(...nums),
  }
  const n = value[agg]
  const rounded = agg === 'avg' ? Math.round(n * 10) / 10 : n
  return formatCell(column, rounded, rows[0]!)
}

// ── Layout: windowing + pinning ─────────────────────────────────────────

export interface ExplorerWindow {
  start: number
  end: number
  padTop: number
  padBottom: number
}

/** Fixed-row-height windowing: which rows to mount for the current scroll offset. */
export function computeWindow(
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  count: number,
  overscan = 6,
): ExplorerWindow {
  if (!count || rowHeight <= 0) return { start: 0, end: count, padTop: 0, padBottom: 0 }
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const visible = Math.ceil(viewportHeight / rowHeight) + overscan * 2
  const end = Math.min(count, start + visible)
  return { start, end, padTop: start * rowHeight, padBottom: (count - end) * rowHeight }
}

export interface ColumnLayout<T extends ExplorerRow = ExplorerRow> {
  column: ExplorerColumn<T>
  width: number
  pin: 'left' | 'right' | null
  /** Sticky offset in px for a pinned column. */
  offset: number
  /** Last column of the left group / first of the right group: gets the divider shadow. */
  edge: boolean
}

/** Visible columns in display order: left-pinned, unpinned, right-pinned; with widths + sticky offsets. */
export function layoutColumns<T extends ExplorerRow>(
  columns: ExplorerColumn<T>[],
  state: {
    order: string[]
    hidden: Set<string>
    pins: Record<string, 'left' | 'right'>
    widths: Record<string, number>
  },
): ColumnLayout<T>[] {
  const byKey = new Map(columns.map((c) => [c.key, c]))
  const ordered = [
    ...state.order.map((k) => byKey.get(k)).filter((c): c is ExplorerColumn<T> => !!c),
    ...columns.filter((c) => !state.order.includes(c.key)),
  ].filter((c) => !state.hidden.has(c.key))
  const pinOf = (c: ExplorerColumn<T>) => state.pins[c.key] ?? c.pin ?? null
  const left = ordered.filter((c) => pinOf(c) === 'left')
  const middle = ordered.filter((c) => !pinOf(c))
  const right = ordered.filter((c) => pinOf(c) === 'right')
  const widthOf = (c: ExplorerColumn<T>) => state.widths[c.key] ?? c.width ?? 160
  const out: ColumnLayout<T>[] = []
  let offset = 0
  left.forEach((column, i) => {
    out.push({ column, width: widthOf(column), pin: 'left', offset, edge: i === left.length - 1 })
    offset += widthOf(column)
  })
  for (const column of middle) out.push({ column, width: widthOf(column), pin: null, offset: 0, edge: false })
  offset = 0
  const rightLayouts: ColumnLayout<T>[] = []
  for (let i = right.length - 1; i >= 0; i--) {
    const column = right[i]!
    rightLayouts.unshift({ column, width: widthOf(column), pin: 'right', offset, edge: i === 0 })
    offset += widthOf(column)
  }
  return [...out, ...rightLayouts]
}

// ── Export ──────────────────────────────────────────────────────────────

function escapeCsv(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
}

export function renderExport<T extends ExplorerRow>(
  rows: T[],
  columns: ExplorerColumn<T>[],
  format: ExportFormatId,
): string {
  const cols = columns.filter((c) => c.type !== 'actions')
  const header = cols.map((c) => c.label)
  const cell = (r: T, c: ExplorerColumn<T>) => {
    const v = getValue(r, c)
    const text = formatCell(c, v, r)
    return text === '—' ? '' : text
  }
  const body = rows.map((r) => cols.map((c) => cell(r, c)))
  switch (format) {
    case 'csv':
      return [header.map(escapeCsv).join(','), ...body.map((l) => l.map(escapeCsv).join(','))].join('\n')
    case 'tsv':
      return [header.join('\t'), ...body.map((l) => l.map((c) => c.replace(/\t/g, ' ')).join('\t'))].join('\n')
    case 'markdown':
      return [
        `| ${header.join(' | ')} |`,
        `| ${header.map(() => '---').join(' | ')} |`,
        ...body.map((l) => `| ${l.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`),
      ].join('\n')
    case 'json':
      return JSON.stringify(
        rows.map((r) => Object.fromEntries(cols.map((c) => [c.key, getValue(r, c)]))),
        null,
        2,
      )
  }
}

export function downloadText(content: string, filename: string, mime: string): void {
  if (typeof document === 'undefined') return
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ── Persistence ─────────────────────────────────────────────────────────

export const PERSIST_PREFIX = 'uipkge:data-explorer:'

/** Untrusted localStorage -- a stale or hand-edited value falls back field by field. */
export function parsePersisted(raw: string | null, knownKeys: Set<string>): ExplorerPersistedState {
  if (!raw) return {}
  let v: unknown
  try {
    v = JSON.parse(raw)
  } catch {
    return {}
  }
  if (!v || typeof v !== 'object') return {}
  const s = v as Record<string, unknown>
  const out: ExplorerPersistedState = {}
  if (Array.isArray(s.sort))
    out.sort = s.sort.filter(
      (x): x is ExplorerSort =>
        !!x &&
        typeof x === 'object' &&
        knownKeys.has((x as ExplorerSort).key) &&
        ['asc', 'desc'].includes((x as ExplorerSort).dir),
    )
  if (Array.isArray(s.filters))
    out.filters = s.filters.filter(
      (x): x is ExplorerFilter =>
        !!x &&
        typeof x === 'object' &&
        knownKeys.has((x as ExplorerFilter).column) &&
        typeof (x as ExplorerFilter).operator === 'string' &&
        typeof (x as ExplorerFilter).value === 'string' &&
        (x as ExplorerFilter).value.length <= 64,
    )
  if (Array.isArray(s.hidden))
    out.hidden = s.hidden.filter((k): k is string => typeof k === 'string' && knownKeys.has(k))
  if (Array.isArray(s.order)) out.order = s.order.filter((k): k is string => typeof k === 'string' && knownKeys.has(k))
  if (Array.isArray(s.unpinned))
    out.unpinned = s.unpinned.filter((k): k is string => typeof k === 'string' && knownKeys.has(k))
  if (s.pins && typeof s.pins === 'object')
    out.pins = Object.fromEntries(
      Object.entries(s.pins as Record<string, unknown>).filter(
        (e): e is [string, 'left' | 'right'] => knownKeys.has(e[0]) && (e[1] === 'left' || e[1] === 'right'),
      ),
    )
  if (s.widths && typeof s.widths === 'object')
    out.widths = Object.fromEntries(
      Object.entries(s.widths as Record<string, unknown>).filter(
        (e): e is [string, number] => knownKeys.has(e[0]) && typeof e[1] === 'number' && e[1] >= 40 && e[1] <= 2000,
      ),
    )
  if (typeof s.density === 'string' && (DENSITY_MODES as readonly string[]).includes(s.density))
    out.density = s.density as ExplorerPersistedState['density']
  if (typeof s.pageSize === 'number' && s.pageSize > 0 && s.pageSize <= 1000) out.pageSize = s.pageSize
  if (s.groupBy === null || (typeof s.groupBy === 'string' && knownKeys.has(s.groupBy))) out.groupBy = s.groupBy
  return out
}

// ── Mock async source ───────────────────────────────────────────────────

/**
 * Wraps an in-memory array as an `ExplorerSource`: applies the query the way
 * a server would, pages it, and resolves after `latency` ms. Cursor mode
 * encodes the next page index so `infinite` pagination has something to hand
 * back. Handy for demos and tests; swap for your fetch in production.
 */
export function createMockSource<T extends ExplorerRow>(
  rows: T[],
  columns: ExplorerColumn<T>[],
  options: { latency?: number; facetColumn?: string | null; failEvery?: number } = {},
): ExplorerSource<T> {
  const { latency = 400, facetColumn = null, failEvery = 0 } = options
  let calls = 0
  return (query) =>
    new Promise<ExplorerPage<T>>((resolve, reject) => {
      setTimeout(() => {
        calls++
        if (failEvery && calls % failEvery === 0) {
          reject(new Error('Mock source failed (simulated 503)'))
          return
        }
        const { rows: matched, facets } = applyQuery(rows, query, columns, facetColumn)
        const page = query.cursor ? Number(query.cursor) : query.page
        const slice = paginate(matched, page, query.pageSize)
        const hasMore = (page + 1) * query.pageSize < matched.length
        resolve({ rows: slice, total: matched.length, nextCursor: hasMore ? String(page + 1) : null, facets })
      }, latency)
    })
}

// ── Labels ──────────────────────────────────────────────────────────────

/** `'{count} selected'` + `{ count: 3 }` → `'3 selected'`. Unknown names render empty. */
export function interpolate(template: string, vars?: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = vars?.[name]
    return v === undefined || v === null ? '' : typeof v === 'number' ? v.toLocaleString() : String(v)
  })
}
