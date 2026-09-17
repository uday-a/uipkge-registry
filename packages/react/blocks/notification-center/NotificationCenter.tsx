'use client'

import * as React from 'react'
import { BellOff, Check, CheckCheck, MessageSquare, ShieldAlert, UserPlus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RelativeTime } from '@/components/ui/relative-time'
import { SectionCard } from '@/components/ui/section-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type NotificationCategory = 'mention' | 'comment' | 'system' | 'security'

export interface NotificationCenterItem {
  id: string
  category: NotificationCategory
  title: string
  body: string
  date: Date
  read: boolean
}

export interface NotificationCenterProps {
  notifications?: NotificationCenterItem[]
  className?: string
}

const categoryConfig: Record<
  NotificationCategory,
  { icon: React.ComponentType<{ className?: string }>; tileClass: string }
> = {
  mention: { icon: UserPlus, tileClass: 'bg-primary/10 text-primary' },
  comment: { icon: MessageSquare, tileClass: 'bg-chart-3/10 text-chart-3' },
  system: { icon: BellOff, tileClass: 'bg-muted text-muted-foreground' },
  security: { icon: ShieldAlert, tileClass: 'bg-warning/10 text-warning' },
}

const now = new Date()
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000)
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000)
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000)

const stubNotifications: NotificationCenterItem[] = [
  {
    id: 'n1',
    category: 'mention',
    title: 'Priya mentioned you',
    body: '@amara can you review the onboarding flow?',
    date: minutesAgo(6),
    read: false,
  },
  {
    id: 'n2',
    category: 'security',
    title: 'New sign-in from Berlin',
    body: 'Chrome on macOS · 84.190.201.3',
    date: minutesAgo(52),
    read: false,
  },
  {
    id: 'n3',
    category: 'comment',
    title: 'Jonas commented',
    body: 'Shipped the fix — closing the ticket.',
    date: hoursAgo(2),
    read: false,
  },
  {
    id: 'n4',
    category: 'system',
    title: 'Weekly digest ready',
    body: 'Your workspace summary for last week.',
    date: hoursAgo(20),
    read: true,
  },
  {
    id: 'n5',
    category: 'mention',
    title: 'Marcus mentioned you',
    body: 'Design review moved to 15:00, @amara.',
    date: daysAgo(1),
    read: false,
  },
  {
    id: 'n6',
    category: 'comment',
    title: 'Amara commented',
    body: 'Copy updated per legal review.',
    date: daysAgo(1),
    read: true,
  },
  {
    id: 'n7',
    category: 'security',
    title: 'API key rotated',
    body: 'uipkge_live_…4f2a was rotated automatically.',
    date: daysAgo(2),
    read: true,
  },
]

export function NotificationCenter({ notifications, className }: NotificationCenterProps) {
  const [items, setItems] = React.useState<NotificationCenterItem[]>(notifications ?? stubNotifications)
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'mentions'>('all')

  function patch(id: string, changes: Partial<NotificationCenterItem>) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, ...changes } : n)))
  }

  const unreadCount = items.filter((n) => !n.read).length

  const filtered = items.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'mentions') return n.category === 'mention'
    return true
  })

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const groups = [
    { label: 'Today', items: filtered.filter((n) => n.date >= startOfToday) },
    { label: 'Earlier', items: filtered.filter((n) => n.date < startOfToday) },
  ].filter((group) => group.items.length > 0)

  return (
    <SectionCard
      data-slot="notification-center"
      title="Notifications"
      description="Everything that needs your attention."
      className={className}
      headerAction={
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && <Badge variant="default">{unreadCount} new</Badge>}
          <Button
            variant="ghost"
            size="sm"
            disabled={unreadCount === 0}
            onClick={() => setItems((l) => l.map((n) => ({ ...n, read: true })))}
          >
            <CheckCheck aria-hidden="true" />
            Mark all read
          </Button>
        </div>
      }
    >
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="mb-2">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>
      </Tabs>

      {groups.length === 0 && (
        <div className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-sm">
          <BellOff className="size-6 opacity-50" aria-hidden="true" />
          {filter === 'mentions'
            ? "No mentions — you're all caught up."
            : filter === 'unread'
              ? 'Nothing unread. Nice work.'
              : 'Your inbox is empty.'}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.label} className="mb-2">
          <p className="text-muted-foreground py-1.5 text-xs font-medium tracking-widest uppercase">{group.label}</p>
          <ul className="divide-y">
            {group.items.map((notification) => {
              const Icon = categoryConfig[notification.category].icon
              return (
                <li
                  key={notification.id}
                  className="group hover:bg-accent/40 -mx-2 flex cursor-pointer items-start gap-3 rounded-md px-2 py-3 transition-colors"
                  onClick={() => patch(notification.id, { read: true })}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md',
                      categoryConfig[notification.category].tileClass,
                    )}
                    aria-hidden="true"
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn('truncate text-sm', notification.read ? 'font-normal' : 'font-medium')}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="bg-primary size-1.5 shrink-0 rounded-full" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-muted-foreground truncate text-xs">{notification.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <RelativeTime date={notification.date} className="text-muted-foreground text-xs" />
                    <span className="flex opacity-0 transition-opacity group-hover:opacity-100">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Mark as read"
                          onClick={(e) => {
                            e.stopPropagation()
                            patch(notification.id, { read: true })
                          }}
                        >
                          <Check aria-hidden="true" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" aria-label="Dismiss" onClick={(e) => e.stopPropagation()}>
                        <X aria-hidden="true" />
                      </Button>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </SectionCard>
  )
}
