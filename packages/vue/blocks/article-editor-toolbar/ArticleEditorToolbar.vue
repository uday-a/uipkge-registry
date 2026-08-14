<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Bold,
  Bookmark,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  Cloud,
  Code,
  Copy,
  ExternalLink,
  Eye,
  FileCode,
  Heart,
  HelpCircle,
  ImageIcon,
  Info,
  Italic,
  Layers,
  Lightbulb,
  Link2,
  List,
  ListOrdered,
  Maximize2,
  MessageSquare,
  Minus,
  MoreHorizontal,
  PenLine,
  Plus,
  Quote,
  Redo2,
  RotateCcw,
  Send,
  Share2,
  Sparkles,
  Strikethrough,
  Tag,
  Terminal,
  Type,
  Underline,
  Undo2,
  Upload,
  Volume2,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

// View Mode
const isPreviewMode = ref(false)

// Story Content State
const articleTitle = ref('The Death of the Monolithic Component Package')
const articleSubtitle = ref('Why the unbundled registry architecture is replacing npm packages for UI systems.')
const topicTag = ref('Architecture & UI')
const authorName = ref('Alex Rivera')
const authorHandle = ref('@arivera_eng')
const publicationName = ref('The Engineering Digest')
const lastSavedText = ref('Draft Saved 2m ago')
const isAutosaving = ref(false)

// Reader Engagement State
const clapCount = ref(342)
const isBookmarked = ref(false)
const isFollowing = ref(false)
const readerFontSize = ref<'normal' | 'large'>('normal')

// Toolbar Formatter State
type TextStyle = 'paragraph' | 'h1' | 'h2' | 'h3'
const activeTextStyle = ref<TextStyle>('paragraph')
const isStyleDropdownOpen = ref(false)

const isBoldActive = ref(false)
const isItalicActive = ref(false)
const isUnderlineActive = ref(false)
const isStrikeActive = ref(false)
const isInlineCodeActive = ref(false)
const textAlign = ref<'left' | 'center' | 'right'>('left')

// Active Block Elements in Canvas
type CalloutType = 'tip' | 'warning' | 'info'
const calloutType = ref<CalloutType>('tip')
const isCodeBlockCopied = ref(false)
const activeCodeTab = ref<'json' | 'bash'>('json')

// Modals / Drawers
const isPublishModalOpen = ref(false)
const isLinkModalOpen = ref(false)
const isPublishedSuccess = ref(false)
const linkUrl = ref('https://uipkge.dev')
const linkText = ref('unbundled registry architecture')

// Publish Settings State
const publishTags = ref(['Web Development', 'Design Systems', 'Vue', 'React', 'Frontend'])
const newTagInput = ref('')
const canonicalUrl = ref('https://theengineeringdigest.io/p/unbundled-ui-registries')
const seoDescription = ref(
  'A deep dive into why copy-paste UI component registries like shadcn and uipkge are displacing monolithic npm component libraries across engineering teams.',
)
const sendNewsletter = ref(true)
const publishSchedule = ref<'now' | 'schedule'>('now')

// Toast Feedback
const toastMessage = ref<string | null>(null)
let toastTimer: any = null

function showToast(msg: string) {
  if (toastTimer) clearTimeout(toastTimer)
  toastMessage.value = msg
  toastTimer = setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

// Word Count and Reading Metrics Calculation
const wordCount = computed(() => {
  const fullText = `${articleTitle.value} ${articleSubtitle.value} For nearly a decade the standard recipe for building a frontend design system was predictable spin up a private or public npm monorepo bundle fifty UI components with Rollup or Vite and force every application team to install as a heavyweight runtime dependency The component registry model inverts this entire dynamic Instead of consuming a closed npm black box developers pull atomic clean TypeScript source files directly into their repository Zero Runtime Overhead Direct Accessibility Ownership Native Token Sync`
  const words = fullText.trim().split(/\s+/).filter(Boolean)
  return words.length + 1380
})

const readingTimeMinutes = computed(() => {
  return Math.max(1, Math.ceil(wordCount.value / 220))
})

function triggerManualSave() {
  isAutosaving.value = true
  lastSavedText.value = 'Saving changes...'
  setTimeout(() => {
    isAutosaving.value = false
    lastSavedText.value = 'Draft Saved just now'
    showToast('All draft changes saved to cloud.')
  }, 600)
}

function handleAddTag() {
  const trimmed = newTagInput.value.trim()
  if (trimmed && !publishTags.value.includes(trimmed)) {
    publishTags.value.push(trimmed)
    newTagInput.value = ''
  }
}

function handleRemoveTag(tagToRemove: string) {
  publishTags.value = publishTags.value.filter((t) => t !== tagToRemove)
}

function copyCodeSnippet() {
  isCodeBlockCopied.value = true
  showToast('Code snippet copied to clipboard!')
  setTimeout(() => {
    isCodeBlockCopied.value = false
  }, 2000)
}

function handlePublish() {
  isPublishModalOpen.value = false
  isPublishedSuccess.value = true
  showToast('🎉 Story published successfully to The Engineering Digest!')
}

function insertCallout(type: CalloutType) {
  calloutType.value = type
  showToast(`Applied ${type.toUpperCase()} callout formatting.`)
}

function handleAiAssist() {
  showToast('✨ AI polished paragraph for conciseness and punchy cadence.')
}

function selectTextStyle(style: TextStyle) {
  activeTextStyle.value = style
  isStyleDropdownOpen.value = false
}

function toggleBold() {
  isBoldActive.value = !isBoldActive.value
  showToast(isBoldActive.value ? 'Bold applied' : 'Bold removed')
}

function toggleItalic() {
  isItalicActive.value = !isItalicActive.value
  showToast(isItalicActive.value ? 'Italic applied' : 'Italic removed')
}

function toggleUnderline() {
  isUnderlineActive.value = !isUnderlineActive.value
  showToast(isUnderlineActive.value ? 'Underline applied' : 'Underline removed')
}

function toggleStrikethrough() {
  isStrikeActive.value = !isStrikeActive.value
  showToast(isStrikeActive.value ? 'Strikethrough applied' : 'Strikethrough removed')
}

function toggleInlineCode() {
  isInlineCodeActive.value = !isInlineCodeActive.value
  showToast(isInlineCodeActive.value ? 'Inline code formatted' : 'Inline code removed')
}

function toggleFollowing() {
  isFollowing.value = !isFollowing.value
  showToast(isFollowing.value ? 'Following Alex Rivera' : 'Unfollowed')
}

function toggleBookmarked() {
  isBookmarked.value = !isBookmarked.value
  showToast(isBookmarked.value ? 'Saved to bookmarks' : 'Removed from bookmarks')
}

function handleClap() {
  clapCount.value++
  showToast(`Clapped! (${clapCount.value} claps total)`)
}

function handleInsertLink() {
  isLinkModalOpen.value = false
  showToast('Link inserted successfully!')
}

const sampleJsonCode = `{
  "$schema": "https://uipkge.dev/schema.json",
  "style": "new-york",
  "rsc": true,
  "aliases": {
    "components": "@/components/ui",
    "utils": "@/lib/utils",
    "blocks": "@/components/blocks"
  }
}`

const sampleBashCode = `# Add rich article drafting block to your project
npx shadcn-vue@latest add https://uipkge.dev/r/vue/article-editor-toolbar.json -y`
</script>

<template>
  <div data-slot="article-editor-toolbar" :class="cn('bg-background text-foreground min-h-screen', props.class)">
    <!-- Top Sticky Application Header Bar -->
    <header class="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 overflow-x-auto px-4 sm:px-6">
        <!-- Left: Publication & Save Status -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <BookOpen class="size-4" />
            </div>
            <div class="hidden min-w-0 truncate whitespace-nowrap sm:block">
              <span class="text-foreground text-sm font-semibold tracking-tight">{{ publicationName }}</span>
              <span class="text-muted-foreground ml-1.5 text-xs">/ Editor</span>
            </div>
          </div>

          <Separator orientation="vertical" class="hidden h-4 sm:block" />

          <!-- Autosave Status Badge -->
          <button
            type="button"
            class="hover:bg-muted/60 text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors"
            @click="triggerManualSave"
            title="Click to save now"
          >
            <Cloud v-if="!isAutosaving" class="size-3.5 text-emerald-500" />
            <RotateCcw v-else class="size-3.5 animate-spin text-amber-500" />
            <span class="hidden md:inline">{{ lastSavedText }}</span>
            <span class="md:hidden">Saved</span>
          </button>
        </div>

        <!-- Center: Live Story Statistics -->
        <div class="text-muted-foreground hidden items-center gap-2 text-xs md:flex">
          <Badge variant="outline" class="font-normal"> {{ wordCount.toLocaleString() }} words </Badge>
          <span>·</span>
          <span>{{ readingTimeMinutes }} min read</span>
        </div>

        <!-- Right: Actions & Publishing Controls -->
        <div class="flex items-center gap-2">
          <!-- Undo / Redo controls -->
          <div class="hidden items-center gap-0.5 sm:flex">
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-8"
              @click="showToast('Undo action')"
              title="Undo (⌘Z)"
              aria-label="Action"
            >
              <Undo2 class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-8"
              @click="showToast('Redo action')"
              title="Redo (⇧⌘Z)"
              aria-label="Action"
            >
              <Redo2 class="size-4" />
            </Button>
          </div>

          <Separator orientation="vertical" class="hidden h-4 sm:block" />

          <!-- Preview Toggle Button -->
          <Button
            variant="outline"
            size="sm"
            class="h-8 gap-1.5 text-xs font-medium"
            :class="isPreviewMode ? 'bg-secondary text-secondary-foreground border-primary/40' : ''"
            @click="isPreviewMode = !isPreviewMode"
          >
            <Eye class="size-3.5" />
            <span>{{ isPreviewMode ? 'Edit Story' : 'Preview Article' }}</span>
          </Button>

          <!-- Publish Story Primary Button -->
          <Button
            aria-label="Close publish modal"
            size="sm"
            class="h-8 gap-1.5 text-xs font-semibold shadow-xs"
            @click="isPublishModalOpen = true"
          >
            <Send class="size-3.5" />
            <span>Publish Story</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Floating / Sticky Formatting Toolbar (Only in Editor Mode) -->
    <div v-if="!isPreviewMode" class="sticky top-16 z-30 mx-auto mt-4 max-w-3xl px-4 transition-all duration-200">
      <div
        class="border-border bg-card/95 flex flex-wrap items-center justify-between gap-1 rounded-xl border p-1.5 shadow-sm backdrop-blur-md"
      >
        <!-- Group 1: Typography Block Selector -->
        <div class="flex items-center gap-1">
          <div class="relative">
            <Button
              variant="ghost"
              size="sm"
              class="text-foreground hover:bg-muted h-8 gap-1 px-2 text-xs font-medium"
              @click="isStyleDropdownOpen = !isStyleDropdownOpen"
            >
              <Type class="text-muted-foreground size-3.5" />
              <span class="capitalize">{{
                activeTextStyle === 'paragraph' ? 'Normal Text' : activeTextStyle.toUpperCase()
              }}</span>
              <ChevronDown class="text-muted-foreground size-3" />
            </Button>

            <!-- Text Style Dropdown -->
            <div
              v-if="isStyleDropdownOpen"
              class="border-border bg-popover absolute top-full left-0 z-50 mt-1.5 w-40 rounded-lg border p-1 shadow-md"
            >
              <button
                type="button"
                class="hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors"
                :class="
                  activeTextStyle === 'paragraph' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground'
                "
                @click="selectTextStyle('paragraph')"
              >
                <span>Paragraph</span>
                <span class="text-muted-foreground text-xs uppercase">Body</span>
              </button>
              <button
                type="button"
                class="hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors"
                :class="activeTextStyle === 'h1' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground'"
                @click="selectTextStyle('h1')"
              >
                <span class="text-sm font-bold">Heading 1</span>
                <span class="text-muted-foreground text-xs">H1</span>
              </button>
              <button
                type="button"
                class="hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors"
                :class="activeTextStyle === 'h2' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground'"
                @click="selectTextStyle('h2')"
              >
                <span class="text-xs font-semibold">Heading 2</span>
                <span class="text-muted-foreground text-xs">H2</span>
              </button>
              <button
                type="button"
                class="hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors"
                :class="activeTextStyle === 'h3' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground'"
                @click="selectTextStyle('h3')"
              >
                <span class="text-xs font-medium">Heading 3</span>
                <span class="text-muted-foreground text-xs">H3</span>
              </button>
            </div>
          </div>

          <Separator orientation="vertical" class="mx-0.5 h-4" />

          <!-- Group 2: Inline Formatting -->
          <div class="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              class="size-8 transition-colors"
              :class="isBoldActive ? 'bg-muted text-primary font-bold' : 'text-muted-foreground hover:text-foreground'"
              @click="toggleBold"
              title="Bold (⌘B)"
              aria-label="Bold"
            >
              <Bold class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 transition-colors"
              :class="isItalicActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="toggleItalic"
              title="Italic (⌘I)"
              aria-label="Italic"
            >
              <Italic class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 transition-colors"
              :class="isUnderlineActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="toggleUnderline"
              title="Underline (⌘U)"
              aria-label="Underline"
            >
              <Underline class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 transition-colors"
              :class="isStrikeActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground'"
              @click="toggleStrikethrough"
              title="Strikethrough (⇧⌘X)"
              aria-label="Strikethrough"
            >
              <Strikethrough class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 transition-colors"
              :class="
                isInlineCodeActive ? 'bg-muted text-primary font-mono' : 'text-muted-foreground hover:text-foreground'
              "
              @click="toggleInlineCode"
              title="Inline Code (⌘E)"
              aria-label="Code snippet"
            >
              <Code class="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-8"
              @click="isLinkModalOpen = true"
              title="Insert Link (⌘K)"
              aria-label="Action"
            >
              <Link2 class="size-3.5" />
            </Button>
          </div>
        </div>

        <!-- Group 3: Block Elements & Media -->
        <div class="flex items-center gap-1">
          <Separator orientation="vertical" class="mx-0.5 h-4" />

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="showToast('Blockquote formatted')"
            title="Blockquote (⌘⇧.)"
            aria-label="Blockquote"
          >
            <Quote class="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="insertCallout(calloutType === 'tip' ? 'warning' : calloutType === 'warning' ? 'info' : 'tip')"
            title="Toggle Callout Box"
            aria-label="Action"
          >
            <Lightbulb class="size-3.5 text-amber-500" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="showToast('Code block activated')"
            title="Code Block (```)"
            aria-label="Action"
          >
            <FileCode class="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="showToast('Bullet list toggled')"
            title="Bullet List (⌘⇧8)"
            aria-label="Bullet list"
          >
            <List class="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="showToast('Numbered list toggled')"
            title="Numbered List (⌘⇧7)"
            aria-label="Numbered list"
          >
            <ListOrdered class="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="showToast('Horizontal divider inserted')"
            title="Divider (---)"
            aria-label="Decrease"
          >
            <Minus class="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            @click="showToast('Image upload dialog simulated')"
            title="Upload Media"
            aria-label="Action"
          >
            <ImageIcon class="size-3.5" />
          </Button>

          <Separator orientation="vertical" class="mx-0.5 h-4" />

          <!-- AI Polish Action -->
          <Button
            variant="ghost"
            size="sm"
            class="text-primary hover:bg-primary/10 h-8 gap-1 px-2 text-xs font-medium"
            @click="handleAiAssist"
            title="AI Writing Assistant"
          >
            <Sparkles class="size-3.5" />
            <span class="hidden sm:inline">AI Assist</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- MAIN ARTICLE DRAFTING CANVAS / READER PREVIEW -->
    <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <!-- PUBLISHED SUCCESS BANNER -->
      <div
        v-if="isPublishedSuccess"
        class="mb-8 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-950 dark:text-emerald-200"
      >
        <div class="flex items-center gap-3">
          <CheckCheck class="size-5 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p class="text-sm font-semibold">Story Live on The Engineering Digest</p>
            <p class="text-muted-foreground text-xs">URL: {{ canonicalUrl }}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" class="h-8 text-xs" @click="isPublishedSuccess = false"> Dismiss </Button>
      </div>

      <!-- ARTICLE HEADER -->
      <article class="space-y-6">
        <!-- Topic Category Tag -->
        <div class="flex items-center justify-between">
          <Badge variant="secondary" class="gap-1 px-2.5 py-0.5 text-xs font-medium tracking-wide">
            <Tag class="text-muted-foreground size-3" />
            {{ topicTag }}
          </Badge>

          <div v-if="isPreviewMode" class="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground h-7 text-xs"
              :class="readerFontSize === 'large' ? 'bg-muted text-foreground' : ''"
              @click="readerFontSize = readerFontSize === 'normal' ? 'large' : 'normal'"
            >
              <Type class="mr-1 size-3" />
              {{ readerFontSize === 'large' ? 'Standard text' : 'Larger text' }}
            </Button>
          </div>
        </div>

        <!-- Article Title -->
        <div v-if="!isPreviewMode" class="space-y-2">
          <Textarea
            v-model="articleTitle"
            rows="2"
            class="text-foreground placeholder:text-muted-foreground/40 w-full resize-none border-0 bg-transparent p-0 text-3xl font-bold tracking-tight focus-visible:ring-0 focus-visible:outline-hidden sm:text-4xl lg:text-5xl"
            placeholder="Title..."
          />
        </div>
        <h1
          v-else
          class="text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl"
          :class="readerFontSize === 'large' ? 'text-4xl sm:text-5xl lg:text-6xl' : ''"
        >
          {{ articleTitle }}
        </h1>

        <!-- Article Subtitle -->
        <div v-if="!isPreviewMode">
          <Textarea
            v-model="articleSubtitle"
            rows="2"
            class="text-muted-foreground placeholder:text-muted-foreground/40 w-full resize-none border-0 bg-transparent p-0 text-lg font-normal focus-visible:ring-0 focus-visible:outline-hidden sm:text-xl"
            placeholder="Add a subtitle..."
          />
        </div>
        <p
          v-else
          class="text-muted-foreground text-lg leading-relaxed font-normal sm:text-xl"
          :class="readerFontSize === 'large' ? 'text-xl sm:text-2xl' : ''"
        >
          {{ articleSubtitle }}
        </p>

        <!-- Author / Byline Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 py-2">
          <div class="flex items-center gap-3">
            <div
              class="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold"
            >
              AR
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-foreground text-sm font-semibold">{{ authorName }}</span>
                <span class="text-muted-foreground text-xs">{{ authorHandle }}</span>
                <Button
                  v-if="isPreviewMode"
                  variant="ghost"
                  size="sm"
                  class="text-primary hover:bg-primary/10 h-6 px-2 text-xs"
                  @click="toggleFollowing"
                >
                  {{ isFollowing ? 'Following' : 'Follow' }}
                </Button>
              </div>
              <p class="text-muted-foreground text-xs">
                Published in <span class="text-foreground font-medium">{{ publicationName }}</span> · Oct 24, 2024 ·
                {{ readingTimeMinutes }} min read
              </p>
            </div>
          </div>

          <!-- Social / Reader actions -->
          <div class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs"
              @click="showToast('Audio version playing (6 min narration)')"
            >
              <Volume2 class="size-3.5" />
              <span class="hidden sm:inline">Listen</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-8"
              :class="isBookmarked ? 'text-primary' : ''"
              @click="toggleBookmarked"
              title="Bookmark story"
              aria-label="Action"
            >
              <Bookmark class="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-foreground size-8"
              @click="showToast('Link copied to clipboard')"
              title="Share article"
              aria-label="Share"
            >
              <Share2 class="size-4" />
            </Button>
          </div>
        </div>

        <Separator class="my-6" />

        <!-- ARTICLE BODY PROSE -->
        <div
          class="text-foreground space-y-6 leading-relaxed"
          :class="readerFontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'"
        >
          <!-- Paragraph 1 -->
          <p>
            For nearly a decade, the standard recipe for building a frontend design system was predictable: spin up a
            private or public npm monorepo, bundle fifty UI components with Rollup or Vite, and force every application
            team to install
            <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">@acme/design-system</code>
            as a heavyweight runtime dependency.
          </p>

          <!-- Stylized Callout Box -->
          <div
            class="my-8 rounded-xl border p-4.5 transition-colors sm:p-5"
            :class="
              calloutType === 'tip'
                ? 'text-foreground border-amber-500/30 bg-amber-500/10'
                : calloutType === 'warning'
                  ? 'text-foreground border-rose-500/30 bg-rose-500/10'
                  : 'text-foreground border-blue-500/30 bg-blue-500/10'
            "
          >
            <div class="flex items-start gap-3">
              <div class="mt-0.5 shrink-0">
                <Lightbulb v-if="calloutType === 'tip'" class="size-5 text-amber-600 dark:text-amber-400" />
                <AlertTriangle v-else-if="calloutType === 'warning'" class="size-5 text-rose-600 dark:text-rose-400" />
                <Info v-else class="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-semibold tracking-tight">
                    {{
                      calloutType === 'tip'
                        ? 'Key Architectural Takeaway'
                        : calloutType === 'warning'
                          ? 'Dependency Fragility Warning'
                          : 'Registry Distribution Note'
                    }}
                  </h4>
                  <div v-if="!isPreviewMode" class="flex items-center gap-1">
                    <button
                      type="button"
                      class="text-muted-foreground hover:text-foreground min-h-6 rounded px-1.5 py-0.5 text-xs"
                      :class="calloutType === 'tip' ? 'text-foreground font-semibold' : ''"
                      @click="calloutType = 'tip'"
                    >
                      Tip
                    </button>
                    <button
                      type="button"
                      class="text-muted-foreground hover:text-foreground min-h-6 rounded px-1.5 py-0.5 text-xs"
                      :class="calloutType === 'warning' ? 'text-foreground font-semibold' : ''"
                      @click="calloutType = 'warning'"
                    >
                      Warn
                    </button>
                    <button
                      type="button"
                      class="text-muted-foreground hover:text-foreground min-h-6 rounded px-1.5 py-0.5 text-xs"
                      :class="calloutType === 'info' ? 'text-foreground font-semibold' : ''"
                      @click="calloutType = 'info'"
                    >
                      Info
                    </button>
                  </div>
                </div>
                <p class="text-muted-foreground text-sm leading-normal">
                  When UI primitives are distributed via semver npm packages, updating a single button variant requires
                  a patch release, a dependency bump, and a potential cascade of peer-dependency conflicts across twenty
                  consuming micro-frontends.
                </p>
              </div>
            </div>
          </div>

          <!-- Subheading (H2) -->
          <h2 class="text-foreground pt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            1. The "Own Your Code" Revolution
          </h2>

          <p>
            The
            <a
              :href="linkUrl"
              target="_blank"
              class="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
            >
              {{ linkText }}
            </a>
            inverts this dynamic completely. Instead of consuming a closed npm black box, developers pull atomic, clean
            TypeScript source files directly into their repository via CLI tools like
            <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">shadcn-vue</code>
            or
            <code class="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">uipkge</code>.
          </p>

          <!-- Syntax-Highlighted Code Block -->
          <div class="border-border bg-muted/40 my-6 overflow-hidden rounded-xl border font-mono text-xs shadow-xs">
            <!-- Code Block Header -->
            <div class="border-border bg-card flex items-center justify-between border-b px-4 py-2">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="flex min-h-6 items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors"
                  :class="
                    activeCodeTab === 'json'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  "
                  @click="activeCodeTab = 'json'"
                >
                  <FileCode class="size-3.5 text-amber-500" />
                  components.json
                </button>
                <button
                  type="button"
                  class="flex min-h-6 items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors"
                  :class="
                    activeCodeTab === 'bash'
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  "
                  @click="activeCodeTab = 'bash'"
                >
                  <Terminal class="size-3.5 text-emerald-500" />
                  Terminal CLI
                </button>
              </div>

              <div class="flex items-center gap-2">
                <Badge variant="outline" class="h-5 px-1.5 font-mono text-xs uppercase">
                  {{ activeCodeTab === 'json' ? 'JSON' : 'BASH' }}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                  @click="copyCodeSnippet"
                >
                  <Check v-if="isCodeBlockCopied" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ isCodeBlockCopied ? 'Copied' : 'Copy' }}</span>
                </Button>
              </div>
            </div>

            <!-- Code Content Area -->
            <div class="overflow-x-auto p-4 leading-relaxed">
              <pre
                v-if="activeCodeTab === 'json'"
                class="text-foreground/90"
              ><code><span class="text-muted-foreground">{</span>
  <span class="text-primary font-semibold">"$schema"</span>: <span class="text-emerald-600 dark:text-emerald-400">"https://uipkge.dev/schema.json"</span>,
  <span class="text-primary font-semibold">"style"</span>: <span class="text-emerald-600 dark:text-emerald-400">"new-york"</span>,
  <span class="text-primary font-semibold">"rsc"</span>: <span class="text-amber-600 dark:text-amber-400">true</span>,
  <span class="text-primary font-semibold">"aliases"</span>: <span class="text-muted-foreground">{</span>
    <span class="text-primary">"components"</span>: <span class="text-emerald-600 dark:text-emerald-400">"@/components/ui"</span>,
    <span class="text-primary">"utils"</span>: <span class="text-emerald-600 dark:text-emerald-400">"@/lib/utils"</span>,
    <span class="text-primary">"blocks"</span>: <span class="text-emerald-600 dark:text-emerald-400">"@/components/blocks"</span>
  <span class="text-muted-foreground">}</span>
<span class="text-muted-foreground">}</span></code></pre>

              <pre
                v-else
                class="text-foreground/90"
              ><code><span class="text-muted-foreground"># Add rich article drafting block to your project</span>
<span class="text-primary font-semibold">npx</span> shadcn-vue@latest add https://uipkge.dev/r/vue/article-editor-toolbar.json <span class="text-emerald-600 dark:text-emerald-400">-y</span></code></pre>
            </div>
          </div>

          <!-- Stylized Blockquote -->
          <blockquote class="border-primary bg-muted/20 my-8 rounded-r-lg border-l-4 py-3 pr-4 pl-6 italic">
            <p class="text-foreground/90 text-base font-medium sm:text-lg">
              "The component registry model inverts the dependency tree. Instead of depending on an external
              maintainer's release cadence, your team owns every line of component markup, adapting it to your product's
              exact accessibility and branding needs without vendor lock-in."
            </p>
            <footer class="text-muted-foreground mt-2 text-xs font-normal not-italic">
              — Guillermo Rauch, CEO at Vercel
            </footer>
          </blockquote>

          <!-- Subheading (H2) -->
          <h2 class="text-foreground pt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            2. Core Architectural Advantages
          </h2>

          <p>
            When evaluating the switch from packaged distributions to registry generation, teams consistently report
            three major velocity unlocks:
          </p>

          <!-- Numbered List -->
          <ol class="space-y-3 pl-1">
            <li class="flex items-start gap-3">
              <span
                class="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              >
                1
              </span>
              <div>
                <strong class="text-foreground font-semibold">Zero Runtime Overhead:</strong>
                <span class="text-muted-foreground ml-1"
                  >Unused component variants and dead code branches are automatically pruned during application
                  tree-shaking.</span
                >
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              >
                2
              </span>
              <div>
                <strong class="text-foreground font-semibold">Direct Source Control:</strong>
                <span class="text-muted-foreground ml-1"
                  >Audit, modify, and patch WCAG accessibility tags directly inside your repository without waiting for
                  upstream PR merges.</span
                >
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              >
                3
              </span>
              <div>
                <strong class="text-foreground font-semibold">Native OKLCH Token Integration:</strong>
                <span class="text-muted-foreground ml-1"
                  >Colors and elevation variables adapt directly across modern Tailwind CSS v4 design systems.</span
                >
              </div>
            </li>
          </ol>

          <!-- Embedded Media Figure -->
          <div class="border-border bg-card my-8 overflow-hidden rounded-xl border shadow-xs">
            <div
              class="from-primary/10 via-muted to-primary/5 relative flex h-52 items-center justify-center bg-gradient-to-br sm:h-64"
            >
              <div class="space-y-2 p-6 text-center">
                <div
                  class="bg-card border-border text-primary inline-flex size-12 items-center justify-center rounded-xl border shadow-xs"
                >
                  <Layers class="size-6" />
                </div>
                <h4 class="text-foreground text-sm font-semibold">Unbundled Registry Architecture Flow</h4>
                <p class="text-muted-foreground max-w-sm text-xs">
                  Registry CLI pulls atomic SFC files directly into src/components/ui
                </p>
              </div>
              <div class="absolute top-3 right-3 flex items-center gap-1.5">
                <Badge variant="outline" class="bg-card/80 text-xs backdrop-blur-xs">Figure 1.0</Badge>
                <Button
                  aria-label="Expand media view"
                  variant="ghost"
                  size="icon"
                  class="bg-card/80 size-7 backdrop-blur-xs"
                  @click="showToast('Expanded media view')"
                >
                  <Maximize2 class="size-3.5" />
                </Button>
              </div>
            </div>
            <div class="border-border bg-card/60 border-t p-3">
              <p class="text-muted-foreground text-center text-xs italic">
                Figure 1: Monolithic npm package distribution vs. direct registry source ownership.
              </p>
            </div>
          </div>

          <!-- Section Divider -->
          <div class="text-muted-foreground my-10 flex items-center justify-center gap-2">
            <span class="bg-border size-1 rounded-full"></span>
            <span class="bg-muted-foreground/40 size-1.5 rounded-full"></span>
            <span class="bg-border size-1 rounded-full"></span>
          </div>

          <!-- Summary Conclusion -->
          <p>
            The shift from monolithic npm packages to unbundled UI registries is not just a tooling trend; it represents
            a fundamental re-alignment of software ownership, empowering engineering teams to build resilient interfaces
            that evolve with their product.
          </p>
        </div>
      </article>

      <!-- READER PREVIEW ENGAGEMENT FOOTER (When Preview Mode is Active) -->
      <div
        v-if="isPreviewMode"
        class="border-border bg-card/95 sticky bottom-6 z-30 mx-auto mt-12 max-w-lg rounded-full border p-2 shadow-lg backdrop-blur-md"
      >
        <div class="flex items-center justify-between px-3">
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="text-foreground hover:text-primary flex min-h-6 items-center gap-1.5 text-xs font-semibold transition-colors"
              @click="handleClap"
            >
              <Heart class="size-4 fill-rose-500/20 text-rose-500" />
              <span>{{ clapCount }}</span>
            </button>

            <button
              type="button"
              class="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1.5 text-xs transition-colors"
              @click="showToast('Responses panel opened (24 responses)')"
            >
              <MessageSquare class="size-4" />
              <span>24</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              class="text-muted-foreground hover:text-foreground h-7 text-xs"
              @click="toggleBookmarked"
            >
              <Bookmark class="mr-1 size-3.5" :class="isBookmarked ? 'fill-primary text-primary' : ''" />
              <span>Bookmark</span>
            </Button>
            <Button
              aria-label="Close publish modal"
              size="sm"
              class="h-7 text-xs font-semibold"
              @click="isPublishModalOpen = true"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </main>

    <!-- PUBLISH SETTINGS MODAL / DIALOG -->
    <div
      v-if="isPublishModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <Card class="border-border bg-card animate-in fade-in-0 zoom-in-95 w-full max-w-xl shadow-sm duration-200">
        <CardHeader class="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle class="text-lg font-semibold">Publish Story to Publication</CardTitle>
            <CardDescription class="text-xs">
              Configure publication metadata, topic tags, and newsletter distribution.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="text-muted-foreground hover:text-foreground size-8"
            aria-label="Close publish modal"
            @click="isPublishModalOpen = false"
          >
            <X class="size-4" />
          </Button>
        </CardHeader>

        <CardContent class="space-y-4 pt-0 text-sm">
          <!-- Story Summary Card -->
          <div class="border-border bg-muted/30 rounded-lg border p-3">
            <h4 class="text-foreground line-clamp-1 text-sm font-semibold">{{ articleTitle }}</h4>
            <p class="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{{ articleSubtitle }}</p>
            <div class="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
              <span>Author: {{ authorName }}</span>
              <span>·</span>
              <span>{{ wordCount }} words</span>
              <span>·</span>
              <span>{{ readingTimeMinutes }} min read</span>
            </div>
          </div>

          <!-- Tags Input -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Topic Tags (up to 5)</label>
            <div class="border-input bg-background flex flex-wrap gap-1.5 rounded-lg border p-2">
              <Badge v-for="tag in publishTags" :key="tag" variant="secondary" class="gap-1 pr-1 text-xs">
                {{ tag }}
                <button
                  :aria-label="`Remove tag ${tag}`"
                  type="button"
                  class="text-muted-foreground hover:text-foreground"
                  @click="handleRemoveTag(tag)"
                >
                  <X class="size-3" />
                </button>
              </Badge>
              <input
                v-model="newTagInput"
                type="text"
                class="placeholder:text-muted-foreground min-w-[100px] flex-1 border-0 bg-transparent p-0 text-xs focus:ring-0 focus:outline-hidden"
                placeholder="Add a tag..."
                @keydown.enter.prevent="handleAddTag"
              />
            </div>
          </div>

          <!-- SEO Meta Description -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-foreground text-xs font-medium">SEO Meta Description</label>
              <span class="text-muted-foreground text-xs">{{ seoDescription.length }}/160</span>
            </div>
            <Textarea
              v-model="seoDescription"
              rows="2"
              class="resize-none text-xs"
              placeholder="Brief summary for search engines and social cards..."
            />
          </div>

          <!-- Canonical URL -->
          <div class="space-y-1.5">
            <label class="text-foreground text-xs font-medium">Canonical URL</label>
            <Input v-model="canonicalUrl" class="h-8 font-mono text-xs" />
          </div>

          <!-- Newsletter Distribution Toggle -->
          <div class="border-border bg-muted/20 flex items-center justify-between rounded-lg border p-3">
            <div class="space-y-0.5">
              <p class="text-foreground text-xs font-semibold">Broadcast to Subscribers</p>
              <p class="text-muted-foreground text-xs">Send as an instant newsletter email to 14,200 active readers.</p>
            </div>
            <input
              v-model="sendNewsletter"
              type="checkbox"
              class="border-border accent-primary size-4 cursor-pointer rounded"
            />
          </div>

          <!-- Schedule Options -->
          <div class="flex items-center gap-4 text-xs">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="publishSchedule"
                type="radio"
                value="now"
                name="schedule"
                class="accent-primary cursor-pointer"
              />
              <span class="text-foreground font-medium">Publish Now</span>
            </label>
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="publishSchedule"
                type="radio"
                value="schedule"
                name="schedule"
                class="accent-primary cursor-pointer"
              />
              <span class="text-muted-foreground">Schedule for later</span>
            </label>
          </div>
        </CardContent>

        <CardFooter class="border-border flex items-center justify-end gap-2 border-t pt-4">
          <Button
            aria-label="Close publish modal"
            variant="outline"
            size="sm"
            class="text-xs"
            @click="isPublishModalOpen = false"
          >
            Cancel
          </Button>
          <Button size="sm" class="gap-1.5 text-xs font-semibold shadow-xs" @click="handlePublish">
            <Send class="size-3.5" />
            <span>{{ publishSchedule === 'now' ? 'Confirm & Publish Now' : 'Schedule Story' }}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- INSERT LINK MODAL -->
    <div
      v-if="isLinkModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
    >
      <Card class="border-border bg-card w-full max-w-sm shadow-xl">
        <CardHeader class="pb-3">
          <CardTitle class="text-sm font-semibold">Insert Hyperlink</CardTitle>
          <CardDescription class="text-xs">Add an external reference link</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3 pt-0">
          <div class="space-y-1">
            <label class="text-muted-foreground text-xs">Link Text</label>
            <Input v-model="linkText" class="h-8 text-xs" />
          </div>
          <div class="space-y-1">
            <label class="text-muted-foreground text-xs">Destination URL</label>
            <Input v-model="linkUrl" class="h-8 font-mono text-xs" placeholder="https://" />
          </div>
        </CardContent>
        <CardFooter class="border-border flex items-center justify-end gap-2 border-t pt-3">
          <Button variant="ghost" size="sm" class="h-8 text-xs" @click="isLinkModalOpen = false"> Cancel </Button>
          <Button size="sm" class="h-8 text-xs" @click="handleInsertLink"> Apply Link </Button>
        </CardFooter>
      </Card>
    </div>

    <!-- INTERACTIVE TOAST NOTIFICATION -->
    <div
      v-if="toastMessage"
      class="border-border bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-2 fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-medium shadow-lg duration-150"
    >
      <Check class="text-primary size-3.5" />
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>
