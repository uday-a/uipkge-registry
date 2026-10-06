import { LitElement, css, html, nothing } from 'lit'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  SlidersHorizontal,
} from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export interface DataTableColumn<T = any> {
  id?: string
  key?: string
  accessorKey?: string
  header?: string | ((col: DataTableColumn<T>) => unknown)
  label?: string
  sortable?: boolean
  cell?: (info: { row: T; value: any }) => unknown
  headerClass?: string
  cellClass?: string
  hidden?: boolean
}

export type DataTableDensity = 'compact' | 'cozy' | 'comfortable'

/**
 * <uip-data-table> — Data-driven table with sorting, search filtering,
 * pagination, row selection, density toggle, and CSV export.
 */
export class UipDataTable extends LitElement {
  static styles = [
    tailwind,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ]

  static properties = {
    data: { type: Array, attribute: false },
    columns: { type: Array, attribute: false },
    filterColumn: { type: String, attribute: 'filter-column' },
    filterPlaceholder: { type: String, attribute: 'filter-placeholder' },
    enableSearch: {
      type: Boolean,
      attribute: 'enable-search',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    enablePagination: {
      type: Boolean,
      attribute: 'enable-pagination',
      converter: { fromAttribute: (v: string | null) => v !== null && v !== 'false' },
    },
    enableExport: { type: Boolean, attribute: 'enable-export' },
    enableDensityToggle: { type: Boolean, attribute: 'enable-density-toggle' },
    density: { type: String },
    pageSize: { type: Number, attribute: 'page-size' },
    selectable: { type: Boolean },
    search: { state: true },
    pageIndex: { state: true },
    sortBy: { state: true },
    sortOrder: { state: true },
    selectedIds: { state: true },
  }

  data: any[] = []
  columns: DataTableColumn[] = []
  filterColumn?: string
  filterPlaceholder = 'Filter...'
  enableSearch = true
  enablePagination = true
  enableExport = false
  enableDensityToggle = false
  density: DataTableDensity = 'cozy'
  pageSize = 10
  selectable = false

  search = ''
  pageIndex = 0
  sortBy: string | null = null
  sortOrder: 'asc' | 'desc' = 'asc'
  selectedIds = new Set<string>()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'data-table')
  }

  private getColumnKey(col: DataTableColumn): string {
    return col.id ?? col.accessorKey ?? col.key ?? ''
  }

  private getColumnLabel(col: DataTableColumn): string {
    if (typeof col.header === 'string') return col.header
    return col.label ?? col.accessorKey ?? col.key ?? ''
  }

  private toggleSort(key: string) {
    if (this.sortBy === key) {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc'
      } else {
        this.sortBy = null
        this.sortOrder = 'asc'
      }
    } else {
      this.sortBy = key
      this.sortOrder = 'asc'
    }
    this.dispatchEvent(
      new CustomEvent('sort-change', {
        detail: { sortBy: this.sortBy, sortOrder: this.sortOrder },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private toggleSelectRow(id: string) {
    const next = new Set(this.selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    this.selectedIds = next
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: { selectedIds: Array.from(next) },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private toggleSelectAll(items: any[]) {
    const allSelected = items.length > 0 && items.every((r) => this.selectedIds.has(r.id))
    const next = new Set<string>()
    if (!allSelected) {
      items.forEach((r) => next.add(r.id))
    }
    this.selectedIds = next
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: { selectedIds: Array.from(next) },
        bubbles: true,
        composed: true,
      }),
    )
    this.requestUpdate()
  }

  private exportCsv() {
    if (!this.data.length) return
    const headers = this.columns.map((c) => this.getColumnLabel(c)).join(',')
    const rows = this.data.map((row) =>
      this.columns
        .map((c) => {
          const val = row[this.getColumnKey(c)]
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val ?? '')
        })
        .join(','),
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'export.csv'
    link.click()
  }

  render() {
    // Filter
    let filtered = this.data
    if (this.search) {
      const q = this.search.toLowerCase()
      if (this.filterColumn) {
        filtered = filtered.filter((row) =>
          String(row[this.filterColumn!] ?? '')
            .toLowerCase()
            .includes(q),
        )
      } else {
        filtered = filtered.filter((row) =>
          Object.values(row).some((val) =>
            String(val ?? '')
              .toLowerCase()
              .includes(q),
          ),
        )
      }
    }

    // Sort
    if (this.sortBy) {
      const key = this.sortBy
      const order = this.sortOrder === 'asc' ? 1 : -1
      filtered = [...filtered].sort((a, b) => {
        const valA = a[key]
        const valB = b[key]
        if (valA == null) return 1
        if (valB == null) return -1
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * order
        }
        return String(valA).localeCompare(String(valB)) * order
      })
    }

    // Paginate
    const totalItems = filtered.length
    const totalPages = this.enablePagination
      ? Math.max(1, Math.ceil(totalItems / this.pageSize))
      : 1
    const currentPage = Math.min(this.pageIndex, totalPages - 1)
    const paged = this.enablePagination
      ? filtered.slice(currentPage * this.pageSize, (currentPage + 1) * this.pageSize)
      : filtered

    const allChecked = paged.length > 0 && paged.every((r) => this.selectedIds.has(r.id))
    const someChecked = paged.some((r) => this.selectedIds.has(r.id)) && !allChecked

    const densityPadding =
      this.density === 'compact' ? 'py-1.5' : this.density === 'comfortable' ? 'py-4' : 'py-2.5'

    return html`
      <div part="base" class="space-y-4">
        <!-- Toolbar -->
        ${this.enableSearch || this.enableExport || this.enableDensityToggle
          ? html`
              <div class="flex items-center justify-between gap-2">
                ${this.enableSearch
                  ? html`
                      <div class="relative max-w-sm flex-1">
                        ${icon(
                          Search,
                          'search',
                          'text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2',
                        )}
                        <input
                          type="text"
                          class="border-input bg-background focus:border-ring focus:ring-ring/30 h-9 w-full rounded-md pr-3 pl-8 text-sm outline-none focus:ring-2"
                          placeholder=${this.filterPlaceholder}
                          .value=${this.search}
                          @input=${(e: Event) => {
                            this.search = (e.target as HTMLInputElement).value
                            this.pageIndex = 0
                            this.dispatchEvent(
                              new CustomEvent('search-change', {
                                detail: { search: this.search },
                                bubbles: true,
                                composed: true,
                              }),
                            )
                          }}
                        />
                      </div>
                    `
                  : html`<div></div>`}

                <div class="flex items-center gap-2">
                  ${this.enableDensityToggle
                    ? html`
                        <button
                          type="button"
                          class="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors"
                          @click=${() => {
                            this.density =
                              this.density === 'compact'
                                ? 'cozy'
                                : this.density === 'cozy'
                                  ? 'comfortable'
                                  : 'compact'
                          }}
                        >
                          ${icon(SlidersHorizontal, 'sliders-horizontal', 'size-3.5')}
                          <span class="capitalize">${this.density}</span>
                        </button>
                      `
                    : nothing}
                  ${this.enableExport
                    ? html`
                        <button
                          type="button"
                          class="border-input hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors"
                          @click=${this.exportCsv}
                        >
                          ${icon(Download, 'download', 'size-3.5')} Export
                        </button>
                      `
                    : nothing}
                </div>
              </div>
            `
          : nothing}

        <!-- Table Container -->
        <div class="border-border bg-card text-card-foreground overflow-hidden rounded-lg border shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm border-collapse">
              <thead class="border-border bg-muted/50 text-muted-foreground border-b text-xs font-medium">
                <tr>
                  ${this.selectable
                    ? html`
                        <th class="w-10 px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            class="rounded border-input text-primary focus:ring-ring size-4"
                            .checked=${allChecked}
                            .indeterminate=${someChecked}
                            @change=${() => this.toggleSelectAll(paged)}
                          />
                        </th>
                      `
                    : nothing}
                  ${this.columns.map((col) => {
                    const key = this.getColumnKey(col)
                    const label = this.getColumnLabel(col)
                    const isSorted = this.sortBy === key
                    const isSortable = col.sortable ?? true

                    return html`
                      <th
                        class=${cn(
                          'px-4 py-3 font-semibold select-none',
                          isSortable && 'cursor-pointer hover:text-foreground',
                          col.headerClass,
                        )}
                        @click=${() => (isSortable ? this.toggleSort(key) : null)}
                      >
                        <div class="flex items-center gap-1.5">
                          <span>${typeof col.header === 'function' ? col.header(col) : label}</span>
                          ${isSortable
                            ? isSorted
                              ? this.sortOrder === 'asc'
                                ? icon(ArrowUp, 'arrow-up', 'size-3.5 text-primary')
                                : icon(ArrowDown, 'arrow-down', 'size-3.5 text-primary')
                              : icon(ArrowUpDown, 'arrow-up-down', 'size-3.5 opacity-40')
                            : nothing}
                        </div>
                      </th>
                    `
                  })}
                </tr>
              </thead>
              <tbody class="divide-border divide-y">
                ${paged.length === 0
                  ? html`
                      <tr>
                        <td
                          colspan=${this.columns.length + (this.selectable ? 1 : 0)}
                          class="text-muted-foreground px-4 py-8 text-center"
                        >
                          No results.
                        </td>
                      </tr>
                    `
                  : paged.map((row) => {
                      const isSelected = this.selectedIds.has(row.id)
                      return html`
                        <tr
                          class=${cn(
                            'hover:bg-muted/50 transition-colors',
                            isSelected && 'bg-primary/5',
                          )}
                        >
                          ${this.selectable
                            ? html`
                                <td class="w-10 px-3 py-2 text-center">
                                  <input
                                    type="checkbox"
                                    class="rounded border-input text-primary focus:ring-ring size-4"
                                    .checked=${isSelected}
                                    @change=${() => this.toggleSelectRow(row.id)}
                                  />
                                </td>
                              `
                            : nothing}
                          ${this.columns.map((col) => {
                            const key = this.getColumnKey(col)
                            const val = row[key]
                            return html`
                              <td class=${cn('px-4 text-foreground', densityPadding, col.cellClass)}>
                                ${col.cell ? col.cell({ row, value: val }) : val}
                              </td>
                            `
                          })}
                        </tr>
                      `
                    })}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination Footer -->
        ${this.enablePagination
          ? html`
              <div class="flex items-center justify-between text-xs text-muted-foreground">
                <div>
                  ${this.selectable && this.selectedIds.size > 0
                    ? html`<span>${this.selectedIds.size} of ${totalItems} row(s) selected.</span>`
                    : html`<span>Total ${totalItems} row${totalItems === 1 ? '' : 's'}</span>`}
                </div>

                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1 font-medium">
                    <span>Page</span>
                    <span class="text-foreground">${currentPage + 1}</span>
                    <span>of</span>
                    <span class="text-foreground">${totalPages}</span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      class="border-input hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
                      ?disabled=${currentPage === 0}
                      @click=${() => {
                        this.pageIndex = 0
                        this.dispatchEvent(
                          new CustomEvent('page-change', { detail: { page: 0 }, bubbles: true }),
                        )
                      }}
                    >
                      ${icon(ChevronsLeft, 'chevrons-left', 'size-4')}
                    </button>
                    <button
                      type="button"
                      class="border-input hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
                      ?disabled=${currentPage === 0}
                      @click=${() => {
                        this.pageIndex = Math.max(0, currentPage - 1)
                        this.dispatchEvent(
                          new CustomEvent('page-change', { detail: { page: this.pageIndex }, bubbles: true }),
                        )
                      }}
                    >
                      ${icon(ChevronLeft, 'chevron-left', 'size-4')}
                    </button>
                    <button
                      type="button"
                      class="border-input hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
                      ?disabled=${currentPage >= totalPages - 1}
                      @click=${() => {
                        this.pageIndex = Math.min(totalPages - 1, currentPage + 1)
                        this.dispatchEvent(
                          new CustomEvent('page-change', { detail: { page: this.pageIndex }, bubbles: true }),
                        )
                      }}
                    >
                      ${icon(ChevronRight, 'chevron-right', 'size-4')}
                    </button>
                    <button
                      type="button"
                      class="border-input hover:bg-accent hover:text-accent-foreground inline-flex size-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
                      ?disabled=${currentPage >= totalPages - 1}
                      @click=${() => {
                        this.pageIndex = totalPages - 1
                        this.dispatchEvent(
                          new CustomEvent('page-change', { detail: { page: this.pageIndex }, bubbles: true }),
                        )
                      }}
                    >
                      ${icon(ChevronsRight, 'chevrons-right', 'size-4')}
                    </button>
                  </div>
                </div>
              </div>
            `
          : nothing}
      </div>
    `
  }
}

customElements.get('uip-data-table') || customElements.define('uip-data-table', UipDataTable)

declare global {
  interface HTMLElementTagNameMap {
    'uip-data-table': UipDataTable
  }
}
