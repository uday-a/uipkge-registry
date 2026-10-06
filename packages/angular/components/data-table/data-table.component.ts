import { Component, EventEmitter, Input, Output, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
/** Anything that can announce to screen readers — @angular/cdk's LiveAnnouncer fits, without depending on the CDK. */
export interface Announcer {
  announce(message: string): unknown
}
import { cn } from '@/lib/utils'

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
}

export type DataTableSortDir = 'asc' | 'desc'

/**
 * Angular port of UIPKGE DataTable — sorting, global search, column
 * visibility, pagination, export-CSV and infinite-scroll hooks. Same
 * toolbar/pagination props as Vue; pure row pipeline (filter -> sort ->
 * page) is unit-testable without DOM.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-data-table, [ui-data-table]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"data-table"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiDataTableComponent {
  @Input() columns: DataTableColumn[] = []
  @Input() data: Record<string, unknown>[] = []
  @Input() filterColumn?: string
  @Input() filterPlaceholder = 'Filter...'
  @Input({ transform: booleanAttribute }) enableSearch = true
  @Input({ transform: booleanAttribute }) enableColumnVisibility = false
  @Input({ transform: booleanAttribute }) enablePagination = true
  @Input({ transform: booleanAttribute }) hideToolbar = false
  @Input({ transform: booleanAttribute }) enableExport = false
  @Input({ transform: booleanAttribute }) infinite = false
  @Input() pageSize = 10
  @Input() page = 0
  @Input() search = ''
  @Input() sortKey?: string
  @Input() sortDir: DataTableSortDir = 'asc'
  @Input() hiddenColumns: string[] = []
  @Input('class') className?: string
  @Output() pageChange = new EventEmitter<number>()
  @Output() sortChange = new EventEmitter<{ key: string; dir: DataTableSortDir }>()
  @Output() searchChange = new EventEmitter<string>()
  @Output() fetchMore = new EventEmitter<void>()
  /** CDK a11y hook: host apps bind LiveAnnouncer to announce sort/page. */
  announcer?: Announcer

  get hostClass(): string {
    return cn('flex flex-col gap-4', this.className)
  }

  visibleColumns(): DataTableColumn[] {
    const hidden = new Set(this.hiddenColumns)
    return this.columns.filter((c) => !hidden.has(c.key))
  }

  filteredData(): Record<string, unknown>[] {
    const q = this.search.trim().toLowerCase()
    if (!q || !this.enableSearch) return [...this.data]
    const keys = this.filterColumn ? [this.filterColumn] : this.columns.map((c) => c.key)
    return this.data.filter((row) =>
      keys.some((k) =>
        String(row[k] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    )
  }

  sortedData(): Record<string, unknown>[] {
    const rows = this.filteredData()
    if (!this.sortKey) return rows
    const dir = this.sortDir === 'desc' ? -1 : 1
    const key = this.sortKey
    return [...rows].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av == null && bv == null) return 0
      if (av == null) return -1 * dir
      if (bv == null) return 1 * dir
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
  }

  pagedData(): Record<string, unknown>[] {
    const rows = this.sortedData()
    if (!this.enablePagination || this.infinite) return rows
    const start = this.page * this.pageSize
    return rows.slice(start, start + this.pageSize)
  }

  totalPages(): number {
    if (!this.enablePagination || this.infinite) return 1
    return Math.max(1, Math.ceil(this.sortedData().length / Math.max(1, this.pageSize)))
  }

  /**
   * Value for `aria-sort` on a sortable column's header cell (`<th ui-table-head scope="col">`),
   * so screen readers announce the active sort. Leave it off non-sortable columns.
   */
  ariaSort(key: string): 'ascending' | 'descending' | 'none' {
    if (this.sortKey !== key) return 'none'
    return this.sortDir === 'desc' ? 'descending' : 'ascending'
  }

  setSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortKey = key
      this.sortDir = 'asc'
    }
    this.sortChange.emit({ key: this.sortKey!, dir: this.sortDir })
    try {
      this.announcer?.announce(`Sorted by ${key} ${this.sortDir}`)
    } catch {
      /* announcer optional */
    }
  }

  gotoPage(p: number): void {
    const next = Math.min(this.totalPages() - 1, Math.max(0, p))
    this.pageChange.emit(next)
  }

  nextPage(): void {
    this.gotoPage(this.page + 1)
  }

  prevPage(): void {
    this.gotoPage(this.page - 1)
  }

  exportCsv(): string {
    const cols = this.visibleColumns()
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const head = cols.map((c) => esc(c.label)).join(',')
    const body = this.sortedData().map((r) => cols.map((c) => esc(r[c.key])).join(','))
    return [head, ...body].join('\n')
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-data-table-column-header, [ui-data-table-column-header]',
  standalone: true,
  host: { '[attr.data-slot]': '"data-table-column-header"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  // `label` is shown unless you project your own content (e.g. label + sort icon).
  template: `<ng-content>{{ label }}</ng-content>`,
})
export class UiDataTableColumnHeaderComponent {
  @Input() label = ''
  @Input() align: 'left' | 'right' | 'center' = 'left'
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'inline-flex items-center gap-1 font-medium',
      this.align === 'right' && 'justify-end',
      this.align === 'center' && 'justify-center',
      this.className,
    )
  }
}
