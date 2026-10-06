import { Component, Input } from '@angular/core'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import {
  UiDataTableComponent,
  type DataTableColumn,
} from '../../../../../packages/registry-angular/components/data-table/data-table.component'
import {
  UiTableBodyComponent,
  UiTableCellComponent,
  UiTableComponent,
  UiTableEmptyComponent,
  UiTableHeadComponent,
  UiTableHeaderComponent,
  UiTableRowComponent,
} from '../../../../../packages/registry-angular/components/table/table.component'

/**
 * Angular demo for the data-table page. Mirrors demos/react/data-table.tsx story by story.
 *
 * The Angular DataTable is a headless state container (filter -> sort -> page pipeline with
 * search/sort/pageChange outputs); each story composes it with Table primitives the same way a
 * consumer app does.
 */
@Component({
  selector: 'angular-data-table-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBadgeComponent,
    UiDataTableComponent,
    UiTableBodyComponent,
    UiTableCellComponent,
    UiTableComponent,
    UiTableEmptyComponent,
    UiTableHeadComponent,
    UiTableHeaderComponent,
    UiTableRowComponent,
  ],
  template: `
    @switch (story) {
      @case ('Sortable columns') {
        <ui-data-table
          #dtSort
          [columns]="columns"
          [data]="employees"
          [enableSearch]="false"
          [enablePagination]="false"
        />
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of columns; track col.key) {
                <th ui-table-head scope="col" [attr.aria-sort]="col.sortable ? dtSort.ariaSort(col.key) : null">
                  @if (col.sortable) {
                    <button
                      type="button"
                      class="hover:text-foreground inline-flex items-center gap-1 font-medium"
                      (click)="dtSort.setSort(col.key)"
                    >
                      {{ col.label }}
                      <span class="text-muted-foreground font-mono text-xs" aria-hidden="true">
                        @if (dtSort.sortKey === col.key) {
                          {{ dtSort.sortDir === 'asc' ? '↑' : '↓' }}
                        } @else {
                          ↕
                        }
                      </span>
                    </button>
                  } @else {
                    {{ col.label }}
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (row of dtSort.sortedData(); track row['id']) {
              <tr ui-table-row>
                @for (col of columns; track col.key) {
                  <td ui-table-cell>
                    @if (col.key === 'status') {
                      @if (row['status'] === 'active') {
                        <span ui-badge variant="success">active</span>
                      } @else if (row['status'] === 'on_leave') {
                        <span ui-badge variant="warning">on leave</span>
                      } @else {
                        <span ui-badge variant="outline">{{ row['status'] }}</span>
                      }
                    } @else {
                      {{ row[col.key] }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('No search') {
        <ui-data-table
          #dtNoSearch
          [columns]="columns"
          [data]="employees"
          [enableSearch]="false"
          [pageSize]="4"
          (pageChange)="dtNoSearch.page = $event"
        />
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of columns; track col.key) {
                <th ui-table-head>{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (row of dtNoSearch.pagedData(); track row['id']) {
              <tr ui-table-row>
                @for (col of columns; track col.key) {
                  <td ui-table-cell>{{ row[col.key] }}</td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
        <div class="text-muted-foreground mt-2 flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            class="border-border bg-card hover:bg-muted rounded border px-2 py-1"
            [disabled]="dtNoSearch.page === 0"
            (click)="dtNoSearch.gotoPage(dtNoSearch.page - 1)"
          >
            Prev
          </button>
          <span>Page {{ dtNoSearch.page + 1 }} of {{ dtNoSearch.totalPages() }}</span>
          <button
            type="button"
            class="border-border bg-card hover:bg-muted rounded border px-2 py-1"
            [disabled]="dtNoSearch.page >= dtNoSearch.totalPages() - 1"
            (click)="dtNoSearch.gotoPage(dtNoSearch.page + 1)"
          >
            Next
          </button>
        </div>
      }
      @case ('No pagination') {
        <ui-data-table #dtNoPage [columns]="columns" [data]="employees" [enablePagination]="false" />
        <div class="mb-3">
          <input
            type="search"
            placeholder="Filter..."
            class="border-border bg-background w-full max-w-xs rounded-md border px-2.5 py-1.5 text-sm"
            [value]="dtNoPage.search"
            (input)="dtNoPage.search = $any($event.target).value"
          />
        </div>
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of columns; track col.key) {
                <th ui-table-head>{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (row of dtNoPage.sortedData(); track row['id']) {
              <tr ui-table-row>
                @for (col of columns; track col.key) {
                  <td ui-table-cell>{{ row[col.key] }}</td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
        <p class="text-muted-foreground mt-2 font-mono text-xs">
          {{ dtNoPage.sortedData().length }} rows (unpaginated)
        </p>
      }
      @case ('Sticky header') {
        <ui-data-table
          #dtSticky
          [columns]="columns"
          [data]="employees"
          [enableSearch]="false"
          [enablePagination]="false"
        />
        <div class="max-h-48 overflow-auto rounded-md border">
          <ui-table>
            <thead ui-table-header class="bg-background sticky top-0 z-10">
              <tr ui-table-row>
                @for (col of columns; track col.key) {
                  <th ui-table-head>{{ col.label }}</th>
                }
              </tr>
            </thead>
            <tbody ui-table-body>
              @for (row of dtSticky.sortedData(); track row['id']) {
                <tr ui-table-row>
                  @for (col of columns; track col.key) {
                    <td ui-table-cell>{{ row[col.key] }}</td>
                  }
                </tr>
              }
            </tbody>
          </ui-table>
        </div>
      }
      @case ('Density: compact') {
        <ui-data-table
          #dtCompact
          [columns]="columns"
          [data]="employees"
          [enableSearch]="false"
          [enablePagination]="false"
        />
        <ui-table density="compact">
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of columns; track col.key) {
                <th ui-table-head>{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (row of dtCompact.sortedData(); track row['id']) {
              <tr ui-table-row>
                @for (col of columns; track col.key) {
                  <td ui-table-cell>{{ row[col.key] }}</td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('Empty state') {
        <ui-data-table #dtEmpty [columns]="columns" [data]="[]" />
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of columns; track col.key) {
                <th ui-table-head>{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @if (dtEmpty.sortedData().length === 0) {
              <ui-table-empty>No employees match your search.</ui-table-empty>
            }
          </tbody>
        </ui-table>
      }
      @default {
        <ui-data-table
          #dtDefault
          [columns]="columns"
          [data]="employees"
          [pageSize]="4"
          (pageChange)="dtDefault.page = $event"
        />
        <div class="mb-3">
          <input
            type="search"
            placeholder="Filter..."
            class="border-border bg-background w-full max-w-xs rounded-md border px-2.5 py-1.5 text-sm"
            [value]="dtDefault.search"
            (input)="dtDefault.search = $any($event.target).value"
          />
        </div>
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of columns; track col.key) {
                <th ui-table-head scope="col" [attr.aria-sort]="col.sortable ? dtDefault.ariaSort(col.key) : null">
                  @if (col.sortable) {
                    <button
                      type="button"
                      class="hover:text-foreground inline-flex items-center gap-1 font-medium"
                      (click)="dtDefault.setSort(col.key)"
                    >
                      {{ col.label }}
                      <span class="text-muted-foreground font-mono text-xs" aria-hidden="true">
                        @if (dtDefault.sortKey === col.key) {
                          {{ dtDefault.sortDir === 'asc' ? '↑' : '↓' }}
                        } @else {
                          ↕
                        }
                      </span>
                    </button>
                  } @else {
                    {{ col.label }}
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (row of dtDefault.pagedData(); track row['id']) {
              <tr ui-table-row>
                @for (col of columns; track col.key) {
                  <td ui-table-cell>
                    @if (col.key === 'status') {
                      @if (row['status'] === 'active') {
                        <span ui-badge variant="success">active</span>
                      } @else if (row['status'] === 'on_leave') {
                        <span ui-badge variant="warning">on leave</span>
                      } @else {
                        <span ui-badge variant="outline">{{ row['status'] }}</span>
                      }
                    } @else {
                      {{ row[col.key] }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
        <div class="text-muted-foreground mt-2 flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            class="border-border bg-card hover:bg-muted rounded border px-2 py-1"
            [disabled]="dtDefault.page === 0"
            (click)="dtDefault.gotoPage(dtDefault.page - 1)"
          >
            Prev
          </button>
          <span>Page {{ dtDefault.page + 1 }} of {{ dtDefault.totalPages() }}</span>
          <button
            type="button"
            class="border-border bg-card hover:bg-muted rounded border px-2 py-1"
            [disabled]="dtDefault.page >= dtDefault.totalPages() - 1"
            (click)="dtDefault.gotoPage(dtDefault.page + 1)"
          >
            Next
          </button>
        </div>
      }
    }
  `,
})
export class AngularDataTableDemoComponent {
  @Input() story = 'Default — fully featured'

  protected readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'status', label: 'Status' },
  ]

  protected readonly employees: Record<string, unknown>[] = [
    { id: '1', name: 'James Carter', role: 'Backend Engineer', department: 'Engineering', status: 'active' },
    { id: '2', name: 'Elena Rossi', role: 'Tech Writer', department: 'Marketing', status: 'active' },
    { id: '3', name: 'Marcus Hale', role: 'Data Scientist', department: 'Product', status: 'on_leave' },
    { id: '4', name: 'Sophie Bennett', role: 'Senior Engineer', department: 'Engineering', status: 'active' },
    { id: '5', name: 'Daniel Price', role: 'Designer', department: 'Design', status: 'terminated' },
    { id: '6', name: 'Claire Donovan', role: 'PM', department: 'Product', status: 'active' },
  ]
}
