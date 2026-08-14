'use client'

import * as React from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Bell,
  BellOff,
  Bold,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  ExternalLink,
  Eye,
  Flag,
  HelpCircle,
  Italic,
  Link2,
  List,
  MessageSquare,
  Plus,
  Quote,
  Share2,
  Sparkles,
  Tag,
  ThumbsUp,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export interface PeerDiscussionForumProps {
  className?: string
}

interface CommunityAnswer {
  id: string
  authorName: string
  authorRole: string
  avatarText: string
  postedTime: string
  score: number
  content: string
  userVote?: 'up' | 'down' | null
}

export function PeerDiscussionForum({ className }: PeerDiscussionForumProps) {
  // Question State
  const [questionScore, setQuestionScore] = React.useState(42)
  const [questionVote, setQuestionVote] = React.useState<'up' | 'down' | null>(null)
  const [isQuestionBookmarked, setIsQuestionBookmarked] = React.useState(false)
  const [isSubscribed, setIsSubscribed] = React.useState(true)
  const [copiedQuestionSnippet, setCopiedQuestionSnippet] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)

  function voteQuestion(type: 'up' | 'down') {
    if (questionVote === type) {
      setQuestionVote(null)
      setQuestionScore((prev) => prev + (type === 'up' ? -1 : 1))
    } else {
      let delta = type === 'up' ? 1 : -1
      if (questionVote === 'up') delta -= 1
      if (questionVote === 'down') delta += 1
      setQuestionVote(type)
      setQuestionScore((prev) => prev + delta)
    }
  }

  // Answer 1 State (Accepted Instructor Answer)
  const [answer1Score, setAnswer1Score] = React.useState(89)
  const [answer1Vote, setAnswer1Vote] = React.useState<'up' | 'down' | null>(null)
  const [isAnswer1Bookmarked, setIsAnswer1Bookmarked] = React.useState(false)
  const [copiedAnswer1Snippet, setCopiedAnswer1Snippet] = React.useState(false)

  function voteAnswer1(type: 'up' | 'down') {
    if (answer1Vote === type) {
      setAnswer1Vote(null)
      setAnswer1Score((prev) => prev + (type === 'up' ? -1 : 1))
    } else {
      let delta = type === 'up' ? 1 : -1
      if (answer1Vote === 'up') delta -= 1
      if (answer1Vote === 'down') delta += 1
      setAnswer1Vote(type)
      setAnswer1Score((prev) => prev + delta)
    }
  }

  // Answer 2 State (Peer Response)
  const [answer2Score, setAnswer2Score] = React.useState(14)
  const [answer2Vote, setAnswer2Vote] = React.useState<'up' | 'down' | null>(null)
  const [isAnswer2Bookmarked, setIsAnswer2Bookmarked] = React.useState(false)

  function voteAnswer2(type: 'up' | 'down') {
    if (answer2Vote === type) {
      setAnswer2Vote(null)
      setAnswer2Score((prev) => prev + (type === 'up' ? -1 : 1))
    } else {
      let delta = type === 'up' ? 1 : -1
      if (answer2Vote === 'up') delta -= 1
      if (answer2Vote === 'down') delta += 1
      setAnswer2Vote(type)
      setAnswer2Score((prev) => prev + delta)
    }
  }

  // Composer & Dynamic Answers State
  const [replyDraft, setReplyDraft] = React.useState('')
  const [customAnswers, setCustomAnswers] = React.useState<CommunityAnswer[]>([])

  function applyFormat(type: 'bold' | 'italic' | 'code' | 'link' | 'list' | 'quote') {
    if (type === 'bold') {
      setReplyDraft((prev) => (prev ? `${prev} **bold text**` : '**bold text**'))
    } else if (type === 'italic') {
      setReplyDraft((prev) => (prev ? `${prev} *italic text*` : '*italic text*'))
    } else if (type === 'code') {
      setReplyDraft((prev) =>
        prev ? `${prev}\n\`\`\`ts\n// your code snippet here\n\`\`\`\n` : '```ts\n// your code snippet here\n```\n',
      )
    } else if (type === 'link') {
      setReplyDraft((prev) =>
        prev ? `${prev} [link title](https://example.com)` : '[link title](https://example.com)',
      )
    } else if (type === 'list') {
      setReplyDraft((prev) => (prev ? `${prev}\n- Key insight 1\n- Key insight 2` : '- Key insight 1\n- Key insight 2'))
    } else if (type === 'quote') {
      setReplyDraft((prev) => (prev ? `${prev}\n> Quote from documentation` : '> Quote from documentation'))
    }
  }

  function handlePostAnswer() {
    const text = replyDraft.trim()
    if (!text) return
    const newAnswer: CommunityAnswer = {
      id: `ans-${Date.now()}`,
      authorName: 'Alex Rivera',
      authorRole: 'Peer Student',
      avatarText: 'AR',
      postedTime: 'Just now',
      score: 1,
      content: text,
      userVote: 'up',
    }
    setCustomAnswers((prev) => [...prev, newAnswer])
    setReplyDraft('')
  }

  function voteCustomAnswer(id: string, type: 'up' | 'down') {
    setCustomAnswers((prev) =>
      prev.map((ans) => {
        if (ans.id !== id) return ans
        if (ans.userVote === type) {
          return {
            ...ans,
            userVote: null,
            score: ans.score + (type === 'up' ? -1 : 1),
          }
        }
        let delta = type === 'up' ? 1 : -1
        if (ans.userVote === 'up') delta -= 1
        if (ans.userVote === 'down') delta += 1
        return {
          ...ans,
          userVote: type,
          score: ans.score + delta,
        }
      }),
    )
  }

  function copyQuestionCode() {
    setCopiedQuestionSnippet(true)
    setTimeout(() => {
      setCopiedQuestionSnippet(false)
    }, 2000)
  }

  function copyAnswer1Code() {
    setCopiedAnswer1Snippet(true)
    setTimeout(() => {
      setCopiedAnswer1Snippet(false)
    }, 2000)
  }

  function shareThread() {
    setCopiedLink(true)
    setTimeout(() => {
      setCopiedLink(false)
    }, 2000)
  }

  const totalAnswersCount = 2 + customAnswers.length

  return (
    <div data-slot="peer-discussion-forum" className={cn('bg-background text-foreground w-full space-y-6', className)}>
      {/* Top Navigation & Breadcrumb Header */}
      <header className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Breadcrumb & Top Action */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
              <span>CS-314 Advanced Frontend Architecture</span>
              <span className="text-border">/</span>
              <span>Discussions</span>
              <span className="text-border">/</span>
              <span className="text-foreground font-mono font-medium">#DISC-2048</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={shareThread}>
                <Share2 className="size-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Thread'}</span>
              </Button>
              <Button size="sm" className="gap-1.5 text-xs font-medium">
                <Plus className="size-3.5" />
                Ask Question
              </Button>
            </div>
          </div>

          {/* Thread Title & Status Row */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Solved · 1 Accepted Answer
              </Badge>
              <Badge variant="secondary" className="text-xs font-medium">
                Vue 3.5 &amp; Vite
              </Badge>
            </div>

            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              How to properly avoid circular dependencies in Vue 3.5 SFC variants with CVA?
            </h1>

            {/* Tags List */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors">
                <Tag className="text-muted-foreground size-3" />
                #architecture
              </span>
              <span className="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors">
                <Tag className="text-muted-foreground size-3" />
                #reka-ui
              </span>
              <span className="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors">
                <Tag className="text-muted-foreground size-3" />
                #typescript
              </span>
              <span className="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors">
                <Tag className="text-muted-foreground size-3" />
                #cva
              </span>
            </div>
          </div>

          <Separator />

          {/* Metadata Strip */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <div>
              <span>Asked </span>
              <strong className="text-foreground font-medium">2 days ago</strong>
            </div>
            <div>
              <span>Modified </span>
              <strong className="text-foreground font-medium">18 hours ago</strong>
            </div>
            <div>
              <span>Viewed </span>
              <strong className="text-foreground font-medium tabular-nums">1,420 times</strong>
            </div>
            <div>
              <span>Module </span>
              <strong className="text-foreground font-medium">Component Registry Architecture</strong>
            </div>
          </div>
        </div>
      </header>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Discussion Thread & Answers (8 cols) */}
        <main className="space-y-6 lg:col-span-8">
          {/* Question Post Card */}
          <article className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Upvote / Downvote Counter Widget */}
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'size-9 rounded-lg border transition-colors',
                    questionVote === 'up'
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Upvote question"
                  onClick={() => voteQuestion('up')}
                >
                  <ChevronUp className="size-5" />
                </Button>
                <span className="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                  {questionScore}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'size-9 rounded-lg border transition-colors',
                    questionVote === 'down'
                      ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Downvote question"
                  onClick={() => voteQuestion('down')}
                >
                  <ChevronDown className="size-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'mt-3 size-8 rounded-md transition-colors',
                    isQuestionBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Bookmark question"
                  onClick={() => setIsQuestionBookmarked(!isQuestionBookmarked)}
                >
                  <Bookmark className={cn('size-4', isQuestionBookmarked && 'fill-current')} />
                </Button>
              </div>

              {/* Question Body & Author Meta */}
              <div className="min-w-0 flex-1 space-y-4">
                {/* Author Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">DC</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold">David Chen</span>
                        <Badge variant="secondary" className="text-xs font-normal">
                          Student
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">Posted 2 days ago · Oct 22, 2026 at 14:32</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('h-7 gap-1.5 text-xs', isSubscribed ? 'text-primary' : 'text-muted-foreground')}
                    onClick={() => setIsSubscribed(!isSubscribed)}
                  >
                    {isSubscribed ? <Bell className="size-3.5" /> : <BellOff className="size-3.5" />}
                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                  </Button>
                </div>

                {/* Problem Narrative Prose */}
                <div className="text-foreground/90 space-y-3.5 text-sm leading-relaxed">
                  <p>
                    While implementing unbundled UI primitives for our course project using Vue 3.5, TypeScript, and{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      class-variance-authority
                    </code>
                    , we ran into a perplexing runtime error during dev SSR and fast refresh:
                  </p>

                  <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3.5 py-2.5 font-mono text-xs dark:text-red-400">
                    TypeError: $setup.buttonVariants is not a function at Button.vue:24
                  </div>

                  <p>
                    Our initial project structure placed both the component export and the CVA variant definition in the
                    same barrel file:
                  </p>

                  {/* Problem Code Snippet Block */}
                  <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <Code className="size-3.5 text-amber-400" />
                        <span className="font-mono text-xs">components/ui/button/index.ts (Problematic Barrel)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                        onClick={copyQuestionCode}
                      >
                        {copiedQuestionSnippet ? (
                          <Check className="size-3 text-emerald-400" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                        {copiedQuestionSnippet ? 'Copied' : 'Copy code'}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
                      <code>
                        <span className="text-zinc-500">
                          // ❌ Circular dependency: index.ts re-exports Button.vue, while Button.vue imports
                          buttonVariants from index.ts
                        </span>
                        {'\n'}
                        <span className="text-purple-400">import</span> {'{'} cva {'}'}{' '}
                        <span className="text-purple-400">from</span>{' '}
                        <span className="text-emerald-300">&apos;class-variance-authority&apos;</span>
                        {'\n\n'}
                        <span className="text-purple-400">export</span> {'{'}{' '}
                        <span className="text-purple-400">default</span> <span className="text-purple-400">as</span>{' '}
                        Button {'}'} <span className="text-purple-400">from</span>{' '}
                        <span className="text-emerald-300">&apos;./Button.vue&apos;</span>
                        {'\n\n'}
                        <span className="text-purple-400">export</span> <span className="text-blue-400">const</span>{' '}
                        buttonVariants = <span className="text-yellow-300">cva</span>({'\n'}{' '}
                        <span className="text-emerald-300">
                          &apos;inline-flex items-center justify-center font-medium transition-colors&apos;
                        </span>
                        ,{'\n'} {'{'}
                        {'\n'} variants: {'{'}
                        {'\n'} variant: {'{'}
                        {'\n'} default:{' '}
                        <span className="text-emerald-300">
                          &apos;bg-primary text-primary-foreground shadow-xs&apos;
                        </span>
                        ,{'\n'} outline:{' '}
                        <span className="text-emerald-300">
                          &apos;border border-input bg-background hover:bg-accent&apos;
                        </span>
                        ,{'\n'} {'}'},{'\n'} {'}'},{'\n'} {'}'}
                        {'\n'})
                      </code>
                    </pre>
                  </div>

                  <p>
                    Because{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">Button.vue</code>{' '}
                    imports{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      buttonVariants
                    </code>{' '}
                    from{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">./index.ts</code>
                    , Vite evaluates the module in a cycle where the variant function binding is uninitialized during
                    the Vue SFC component setup.
                  </p>
                  <p>
                    What is the canonical architecture pattern to cleanly break this circular import while maintaining
                    convenient barrel exports for consumers?
                  </p>
                </div>

                {/* Question Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-8 gap-1.5 text-xs"
                      onClick={shareThread}
                    >
                      <Share2 className="size-3.5" />
                      <span>Share</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-8 gap-1.5 text-xs">
                      <Flag className="size-3.5" />
                      <span>Report</span>
                    </Button>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <Eye className="size-3.5" />
                    <span className="tabular-nums">1.4k views</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Answers Section Header */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">{totalAnswersCount} Answers</h2>
            <span className="text-muted-foreground text-xs">
              Sorted by: <strong className="text-foreground font-medium">Highest score</strong>
            </span>
          </div>

          {/* Answer 1: Accepted Instructor Answer */}
          <article className="bg-card relative overflow-hidden rounded-xl border border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20">
            {/* Accepted Solution Top Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Accepted by Author · Verified Solution</span>
              </div>
              <Badge className="bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-600">
                Instructor Solution
              </Badge>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Upvote Widget with Checkmark Badge */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      'size-9 rounded-lg border transition-colors',
                      answer1Vote === 'up'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    aria-label="Upvote answer"
                    onClick={() => voteAnswer1('up')}
                  >
                    <ChevronUp className="size-5" />
                  </Button>
                  <span className="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                    {answer1Score}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      'size-9 rounded-lg border transition-colors',
                      answer1Vote === 'down'
                        ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    aria-label="Downvote answer"
                    onClick={() => voteAnswer1('down')}
                  >
                    <ChevronDown className="size-5" />
                  </Button>

                  {/* Accepted Checkmark Pill */}
                  <div
                    className="mt-3 flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    title="Accepted solution"
                  >
                    <Check className="size-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* Answer Body */}
                <div className="min-w-0 flex-1 space-y-4">
                  {/* Author Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border border-emerald-500/30">
                        <AvatarFallback className="bg-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          MV
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-sm font-semibold">Marcus Vance</span>
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300"
                          >
                            Course Instructor
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Staff
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">Answered 1 day ago · Edited 18h ago</p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-7 gap-1 text-xs"
                      onClick={() => setIsAnswer1Bookmarked(!isAnswer1Bookmarked)}
                    >
                      <Bookmark className={cn('size-3.5', isAnswer1Bookmarked && 'fill-primary text-primary')} />
                      <span>{isAnswer1Bookmarked ? 'Saved' : 'Save'}</span>
                    </Button>
                  </div>

                  {/* Solution Content Prose */}
                  <div className="text-foreground/90 space-y-3.5 text-sm leading-relaxed">
                    <p>
                      Great question, David. This is one of the most frequent traps when building unbundled component
                      registries with Vue 3.5 and Vite.
                    </p>
                    <p>
                      The Vue SFC compiler compiles{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        &lt;script setup&gt;
                      </code>{' '}
                      into a self-contained ES module execution wrapper. When{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        Button.vue
                      </code>{' '}
                      imports from{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        ./index.ts
                      </code>
                      , and{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">index.ts</code>{' '}
                      simultaneously imports{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        Button.vue
                      </code>
                      , JavaScript enters a Temporal Dead Zone (TDZ) for the uninitialized{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        buttonVariants
                      </code>{' '}
                      export.
                    </p>

                    <h3 className="text-foreground text-sm font-semibold tracking-tight">
                      The Solution: Three-File Sidecar Architecture
                    </h3>

                    <p>
                      To completely eliminate cyclic dependencies and ensure 100% reliable SSR and Vite HMR, extract all
                      CVA definitions into a dedicated{' '}
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        &lt;name&gt;.variants.ts
                      </code>{' '}
                      file:
                    </p>

                    {/* Solution Code Snippet 1 */}
                    <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Code className="size-3.5 text-emerald-400" />
                          <span className="font-mono text-xs">components/ui/button/button.variants.ts</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                          onClick={copyAnswer1Code}
                        >
                          {copiedAnswer1Snippet ? (
                            <Check className="size-3 text-emerald-400" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                          {copiedAnswer1Snippet ? 'Copied' : 'Copy code'}
                        </Button>
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
                        <code>
                          <span className="text-purple-400">import</span> {'{'} cva,{' '}
                          <span className="text-purple-400">type</span> VariantProps {'}'}{' '}
                          <span className="text-purple-400">from</span>{' '}
                          <span className="text-emerald-300">&apos;class-variance-authority&apos;</span>
                          {'\n\n'}
                          <span className="text-purple-400">export</span> <span className="text-blue-400">const</span>{' '}
                          buttonVariants = <span className="text-yellow-300">cva</span>({'\n'}{' '}
                          <span className="text-emerald-300">
                            &apos;inline-flex items-center justify-center rounded-md font-medium transition-colors
                            focus-visible:ring-2 focus-visible:outline-none&apos;
                          </span>
                          ,{'\n'} {'{'}
                          {'\n'} variants: {'{'}
                          {'\n'} variant: {'{'}
                          {'\n'} default:{' '}
                          <span className="text-emerald-300">
                            &apos;bg-primary text-primary-foreground shadow-xs hover:bg-primary/90&apos;
                          </span>
                          ,{'\n'} secondary:{' '}
                          <span className="text-emerald-300">
                            &apos;bg-secondary text-secondary-foreground hover:bg-secondary/80&apos;
                          </span>
                          ,{'\n'} outline:{' '}
                          <span className="text-emerald-300">
                            &apos;border border-input bg-background hover:bg-accent hover:text-accent-foreground&apos;
                          </span>
                          ,{'\n'} destructive:{' '}
                          <span className="text-emerald-300">
                            &apos;bg-destructive text-destructive-foreground hover:bg-destructive/90&apos;
                          </span>
                          ,{'\n'} {'}'},{'\n'} size: {'{'}
                          {'\n'} default: <span className="text-emerald-300">&apos;h-9 px-4 py-2 text-sm&apos;</span>,
                          {'\n'} sm: <span className="text-emerald-300">&apos;h-8 px-3 text-xs rounded-md&apos;</span>,
                          {'\n'} lg:{' '}
                          <span className="text-emerald-300">&apos;h-10 px-8 text-base rounded-md&apos;</span>,{'\n'}{' '}
                          {'}'},{'\n'} {'}'},{'\n'} defaultVariants: {'{'}
                          {'\n'} variant: <span className="text-emerald-300">&apos;default&apos;</span>,{'\n'} size:{' '}
                          <span className="text-emerald-300">&apos;default&apos;</span>,{'\n'} {'}'},{'\n'} {'}'}
                          {'\n'}){'\n\n'}
                          <span className="text-purple-400">export</span> <span className="text-purple-400">type</span>{' '}
                          ButtonVariants = <span className="text-yellow-300">VariantProps</span>&lt;
                          <span className="text-purple-400">typeof</span> buttonVariants&gt;
                        </code>
                      </pre>
                    </div>

                    {/* Companion Barrel & SFC Snippet */}
                    <div className="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Code className="size-3.5 text-blue-400" />
                          <span className="font-mono text-xs">components/ui/button/index.ts &amp; Button.vue</span>
                        </div>
                      </div>
                      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
                        <code>
                          <span className="text-zinc-500">// index.ts — Clean consumer re-exports</span>
                          {'\n'}
                          <span className="text-purple-400">export</span> {'{'}{' '}
                          <span className="text-purple-400">default</span> <span className="text-purple-400">as</span>{' '}
                          Button {'}'} <span className="text-purple-400">from</span>{' '}
                          <span className="text-emerald-300">&apos;./Button.vue&apos;</span>
                          {'\n'}
                          <span className="text-purple-400">export</span> {'{'} buttonVariants,{' '}
                          <span className="text-purple-400">type</span> ButtonVariants {'}'}{' '}
                          <span className="text-purple-400">from</span>{' '}
                          <span className="text-emerald-300">&apos;./button.variants&apos;</span>
                          {'\n\n'}
                          <span className="text-zinc-500">// In Button.vue &lt;script setup lang="ts"&gt;</span>
                          {'\n'}
                          <span className="text-purple-400">import</span> {'{'} buttonVariants,{' '}
                          <span className="text-purple-400">type</span> ButtonVariants {'}'}{' '}
                          <span className="text-purple-400">from</span>{' '}
                          <span className="text-emerald-300">&apos;./button.variants&apos;</span>{' '}
                          <span className="text-zinc-500">// ✅ Direct sibling import</span>
                        </code>
                      </pre>
                    </div>

                    <ul className="list-inside list-disc space-y-1.5 pl-1 text-xs sm:text-sm">
                      <li>
                        <strong>Acyclic Dependency Graph:</strong>{' '}
                        <code className="bg-muted text-foreground rounded px-1 font-mono text-xs">Button.vue</code>{' '}
                        imports strictly from{' '}
                        <code className="bg-muted text-foreground rounded px-1 font-mono text-xs">
                          ./button.variants
                        </code>
                        .
                      </li>
                      <li>
                        <strong>Tree-Shakable:</strong> Consumers can import just the variant generator without mounting
                        the Vue SFC component instance.
                      </li>
                      <li>
                        <strong>Cross-Framework Ready:</strong> The variant file is pure TypeScript, making it 100%
                        shareable across Vue and React registry packages.
                      </li>
                    </ul>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1.5 text-xs"
                        onClick={() => voteAnswer1('up')}
                      >
                        <ThumbsUp className="size-3" />
                        <span>Helpful ({answer1Score})</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground h-7 gap-1.5 text-xs"
                        onClick={shareThread}
                      >
                        <Share2 className="size-3" />
                        <span>Share</span>
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-xs">89 students found this helpful</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Answer 2: Peer Response */}
          <article className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Upvote Widget */}
              <div className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'size-9 rounded-lg border transition-colors',
                    answer2Vote === 'up'
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Upvote answer"
                  onClick={() => voteAnswer2('up')}
                >
                  <ChevronUp className="size-5" />
                </Button>
                <span className="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                  {answer2Score}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    'size-9 rounded-lg border transition-colors',
                    answer2Vote === 'down'
                      ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Downvote answer"
                  onClick={() => voteAnswer2('down')}
                >
                  <ChevronDown className="size-5" />
                </Button>
              </div>

              {/* Answer Body */}
              <div className="min-w-0 flex-1 space-y-4">
                {/* Author Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border">
                      <AvatarFallback className="bg-blue-500/20 text-xs font-semibold text-blue-800 dark:text-blue-300">
                        SL
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold">Sophia Lin</span>
                        <Badge variant="secondary" className="text-xs font-normal">
                          Teaching Assistant
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">Answered 2 days ago · Oct 22, 2026 at 18:40</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-7 gap-1 text-xs"
                    onClick={() => setIsAnswer2Bookmarked(!isAnswer2Bookmarked)}
                  >
                    <Bookmark className={cn('size-3.5', isAnswer2Bookmarked && 'fill-primary text-primary')} />
                    <span>{isAnswer2Bookmarked ? 'Saved' : 'Save'}</span>
                  </Button>
                </div>

                {/* Content Prose */}
                <div className="text-foreground/90 space-y-3 text-sm leading-relaxed">
                  <p>
                    Adding to Marcus&apos;s answer: another huge benefit of isolating{' '}
                    <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      &lt;name&gt;.variants.ts
                    </code>{' '}
                    is for monorepos or dual-framework setups.
                  </p>
                  <p>
                    When you have both Vue and React registry components (like in UIPKGE), the variant definitions can
                    be shared verbatim in a shared token package without bringing in any Vue SFC or JSX compiler
                    dependencies. This keeps design tokens consistent across both stacks.
                  </p>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                      onClick={() => voteAnswer2('up')}
                    >
                      <ThumbsUp className="size-3" />
                      <span>Helpful ({answer2Score})</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-7 gap-1.5 text-xs"
                      onClick={shareThread}
                    >
                      <Share2 className="size-3" />
                      <span>Share</span>
                    </Button>
                  </div>
                  <span className="text-muted-foreground text-xs">14 students found this helpful</span>
                </div>
              </div>
            </div>
          </article>

          {/* Dynamic User Submitted Answers */}
          {customAnswers.map((ans) => (
            <article key={ans.id} className="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Upvote Widget */}
                <div className="flex flex-col items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      'size-9 rounded-lg border transition-colors',
                      ans.userVote === 'up'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    aria-label="Upvote answer"
                    onClick={() => voteCustomAnswer(ans.id, 'up')}
                  >
                    <ChevronUp className="size-5" />
                  </Button>
                  <span className="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">{ans.score}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                      'size-9 rounded-lg border transition-colors',
                      ans.userVote === 'down'
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    aria-label="Downvote answer"
                    onClick={() => voteCustomAnswer(ans.id, 'down')}
                  >
                    <ChevronDown className="size-5" />
                  </Button>
                </div>

                {/* Answer Body */}
                <div className="min-w-0 flex-1 space-y-4">
                  {/* Author Header */}
                  <div className="flex items-center justify-between border-b pb-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {ans.avatarText}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-sm font-semibold">{ans.authorName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {ans.authorRole}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">{ans.postedTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Prose */}
                  <div className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">{ans.content}</div>
                </div>
              </div>
            </article>
          ))}

          {/* Reply / Answer Composer */}
          <section className="bg-card overflow-hidden rounded-xl border shadow-xs">
            <div className="bg-muted/40 border-b px-5 py-3">
              <h3 className="text-foreground text-base font-bold tracking-tight">Post Your Answer</h3>
              <p className="text-muted-foreground text-xs">
                Provide thorough explanations, actionable code examples, and reference architectural best practices.
              </p>
            </div>

            <div className="space-y-3.5 p-5">
              {/* Formatting Toolbar */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-1 border-b pb-2.5">
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
                  onClick={() => applyFormat('italic')}
                >
                  <Italic className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Insert code block"
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Insert list"
                  onClick={() => applyFormat('list')}
                >
                  <List className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Insert blockquote"
                  onClick={() => applyFormat('quote')}
                >
                  <Quote className="size-3.5" />
                </Button>
                <span className="text-muted-foreground ml-auto text-xs">Markdown syntax supported</span>
              </div>

              {/* Rich Textarea */}
              <Textarea
                value={replyDraft}
                onValueChange={(v) => setReplyDraft(v)}
                placeholder="Write your detailed answer with code blocks (e.g. ```ts ... ```)..."
                rows={6}
                className="resize-y font-sans text-sm"
              />

              {/* Post Button & Guidelines */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-muted-foreground text-xs">
                  Draft saved automatically · Be constructive &amp; cite official docs
                </span>
                <Button
                  className="gap-1.5 text-xs font-semibold"
                  disabled={!replyDraft.trim()}
                  onClick={handlePostAnswer}
                >
                  <MessageSquare className="size-3.5" />
                  Post Your Answer
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* Right Column: Sidebar Metadata & Related Discussions (4 cols) */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Thread Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Discussion Info</CardTitle>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                >
                  Resolved
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Separator />
              <dl className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Course</dt>
                  <dd className="text-foreground font-medium">CS-314 Frontend Arch</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="text-foreground font-medium">Vue 3.5 &amp; Vite</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Total Upvotes</dt>
                  <dd className="text-foreground font-medium tabular-nums">+145 upvotes</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Total Views</dt>
                  <dd className="text-foreground font-medium tabular-nums">1,420</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Participants</dt>
                  <dd className="text-foreground font-medium">4 contributors</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Accepted By</dt>
                  <dd className="text-foreground font-medium">David Chen (Author)</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Related Questions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Related Discussions</CardTitle>
              <CardDescription className="text-xs">Similar questions from this course cohort</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Separator />
              <ul className="space-y-3 text-xs">
                <li className="space-y-1">
                  <a
                    href="#"
                    className="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                  >
                    <span>How to type polymorphic asChild props with Reka UI in Vue 3.5?</span>
                    <ArrowUpRight className="text-muted-foreground size-3.5 shrink-0" />
                  </a>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Solved
                    </span>
                    <span className="tabular-nums">38 upvotes</span>
                    <span>· 4 answers</span>
                  </div>
                </li>

                <Separator />

                <li className="space-y-1">
                  <a
                    href="#"
                    className="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                  >
                    <span>Configuring OKLCH Tailwind v4 themes with Nuxt 4</span>
                    <ArrowUpRight className="text-muted-foreground size-3.5 shrink-0" />
                  </a>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Solved
                    </span>
                    <span className="tabular-nums">24 upvotes</span>
                    <span>· 2 answers</span>
                  </div>
                </li>

                <Separator />

                <li className="space-y-1">
                  <a
                    href="#"
                    className="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                  >
                    <span>Best practices for CVA compoundVariants in TypeScript</span>
                    <ArrowUpRight className="text-muted-foreground size-3.5 shrink-0" />
                  </a>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span className="bg-muted text-foreground rounded px-1.5 py-0.5 text-xs font-medium">Open</span>
                    <span className="tabular-nums">19 upvotes</span>
                    <span>· 1 answer</span>
                  </div>
                </li>

                <Separator />

                <li className="space-y-1">
                  <a
                    href="#"
                    className="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                  >
                    <span>Hydration mismatches with client-side theme switchers in Astro SSG</span>
                    <ArrowUpRight className="text-muted-foreground size-3.5 shrink-0" />
                  </a>
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      Solved
                    </span>
                    <span className="tabular-nums">52 upvotes</span>
                    <span>· 6 answers</span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* EdStem Forum Guidelines Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold">Forum Etiquette</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0 text-xs">
              <Separator />
              <div className="text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
                  <span>Isolate reproducible snippets using [name].variants.ts patterns.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
                  <span>Search existing questions before posting duplicate topics.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="text-primary mt-0.5 size-3.5 shrink-0" />
                  <span>Mark the accepted solution once your issue is verified.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default PeerDiscussionForum
