'use client'

import * as React from 'react'
import { Download, Fingerprint, RadioTower, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'

type AuditAction = 'sign-in' | 'user.updated' | 'role.changed' | 'export' | 'delete'

export interface AuditEntry {
  id: string
  actor: string
  action: AuditAction
  target: string
  ip: string
  date: Date
}

export interface AuditLogProps {
  entries?: AuditEntry[]
  className?: string
}

const actionTone: Record<AuditAction, NonNullable<BadgeVariants['variant']>> = {
  'sign-in': 'secondary',
  'user.updated': 'default',
  'role.changed': 'warning',
  export: 'info',
  delete: 'destructive',
}

const now = Date.now()
const minutesAgo = (m: number) => new Date(now - m * 60_000)
const hoursAgo = (h: number) => new Date(now - h * 3_600_000)
const daysAgo = (d: number) => new Date(now - d * 86_400_000)

const stubEntries: AuditEntry[] = [
  {
    id: 'a1',
    actor: 'Amara Osei',
    action: 'role.changed',
    target: 'priya@acme.com → Editor',
    ip: '77.12.44.9',
    date: minutesAgo(4),
  },
  { id: 'a2', actor: 'System', action: 'export', target: 'payroll-2026-07.csv', ip: '—', date: minutesAgo(38) },
  {
    id: 'a3',
    actor: 'Jonas Weber',
    action: 'sign-in',
    target: 'admin.acme.com',
    ip: '84.190.201.3',
    date: hoursAgo(1),
  },
  {
    id: 'a4',
    actor: 'Priya Nair',
    action: 'user.updated',
    target: 'profile.phone',
    ip: '103.25.8.77',
    date: hoursAgo(3),
  },
  {
    id: 'a5',
    actor: 'Amara Osei',
    action: 'delete',
    target: 'draft-policy-v3.pdf',
    ip: '77.12.44.9',
    date: hoursAgo(5),
  },
  { id: 'a6', actor: 'Marcus Lee', action: 'sign-in', target: 'admin.acme.com', ip: '45.62.110.204', date: daysAgo(1) },
  {
    id: 'a7',
    actor: 'Priya Nair',
    action: 'user.updated',
    target: 'team/onboarding-flow',
    ip: '103.25.8.77',
    date: daysAgo(1),
  },
  { id: 'a8', actor: 'System', action: 'role.changed', target: 'contractors → Viewer', ip: '—', date: daysAgo(2) },
  {
    id: 'a9',
    actor: 'Jonas Weber',
    action: 'export',
    target: 'audit-trail-q2.json',
    ip: '84.190.201.3',
    date: daysAgo(2),
  },
  {
    id: 'a10',
    actor: 'Marcus Lee',
    action: 'delete',
    target: 'staging-deploy-key',
    ip: '45.62.110.204',
    date: daysAgo(3),
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function AuditLog({ entries, className }: AuditLogProps) {
  const [search, setSearch] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState<'all' | AuditAction>('all')

  const source = entries ?? stubEntries
  const filtered = source.filter((entry) => {
    const matchesQuery = search === '' || `${entry.actor} ${entry.target}`.toLowerCase().includes(search.toLowerCase())
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter
    return matchesQuery && matchesAction
  })

  return (
    <SectionCard
      data-slot="audit-log"
      title="Audit log"
      description="Who changed what, when — across your workspace."
      className={className}
      headerAction={
        <span className="text-success flex items-center gap-1.5 text-xs font-medium">
          <RadioTower className="size-3.5" aria-hidden="true" />
          live
        </span>
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor or target…"
            className="pl-8"
          />
        </div>
        <Select value={actionFilter} onValueChange={(value) => setActionFilter(value as 'all' | AuditAction)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {(Object.keys(actionTone) as AuditAction[]).map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button aria-label="Download attachment" variant="outline" size="sm">
          <Download aria-hidden="true" />
          Export
        </Button>
      </div>

      <ul className="-mb-4 divide-y">
        {filtered.length === 0 && (
          <li className="text-muted-foreground flex flex-col items-center gap-2 py-10 text-sm">
            <Fingerprint className="size-6 opacity-50" aria-hidden="true" />
            No activity matches your filters.
          </li>
        )}
        {filtered.map((entry) => (
          <li key={entry.id} className="flex items-center gap-3 py-3">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{initials(entry.actor)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{entry.actor}</p>
                <Badge variant={actionTone[entry.action]} className="shrink-0">
                  {entry.action}
                </Badge>
              </div>
              <p className="text-muted-foreground truncate font-mono text-xs">{entry.target}</p>
            </div>
            <div className="hidden text-right sm:block">
              <RelativeTime date={entry.date} className="text-muted-foreground block text-xs" />
              <p className="text-muted-foreground/70 font-mono text-xs">{entry.ip}</p>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
