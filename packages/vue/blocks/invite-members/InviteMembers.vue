<script lang="ts">
export type InviteRole = 'admin' | 'editor' | 'viewer'
export type InviteStatus = 'pending' | 'accepted' | 'expired'

export interface InviteEntry {
  id: string
  email: string
  role: InviteRole
  status: InviteStatus
  sentAt: Date
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RotateCw, Send, UserPlus, X } from 'lucide-vue-next'
import type { BadgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SectionCard } from '@/components/ui/section-card'

/**
 * Self-contained team invite surface. Stub data lives here — swap
 * `DEFAULT_INVITES` for your data source after installing.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SEATS_PILL =
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap tabular-nums'
const CHIP =
  'border-border bg-muted/40 text-foreground inline-flex max-w-full items-center gap-1 rounded-full border py-0.5 pr-1 pl-2.5 ' +
  'text-xs font-medium'
const CHIP_REMOVE =
  'hover:bg-background inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full ' +
  'transition-colors'
const SEATS_PILL_WARN = 'border-warning/30 bg-warning/10 text-warning'
const SEATS_PILL_OK = 'border-border bg-muted/40 text-muted-foreground'

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

const props = defineProps<{
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
  class?: string
}>()

const invites = ref<InviteEntry[]>((props.initialInvites ?? DEFAULT_INVITES).map((invite) => ({ ...invite })))
const draft = ref(props.initialDraft ?? '')
const queue = ref<string[]>([...(props.initialQueue ?? [])])
const role = ref<InviteRole>('editor')
const error = ref<string | null>(
  props.initialDraft && !EMAIL_RE.test(props.initialDraft.trim())
    ? `“${props.initialDraft.trim()}” is not a valid email address.`
    : null,
)
const confirmId = ref<string | null>(null)
let confirmTimer: number | undefined

const seatLimit = computed(() => props.seatLimit ?? 20)
const seatsUsed = computed(
  () => (props.memberSeats ?? 16) + invites.value.filter((invite) => invite.status === 'pending').length,
)
const nearLimit = computed(() => seatsUsed.value / seatLimit.value >= 0.9)
const seatsPillClass = computed(() => cn(SEATS_PILL, nearLimit.value ? SEATS_PILL_WARN : SEATS_PILL_OK))
const canSend = computed(() => draft.value.trim().length > 0 || queue.value.length > 0)

function tokenize(text: string): string[] {
  return text
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter(Boolean)
}

function enqueue(emails: string[]) {
  for (const email of emails) {
    if (!queue.value.some((queued) => queued.toLowerCase() === email.toLowerCase())) queue.value.push(email)
  }
}

function invalidMessage(invalid: string[]): string {
  return invalid.length === 1
    ? `“${invalid[0]}” is not a valid email address.`
    : `${invalid.length} entries are not valid email addresses: ${invalid.join(', ')}`
}

/** Enter / Send invite: a lone address sends straight away, several queue as chips. */
function submit() {
  const tokens = tokenize(draft.value)
  const valid = tokens.filter((token) => EMAIL_RE.test(token))
  const invalid = tokens.filter((token) => !EMAIL_RE.test(token))

  if (tokens.length === 1 && valid.length === 1) {
    addInvites(valid)
    draft.value = ''
    error.value = null
    return
  }

  enqueue(valid)
  if (invalid.length) {
    error.value = invalidMessage(invalid)
    draft.value = invalid.join(', ')
  } else {
    error.value = null
    draft.value = ''
    sendQueued()
  }
}

/** A paste containing separators queues every valid address as a chip. */
function onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text') ?? ''
  if (!text || !/[\s,;]/.test(text.trim())) return
  event.preventDefault()
  const tokens = tokenize(text)
  enqueue(tokens.filter((token) => EMAIL_RE.test(token)))
  const invalid = tokens.filter((token) => !EMAIL_RE.test(token))
  error.value = invalid.length ? invalidMessage(invalid) : null
}

function sendQueued() {
  if (!queue.value.length) return
  addInvites(queue.value)
  queue.value = []
}

function addInvites(emails: string[]) {
  const stamp = Date.now()
  const next: InviteEntry[] = emails.map((email, i) => ({
    id: `inv-${stamp}-${i}`,
    email,
    role: role.value,
    status: 'pending',
    sentAt: new Date(),
  }))
  invites.value = [...next, ...invites.value]
}

function removeQueued(email: string) {
  queue.value = queue.value.filter((queued) => queued !== email)
}

function resend(invite: InviteEntry) {
  invite.sentAt = new Date()
  invite.status = 'pending'
  cancelConfirm()
}

function askRevoke(id: string) {
  confirmId.value = id
  window.clearTimeout(confirmTimer)
  confirmTimer = window.setTimeout(() => (confirmId.value = null), 4000)
}

function revoke(invite: InviteEntry) {
  invites.value = invites.value.filter((candidate) => candidate.id !== invite.id)
  cancelConfirm()
}

function cancelConfirm() {
  window.clearTimeout(confirmTimer)
  confirmId.value = null
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
</script>

<template>
  <SectionCard
    :title="title ?? 'Invite members'"
    :description="description ?? 'Bring teammates into your workspace. Invites expire after 14 days.'"
    :class="$props.class"
  >
    <template #header-action>
      <span data-slot="invite-members-seats" :class="seatsPillClass">
        {{ seatsUsed }} of {{ seatLimit }} seats used
      </span>
    </template>

    <div data-slot="invite-members-compose" class="space-y-2">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div class="min-w-0 flex-1 space-y-1.5">
          <Input
            v-model="draft"
            type="text"
            placeholder="name@company.com — paste a list to queue several at once"
            :status="error ? 'error' : undefined"
            :aria-describedby="error ? 'invite-members-email-error' : undefined"
            aria-label="Email addresses to invite"
            @keydown.enter.prevent="submit"
            @paste="onPaste"
          />
          <p v-if="error" id="invite-members-email-error" class="text-destructive text-xs font-medium">{{ error }}</p>
        </div>
        <Select v-model="role">
          <SelectTrigger class="w-full sm:w-32" aria-label="Invite as">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Button class="shrink-0" :disabled="!canSend" @click="submit">
          <Send />
          Send invite
        </Button>
      </div>

      <div v-if="queue.length" class="flex flex-wrap items-center gap-1.5">
        <span v-for="email in queue" :key="email" :class="CHIP">
          <span class="truncate">{{ email }}</span>
          <button
            type="button"
            :class="CHIP_REMOVE"
            :aria-label="`Remove ${email} from queue`"
            @click="removeQueued(email)"
          >
            <X class="size-3" />
          </button>
        </span>
        <span class="text-muted-foreground text-xs">{{ queue.length }} queued — pick a role and send</span>
      </div>
    </div>

    <div data-slot="invite-members-list" class="mt-5">
      <div class="mb-1 flex items-center justify-between">
        <h3 class="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Invites</h3>
        <span class="text-muted-foreground text-xs tabular-nums">{{ invites.length }} total</span>
      </div>

      <ul v-if="invites.length" class="divide-y">
        <li
          v-for="invite in invites"
          :key="invite.id"
          data-slot="invite-members-row"
          class="flex flex-wrap items-center gap-3 py-3"
        >
          <Avatar class="size-8 shrink-0">
            <AvatarFallback class="text-xs">{{ initialsFor(invite.email) }}</AvatarFallback>
          </Avatar>
          <div class="min-w-[10rem] flex-1">
            <p class="truncate text-sm font-medium">{{ invite.email }}</p>
            <p class="text-muted-foreground text-xs">Sent {{ sentAgo(invite.sentAt) }}</p>
          </div>
          <Badge :variant="ROLE_VARIANT[invite.role]" class="shrink-0">{{ ROLE_LABEL[invite.role] }}</Badge>
          <Badge :variant="STATUS_VARIANT[invite.status]" class="shrink-0">{{ STATUS_LABEL[invite.status] }}</Badge>
          <div class="flex shrink-0 items-center gap-0.5">
            <Button
              v-if="invite.status !== 'accepted'"
              variant="ghost"
              size="icon-sm"
              title="Resend"
              :aria-label="`Resend invite to ${invite.email}`"
              @click="resend(invite)"
            >
              <RotateCw />
            </Button>
            <Button
              v-if="confirmId !== invite.id"
              variant="ghost"
              size="icon-sm"
              title="Revoke"
              :aria-label="`Revoke invite for ${invite.email}`"
              @click="askRevoke(invite.id)"
            >
              <X />
            </Button>
            <Button v-else variant="destructive" size="xs" @click="revoke(invite)" @keydown.escape="cancelConfirm">
              Confirm?
            </Button>
          </div>
        </li>
      </ul>

      <div v-else class="flex flex-col items-center rounded-lg border border-dashed px-6 py-10 text-center">
        <div class="bg-muted mb-3 rounded-full p-3">
          <UserPlus class="text-muted-foreground size-5" />
        </div>
        <p class="text-sm font-medium">No invites yet</p>
        <p class="text-muted-foreground mt-0.5 text-xs">Send an invite above and it will show up here.</p>
      </div>
    </div>
  </SectionCard>
</template>
