import { Component, Input } from '@angular/core'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import {
  UiTableBodyComponent,
  UiTableCaptionComponent,
  UiTableCellComponent,
  UiTableComponent,
  UiTableEmptyComponent,
  UiTableFooterComponent,
  UiTableHeadComponent,
  UiTableHeaderComponent,
  UiTableRowComponent,
} from '../../../../../packages/registry-angular/components/table/table.component'

interface Invoice {
  invoice: string
  status: 'Paid' | 'Pending' | 'Unpaid'
  method: string
  amount: string
}

/** Angular demo for the table page. Mirrors demos/react/table.tsx story by story. */
@Component({
  selector: 'angular-table-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBadgeComponent,
    UiTableBodyComponent,
    UiTableCaptionComponent,
    UiTableCellComponent,
    UiTableComponent,
    UiTableEmptyComponent,
    UiTableFooterComponent,
    UiTableHeadComponent,
    UiTableHeaderComponent,
    UiTableRowComponent,
  ],
  template: `
    @switch (story) {
      @case ('With caption') {
        <ui-table>
          <caption ui-table-caption
            >Showing {{ invoices.length }} invoices · total &#36;{{ totals.toFixed(2) }}</caption
          >
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head>Invoice</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (i of invoices; track i.invoice) {
              <tr ui-table-row>
                <td ui-table-cell>{{ i.invoice }}</td>
                <td ui-table-cell class="text-right tabular-nums">{{ i.amount }}</td>
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('Striped rows') {
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head>Invoice</th>
              <th ui-table-head>Status</th>
              <th ui-table-head>Method</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (i of invoices; track i.invoice) {
              <tr ui-table-row class="odd:bg-muted/40">
                <td ui-table-cell class="font-medium">{{ i.invoice }}</td>
                <td ui-table-cell>{{ i.status }}</td>
                <td ui-table-cell class="text-muted-foreground">{{ i.method }}</td>
                <td ui-table-cell class="text-right tabular-nums">{{ i.amount }}</td>
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('With footer / totals row') {
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head>Invoice</th>
              <th ui-table-head>Method</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (i of invoices; track i.invoice) {
              <tr ui-table-row>
                <td ui-table-cell class="font-medium">{{ i.invoice }}</td>
                <td ui-table-cell class="text-muted-foreground">{{ i.method }}</td>
                <td ui-table-cell class="text-right tabular-nums">{{ i.amount }}</td>
              </tr>
            }
          </tbody>
          <tfoot ui-table-footer>
            <tr ui-table-row>
              <td ui-table-cell>Total</td>
              <td ui-table-cell></td>
              <td ui-table-cell class="text-right font-bold tabular-nums">&#36;{{ totals.toFixed(2) }}</td>
            </tr>
          </tfoot>
        </ui-table>
      }
      @case ('Compact density') {
        <ui-table density="compact">
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head>Invoice</th>
              <th ui-table-head>Status</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (i of invoices; track i.invoice) {
              <tr ui-table-row>
                <td ui-table-cell class="font-medium">{{ i.invoice }}</td>
                <td ui-table-cell>
                  @if (i.status === 'Paid') {
                    <span ui-badge>{{ i.status }}</span>
                  } @else if (i.status === 'Pending') {
                    <span ui-badge variant="secondary">{{ i.status }}</span>
                  } @else {
                    <span ui-badge variant="outline">{{ i.status }}</span>
                  }
                </td>
                <td ui-table-cell class="text-right tabular-nums">{{ i.amount }}</td>
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('Sticky header') {
        <div class="max-h-48 overflow-auto rounded-md border">
          <ui-table>
            <thead ui-table-header class="bg-background sticky top-0 z-10">
              <tr ui-table-row>
                <th ui-table-head>Invoice</th>
                <th ui-table-head>Status</th>
                <th ui-table-head class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody ui-table-body>
              @for (n of stickyRows; track n) {
                <tr ui-table-row>
                  <td ui-table-cell class="font-medium">INV{{ n.toString().padStart(3, '0') }}</td>
                  <td ui-table-cell>{{ n % 3 === 0 ? 'Pending' : 'Paid' }}</td>
                  <td ui-table-cell class="text-right tabular-nums">&#36;{{ (120 + n * 17).toFixed(2) }}</td>
                </tr>
              }
            </tbody>
          </ui-table>
        </div>
      }
      @case ('Empty') {
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head>Invoice</th>
              <th ui-table-head>Status</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            <ui-table-empty [colSpan]="3">No invoices yet.</ui-table-empty>
          </tbody>
        </ui-table>
      }
      @default {
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head class="w-32">Invoice</th>
              <th ui-table-head>Status</th>
              <th ui-table-head>Method</th>
              <th ui-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (i of invoices; track i.invoice) {
              <tr ui-table-row>
                <td ui-table-cell class="font-medium">{{ i.invoice }}</td>
                <td ui-table-cell>
                  @if (i.status === 'Paid') {
                    <span ui-badge>{{ i.status }}</span>
                  } @else if (i.status === 'Pending') {
                    <span ui-badge variant="secondary">{{ i.status }}</span>
                  } @else {
                    <span ui-badge variant="outline">{{ i.status }}</span>
                  }
                </td>
                <td ui-table-cell class="text-muted-foreground">{{ i.method }}</td>
                <td ui-table-cell class="text-right font-medium tabular-nums">{{ i.amount }}</td>
              </tr>
            }
          </tbody>
        </ui-table>
      }
    }
  `,
})
export class AngularTableDemoComponent {
  @Input() story = 'Default'

  protected readonly invoices: Invoice[] = [
    { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
    { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$420.00' },
  ]

  protected readonly stickyRows = Array.from({ length: 12 }, (_, i) => i + 1)

  protected get totals(): number {
    return this.invoices.reduce((s, i) => s + parseFloat(i.amount.replace('$', '').replace(',', '')), 0)
  }
}
