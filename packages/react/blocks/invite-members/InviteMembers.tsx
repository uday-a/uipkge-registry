'use client'

import * as React from 'react'
import { RotateCw, Send, UserPlus, X } from 'lucide-react'
import type { BadgeVariants } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SectionCard } from '@/components/ui/section-card'

export type InviteRole = 'admin' | 'editor' | 'viewer'
export type InviteStatus = 'pending' | 'accepted' | 'expired'

export interface InviteEntry {
  id: string
  email: string
  role: InviteRole
  status: InviteStatus
  sentAt: Date
}

export interface InviteMembersProps {
  title?: string
  description?: string
  seatLimit?: number
  /** Seats taken by existing members (incl. already-accepted invites). */
  memberSeats?: number
  initialInvites?: InviteEntry[]
  /** Pre-fills the compose input; an invalid value surfaces the validation error state. */
  initialDraft?: string
  /** Emails staged as queued chips before sending (as after a multi-address paste). */
  initialQueue?: string[]
  className?: string
}

/**
 * Self-contained team invite surface. Stub data lives here — swap
 * `DEFAULT_INVITES` for your data source after installing.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SEATS_PILL =
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap tabular-nums'
const SEATS_PILL_WARN = 'border-warning/30 bg-warning/10 text-warning'
const SEATS_PILL_OK = 'border-border bg-muted/40 text-muted-foreground'
const CHIP =
  'border-border bg-muted/40 text-foreground inline-flex max-w-full items-center gap-1 rounded-full border py-0.5 pr-1 pl-2.5 ' +
  'text-xs font-medium'
const CHIP_REMOVE =
  'hover:bg-background inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full ' +
  'transition-colors'

const ROLE_LABEL: Record<InviteRole, string> = { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' }
const ROLE_VARIANT: Record<InviteRole, BadgeVariants['variant']> = {
  admin: 'default',
  editor: 'info',
  viewer: 'outline',
}
const STATUS_LABEL: Record<InviteStatus, string> = { pending: 'Pending', accepted: 'Accepted', expired: 'Expired' }
const STATUS_VARIANT: Record<InviteStatus, BadgeVariants['variant']> = {
  pending: 'warning',
  accepted: 'success',
  expired: 'secondary',
}

const now = Date.now()
const minutesAgo = (m: number) => new Date(now - m * 60_000)

const DEFAULT_INVITES: InviteEntry[] = [
  { id: 'inv-1', email: 'priya@acme.com', role: 'admin', status: 'pending', sentAt: minutesAgo(120) },
  { id: 'inv-2', email: 'marcus@acme.com', role: 'editor', status: 'accepted', sentAt: minutesAgo(60 * 24 * 3) },
  { id: 'inv-3', email: 'devon@acme.com', role: 'viewer', status: 'pending', sentAt: minutesAgo(60 * 26) },
  { id: 'inv-4', email: 'sarah@acme.com', role: 'editor', status: 'expired', sentAt: minutesAgo(60 * 24 * 12) },
  { id: 'inv-5', email: 'lena@acme.com', role: 'admin', status: 'accepted', sentAt: minutesAgo(60 * 24 * 7) },
]

function tokenize(text: string): string[] {
  return text
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function mergeQueue(prev: string[], emails: string[]): string[] {
  const next = [...prev]
  for (const email of emails) {
    if (!next.some((queued) => queued.toLowerCase() === email.toLowerCase())) next.push(email)
  }
  return next
}

function invalidMessage(invalid: string[]): string {
  return invalid.length === 1
    ? `“${invalid[0]}” is not a valid email address.`
    : `${invalid.length} entries are not valid email addresses: ${invalid.join(', ')}`
}

export function InviteMembers({
  title,
  description,
  seatLimit = 20,
  memberSeats = 16,
  initialInvites,
  initialDraft,
  initialQueue,
  className,
}: InviteMembersProps) {
  const [invites, setInvites] = React.useState<InviteEntry[]>(() =>
    (initialInvites ?? DEFAULT_INVITES).map((invite) => ({ ...invite })),
  )
  const [draft, setDraft] = React.useState(initialDraft ?? '')
  const [queue, setQueue] = React.useState<string[]>(initialQueue ?? [])
  const [role, setRole] = React.useState<InviteRole>('editor')
  const [error, setError] = React.useState<string | null>(
    initialDraft && !EMAIL_RE.test(initialDraft.trim())
      ? `“${initialDraft.trim()}” is not a valid email address.`
      : null,
  )
  const [confirmId, setConfirmId] = React.useState<string | null>(null)
  const confirmTimer = React.useRef<number | undefined>(undefined)

  React.useEffect(() => () => window.clearTimeout(confirmTimer.current), [])

  const seatsUsed = memberSeats + invites.filter((invite) => invite.status === 'pending').length
  const nearLimit = seatsUsed / seatLimit >= 0.9
  const canSend = draft.trim().length > 0 || queue.length > 0

  function addInvites(emails: string[]) {
    const stamp = Date.now()
    const next: InviteEntry[] = emails.map((email, i) => ({
      id: `inv-${stamp}-${i}`,
      email,
      role,
      status: 'pending',
      sentAt: new Date(),
    }))
    setInvites((prev) => [...next, ...prev])
  }

  /** Enter / Send invite: a lone address sends straight away, several queue as chips. */
  function submit() {
    const tokens = tokenize(draft)
    const valid = tokens.filter((token) => EMAIL_RE.test(token))
    const invalid = tokens.filter((token) => !EMAIL_RE.test(token))

    if (tokens.length === 1 && valid.length === 1) {
      addInvites(valid)
      setDraft('')
      setError(null)
      return
    }

    if (invalid.length) {
      setError(invalidMessage(invalid))
      setDraft(invalid.join(', '))
      setQueue((prev) => mergeQueue(prev, valid))
      return
    }

    // Nothing invalid: stage everything (new addresses plus queued chips) and flush in one pass.
    const merged = mergeQueue(queue, valid)
    if (merged.length) addInvites(merged)
    setError(null)
    setDraft('')
    setQueue([])
  }

  /** A paste containing separators queues every valid address as a chip. */
  function onPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData('text')
    if (!text || !/[\s,;]/.test(text.trim())) return
    event.preventDefault()
    const tokens = tokenize(text)
    setQueue((prev) =>
      mergeQueue(
        prev,
        tokens.filter((token) => EMAIL_RE.test(token)),
      ),
    )
    const invalid = tokens.filter((token) => !EMAIL_RE.test(token))
    setError(invalid.length ? invalidMessage(invalid) : null)
  }

  function removeQueued(email: string) {
    setQueue((prev) => prev.filter((queued) => queued !== email))
  }

  function resend(invite: InviteEntry) {
    setInvites((prev) =>
      prev.map((candidate) =>
        candidate.id === invite.id ? { ...candidate, sentAt: new Date(), status: 'pending' as const } : candidate,
      ),
    )
    cancelConfirm()
  }

  function askRevoke(id: string) {
    setConfirmId(id)
    window.clearTimeout(confirmTimer.current)
    confirmTimer.current = window.setTimeout(() => setConfirmId(null), 4000)
  }

  function revoke(invite: InviteEntry) {
    setInvites((prev) => prev.filter((candidate) => candidate.id !== invite.id))
    cancelConfirm()
  }

  function cancelConfirm() {
    window.clearTimeout(confirmTimer.current)
    setConfirmId(null)
  }

  function initialsFor(email: string): string {
    const local = email.split('@')[0] ?? ''
    const parts = local.split(/[._-]+/).filter(Boolean)
    const first = parts[0] ?? ''
    const second = parts[1] ?? ''
    if (first && second) return (first.charAt(0) + second.charAt(0)).toUpperCase()
    return local.slice(0, 2).toUpperCase()
  }

  function sentAgo(date: Date): string {
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <SectionCard
      title={title ?? 'Invite members'}
      description={description ?? 'Bring teammates into your workspace. Invites expire after 14 days.'}
      className={className}
      headerAction={
        <span
          data-slot="invite-members-seats"
          className={`${SEATS_PILL} ${nearLimit ? SEATS_PILL_WARN : SEATS_PILL_OK}`}
        >
          {seatsUsed} of {seatLimit} seats used
        </span>
      }
    >
      <div data-slot="invite-members-compose" className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1 space-y-1.5">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              type="text"
              placeholder="name@company.com — paste a list to queue several at once"
              status={error ? 'error' : undefined}
              aria-describedby={error ? 'invite-members-email-error' : undefined}
              aria-label="Email addresses to invite"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  submit()
                }
              }}
              onPaste={onPaste}
            />
            {error && (
              <p id="invite-members-email-error" className="text-destructive text-xs font-medium">
                {error}
              </p>
            )}
          </div>
          <Select value={role} onValueChange={(value) => setRole(value as InviteRole)}>
            <SelectTrigger className="w-full sm:w-32" aria-label="Invite as">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button className="shrink-0" disabled={!canSend} onClick={submit}>
            <Send />
            Send invite
          </Button>
        </div>

        {queue.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {queue.map((email) => (
              <span key={email} className={CHIP}>
                <span className="truncate">{email}</span>
                <button
                  type="button"
                  className={CHIP_REMOVE}
                  aria-label={`Remove ${email} from queue`}
                  onClick={() => removeQueued(email)}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <span className="text-muted-foreground text-xs">{queue.length} queued — pick a role and send</span>
          </div>
        )}
      </div>

      <div data-slot="invite-members-list" className="mt-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Invites</h3>
          <span className="text-muted-foreground text-xs tabular-nums">{invites.length} total</span>
        </div>

        {invites.length > 0 ? (
          <ul className="divide-y">
            {invites.map((invite) => (
              <li key={invite.id} data-slot="invite-members-row" className="flex flex-wrap items-center gap-3 py-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarFallback className="text-xs">{initialsFor(invite.email)}</AvatarFallback>
                </Avatar>
                <div className="min-w-[10rem] flex-1">
                  <p className="truncate text-sm font-medium">{invite.email}</p>
                  <p className="text-muted-foreground text-xs">Sent {sentAgo(invite.sentAt)}</p>
                </div>
                <Badge variant={ROLE_VARIANT[invite.role]} className="shrink-0">
                  {ROLE_LABEL[invite.role]}
                </Badge>
                <Badge variant={STATUS_VARIANT[invite.status]} className="shrink-0">
                  {STATUS_LABEL[invite.status]}
                </Badge>
                <div className="flex shrink-0 items-center gap-0.5">
                  {invite.status !== 'accepted' && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Resend"
                      aria-label={`Resend invite to ${invite.email}`}
                      onClick={() => resend(invite)}
                    >
                      <RotateCw />
                    </Button>
                  )}
                  {confirmId !== invite.id ? (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Revoke"
                      aria-label={`Revoke invite for ${invite.email}`}
                      onClick={() => askRevoke(invite.id)}
                    >
                      <X />
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => revoke(invite)}
                      onKeyDown={(event) => event.key === 'Escape' && cancelConfirm()}
                    >
                      Confirm?
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-lg border border-dashed px-6 py-10 text-center">
            <div className="bg-muted mb-3 rounded-full p-3">
              <UserPlus className="text-muted-foreground size-5" />
            </div>
            <p className="text-sm font-medium">No invites yet</p>
            <p className="text-muted-foreground mt-0.5 text-xs">Send an invite above and it will show up here.</p>
          </div>
        )}
      </div>
    </SectionCard>
  )
}
