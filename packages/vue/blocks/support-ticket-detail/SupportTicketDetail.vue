<script setup lang="ts">
import { ref } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bold,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Download,
  Eye,
  FileCode2,
  Globe,
  ImageIcon,
  Italic,
  Link2,
  Lock,
  MessageSquare,
  Paperclip,
  Send,
  ShieldAlert,
  Tag,
  X,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface ThreadMessage {
  id: string
  authorName: string
  authorRole: string
  authorEmail?: string
  avatarText: string
  badgeText: string
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'
  timestamp: string
  isInternal: boolean
  content: string
}

const ticketStatus = ref('in_progress')
const ticketPriority = ref('high')
const assignedAgent = ref('elena_martinez')
const department = ref('platform')
const composerTab = ref<'public' | 'internal'>('public')
const replyDraft = ref('')
const selectedMacro = ref('')
const copiedLog = ref(false)
const tags = ref(['ssl-certificate', 'custom-domain', 'acme-challenge', 'enterprise-tier'])
const newTagInput = ref('')
const isAddingTag = ref(false)

const cannedMacros = [
  {
    id: 'ssl-guide',
    name: 'SSL Guide',
    text: `Hi Sarah,\n\nTo resolve the ACME challenge issue, please ensure your DNS provider includes the following CAA record:\n\n0 issue "letsencrypt.org"\n\nOnce added, DNS propagation typically takes 2-5 minutes, after which you can re-run verification in your domain dashboard.`,
  },
  {
    id: 'request-logs',
    name: 'Request logs',
    text: `Hi Sarah,\n\nCould you please provide the full HAR export and debug network logs from your browser console during the SSL verification attempt? This will help us trace the challenge request.`,
  },
  {
    id: 'refund-confirmation',
    name: 'Refund confirmation',
    text: `Hi Sarah,\n\nWe have processed the billing adjustment for your dedicated SSL add-on. You will see the credit reflected on your next statement.`,
  },
]

const dynamicMessages = ref<ThreadMessage[]>([])

function handleEscalate() {
  ticketStatus.value = 'escalated'
}

function handleResolve() {
  ticketStatus.value = 'resolved'
}

function selectMacro(val: any) {
  if (!val) return
  const macro = cannedMacros.find((m) => m.id === val)
  if (macro) {
    replyDraft.value = macro.text
  }
}

function applyFormat(type: 'bold' | 'code' | 'link') {
  if (type === 'bold') {
    replyDraft.value = replyDraft.value ? `${replyDraft.value} **bold text**` : '**bold text**'
  } else if (type === 'code') {
    replyDraft.value = replyDraft.value ? `${replyDraft.value}\n\`\`\`\ncode snippet\n\`\`\`` : '```\ncode snippet\n```'
  } else if (type === 'link') {
    replyDraft.value = replyDraft.value
      ? `${replyDraft.value} [link title](https://example.com)`
      : '[link title](https://example.com)'
  }
}

function copyErrorLog() {
  copiedLog.value = true
  setTimeout(() => {
    copiedLog.value = false
  }, 2000)
}

function sendReply() {
  const body = replyDraft.value.trim()
  if (!body) return
  const isInternal = composerTab.value === 'internal'
  dynamicMessages.value.push({
    id: `msg-${Date.now()}`,
    authorName: isInternal ? 'Alex Kim' : 'Elena Martinez',
    authorRole: isInternal ? 'Senior DevOps' : 'Lead Support Engineer',
    avatarText: isInternal ? 'AK' : 'EM',
    badgeText: isInternal ? 'Internal Note - Only visible to team' : 'Support Engineer',
    badgeVariant: isInternal ? 'warning' : 'default',
    timestamp: 'Just now',
    isInternal,
    content: body,
  })
  replyDraft.value = ''
  selectedMacro.value = ''
}

function sendAndSolve() {
  sendReply()
  ticketStatus.value = 'resolved'
}

function addTag() {
  const t = newTagInput.value.trim().toLowerCase()
  if (t && !tags.value.includes(t)) {
    tags.value.push(t)
  }
  newTagInput.value = ''
  isAddingTag.value = false
}

function removeTag(tagToRemove: string) {
  tags.value = tags.value.filter((t) => t !== tagToRemove)
}
</script>

<template>
  <div data-slot="support-ticket-detail" class="bg-background text-foreground w-full space-y-6">
    <!-- Ticket Header -->
    <header class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4">
        <!-- Top Breadcrumb & Actions Row -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span>Support</span>
            <ChevronRight class="size-3.5" />
            <span>Tickets</span>
            <ChevronRight class="size-3.5" />
            <span class="text-foreground font-mono font-medium">#TICK-8492</span>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="handleEscalate">
              <AlertTriangle class="size-3.5 text-amber-500" />
              Escalate
            </Button>
            <Button size="sm" class="gap-1.5 text-xs font-medium" @click="handleResolve">
              <CheckCircle2 class="size-3.5" />
              Resolve Ticket
            </Button>
          </div>
        </div>

        <!-- Ticket Title & Metadata -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-muted-foreground font-mono text-xs font-bold tracking-tight">#TICK-8492</span>
            <h1 class="text-foreground text-lg font-bold tracking-tight sm:text-xl">
              Cannot configure custom domain SSL certificate
            </h1>
          </div>
          <p class="text-muted-foreground text-xs">
            Opened 2 hours ago by <span class="text-foreground font-medium">Sarah Davis</span> (Acme Corp) via Web
            Portal
          </p>
        </div>

        <Separator />

        <!-- Status Badges & SLA Strip -->
        <div class="flex flex-wrap items-center gap-3">
          <Badge variant="destructive" class="gap-1 font-medium">
            <AlertCircle class="size-3" />
            High Priority
          </Badge>

          <div class="w-44">
            <Select v-model="ticketStatus">
              <SelectTrigger size="sm" class="h-7 text-xs font-medium">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">
                  <span class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-amber-500" />
                    In Progress
                  </span>
                </SelectItem>
                <SelectItem value="waiting_on_customer">
                  <span class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-blue-500" />
                    Waiting on Customer
                  </span>
                </SelectItem>
                <SelectItem value="escalated">
                  <span class="flex items-center gap-1.5">
                    <span class="bg-destructive size-2 rounded-full" />
                    Escalated
                  </span>
                </SelectItem>
                <SelectItem value="resolved">
                  <span class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-emerald-500" />
                    Resolved
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
          >
            <Clock class="size-3.5" />
            <span>SLA: 42m remaining</span>
          </div>

          <Badge variant="outline" class="text-muted-foreground text-xs"> SSL & Custom Domains </Badge>
        </div>
      </div>
    </header>

    <!-- 2-Column Workspace -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Conversation Thread & Composer (2/3) -->
      <main class="space-y-6 lg:col-span-8">
        <!-- Message 1: Customer Initial Request -->
        <article class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <Avatar class="size-10">
                <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">SD</AvatarFallback>
              </Avatar>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Sarah Davis</span>
                  <Badge variant="secondary" class="text-xs font-normal">Customer</Badge>
                </div>
                <p class="text-muted-foreground text-xs">VP of Engineering · Acme Corp (sarah@acme-corp.io)</p>
              </div>
            </div>
            <time class="text-muted-foreground text-xs whitespace-nowrap">Today, 09:14 AM (2h ago)</time>
          </div>

          <div class="text-foreground/90 mt-4 space-y-3.5 text-sm leading-relaxed">
            <p>
              We are attempting to configure our custom apex domain
              <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">api.acme-corp.io</code> on
              our production cluster, but automated SSL certificate provisioning fails repeatedly during the ACME DNS-01
              verification challenge.
            </p>
            <p>
              We verified that the CNAME and DNS TXT records exist in our Cloudflare dashboard, but the challenge
              validation daemon continues to time out after 10 minutes with the stderr log below:
            </p>

            <!-- Error Code Block Placeholder -->
            <div class="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
              <div
                class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400"
              >
                <div class="flex items-center gap-2">
                  <FileCode2 class="size-3.5 text-red-400" />
                  <span class="font-mono text-xs">acme-provisioner-stderr.log</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                  @click="copyErrorLog"
                >
                  <Copy class="size-3" />
                  {{ copiedLog ? 'Copied' : 'Copy log' }}
                </Button>
              </div>
              <pre
                class="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-zinc-300"
              ><code>[2026-10-24T09:12:44Z] [SSL: CERTIFICATE_VERIFY_FAILED] ACME challenge failed for _acme-challenge.api.acme-corp.io
[2026-10-24T09:13:58Z] DNS TXT record validation timed out after 600s. Response status: 400 Bad Request
[2026-10-24T09:14:02Z] Detail: CAA record restriction on 'acme-corp.io' prevented Let's Encrypt issuance.</code></pre>
            </div>

            <!-- Screenshot / Attachment Placeholder -->
            <div class="bg-muted/40 rounded-lg border p-3">
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-2.5">
                  <div class="bg-background flex size-9 shrink-0 items-center justify-center rounded-md border">
                    <ImageIcon class="text-muted-foreground size-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-foreground truncate text-xs font-medium">cloudflare-dns-settings.png</p>
                    <p class="text-muted-foreground text-xs">1.4 MB · PNG Image Screenshot</p>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <Button variant="ghost" size="sm" class="h-7 text-xs">
                    <Eye class="size-3.5" />
                    Preview
                  </Button>
                  <Button aria-label="Download attachment" variant="ghost" size="sm" class="h-7 text-xs">
                    <Download class="size-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Message 2: Internal Staff Note (distinct yellow/amber tint background) -->
        <article
          class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-xs sm:p-6 dark:bg-amber-950/20"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <Avatar class="size-10">
                <AvatarFallback class="bg-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300"
                  >AK</AvatarFallback
                >
              </Avatar>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Alex Kim</span>
                  <Badge
                    variant="outline"
                    class="gap-1 border-amber-500/40 bg-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300"
                  >
                    <Lock class="size-3" />
                    Internal Note - Only visible to team
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs">Senior DevOps Engineer · Tier 2 Infrastructure</p>
              </div>
            </div>
            <time class="text-muted-foreground text-xs whitespace-nowrap">Today, 09:35 AM (1h ago)</time>
          </div>

          <div class="text-foreground/90 mt-4 space-y-2 text-sm leading-relaxed">
            <p>
              Checked Cloudflare DNS propagation on their nameservers via
              <code class="text-foreground rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs"
                >dig CAA acme-corp.io</code
              >. Looks like their root zone has a CAA record restricting certificate issuance strictly to DigiCert
              (<code class="text-foreground rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs"
                >0 issue "digicert.com"</code
              >), while our automated ACME pipeline requests Let's Encrypt certificates.
            </p>
            <p>
              If they add
              <code class="text-foreground rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs"
                >0 issue "letsencrypt.org"</code
              >
              to their DNS CAA records, the validation handshake will complete within 2 minutes.
            </p>
          </div>
        </article>

        <!-- Message 3: Agent response -->
        <article class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <Avatar class="size-10">
                <AvatarFallback class="bg-primary text-primary-foreground text-xs font-semibold">EM</AvatarFallback>
              </Avatar>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Elena Martinez</span>
                  <Badge class="text-xs font-normal">Support Engineer</Badge>
                </div>
                <p class="text-muted-foreground text-xs">Lead Support Engineer · UIPKGE Staff</p>
              </div>
            </div>
            <time class="text-muted-foreground text-xs whitespace-nowrap">Today, 09:48 AM (45m ago)</time>
          </div>

          <div class="text-foreground/90 mt-4 space-y-3 text-sm leading-relaxed">
            <p>
              Hi Sarah, thank you for providing the detailed error log! We analyzed the ACME challenge failure and
              identified that your apex domain's DNS CAA records currently block Let's Encrypt certificate issuance.
            </p>
            <p>Please follow these step-by-step instructions to enable Let's Encrypt validation:</p>
            <ol class="text-foreground/90 list-inside list-decimal space-y-1.5 pl-1 text-xs sm:text-sm">
              <li>
                Log in to your Cloudflare DNS dashboard for
                <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">acme-corp.io</code>.
              </li>
              <li>Navigate to <strong>DNS Settings</strong> &rarr; <strong>Add Record</strong>.</li>
              <li>
                Select <strong>CAA</strong>, set Flag to
                <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">0</code>, Tag to
                <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">issue</code>, and Value to
                <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">"letsencrypt.org"</code>.
              </li>
              <li>Allow up to 2 minutes for DNS TTL cache propagation across edge resolvers.</li>
              <li>Return to your cluster settings dashboard and click <strong>Retry Verification</strong>.</li>
            </ol>
            <p>
              Feel free to reply directly once you've saved the record, and we'll monitor the validation handshake from
              our side!
            </p>
          </div>
        </article>

        <!-- Dynamic User Messages -->
        <article
          v-for="msg in dynamicMessages"
          :key="msg.id"
          :class="[
            'rounded-xl border p-5 shadow-xs sm:p-6',
            msg.isInternal ? 'border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20' : 'bg-card',
          ]"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <Avatar class="size-10">
                <AvatarFallback
                  :class="[
                    'text-xs font-semibold',
                    msg.isInternal
                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                      : 'bg-primary text-primary-foreground',
                  ]"
                >
                  {{ msg.avatarText }}
                </AvatarFallback>
              </Avatar>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">{{ msg.authorName }}</span>
                  <Badge
                    :variant="msg.isInternal ? 'outline' : 'default'"
                    :class="
                      msg.isInternal
                        ? 'gap-1 border-amber-500/40 bg-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300'
                        : 'text-xs font-normal'
                    "
                  >
                    <Lock v-if="msg.isInternal" class="size-3" />
                    {{ msg.badgeText }}
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs">{{ msg.authorRole }}</p>
              </div>
            </div>
            <time class="text-muted-foreground text-xs whitespace-nowrap">{{ msg.timestamp }}</time>
          </div>
          <div class="text-foreground/90 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {{ msg.content }}
          </div>
        </article>

        <!-- Reply Box Composer -->
        <section class="bg-card overflow-hidden rounded-xl border shadow-xs">
          <Tabs v-model="composerTab" default-value="public">
            <!-- Composer Header with Tabs & Macro Dropdown -->
            <div class="bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
              <TabsList class="h-8">
                <TabsTrigger value="public" class="gap-1.5 text-xs">
                  <MessageSquare class="size-3.5" />
                  Public Reply
                </TabsTrigger>
                <TabsTrigger value="internal" class="gap-1.5 text-xs">
                  <Lock class="size-3.5" />
                  Internal Note
                </TabsTrigger>
              </TabsList>

              <!-- Canned Responses / Macros Dropdown -->
              <div class="w-48">
                <Select v-model="selectedMacro" @update:model-value="selectMacro">
                  <SelectTrigger size="sm" class="h-8 text-xs">
                    <SelectValue placeholder="Canned macro..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="macro in cannedMacros" :key="macro.id" :value="macro.id">
                      {{ macro.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-3 p-4">
              <!-- Rich Formatting Toolbar -->
              <div class="text-muted-foreground flex items-center gap-1 border-b pb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7"
                  aria-label="Format bold"
                  @click="applyFormat('bold')"
                >
                  <Bold class="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7"
                  aria-label="Format italic"
                  @click="applyFormat('bold')"
                >
                  <Italic class="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7"
                  aria-label="Format code"
                  @click="applyFormat('code')"
                >
                  <Code class="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-7"
                  aria-label="Insert link"
                  @click="applyFormat('link')"
                >
                  <Link2 class="size-3.5" />
                </Button>
                <Separator orientation="vertical" class="mx-1 h-4" />
                <Button variant="ghost" size="icon" class="size-7" aria-label="Attach file">
                  <Paperclip class="size-3.5" />
                </Button>
                <span class="text-muted-foreground ml-auto text-xs">Markdown supported</span>
              </div>

              <!-- Textarea with dynamic background if internal note -->
              <Textarea
                v-model="replyDraft"
                :placeholder="
                  composerTab === 'public'
                    ? 'Write a public reply to Sarah Davis...'
                    : 'Add an internal note only visible to team members...'
                "
                rows="4"
                :class="[
                  'resize-y text-sm',
                  composerTab === 'internal'
                    ? 'border-amber-500/30 bg-amber-500/5 focus-visible:ring-amber-500/20'
                    : '',
                ]"
              />

              <!-- Composer Actions -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div class="text-muted-foreground flex items-center gap-2 text-xs">
                  <Paperclip class="size-3.5" />
                  <span>Attachments up to 25MB</span>
                </div>

                <div class="flex items-center gap-2">
                  <Button
                    v-if="composerTab === 'public'"
                    variant="outline"
                    size="sm"
                    class="gap-1.5 text-xs"
                    :disabled="!replyDraft.trim()"
                    @click="sendAndSolve"
                  >
                    <CheckCheck class="size-3.5" />
                    Send & Mark Solved
                  </Button>
                  <Button size="sm" class="gap-1.5 text-xs" :disabled="!replyDraft.trim()" @click="sendReply">
                    <Send class="size-3.5" />
                    {{ composerTab === 'public' ? 'Send Reply' : 'Add Internal Note' }}
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </section>
      </main>

      <!-- Right Column: Customer & Ticket Metadata Sidebar (1/3) -->
      <aside class="space-y-6 lg:col-span-4">
        <!-- Customer Info Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <Avatar class="size-11">
                  <AvatarFallback class="bg-primary/10 text-primary text-sm font-semibold">SD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle class="text-sm font-semibold">Sarah Davis</CardTitle>
                  <CardDescription class="text-xs">VP of Engineering</CardDescription>
                </div>
              </div>
              <Badge variant="default" class="text-xs font-medium">Enterprise</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 pt-0">
            <Separator />
            <dl class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Company</dt>
                <dd class="text-foreground font-medium">Acme Corp</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Email</dt>
                <dd class="text-foreground max-w-[180px] truncate font-medium">sarah@acme-corp.io</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Total Tickets</dt>
                <dd class="text-foreground font-medium tabular-nums">12 (10 resolved)</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Customer Since</dt>
                <dd class="text-foreground font-medium">Jan 2024</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">SLA Plan</dt>
                <dd class="text-foreground font-medium">1h Critical Response</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Timezone</dt>
                <dd class="text-foreground font-medium">America/Los_Angeles (UTC-7)</dd>
              </div>
            </dl>
            <Separator />
            <Button variant="outline" size="sm" class="w-full justify-center gap-1.5 text-xs">
              View Customer in CRM
              <ArrowUpRight class="size-3.5" />
            </Button>
          </CardContent>
        </Card>

        <!-- Ticket Attributes Card -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-semibold">Ticket Attributes</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 pt-0">
            <!-- Assigned Agent -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground text-xs font-medium">Assigned Agent</label>
              <Select v-model="assignedAgent">
                <SelectTrigger size="sm" class="w-full text-xs">
                  <SelectValue placeholder="Select Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elena_martinez">Elena Martinez (DevOps)</SelectItem>
                  <SelectItem value="alex_kim">Alex Kim (Tier 2)</SelectItem>
                  <SelectItem value="marcus_vance">Marcus Vance (Platform)</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Department -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground text-xs font-medium">Department</label>
              <Select v-model="department">
                <SelectTrigger size="sm" class="w-full text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Platform Infrastructure</SelectItem>
                  <SelectItem value="billing">Billing & Subscriptions</SelectItem>
                  <SelectItem value="core_api">Core API Support</SelectItem>
                  <SelectItem value="security">Security & Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Priority -->
            <div class="space-y-1.5">
              <label class="text-muted-foreground text-xs font-medium">Priority</label>
              <Select v-model="ticketPriority">
                <SelectTrigger size="sm" class="w-full text-xs">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (P0)</SelectItem>
                  <SelectItem value="high">High (P1)</SelectItem>
                  <SelectItem value="medium">Medium (P2)</SelectItem>
                  <SelectItem value="low">Low (P3)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <!-- Tags Section -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-xs font-medium">Tags</span>
                <button
                  v-if="!isAddingTag"
                  class="text-primary min-h-6 text-xs font-medium hover:underline"
                  @click="isAddingTag = true"
                >
                  + Add Tag
                </button>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="bg-muted text-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                >
                  <Tag class="text-muted-foreground size-3" />
                  {{ tag }}
                  <button
                    class="text-muted-foreground hover:text-foreground ml-0.5"
                    aria-label="Remove tag"
                    @click="removeTag(tag)"
                  >
                    <X class="size-3" />
                  </button>
                </span>
              </div>

              <div v-if="isAddingTag" class="flex items-center gap-1.5 pt-1">
                <Input
                  v-model="newTagInput"
                  placeholder="New tag..."
                  class="h-7 text-xs"
                  @keydown.enter.prevent="addTag"
                />
                <Button size="sm" class="h-7 px-2 text-xs" @click="addTag">Add</Button>
                <Button variant="ghost" size="sm" class="h-7 px-2 text-xs" @click="isAddingTag = false">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- SLA & Metrics Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-semibold">SLA & Metrics</CardTitle>
              <Badge variant="outline" class="text-xs font-medium">Active SLA</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 pt-0">
            <dl class="space-y-3 text-xs">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <dt class="text-foreground font-medium">First Response Time</dt>
                  <dd class="text-muted-foreground text-xs">Target: &lt; 15m</dd>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">8m</span>
                  <span class="text-muted-foreground block text-xs">7m ahead</span>
                </div>
              </div>

              <Separator />

              <div class="flex items-center justify-between gap-2">
                <div>
                  <dt class="text-foreground font-medium">Target Resolution</dt>
                  <dd class="text-muted-foreground text-xs">Target: 4h (Elapsed: 3h 18m)</dd>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-amber-600 dark:text-amber-400">42m</span>
                  <span class="text-muted-foreground block text-xs">remaining</span>
                </div>
              </div>

              <Separator />

              <div class="flex items-center justify-between gap-2">
                <div>
                  <dt class="text-foreground font-medium">CSAT Prediction</dt>
                  <dd class="text-muted-foreground text-xs">Based on sentiment analysis</dd>
                </div>
                <Badge variant="secondary" class="font-medium">98% High</Badge>
              </div>

              <Separator />

              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground flex items-center gap-1.5">
                  <Globe class="size-3.5" />
                  Source Channel
                </dt>
                <dd class="text-foreground font-medium">Web Portal</dd>
              </div>

              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground flex items-center gap-1.5">
                  <ShieldAlert class="size-3.5" />
                  Escalation Tier
                </dt>
                <dd class="text-foreground font-medium">Tier 2 Support</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </aside>
    </div>
  </div>
</template>
