'use client'

import * as React from 'react'
import {
  UserPlus,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  Target,
  X,
  BellOff,
  Archive,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type NotificationCategory = 'hr' | 'payroll' | 'timeoff' | 'performance' | 'training' | 'system'

interface Notification {
  id: string
  title: string
  body: string
  category: NotificationCategory
  timestamp: Date
  read: boolean
  actionUrl?: string
  actor?: string
}

const categoryConfig: Record<NotificationCategory, { icon: LucideIcon; accent: string; bg: string }> = {
  hr: {
    icon: UserPlus,
    accent: 'bg-success',
    bg: 'bg-success/10 text-success',
  },
  payroll: {
    icon: CreditCard,
    accent: 'bg-info',
    bg: 'bg-info/10 text-info',
  },
  timeoff: {
    icon: Calendar,
    accent: 'bg-chart-3',
    bg: 'bg-chart-3/10 text-chart-3',
  },
  performance: {
    icon: Target,
    accent: 'bg-warning',
    bg: 'bg-warning/10 text-warning',
  },
  training: {
    icon: GraduationCap,
    accent: 'bg-primary',
    bg: 'bg-primary/10 text-primary',
  },
  system: {
    icon: FileText,
    accent: 'bg-muted-foreground',
    bg: 'bg-muted text-muted-foreground',
  },
}

const now = new Date()

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'Time off approved',
    body: 'Your annual leave request for Mar 15-18 has been approved by Sarah Connor.',
    category: 'timeoff',
    timestamp: new Date(now.getTime() - 12 * 60 * 1000),
    read: false,
    actor: 'Sarah Connor',
  },
  {
    id: '2',
    title: 'New employee onboarded',
    body: 'Marcus Rivera has joined the Engineering team as Senior Developer.',
    category: 'hr',
    timestamp: new Date(now.getTime() - 45 * 60 * 1000),
    read: false,
    actor: 'Marcus Rivera',
  },
  {
    id: '3',
    title: 'Performance review due',
    body: 'Annual performance review for 3 direct reports is due by end of this week.',
    category: 'performance',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '4',
    title: 'Payroll processed',
    body: 'March 2026 payroll has been processed successfully. 103 employees paid.',
    category: 'payroll',
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '5',
    title: 'Training enrollment open',
    body: 'New course available: "Leadership Fundamentals Q2". Enroll before Mar 20.',
    category: 'training',
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '6',
    title: 'Document requires signature',
    body: 'Updated Employee Handbook 2026 needs your acknowledgement.',
    category: 'system',
    timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/documents',
  },
  {
    id: '7',
    title: 'Time off request pending',
    body: 'Alice Johnson requested sick leave for Mar 12. Awaiting your approval.',
    category: 'timeoff',
    timestamp: new Date(now.getTime() - 28 * 60 * 60 * 1000),
    read: true,
    actor: 'Alice Johnson',
  },
  {
    id: '8',
    title: 'Benefits enrollment closing',
    body: "Open enrollment period ends Mar 31. 12 employees haven't enrolled yet.",
    category: 'hr',
    timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000),
    read: true,
  },
]

const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

function formatTime(date: Date): string {
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

const STYLE_ID = 'notifications-popover-styles'
const STYLE_CONTENT = `
.notification-panel {
  --scrollbar-size: 4px;
}
.notification-scroll::-webkit-scrollbar {
  width: var(--scrollbar-size);
}
.notification-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.notification-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.notification-item {
  cursor: pointer;
  transition: background-color 0.15s ease;
  animation: notif-slide-in 0.25s ease both;
}
.notification-item:hover {
  background-color: var(--muted);
}
@keyframes notif-slide-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.notification-scroll {
  position: relative;
}
.notification-scroll::after {
  content: '';
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  height: 24px;
  margin-top: -24px;
  background: linear-gradient(to bottom, transparent, var(--popover));
  pointer-events: none;
}
`

export interface NotificationsPopoverProps {
  /** Custom trigger. Receives the live unread count. */
  trigger?: (ctx: { unreadCount: number }) => React.ReactNode
}

export function NotificationsPopover({ trigger }: NotificationsPopoverProps) {
  // Inject scoped styles once.
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = STYLE_CONTENT
    document.head.appendChild(el)
  }, [])

  const [notifications, setNotifications] = React.useState<Notification[]>(initialNotifications)
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'unread'>('all')
  const [isOpen, setIsOpen] = React.useState(false)

  const unreadCount = React.useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const filteredNotifications = React.useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter((n) => !n.read)
    }
    return notifications
  }, [notifications, activeFilter])

  const groupedNotifications = React.useMemo(() => {
    const today = filteredNotifications.filter((n) => n.timestamp >= todayStart)
    const earlier = filteredNotifications.filter((n) => n.timestamp < todayStart)
    return { today, earlier }
  }, [filteredNotifications])

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function dismissNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function renderItem(n: Notification, animationDelay: number) {
    const Icon = categoryConfig[n.category].icon
    return (
      <div
        data-slot="notifications-popover"
        key={n.id}
        className="notification-item group relative"
        style={{ animationDelay: `${animationDelay}ms` }}
        onClick={() => markAsRead(n.id)}
      >
        <div
          className={[
            'absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full transition-opacity',
            !n.read ? categoryConfig[n.category].accent : 'opacity-0',
          ].join(' ')}
        />

        <div className="flex gap-3 px-4 py-3">
          <div
            className={[
              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
              categoryConfig[n.category].bg,
            ].join(' ')}
          >
            <Icon className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className={['text-[13px] leading-snug', !n.read ? 'font-semibold' : 'font-medium'].join(' ')}>
                {n.title}
              </p>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="text-muted-foreground text-xs whitespace-nowrap tabular-nums">
                  {formatTime(n.timestamp)}
                </span>
                {!n.read ? <span className="bg-primary size-1.5 shrink-0 rounded-full" /> : null}
              </div>
            </div>
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">{n.body}</p>
          </div>

          <button
            className="text-muted-foreground hover:text-foreground mt-0.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            title="Dismiss"
            onClick={(e) => {
              e.stopPropagation()
              dismissNotification(n.id)
            }}
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger ? trigger({ unreadCount }) : <span />}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="notification-panel w-full max-w-[380px] overflow-hidden rounded-lg border p-0 shadow-xl"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-semibold tracking-tight">Notifications</h3>
            {unreadCount > 0 ? (
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15 h-5 rounded-full px-1.5 text-xs font-bold tabular-nums">
                {unreadCount}
              </Badge>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground -mr-1 h-7 px-2 text-xs"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          ) : null}
        </div>

        <div className="border-b px-4">
          <div className="flex gap-0">
            <button
              className={[
                'relative px-3 pb-2.5 text-xs font-medium transition-colors',
                activeFilter === 'all' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              onClick={() => setActiveFilter('all')}
            >
              All
              {activeFilter === 'all' ? (
                <span className="bg-primary absolute right-0 bottom-0 left-0 h-[2px] rounded-t-full" />
              ) : null}
            </button>
            <button
              className={[
                'relative px-3 pb-2.5 text-xs font-medium transition-colors',
                activeFilter === 'unread' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
              onClick={() => setActiveFilter('unread')}
            >
              Unread
              {activeFilter === 'unread' ? (
                <span className="bg-primary absolute right-0 bottom-0 left-0 h-[2px] rounded-t-full" />
              ) : null}
            </button>
          </div>
        </div>

        <div className="notification-scroll max-h-[420px] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="bg-muted mb-3 rounded-full p-3">
                <BellOff className="text-muted-foreground size-5" />
              </div>
              <p className="text-sm font-medium">All caught up</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                No {activeFilter === 'unread' ? 'unread ' : ''}notifications
              </p>
            </div>
          ) : (
            <>
              {groupedNotifications.today.length > 0 ? (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Today</span>
                  </div>
                  {groupedNotifications.today.map((n, index) => renderItem(n, index * 30))}
                </>
              ) : null}

              {groupedNotifications.earlier.length > 0 ? (
                <>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                      Earlier
                    </span>
                  </div>
                  {groupedNotifications.earlier.map((n, index) =>
                    renderItem(n, (groupedNotifications.today.length + index) * 30),
                  )}
                </>
              ) : null}
            </>
          )}
        </div>

        <div className="border-t px-4 py-2.5">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-xs transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Archive className="size-3" />
            View all notifications
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}
