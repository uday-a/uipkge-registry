import { Component, Input } from '@angular/core'
import {
  UiPaginationComponent,
  UiPaginationEllipsisComponent,
  UiPaginationFirstComponent,
  UiPaginationLastComponent,
  UiPaginationListComponent,
  UiPaginationListItemComponent,
  UiPaginationNextComponent,
  UiPaginationPrevComponent,
} from '../../../../../packages/registry-angular/components/pagination/pagination.component'

// The parts are presentational (like the React port): the caller computes the page window.
// Same helper as demos/react/pagination.tsx (mirrors reka-ui's page items with optional edges).
type PageItem = { type: 'page'; value: number } | { type: 'ellipsis' }

function pageItems(
  page: number,
  total: number,
  itemsPerPage: number,
  siblingCount: number,
  showEdges: boolean,
): PageItem[] {
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage))
  const items: PageItem[] = []
  const start = Math.max(showEdges ? 2 : 1, page - siblingCount)
  const end = Math.min(showEdges ? totalPages - 1 : totalPages, page + siblingCount)
  if (showEdges) {
    items.push({ type: 'page', value: 1 })
    if (start > 2) items.push({ type: 'ellipsis' })
  } else if (start > 1) {
    items.push({ type: 'ellipsis' })
  }
  for (let p = start; p <= end; p++) items.push({ type: 'page', value: p })
  if (showEdges) {
    if (end < totalPages - 1) items.push({ type: 'ellipsis' })
    if (totalPages > 1) items.push({ type: 'page', value: totalPages })
  } else if (end < totalPages) {
    items.push({ type: 'ellipsis' })
  }
  return items
}

const btnBase =
  'inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'

/** Angular demo for the pagination page. Mirrors demos/react/pagination.tsx story by story. */
@Component({
  selector: 'angular-pagination-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiPaginationComponent,
    UiPaginationListComponent,
    UiPaginationListItemComponent,
    UiPaginationFirstComponent,
    UiPaginationPrevComponent,
    UiPaginationNextComponent,
    UiPaginationLastComponent,
    UiPaginationEllipsisComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <nav ui-pagination>
          <ul ui-pagination-list class="flex items-center gap-1">
            <li ui-pagination-list-item>
              <button ui-pagination-first [class]="navBtnClass" (click)="defaultPage = 1"></button>
            </li>
            <li ui-pagination-list-item>
              <button ui-pagination-prev [class]="navBtnClass" (click)="defaultPage = max(1, defaultPage - 1)"></button>
            </li>
            @for (item of pageItems(defaultPage, 100, 10, 1, true); track $index) {
              @if (item.type === 'page') {
                <li ui-pagination-list-item>
                  <button
                    type="button"
                    [attr.aria-label]="'Go to page ' + item.value"
                    [attr.aria-current]="item.value === defaultPage ? 'page' : null"
                    [class]="pageBtnClass(item.value === defaultPage)"
                    (click)="defaultPage = item.value"
                  >
                    {{ item.value }}
                  </button>
                </li>
              } @else {
                <li ui-pagination-list-item>
                  <span
                    ui-pagination-ellipsis
                    class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
                    >…</span
                  >
                </li>
              }
            }
            <li ui-pagination-list-item>
              <button
                ui-pagination-next
                [class]="navBtnClass"
                (click)="defaultPage = min(10, defaultPage + 1)"
              ></button>
            </li>
            <li ui-pagination-list-item>
              <button ui-pagination-last [class]="navBtnClass" (click)="defaultPage = 10"></button>
            </li>
          </ul>
        </nav>
      }
      @case ('Compact (no siblings)') {
        <nav ui-pagination>
          <ul ui-pagination-list class="flex items-center gap-1">
            <li ui-pagination-list-item>
              <button ui-pagination-prev [class]="navBtnClass" (click)="compactPage = max(1, compactPage - 1)"></button>
            </li>
            @for (item of pageItems(compactPage, 200, 10, 0, true); track $index) {
              @if (item.type === 'page') {
                <li ui-pagination-list-item>
                  <button
                    type="button"
                    [attr.aria-label]="'Go to page ' + item.value"
                    [attr.aria-current]="item.value === compactPage ? 'page' : null"
                    [class]="pageBtnClass(item.value === compactPage)"
                    (click)="compactPage = item.value"
                  >
                    {{ item.value }}
                  </button>
                </li>
              } @else {
                <li ui-pagination-list-item>
                  <span
                    ui-pagination-ellipsis
                    class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
                    >…</span
                  >
                </li>
              }
            }
            <li ui-pagination-list-item>
              <button
                ui-pagination-next
                [class]="navBtnClass"
                (click)="compactPage = min(20, compactPage + 1)"
              ></button>
            </li>
          </ul>
        </nav>
      }
      @case ('Without first/last edges') {
        <nav ui-pagination>
          <ul ui-pagination-list class="flex items-center gap-1">
            <li ui-pagination-list-item>
              <button ui-pagination-prev [class]="navBtnClass" (click)="noEdgePage = max(1, noEdgePage - 1)"></button>
            </li>
            @for (item of pageItems(noEdgePage, 100, 10, 1, false); track $index) {
              @if (item.type === 'page') {
                <li ui-pagination-list-item>
                  <button
                    type="button"
                    [attr.aria-label]="'Go to page ' + item.value"
                    [attr.aria-current]="item.value === noEdgePage ? 'page' : null"
                    [class]="pageBtnClass(item.value === noEdgePage)"
                    (click)="noEdgePage = item.value"
                  >
                    {{ item.value }}
                  </button>
                </li>
              } @else {
                <li ui-pagination-list-item>
                  <span
                    ui-pagination-ellipsis
                    class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
                    >…</span
                  >
                </li>
              }
            }
            <li ui-pagination-list-item>
              <button ui-pagination-next [class]="navBtnClass" (click)="noEdgePage = min(10, noEdgePage + 1)"></button>
            </li>
          </ul>
        </nav>
      }
      @case ('With edges (boundary 1)') {
        <nav ui-pagination>
          <ul ui-pagination-list class="flex flex-wrap items-center gap-1">
            <li ui-pagination-list-item>
              <button
                ui-pagination-prev
                [class]="navBtnClass"
                (click)="boundaryPage = max(1, boundaryPage - 1)"
              ></button>
            </li>
            @for (item of pageItems(boundaryPage, 500, 10, 1, true); track $index) {
              @if (item.type === 'page') {
                <li ui-pagination-list-item>
                  <button
                    type="button"
                    [attr.aria-label]="'Go to page ' + item.value"
                    [attr.aria-current]="item.value === boundaryPage ? 'page' : null"
                    [class]="pageBtnClass(item.value === boundaryPage)"
                    (click)="boundaryPage = item.value"
                  >
                    {{ item.value }}
                  </button>
                </li>
              } @else {
                <li ui-pagination-list-item>
                  <span
                    ui-pagination-ellipsis
                    class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
                    >…</span
                  >
                </li>
              }
            }
            <li ui-pagination-list-item>
              <button
                ui-pagination-next
                [class]="navBtnClass"
                (click)="boundaryPage = min(50, boundaryPage + 1)"
              ></button>
            </li>
          </ul>
        </nav>
      }
      @case ('Many pages with v-model') {
        <div class="space-y-3">
          <nav ui-pagination>
            <ul ui-pagination-list class="flex flex-wrap items-center gap-1">
              <li ui-pagination-list-item>
                <button ui-pagination-first [class]="navBtnClass" (click)="page = 1"></button>
              </li>
              <li ui-pagination-list-item>
                <button ui-pagination-prev [class]="navBtnClass" (click)="page = max(1, page - 1)"></button>
              </li>
              @for (item of pageItems(page, 1000, 10, 1, true); track $index) {
                @if (item.type === 'page') {
                  <li ui-pagination-list-item>
                    <button
                      type="button"
                      [attr.aria-label]="'Go to page ' + item.value"
                      [attr.aria-current]="item.value === page ? 'page' : null"
                      [class]="pageBtnClass(item.value === page)"
                      (click)="page = item.value"
                    >
                      {{ item.value }}
                    </button>
                  </li>
                } @else {
                  <li ui-pagination-list-item>
                    <span
                      ui-pagination-ellipsis
                      class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
                      >…</span
                    >
                  </li>
                }
              }
              <li ui-pagination-list-item>
                <button ui-pagination-next [class]="navBtnClass" (click)="page = min(100, page + 1)"></button>
              </li>
              <li ui-pagination-list-item>
                <button ui-pagination-last [class]="navBtnClass" (click)="page = 100"></button>
              </li>
            </ul>
          </nav>
          <p class="text-muted-foreground text-xs">Page {{ page }} of 100</p>
        </div>
      }
      @case ('Disabled') {
        <nav ui-pagination>
          <ul ui-pagination-list class="flex items-center gap-1 opacity-50">
            <li ui-pagination-list-item><button ui-pagination-first disabled [class]="navBtnClass"></button></li>
            <li ui-pagination-list-item><button ui-pagination-prev disabled [class]="navBtnClass"></button></li>
            @for (item of pageItems(disabledPage, 100, 10, 1, true); track $index) {
              @if (item.type === 'page') {
                <li ui-pagination-list-item>
                  <button
                    type="button"
                    disabled
                    [attr.aria-label]="'Go to page ' + item.value"
                    [attr.aria-current]="item.value === disabledPage ? 'page' : null"
                    [class]="pageBtnClass(item.value === disabledPage)"
                  >
                    {{ item.value }}
                  </button>
                </li>
              } @else {
                <li ui-pagination-list-item>
                  <span
                    ui-pagination-ellipsis
                    class="text-muted-foreground inline-flex h-9 w-9 items-center justify-center text-sm"
                    >…</span
                  >
                </li>
              }
            }
            <li ui-pagination-list-item><button ui-pagination-next disabled [class]="navBtnClass"></button></li>
            <li ui-pagination-list-item><button ui-pagination-last disabled [class]="navBtnClass"></button></li>
          </ul>
        </nav>
      }
    }
  `,
})
export class AngularPaginationDemoComponent {
  @Input() story = 'Default'
  defaultPage = 3
  compactPage = 10
  noEdgePage = 5
  boundaryPage = 25
  page = 3
  readonly disabledPage = 3
  readonly navBtnClass = `${btnBase} hover:bg-accent`
  readonly pageItems = pageItems
  readonly max = Math.max
  readonly min = Math.min

  pageBtnClass(active: boolean): string {
    return active ? `${btnBase} bg-primary text-primary-foreground border-primary` : `${btnBase} hover:bg-accent`
  }
}
