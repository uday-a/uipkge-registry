<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  ArrowUpRight,
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
  Eye,
  Flag,
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

// Question State
const questionScore = ref(42)
const questionVote = ref<'up' | 'down' | null>(null)
const isQuestionBookmarked = ref(false)
const isSubscribed = ref(true)
const copiedQuestionSnippet = ref(false)
const copiedLink = ref(false)

function voteQuestion(type: 'up' | 'down') {
  if (questionVote.value === type) {
    questionVote.value = null
    questionScore.value += type === 'up' ? -1 : 1
  } else {
    if (questionVote.value === 'up') questionScore.value -= 1
    if (questionVote.value === 'down') questionScore.value += 1
    questionVote.value = type
    questionScore.value += type === 'up' ? 1 : -1
  }
}

// Answer 1 State (Accepted Instructor Answer)
const answer1Score = ref(89)
const answer1Vote = ref<'up' | 'down' | null>(null)
const isAnswer1Bookmarked = ref(false)
const copiedAnswer1Snippet = ref(false)

function voteAnswer1(type: 'up' | 'down') {
  if (answer1Vote.value === type) {
    answer1Vote.value = null
    answer1Score.value += type === 'up' ? -1 : 1
  } else {
    if (answer1Vote.value === 'up') answer1Score.value -= 1
    if (answer1Vote.value === 'down') answer1Score.value += 1
    answer1Vote.value = type
    answer1Score.value += type === 'up' ? 1 : -1
  }
}

// Answer 2 State (Peer Response)
const answer2Score = ref(14)
const answer2Vote = ref<'up' | 'down' | null>(null)
const isAnswer2Bookmarked = ref(false)

function voteAnswer2(type: 'up' | 'down') {
  if (answer2Vote.value === type) {
    answer2Vote.value = null
    answer2Score.value += type === 'up' ? -1 : 1
  } else {
    if (answer2Vote.value === 'up') answer2Score.value -= 1
    if (answer2Vote.value === 'down') answer2Score.value += 1
    answer2Vote.value = type
    answer2Score.value += type === 'up' ? 1 : -1
  }
}

// Dynamic Answers
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

const customAnswers = ref<CommunityAnswer[]>([])
const replyDraft = ref('')

function applyFormat(type: 'bold' | 'italic' | 'code' | 'link' | 'list' | 'quote') {
  if (type === 'bold') {
    replyDraft.value = replyDraft.value ? `${replyDraft.value} **bold text**` : '**bold text**'
  } else if (type === 'italic') {
    replyDraft.value = replyDraft.value ? `${replyDraft.value} *italic text*` : '*italic text*'
  } else if (type === 'code') {
    replyDraft.value = replyDraft.value
      ? `${replyDraft.value}\n\`\`\`ts\n// your code snippet here\n\`\`\`\n`
      : '```ts\n// your code snippet here\n```\n'
  } else if (type === 'link') {
    replyDraft.value = replyDraft.value
      ? `${replyDraft.value} [link title](https://example.com)`
      : '[link title](https://example.com)'
  } else if (type === 'list') {
    replyDraft.value = replyDraft.value
      ? `${replyDraft.value}\n- Key insight 1\n- Key insight 2`
      : '- Key insight 1\n- Key insight 2'
  } else if (type === 'quote') {
    replyDraft.value = replyDraft.value
      ? `${replyDraft.value}\n> Quote from documentation`
      : '> Quote from documentation'
  }
}

function handlePostAnswer() {
  const text = replyDraft.value.trim()
  if (!text) return
  customAnswers.value.push({
    id: `ans-${Date.now()}`,
    authorName: 'Alex Rivera',
    authorRole: 'Peer Student',
    avatarText: 'AR',
    postedTime: 'Just now',
    score: 1,
    content: text,
    userVote: 'up',
  })
  replyDraft.value = ''
}

function voteCustomAnswer(ans: CommunityAnswer, type: 'up' | 'down') {
  if (ans.userVote === type) {
    ans.userVote = null
    ans.score += type === 'up' ? -1 : 1
  } else {
    if (ans.userVote === 'up') ans.score -= 1
    if (ans.userVote === 'down') ans.score += 1
    ans.userVote = type
    ans.score += type === 'up' ? 1 : -1
  }
}

function copyQuestionCode() {
  copiedQuestionSnippet.value = true
  setTimeout(() => {
    copiedQuestionSnippet.value = false
  }, 2000)
}

function copyAnswer1Code() {
  copiedAnswer1Snippet.value = true
  setTimeout(() => {
    copiedAnswer1Snippet.value = false
  }, 2000)
}

function shareThread() {
  copiedLink.value = true
  setTimeout(() => {
    copiedLink.value = false
  }, 2000)
}

const totalAnswersCount = computed(() => 2 + customAnswers.value.length)
</script>

<template>
  <div data-slot="peer-discussion-forum" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Top Navigation & Breadcrumb Header -->
    <header class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4">
        <!-- Breadcrumb & Top Action -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
            <span>CS-314 Advanced Frontend Architecture</span>
            <span class="text-border">/</span>
            <span>Discussions</span>
            <span class="text-border">/</span>
            <span class="text-foreground font-mono font-medium">#DISC-2048</span>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium" @click="shareThread">
              <Share2 class="size-3.5" />
              <span>{{ copiedLink ? 'Link Copied!' : 'Share Thread' }}</span>
            </Button>
            <Button size="sm" class="gap-1.5 text-xs font-medium">
              <Plus class="size-3.5" />
              Ask Question
            </Button>
          </div>
        </div>

        <!-- Thread Title & Status Row -->
        <div class="space-y-2.5">
          <div class="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              class="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-3.5 text-emerald-600 dark:text-emerald-400" />
              Solved · 1 Accepted Answer
            </Badge>
            <Badge variant="secondary" class="text-xs font-medium"> Vue 3.5 & Vite </Badge>
          </div>

          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            How to properly avoid circular dependencies in Vue 3.5 SFC variants with CVA?
          </h1>

          <!-- Tags List -->
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span
              class="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
            >
              <Tag class="text-muted-foreground size-3" />
              #architecture
            </span>
            <span
              class="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
            >
              <Tag class="text-muted-foreground size-3" />
              #reka-ui
            </span>
            <span
              class="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
            >
              <Tag class="text-muted-foreground size-3" />
              #typescript
            </span>
            <span
              class="bg-muted/70 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
            >
              <Tag class="text-muted-foreground size-3" />
              #cva
            </span>
          </div>
        </div>

        <Separator />

        <!-- Metadata Strip -->
        <div class="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
          <div>
            <span>Asked </span>
            <strong class="text-foreground font-medium">2 days ago</strong>
          </div>
          <div>
            <span>Modified </span>
            <strong class="text-foreground font-medium">18 hours ago</strong>
          </div>
          <div>
            <span>Viewed </span>
            <strong class="text-foreground font-medium tabular-nums">1,420 times</strong>
          </div>
          <div>
            <span>Module </span>
            <strong class="text-foreground font-medium">Component Registry Architecture</strong>
          </div>
        </div>
      </div>
    </header>

    <!-- 2-Column Main Workspace -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Discussion Thread & Answers (8 cols) -->
      <main class="space-y-6 lg:col-span-8">
        <!-- Question Post Card -->
        <article class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
          <div class="flex items-start gap-4 sm:gap-6">
            <!-- Upvote / Downvote Counter Widget -->
            <div class="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                :class="[
                  'size-9 rounded-lg border transition-colors',
                  questionVote === 'up'
                    ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Upvote question"
                @click="voteQuestion('up')"
              >
                <ChevronUp class="size-5" />
              </Button>
              <span class="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                {{ questionScore }}
              </span>
              <Button
                variant="outline"
                size="icon"
                :class="[
                  'size-9 rounded-lg border transition-colors',
                  questionVote === 'down'
                    ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Downvote question"
                @click="voteQuestion('down')"
              >
                <ChevronDown class="size-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                :class="[
                  'mt-3 size-8 rounded-md transition-colors',
                  isQuestionBookmarked ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Bookmark question"
                @click="isQuestionBookmarked = !isQuestionBookmarked"
              >
                <Bookmark class="size-4" :class="isQuestionBookmarked ? 'fill-current' : ''" />
              </Button>
            </div>

            <!-- Question Body & Author Meta -->
            <div class="min-w-0 flex-1 space-y-4">
              <!-- Author Header -->
              <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
                <div class="flex items-center gap-3">
                  <Avatar class="size-10 border">
                    <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">DC</AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-sm font-semibold">David Chen</span>
                      <Badge variant="secondary" class="text-xs font-normal">Student</Badge>
                    </div>
                    <p class="text-muted-foreground text-xs">Posted 2 days ago · Oct 22, 2026 at 14:32</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  :class="['h-7 gap-1.5 text-xs', isSubscribed ? 'text-primary' : 'text-muted-foreground']"
                  @click="isSubscribed = !isSubscribed"
                >
                  <Bell v-if="isSubscribed" class="size-3.5" />
                  <BellOff v-else class="size-3.5" />
                  <span>{{ isSubscribed ? 'Subscribed' : 'Subscribe' }}</span>
                </Button>
              </div>

              <!-- Problem Narrative Prose -->
              <div class="text-foreground/90 space-y-3.5 text-sm leading-relaxed">
                <p>
                  While implementing unbundled UI primitives for our course project using Vue 3.5, TypeScript, and
                  <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                    >class-variance-authority</code
                  >, we ran into a perplexing runtime error during dev SSR and fast refresh:
                </p>

                <div
                  class="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3.5 py-2.5 font-mono text-xs dark:text-red-400"
                >
                  TypeError: $setup.buttonVariants is not a function at Button.vue:24
                </div>

                <p>
                  Our initial project structure placed both the component export and the CVA variant definition in the
                  same barrel file:
                </p>

                <!-- Problem Code Snippet Block -->
                <div class="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                  <div
                    class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400"
                  >
                    <div class="flex items-center gap-2">
                      <Code class="size-3.5 text-amber-400" />
                      <span class="font-mono text-xs">components/ui/button/index.ts (Problematic Barrel)</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                      @click="copyQuestionCode"
                    >
                      <Check v-if="copiedQuestionSnippet" class="size-3 text-emerald-400" />
                      <Copy v-else class="size-3" />
                      {{ copiedQuestionSnippet ? 'Copied' : 'Copy code' }}
                    </Button>
                  </div>
                  <pre
                    class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300"
                  ><code><span class="text-zinc-500">// ❌ Circular dependency: index.ts re-exports Button.vue, while Button.vue imports buttonVariants from index.ts</span>
<span class="text-purple-400">import</span> { cva } <span class="text-purple-400">from</span> <span class="text-emerald-300">'class-variance-authority'</span>

<span class="text-purple-400">export</span> { <span class="text-purple-400">default</span> <span class="text-purple-400">as</span> Button } <span class="text-purple-400">from</span> <span class="text-emerald-300">'./Button.vue'</span>

<span class="text-purple-400">export</span> <span class="text-blue-400">const</span> buttonVariants = <span class="text-yellow-300">cva</span>(
  <span class="text-emerald-300">'inline-flex items-center justify-center font-medium transition-colors'</span>,
  {
    variants: {
      variant: {
        default: <span class="text-emerald-300">'bg-primary text-primary-foreground shadow-xs'</span>,
        outline: <span class="text-emerald-300">'border border-input bg-background hover:bg-accent'</span>,
      },
    },
  }
)</code></pre>
                </div>

                <p>
                  Because
                  <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">Button.vue</code>
                  imports
                  <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">buttonVariants</code>
                  from <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">./index.ts</code>,
                  Vite evaluates the module in a cycle where the variant function binding is uninitialized during the
                  Vue SFC component setup.
                </p>
                <p>
                  What is the canonical architecture pattern to cleanly break this circular import while maintaining
                  convenient barrel exports for consumers?
                </p>
              </div>

              <!-- Question Action Bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div class="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground h-8 gap-1.5 text-xs"
                    @click="shareThread"
                  >
                    <Share2 class="size-3.5" />
                    <span>Share</span>
                  </Button>
                  <Button variant="ghost" size="sm" class="text-muted-foreground h-8 gap-1.5 text-xs">
                    <Flag class="size-3.5" />
                    <span>Report</span>
                  </Button>
                </div>

                <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Eye class="size-3.5" />
                  <span class="tabular-nums">1.4k views</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Answers Section Header -->
        <div class="flex items-center justify-between pt-2">
          <h2 class="text-foreground text-lg font-bold tracking-tight sm:text-xl">{{ totalAnswersCount }} Answers</h2>
          <span class="text-muted-foreground text-xs">
            Sorted by: <strong class="text-foreground font-medium">Highest score</strong>
          </span>
        </div>

        <!-- Answer 1: Accepted Instructor Answer -->
        <article
          class="bg-card relative overflow-hidden rounded-xl border border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20"
        >
          <!-- Accepted Solution Top Ribbon -->
          <div
            class="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 bg-emerald-500/10 px-5 py-2.5"
          >
            <div class="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 class="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Accepted by Author · Verified Solution</span>
            </div>
            <Badge class="bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-600">
              Instructor Solution
            </Badge>
          </div>

          <div class="p-5 sm:p-6">
            <div class="flex items-start gap-4 sm:gap-6">
              <!-- Upvote Widget with Checkmark Badge -->
              <div class="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  :class="[
                    'size-9 rounded-lg border transition-colors',
                    answer1Vote === 'up'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                      : 'text-muted-foreground hover:text-foreground',
                  ]"
                  aria-label="Upvote answer"
                  @click="voteAnswer1('up')"
                >
                  <ChevronUp class="size-5" />
                </Button>
                <span class="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                  {{ answer1Score }}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  :class="[
                    'size-9 rounded-lg border transition-colors',
                    answer1Vote === 'down'
                      ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                      : 'text-muted-foreground hover:text-foreground',
                  ]"
                  aria-label="Downvote answer"
                  @click="voteAnswer1('down')"
                >
                  <ChevronDown class="size-5" />
                </Button>

                <!-- Accepted Checkmark Pill -->
                <div
                  class="mt-3 flex size-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  title="Accepted solution"
                >
                  <Check class="size-4 stroke-[2.5]" />
                </div>
              </div>

              <!-- Answer Body -->
              <div class="min-w-0 flex-1 space-y-4">
                <!-- Author Header -->
                <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
                  <div class="flex items-center gap-3">
                    <Avatar class="size-10 border border-emerald-500/30">
                      <AvatarFallback
                        class="bg-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                      >
                        MV
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-foreground text-sm font-semibold">Marcus Vance</span>
                        <Badge
                          variant="outline"
                          class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300"
                        >
                          Course Instructor
                        </Badge>
                        <Badge variant="secondary" class="text-xs">Staff</Badge>
                      </div>
                      <p class="text-muted-foreground text-xs">Answered 1 day ago · Edited 18h ago</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground h-7 gap-1 text-xs"
                    @click="isAnswer1Bookmarked = !isAnswer1Bookmarked"
                  >
                    <Bookmark class="size-3.5" :class="isAnswer1Bookmarked ? 'fill-primary text-primary' : ''" />
                    <span>{{ isAnswer1Bookmarked ? 'Saved' : 'Save' }}</span>
                  </Button>
                </div>

                <!-- Solution Content Prose -->
                <div class="text-foreground/90 space-y-3.5 text-sm leading-relaxed">
                  <p>
                    Great question, David. This is one of the most frequent traps when building unbundled component
                    registries with Vue 3.5 and Vite.
                  </p>
                  <p>
                    The Vue SFC compiler compiles
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                      >&lt;script setup&gt;</code
                    >
                    into a self-contained ES module execution wrapper. When
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">Button.vue</code>
                    imports from
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">./index.ts</code>,
                    and
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">index.ts</code>
                    simultaneously imports
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">Button.vue</code>,
                    JavaScript enters a Temporal Dead Zone (TDZ) for the uninitialized
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">buttonVariants</code>
                    export.
                  </p>

                  <h3 class="text-foreground text-sm font-semibold tracking-tight">
                    The Solution: Three-File Sidecar Architecture
                  </h3>

                  <p>
                    To completely eliminate cyclic dependencies and ensure 100% reliable SSR and Vite HMR, extract all
                    CVA definitions into a dedicated
                    <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                      >&lt;name&gt;.variants.ts</code
                    >
                    file:
                  </p>

                  <!-- Solution Code Snippet 1 -->
                  <div class="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                    <div
                      class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400"
                    >
                      <div class="flex items-center gap-2">
                        <Code class="size-3.5 text-emerald-400" />
                        <span class="font-mono text-xs">components/ui/button/button.variants.ts</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                        @click="copyAnswer1Code"
                      >
                        <Check v-if="copiedAnswer1Snippet" class="size-3 text-emerald-400" />
                        <Copy v-else class="size-3" />
                        {{ copiedAnswer1Snippet ? 'Copied' : 'Copy code' }}
                      </Button>
                    </div>
                    <pre
                      class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300"
                    ><code><span class="text-purple-400">import</span> { cva, <span class="text-purple-400">type</span> VariantProps } <span class="text-purple-400">from</span> <span class="text-emerald-300">'class-variance-authority'</span>

<span class="text-purple-400">export</span> <span class="text-blue-400">const</span> buttonVariants = <span class="text-yellow-300">cva</span>(
  <span class="text-emerald-300">'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none'</span>,
  {
    variants: {
      variant: {
        default: <span class="text-emerald-300">'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'</span>,
        secondary: <span class="text-emerald-300">'bg-secondary text-secondary-foreground hover:bg-secondary/80'</span>,
        outline: <span class="text-emerald-300">'border border-input bg-background hover:bg-accent hover:text-accent-foreground'</span>,
        destructive: <span class="text-emerald-300">'bg-destructive text-destructive-foreground hover:bg-destructive/90'</span>,
      },
      size: {
        default: <span class="text-emerald-300">'h-9 px-4 py-2 text-sm'</span>,
        sm: <span class="text-emerald-300">'h-8 px-3 text-xs rounded-md'</span>,
        lg: <span class="text-emerald-300">'h-10 px-8 text-base rounded-md'</span>,
      },
    },
    defaultVariants: {
      variant: <span class="text-emerald-300">'default'</span>,
      size: <span class="text-emerald-300">'default'</span>,
    },
  }
)

<span class="text-purple-400">export</span> <span class="text-purple-400">type</span> ButtonVariants = <span class="text-yellow-300">VariantProps</span>&lt;<span class="text-purple-400">typeof</span> buttonVariants&gt;</code></pre>
                  </div>

                  <!-- Companion Barrel & SFC Snippet -->
                  <div class="overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100">
                    <div
                      class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2 text-xs text-zinc-400"
                    >
                      <div class="flex items-center gap-2">
                        <Code class="size-3.5 text-blue-400" />
                        <span class="font-mono text-xs">components/ui/button/index.ts &amp; Button.vue</span>
                      </div>
                    </div>
                    <pre
                      class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-300"
                    ><code><span class="text-zinc-500">// index.ts — Clean consumer re-exports</span>
<span class="text-purple-400">export</span> { <span class="text-purple-400">default</span> <span class="text-purple-400">as</span> Button } <span class="text-purple-400">from</span> <span class="text-emerald-300">'./Button.vue'</span>
<span class="text-purple-400">export</span> { buttonVariants, <span class="text-purple-400">type</span> ButtonVariants } <span class="text-purple-400">from</span> <span class="text-emerald-300">'./button.variants'</span>

<span class="text-zinc-500">// In Button.vue &lt;script setup lang="ts"&gt;</span>
<span class="text-purple-400">import</span> { buttonVariants, <span class="text-purple-400">type</span> ButtonVariants } <span class="text-purple-400">from</span> <span class="text-emerald-300">'./button.variants'</span> <span class="text-zinc-500">// ✅ Direct sibling import</span></code></pre>
                  </div>

                  <ul class="list-inside list-disc space-y-1.5 pl-1 text-xs sm:text-sm">
                    <li>
                      <strong>Acyclic Dependency Graph:</strong>
                      <code class="bg-muted text-foreground rounded px-1 font-mono text-xs">Button.vue</code> imports
                      strictly from
                      <code class="bg-muted text-foreground rounded px-1 font-mono text-xs">./button.variants</code>.
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

                <!-- Action Bar -->
                <div class="flex items-center justify-between border-t pt-3">
                  <div class="flex items-center gap-2">
                    <Button variant="outline" size="sm" class="h-7 gap-1.5 text-xs" @click="voteAnswer1('up')">
                      <ThumbsUp class="size-3" />
                      <span>Helpful ({{ answer1Score }})</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground h-7 gap-1.5 text-xs"
                      @click="shareThread"
                    >
                      <Share2 class="size-3" />
                      <span>Share</span>
                    </Button>
                  </div>
                  <span class="text-muted-foreground text-xs">89 students found this helpful</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- Answer 2: Peer Response -->
        <article class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
          <div class="flex items-start gap-4 sm:gap-6">
            <!-- Upvote Widget -->
            <div class="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                :class="[
                  'size-9 rounded-lg border transition-colors',
                  answer2Vote === 'up'
                    ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Upvote answer"
                @click="voteAnswer2('up')"
              >
                <ChevronUp class="size-5" />
              </Button>
              <span class="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                {{ answer2Score }}
              </span>
              <Button
                variant="outline"
                size="icon"
                :class="[
                  'size-9 rounded-lg border transition-colors',
                  answer2Vote === 'down'
                    ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Downvote answer"
                @click="voteAnswer2('down')"
              >
                <ChevronDown class="size-5" />
              </Button>
            </div>

            <!-- Answer Body -->
            <div class="min-w-0 flex-1 space-y-4">
              <!-- Author Header -->
              <div class="flex flex-wrap items-center justify-between gap-2 border-b pb-3.5">
                <div class="flex items-center gap-3">
                  <Avatar class="size-10 border">
                    <AvatarFallback class="bg-blue-500/20 text-xs font-semibold text-blue-800 dark:text-blue-300">
                      SL
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-sm font-semibold">Sophia Lin</span>
                      <Badge variant="secondary" class="text-xs font-normal">Teaching Assistant</Badge>
                    </div>
                    <p class="text-muted-foreground text-xs">Answered 2 days ago · Oct 22, 2026 at 18:40</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground h-7 gap-1 text-xs"
                  @click="isAnswer2Bookmarked = !isAnswer2Bookmarked"
                >
                  <Bookmark class="size-3.5" :class="isAnswer2Bookmarked ? 'fill-primary text-primary' : ''" />
                  <span>{{ isAnswer2Bookmarked ? 'Saved' : 'Save' }}</span>
                </Button>
              </div>

              <!-- Content Prose -->
              <div class="text-foreground/90 space-y-3 text-sm leading-relaxed">
                <p>
                  Adding to Marcus's answer: another huge benefit of isolating
                  <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                    >&lt;name&gt;.variants.ts</code
                  >
                  is for monorepos or dual-framework setups.
                </p>
                <p>
                  When you have both Vue and React registry components (like in UIPKGE), the variant definitions can be
                  shared verbatim in a shared token package without bringing in any Vue SFC or JSX compiler
                  dependencies. This keeps design tokens consistent across both stacks.
                </p>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center justify-between border-t pt-3">
                <div class="flex items-center gap-2">
                  <Button variant="outline" size="sm" class="h-7 gap-1.5 text-xs" @click="voteAnswer2('up')">
                    <ThumbsUp class="size-3" />
                    <span>Helpful ({{ answer2Score }})</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground h-7 gap-1.5 text-xs"
                    @click="shareThread"
                  >
                    <Share2 class="size-3" />
                    <span>Share</span>
                  </Button>
                </div>
                <span class="text-muted-foreground text-xs">14 students found this helpful</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Dynamic User Submitted Answers -->
        <article v-for="ans in customAnswers" :key="ans.id" class="bg-card rounded-xl border p-5 shadow-xs sm:p-6">
          <div class="flex items-start gap-4 sm:gap-6">
            <!-- Upvote Widget -->
            <div class="flex flex-col items-center">
              <Button
                variant="outline"
                size="icon"
                :class="[
                  'size-9 rounded-lg border transition-colors',
                  ans.userVote === 'up'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Upvote answer"
                @click="voteCustomAnswer(ans, 'up')"
              >
                <ChevronUp class="size-5" />
              </Button>
              <span class="text-foreground my-1.5 font-mono text-base font-bold tabular-nums">
                {{ ans.score }}
              </span>
              <Button
                variant="outline"
                size="icon"
                :class="[
                  'size-9 rounded-lg border transition-colors',
                  ans.userVote === 'down'
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Downvote answer"
                @click="voteCustomAnswer(ans, 'down')"
              >
                <ChevronDown class="size-5" />
              </Button>
            </div>

            <!-- Answer Body -->
            <div class="min-w-0 flex-1 space-y-4">
              <!-- Author Header -->
              <div class="flex items-center justify-between border-b pb-3.5">
                <div class="flex items-center gap-3">
                  <Avatar class="size-10 border">
                    <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
                      {{ ans.avatarText }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-sm font-semibold">{{ ans.authorName }}</span>
                      <Badge variant="secondary" class="text-xs">{{ ans.authorRole }}</Badge>
                    </div>
                    <p class="text-muted-foreground text-xs">{{ ans.postedTime }}</p>
                  </div>
                </div>
              </div>

              <!-- Content Prose -->
              <div class="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                {{ ans.content }}
              </div>
            </div>
          </div>
        </article>

        <!-- Reply / Answer Composer -->
        <section class="bg-card overflow-hidden rounded-xl border shadow-xs">
          <div class="bg-muted/40 border-b px-5 py-3">
            <h3 class="text-foreground text-base font-bold tracking-tight">Post Your Answer</h3>
            <p class="text-muted-foreground text-xs">
              Provide thorough explanations, actionable code examples, and reference architectural best practices.
            </p>
          </div>

          <div class="space-y-3.5 p-5">
            <!-- Formatting Toolbar -->
            <div class="text-muted-foreground flex flex-wrap items-center gap-1 border-b pb-2.5">
              <Button variant="ghost" size="icon" class="size-7" aria-label="Format bold" @click="applyFormat('bold')">
                <Bold class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="size-7"
                aria-label="Format italic"
                @click="applyFormat('italic')"
              >
                <Italic class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="size-7"
                aria-label="Insert code block"
                @click="applyFormat('code')"
              >
                <Code class="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" class="size-7" aria-label="Insert link" @click="applyFormat('link')">
                <Link2 class="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" class="size-7" aria-label="Insert list" @click="applyFormat('list')">
                <List class="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                class="size-7"
                aria-label="Insert blockquote"
                @click="applyFormat('quote')"
              >
                <Quote class="size-3.5" />
              </Button>
              <span class="text-muted-foreground ml-auto text-xs">Markdown syntax supported</span>
            </div>

            <!-- Rich Textarea -->
            <Textarea
              v-model="replyDraft"
              placeholder="Write your detailed answer with code blocks (e.g. ```ts ... ```)..."
              rows="6"
              class="resize-y font-sans text-sm"
            />

            <!-- Post Button & Guidelines -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span class="text-muted-foreground text-xs">
                Draft saved automatically · Be constructive &amp; cite official docs
              </span>
              <Button class="gap-1.5 text-xs font-semibold" :disabled="!replyDraft.trim()" @click="handlePostAnswer">
                <MessageSquare class="size-3.5" />
                Post Your Answer
              </Button>
            </div>
          </div>
        </section>
      </main>

      <!-- Right Column: Sidebar Metadata & Related Discussions (4 cols) -->
      <aside class="space-y-6 lg:col-span-4">
        <!-- Thread Info Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-sm font-semibold">Discussion Info</CardTitle>
              <Badge
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
              >
                Resolved
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 pt-0">
            <Separator />
            <dl class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Course</dt>
                <dd class="text-foreground font-medium">CS-314 Frontend Arch</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Category</dt>
                <dd class="text-foreground font-medium">Vue 3.5 &amp; Vite</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Total Upvotes</dt>
                <dd class="text-foreground font-medium tabular-nums">+145 upvotes</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Total Views</dt>
                <dd class="text-foreground font-medium tabular-nums">1,420</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Participants</dt>
                <dd class="text-foreground font-medium">4 contributors</dd>
              </div>
              <div class="flex items-center justify-between gap-2">
                <dt class="text-muted-foreground">Accepted By</dt>
                <dd class="text-foreground font-medium">David Chen (Author)</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <!-- Related Questions Card -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm font-semibold">Related Discussions</CardTitle>
            <CardDescription class="text-xs">Similar questions from this course cohort</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 pt-0">
            <Separator />
            <ul class="space-y-3 text-xs">
              <li class="space-y-1">
                <a
                  href="#"
                  class="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                >
                  <span>How to type polymorphic asChild props with Reka UI in Vue 3.5?</span>
                  <ArrowUpRight class="text-muted-foreground size-3.5 shrink-0" />
                </a>
                <div class="text-muted-foreground flex items-center gap-2">
                  <span
                    class="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Solved
                  </span>
                  <span class="tabular-nums">38 upvotes</span>
                  <span>· 4 answers</span>
                </div>
              </li>

              <Separator />

              <li class="space-y-1">
                <a
                  href="#"
                  class="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                >
                  <span>Configuring OKLCH Tailwind v4 themes with Nuxt 4</span>
                  <ArrowUpRight class="text-muted-foreground size-3.5 shrink-0" />
                </a>
                <div class="text-muted-foreground flex items-center gap-2">
                  <span
                    class="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Solved
                  </span>
                  <span class="tabular-nums">24 upvotes</span>
                  <span>· 2 answers</span>
                </div>
              </li>

              <Separator />

              <li class="space-y-1">
                <a
                  href="#"
                  class="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                >
                  <span>Best practices for CVA compoundVariants in TypeScript</span>
                  <ArrowUpRight class="text-muted-foreground size-3.5 shrink-0" />
                </a>
                <div class="text-muted-foreground flex items-center gap-2">
                  <span class="bg-muted text-foreground rounded px-1.5 py-0.5 text-xs font-medium"> Open </span>
                  <span class="tabular-nums">19 upvotes</span>
                  <span>· 1 answer</span>
                </div>
              </li>

              <Separator />

              <li class="space-y-1">
                <a
                  href="#"
                  class="text-foreground hover:text-primary flex items-start justify-between gap-2 font-medium transition-colors"
                >
                  <span>Hydration mismatches with client-side theme switchers in Astro SSG</span>
                  <ArrowUpRight class="text-muted-foreground size-3.5 shrink-0" />
                </a>
                <div class="text-muted-foreground flex items-center gap-2">
                  <span
                    class="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                  >
                    Solved
                  </span>
                  <span class="tabular-nums">52 upvotes</span>
                  <span>· 6 answers</span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <!-- EdStem Forum Guidelines Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <Sparkles class="text-primary size-4" />
              <CardTitle class="text-sm font-semibold">Forum Etiquette</CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-2.5 pt-0 text-xs">
            <Separator />
            <div class="text-muted-foreground space-y-2">
              <div class="flex items-start gap-2">
                <Check class="text-primary mt-0.5 size-3.5 shrink-0" />
                <span>Isolate reproducible snippets using [name].variants.ts patterns.</span>
              </div>
              <div class="flex items-start gap-2">
                <Check class="text-primary mt-0.5 size-3.5 shrink-0" />
                <span>Search existing questions before posting duplicate topics.</span>
              </div>
              <div class="flex items-start gap-2">
                <Check class="text-primary mt-0.5 size-3.5 shrink-0" />
                <span>Mark the accepted solution once your issue is verified.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  </div>
</template>
