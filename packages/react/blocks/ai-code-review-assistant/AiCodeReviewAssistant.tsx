'use client'

import * as React from 'react'
import {
  Bot,
  Check,
  CheckCircle2,
  CheckCheck,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Layers,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface AiCodeReviewAssistantProps {
  prNumber?: number
  prTitle?: string
  authorName?: string
  authorHandle?: string
  authorRole?: string
  authorAvatar?: string
  sourceBranch?: string
  targetBranch?: string
  className?: string
}

export interface DiffLine {
  id: string
  oldNum?: number
  newNum?: number
  type: 'neutral' | 'deletion' | 'addition' | 'hunk'
  text: string
  annotationId?: string
}

export interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  author: string
  timestamp: string
  text: string
  codeSnippet?: string
}

export function AiCodeReviewAssistant({
  prNumber = 412,
  prTitle = 'refactor(tokens): migrate to OKLCH perceptual contrast engine',
  authorName = 'Elena Rostova',
  authorHandle = 'elena-rostova',
  authorRole = 'Staff Design Systems Engineer',
  authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face',
  sourceBranch = 'feature/oklch-engine',
  targetBranch = 'main',
  className,
}: AiCodeReviewAssistantProps) {
  const [activeTab, setActiveTab] = React.useState('diff')
  const [isApplyingAll, setIsApplyingAll] = React.useState(false)
  const [appliedPatches, setAppliedPatches] = React.useState<Set<string>>(new Set())
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const [chatInput, setChatInput] = React.useState('')
  const [copiedDiff, setCopiedDiff] = React.useState(false)
  const [copiedPatchId, setCopiedPatchId] = React.useState<string | null>(null)

  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      author: 'Glia AI Code Reviewer',
      timestamp: '2 min ago',
      text: "I completed the AST review for PR #412. Migrating to OKLCH perceptual contrast is a massive win. I've pinpointed 2 optimization opportunities to maximize token efficiency and eliminate 20 DOM variables.",
    },
    {
      id: 'msg-2',
      sender: 'user',
      author: 'Elena Rostova',
      timestamp: '1 min ago',
      text: 'Why is `color-mix(in oklab, ... 10%, transparent)` better than declaring separate opacity custom properties?',
    },
    {
      id: 'msg-3',
      sender: 'ai',
      author: 'Glia AI Code Reviewer',
      timestamp: 'Just now',
      text: 'Direct OKLab color-mix calculates the alpha composite on the GPU shader pipeline without registering 20 CSS custom properties in the browser style recalculation tree. This cuts ~1.8 KB from DOM memory while keeping luminance completely linear.',
      codeSnippet: 'color-mix(in oklab, var(--primary) 10%, transparent)',
    },
  ])

  const diffLines: DiffLine[] = React.useMemo(
    () => [
      {
        id: 'hunk-1',
        type: 'hunk',
        text: '@@ -32,18 +32,24 @@ packages/shared/styles/tailwind.css',
      },
      {
        id: 'line-32',
        oldNum: 32,
        newNum: 32,
        type: 'neutral',
        text: '@import "tailwindcss";',
      },
      {
        id: 'line-33',
        oldNum: 33,
        newNum: 33,
        type: 'neutral',
        text: '@import "tw-animate-css";',
      },
      {
        id: 'line-34',
        oldNum: 34,
        newNum: 34,
        type: 'neutral',
        text: '',
      },
      {
        id: 'line-35',
        oldNum: 35,
        newNum: 35,
        type: 'neutral',
        text: '@theme inline {',
      },
      {
        id: 'line-36',
        oldNum: 36,
        newNum: 36,
        type: 'neutral',
        text: '  --font-sans: "Inter", system-ui, sans-serif;',
      },
      {
        id: 'line-37',
        oldNum: 37,
        newNum: 37,
        type: 'neutral',
        text: '  --font-mono: "DM Mono", monospace;',
      },
      {
        id: 'line-38',
        oldNum: 38,
        type: 'deletion',
        text: '-  --primary-10: color-mix(in srgb, var(--primary) 10%, #ffffff);',
      },
      {
        id: 'line-39',
        oldNum: 39,
        type: 'deletion',
        text: '-  --primary-20: color-mix(in srgb, var(--primary) 20%, #ffffff);',
      },
      {
        id: 'line-40',
        oldNum: 40,
        type: 'deletion',
        text: '-  --primary-hover: hsl(var(--primary-hsl) / 0.85);',
      },
      {
        id: 'line-41',
        newNum: 38,
        type: 'addition',
        text: '+  --primary-hover: oklch(from var(--primary) calc(l * 0.92) c h);',
      },
      {
        id: 'line-42',
        newNum: 39,
        type: 'addition',
        text: appliedPatches.has('patch-1')
          ? '+  --primary-accent: color-mix(in oklab, var(--primary) 10%, transparent); /* [Glia AI Patch Applied] */'
          : '+  --primary-accent: color-mix(in oklab, var(--primary) 15%, transparent);',
        annotationId: 'patch-1',
      },
      {
        id: 'line-43',
        oldNum: 41,
        newNum: 40,
        type: 'neutral',
        text: '  --color-background: var(--background);',
      },
      {
        id: 'line-44',
        oldNum: 42,
        newNum: 41,
        type: 'neutral',
        text: '  --color-foreground: var(--foreground);',
      },
      {
        id: 'line-45',
        oldNum: 43,
        type: 'deletion',
        text: '-  --muted-border: rgb(229 231 235 / 0.6);',
      },
      {
        id: 'line-46',
        newNum: 42,
        type: 'addition',
        text: '+  --muted-border: oklch(0.92 0.005 240 / 0.8);',
      },
      {
        id: 'line-47',
        oldNum: 44,
        newNum: 43,
        type: 'neutral',
        text: '  --color-border: var(--border);',
      },
      {
        id: 'line-48',
        oldNum: 45,
        newNum: 44,
        type: 'neutral',
        text: '  --color-input: var(--input);',
      },
      {
        id: 'line-49',
        oldNum: 46,
        type: 'deletion',
        text: '-  --ring-offset-width: 2px;',
      },
      {
        id: 'line-50',
        newNum: 45,
        type: 'addition',
        text: '+  --color-ring: oklch(from var(--primary) l c h / 0.5);',
      },
      {
        id: 'line-51',
        newNum: 46,
        type: 'addition',
        text: appliedPatches.has('patch-2')
          ? '+  --ring-focus-shadow: 0 0 0 2px var(--color-ring); /* [Glia AI Patch Applied] */'
          : '+  --ring-focus-shadow: 0 0 0 2px var(--color-ring);',
        annotationId: 'patch-2',
      },
      {
        id: 'line-52',
        oldNum: 47,
        newNum: 47,
        type: 'neutral',
        text: '  --color-card: var(--card);',
      },
      {
        id: 'line-53',
        oldNum: 48,
        newNum: 48,
        type: 'neutral',
        text: '  --color-card-foreground: var(--card-foreground);',
      },
      {
        id: 'line-54',
        oldNum: 49,
        newNum: 49,
        type: 'neutral',
        text: '}',
      },
    ],
    [appliedPatches],
  )

  const allPatchesApplied = appliedPatches.size === 2
  const qualityScore = allPatchesApplied ? 99 : 96

  const togglePatch = (patchId: string) => {
    setAppliedPatches((prev) => {
      const next = new Set(prev)
      if (next.has(patchId)) {
        next.delete(patchId)
      } else {
        next.add(patchId)
      }
      return next
    })
  }

  const applyAllPatches = () => {
    if (isApplyingAll) return
    setIsApplyingAll(true)
    setTimeout(() => {
      setAppliedPatches(new Set(['patch-1', 'patch-2']))
      setIsApplyingAll(false)
    }, 600)
  }

  const resetPatches = () => {
    setAppliedPatches(new Set())
  }

  const openChatWithTopic = (topicText?: string) => {
    setIsChatOpen(true)
    if (topicText) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        author: 'Elena Rostova',
        timestamp: 'Just now',
        text: topicText,
      }
      setChatMessages((prev) => [...prev, userMsg])
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          author: 'Glia AI Code Reviewer',
          timestamp: 'Just now',
          text: `Regarding "${topicText}": Our AST lint engine verified that OKLCH relative color syntax produces 7:1 contrast on dark surfaces with zero gamut clipping on Apple Display P3 panels.`,
        }
        setChatMessages((prev) => [...prev, aiMsg])
      }, 450)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text) return
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      author: 'Elena Rostova',
      timestamp: 'Just now',
      text,
    }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput('')

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        author: 'Glia AI Code Reviewer',
        timestamp: 'Just now',
        text: 'Validated against UIPKGE craft standards. The suggested AST refactor is fully backward-compatible with PostCSS fallback polyfills.',
      }
      setChatMessages((prev) => [...prev, aiMsg])
    }, 500)
  }

  const copyRawDiff = () => {
    const rawText = diffLines.map((l) => `${l.text}`).join('\n')
    navigator.clipboard?.writeText(rawText)
    setCopiedDiff(true)
    setTimeout(() => setCopiedDiff(false), 2000)
  }

  const copyPatchCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedPatchId(id)
    setTimeout(() => setCopiedPatchId(null), 2000)
  }

  return (
    <div data-uipkge data-slot="ai-code-review-assistant" className={cn('w-full space-y-6', className)}>
      {/* Header: Pull Request Info & AI Review Status */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              {/* PR Badge & Title */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge wrap variant="outline" className="gap-1.5 font-mono text-xs">
                  <GitPullRequest className="text-primary size-3.5" />
                  <span>PR #{prNumber}</span>
                </Badge>
                <h2 className="text-foreground text-base font-bold tracking-tight sm:text-lg">{prTitle}</h2>
              </div>

              {/* Meta: Author, Branches, Commit */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5 border">
                    <AvatarImage src={authorAvatar} alt={authorName} />
                    <AvatarFallback className="text-xs">ER</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium">{authorName}</span>
                  <span className="text-muted-foreground">(@{authorHandle})</span>
                </div>

                <Separator orientation="vertical" className="h-3.5" />

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <GitBranch className="text-primary size-3.5" />
                  <span className="text-foreground font-semibold">{targetBranch}</span>
                  <span className="text-muted-foreground">←</span>
                  <span className="text-foreground font-semibold">{sourceBranch}</span>
                </div>

                <Separator orientation="vertical" className="h-3.5" />

                <div className="flex items-center gap-1 font-mono text-xs">
                  <GitCommit className="text-muted-foreground size-3.5" />
                  <span>8f2a49b</span>
                  <span>·</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">+142</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">-68</span>
                </div>
              </div>
            </div>

            {/* Actions & Review Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!allPatchesApplied ? (
                <Badge
                  wrap
                  variant="success"
                  className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <Sparkles className="size-3.5 shrink-0" />
                  <span>Review Completed · 2 Suggestions · 0 Security Flaws</span>
                </Badge>
              ) : (
                <Badge
                  wrap
                  variant="success"
                  className="gap-1.5 border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                >
                  <CheckCheck className="size-3.5 shrink-0" />
                  <span>All Patches Applied · Ready to Merge</span>
                </Badge>
              )}

              {!allPatchesApplied ? (
                <Button
                  size="sm"
                  variant="default"
                  className="gap-1.5 text-xs font-medium shadow-xs"
                  disabled={isApplyingAll}
                  onClick={applyAllPatches}
                >
                  {isApplyingAll ? <RefreshCw className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  <span>{isApplyingAll ? 'Applying Patches...' : 'Apply All AI Patches'}</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs font-medium shadow-xs"
                  onClick={resetPatches}
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset State</span>
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs font-medium shadow-xs"
                onClick={() => openChatWithTopic()}
              >
                <MessageSquare className="size-3.5" />
                <span>AI Chat (3)</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 4 Code Review Health Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Quality Score */}
        <Card className="border-border bg-card shadow-xs transition-colors">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Code Quality Score</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">{qualityScore} / 100</div>
              <p className="text-muted-foreground mt-1 text-xs">
                Clean Architecture · <span className="font-medium text-emerald-600 dark:text-emerald-400">+14 pts</span>{' '}
                vs baseline
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" />
              <span>0 Anti-patterns · Clean CVA tokens</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Security & Vulnerability Check */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Security & SAST Check</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">0 Vulnerabilities</div>
              <p className="text-muted-foreground mt-1 text-xs">
                0 Vulnerabilities Detected ·{' '}
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Pass</span>
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" />
              <span>OWASP Top 10 validated · Zero leaks</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Performance & Bundle Impact */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Performance & Bundle Impact</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">-4.2 KB (-18%)</div>
              <p className="text-muted-foreground mt-1 text-xs">Bundle Size Reduction · 14.8 KB → 10.6 KB</p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <TrendingDown className="size-3.5" />
              <span>20 CSS variables eliminated from DOM</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Test Coverage Delta */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Test Coverage Delta</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Layers className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">+2.4% Coverage</div>
              <p className="text-muted-foreground mt-1 text-xs">48 new tests · 94.8% total coverage</p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3.5" />
              <span>100% token regression suites pass</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Annotated Code Diff Reviewer Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-border border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <FileCode2 className="text-primary size-4 shrink-0" />
                <CardTitle className="text-foreground font-mono text-sm font-semibold sm:text-base">
                  packages/shared/styles/tailwind.css
                </CardTitle>
                <Badge wrap variant="outline" className="font-mono text-xs">
                  CSS / Tailwind v4
                </Badge>
                <Badge wrap variant="secondary" className="font-mono text-xs">
                  +24 -12 lines
                </Badge>
              </div>
              <CardDescription className="text-muted-foreground text-xs">
                AST parser inspected 162 declarations · 2 optimization nodes annotated
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                onClick={copyRawDiff}
              >
                {copiedDiff ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{copiedDiff ? 'Copied Raw Diff' : 'Copy Raw Diff'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
              <TabsTrigger value="diff" className="gap-1.5 text-xs">
                <Code2 className="size-3.5" />
                <span>Unified Code Diff</span>
              </TabsTrigger>
              <TabsTrigger value="rules" className="gap-1.5 text-xs">
                <ShieldCheck className="size-3.5" />
                <span>AST Rule Checks (4)</span>
              </TabsTrigger>
              <TabsTrigger value="impact" className="gap-1.5 text-xs">
                <Cpu className="size-3.5" />
                <span>Token Matrix &amp; Gamut</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Visual Unified Code Diff with Inline AI Annotations */}
            <TabsContent value="diff" className="space-y-4 focus-visible:outline-none">
              <div className="border-border bg-muted/40 flex items-center justify-between rounded-t-md border-x border-t px-3 py-2 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <span className="text-foreground font-medium">Unified Diff View</span>
                  <span>·</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">+24 additions</span>
                  <span>·</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">-12 deletions</span>
                </div>
                <span className="text-muted-foreground font-mono">AST Analyzed</span>
              </div>

              <div className="border-border bg-muted/20 overflow-x-auto rounded-b-md border font-mono text-xs leading-relaxed">
                <div className="max-w-[620px] min-w-full py-2">
                  {diffLines.map((line) => (
                    <React.Fragment key={line.id}>
                      {/* Hunk Line */}
                      {line.type === 'hunk' ? (
                        <div className="bg-muted/60 text-muted-foreground px-3 py-1 font-mono text-xs font-semibold select-none">
                          {line.text}
                        </div>
                      ) : (
                        /* Diff Code Row */
                        <div
                          className={cn(
                            'flex items-center px-3 py-0.5 transition-colors',
                            line.type === 'addition' &&
                              'border-l-2 border-emerald-500 bg-emerald-500/10 font-medium text-emerald-900 dark:text-emerald-200',
                            line.type === 'deletion' &&
                              'border-l-2 border-rose-500 bg-rose-500/10 font-medium text-rose-900 line-through opacity-85 dark:text-rose-200',
                            line.type === 'neutral' && 'text-muted-foreground border-l-2 border-transparent',
                          )}
                        >
                          {/* Old Line Number */}
                          <span className="text-muted-foreground/50 w-8 shrink-0 pr-2 text-right select-none">
                            {line.oldNum ?? ''}
                          </span>
                          {/* New Line Number */}
                          <span className="text-muted-foreground/50 w-8 shrink-0 pr-3 text-right select-none">
                            {line.newNum ?? ''}
                          </span>
                          {/* Prefix */}
                          <span
                            className={cn(
                              'w-4 shrink-0 text-center font-bold select-none',
                              line.type === 'addition' && 'text-emerald-600 dark:text-emerald-400',
                              line.type === 'deletion' && 'text-rose-600 dark:text-rose-400',
                              line.type === 'neutral' && 'text-transparent',
                            )}
                          >
                            {line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' '}
                          </span>
                          {/* Code Text */}
                          <span className="pl-1 whitespace-pre">{line.text}</span>
                        </div>
                      )}

                      {/* Inline AI Review Annotation Card #1 (Pinned under line 42) */}
                      {line.annotationId === 'patch-1' && (
                        <div className="mx-4 my-3 rounded-lg border border-amber-500/40 bg-amber-500/[0.04] p-4 text-xs shadow-xs dark:border-amber-500/30 dark:bg-amber-950/[0.1]">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                  <Bot className="size-3.5" />
                                </div>
                                <span className="text-foreground font-semibold">
                                  Glia AI Code Review · AST Suggestion
                                </span>
                                <Badge wrap variant="warning" className="gap-1 font-semibold">
                                  <Sparkles className="size-3" />
                                  <span>Performance Optimization · High Impact</span>
                                </Badge>
                                <span className="text-muted-foreground text-xs">Confidence 99.4% · AST Node #42</span>
                              </div>

                              {/* Explanation */}
                              <p className="text-foreground font-sans text-xs leading-relaxed font-medium">
                                Using{' '}
                                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono">
                                  color-mix(in oklab, var(--primary) 10%, transparent)
                                </code>{' '}
                                achieves identical contrast without injecting 20 additional CSS variables into the
                                global DOM.
                              </p>

                              {/* Code Preview Replacement */}
                              <div className="border-border/60 bg-muted/50 rounded-md border p-2.5 font-mono text-xs">
                                <div className="text-muted-foreground mb-1 text-xs select-none">
                                  Proposed AST Patch Replacement (Line 39):
                                </div>
                                <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                                  + --primary-accent: color-mix(in oklab, var(--primary) 10%, transparent);
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
                              <Button
                                size="xs"
                                variant="outline"
                                className="h-7 gap-1 text-xs"
                                onClick={() =>
                                  copyPatchCode('patch-1', 'color-mix(in oklab, var(--primary) 10%, transparent)')
                                }
                              >
                                {copiedPatchId === 'patch-1' ? (
                                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="size-3" />
                                )}
                                <span>{copiedPatchId === 'patch-1' ? 'Copied' : 'Copy Patch'}</span>
                              </Button>

                              <Button
                                size="xs"
                                variant="outline"
                                className="h-7 gap-1 text-xs"
                                onClick={() =>
                                  openChatWithTopic(
                                    'Explain why OKLab color-mix avoids DOM stylesheet recalculation overhead',
                                  )
                                }
                              >
                                <MessageSquare className="size-3" />
                                <span>Explain in Chat</span>
                              </Button>

                              <Button
                                size="xs"
                                variant={appliedPatches.has('patch-1') ? 'secondary' : 'default'}
                                className={cn(
                                  'h-7 gap-1 text-xs font-medium shadow-xs',
                                  appliedPatches.has('patch-1') &&
                                    'border-emerald-500/30 font-semibold text-emerald-700 dark:text-emerald-300',
                                )}
                                onClick={() => togglePatch('patch-1')}
                              >
                                {appliedPatches.has('patch-1') ? (
                                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Zap className="size-3" />
                                )}
                                <span>
                                  {appliedPatches.has('patch-1') ? 'Patch Applied ✓' : 'Apply Suggestion (1-Click)'}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Inline AI Review Annotation Card #2 (Pinned under line 51) */}
                      {line.annotationId === 'patch-2' && (
                        <div className="mx-4 my-3 rounded-lg border border-emerald-500/40 bg-emerald-500/[0.04] p-4 text-xs shadow-xs dark:border-emerald-500/30 dark:bg-emerald-950/[0.1]">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                  <ShieldCheck className="size-3.5" />
                                </div>
                                <span className="text-foreground font-semibold">
                                  Glia AI Code Review · Gamut Engine
                                </span>
                                <Badge wrap variant="success" className="gap-1 font-semibold">
                                  <CheckCircle2 className="size-3" />
                                  <span>Accessibility &amp; Gamut · WCAG AAA Verified</span>
                                </Badge>
                                <span className="text-muted-foreground text-xs">Confidence 98.7% · AST Node #51</span>
                              </div>

                              {/* Explanation */}
                              <p className="text-foreground font-sans text-xs leading-relaxed font-medium">
                                OKLCH relative gamut mapping guarantees 7:1 contrast ratio across both light and dark
                                themes with zero perceptual hue shift on wide-gamut displays.
                              </p>

                              {/* Code Preview Replacement */}
                              <div className="border-border/60 bg-muted/50 rounded-md border p-2.5 font-mono text-xs">
                                <div className="text-muted-foreground mb-1 text-xs select-none">
                                  Verified Relative Color Syntax:
                                </div>
                                <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                                  + --ring-focus-shadow: 0 0 0 2px var(--color-ring);
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
                              <Button
                                size="xs"
                                variant="outline"
                                className="h-7 gap-1 text-xs"
                                onClick={() =>
                                  openChatWithTopic(
                                    'How does OKLCH guarantee WCAG AAA contrast without shift on P3 monitors?',
                                  )
                                }
                              >
                                <MessageSquare className="size-3" />
                                <span>Explain in Chat</span>
                              </Button>

                              <Button
                                size="xs"
                                variant={appliedPatches.has('patch-2') ? 'secondary' : 'default'}
                                className={cn(
                                  'h-7 gap-1 text-xs font-medium shadow-xs',
                                  appliedPatches.has('patch-2') &&
                                    'border-emerald-500/30 font-semibold text-emerald-700 dark:text-emerald-300',
                                )}
                                onClick={() => togglePatch('patch-2')}
                              >
                                {appliedPatches.has('patch-2') ? (
                                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Zap className="size-3" />
                                )}
                                <span>
                                  {appliedPatches.has('patch-2') ? 'Patch Applied ✓' : 'Apply Suggestion (1-Click)'}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: AST Rule Verification Suite */}
            <TabsContent value="rules" className="space-y-4 focus-visible:outline-none">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Rule 1: Zero Global DOM Pollution</span>
                    </div>
                    <Badge wrap variant="success" className="text-xs">
                      Pass · Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Eliminates 20 static opacity custom properties. All transparency channels are evaluated dynamically
                    in OKLab color space.
                  </p>
                </div>

                <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Zap className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Rule 2: Perceptual Uniformity (ΔE &lt; 0.8)</span>
                    </div>
                    <Badge wrap variant="success" className="text-xs">
                      Pass · Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    OKLCH lightness (L) scale provides mathematical linearity. Step changes in lightness feel uniform to
                    human perception across all hues.
                  </p>
                </div>

                <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Cpu className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Rule 3: PostCSS Lightning Fallbacks</span>
                    </div>
                    <Badge wrap variant="success" className="text-xs">
                      Pass · Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Tailwind v4 engine generates automated sRGB fallback values for legacy web clients while streaming
                    raw OKLCH to modern browsers.
                  </p>
                </div>

                <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Rule 4: WCAG 2.2 AAA Contrast Ratios</span>
                    </div>
                    <Badge wrap variant="success" className="text-xs">
                      Pass · 7.1:1 Ratio
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Background to foreground contrast exceeds the 7:1 ratio threshold required for government and
                    enterprise accessible software.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Token Matrix & Gamut Breakdown */}
            <TabsContent value="impact" className="space-y-4 focus-visible:outline-none">
              <div className="border-border overflow-x-auto rounded-lg border">
                <div className="bg-muted/40 border-border max-w-[480px] min-w-full border-b px-4 py-3 text-xs font-semibold">
                  Token Architecture Comparison: Legacy vs. OKLCH Engine
                </div>
                <div className="divide-border max-w-[480px] min-w-full divide-y text-xs">
                  <div className="grid grid-cols-3 p-3 font-medium">
                    <span className="text-muted-foreground">Evaluation Metric</span>
                    <span className="text-muted-foreground">Legacy HSL / sRGB</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">OKLCH Perceptual Engine</span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-medium">Total Token CSS Bundle</span>
                    <span className="text-muted-foreground font-mono">14.8 KB</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">10.6 KB (-28.4%)</span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-medium">DOM Custom Properties</span>
                    <span className="text-muted-foreground font-mono">64 variables</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      44 variables (-31.2%)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-medium">Display P3 Wide Gamut</span>
                    <span className="text-rose-600 dark:text-rose-400">Clipping on 14 colors</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">100% P3 Coverage</span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="font-medium">Perceptual Uniformity</span>
                    <span className="text-muted-foreground">Non-linear (HSL shift)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      Mathematically Uniform (LCH)
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Interactive AI Review Assistant Chat Panel */}
      {isChatOpen && (
        <Card className="border-primary/30 bg-card shadow-md">
          <CardHeader className="border-border border-b pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
                  <Bot className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Glia AI Assistant · PR #{prNumber} Review Thread
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Contextual code review dialogue with active AST parser &amp; contrast engine
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="xs"
                className="size-7 p-0"
                aria-label="Close chat"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            {/* Message History */}
            <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col gap-1 rounded-lg p-3 text-xs',
                    msg.sender === 'ai'
                      ? 'border-border/60 bg-muted/40 mr-8 border'
                      : 'bg-primary/10 text-foreground border-primary/20 ml-8 border',
                  )}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      {msg.sender === 'ai' ? (
                        <Bot className="text-primary size-3.5" />
                      ) : (
                        <Avatar className="size-4 border">
                          <AvatarImage src={authorAvatar} />
                          <AvatarFallback className="text-xs">ER</AvatarFallback>
                        </Avatar>
                      )}
                      <span>{msg.author}</span>
                    </span>
                    <span className="text-muted-foreground text-xs font-normal">{msg.timestamp}</span>
                  </div>
                  <p className="mt-1 leading-relaxed">{msg.text}</p>
                  {msg.codeSnippet && (
                    <div className="border-border/80 bg-muted/80 text-foreground mt-2 rounded p-2 font-mono text-xs select-all">
                      {msg.codeSnippet}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Preset Prompt Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-muted-foreground text-xs">Quick ask:</span>
              <button
                type="button"
                className="border-border bg-muted/40 hover:bg-muted text-foreground cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors"
                onClick={() => openChatWithTopic('Why is OKLab preferred over sRGB color space?')}
              >
                Why OKLab over sRGB?
              </button>
              <button
                type="button"
                className="border-border bg-muted/40 hover:bg-muted text-foreground cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors"
                onClick={() => openChatWithTopic('How does this affect browser performance?')}
              >
                Browser performance impact?
              </button>
            </div>

            {/* Chat Input Field */}
            <form className="flex items-center gap-2 pt-1" onSubmit={handleSendMessage}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                type="text"
                placeholder="Ask Glia AI about this code review or AST transformation..."
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-2 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
              <Button type="submit" size="sm" className="gap-1.5 text-xs">
                <Send className="size-3.5" />
                <span>Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AiCodeReviewAssistant
