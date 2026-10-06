import { LitElement, css, html, nothing } from 'lit'
import { ChevronRight, Loader2 } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export interface TreeTableRow {
  id: string
  children?: TreeTableRow[]
  [key: string]: any
}

export interface TreeTableColumn<T = any> {
  key: string
  label: string
  headerClass?: string
  cellClass?: string
}

interface FlatRow {
  row: TreeTableRow
  depth: number
  hasChildren: boolean
  parentId: string | null
}

/**
 * <uip-tree-table> — Hierarchical data grid with expandable nested rows,
 * column definitions, multi-row selection, and loading states.
 */
export class UipTreeTable extends LitElement {
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
    indent: { type: Number },
    defaultExpanded: { type: Boolean, attribute: 'default-expanded' },
    selectable: { type: Boolean },
    loading: { type: Boolean },
    emptyText: { type: String, attribute: 'empty-text' },
    selected: { type: Array, attribute: false },
    renderCell: { attribute: false },
    expandIcon: { attribute: false },
    expandedSet: { state: true },
    internalSelected: { state: true },
  }

  data: TreeTableRow[] = []
  columns: TreeTableColumn[] = []
  indent = 24
  defaultExpanded = false
  selectable = false
  loading = false
  emptyText = 'No data.'
  selected?: string[]
  renderCell?: (col: TreeTableColumn, row: TreeTableRow, depth: number) => unknown
  expandIcon?: (expanded: boolean) => unknown

  expandedSet = new Set<string>()
  internalSelected = new Set<string>()

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'tree-table')
    if (this.defaultExpanded) {
      this.expandAll()
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('defaultExpanded') || changedProperties.has('data')) {
      if (this.defaultExpanded) {
        this.expandAll()
      }
    }
  }

  private expandAll() {
    const next = new Set<string>()
    const walk = (rows: TreeTableRow[]) => {
      for (const row of rows) {
        if (row.children?.length) {
          next.add(row.id)
          walk(row.children)
        }
      }
    }
    walk(this.data)
    this.expandedSet = next
  }

  private toggle(id: string) {
    const next = new Set(this.expandedSet)
    const expanded = !next.has(id)
    if (expanded) next.add(id)
    else next.delete(id)
    this.expandedSet = next
    this.dispatchEvent(
      new CustomEvent('expand', {
        detail: { id, expanded },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private toggleSelect(id: string) {
    const current = this.selected ? new Set(this.selected) : new Set(this.internalSelected)
    if (current.has(id)) current.delete(id)
    else current.add(id)
    this.internalSelected = current
    const ids = Array.from(current)
    this.dispatchEvent(
      new CustomEvent('selected-change', {
        detail: { ids },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private toggleSelectAll(flatRows: FlatRow[]) {
    const current = this.selected ? new Set(this.selected) : new Set(this.internalSelected)
    const allSelected = flatRows.length > 0 && flatRows.every((f) => current.has(f.row.id))
    const next = new Set<string>()
    if (!allSelected) {
      flatRows.forEach((f) => next.add(f.row.id))
    }
    this.internalSelected = next
    const ids = Array.from(next)
    this.dispatchEvent(
      new CustomEvent('selected-change', {
        detail: { ids },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private flattenRows(): FlatRow[] {
    const result: FlatRow[] = []
    const walk = (rows: TreeTableRow[], depth: number, parentId: string | null) => {
      for (const row of rows) {
        const hasChildren = Boolean(row.children && row.children.length > 0)
        result.push({ row, depth, hasChildren, parentId })
        if (hasChildren && this.expandedSet.has(row.id)) {
          walk(row.children!, depth + 1, row.id)
        }
      }
    }
    walk(this.data, 0, null)
    return result
  }

  render() {
    const flatRows = this.flattenRows()
    const selectedSet = this.selected ? new Set(this.selected) : this.internalSelected
    const isAllSelected = flatRows.length > 0 && flatRows.every((f) => selectedSet.has(f.row.id))
    const isSomeSelected = flatRows.some((f) => selectedSet.has(f.row.id)) && !isAllSelected

    return html`
      <div part="base" class="relative w-full overflow-hidden rounded-lg border border-border bg-card">
        ${this.loading
          ? html`
              <div
                class="bg-background/80 absolute inset-0 z-20 flex items-center justify-center backdrop-blur-xs"
              >
                ${icon(Loader2, 'loader-2', 'size-6 animate-spin text-primary')}
              </div>
            `
          : nothing}

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead class="border-b border-border bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
              <tr>
                ${this.selectable
                  ? html`
                      <th class="w-10 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          class="rounded border-input text-primary focus:ring-ring size-4"
                          .checked=${isAllSelected}
                          .indeterminate=${isSomeSelected}
                          @change=${() => this.toggleSelectAll(flatRows)}
                        />
                      </th>
                    `
                  : nothing}
                ${this.columns.map(
                  (col) => html`<th class=${cn('px-4 py-3 font-semibold', col.headerClass)}>${col.label}</th>`,
                )}
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              ${flatRows.length === 0
                ? html`
                    <tr>
                      <td
                        colspan=${this.columns.length + (this.selectable ? 1 : 0)}
                        class="text-muted-foreground px-4 py-8 text-center"
                      >
                        ${this.emptyText}
                      </td>
                    </tr>
                  `
                : flatRows.map(({ row, depth, hasChildren }) => {
                    const isRowSelected = selectedSet.has(row.id)
                    const isExpanded = this.expandedSet.has(row.id)

                    return html`
                      <tr
                        class=${cn(
                          'hover:bg-muted/50 transition-colors',
                          isRowSelected && 'bg-primary/5',
                        )}
                      >
                        ${this.selectable
                          ? html`
                              <td class="w-10 px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  class="rounded border-input text-primary focus:ring-ring size-4"
                                  .checked=${isRowSelected}
                                  @change=${() => this.toggleSelect(row.id)}
                                />
                              </td>
                            `
                          : nothing}
                        ${this.columns.map((col, colIdx) => {
                          const customCell = this.renderCell ? this.renderCell(col, row, depth) : undefined

                          if (colIdx === 0) {
                            return html`
                              <td class=${cn('px-4 py-2 font-medium', col.cellClass)}>
                                <div class="flex items-center gap-1.5" style="padding-left: ${depth * this.indent}px;">
                                  ${hasChildren
                                    ? html`
                                        <button
                                          type="button"
                                          class="text-muted-foreground hover:text-foreground flex size-5 items-center justify-center rounded p-0.5"
                                          @click=${() => this.toggle(row.id)}
                                        >
                                          ${this.expandIcon
                                            ? this.expandIcon(isExpanded)
                                            : html`
                                                <span
                                                  class=${cn(
                                                    'inline-block transition-transform duration-150',
                                                    isExpanded && 'rotate-90',
                                                  )}
                                                >
                                                  ${icon(ChevronRight, 'chevron-right', 'size-3.5')}
                                                </span>
                                              `}
                                        </button>
                                      `
                                    : html`<span class="size-5 shrink-0"></span>`}
                                  ${customCell ?? row[col.key]}
                                </div>
                              </td>
                            `
                          }

                          return html`
                            <td class=${cn('px-4 py-2', col.cellClass)}>
                              ${customCell ?? row[col.key]}
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
    `
  }
}

customElements.get('uip-tree-table') || customElements.define('uip-tree-table', UipTreeTable)

declare global {
  interface HTMLElementTagNameMap {
    'uip-tree-table': UipTreeTable
  }
}
