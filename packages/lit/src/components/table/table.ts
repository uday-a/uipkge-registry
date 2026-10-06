import { LitElement, css, html, nothing } from 'lit'
import { cn } from '../../lib/utils'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'

export type TableDensity = 'compact' | 'cozy' | 'comfortable'

/** One column: `key` reads `row[key]` and names the column's parts (`head-<key>`, `cell-<key>`). */
export interface TableColumn {
  key: string
  /** Header text (defaults to `key`). Rich markup: slot="head-<key>". */
  header?: string
}

/** A footer cell (React's `<TableFooter><TableRow><TableCell colSpan>`). */
export interface TableFooterCell {
  value?: string
  colSpan?: number
}

export type TableRowData = Record<string, unknown>

/**
 * <uip-table> — the registry Table as ONE data-driven web component.
 *
 * Why data-driven: the HTML parser drops or re-parents custom elements placed
 * between <table>/<tr>/<td>, so `<uip-table-row>`-style parts can't keep
 * table semantics; and a light-DOM <table> the element merely decorates
 * would be styled by the page's CSS, not the shared shadow sheet. So the
 * whole <table> (container > table > caption/thead/tbody/tfoot > tr > th/td)
 * is rendered in one shadow root from `columns` / `rows` / `footer`, with
 * React's class strings and data-slot attributes. Native table semantics
 * (roles, headers, colspan) are the browser's own.
 *
 * Rich cell content (badges, links, checkboxes) is slotted light DOM, so it
 * keeps the page's styles and framework bindings:
 *   slot="head-<key>"            header cell
 *   slot="cell-<rowIndex>-<key>" body cell (fallback: String(row[key]))
 *   slot="footer-<r>-<c>"        footer cell (fallback: cell.value)
 *   slot="caption"               caption (fallback: `caption`)
 *   slot="empty"                 empty-state row, shown when `rows` is empty (fallback: `empty`) —
 *                                React's "Empty" story row: one spanning cell,
 *                                `text-muted-foreground h-24 text-center`, no row hover
 *
 * Properties: `density`, `caption`, `empty`.
 *
 * React's per-element `className`s become shadow parts, styled from the page
 * with `class="[&::part(<name>)]:…"` on the host:
 *   container (React's `containerClassName`), base (<table>, React's
 *   `<Table className>`), caption, header (<thead>), body (<tbody>),
 *   footer (<tfoot>), row (every body <tr>, plus `row-odd` / `row-even` —
 *   `::part()` can't take `:nth-child`, so zebra striping is
 *   `[&::part(row-odd)]:bg-muted/40`), head (every <th>) + `head-<key>`,
 *   cell (every body / footer <td>) + `cell-<key>` for body cells and
 *   `footer-cell` + `footer-cell-<index>` for footer cells, and `empty-row` /
 *   `empty-cell` for the empty-state row.
 * E.g. a right-aligned amount column:
 *   `[&::part(head-amount)]:text-right [&::part(cell-amount)]:text-right`.
 */
export class UipTable extends LitElement {
  // :host display can't be a utility class (the host has no template of its own).
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    columns: { type: Array },
    rows: { type: Array },
    footer: { type: Array },
    caption: {},
    empty: {},
    density: { reflect: true },
  }

  columns: TableColumn[] = []
  rows: TableRowData[] = []
  footer: TableFooterCell[][] = []
  caption?: string
  empty?: string
  density?: TableDensity
  private childObserver?: MutationObserver

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'table')
    // Caption / empty slots decide whether their wrappers render at all.
    this.childObserver = new MutationObserver(() => this.requestUpdate())
    this.childObserver.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'], subtree: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  private hasSlotted(name: string) {
    return [...this.children].some((c) => c.getAttribute('slot') === name)
  }

  render() {
    const densityClass =
      this.density === 'compact'
        ? '[&_td]:py-1.5 [&_td]:text-xs [&_th]:h-8 [&_th]:text-xs'
        : this.density === 'comfortable'
          ? '[&_td]:py-3 [&_th]:h-12'
          : // cozy is the TableCell/TableHead baseline (py-2 / h-10) -- no override.
            ''
    const rowClasses = 'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors duration-150'
    const headClasses =
      'text-foreground h-10 px-3 text-left align-middle text-sm font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'
    const cellClasses =
      'px-3 py-2 align-middle text-sm whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'
    const showCaption = this.caption != null || this.hasSlotted('caption')
    const showEmpty = this.rows.length === 0 && (this.empty != null || this.hasSlotted('empty'))

    return html`<div
      part="container"
      data-uipkge=""
      data-slot="table-container"
      class="relative w-full overflow-auto"
    >
      <table part="base" data-uipkge="" data-slot="table" class=${cn('w-full caption-bottom text-sm', densityClass)}>
        ${showCaption
          ? html`<caption part="caption" data-uipkge="" data-slot="table-caption" class="text-muted-foreground mt-4 text-sm">
              <slot name="caption">${this.caption ?? nothing}</slot>
            </caption>`
          : nothing}
        ${this.columns.length
          ? html`<thead part="header" data-uipkge="" data-slot="table-header" class="bg-muted/50 [&_tr]:border-b">
              <tr data-uipkge="" data-slot="table-row" class=${rowClasses}>
                ${this.columns.map(
                  (c) => html`<th part=${`head head-${c.key}`} data-uipkge="" data-slot="table-head" class=${headClasses}>
                    <slot name=${`head-${c.key}`}>${c.header ?? c.key}</slot>
                  </th>`,
                )}
              </tr>
            </thead>`
          : nothing}
        <tbody part="body" data-uipkge="" data-slot="table-body" class="[&_tr:last-child]:border-0">
          ${this.rows.map(
            (row, r) => html`<tr part=${`row ${r % 2 === 0 ? 'row-odd' : 'row-even'}`} data-uipkge="" data-slot="table-row" class=${rowClasses}>
              ${this.columns.map(
                (c) => html`<td part=${`cell cell-${c.key}`} data-uipkge="" data-slot="table-cell" class=${cellClasses}>
                  <slot name=${`cell-${r}-${c.key}`}>${row[c.key] == null ? nothing : String(row[c.key])}</slot>
                </td>`,
              )}
            </tr>`,
          )}
          ${showEmpty
            ? html`<tr part="empty-row" data-uipkge="" data-slot="table-row" class=${cn(rowClasses, 'hover:bg-transparent')}>
                <td
                  part="empty-cell"
                  data-uipkge=""
                  data-slot="table-cell"
                  colspan=${Math.max(1, this.columns.length)}
                  class=${cn(cellClasses, 'text-muted-foreground h-24 text-center text-sm')}
                >
                  <slot name="empty">${this.empty ?? nothing}</slot>
                </td>
              </tr>`
            : nothing}
        </tbody>
        ${this.footer.length
          ? html`<tfoot
              part="footer"
              data-uipkge=""
              data-slot="table-footer"
              class="bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"
            >
              ${this.footer.map(
                (cells, r) => html`<tr data-uipkge="" data-slot="table-row" class=${rowClasses}>
                  ${cells.map(
                    (cell, i) => html`<td
                      part=${`cell footer-cell footer-cell-${i}`}
                      data-uipkge=""
                      data-slot="table-cell"
                      colspan=${cell.colSpan ?? nothing}
                      class=${cellClasses}
                    >
                      <slot name=${`footer-${r}-${i}`}>${cell.value ?? nothing}</slot>
                    </td>`,
                  )}
                </tr>`,
              )}
            </tfoot>`
          : nothing}
      </table>
    </div>`
  }
}

customElements.get('uip-table') || customElements.define('uip-table', UipTable)

declare global {
  interface HTMLElementTagNameMap {
    'uip-table': UipTable
  }
}
