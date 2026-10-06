import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type TableDensity = 'compact' | 'cozy' | 'comfortable'

export function tableDensityClass(density: TableDensity): string {
  if (density === 'compact') return '[&_td]:py-1.5 [&_td]:text-xs [&_th]:h-8 [&_th]:text-xs'
  if (density === 'comfortable') return '[&_td]:py-3 [&_th]:h-12'
  return ''
}

/**
 * Angular port of UIPKGE Table — plain table primitives with registry
 * borders/padding/tokens. Same parts as Vue (Table, Header, Body, Footer,
 * Row, Head, Cell, Caption, Empty) and same density scale. The scroll
 * container lives on the host so sticky headers keep working.
 *
 * The root `<ui-table>` element form is safe: it renders its own wrapper
 * (the host) plus the inner `<table>`, so nothing custom sits inside a
 * table in the SSR HTML.
 *
 * DEPRECATED — element forms of the parts that live INSIDE the table:
 * `<ui-table-header>`, `<ui-table-body>`, `<ui-table-footer>`,
 * `<ui-table-row>`, `<ui-table-head>`, `<ui-table-cell>`, `<ui-table-caption>`.
 * When the browser parses SSR HTML, any unknown element inside `<table>`
 * is foster-parented out of the table, so hydration finds a broken table.
 * They still work for client-only rendering and are kept so existing
 * consumers don't break, but use the native element + attribute form:
 *
 *   <ui-table>
 *     <caption ui-table-caption>…</caption>
 *     <thead ui-table-header><tr ui-table-row><th ui-table-head>…</th></tr></thead>
 *     <tbody ui-table-body><tr ui-table-row><td ui-table-cell>…</td></tr></tbody>
 *     <tfoot ui-table-footer><tr ui-table-row><td ui-table-cell>…</td></tr></tfoot>
 *   </ui-table>
 *
 * (Not tagged `@deprecated`: the attribute form shares the same class, so
 * the tag would wrongly flag the recommended usage too.)
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-table, [ui-table]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"table-container"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<table data-uipkge data-slot="table" [class]="tableClass">
    <ng-content />
  </table>`,
})
export class UiTableComponent {
  @Input('class') className?: string
  @Input() containerClass?: string
  @Input() density: TableDensity = 'cozy'

  get hostClass(): string {
    return cn('block relative w-full overflow-auto', this.containerClass)
  }

  get tableClass(): string {
    return cn('w-full caption-bottom text-sm', tableDensityClass(this.density), this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-header, [ui-table-header]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-header"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableHeaderComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('table-header-group bg-muted/50 [&_tr]:border-b', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-body, [ui-table-body]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-body"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableBodyComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('table-row-group [&_tr:last-child]:border-0', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-footer, [ui-table-footer]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-footer"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableFooterComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('table-footer-group bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-row, [ui-table-row]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-row"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableRowComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'table-row hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors duration-150',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-head, [ui-table-head]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-head"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableHeadComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'table-cell text-foreground h-10 px-3 text-left align-middle text-sm font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-cell, [ui-table-cell]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-cell"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableCellComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn(
      'table-cell px-3 py-2 align-middle text-sm whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  // Element form deprecated (SSR foster-parenting) — see the note on UiTableComponent.
  selector: 'ui-table-caption, [ui-table-caption]',
  standalone: true,
  host: { '[attr.data-slot]': '"table-caption"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<ng-content />`,
})
export class UiTableCaptionComponent {
  @Input('class') className?: string
  get hostClass(): string {
    return cn('table-caption text-muted-foreground mt-4 text-sm', this.className)
  }
}

/**
 * Empty-state row. Attribute selector on a native <tr> ON PURPOSE: a custom
 * <ui-table-empty> element inside <table>/<tbody> is foster-parented out of
 * the table by the HTML parser when the browser parses SSR HTML, so
 * hydration finds an empty table and crashes. The same applies to every
 * table part — always use <thead ui-table-header>, <tbody ui-table-body>,
 * <tr ui-table-row>, <th ui-table-head> and <td ui-table-cell>, never the
 * element form, inside a table.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tr[ui-table-empty]',
  standalone: true,
  imports: [UiTableCellComponent],
  host: { '[attr.data-slot]': '"table-empty"', '[attr.data-uipkge]': '""', '[class]': 'hostClass' },
  template: `<td ui-table-cell [attr.colspan]="colSpan" [class]="cellClass"><div class="flex items-center justify-center py-10"><ng-content /></div></td>`,
})
export class UiTableEmptyComponent {
  @Input() colSpan = 1
  @Input('class') className?: string
  get hostClass(): string {
    // The host IS the row (React renders a TableRow root), so it carries the
    // row classes directly — no wrapper element inside the tbody.
    return cn(
      'table-row hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors duration-150',
      this.className,
    )
  }
  get cellClass(): string {
    return 'text-foreground p-4 align-middle text-sm whitespace-nowrap'
  }
}
