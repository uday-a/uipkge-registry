import { Component, EventEmitter, Input, Output, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export interface TreeTableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  width?: string
  render?: (row: T) => string
}

export interface TreeTableRow<T = Record<string, unknown>> {
  id: string
  data: T
  children?: TreeTableRow<T>[]
  disabled?: boolean
}

export interface FlatTreeRow<T = Record<string, unknown>> {
  row: TreeTableRow<T>
  depth: number
}

/**
 * Angular port of UIPKGE TreeTable — hierarchical table with expandable
 * rows, per-level indent, selection checkboxes, loading overlay and empty
 * state. Same props/events as Vue.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-tree-table, [ui-tree-table]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"tree-table"',
    '[attr.data-uipkge]': '""',
    '[attr.data-loading]': 'loading ? "" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiTreeTableComponent<T = Record<string, unknown>> {
  @Input() data: TreeTableRow<T>[] = []
  @Input() columns: TreeTableColumn<T>[] = []
  @Input() indent = 24
  @Input({ transform: booleanAttribute }) defaultExpanded = false
  @Input({ transform: booleanAttribute }) selectable = false
  @Input({ transform: booleanAttribute }) loading = false
  @Input() emptyText = 'No data.'
  /** Controlled selected row ids. Leave unset for uncontrolled use (React `selected`). */
  @Input() selected?: string[]
  @Input('class') className?: string
  @Output() selectedChange = new EventEmitter<string[]>()
  @Output() select = new EventEmitter<string[]>()
  /** React `onExpand(id, expanded)` — single object payload (Angular emitters carry one value). */
  @Output() expand = new EventEmitter<{ id: string; expanded: boolean }>()

  expanded = new Set<string>()
  private initialized = false
  private internalSelected = new Set<string>()

  get hostClass(): string {
    return cn('block relative w-full overflow-auto', this.className)
  }

  private ensureInit(): void {
    if (this.initialized) return
    this.initialized = true
    if (this.defaultExpanded) this.expanded = this.collectExpandable(this.data)
  }

  collectExpandable(rows: TreeTableRow<T>[]): Set<string> {
    const s = new Set<string>()
    const walk = (items: TreeTableRow<T>[]) => {
      for (const r of items) {
        if (r.children?.length) {
          s.add(r.id)
          walk(r.children)
        }
      }
    }
    walk(rows)
    return s
  }

  isExpanded(id: string): boolean {
    this.ensureInit()
    return this.expanded.has(id)
  }

  toggle(id: string): void {
    this.ensureInit()
    const next = new Set(this.expanded)
    const on = !next.has(id)
    if (on) next.add(id)
    else next.delete(id)
    this.expanded = next
    this.expand.emit({ id, expanded: on })
  }

  visibleRows(): FlatTreeRow<T>[] {
    this.ensureInit()
    const out: FlatTreeRow<T>[] = []
    const walk = (items: TreeTableRow<T>[], depth: number) => {
      for (const r of items) {
        out.push({ row: r, depth })
        if (r.children?.length && this.expanded.has(r.id)) walk(r.children, depth + 1)
      }
    }
    walk(this.data, 0)
    return out
  }

  indentStyle(depth: number): Record<string, string> {
    return { 'padding-left': `${depth * this.indent + 12}px` }
  }

  /** Controlled `selected` wins when provided; otherwise internal state (React parity). */
  get selectedSet(): Set<string> {
    return this.selected ? new Set(this.selected) : this.internalSelected
  }

  isSelected(id: string): boolean {
    return this.selectedSet.has(id)
  }

  toggleSelect(id: string): void {
    const set = new Set(this.selectedSet)
    if (set.has(id)) set.delete(id)
    else set.add(id)
    const next = [...set]
    if (this.selected === undefined) this.internalSelected = set
    this.selectedChange.emit(next)
    this.select.emit(next)
  }

  cellText(row: TreeTableRow<T>, col: TreeTableColumn<T>): string {
    if (col.render) return col.render(row.data)
    const v = (row.data as Record<string, unknown>)[col.key]
    return v == null ? '' : String(v)
  }
}
