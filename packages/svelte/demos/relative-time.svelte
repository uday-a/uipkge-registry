<script lang="ts">
  import { RelativeTime } from '@svelte-registry/relative-time'
  import { AlertCircle, Clock, GitCommit, Globe, RefreshCw, UserCheck } from '@lucide/svelte'

  let { story }: { story: string } = $props()

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

  const statusDot: Record<string, string> = {
    active: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-muted-foreground',
  }
</script>

{#if story === 'User directory table'}
  <div class="overflow-hidden rounded-lg border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b text-left">
          <th class="text-muted-foreground px-4 py-2.5 font-medium">User</th>
          <th class="text-muted-foreground px-4 py-2.5 font-medium">Status</th>
          <th class="text-muted-foreground px-4 py-2.5 font-medium">Role</th>
          <th class="text-muted-foreground px-4 py-2.5 font-medium">Created</th>
          <th class="text-muted-foreground px-4 py-2.5 text-right font-medium">Last active</th>
        </tr>
      </thead>
      <tbody>
        {#each users as u (u.id)}
          <tr class="border-b last:border-0">
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-3">
                <span
                  class="bg-muted flex size-8 items-center justify-center rounded-full text-xs font-medium"
                  aria-hidden="true"
                >
                  {u.initials}
                </span>
                <div>
                  <p class="text-sm font-medium">{u.name}</p>
                  <p class="text-muted-foreground text-xs">{u.email}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-2.5">
              <span class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <span class="size-1.5 rounded-full {statusDot[u.status]}"></span>
                <span>{u.status === 'active' ? 'Active' : u.status === 'away' ? 'Away' : 'Offline'}</span>
              </span>
            </td>
            <td class="px-4 py-2.5">
              <span class="rounded-md border px-2 py-0.5 text-xs">{u.role}</span>
            </td>
            <td class="px-4 py-2.5">
              <RelativeTime date={u.createdAt} {now} locale="en" formatStyle="short" />
            </td>
            <td class="px-4 py-2.5 text-right">
              <RelativeTime date={u.lastActive} {now} locale="en" />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

{#if story === 'Inside status chips and badges'}
  <div class="flex flex-wrap items-center gap-3">
    <span class="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
      <Clock class="size-3" aria-hidden="true" />
      <span>Synced</span>
      <RelativeTime date="2026-08-14T11:58:00.000Z" {now} locale="en" formatStyle="narrow" />
    </span>

    <span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs">
      <RefreshCw class="size-3" aria-hidden="true" />
      <span>Last polled:</span>
      <RelativeTime date="2026-08-14T11:50:00.000Z" {now} locale="en" formatStyle="short" />
    </span>

    <span class="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs">
      <UserCheck class="size-3" aria-hidden="true" />
      <span>Verified</span>
      <RelativeTime date="2026-08-13T10:00:00.000Z" {now} locale="en" />
    </span>

    <span class="bg-destructive inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-white">
      <AlertCircle class="size-3" aria-hidden="true" />
      <span>Failed</span>
      <RelativeTime date="2026-08-14T11:15:00.000Z" {now} locale="en" />
    </span>
  </div>
{/if}

{#if story === 'Audit log event stream'}
  <div class="space-y-2.5">
    {#each auditEvents as e (e.id)}
      <div class="bg-card rounded-lg border">
        <div class="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="rounded-md border px-2 py-0.5 text-xs">{e.badge}</span>
              <p class="text-sm font-medium">{e.action}</p>
            </div>
            <p class="text-muted-foreground text-xs">
              Target: <span class="text-foreground font-mono">{e.target}</span> · Actor: {e.actor}
            </p>
          </div>
          <RelativeTime date={e.time} {now} locale="en" class="shrink-0 text-xs" />
        </div>
      </div>
    {/each}
  </div>
{/if}

{#if story === 'Git commit history'}
  <div class="bg-card max-w-2xl rounded-lg border">
    <div class="flex items-center gap-2 px-6 pt-4 pb-3 text-sm font-semibold">
      <GitCommit class="text-primary size-4" aria-hidden="true" />
      <span>Latest commits on main</span>
    </div>
    <div class="divide-y">
      {#each commits as c (c.hash)}
        <div class="flex items-center justify-between gap-4 px-6 py-3 text-sm">
          <div class="flex min-w-0 items-center gap-3">
            <kbd class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{c.hash}</kbd>
            <span class="truncate">{c.message}</span>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="text-muted-foreground font-mono text-xs">@{c.author}</span>
            <span class="text-muted-foreground text-xs">·</span>
            <RelativeTime date={c.time} {now} locale="en" formatStyle="narrow" class="text-xs" />
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

{#if story === 'Scheduled jobs (future deltas)'}
  <div class="grid gap-3 sm:grid-cols-2">
    {#each scheduledJobs as job (job.name)}
      <div class="bg-card rounded-lg border">
        <div class="flex items-start justify-between px-4 py-4">
          <div>
            <p class="text-sm font-medium">{job.name}</p>
            <p class="text-muted-foreground mt-1 text-xs">
              Scheduled for
              <RelativeTime date={job.nextRun} {now} locale="en" class="text-foreground font-medium" />
            </p>
          </div>
          {#if job.sla === 'urgent'}
            <span class="bg-destructive rounded-md px-2 py-0.5 text-xs text-white">High priority</span>
          {:else}
            <span class="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">Queued</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}

{#if story === 'Multi-timezone matrix'}
  <div class="bg-card max-w-2xl rounded-lg border">
    <div class="px-6 pt-4 pb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Globe class="text-primary size-4" aria-hidden="true" />
          <p class="text-sm font-semibold">v2.4.0 Global Deployment</p>
        </div>
        <span class="rounded-md border px-2 py-0.5 text-xs">
          <RelativeTime date={globalRelease} {now} locale="en" />
        </span>
      </div>
      <p class="text-muted-foreground mt-1 text-xs">Target release scheduled in 3 hours 30 minutes.</p>
    </div>
    <div class="divide-y">
      <div class="flex items-center justify-between px-6 py-2.5 text-sm">
        <span class="text-muted-foreground">Universal Coordinated Time (UTC)</span>
        <RelativeTime
          date={globalRelease}
          {now}
          locale="en-GB"
          display="absolute"
          timeZone="UTC"
          class="text-foreground font-mono text-xs"
        />
      </div>
      <div class="flex items-center justify-between px-6 py-2.5 text-sm">
        <span class="text-muted-foreground">New York (EDT)</span>
        <RelativeTime
          date={globalRelease}
          {now}
          locale="en-US"
          display="absolute"
          timeZone="America/New_York"
          class="text-foreground font-mono text-xs"
        />
      </div>
      <div class="flex items-center justify-between px-6 py-2.5 text-sm">
        <span class="text-muted-foreground">London (BST)</span>
        <RelativeTime
          date={globalRelease}
          {now}
          locale="en-GB"
          display="absolute"
          timeZone="Europe/London"
          class="text-foreground font-mono text-xs"
        />
      </div>
      <div class="flex items-center justify-between px-6 py-2.5 text-sm">
        <span class="text-muted-foreground">Tokyo (JST)</span>
        <RelativeTime
          date={globalRelease}
          {now}
          locale="ja-JP"
          display="absolute"
          timeZone="Asia/Tokyo"
          class="text-foreground font-mono text-xs"
        />
      </div>
    </div>
  </div>
{/if}

{#if story === 'Combined relative and absolute format'}
  <div class="space-y-2">
    <div class="bg-card max-w-md rounded-lg border">
      <div class="px-4 py-4">
        <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Payment Received</p>
        <p class="mt-0.5 text-lg font-semibold">$4,250.00 USD</p>
        <div class="mt-2 text-xs">
          <RelativeTime
            date="2026-08-14T08:30:00.000Z"
            {now}
            locale="en"
            display="both"
            timeZone="UTC"
            numeric="always"
          />
        </div>
      </div>
    </div>
  </div>
{/if}

{#if story === 'Density styles comparison'}
  <div class="grid max-w-lg gap-3 rounded-lg border p-4 text-sm">
    <div class="flex items-center justify-between">
      <span class="text-muted-foreground">Long (default):</span>
      <RelativeTime date="2026-08-14T09:00:00.000Z" {now} locale="en" formatStyle="long" numeric="always" />
    </div>
    <div class="flex items-center justify-between">
      <span class="text-muted-foreground">Short:</span>
      <RelativeTime date="2026-08-14T09:00:00.000Z" {now} locale="en" formatStyle="short" numeric="always" />
    </div>
    <div class="flex items-center justify-between">
      <span class="text-muted-foreground">Narrow:</span>
      <RelativeTime date="2026-08-14T09:00:00.000Z" {now} locale="en" formatStyle="narrow" numeric="always" />
    </div>
  </div>
{/if}

{#if story === 'ISO string parsing (naive vs UTC)'}
  <div class="flex flex-col gap-2 text-sm">
    <div class="flex items-center gap-2">
      <span class="rounded-md border px-2 py-0.5 text-xs">parseAs="utc"</span>
      <RelativeTime
        date="2026-08-14T12:00:00"
        {now}
        locale="en-GB"
        display="both"
        timeZone="UTC"
        parseAs="utc"
      />
    </div>
  </div>
{/if}
