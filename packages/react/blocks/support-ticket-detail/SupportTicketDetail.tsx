'use client'

import * as React from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Bold,
  Check,
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
  Plus,
  Send,
  ShieldAlert,
  Tag,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  avatarText: string
  badgeText: string
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'
  timestamp: string
  isInternal: boolean
  content: string
}

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

export function SupportTicketDetail() {
  const [ticketStatus, setTicketStatus] = React.useState('in_progress')
  const [ticketPriority, setTicketPriority] = React.useState('high')
  const [assignedAgent, setAssignedAgent] = React.useState('elena_martinez')
  const [department, setDepartment] = React.useState('platform')
  const [composerTab, setComposerTab] = React.useState<'public' | 'internal'>('public')
  const [replyDraft, setReplyDraft] = React.useState('')
  const [selectedMacro, setSelectedMacro] = React.useState('')
  const [copiedLog, setCopiedLog] = React.useState(false)
  const [tags, setTags] = React.useState(['ssl-certificate', 'custom-domain', 'acme-challenge', 'enterprise-tier'])
  const [newTagInput, setNewTagInput] = React.useState('')
  const [isAddingTag, setIsAddingTag] = React.useState(false)
  const [dynamicMessages, setDynamicMessages] = React.useState<ThreadMessage[]>([])

  function handleEscalate() {
    setTicketStatus('escalated')
  }

  function handleResolve() {
    setTicketStatus('resolved')
  }

  function handleSelectMacro(val: string) {
    setSelectedMacro(val)
    const macro = cannedMacros.find((m) => m.id === val)
    if (macro) {
      setReplyDraft(macro.text)
    }
  }

  function applyFormat(type: 'bold' | 'code' | 'link') {
    if (type === 'bold') {
      setReplyDraft((prev) => (prev ? `${prev} **bold text**` : '**bold text**'))
    } else if (type === 'code') {
      setReplyDraft((prev) => (prev ? `${prev}\n\`\`\`\ncode snippet\n\`\`\`` : '```\ncode snippet\n```'))
    } else if (type === 'link') {
      setReplyDraft((prev) =>
        prev ? `${prev} [link title](https://example.com)` : '[link title](https://example.com)',
      )
    }
  }

  function copyErrorLog() {
    setCopiedLog(true)
    setTimeout(() => {
      setCopiedLog(false)
    }, 2000)
  }

  function sendReply() {
    const body = replyDraft.trim()
    if (!body) return
    const isInternal = composerTab === 'internal'
    setDynamicMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        authorName: isInternal ? 'Alex Kim' : 'Elena Martinez',
        authorRole: isInternal ? 'Senior DevOps' : 'Lead Support Engineer',
        avatarText: isInternal ? 'AK' : 'EM',
        badgeText: isInternal ? 'Internal Note - Only visible to team' : 'Support Engineer',
        badgeVariant: isInternal ? 'warning' : 'default',
        timestamp: 'Just now',
        isInternal,
        content: body,
      },
    ])
    setReplyDraft('')
    setSelectedMacro('')
  }

  function sendAndSolve() {
    sendReply()
    setTicketStatus('resolved')
  }

  function addTag() {
    const t = newTagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t])
    }
    setNewTagInput('')
    setIsAddingTag(false)
  }

  function removeTag(tagToRemove: string) {
    setTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  return (
    <div data-slot="support-ticket-detail" className="bg-background text-foreground w-full space-y-6">
      {/* Ticket Header */}
      <header className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Top Breadcrumb & Actions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span>Support</span>
              <ChevronRight className="size-3.5" />
              <span>Tickets</span>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground font-mono font-medium">#TICK-8492</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={handleEscalate}>
                <AlertTriangle className="size-3.5 text-amber-500" />
                Escalate
              </Button>
              <Button size="sm" className="gap-1.5 text-xs font-medium" onClick={handleResolve}>
                <CheckCircle2 className="size-3.5" />
                Resolve Ticket
              </Button>
            </div>
          </div>

          {/* Ticket Title & Metadata */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-mono text-xs font-bold tracking-tight">#TICK-8492</span>
              <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
                Cannot configure custom domain SSL certificate
              </h1>
            </div>
            <p className="text-muted-foreground text-xs">
              Opened 2 hours ago by <span className="text-foreground font-medium">Sarah Davis</span> (Acme Corp) via Web
              Portal
            </p>
          </div>

          <Separator />

          {/* Status Badges & SLA Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="destructive" className="gap-1 font-medium">
              <AlertCircle className="size-3" />
              High Priority
            </Badge>

            <div className="w-44">
              <Select value={ticketStatus} onValueChange={setTicketStatus}>
                <SelectTrigger size="sm" className="h-7 text-xs font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500" />
                      In Progress
                    </span>
                  </SelectItem>
                  <SelectItem value="waiting_on_customer">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-500" />
                      Waiting on Customer
                    </span>
                  </SelectItem>
                  <SelectItem value="escalated">
                    <span className="flex items-center gap-1.5">
                      <span className="bg-destructive size-2 rounded-full" />
                      Escalated
                    </span>
                  </SelectItem>
                  <SelectItem value="resolved">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      Resolved
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
              <Clock className="size-3.5" />
              <span>SLA: 42m remaining</span>
            </div>

            <Badge variant="outline" className="text-muted-foreground text-xs">
              SSL & Custom Domains
            </Badge>
          </div>
        </div>
      </header>

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Conversation Thread & Composer (2/3) */}
        <main className="space-y-6 lg:col-span-8">
          {/* Message 1: Customer Initial Request */}
          <article className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">SD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">Sarah Davis</span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      Customer
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">VP of Engineering · Acme Corp (sarah@acme-corp.io)</p>
                </div>
              </div>
              <time className="text-muted-foreground text-xs whitespace-nowrap">Today, 09:14 AM (2h ago)</time>
            </div>

            <div className="text-foreground/90 mt-4 space-y-3.5 text-sm leading-relaxed">
              <p>
                We are attempting to configure our custom apex domain{' '}
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                  api.acme-corp.io
                </code>{' '}
                on our production cluster, but automated SSL certificate provisioning fails repeatedly during the ACME
                DNS-01 verification challenge.
              </p>
              <p>
                We verified that the CNAME and DNS TXT records exist in our Cloudflare dashboard, but the challenge
                validation daemon continues to time out after 10 minutes with the stderr log below:
              </p>

              {/* Error Code Block Placeholder */}
              <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="size-3.5 text-red-400" />
                    <span className="font-mono text-xs">acme-provisioner-stderr.log</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={copyErrorLog}
                  >
                    <Copy className="size-3" />
                    {copiedLog ? 'Copied' : 'Copy log'}
                  </Button>
                </div>
                <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-zinc-300">
                  <code>{`[2026-10-24T09:12:44Z] [SSL: CERTIFICATE_VERIFY_FAILED] ACME challenge failed for _acme-challenge.api.acme-corp.io
[2026-10-24T09:13:58Z] DNS TXT record validation timed out after 600s. Response status: 400 Bad Request
[2026-10-24T09:14:02Z] Detail: CAA record restriction on 'acme-corp.io' prevented Let's Encrypt issuance.`}</code>
                </pre>
              </div>

              {/* Screenshot / Attachment Placeholder */}
              <div className="bg-muted/40 rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="bg-background flex size-9 shrink-0 items-center justify-center rounded-md border">
                      <ImageIcon className="text-muted-foreground size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-medium">cloudflare-dns-settings.png</p>
                      <p className="text-muted-foreground text-xs">1.4 MB · PNG Image Screenshot</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Eye className="size-3.5" />
                      Preview
                    </Button>
                    <Button aria-label="Download attachment" variant="ghost" size="sm" className="h-7 text-xs">
                      <Download className="size-3.5" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Message 2: Internal Staff Note (distinct yellow/amber tint background) */}
          <article className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-xs sm:p-6 dark:bg-amber-950/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-amber-500/20 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    AK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">Alex Kim</span>
                    <Badge
                      variant="outline"
                      className="gap-1 border-amber-500/40 bg-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300"
                    >
                      <Lock className="size-3" />
                      Internal Note - Only visible to team
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">Senior DevOps Engineer · Tier 2 Infrastructure</p>
                </div>
              </div>
              <time className="text-muted-foreground text-xs whitespace-nowrap">Today, 09:35 AM (1h ago)</time>
            </div>

            <div className="text-foreground/90 mt-4 space-y-2 text-sm leading-relaxed">
              <p>
                Checked Cloudflare DNS propagation on their nameservers via{' '}
                <code className="text-foreground rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs">
                  dig CAA acme-corp.io
                </code>
                . Looks like their root zone has a CAA record restricting certificate issuance strictly to DigiCert (
                <code className="text-foreground rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs">
                  0 issue &quot;digicert.com&quot;
                </code>
                ), while our automated ACME pipeline requests Let&apos;s Encrypt certificates.
              </p>
              <p>
                If they add{' '}
                <code className="text-foreground rounded bg-amber-500/20 px-1 py-0.5 font-mono text-xs">
                  0 issue &quot;letsencrypt.org&quot;
                </code>{' '}
                to their DNS CAA records, the validation handshake will complete within 2 minutes.
              </p>
            </div>
          </article>

          {/* Message 3: Agent response */}
          <article className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    EM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">Elena Martinez</span>
                    <Badge className="text-xs font-normal">Support Engineer</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">Lead Support Engineer · UIPKGE Staff</p>
                </div>
              </div>
              <time className="text-muted-foreground text-xs whitespace-nowrap">Today, 09:48 AM (45m ago)</time>
            </div>

            <div className="text-foreground/90 mt-4 space-y-3 text-sm leading-relaxed">
              <p>
                Hi Sarah, thank you for providing the detailed error log! We analyzed the ACME challenge failure and
                identified that your apex domain&apos;s DNS CAA records currently block Let&apos;s Encrypt certificate
                issuance.
              </p>
              <p>Please follow these step-by-step instructions to enable Let&apos;s Encrypt validation:</p>
              <ol className="text-foreground/90 list-inside list-decimal space-y-1.5 pl-1 text-xs sm:text-sm">
                <li>
                  Log in to your Cloudflare DNS dashboard for{' '}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">acme-corp.io</code>.
                </li>
                <li>
                  Navigate to <strong>DNS Settings</strong> &rarr; <strong>Add Record</strong>.
                </li>
                <li>
                  Select <strong>CAA</strong>, set Flag to{' '}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">0</code>, Tag to{' '}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">issue</code>, and Value to{' '}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">&quot;letsencrypt.org&quot;</code>.
                </li>
                <li>Allow up to 2 minutes for DNS TTL cache propagation across edge resolvers.</li>
                <li>
                  Return to your cluster settings dashboard and click <strong>Retry Verification</strong>.
                </li>
              </ol>
              <p>
                Feel free to reply directly once you&apos;ve saved the record, and we&apos;ll monitor the validation
                handshake from our side!
              </p>
            </div>
          </article>

          {/* Dynamic User Messages */}
          {dynamicMessages.map((msg) => (
            <article
              key={msg.id}
              className={`rounded-xl border p-5 shadow-xs sm:p-6 ${
                msg.isInternal ? 'border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20' : 'bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback
                      className={`text-xs font-semibold ${
                        msg.isInternal
                          ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {msg.avatarText}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-semibold">{msg.authorName}</span>
                      <Badge
                        variant={msg.isInternal ? 'outline' : 'default'}
                        className={
                          msg.isInternal
                            ? 'gap-1 border-amber-500/40 bg-amber-500/20 text-xs font-medium text-amber-800 dark:text-amber-300'
                            : 'text-xs font-normal'
                        }
                      >
                        {msg.isInternal && <Lock className="size-3" />}
                        {msg.badgeText}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">{msg.authorRole}</p>
                  </div>
                </div>
                <time className="text-muted-foreground text-xs whitespace-nowrap">{msg.timestamp}</time>
              </div>
              <div className="text-foreground/90 mt-4 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
            </article>
          ))}

          {/* Reply Box Composer */}
          <section className="bg-card overflow-hidden rounded-xl border shadow-xs">
            <Tabs
              value={composerTab}
              onValueChange={(v) => setComposerTab(v as 'public' | 'internal')}
              defaultValue="public"
            >
              {/* Composer Header with Tabs & Macro Dropdown */}
              <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
                <TabsList className="h-8">
                  <TabsTrigger value="public" className="gap-1.5 text-xs">
                    <MessageSquare className="size-3.5" />
                    Public Reply
                  </TabsTrigger>
                  <TabsTrigger value="internal" className="gap-1.5 text-xs">
                    <Lock className="size-3.5" />
                    Internal Note
                  </TabsTrigger>
                </TabsList>

                {/* Canned Responses / Macros Dropdown */}
                <div className="w-48">
                  <Select value={selectedMacro} onValueChange={handleSelectMacro}>
                    <SelectTrigger size="sm" className="h-8 text-xs">
                      <SelectValue placeholder="Canned macro..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cannedMacros.map((macro) => (
                        <SelectItem key={macro.id} value={macro.id}>
                          {macro.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 p-4">
                {/* Rich Formatting Toolbar */}
                <div className="text-muted-foreground flex items-center gap-1 border-b pb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Format bold"
                    onClick={() => applyFormat('bold')}
                  >
                    <Bold className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Format italic"
                    onClick={() => applyFormat('bold')}
                  >
                    <Italic className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Format code"
                    onClick={() => applyFormat('code')}
                  >
                    <Code className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Insert link"
                    onClick={() => applyFormat('link')}
                  >
                    <Link2 className="size-3.5" />
                  </Button>
                  <Separator orientation="vertical" className="mx-1 h-4" />
                  <Button variant="ghost" size="icon" className="size-7" aria-label="Attach file">
                    <Paperclip className="size-3.5" />
                  </Button>
                  <span className="text-muted-foreground ml-auto text-xs">Markdown supported</span>
                </div>

                {/* Textarea with dynamic background if internal note */}
                <Textarea
                  value={replyDraft}
                  onValueChange={(v) => setReplyDraft(v)}
                  placeholder={
                    composerTab === 'public'
                      ? 'Write a public reply to Sarah Davis...'
                      : 'Add an internal note only visible to team members...'
                  }
                  rows={4}
                  className={`resize-y text-sm ${
                    composerTab === 'internal'
                      ? 'border-amber-500/30 bg-amber-500/5 focus-visible:ring-amber-500/20'
                      : ''
                  }`}
                />

                {/* Composer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Paperclip className="size-3.5" />
                    <span>Attachments up to 25MB</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {composerTab === 'public' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        disabled={!replyDraft.trim()}
                        onClick={sendAndSolve}
                      >
                        <CheckCheck className="size-3.5" />
                        Send & Mark Solved
                      </Button>
                    )}
                    <Button size="sm" className="gap-1.5 text-xs" disabled={!replyDraft.trim()} onClick={sendReply}>
                      <Send className="size-3.5" />
                      {composerTab === 'public' ? 'Send Reply' : 'Add Internal Note'}
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </section>
        </main>

        {/* Right Column: Customer & Ticket Metadata Sidebar (1/3) */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Customer Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">SD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-semibold">Sarah Davis</CardTitle>
                    <CardDescription className="text-xs">VP of Engineering</CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="text-xs font-medium">
                  Enterprise
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Separator />
              <dl className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Company</dt>
                  <dd className="text-foreground font-medium">Acme Corp</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-foreground max-w-[180px] truncate font-medium">sarah@acme-corp.io</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Total Tickets</dt>
                  <dd className="text-foreground font-medium tabular-nums">12 (10 resolved)</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Customer Since</dt>
                  <dd className="text-foreground font-medium">Jan 2024</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">SLA Plan</dt>
                  <dd className="text-foreground font-medium">1h Critical Response</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Timezone</dt>
                  <dd className="text-foreground font-medium">America/Los_Angeles (UTC-7)</dd>
                </div>
              </dl>
              <Separator />
              <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs">
                View Customer in CRM
                <ArrowUpRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>

          {/* Ticket Attributes Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Ticket Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {/* Assigned Agent */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground text-xs font-medium">Assigned Agent</label>
                <Select value={assignedAgent} onValueChange={setAssignedAgent}>
                  <SelectTrigger size="sm" className="w-full text-xs">
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

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground text-xs font-medium">Department</label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger size="sm" className="w-full text-xs">
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

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-muted-foreground text-xs font-medium">Priority</label>
                <Select value={ticketPriority} onValueChange={setTicketPriority}>
                  <SelectTrigger size="sm" className="w-full text-xs">
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

              {/* Tags Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium">Tags</span>
                  {!isAddingTag && (
                    <button
                      className="text-primary min-h-6 text-xs font-medium hover:underline"
                      onClick={() => setIsAddingTag(true)}
                    >
                      + Add Tag
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs"
                    >
                      <Tag className="text-muted-foreground size-3" />
                      {tag}
                      <button
                        className="text-muted-foreground hover:text-foreground ml-0.5"
                        aria-label="Remove tag"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {isAddingTag && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Input
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="New tag..."
                      className="h-7 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button size="sm" className="h-7 px-2 text-xs" onClick={addTag}>
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setIsAddingTag(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SLA & Metrics Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">SLA & Metrics</CardTitle>
                <Badge variant="outline" className="text-xs font-medium">
                  Active SLA
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <dl className="space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <dt className="text-foreground font-medium">First Response Time</dt>
                    <dd className="text-muted-foreground text-xs">Target: &lt; 15m</dd>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">8m</span>
                    <span className="text-muted-foreground block text-xs">7m ahead</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <dt className="text-foreground font-medium">Target Resolution</dt>
                    <dd className="text-muted-foreground text-xs">Target: 4h (Elapsed: 3h 18m)</dd>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">42m</span>
                    <span className="text-muted-foreground block text-xs">remaining</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <dt className="text-foreground font-medium">CSAT Prediction</dt>
                    <dd className="text-muted-foreground text-xs">Based on sentiment analysis</dd>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    98% High
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <Globe className="size-3.5" />
                    Source Channel
                  </dt>
                  <dd className="text-foreground font-medium">Web Portal</dd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldAlert className="size-3.5" />
                    Escalation Tier
                  </dt>
                  <dd className="text-foreground font-medium">Tier 2 Support</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
