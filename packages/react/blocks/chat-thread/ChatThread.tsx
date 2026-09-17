'use client'

import * as React from 'react'
import { ArrowRight, AtSign, Paperclip, Phone, Smile, Video, MoreVertical, Check, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type MessageStatus = 'sent' | 'delivered' | 'read'

interface Message {
  id: string
  author: 'me' | 'them'
  body: string
  sentAt: Date
  status?: MessageStatus
}

const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

const peer = {
  name: 'Marcus Rivera',
  handle: '@marcus',
  avatarUrl: '',
  initials: 'MR',
  online: true,
  lastSeen: 'Active now',
}

const initialMessages: Message[] = [
  {
    id: 'm1',
    author: 'them',
    body: 'Hey — did you get a chance to look at the onboarding doc?',
    sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 14 * 60 * 1000),
  },
  {
    id: 'm2',
    author: 'me',
    body: 'Yeah, just finished. Two small notes on the time-off flow but otherwise looks solid.',
    sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 21 * 60 * 1000),
    status: 'read',
  },
  {
    id: 'm3',
    author: 'them',
    body: 'Perfect. Drop them in the doc and I will action this afternoon.',
    sentAt: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 + 23 * 60 * 1000),
  },
  {
    id: 'm4',
    author: 'me',
    body: 'Done. Also — are we still on for the dashboard review tomorrow at 10?',
    sentAt: new Date(now.getTime() - 42 * 60 * 1000),
    status: 'read',
  },
  {
    id: 'm5',
    author: 'them',
    body: 'Yes! I will bring the kanban deck. Want to push it to 10:30 so we can join from the standup?',
    sentAt: new Date(now.getTime() - 8 * 60 * 1000),
  },
]

function dayLabel(d: Date): string {
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return 'Today'
  const sameYesterday = d.toDateString() === yesterday.toDateString()
  if (sameYesterday) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function ChatThread() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [draft, setDraft] = React.useState('')
  const [peerTyping, setPeerTyping] = React.useState(false)
  const scrollRoot = React.useRef<HTMLDivElement | null>(null)
  const composerRef = React.useRef<HTMLTextAreaElement | null>(null)
  // Keep `send` referenced by the native keydown listener fresh without
  // re-binding on every keystroke.
  const sendRef = React.useRef<() => void>(() => {})

  const groupedMessages = React.useMemo(() => {
    const groups: Array<{ label: string; items: Message[] }> = []
    for (const m of messages) {
      const label = dayLabel(m.sentAt)
      const last = groups[groups.length - 1]
      if (last && last.label === label) last.items.push(m)
      else groups.push({ label, items: [m] })
    }
    return groups
  }, [messages])

  function scrollToBottom() {
    if (!scrollRoot.current) return
    scrollRoot.current.scrollTop = scrollRoot.current.scrollHeight
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  function send() {
    const body = draft.trim()
    if (!body) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        author: 'me',
        body,
        sentAt: new Date(),
        status: 'sent',
      },
    ])
    setDraft('')
    setPeerTyping(true)
    window.setTimeout(() => {
      setPeerTyping(false)
    }, 1800)
  }

  // The Textarea primitive's `onKeyDown` prop fires with no event, so attach a
  // native keydown listener to the underlying <textarea> to implement
  // Enter-to-send / Shift+Enter-for-newline.
  React.useEffect(() => {
    sendRef.current = send
  })

  React.useEffect(() => {
    const el = composerRef.current
    if (!el) return
    function onComposerKey(e: KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendRef.current()
      }
    }
    el.addEventListener('keydown', onComposerKey)
    return () => el.removeEventListener('keydown', onComposerKey)
  }, [])

  return (
    <div
      data-slot="chat-thread"
      className="bg-card text-card-foreground flex h-[680px] w-full flex-col overflow-hidden rounded-xl border shadow-sm"
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative">
            <Avatar className="size-9">
              {peer.avatarUrl && <AvatarImage src={peer.avatarUrl} alt={peer.name} />}
              <AvatarFallback className="text-xs font-medium">{peer.initials}</AvatarFallback>
            </Avatar>
            {peer.online && (
              <span className="bg-success ring-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">{peer.name}</p>
            <p className="text-muted-foreground truncate text-xs">{peer.lastSeen}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Voice call">
            <Phone className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Video call">
            <Video className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" aria-label="More options">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </header>

      <div ref={scrollRoot} className="chat-scroll flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {groupedMessages.map((group) => (
          <div key={group.label} className="space-y-3">
            <div className="flex items-center justify-center">
              <span className="text-muted-foreground bg-muted/60 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase">
                {group.label}
              </span>
            </div>
            {group.items.map((m) => (
              <div key={m.id} className={`flex items-end gap-2 ${m.author === 'me' ? 'justify-end' : 'justify-start'}`}>
                {m.author === 'them' && (
                  <Avatar className="size-7">
                    <AvatarFallback className="text-xs">{peer.initials}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex max-w-[78%] flex-col gap-1 ${m.author === 'me' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm ${
                      m.author === 'me'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    {m.body}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1 px-1 text-xs tabular-nums">
                    <span>{formatTime(m.sentAt)}</span>
                    {m.author === 'me' && m.status === 'read' && <CheckCheck className="text-info size-3" />}
                    {m.author === 'me' && m.status === 'delivered' && <CheckCheck className="size-3" />}
                    {m.author === 'me' && m.status === 'sent' && <Check className="size-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {peerTyping && (
          <div className="flex items-end gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="text-xs">{peer.initials}</AvatarFallback>
            </Avatar>
            <div className="bg-muted text-muted-foreground flex items-center gap-1 rounded-2xl rounded-bl-md px-3 py-2.5">
              <span className="typing-dot" />
              <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
              <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-muted/20 border-t px-4 py-3">
        <div className="bg-background border-input/60 focus-within:border-primary/40 focus-within:ring-primary/10 group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-150 focus-within:shadow-md focus-within:ring-4">
          <Textarea
            ref={composerRef}
            value={draft}
            onValueChange={setDraft}
            placeholder={`Message ${peer.name.split(' ')[0]}`}
            rows={1}
            variant="plain"
            className="placeholder:text-muted-foreground/70 max-h-40 min-h-[44px] resize-none border-0 bg-transparent px-4 pt-3 pb-1 text-sm leading-relaxed shadow-none focus-visible:ring-0"
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
                <span>↵</span>
              </kbd>
              <Button
                className="h-8 gap-1.5 rounded-lg px-3 text-xs font-medium"
                disabled={!draft.trim()}
                aria-label="Send"
                onClick={send}
              >
                Send
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground/70 mt-2 text-center text-xs">
          <kbd className="bg-muted/60 rounded px-1 py-0.5 font-mono text-xs">Enter</kbd> to send
          <span className="mx-1.5 opacity-50">·</span>
          <kbd className="bg-muted/60 rounded px-1 py-0.5 font-mono text-xs">Shift</kbd> +{' '}
          <kbd className="bg-muted/60 rounded px-1 py-0.5 font-mono text-xs">↵</kbd> for newline
        </p>
      </div>

      <style>{`
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
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
      `}</style>
    </div>
  )
}
