'use client'

import * as React from 'react'
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Forward,
  Inbox as InboxIcon,
  MoreVertical,
  Paperclip,
  Pencil,
  Reply,
  ReplyAll,
  Search,
  Send,
  Smile,
  Star,
  Tag,
  Trash2,
  AlertOctagon,
  FileText,
  Bookmark,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type ReplyMode = 'reply' | 'reply-all' | 'forward'

type FolderId = 'inbox' | 'starred' | 'sent' | 'drafts' | 'spam' | 'trash'

interface Folder {
  id: FolderId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface LabelTag {
  id: string
  label: string
  color: string
}

interface Mail {
  id: string
  folder: FolderId
  from: { name: string; email: string; initials: string }
  to: string
  subject: string
  preview: string
  body: string
  receivedAt: Date
  read: boolean
  starred: boolean
  hasAttachment: boolean
  labels: string[]
}

const folders: Folder[] = [
  { id: 'inbox', label: 'Inbox', icon: InboxIcon },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'drafts', label: 'Drafts', icon: FileText },
  { id: 'spam', label: 'Spam', icon: AlertOctagon },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]

const labels: LabelTag[] = [
  { id: 'work', label: 'Work', color: 'bg-primary' },
  { id: 'personal', label: 'Personal', color: 'bg-success' },
  { id: 'finance', label: 'Finance', color: 'bg-info' },
  { id: 'travel', label: 'Travel', color: 'bg-warning' },
]

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const defaultMails: Mail[] = [
  {
    id: 'e1',
    folder: 'inbox',
    from: { name: 'Sarah Connor', email: 'sarah@acme.com', initials: 'SC' },
    to: 'you@acme.com',
    subject: 'Q2 OKR draft — your sign-off needed',
    preview:
      'Pulled together the Q2 OKR draft from the leadership offsite. I have flagged the two areas where we need…',
    body: `Hi,\n\nPulled together the Q2 OKR draft from the leadership offsite. I have flagged the two areas where we need your call before we lock it:\n\n• Hiring plan: 4 vs 6 ENG roles (page 3)\n• EU rollout timing: April vs June (page 7)\n\nGoing to share with the rest of the leadership team Wednesday EOD, so anything from you by Tuesday is great.\n\nThanks,\nSarah`,
    receivedAt: new Date(now.getTime() - 18 * 60 * 1000),
    read: false,
    starred: true,
    hasAttachment: true,
    labels: ['work'],
  },
  {
    id: 'e2',
    folder: 'inbox',
    from: { name: 'Marcus Rivera', email: 'marcus@acme.com', initials: 'MR' },
    to: 'you@acme.com',
    subject: 'Re: Dashboard review tomorrow',
    preview:
      'Yes! Pushing to 10:30 so we can join from the standup. I will own the slides and pull the latest kanban metrics.',
    body: `Yes! Pushing to 10:30 so we can join from the standup. I will own the slides and pull the latest kanban metrics.\n\nFew things I want to cover:\n  - Throughput delta vs last sprint\n  - The two stories we de-scoped\n  - Q2 capacity ask\n\nSee you tomorrow,\nMarcus`,
    receivedAt: new Date(now.getTime() - 95 * 60 * 1000),
    read: false,
    starred: false,
    hasAttachment: false,
    labels: ['work'],
  },
  {
    id: 'e3',
    folder: 'inbox',
    from: { name: 'Stripe', email: 'receipts@stripe.com', initials: 'St' },
    to: 'you@acme.com',
    subject: 'Your invoice from Acme Inc. — $1,290.00',
    preview: 'Thanks for using Stripe. Your invoice for the period Mar 1 – Mar 31 is attached. Total due: $1,290.00…',
    body: 'Thanks for using Stripe. Your invoice for the period Mar 1 – Mar 31 is attached. Total due: $1,290.00.',
    receivedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: true,
    labels: ['finance'],
  },
  {
    id: 'e4',
    folder: 'inbox',
    from: { name: 'Linear', email: 'no-reply@linear.app', initials: 'Li' },
    to: 'you@acme.com',
    subject: 'Weekly summary: 14 issues closed, 22 opened',
    preview:
      'Good news — the team closed 14 issues this week, up 3 from last week. Top contributors: Marcus, Priya, Devon.',
    body: 'Good news — the team closed 14 issues this week, up 3 from last week. Top contributors: Marcus, Priya, Devon.',
    receivedAt: new Date(now.getTime() - 9 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: false,
    labels: ['work'],
  },
  {
    id: 'e5',
    folder: 'inbox',
    from: { name: 'Priya Shah', email: 'priya@acme.com', initials: 'PS' },
    to: 'you@acme.com',
    subject: 'Color tokens are live in staging',
    preview:
      'Pushed the new OKLCH token set to staging. All chart colors, success/warning/info, sidebar variants. Take a look…',
    body: 'Pushed the new OKLCH token set to staging. All chart colors, success/warning/info, sidebar variants. Take a look when you have a sec.',
    receivedAt: yesterday,
    read: true,
    starred: true,
    hasAttachment: false,
    labels: ['work'],
  },
  {
    id: 'e6',
    folder: 'inbox',
    from: { name: 'United Airlines', email: 'reservations@united.com', initials: 'UA' },
    to: 'you@acme.com',
    subject: 'Your itinerary: SFO → LHR, departing Apr 12',
    preview: 'Your reservation is confirmed. Check-in opens 24h before departure. Booking reference: 7HQ4P2.',
    body: 'Your reservation is confirmed. Check-in opens 24h before departure. Booking reference: 7HQ4P2.',
    receivedAt: new Date(now.getTime() - 38 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: true,
    labels: ['travel'],
  },
  {
    id: 'e7',
    folder: 'inbox',
    from: { name: 'Mom', email: 'mom@family.net', initials: 'M' },
    to: 'you@acme.com',
    subject: 'Sunday lunch?',
    preview: 'Are you free for lunch this Sunday? Dad is making his lasagne. Let me know!',
    body: 'Are you free for lunch this Sunday? Dad is making his lasagne. Let me know!',
    receivedAt: new Date(now.getTime() - 55 * 60 * 60 * 1000),
    read: true,
    starred: false,
    hasAttachment: false,
    labels: ['personal'],
  },
]

export interface InboxProps {
  messages?: Mail[]
}

function formatMailTime(d: Date): string {
  if (d >= todayStart) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
  if (diffDays < 7) return d.toLocaleDateString(undefined, { weekday: 'short' })
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatFullTime(d: Date): string {
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function labelMeta(id: string): LabelTag | undefined {
  return labels.find((l) => l.id === id)
}

export function Inbox({ messages = defaultMails }: InboxProps) {
  const [mails, setMails] = React.useState<Mail[]>(messages)
  const [activeFolder, setActiveFolder] = React.useState<FolderId>('inbox')
  const [activeLabel, setActiveLabel] = React.useState<string | null>(null)
  const [activeId, setActiveId] = React.useState<string>('e1')
  const [search, setSearch] = React.useState('')
  const [replyMode, setReplyMode] = React.useState<ReplyMode>('reply')
  const [replyDraft, setReplyDraft] = React.useState('')
  const [justSent, setJustSent] = React.useState(false)

  function unreadCount(id: FolderId): number {
    if (id === 'starred') return mails.filter((m) => m.starred && !m.read && m.folder !== 'trash').length
    return mails.filter((m) => m.folder === id && !m.read).length
  }

  const labelCounts = React.useMemo(
    () =>
      labels.reduce<Record<string, number>>((acc, l) => {
        acc[l.id] = mails.filter((m) => m.labels.includes(l.id)).length
        return acc
      }, {}),
    [mails],
  )

  const visibleMails = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = mails.filter((m) => {
      if (activeLabel) return m.labels.includes(activeLabel)
      if (activeFolder === 'starred') return m.starred && m.folder !== 'trash'
      return m.folder === activeFolder
    })
    if (q) {
      list = list.filter(
        (m) =>
          m.subject.toLowerCase().includes(q) ||
          m.from.name.toLowerCase().includes(q) ||
          m.preview.toLowerCase().includes(q),
      )
    }
    return [...list].sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
  }, [mails, search, activeLabel, activeFolder])

  const activeMail = React.useMemo(() => mails.find((m) => m.id === activeId) ?? null, [mails, activeId])

  function selectMail(id: string) {
    setActiveId(id)
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  function selectFolder(id: FolderId) {
    setActiveFolder(id)
    setActiveLabel(null)
    const list = [...mails]
      .filter((m) => (id === 'starred' ? m.starred && m.folder !== 'trash' : m.folder === id))
      .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
    const first = list[0]
    if (first) setActiveId(first.id)
  }

  function selectLabel(id: string) {
    setActiveLabel(id)
    const list = [...mails]
      .filter((m) => m.labels.includes(id))
      .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
    const first = list[0]
    if (first) setActiveId(first.id)
  }

  function toggleStar(id: string, e?: React.SyntheticEvent) {
    e?.stopPropagation()
    setMails((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)))
  }

  function archive(id: string) {
    setMails((prev) => {
      const next = prev.filter((m) => m.id !== id)
      const visible = [...next]
        .filter((m) => {
          if (activeLabel) return m.labels.includes(activeLabel)
          if (activeFolder === 'starred') return m.starred && m.folder !== 'trash'
          return m.folder === activeFolder
        })
        .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime())
      const nextActive = visible[0]
      if (nextActive) setActiveId(nextActive.id)
      return next
    })
  }

  const replyRecipient = React.useMemo(() => {
    const m = activeMail
    if (!m) return ''
    if (replyMode === 'forward') return ''
    return m.from.name + ' <' + m.from.email + '>'
  }, [activeMail, replyMode])

  const replyPlaceholder = replyMode === 'forward' ? 'Add a note before forwarding' : 'Write a reply'

  const sendDisabled = !replyDraft.trim() || (replyMode === 'forward' && false)

  function changeReplyMode(mode: ReplyMode) {
    setReplyMode(mode)
    setJustSent(false)
  }

  function sendReply() {
    const body = replyDraft.trim()
    if (!body) return
    setReplyDraft('')
    setJustSent(true)
    window.setTimeout(() => {
      setJustSent(false)
    }, 1800)
  }

  function onReplyKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      sendReply()
    }
  }

  React.useEffect(() => {
    setReplyDraft('')
    setReplyMode('reply')
    setJustSent(false)
  }, [activeId])

  return (
    <div
      data-slot="inbox"
      className="bg-card text-card-foreground grid h-[680px] w-full grid-cols-[220px_340px_1fr] overflow-hidden rounded-xl border shadow-sm"
    >
      <aside className="bg-muted/30 flex min-w-0 flex-col border-r">
        <div className="flex h-14 shrink-0 items-center border-b px-3">
          <Button className="h-9 w-full justify-start gap-2 rounded-lg" size="sm">
            <Pencil className="size-4" />
            Compose
          </Button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-3 pb-3">
          <p className="text-muted-foreground px-2 pb-1 text-xs font-semibold tracking-widest uppercase">Folders</p>
          {folders.map((f) => (
            <button
              key={f.id}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                activeFolder === f.id && !activeLabel
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/60 text-foreground/80',
              )}
              onClick={() => selectFolder(f.id)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <f.icon className="size-4 shrink-0" />
                <span className="truncate">{f.label}</span>
              </span>
              {unreadCount(f.id) > 0 && (
                <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{unreadCount(f.id)}</span>
              )}
            </button>
          ))}

          <p className="text-muted-foreground mt-4 px-2 pb-1 text-xs font-semibold tracking-widest uppercase">Labels</p>
          {labels.map((l) => (
            <button
              key={l.id}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                activeLabel === l.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/60 text-foreground/80',
              )}
              onClick={() => selectLabel(l.id)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className={cn('size-2.5 shrink-0 rounded-full', l.color)} />
                <span className="truncate">{l.label}</span>
              </span>
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">{labelCounts[l.id] ?? 0}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="bg-background flex min-w-0 flex-col border-r">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mail"
              className="h-8 rounded-lg pl-8 text-xs"
            />
          </div>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Filter">
            <Tag className="size-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h2 className="text-sm font-semibold tracking-tight capitalize">
            {activeLabel ? labelMeta(activeLabel)?.label : activeFolder}
          </h2>
          <span className="text-muted-foreground text-xs tabular-nums">
            {visibleMails.length} message{visibleMails.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="list-scroll flex-1 overflow-y-auto pb-3">
          {visibleMails.map((m) => (
            <button
              aria-label="Attach file"
              key={m.id}
              className={cn(
                'group relative w-full px-4 py-3 text-left transition-colors',
                m.id === activeId ? 'bg-primary/5' : 'hover:bg-muted/60',
              )}
              onClick={() => selectMail(m.id)}
            >
              {m.id === activeId && (
                <span className="bg-primary absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full" />
              )}
              <div className="flex items-start gap-3">
                <Avatar className="mt-0.5 size-8 shrink-0">
                  <AvatarFallback className="text-xs">{m.from.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn('truncate text-sm', m.read ? 'font-medium' : 'font-semibold')}>{m.from.name}</p>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      {formatMailTime(m.receivedAt)}
                    </span>
                  </div>
                  <p className={cn('mt-0.5 truncate text-xs', m.read ? 'text-foreground/80' : 'font-semibold')}>
                    {m.subject}
                  </p>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">{m.preview}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {m.labels.map((lid) => (
                      <span
                        key={lid}
                        className="text-muted-foreground bg-muted inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs"
                      >
                        <span className={cn('size-1.5 rounded-full', labelMeta(lid)?.color)} />
                        {labelMeta(lid)?.label}
                      </span>
                    ))}
                    {m.hasAttachment && <Paperclip className="text-muted-foreground size-3" />}
                    {!m.read && <span className="bg-primary ml-auto size-1.5 shrink-0 rounded-full" />}
                  </div>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  className="text-muted-foreground hover:text-warning inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors"
                  title={m.starred ? 'Unstar' : 'Star'}
                  onClick={(e) => toggleStar(m.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggleStar(m.id, e)
                    }
                  }}
                >
                  <Star className={cn('size-3.5', m.starred ? 'fill-warning text-warning' : '')} />
                </span>
              </div>
            </button>
          ))}

          {visibleMails.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="bg-muted mb-3 rounded-full p-3">
                <InboxIcon className="text-muted-foreground size-5" />
              </div>
              <p className="text-sm font-medium">Nothing here</p>
              <p className="text-muted-foreground mt-0.5 text-xs">No messages match the current filter.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-background flex min-w-0 flex-col">
        {activeMail ? (
          <>
            <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" aria-label="Back">
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Archive"
                  onClick={() => archive(activeMail.id)}
                >
                  <Archive className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Delete">
                  <Trash2 className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Save">
                  <Bookmark className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-8" aria-label="Reply">
                  <Reply className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Reply all">
                  <ReplyAll className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Forward">
                  <Forward className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" aria-label="More options">
                  <MoreVertical className="size-4" />
                </Button>
              </div>
            </div>

            <div className="reader-scroll flex-1 overflow-y-auto">
              <div className="px-6 pt-5 pb-3">
                <h1 className="text-foreground text-xl leading-tight font-semibold tracking-tight">
                  {activeMail.subject}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {activeMail.labels.map((lid) => (
                    <span
                      key={lid}
                      className="text-foreground/70 bg-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
                    >
                      <span className={cn('size-1.5 rounded-full', labelMeta(lid)?.color)} />
                      {labelMeta(lid)?.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 px-6 pb-4">
                <Avatar className="size-10">
                  <AvatarFallback>{activeMail.from.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="text-sm font-semibold">{activeMail.from.name}</p>
                    <p className="text-muted-foreground text-xs">&lt;{activeMail.from.email}&gt;</p>
                  </div>
                  <p className="text-muted-foreground text-xs">to {activeMail.to}</p>
                </div>
                <div className="text-muted-foreground flex shrink-0 items-center gap-2 text-xs">
                  <span>{formatFullTime(activeMail.receivedAt)}</span>
                  <button
                    className="hover:text-warning transition-colors"
                    title={activeMail.starred ? 'Unstar' : 'Star'}
                    onClick={() => toggleStar(activeMail.id)}
                  >
                    <Star className={cn('size-4', activeMail.starred ? 'fill-warning text-warning' : '')} />
                  </button>
                </div>
              </div>

              <article className="text-foreground/90 px-6 pb-6 text-sm leading-relaxed whitespace-pre-wrap">
                {activeMail.body}
              </article>

              {activeMail.hasAttachment && (
                <div className="px-6 pb-6">
                  <div className="bg-muted/40 flex items-center gap-3 rounded-lg border px-3 py-2.5">
                    <div className="bg-info/10 text-info flex size-8 items-center justify-center rounded-md">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">attachment.pdf</p>
                      <p className="text-muted-foreground text-xs">142 KB · PDF</p>
                    </div>
                    <Button aria-label="Download attachment" variant="ghost" size="sm" className="h-7 text-xs">
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-muted/20 border-t px-4 pt-3 pb-3">
              <div className="mb-2 flex items-center gap-1">
                <button
                  className={cn(
                    'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                    replyMode === 'reply'
                      ? 'bg-background text-foreground border-input/60 border shadow-sm'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                  )}
                  onClick={() => changeReplyMode('reply')}
                >
                  <Reply className="size-3.5" />
                  Reply
                </button>
                <button
                  className={cn(
                    'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                    replyMode === 'reply-all'
                      ? 'bg-background text-foreground border-input/60 border shadow-sm'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                  )}
                  onClick={() => changeReplyMode('reply-all')}
                >
                  <ReplyAll className="size-3.5" />
                  Reply all
                </button>
                <button
                  className={cn(
                    'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors',
                    replyMode === 'forward'
                      ? 'bg-background text-foreground border-input/60 border shadow-sm'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                  )}
                  onClick={() => changeReplyMode('forward')}
                >
                  <Forward className="size-3.5" />
                  Forward
                </button>
              </div>
              <div className="bg-background border-input/60 focus-within:border-primary/40 focus-within:ring-primary/10 group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-150 focus-within:shadow-md focus-within:ring-4">
                {replyRecipient && (
                  <p className="border-input/40 text-muted-foreground border-b px-4 pt-2.5 pb-2 text-xs">
                    <span className="text-foreground/70 font-medium">To:</span> {replyRecipient}
                  </p>
                )}
                <textarea
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  placeholder={replyPlaceholder}
                  rows={1}
                  className="placeholder:text-muted-foreground/70 max-h-40 min-h-[44px] resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed shadow-none outline-none focus-visible:ring-0"
                  onKeyDown={onReplyKey}
                />
                <div className="flex items-center justify-between gap-2 px-2 pb-2">
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8"
                      aria-label="Attach file"
                    >
                      <Paperclip className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8"
                      aria-label="Emoji"
                    >
                      <Smile className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground size-8"
                      aria-label="Mention"
                    >
                      <AtSign className="size-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="bg-muted text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-xs sm:inline-flex">
                      <span>⌘</span>
                      <span>↵</span>
                    </kbd>
                    <Button
                      className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                      disabled={sendDisabled}
                      aria-label="Send"
                      onClick={sendReply}
                    >
                      Send
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
              {justSent && <p className="text-success mt-2 text-center text-xs font-medium">Reply sent</p>}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="bg-muted mx-auto mb-3 size-12 rounded-full p-3">
                <InboxIcon className="text-muted-foreground size-6" />
              </div>
              <p className="text-sm font-medium">No message selected</p>
              <p className="text-muted-foreground mt-1 text-xs">Pick a message from the list to read it here.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
