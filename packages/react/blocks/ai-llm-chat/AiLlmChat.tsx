'use client'

import * as React from 'react'
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  MessageSquarePlus,
  MoreHorizontal,
  Paperclip,
  PanelLeft,
  PanelLeftClose,
  Pencil,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  Code,
  Lightbulb,
  PenLine,
  BookOpen,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Role = 'user' | 'assistant'
type Feedback = 'up' | 'down'

interface Turn {
  id: string
  role: Role
  body: string
  code?: { lang: string; content: string }
  createdAt: Date
}

interface Thread {
  id: string
  title: string
  updatedAt: Date
  turns: Turn[]
}

const now = new Date()
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
const sevenDays = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

const PLACEHOLDER_REPLY =
  'Here is a placeholder response. Wire `onSend` to your streaming endpoint and push assistant tokens onto the last turn as they arrive.'

const suggestions = [
  { icon: Code, label: 'Explain this code', body: 'Walk me through what `useRegistry()` does line by line.' },
  {
    icon: PenLine,
    label: 'Draft a release note',
    body: 'Write a release note for shipping the new inbox + chat blocks.',
  },
  {
    icon: Lightbulb,
    label: 'Brainstorm',
    body: 'Give me five ideas for verticals to build on top of the uipkge registry.',
  },
  {
    icon: BookOpen,
    label: 'Summarise',
    body: 'Summarise the CLAUDE.md "Primitive vs Block" boundary in three bullets.',
  },
]

const models = [
  { id: 'opus-4-7', label: 'Opus 4.7', hint: 'Most capable' },
  { id: 'sonnet-4-6', label: 'Sonnet 4.6', hint: 'Balanced' },
  { id: 'haiku-4-5', label: 'Haiku 4.5', hint: 'Fastest' },
]

const initialThreads: Thread[] = [
  {
    id: 't1',
    title: 'Designing the registry block boundary',
    updatedAt: new Date(now.getTime() - 12 * 60 * 1000),
    turns: [
      {
        id: 'u1',
        role: 'user',
        body: 'When should I extract a repeating tile pattern across blocks into a primitive?',
        createdAt: new Date(now.getTime() - 22 * 60 * 1000),
      },
      {
        id: 'a1',
        role: 'assistant',
        body: 'Short answer: almost never until you have 5+ distinct blocks calling for the *exact same* shape, and the extraction is slot-only with no layout opinion.\n\nThe trap is that StatCard-style primitives — ones that bake an "icon top-right, value below title, trend pill bottom-right" layout — look reusable but lock every block that consumes them. The user installing the block can\'t swap one tile into a chart-led tile without un-abstracting the primitive first.\n\nThe heuristic the CLAUDE.md spells out:',
        createdAt: new Date(now.getTime() - 21 * 60 * 1000),
      },
      {
        id: 'a1b',
        role: 'assistant',
        body: 'Here is the minimal check you can run on any candidate primitive:',
        code: {
          lang: 'ts',
          content:
            '// If the prop changes BEHAVIOR -> primitive (variant, disabled, multiple)\n// If the prop changes LAYOUT or WHICH FIELDS RENDER -> block territory\n//\n// Red flag: a primitive that accepts an `items` array of structured records\n// and renders them with a fixed shape. That is layout opinion in a prop.\ninterface KpiItem { title: string; value: string; icon: any; trend: number }\n//                ^ if you see this on a `registry:ui` item, stop.',
        },
        createdAt: new Date(now.getTime() - 20 * 60 * 1000),
      },
      {
        id: 'u2',
        role: 'user',
        body: 'And if the same 3 tiles repeat inside one block file?',
        createdAt: new Date(now.getTime() - 14 * 60 * 1000),
      },
      {
        id: 'a2',
        role: 'assistant',
        body: 'Leave them inline. The registry rule is "three similar lines is better than a premature abstraction." Blocks are supposed to read top-to-bottom at the call site — that is the whole reason a user installs a block instead of a primitive. The cost of writing the tile out three times is small; the cost of pre-abstracting and getting the shape slightly wrong is high (every consumer downstream pays for it).',
        createdAt: new Date(now.getTime() - 13 * 60 * 1000),
      },
    ],
  },
  {
    id: 't2',
    title: 'Tailwind v4 OKLCH dark mode tokens',
    updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    turns: [],
  },
  {
    id: 't3',
    title: 'Zero-downtime migration plan',
    updatedAt: yesterday,
    turns: [],
  },
  {
    id: 't4',
    title: 'Composing kanban + calendar in one view',
    updatedAt: new Date(now.getTime() - 30 * 60 * 60 * 1000),
    turns: [],
  },
  {
    id: 't5',
    title: 'shadcn-vue resolver circular warning',
    updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    turns: [],
  },
  {
    id: 't6',
    title: 'Cloudflare Pages preview env wiring',
    updatedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
    turns: [],
  },
]

function formatTime(d: Date): string {
  if (d >= todayStart) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function titleFromBody(body: string) {
  return body.slice(0, 48) + (body.length > 48 ? '…' : '')
}

export interface AiLlmChatProps {
  onSend?: (body: string) => void
  onRegenerate?: (id: string) => void
  onStop?: () => void
}

export function AiLlmChat({ onSend, onRegenerate, onStop }: AiLlmChatProps = {}) {
  const [threads, setThreads] = React.useState<Thread[]>(initialThreads)
  const [activeId, setActiveId] = React.useState('t1')
  const [draft, setDraft] = React.useState('')
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [sidebarSearch, setSidebarSearch] = React.useState('')
  const [activeModel, setActiveModel] = React.useState(models[0])
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [feedback, setFeedback] = React.useState<Record<string, Feedback>>({})
  const [attachment, setAttachment] = React.useState<{ name: string } | null>(null)
  const [renamingId, setRenamingId] = React.useState<string | null>(null)
  const [renameDraft, setRenameDraft] = React.useState('')
  const scrollRoot = React.useRef<HTMLDivElement | null>(null)
  const composer = React.useRef<HTMLTextAreaElement | null>(null)
  const fileInput = React.useRef<HTMLInputElement | null>(null)
  const streamTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeIdRef = React.useRef(activeId)
  activeIdRef.current = activeId

  const activeThread = threads.find((t) => t.id === activeId) ?? threads[0]
  const turns = activeThread?.turns ?? []
  const isEmpty = turns.length === 0

  const filteredThreads = React.useMemo(() => {
    const q = sidebarSearch.trim().toLowerCase()
    return q ? threads.filter((t) => t.title.toLowerCase().includes(q)) : threads
  }, [threads, sidebarSearch])

  const groupedThreads = React.useMemo(() => {
    const today: Thread[] = []
    const ydy: Thread[] = []
    const week: Thread[] = []
    const earlier: Thread[] = []
    for (const t of [...filteredThreads].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())) {
      if (t.updatedAt >= todayStart) today.push(t)
      else if (t.updatedAt.toDateString() === yesterday.toDateString()) ydy.push(t)
      else if (t.updatedAt >= sevenDays) week.push(t)
      else earlier.push(t)
    }
    return [
      { key: 'Today', items: today },
      { key: 'Yesterday', items: ydy },
      { key: 'Previous 7 days', items: week },
      { key: 'Earlier', items: earlier },
    ].filter((g) => g.items.length > 0)
  }, [filteredThreads])

  function scrollToBottom() {
    if (!scrollRoot.current) return
    scrollRoot.current.scrollTop = scrollRoot.current.scrollHeight
  }

  function autosizeComposer() {
    const el = composer.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`
  }

  React.useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [activeId, turns.length, isStreaming])

  React.useEffect(() => {
    autosizeComposer()
  }, [draft])

  React.useEffect(() => {
    return () => {
      if (streamTimer.current) clearTimeout(streamTimer.current)
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])

  function selectThread(id: string) {
    setActiveId(id)
    setRenamingId(null)
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  function newChat() {
    const t: Thread = {
      id: `t${Date.now()}`,
      title: 'New chat',
      updatedAt: new Date(),
      turns: [],
    }
    setThreads((prev) => [t, ...prev])
    setActiveId(t.id)
    setDraft('')
    setAttachment(null)
    requestAnimationFrame(() => composer.current?.focus())
  }

  function patchThread(id: string, updater: (t: Thread) => Thread) {
    setThreads((prev) => prev.map((t) => (t.id === id ? updater(t) : t)))
  }

  function startStream(threadId: string) {
    setIsStreaming(true)
    if (streamTimer.current) clearTimeout(streamTimer.current)
    streamTimer.current = setTimeout(() => {
      patchThread(threadId, (t) => ({
        ...t,
        turns: [
          ...t.turns,
          {
            id: `a${Date.now()}`,
            role: 'assistant',
            body: PLACEHOLDER_REPLY,
            createdAt: new Date(),
          },
        ],
      }))
      setIsStreaming(false)
      streamTimer.current = null
    }, 1400)
  }

  function send(prefill?: string) {
    const body = (prefill ?? draft).trim()
    if ((!body && !attachment) || isStreaming) return
    const content = attachment ? `${body}${body ? '\n\n' : ''}Attached: ${attachment.name}` : body
    const threadId = activeIdRef.current
    patchThread(threadId, (t) => ({
      ...t,
      updatedAt: new Date(),
      title: t.title === 'New chat' ? titleFromBody(content) : t.title,
      turns: [
        ...t.turns,
        {
          id: `u${Date.now()}`,
          role: 'user',
          body: content,
          createdAt: new Date(),
        },
      ],
    }))
    setDraft('')
    setAttachment(null)
    onSend?.(content)
    startStream(threadId)
  }

  function stop() {
    if (streamTimer.current) {
      clearTimeout(streamTimer.current)
      streamTimer.current = null
    }
    setIsStreaming(false)
    onStop?.()
  }

  function regenerate(id: string) {
    if (isStreaming) return
    const threadId = activeIdRef.current
    patchThread(threadId, (t) => {
      const idx = t.turns.findIndex((turn) => turn.id === id)
      if (idx < 0) return t
      return { ...t, turns: t.turns.slice(0, idx) }
    })
    onRegenerate?.(id)
    startStream(threadId)
  }

  function copyTurn(id: string, body: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(body).catch(() => {})
    }
    setCopiedId(id)
    if (copyTimer.current) clearTimeout(copyTimer.current)
    copyTimer.current = setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr))
    }, 1500)
  }

  function copyConversation() {
    const text = turns.map((t) => `${t.role === 'user' ? 'You' : 'Assistant'}: ${t.body}`).join('\n\n')
    copyTurn('conversation', text)
  }

  function clearThread() {
    stop()
    patchThread(activeIdRef.current, (t) => ({ ...t, turns: [], title: 'New chat' }))
  }

  function deleteThread(id: string) {
    setThreads((prev) => {
      const remaining = prev.filter((t) => t.id !== id)
      if (remaining.length === 0) {
        const t: Thread = {
          id: `t${Date.now()}`,
          title: 'New chat',
          updatedAt: new Date(),
          turns: [],
        }
        setActiveId(t.id)
        return [t]
      }
      if (id === activeIdRef.current) setActiveId(remaining[0].id)
      return remaining
    })
  }

  function startRename(t: Thread) {
    setRenamingId(t.id)
    setRenameDraft(t.title)
  }

  function commitRename() {
    const id = renamingId
    if (!id) return
    const next = renameDraft.trim()
    if (next) {
      setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title: next } : t)))
    }
    setRenamingId(null)
  }

  function toggleFeedback(id: string, value: Feedback) {
    setFeedback((prev) => {
      const next = { ...prev }
      if (next[id] === value) delete next[id]
      else next[id] = value
      return next
    })
  }

  function onComposerKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function onAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setAttachment({ name: file.name })
    e.target.value = ''
  }

  return (
    <div
      data-slot="ai-llm-chat"
      className="bg-background text-foreground grid h-[680px] w-full overflow-hidden rounded-xl border shadow-sm"
      style={{ gridTemplateColumns: sidebarOpen ? '16.25rem 1fr' : '0fr 1fr' }}
    >
      <aside className="bg-muted/30 flex min-h-0 min-w-0 flex-col overflow-hidden border-r">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
          <Button className="h-9 flex-1 justify-start gap-2 rounded-lg" variant="outline" onClick={newChat}>
            <MessageSquarePlus className="size-4" />
            New chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Collapse sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose className="size-4" />
          </Button>
        </div>
        <div className="px-3 pt-3 pb-2">
          <Input
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Search chats"
            size="small"
            prefixIcon={<Search className="size-3.5" />}
            className="rounded-lg"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pb-3">
          {filteredThreads.length === 0 && (
            <p className="text-muted-foreground px-3 py-6 text-center text-xs">
              No chats match “{sidebarSearch.trim()}”
            </p>
          )}
          {groupedThreads.map((group) => (
            <React.Fragment key={group.key}>
              <p className="text-muted-foreground px-3 pt-3 pb-1 text-xs font-medium tracking-wide uppercase">
                {group.key}
              </p>
              {group.items.map((t) => (
                <div
                  key={t.id}
                  className={[
                    'group flex w-full items-center gap-0.5 px-1.5 py-0.5',
                    t.id === activeId ? 'bg-primary/10' : 'hover:bg-muted/60',
                  ].join(' ')}
                >
                  {renamingId === t.id ? (
                    <input
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      className="border-input bg-background focus-visible:ring-ring h-7 min-w-0 flex-1 rounded-md border px-2 text-sm outline-none focus-visible:ring-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          commitRename()
                        }
                        if (e.key === 'Escape') {
                          e.preventDefault()
                          setRenamingId(null)
                        }
                      }}
                      onBlur={commitRename}
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      className={[
                        'min-w-0 flex-1 truncate px-1.5 py-1.5 text-left text-sm',
                        t.id === activeId ? 'text-foreground font-medium' : 'text-foreground/80',
                      ].join(' ')}
                      onClick={() => selectThread(t.id)}
                    >
                      {t.title}
                    </button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground size-7 shrink-0 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                        aria-label="Thread actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onSelect={() => startRename(t)}>
                        <Pencil className="size-3.5" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => deleteThread(t.id)}>
                        <Trash2 className="size-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="border-t px-3 py-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs font-medium">U</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">You</p>
              <p className="text-muted-foreground truncate text-xs">Free plan</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Account menu">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem>
                  <Settings className="size-3.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Upgrade plan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
          <div className="flex min-w-0 items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeft className="size-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hover:bg-muted/60 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
                >
                  <Sparkles className="text-primary size-3.5" />
                  {activeModel.label}
                  <ChevronDown className="text-muted-foreground size-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {models.map((m) => (
                  <DropdownMenuItem key={m.id} onSelect={() => setActiveModel(m)}>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{m.label}</p>
                      <p className="text-muted-foreground text-xs">{m.hint}</p>
                    </div>
                    {m.id === activeModel.id && <Check className="text-primary size-3.5 shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label="More options">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled={isEmpty} onSelect={copyConversation}>
                <Copy className="size-3.5" />
                {copiedId === 'conversation' ? 'Copied' : 'Copy conversation'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" disabled={isEmpty} onSelect={clearThread}>
                <Trash2 className="size-3.5" />
                Clear thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div
          ref={scrollRoot}
          className="min-h-0 flex-1 overflow-y-auto"
          role="log"
          aria-live="polite"
          aria-busy={isStreaming}
        >
          {isEmpty ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 px-6">
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                <Sparkles className="size-6" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold tracking-tight">How can I help today?</h2>
                <p className="text-muted-foreground mt-1 text-sm">Ask anything, or try one of these to get started.</p>
              </div>
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      key={s.label}
                      type="button"
                      className="bg-card hover:bg-muted/60 group flex items-start gap-3 rounded-lg border p-3 text-left transition-colors"
                      onClick={() => send(s.body)}
                    >
                      <div className="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary flex size-8 shrink-0 items-center justify-center rounded-md transition-colors">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground text-xs font-medium">{s.label}</p>
                        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-relaxed">{s.body}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
              {turns.map((t) => (
                <div key={t.id} className="group">
                  {t.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-primary/10 text-foreground max-w-[80%] rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
                        {t.body}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                        <Sparkles className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{t.body}</p>
                        {t.code && (
                          <div className="bg-muted/60 overflow-hidden rounded-lg border">
                            <div className="bg-muted/80 text-muted-foreground flex items-center justify-between px-3 py-1.5 font-mono text-xs">
                              <span>{t.code.lang}</span>
                              <button
                                type="button"
                                className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                                onClick={() => copyTurn(t.id + '-code', t.code!.content)}
                              >
                                {copiedId === t.id + '-code' ? (
                                  <Check className="text-success size-3" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                                {copiedId === t.id + '-code' ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                            <pre className="overflow-x-auto px-3 py-2.5 font-mono text-xs leading-relaxed">
                              <code>{t.code.content}</code>
                            </pre>
                          </div>
                        )}
                        <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                          <button
                            type="button"
                            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs transition-colors"
                            onClick={() => copyTurn(t.id, t.body)}
                          >
                            {copiedId === t.id ? (
                              <Check className="text-success size-3" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                            {copiedId === t.id ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            type="button"
                            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-7 items-center justify-center rounded-md transition-colors"
                            aria-label="Regenerate"
                            onClick={() => regenerate(t.id)}
                          >
                            <RefreshCw className="size-3" />
                          </button>
                          <button
                            type="button"
                            className={[
                              'hover:bg-muted inline-flex size-7 items-center justify-center rounded-md transition-colors',
                              feedback[t.id] === 'up' ? 'text-success' : 'text-muted-foreground hover:text-success',
                            ].join(' ')}
                            aria-label="Good response"
                            aria-pressed={feedback[t.id] === 'up'}
                            onClick={() => toggleFeedback(t.id, 'up')}
                          >
                            <ThumbsUp className="size-3" />
                          </button>
                          <button
                            type="button"
                            className={[
                              'hover:bg-muted inline-flex size-7 items-center justify-center rounded-md transition-colors',
                              feedback[t.id] === 'down'
                                ? 'text-destructive'
                                : 'text-muted-foreground hover:text-destructive',
                            ].join(' ')}
                            aria-label="Bad response"
                            aria-pressed={feedback[t.id] === 'down'}
                            onClick={() => toggleFeedback(t.id, 'down')}
                          >
                            <ThumbsDown className="size-3" />
                          </button>
                          <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                            {formatTime(t.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1.5 pt-1.5" aria-label="Generating">
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-muted/20 shrink-0 border-t px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <div className="bg-background border-input/60 focus-within:border-primary/40 focus-within:ring-primary/10 flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-150 focus-within:shadow-md focus-within:ring-4">
              {attachment && (
                <div className="flex items-center gap-2 px-3 pt-3">
                  <span className="bg-muted text-foreground inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 text-xs">
                    <Paperclip className="size-3 shrink-0" />
                    <span className="truncate">{attachment.name}</span>
                    <button
                      type="button"
                      className="hover:text-destructive"
                      aria-label="Remove attachment"
                      onClick={() => setAttachment(null)}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                </div>
              )}
              <textarea
                ref={composer}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${activeModel.label}`}
                rows={1}
                className="placeholder:text-muted-foreground/70 max-h-48 min-h-12 w-full resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed outline-none"
                onKeyDown={onComposerKey}
              />
              <div className="flex items-center justify-between gap-2 px-2 pb-2">
                <div className="flex items-center gap-0.5">
                  <input ref={fileInput} type="file" className="sr-only" onChange={onAttach} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-8"
                    aria-label="Attach file"
                    onClick={() => fileInput.current?.click()}
                  >
                    <Paperclip className="size-4" />
                  </Button>
                  <span className="text-muted-foreground bg-muted ml-1 inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium">
                    <Sparkles className="text-primary size-3" />
                    {activeModel.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="bg-muted text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-xs sm:inline-flex">
                    ↵
                  </kbd>
                  {isStreaming ? (
                    <Button
                      variant="outline"
                      className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                      aria-label="Stop generating"
                      onClick={stop}
                    >
                      <Square className="size-3 fill-current" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                      disabled={!draft.trim() && !attachment}
                      aria-label="Send"
                      onClick={() => send()}
                    >
                      Send
                      <ArrowUp className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground/70 mt-2 text-center text-xs">
              AI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .typing-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: currentColor;
          opacity: 0.5;
          animation: typing-bounce 1s infinite ease-in-out;
        }
        @keyframes typing-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
          40% {
            transform: translateY(-3px);
            opacity: 0.9;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .typing-dot {
            animation: none;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}
