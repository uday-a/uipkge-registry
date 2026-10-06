import { Component, Input } from '@angular/core'
import { UiRelativeTimeComponent } from '../../../../../packages/registry-angular/components/relative-time/relative-time.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import {
  UiTableBodyComponent,
  UiTableCellComponent,
  UiTableComponent,
  UiTableHeadComponent,
  UiTableHeaderComponent,
  UiTableRowComponent,
} from '../../../../../packages/registry-angular/components/table/table.component'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
} from '../../../../../packages/registry-angular/components/avatar/avatar.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import { UiChipComponent } from '../../../../../packages/registry-angular/components/chip/chip.component'
import { UiKbdComponent } from '../../../../../packages/registry-angular/components/kbd/kbd.component'

const now = new Date('2026-08-14T12:00:00.000Z')

const users = [
  {
    id: 'usr_01',
    name: 'Maya Chen',
    email: 'maya.chen@acme.corp',
    initials: 'MC',
    role: 'Admin',
    status: 'active',
    createdAt: '2026-08-14T10:15:00.000Z',
    lastActive: '2026-08-14T11:58:00.000Z',
  },
  {
    id: 'usr_02',
    name: 'Omar Farid',
    email: 'omar.f@acme.corp',
    initials: 'OF',
    role: 'Engineer',
    status: 'active',
    createdAt: '2026-08-13T14:30:00.000Z',
    lastActive: '2026-08-14T09:40:00.000Z',
  },
  {
    id: 'usr_03',
    name: 'Priya Shah',
    email: 'priya.s@acme.corp',
    initials: 'PS',
    role: 'Designer',
    status: 'away',
    createdAt: '2026-08-07T08:00:00.000Z',
    lastActive: '2026-08-13T16:20:00.000Z',
  },
  {
    id: 'usr_04',
    name: 'Leo Park',
    email: 'leo.park@acme.corp',
    initials: 'LP',
    role: 'Member',
    status: 'offline',
    createdAt: '2026-07-12T11:00:00.000Z',
    lastActive: '2026-08-01T15:10:00.000Z',
  },
]

const commits = [
  {
    hash: '7a2f1b4',
    message: 'fix(auth): handle expired refresh tokens gracefully',
    author: 'maya',
    time: '2026-08-14T11:42:00.000Z',
  },
  {
    hash: 'c89e023',
    message: 'feat(billing): add stripe webhook verification',
    author: 'omar',
    time: '2026-08-14T08:15:00.000Z',
  },
  {
    hash: '419d8ea',
    message: 'chore(deps): bump tailwindcss from 4.2 to 4.3',
    author: 'renovate',
    time: '2026-08-13T22:00:00.000Z',
  },
  {
    hash: '9d3a1f8',
    message: 'docs(api): update rate limiting headers specification',
    author: 'priya',
    time: '2026-08-07T14:30:00.000Z',
  },
]

const scheduledJobs = [
  { name: 'Database backup', nextRun: '2026-08-14T12:20:00.000Z', sla: 'normal' },
  { name: 'Weekly analytics sync', nextRun: '2026-08-15T00:00:00.000Z', sla: 'normal' },
  { name: 'Invoice consolidation', nextRun: '2026-08-17T09:00:00.000Z', sla: 'urgent' },
  { name: 'Quarterly compliance audit', nextRun: '2026-09-01T00:00:00.000Z', sla: 'normal' },
]

const auditEvents = [
  {
    id: 1,
    action: 'API key created',
    target: 'prod_read_only',
    actor: 'Maya Chen',
    time: '2026-08-14T11:55:00.000Z',
    badge: 'Security',
  },
  {
    id: 2,
    action: 'Billing plan changed',
    target: 'Team → Enterprise',
    actor: 'Priya Shah',
    time: '2026-08-14T09:12:00.000Z',
    badge: 'Billing',
  },
  {
    id: 3,
    action: 'Member invited',
    target: 'alex.k@acme.corp',
    actor: 'Maya Chen',
    time: '2026-08-13T17:00:00.000Z',
    badge: 'Team',
  },
  {
    id: 4,
    action: 'SSO enforced',
    target: 'Google Workspace',
    actor: 'System',
    time: '2026-08-01T00:00:00.000Z',
    badge: 'Security',
  },
]

/** Angular demo for the relative-time page. Mirrors demos/react/relative-time.tsx story by story. */
@Component({
  selector: 'angular-relative-time-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiRelativeTimeComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiTableComponent,
    UiTableHeaderComponent,
    UiTableBodyComponent,
    UiTableRowComponent,
    UiTableHeadComponent,
    UiTableCellComponent,
    UiAvatarComponent,
    UiAvatarFallbackComponent,
    UiBadgeComponent,
    UiChipComponent,
    UiKbdComponent,
  ],
  template: `
    @switch (story) {
      @case ('User directory table') {
        <div class="overflow-hidden rounded-lg border">
          <div ui-table>
            <thead ui-table-header>
              <tr ui-table-row>
                <th ui-table-head>User</th>
                <th ui-table-head>Status</th>
                <th ui-table-head>Role</th>
                <th ui-table-head>Created</th>
                <th ui-table-head class="text-right">Last active</th>
              </tr>
            </thead>
            <tbody ui-table-body>
              @for (u of users; track u.id) {
                <tr ui-table-row>
                  <td ui-table-cell>
                    <div class="flex items-center gap-3">
                      <span ui-avatar size="sm">
                        <span ui-avatar-fallback>{{ u.initials }}</span>
                      </span>
                      <div>
                        <p class="text-sm font-medium">{{ u.name }}</p>
                        <p class="text-muted-foreground text-xs">{{ u.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td ui-table-cell>
                    <span class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                      <span
                        class="size-1.5 rounded-full"
                        [class.bg-emerald-500]="u.status === 'active'"
                        [class.bg-amber-500]="u.status === 'away'"
                        [class.bg-muted-foreground]="u.status === 'offline'"
                      ></span>
                      <span>{{ u.status === 'active' ? 'Active' : u.status === 'away' ? 'Away' : 'Offline' }}</span>
                    </span>
                  </td>
                  <td ui-table-cell>
                    <span ui-badge variant="outline">{{ u.role }}</span>
                  </td>
                  <td ui-table-cell>
                    <time ui-relative-time [date]="u.createdAt" [now]="now" locale="en" formatStyle="short"></time>
                  </td>
                  <td ui-table-cell class="text-right">
                    <time ui-relative-time [date]="u.lastActive" [now]="now" locale="en"></time>
                  </td>
                </tr>
              }
            </tbody>
          </div>
        </div>
      }
      @case ('Inside status chips and badges') {
        <div class="flex flex-wrap items-center gap-3">
          <span ui-chip variant="filled" class="gap-1.5">
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
              class="lucide lucide-clock size-3"
              aria-hidden="true"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>Synced</span>
            <time ui-relative-time date="2026-08-14T11:58:00.000Z" [now]="now" locale="en" formatStyle="narrow"></time>
          </span>

          <span ui-chip variant="outlined" class="gap-1.5">
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
              class="lucide lucide-refresh-cw size-3"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            <span>Last polled:</span>
            <time ui-relative-time date="2026-08-14T11:50:00.000Z" [now]="now" locale="en" formatStyle="short"></time>
          </span>

          <span ui-badge variant="secondary" class="gap-1">
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
              class="lucide lucide-user-check size-3"
              aria-hidden="true"
            >
              <path d="m16 11 2 2 4-4" />
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <span>Verified</span>
            <time ui-relative-time date="2026-08-13T10:00:00.000Z" [now]="now" locale="en"></time>
          </span>

          <span ui-badge variant="destructive" class="gap-1">
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
              class="lucide lucide-circle-alert size-3"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>Failed</span>
            <time ui-relative-time date="2026-08-14T11:15:00.000Z" [now]="now" locale="en"></time>
          </span>
        </div>
      }
      @case ('Audit log event stream') {
        <div class="space-y-2.5">
          @for (e of auditEvents; track e.id) {
            <div ui-card>
              <div ui-card-content class="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span ui-badge variant="outline" class="text-xs">{{ e.badge }}</span>
                    <p class="text-sm font-medium">{{ e.action }}</p>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Target: <span class="text-foreground font-mono">{{ e.target }}</span> · Actor: {{ e.actor }}
                  </p>
                </div>
                <time ui-relative-time [date]="e.time" [now]="now" locale="en" class="shrink-0 text-xs"></time>
              </div>
            </div>
          }
        </div>
      }
      @case ('Git commit history') {
        <div ui-card class="max-w-2xl">
          <div ui-card-header class="pb-3">
            <h3 ui-card-title class="flex items-center gap-2 text-sm font-semibold">
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
                class="lucide lucide-git-commit-horizontal text-primary size-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <line x1="3" x2="9" y1="12" y2="12" />
                <line x1="15" x2="21" y1="12" y2="12" />
              </svg>
              <span>Latest commits on main</span>
            </h3>
          </div>
          <div ui-card-content class="divide-y p-0">
            @for (c of commits; track c.hash) {
              <div class="flex items-center justify-between gap-4 px-6 py-3 text-sm">
                <div class="flex min-w-0 items-center gap-3">
                  <kbd ui-kbd>{{ c.hash }}</kbd>
                  <span class="truncate">{{ c.message }}</span>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <span class="text-muted-foreground font-mono text-xs">&#64;{{ c.author }}</span>
                  <span class="text-muted-foreground text-xs">·</span>
                  <time
                    ui-relative-time
                    [date]="c.time"
                    [now]="now"
                    locale="en"
                    formatStyle="narrow"
                    class="text-xs"
                  ></time>
                </div>
              </div>
            }
          </div>
        </div>
      }
      @case ('Scheduled jobs (future deltas)') {
        <div class="grid gap-3 sm:grid-cols-2">
          @for (job of scheduledJobs; track job.name) {
            <div ui-card>
              <div ui-card-content class="flex items-start justify-between py-4">
                <div>
                  <p class="text-sm font-medium">{{ job.name }}</p>
                  <p class="text-muted-foreground mt-1 text-xs">
                    Scheduled for
                    <time
                      ui-relative-time
                      [date]="job.nextRun"
                      [now]="now"
                      locale="en"
                      class="text-foreground font-medium"
                    ></time>
                  </p>
                </div>
                <span ui-badge [variant]="job.sla === 'urgent' ? 'destructive' : 'secondary'">{{
                  job.sla === 'urgent' ? 'High priority' : 'Queued'
                }}</span>
              </div>
            </div>
          }
        </div>
      }
      @case ('Multi-timezone matrix') {
        <div ui-card class="max-w-2xl">
          <div ui-card-header class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
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
                  class="lucide lucide-globe text-primary size-4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <h3 ui-card-title class="text-sm font-semibold">v2.4.0 Global Deployment</h3>
              </div>
              <span ui-badge variant="outline">
                <time ui-relative-time [date]="globalRelease" [now]="now" locale="en"></time>
              </span>
            </div>
            <p ui-card-description>Target release scheduled in 3 hours 30 minutes.</p>
          </div>
          <div ui-card-content class="divide-y p-0">
            <div class="flex items-center justify-between px-6 py-2.5 text-sm">
              <span class="text-muted-foreground">Universal Coordinated Time (UTC)</span>
              <time
                ui-relative-time
                [date]="globalRelease"
                [now]="now"
                locale="en-GB"
                display="absolute"
                timeZone="UTC"
                class="text-foreground font-mono text-xs"
              ></time>
            </div>
            <div class="flex items-center justify-between px-6 py-2.5 text-sm">
              <span class="text-muted-foreground">New York (EDT)</span>
              <time
                ui-relative-time
                [date]="globalRelease"
                [now]="now"
                locale="en-US"
                display="absolute"
                timeZone="America/New_York"
                class="text-foreground font-mono text-xs"
              ></time>
            </div>
            <div class="flex items-center justify-between px-6 py-2.5 text-sm">
              <span class="text-muted-foreground">London (BST)</span>
              <time
                ui-relative-time
                [date]="globalRelease"
                [now]="now"
                locale="en-GB"
                display="absolute"
                timeZone="Europe/London"
                class="text-foreground font-mono text-xs"
              ></time>
            </div>
            <div class="flex items-center justify-between px-6 py-2.5 text-sm">
              <span class="text-muted-foreground">Tokyo (JST)</span>
              <time
                ui-relative-time
                [date]="globalRelease"
                [now]="now"
                locale="ja-JP"
                display="absolute"
                timeZone="Asia/Tokyo"
                class="text-foreground font-mono text-xs"
              ></time>
            </div>
          </div>
        </div>
      }
      @case ('Combined relative and absolute format') {
        <div class="space-y-2">
          <div ui-card class="max-w-md">
            <div ui-card-content class="py-4">
              <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Payment Received</p>
              <p class="mt-0.5 text-lg font-semibold">$4,250.00 USD</p>
              <div class="mt-2 text-xs">
                <time
                  ui-relative-time
                  date="2026-08-14T08:30:00.000Z"
                  [now]="now"
                  locale="en"
                  display="both"
                  timeZone="UTC"
                  numeric="always"
                ></time>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('Density styles comparison') {
        <div class="grid max-w-lg gap-3 rounded-lg border p-4 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Long (default):</span>
            <time
              ui-relative-time
              date="2026-08-14T09:00:00.000Z"
              [now]="now"
              locale="en"
              formatStyle="long"
              numeric="always"
            ></time>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Short:</span>
            <time
              ui-relative-time
              date="2026-08-14T09:00:00.000Z"
              [now]="now"
              locale="en"
              formatStyle="short"
              numeric="always"
            ></time>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground">Narrow:</span>
            <time
              ui-relative-time
              date="2026-08-14T09:00:00.000Z"
              [now]="now"
              locale="en"
              formatStyle="narrow"
              numeric="always"
            ></time>
          </div>
        </div>
      }
      @case ('ISO string parsing (naive vs UTC)') {
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex items-center gap-2">
            <span ui-badge variant="outline">parseAs="utc"</span>
            <time
              ui-relative-time
              date="2026-08-14T12:00:00"
              [now]="now"
              locale="en-GB"
              display="both"
              timeZone="UTC"
              parseAs="utc"
            ></time>
          </div>
        </div>
      }
    }
  `,
})
export class AngularRelativeTimeDemoComponent {
  @Input() story = 'User directory table'
  readonly now = now
  readonly users = users
  readonly commits = commits
  readonly scheduledJobs = scheduledJobs
  readonly auditEvents = auditEvents
  readonly globalRelease = '2026-08-14T15:30:00.000Z'
}
