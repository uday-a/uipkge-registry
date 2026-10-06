import { Component, Input } from '@angular/core'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import {
  UiTreeTableComponent,
  type TreeTableColumn,
  type TreeTableRow,
} from '../../../../../packages/registry-angular/components/tree-table/tree-table.component'
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
 * Angular demo for the tree-table page. Mirrors demos/react/tree-table.tsx story by story.
 *
 * The Angular TreeTable is a headless state container (visibleRows / toggle / indentStyle /
 * selection); each story composes it with Table primitives the same way a consumer app does.
 */
@Component({
  selector: 'angular-tree-table-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBadgeComponent,
    UiTableBodyComponent,
    UiTableCellComponent,
    UiTableComponent,
    UiTableEmptyComponent,
    UiTableHeadComponent,
    UiTableHeaderComponent,
    UiTableRowComponent,
    UiTreeTableComponent,
  ],
  template: `
    @switch (story) {
      @case ('Department budget breakdown') {
        <ui-tree-table #ttOrg [data]="orgData" [columns]="orgColumns" defaultExpanded />
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head class="w-64">Department</th>
              @for (col of orgColumns; track col.key) {
                @if (col.key !== 'name') {
                  <th ui-table-head>{{ col.title }}</th>
                }
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (entry of ttOrg.visibleRows(); track entry.row.id) {
              <tr ui-table-row>
                <td ui-table-cell>
                  <span class="flex items-center gap-1" [style]="ttOrg.indentStyle(entry.depth)">
                    @if (entry.row.children?.length) {
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-5 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                        [attr.aria-expanded]="ttOrg.isExpanded(entry.row.id)"
                        [attr.aria-label]="ttOrg.isExpanded(entry.row.id) ? 'Collapse' : 'Expand'"
                        (click)="ttOrg.toggle(entry.row.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          [class]="
                            'size-4 transition-transform duration-150' +
                            (ttOrg.isExpanded(entry.row.id) ? '' : ' -rotate-90')
                          "
                          aria-hidden="true"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    } @else {
                      <span class="size-5" aria-hidden="true"></span>
                    }
                    <span class="font-medium">{{ ttOrg.cellText(entry.row, orgNameColumn) }}</span>
                  </span>
                </td>
                <td ui-table-cell class="text-muted-foreground">{{ entry.row.data['lead'] }}</td>
                <td ui-table-cell class="tabular-nums">{{ entry.row.data['headcount'] }}</td>
                <td ui-table-cell class="tabular-nums">{{ entry.row.data['budget'] }}</td>
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('Selectable rows') {
        <ui-tree-table
          #ttSelect
          [data]="projectFiles"
          [columns]="fileColumns"
          selectable
          defaultExpanded
          (selectedChange)="selectedIds = $event"
        />
        <div class="mb-3 flex items-center justify-between">
          <span class="text-sm font-medium">Select files to archive</span>
          <span ui-badge variant="secondary">{{ selectedIds.length }} selected</span>
        </div>
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              <th ui-table-head class="w-10"></th>
              @for (col of fileColumns; track col.key) {
                <th ui-table-head>{{ col.title }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (entry of ttSelect.visibleRows(); track entry.row.id) {
              <tr ui-table-row>
                <td ui-table-cell>
                  <input
                    type="checkbox"
                    class="border-border accent-primary size-3.5 rounded"
                    [checked]="ttSelect.isSelected(entry.row.id)"
                    [attr.aria-label]="'Select ' + ttSelect.cellText(entry.row, fileNameColumn)"
                    (click)="ttSelect.toggleSelect(entry.row.id)"
                  />
                </td>
                @for (col of fileColumns; track col.key) {
                  <td ui-table-cell [class.text-muted-foreground]="col.key !== 'name'">
                    @if (col.key === 'name') {
                      <span class="flex items-center gap-1" [style]="ttSelect.indentStyle(entry.depth)">
                        @if (entry.row.children?.length) {
                          <button
                            type="button"
                            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-5 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                            [attr.aria-expanded]="ttSelect.isExpanded(entry.row.id)"
                            [attr.aria-label]="ttSelect.isExpanded(entry.row.id) ? 'Collapse' : 'Expand'"
                            (click)="ttSelect.toggle(entry.row.id)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              [class]="
                                'size-4 transition-transform duration-150' +
                                (ttSelect.isExpanded(entry.row.id) ? '' : ' -rotate-90')
                              "
                              aria-hidden="true"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        } @else {
                          <span class="size-5" aria-hidden="true"></span>
                        }
                        {{ ttSelect.cellText(entry.row, col) }}
                      </span>
                    } @else {
                      {{ ttSelect.cellText(entry.row, col) }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
      }
      @case ('Loading state') {
        <ui-tree-table #ttLoad [data]="projectFiles" [columns]="fileColumns" defaultExpanded />
        <div class="mb-3 flex items-center gap-3">
          <button
            type="button"
            class="border-border bg-card hover:bg-muted focus-visible:ring-ring inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
            (click)="ttLoad.loading = !ttLoad.loading"
          >
            {{ ttLoad.loading ? 'Loading…' : 'Reload files' }}
          </button>
        </div>
        <div class="relative">
          <ui-table>
            <thead ui-table-header>
              <tr ui-table-row>
                @for (col of fileColumns; track col.key) {
                  <th ui-table-head>{{ col.title }}</th>
                }
              </tr>
            </thead>
            <tbody ui-table-body>
              @for (entry of ttLoad.visibleRows(); track entry.row.id) {
                <tr ui-table-row>
                  @for (col of fileColumns; track col.key) {
                    <td ui-table-cell>{{ ttLoad.cellText(entry.row, col) }}</td>
                  }
                </tr>
              }
            </tbody>
          </ui-table>
          @if (ttLoad.loading) {
            <div
              class="bg-background/70 absolute inset-0 flex items-center justify-center rounded-md backdrop-blur-[1px]"
            >
              <span class="text-muted-foreground font-mono text-xs">Loading…</span>
            </div>
          }
        </div>
      }
      @case ('Custom expand icon') {
        <ui-tree-table #ttCompact [data]="projectFiles" [columns]="fileColumns" [indent]="16" defaultExpanded />
        <ui-tree-table #ttWide [data]="projectFiles" [columns]="fileColumns" [indent]="40" defaultExpanded />
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">Compact indent (16px)</span>
            <ui-table>
              <thead ui-table-header>
                <tr ui-table-row>
                  @for (col of fileColumns; track col.key) {
                    <th ui-table-head>{{ col.title }}</th>
                  }
                </tr>
              </thead>
              <tbody ui-table-body>
                @for (entry of ttCompact.visibleRows(); track entry.row.id) {
                  <tr ui-table-row>
                    @for (col of fileColumns; track col.key) {
                      <td ui-table-cell>
                        @if (col.key === 'name') {
                          <span class="flex items-center gap-1" [style]="ttCompact.indentStyle(entry.depth)">
                            @if (entry.row.children?.length) {
                              <button
                                type="button"
                                class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-5 items-center justify-center rounded font-mono text-xs focus-visible:ring-2 focus-visible:outline-none"
                                [attr.aria-expanded]="ttCompact.isExpanded(entry.row.id)"
                                [attr.aria-label]="ttCompact.isExpanded(entry.row.id) ? 'Collapse' : 'Expand'"
                                (click)="ttCompact.toggle(entry.row.id)"
                              >
                                {{ ttCompact.isExpanded(entry.row.id) ? '−' : '+' }}
                              </button>
                            } @else {
                              <span class="size-5" aria-hidden="true"></span>
                            }
                            {{ ttCompact.cellText(entry.row, col) }}
                          </span>
                        } @else {
                          {{ ttCompact.cellText(entry.row, col) }}
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </ui-table>
          </div>
          <div class="space-y-1.5">
            <span class="text-muted-foreground text-xs">Wide indent (40px)</span>
            <ui-table>
              <thead ui-table-header>
                <tr ui-table-row>
                  @for (col of fileColumns; track col.key) {
                    <th ui-table-head>{{ col.title }}</th>
                  }
                </tr>
              </thead>
              <tbody ui-table-body>
                @for (entry of ttWide.visibleRows(); track entry.row.id) {
                  <tr ui-table-row>
                    @for (col of fileColumns; track col.key) {
                      <td ui-table-cell>
                        @if (col.key === 'name') {
                          <span class="flex items-center gap-1" [style]="ttWide.indentStyle(entry.depth)">
                            @if (entry.row.children?.length) {
                              <button
                                type="button"
                                class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-5 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                                [attr.aria-expanded]="ttWide.isExpanded(entry.row.id)"
                                [attr.aria-label]="ttWide.isExpanded(entry.row.id) ? 'Collapse' : 'Expand'"
                                (click)="ttWide.toggle(entry.row.id)"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  [class]="
                                    'size-4 transition-transform duration-150' +
                                    (ttWide.isExpanded(entry.row.id) ? '' : ' -rotate-90')
                                  "
                                  aria-hidden="true"
                                >
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </button>
                            } @else {
                              <span class="size-5" aria-hidden="true"></span>
                            }
                            {{ ttWide.cellText(entry.row, col) }}
                          </span>
                        } @else {
                          {{ ttWide.cellText(entry.row, col) }}
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </ui-table>
          </div>
        </div>
      }
      @case ('Empty state') {
        <ui-tree-table #ttEmpty [data]="[]" [columns]="fileColumns" />
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of fileColumns; track col.key) {
                <th ui-table-head>{{ col.title }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @if (ttEmpty.visibleRows().length === 0) {
              <ui-table-empty>No files match your search.</ui-table-empty>
            }
          </tbody>
        </ui-table>
      }
      @default {
        <ui-tree-table #ttFiles [data]="projectFiles" [columns]="fileColumns" defaultExpanded />
        <ui-table>
          <thead ui-table-header>
            <tr ui-table-row>
              @for (col of fileColumns; track col.key) {
                <th ui-table-head>{{ col.title }}</th>
              }
            </tr>
          </thead>
          <tbody ui-table-body>
            @for (entry of ttFiles.visibleRows(); track entry.row.id) {
              <tr ui-table-row>
                @for (col of fileColumns; track col.key) {
                  <td ui-table-cell [class.text-muted-foreground]="col.key !== 'name'">
                    @if (col.key === 'name') {
                      <span class="flex items-center gap-1" [style]="ttFiles.indentStyle(entry.depth)">
                        @if (entry.row.children?.length) {
                          <button
                            type="button"
                            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-5 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
                            [attr.aria-expanded]="ttFiles.isExpanded(entry.row.id)"
                            [attr.aria-label]="ttFiles.isExpanded(entry.row.id) ? 'Collapse' : 'Expand'"
                            (click)="ttFiles.toggle(entry.row.id)"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              [class]="
                                'size-4 transition-transform duration-150' +
                                (ttFiles.isExpanded(entry.row.id) ? '' : ' -rotate-90')
                              "
                              aria-hidden="true"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        } @else {
                          <span class="size-5" aria-hidden="true"></span>
                        }
                        {{ ttFiles.cellText(entry.row, col) }}
                      </span>
                    } @else {
                      {{ ttFiles.cellText(entry.row, col) }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </ui-table>
      }
    }
  `,
})
export class AngularTreeTableDemoComponent {
  @Input() story = 'Project file explorer'

  protected selectedIds: string[] = []

  protected readonly fileColumns: TreeTableColumn[] = [
    { key: 'name', title: 'Name' },
    { key: 'size', title: 'Size' },
    { key: 'modified', title: 'Modified' },
  ]

  protected readonly fileNameColumn: TreeTableColumn = { key: 'name', title: 'Name' }

  protected readonly orgColumns: TreeTableColumn[] = [
    { key: 'name', title: 'Department' },
    { key: 'lead', title: 'Team lead' },
    { key: 'headcount', title: 'Headcount' },
    { key: 'budget', title: 'Budget' },
  ]

  protected readonly orgNameColumn: TreeTableColumn = { key: 'name', title: 'Department' }

  protected readonly projectFiles: TreeTableRow[] = [
    {
      id: 'src',
      data: { name: 'src', type: 'folder', size: '—', modified: '2024-03-15' },
      children: [
        {
          id: 'src/components',
          data: { name: 'components', type: 'folder', size: '—', modified: '2024-03-14' },
          children: [
            {
              id: 'src/components/Button.vue',
              data: { name: 'Button.vue', type: 'vue', size: '2.4 KB', modified: '2024-03-10' },
            },
            {
              id: 'src/components/Card.vue',
              data: { name: 'Card.vue', type: 'vue', size: '1.8 KB', modified: '2024-03-12' },
            },
          ],
        },
        {
          id: 'src/app.vue',
          data: { name: 'app.vue', type: 'vue', size: '4.2 KB', modified: '2024-03-15' },
        },
        {
          id: 'src/main.ts',
          data: { name: 'main.ts', type: 'ts', size: '0.8 KB', modified: '2024-03-01' },
        },
      ],
    },
    {
      id: 'public',
      data: { name: 'public', type: 'folder', size: '—', modified: '2024-02-20' },
      children: [
        {
          id: 'public/favicon.ico',
          data: { name: 'favicon.ico', type: 'image', size: '32 KB', modified: '2024-01-01' },
        },
        {
          id: 'public/logo.svg',
          data: { name: 'logo.svg', type: 'image', size: '4.5 KB', modified: '2024-02-15' },
        },
      ],
    },
    {
      id: 'package.json',
      data: { name: 'package.json', type: 'json', size: '1.5 KB', modified: '2024-03-14' },
    },
    {
      id: 'README.md',
      data: { name: 'README.md', type: 'md', size: '3.2 KB', modified: '2024-03-15' },
    },
  ]

  protected readonly orgData: TreeTableRow[] = [
    {
      id: 'eng',
      data: { name: 'Engineering', headcount: 42, budget: '$4.2M', lead: 'Michael Chen' },
      children: [
        {
          id: 'eng-frontend',
          data: { name: 'Frontend', headcount: 12, budget: '$1.1M', lead: 'Alex Rivera' },
          children: [
            {
              id: 'eng-frontend-vue',
              data: { name: 'Vue Team', headcount: 6, budget: '$550K', lead: 'Jordan Lee' },
            },
            {
              id: 'eng-frontend-react',
              data: { name: 'React Team', headcount: 6, budget: '$550K', lead: 'Taylor Brooks' },
            },
          ],
        },
        {
          id: 'eng-backend',
          data: { name: 'Backend', headcount: 18, budget: '$1.8M', lead: 'Sam Patel' },
        },
      ],
    },
    {
      id: 'design',
      data: { name: 'Design', headcount: 8, budget: '$900K', lead: 'Emily Davis' },
    },
    {
      id: 'sales',
      data: { name: 'Sales', headcount: 15, budget: '$2.1M', lead: 'David Wilson' },
    },
  ]
}
