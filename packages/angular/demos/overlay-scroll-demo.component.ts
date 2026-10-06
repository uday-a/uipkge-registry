import { Component, Input, ViewChild, OnDestroy } from '@angular/core'
import { UiOverlayScrollComponent } from '../../../../../packages/registry-angular/components/overlay-scroll'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button'

@Component({
  selector: 'ui-overlay-scroll-demo',
  standalone: true,
  imports: [UiOverlayScrollComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="bg-card h-[340px] w-full max-w-md rounded-lg border">
          <ui-overlay-scroll class="h-full p-4">
            <div class="space-y-3">
              @for (m of messages; track m.id) {
                <div class="flex gap-3">
                  <div
                    class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                  >
                    {{ m.author[0] }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-baseline gap-2">
                      <span class="text-sm font-medium">{{ m.author }}</span>
                      <span class="text-muted-foreground text-xs">{{ m.time }}</span>
                    </div>
                    <p class="text-foreground/90 text-sm">{{ m.text }}</p>
                  </div>
                </div>
              }
            </div>
          </ui-overlay-scroll>
        </div>
      }

      @case ('Sidebar nav') {
        <div class="bg-card h-[300px] w-56 rounded-lg border">
          <ui-overlay-scroll class="h-full">
            <ul class="p-2">
              @for (item of navItems; track item) {
                <li>
                  <a class="hover:bg-accent block rounded-md px-3 py-1.5 text-sm">{{ item }}</a>
                </li>
              }
            </ul>
          </ui-overlay-scroll>
        </div>
      }

      @case ('Compact file list') {
        <div class="bg-card h-[260px] w-full max-w-lg rounded-lg border">
          <ui-overlay-scroll [thumbWidth]="3" [thumbOffset]="1" class="h-full">
            <ul class="divide-y">
              @for (f of files; track $index) {
                <li class="flex items-center gap-3 px-3 py-2 text-sm">
                  <span
                    class="inline-flex size-5 items-center justify-center rounded font-mono text-xs font-semibold"
                    [class]="statusClass(f.status)"
                  >
                    {{ f.status }}
                  </span>
                  <code class="text-foreground/90 truncate font-mono text-xs">{{ f.name }}</code>
                </li>
              }
            </ul>
          </ui-overlay-scroll>
        </div>
      }

      @case ('Programmatic scroll') {
        <div class="space-y-3">
          <div class="flex gap-2">
            <button ui-button size="sm" variant="outline" (click)="scrollToTop()">Scroll to top</button>
            <button ui-button size="sm" variant="outline" (click)="scrollToBottom()">Scroll to bottom</button>
          </div>
          <div class="bg-card h-[240px] w-full max-w-md rounded-lg border">
            <ui-overlay-scroll #progScroll class="h-full p-4">
              @for (p of paragraphs; track p) {
                <p class="text-foreground/90 mb-3 text-sm">
                  Paragraph {{ p + 1 }}. The parent controls scroll position via the exposed &#96;scrollerEl&#96;.
                </p>
              }
            </ui-overlay-scroll>
          </div>
        </div>
      }

      @case ('Dynamic growth (infinite scroll)') {
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <button ui-button size="sm" variant="outline" (click)="appendRows(20)">+20 rows</button>
            <button ui-button size="sm" [variant]="autoGrow ? 'default' : 'outline'" (click)="toggleAutoGrow()">
              {{ autoGrow ? 'Stop auto-grow' : 'Start auto-grow' }}
            </button>
            <span class="text-muted-foreground text-xs">{{ dynamicRows.length }} rows</span>
          </div>
          <div class="bg-card h-[280px] w-full max-w-lg rounded-lg border">
            <ui-overlay-scroll class="h-full">
              <ul class="divide-y">
                @for (row of dynamicRows; track row.id) {
                  <li class="flex items-center justify-between px-3 py-2 text-sm">
                    <span>{{ row.title }}</span>
                    <span class="rounded px-2 py-0.5 font-mono text-xs font-semibold" [class]="detailClass(row.detail)">
                      {{ row.detail }}
                    </span>
                  </li>
                }
              </ul>
            </ui-overlay-scroll>
          </div>
        </div>
      }

      @case ('Non-draggable thumb') {
        <div class="bg-card h-[220px] w-full max-w-md rounded-lg border">
          <ui-overlay-scroll [draggable]="false" class="h-full p-4">
            @for (l of lines; track l) {
              <p class="text-foreground/90 mb-3 text-sm">Line {{ l + 1 }} — thumb shown but not draggable.</p>
            }
          </ui-overlay-scroll>
        </div>
      }
    }
  `,
})
export class OverlayScrollDemoComponent implements OnDestroy {
  @Input() story?: string

  @ViewChild('progScroll') progScroll?: UiOverlayScrollComponent

  messages = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    author: ['Sarah', 'Marcus', 'Priya', 'Diego', 'Yuki', 'Aditya'][i % 6],
    text: [
      'Pushed the migration. Logs look clean on staging.',
      'Bumping this — anyone reviewing the auth PR?',
      'Standup notes from yesterday are in the doc.',
      'Mobile build green. Cutting RC1 now.',
      'Q3 OKR draft ready for feedback.',
      'Fixed the off-by-one. New build deploying.',
      'Anyone seeing slowdowns on /dashboard? Looking into it.',
      'Closed P-1342. Was a Redis cache miss.',
    ][i % 8],
    time: `${(i * 7) % 60}m`,
  }))

  files = Array.from({ length: 18 }, (_, i) => ({
    name: [
      'src/auth/middleware.ts',
      'src/db/migrations/0042.sql',
      'app/routes/dashboard.vue',
      'lib/utils.ts',
      'tests/auth.spec.ts',
    ][i % 5],
    status: ['M', 'A', 'D', 'M', 'M'][i % 5],
  }))

  navItems = [
    'Inbox',
    'Sent',
    'Drafts',
    'Spam',
    'Trash',
    'All Mail',
    'Important',
    'Starred',
    'Snoozed',
    'Scheduled',
    'Outbox',
    'Categories',
    'Social',
    'Updates',
    'Forums',
    'Promotions',
    'Archive',
    'Templates',
    'Tasks',
    'Notes',
    'Calendar',
    'Contacts',
  ]

  paragraphs = Array.from({ length: 30 }, (_, i) => i)
  lines = Array.from({ length: 24 }, (_, i) => i)

  dynamicRows = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Row ${i + 1}`,
    detail: ['queued', 'in-flight', 'done', 'retrying'][i % 4],
  }))

  autoGrow = false
  private autoGrowTimer: ReturnType<typeof setInterval> | null = null

  statusClass(status: string): string {
    return status === 'M'
      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
      : status === 'A'
        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
        : status === 'D'
          ? 'bg-red-500/15 text-red-600 dark:text-red-400'
          : ''
  }

  detailClass(detail: string): string {
    return detail === 'queued'
      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
      : detail === 'in-flight'
        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
        : detail === 'done'
          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
          : 'bg-red-500/15 text-red-600 dark:text-red-400'
  }

  scrollToBottom(): void {
    const el = this.progScroll?.scrollerEl
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }

  scrollToTop(): void {
    const el = this.progScroll?.scrollerEl
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' })
  }

  appendRows(n = 20): void {
    const start = this.dynamicRows.length
    const next = [...this.dynamicRows]
    for (let i = 0; i < n; i++) {
      next.push({
        id: start + i,
        title: `Row ${start + i + 1}`,
        detail: ['queued', 'in-flight', 'done', 'retrying'][(start + i) % 4],
      })
    }
    this.dynamicRows = next
  }

  toggleAutoGrow(): void {
    this.autoGrow = !this.autoGrow
    if (this.autoGrow) {
      this.autoGrowTimer = setInterval(() => {
        if (this.dynamicRows.length >= 500) {
          this.toggleAutoGrow()
          return
        }
        const start = this.dynamicRows.length
        this.dynamicRows = [
          ...this.dynamicRows,
          {
            id: start,
            title: `Row ${start + 1}`,
            detail: ['queued', 'in-flight', 'done', 'retrying'][start % 4],
          },
        ]
      }, 250)
    } else if (this.autoGrowTimer) {
      clearInterval(this.autoGrowTimer)
      this.autoGrowTimer = null
    }
  }

  ngOnDestroy(): void {
    if (this.autoGrowTimer) clearInterval(this.autoGrowTimer)
  }
}
