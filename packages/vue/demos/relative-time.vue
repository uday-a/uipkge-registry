<script setup lang="ts">
import { RelativeTime } from '@/components/ui/relative-time'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Chip } from '@/components/ui/chip'
import { Kbd } from '@/components/ui/kbd'
import { AlertCircle, Clock, GitCommit, Globe, RefreshCw, UserCheck } from 'lucide-vue-next'

const now = new Date('2026-08-14T12:00:00.000Z')

const users = [
  {
    id: 'usr_01',
    name: 'Maya Chen',
    email: 'maya.chen@acme.corp',
    initials: 'MC',
    role: 'Admin',
    status: 'active' as const,
    createdAt: '2026-08-14T10:15:00.000Z',
    lastActive: '2026-08-14T11:58:00.000Z',
  },
  {
    id: 'usr_02',
    name: 'Omar Farid',
    email: 'omar.f@acme.corp',
    initials: 'OF',
    role: 'Engineer',
    status: 'active' as const,
    createdAt: '2026-08-13T14:30:00.000Z',
    lastActive: '2026-08-14T09:40:00.000Z',
  },
  {
    id: 'usr_03',
    name: 'Priya Shah',
    email: 'priya.s@acme.corp',
    initials: 'PS',
    role: 'Designer',
    status: 'away' as const,
    createdAt: '2026-08-07T08:00:00.000Z',
    lastActive: '2026-08-13T16:20:00.000Z',
  },
  {
    id: 'usr_04',
    name: 'Leo Park',
    email: 'leo.park@acme.corp',
    initials: 'LP',
    role: 'Member',
    status: 'offline' as const,
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
  { name: 'Database backup', nextRun: '2026-08-14T12:20:00.000Z', sla: 'normal' as const },
  { name: 'Weekly analytics sync', nextRun: '2026-08-15T00:00:00.000Z', sla: 'normal' as const },
  { name: 'Invoice consolidation', nextRun: '2026-08-17T09:00:00.000Z', sla: 'urgent' as const },
  { name: 'Quarterly compliance audit', nextRun: '2026-09-01T00:00:00.000Z', sla: 'normal' as const },
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

const globalRelease = '2026-08-14T15:30:00.000Z'
</script>

<template>
  <Story
    title="User directory table"
    description="Created and last-active columns in a user directory table. Hover any timestamp for the full localized datetime."
  >
    <div class="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
            <TableHead class="text-right">Last active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="u in users" :key="u.id">
            <TableCell>
              <div class="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{{ u.initials }}</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-medium">{{ u.name }}</p>
                  <p class="text-muted-foreground text-xs">{{ u.email }}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <span
                  :class="[
                    'size-1.5 rounded-full',
                    u.status === 'active'
                      ? 'bg-emerald-500'
                      : u.status === 'away'
                        ? 'bg-amber-500'
                        : 'bg-muted-foreground',
                  ]"
                />
                <span>{{ u.status === 'active' ? 'Active' : u.status === 'away' ? 'Away' : 'Offline' }}</span>
              </span>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{{ u.role }}</Badge>
            </TableCell>
            <TableCell>
              <RelativeTime :date="u.createdAt" :now="now" locale="en" format-style="short" />
            </TableCell>
            <TableCell class="text-right">
              <RelativeTime :date="u.lastActive" :now="now" locale="en" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </Story>

  <Story
    title="Inside status chips and badges"
    description="Relative time nested in chips and badges for filter toolbars, sync banners, and card status headers."
  >
    <div class="flex flex-wrap items-center gap-3">
      <Chip variant="filled" class="gap-1.5">
        <Clock class="size-3" aria-hidden="true" />
        <span>Synced</span>
        <RelativeTime date="2026-08-14T11:58:00.000Z" :now="now" locale="en" format-style="narrow" />
      </Chip>

      <Chip variant="outlined" class="gap-1.5">
        <RefreshCw class="size-3" aria-hidden="true" />
        <span>Last polled:</span>
        <RelativeTime date="2026-08-14T11:50:00.000Z" :now="now" locale="en" format-style="short" />
      </Chip>

      <Badge variant="secondary" class="gap-1">
        <UserCheck class="size-3" aria-hidden="true" />
        <span>Verified</span>
        <RelativeTime date="2026-08-13T10:00:00.000Z" :now="now" locale="en" />
      </Badge>

      <Badge variant="destructive" class="gap-1">
        <AlertCircle class="size-3" aria-hidden="true" />
        <span>Failed</span>
        <RelativeTime date="2026-08-14T11:15:00.000Z" :now="now" locale="en" />
      </Badge>
    </div>
  </Story>

  <Story
    title="Audit log event stream"
    description="Event cards with category tags, action description, and live relative timestamps in the header."
  >
    <div class="space-y-2.5">
      <Card v-for="e in auditEvents" :key="e.id">
        <CardContent class="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="text-xs">{{ e.badge }}</Badge>
              <p class="text-sm font-medium">{{ e.action }}</p>
            </div>
            <p class="text-muted-foreground text-xs">
              Target: <span class="text-foreground font-mono">{{ e.target }}</span> · Actor: {{ e.actor }}
            </p>
          </div>
          <RelativeTime :date="e.time" :now="now" locale="en" class="shrink-0 text-xs" />
        </CardContent>
      </Card>
    </div>
  </Story>

  <Story
    title="Git commit history"
    description="Commit list with Kbd hashes, message summaries, author tags, and compact narrow relative times."
  >
    <Card class="max-w-2xl">
      <CardHeader class="pb-3">
        <CardTitle class="flex items-center gap-2 text-sm font-semibold">
          <GitCommit class="text-primary size-4" aria-hidden="true" />
          <span>Latest commits on main</span>
        </CardTitle>
      </CardHeader>
      <CardContent class="divide-y p-0">
        <div v-for="c in commits" :key="c.hash" class="flex items-center justify-between gap-4 px-6 py-3 text-sm">
          <div class="flex min-w-0 items-center gap-3">
            <Kbd>{{ c.hash }}</Kbd>
            <span class="truncate">{{ c.message }}</span>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="text-muted-foreground font-mono text-xs">@{{ c.author }}</span>
            <span class="text-muted-foreground text-xs">·</span>
            <RelativeTime :date="c.time" :now="now" locale="en" format-style="narrow" class="text-xs" />
          </div>
        </div>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Scheduled jobs (future deltas)"
    description="Future timestamps format seamlessly with positive phrases ('in 20 minutes', 'tomorrow', 'in 3 days')."
  >
    <div class="grid gap-3 sm:grid-cols-2">
      <Card v-for="job in scheduledJobs" :key="job.name">
        <CardContent class="flex items-start justify-between py-4">
          <div>
            <p class="text-sm font-medium">{{ job.name }}</p>
            <p class="text-muted-foreground mt-1 text-xs">
              Scheduled for
              <RelativeTime :date="job.nextRun" :now="now" locale="en" class="text-foreground font-medium" />
            </p>
          </div>
          <Badge :variant="job.sla === 'urgent' ? 'destructive' : 'secondary'">
            {{ job.sla === 'urgent' ? 'High priority' : 'Queued' }}
          </Badge>
        </CardContent>
      </Card>
    </div>
  </Story>

  <Story
    title="Multi-timezone matrix"
    description="The same global release event rendered across multiple target IANA time zones with absolute time."
  >
    <Card class="max-w-2xl">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Globe class="text-primary size-4" aria-hidden="true" />
            <CardTitle class="text-sm font-semibold">v2.4.0 Global Deployment</CardTitle>
          </div>
          <Badge variant="outline">
            <RelativeTime :date="globalRelease" :now="now" locale="en" />
          </Badge>
        </div>
        <CardDescription>Target release scheduled in 3 hours 30 minutes.</CardDescription>
      </CardHeader>
      <CardContent class="divide-y p-0">
        <div class="flex items-center justify-between px-6 py-2.5 text-sm">
          <span class="text-muted-foreground">Universal Coordinated Time (UTC)</span>
          <RelativeTime
            :date="globalRelease"
            :now="now"
            locale="en-GB"
            display="absolute"
            time-zone="UTC"
            class="text-foreground font-mono text-xs"
          />
        </div>
        <div class="flex items-center justify-between px-6 py-2.5 text-sm">
          <span class="text-muted-foreground">New York (EDT)</span>
          <RelativeTime
            :date="globalRelease"
            :now="now"
            locale="en-US"
            display="absolute"
            time-zone="America/New_York"
            class="text-foreground font-mono text-xs"
          />
        </div>
        <div class="flex items-center justify-between px-6 py-2.5 text-sm">
          <span class="text-muted-foreground">London (BST)</span>
          <RelativeTime
            :date="globalRelease"
            :now="now"
            locale="en-GB"
            display="absolute"
            time-zone="Europe/London"
            class="text-foreground font-mono text-xs"
          />
        </div>
        <div class="flex items-center justify-between px-6 py-2.5 text-sm">
          <span class="text-muted-foreground">Tokyo (JST)</span>
          <RelativeTime
            :date="globalRelease"
            :now="now"
            locale="ja-JP"
            display="absolute"
            time-zone="Asia/Tokyo"
            class="text-foreground font-mono text-xs"
          />
        </div>
      </CardContent>
    </Card>
  </Story>

  <Story
    title="Combined relative and absolute format"
    description="display='both' prints the human relative delta alongside the formatted clock time."
  >
    <div class="space-y-2">
      <Card class="max-w-md">
        <CardContent class="py-4">
          <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Payment Received</p>
          <p class="mt-0.5 text-lg font-semibold">$4,250.00 USD</p>
          <div class="mt-2 text-xs">
            <RelativeTime
              date="2026-08-14T08:30:00.000Z"
              :now="now"
              locale="en"
              display="both"
              time-zone="UTC"
              numeric="always"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  </Story>

  <Story
    title="Density styles comparison"
    description="Compare formatStyle='long' vs 'short' vs 'narrow' for compact badges and narrow columns."
  >
    <div class="grid max-w-lg gap-3 rounded-lg border p-4 text-sm">
      <div class="flex items-center justify-between">
        <span class="text-muted-foreground">Long (default):</span>
        <RelativeTime date="2026-08-14T09:00:00.000Z" :now="now" locale="en" format-style="long" numeric="always" />
      </div>
      <div class="flex items-center justify-between">
        <span class="text-muted-foreground">Short:</span>
        <RelativeTime date="2026-08-14T09:00:00.000Z" :now="now" locale="en" format-style="short" numeric="always" />
      </div>
      <div class="flex items-center justify-between">
        <span class="text-muted-foreground">Narrow:</span>
        <RelativeTime date="2026-08-14T09:00:00.000Z" :now="now" locale="en" format-style="narrow" numeric="always" />
      </div>
    </div>
  </Story>

  <Story
    title="ISO string parsing (naive vs UTC)"
    description="parseAs='utc' forces timezone-less ISO strings ('2026-08-14T12:00:00') to parse as UTC instead of local."
  >
    <div class="flex flex-col gap-2 text-sm">
      <div class="flex items-center gap-2">
        <Badge variant="outline">parseAs="utc"</Badge>
        <RelativeTime
          date="2026-08-14T12:00:00"
          :now="now"
          locale="en-GB"
          display="both"
          time-zone="UTC"
          parse-as="utc"
        />
      </div>
    </div>
  </Story>
</template>
