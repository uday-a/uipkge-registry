'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export interface ArticleEditorToolbarProps {
  className?: string
}

type TextStyle = 'paragraph' | 'h1' | 'h2' | 'h3'
type CalloutType = 'tip' | 'warning' | 'info'

export function ArticleEditorToolbar({ className }: ArticleEditorToolbarProps) {
  // View Mode
  const [isPreviewMode, setIsPreviewMode] = React.useState(false)

  // Story Content State
  const [articleTitle, setArticleTitle] = React.useState('The Death of the Monolithic Component Package')
  const [articleSubtitle, setArticleSubtitle] = React.useState(
    'Why the unbundled registry architecture is replacing npm packages for UI systems.',
  )
  const [topicTag, setTopicTag] = React.useState('Architecture & UI')
  const [authorName] = React.useState('Alex Rivera')
  const [authorHandle] = React.useState('@arivera_eng')
  const [publicationName] = React.useState('The Engineering Digest')
  const [lastSavedText, setLastSavedText] = React.useState('Draft Saved 2m ago')
  const [isAutosaving, setIsAutosaving] = React.useState(false)

  // Reader Engagement State
  const [clapCount, setClapCount] = React.useState(342)
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [isFollowing, setIsFollowing] = React.useState(false)
  const [readerFontSize, setReaderFontSize] = React.useState<'normal' | 'large'>('normal')

  // Toolbar Formatter State
  const [activeTextStyle, setActiveTextStyle] = React.useState<TextStyle>('paragraph')
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = React.useState(false)

  const [isBoldActive, setIsBoldActive] = React.useState(false)
  const [isItalicActive, setIsItalicActive] = React.useState(false)
  const [isUnderlineActive, setIsUnderlineActive] = React.useState(false)
  const [isStrikeActive, setIsStrikeActive] = React.useState(false)
  const [isInlineCodeActive, setIsInlineCodeActive] = React.useState(false)

  // Active Block Elements in Canvas
  const [calloutType, setCalloutType] = React.useState<CalloutType>('tip')
  const [isCodeBlockCopied, setIsCodeBlockCopied] = React.useState(false)
  const [activeCodeTab, setActiveCodeTab] = React.useState<'json' | 'bash'>('json')

  // Modals / Drawers
  const [isPublishModalOpen, setIsPublishModalOpen] = React.useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false)
  const [isPublishedSuccess, setIsPublishedSuccess] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState('https://uipkge.dev')
  const [linkText, setLinkText] = React.useState('unbundled registry architecture')

  // Publish Settings State
  const [publishTags, setPublishTags] = React.useState([
    'Web Development',
    'Design Systems',
    'Vue',
    'React',
    'Frontend',
  ])
  const [newTagInput, setNewTagInput] = React.useState('')
  const [canonicalUrl, setCanonicalUrl] = React.useState('https://theengineeringdigest.io/p/unbundled-ui-registries')
  const [seoDescription, setSeoDescription] = React.useState(
    'A deep dive into why copy-paste UI component registries like shadcn and uipkge are displacing monolithic npm component libraries across engineering teams.',
  )
  const [sendNewsletter, setSendNewsletter] = React.useState(true)
  const [publishSchedule, setPublishSchedule] = React.useState<'now' | 'schedule'>('now')

  // Toast Feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const toastTimerRef = React.useRef<any>(null)

  const showToast = React.useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastMessage(msg)
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }, [])

  // Word Count and Reading Metrics Calculation
  const wordCount = React.useMemo(() => {
    const fullText = `${articleTitle} ${articleSubtitle} For nearly a decade the standard recipe for building a frontend design system was predictable spin up a private or public npm monorepo bundle fifty UI components with Rollup or Vite and force every application team to install as a heavyweight runtime dependency The component registry model inverts this entire dynamic Instead of consuming a closed npm black box developers pull atomic clean TypeScript source files directly into their repository Zero Runtime Overhead Direct Accessibility Ownership Native Token Sync`
    const words = fullText.trim().split(/\s+/).filter(Boolean)
    return words.length + 1380
  }, [articleTitle, articleSubtitle])

  const readingTimeMinutes = React.useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 220))
  }, [wordCount])

  function triggerManualSave() {
    setIsAutosaving(true)
    setLastSavedText('Saving changes...')
    setTimeout(() => {
      setIsAutosaving(false)
      setLastSavedText('Draft Saved just now')
      showToast('All draft changes saved to cloud.')
    }, 600)
  }

  function handleAddTag() {
    const trimmed = newTagInput.trim()
    if (trimmed && !publishTags.includes(trimmed)) {
      setPublishTags((prev) => [...prev, trimmed])
      setNewTagInput('')
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setPublishTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  function copyCodeSnippet() {
    setIsCodeBlockCopied(true)
    showToast('Code snippet copied to clipboard!')
    setTimeout(() => {
      setIsCodeBlockCopied(false)
    }, 2000)
  }

  function handlePublish() {
    setIsPublishModalOpen(false)
    setIsPublishedSuccess(true)
    showToast('🎉 Story published successfully to The Engineering Digest!')
  }

  function insertCallout(type: CalloutType) {
    setCalloutType(type)
    showToast(`Applied ${type.toUpperCase()} callout formatting.`)
  }

  function handleAiAssist() {
    showToast('✨ AI polished paragraph for conciseness and punchy cadence.')
  }

  return (
    <div data-slot="article-editor-toolbar" className={cn('bg-background text-foreground min-h-screen', className)}>
      {/* Top Sticky Application Header Bar */}
      <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 overflow-x-auto px-4 sm:px-6">
          {/* Left: Publication & Save Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                <BookOpen className="size-4" />
              </div>
              <div className="hidden min-w-0 truncate whitespace-nowrap sm:block">
                <span className="text-foreground text-sm font-semibold tracking-tight">{publicationName}</span>
                <span className="text-muted-foreground ml-1.5 text-xs">/ Editor</span>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden h-4 sm:block" />

            {/* Autosave Status Badge */}
            <button
              type="button"
              className="hover:bg-muted/60 text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors"
              onClick={triggerManualSave}
              title="Click to save now"
            >
              {!isAutosaving ? (
                <Cloud className="size-3.5 text-emerald-500" />
              ) : (
                <RotateCcw className="size-3.5 animate-spin text-amber-500" />
              )}
              <span className="hidden md:inline">{lastSavedText}</span>
              <span className="md:hidden">Saved</span>
            </button>
          </div>

          {/* Center: Live Story Statistics */}
          <div className="text-muted-foreground hidden items-center gap-2 text-xs md:flex">
            <Badge variant="outline" className="font-normal">
              {wordCount.toLocaleString()} words
            </Badge>
            <span>·</span>
            <span>{readingTimeMinutes} min read</span>
          </div>

          {/* Right: Actions & Publishing Controls */}
          <div className="flex items-center gap-2">
            {/* Undo / Redo controls */}
            <div className="hidden items-center gap-0.5 sm:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Undo action')}
                title="Undo (⌘Z)"
              >
                <Undo2 className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Redo action')}
                title="Redo (⇧⌘Z)"
              >
                <Redo2 className="size-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="hidden h-4 sm:block" />

            {/* Preview Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 text-xs font-medium',
                isPreviewMode && 'bg-secondary text-secondary-foreground border-primary/40',
              )}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="size-3.5" />
              <span>{isPreviewMode ? 'Edit Story' : 'Preview Article'}</span>
            </Button>

            {/* Publish Story Primary Button */}
            <Button
              aria-label="Close publish modal"
              size="sm"
              className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
              onClick={() => setIsPublishModalOpen(true)}
            >
              <Send className="size-3.5" />
              <span>Publish Story</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Floating / Sticky Formatting Toolbar (Only in Editor Mode) */}
      {!isPreviewMode && (
        <div className="sticky top-16 z-30 mx-auto mt-4 max-w-3xl px-4 transition-all duration-200">
          <div className="border-border bg-card/95 flex flex-wrap items-center justify-between gap-1 rounded-xl border p-1.5 shadow-sm backdrop-blur-md">
            {/* Group 1: Typography Block Selector */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground hover:bg-muted h-8 gap-1 px-2 text-xs font-medium"
                  onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
                >
                  <Type className="text-muted-foreground size-3.5" />
                  <span className="capitalize">
                    {activeTextStyle === 'paragraph' ? 'Normal Text' : activeTextStyle.toUpperCase()}
                  </span>
                  <ChevronDown className="text-muted-foreground size-3" />
                </Button>

                {/* Text Style Dropdown */}
                {isStyleDropdownOpen && (
                  <div className="border-border bg-popover absolute top-full left-0 z-50 mt-1.5 w-40 rounded-lg border p-1 shadow-md">
                    <button
                      type="button"
                      className={cn(
                        'hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                        activeTextStyle === 'paragraph'
                          ? 'text-primary bg-muted/60 font-semibold'
                          : 'text-popover-foreground',
                      )}
                      onClick={() => {
                        setActiveTextStyle('paragraph')
                        setIsStyleDropdownOpen(false)
                      }}
                    >
                      <span>Paragraph</span>
                      <span className="text-muted-foreground text-xs uppercase">Body</span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                        activeTextStyle === 'h1' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground',
                      )}
                      onClick={() => {
                        setActiveTextStyle('h1')
                        setIsStyleDropdownOpen(false)
                      }}
                    >
                      <span className="text-sm font-bold">Heading 1</span>
                      <span className="text-muted-foreground text-xs">H1</span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                        activeTextStyle === 'h2' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground',
                      )}
                      onClick={() => {
                        setActiveTextStyle('h2')
                        setIsStyleDropdownOpen(false)
                      }}
                    >
                      <span className="text-xs font-semibold">Heading 2</span>
                      <span className="text-muted-foreground text-xs">H2</span>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'hover:bg-muted flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors',
                        activeTextStyle === 'h3' ? 'text-primary bg-muted/60 font-semibold' : 'text-popover-foreground',
                      )}
                      onClick={() => {
                        setActiveTextStyle('h3')
                        setIsStyleDropdownOpen(false)
                      }}
                    >
                      <span className="text-xs font-medium">Heading 3</span>
                      <span className="text-muted-foreground text-xs">H3</span>
                    </button>
                  </div>
                )}
              </div>

              <Separator orientation="vertical" className="mx-0.5 h-4" />

              {/* Group 2: Inline Formatting */}
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8 transition-colors',
                    isBoldActive ? 'bg-muted text-primary font-bold' : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setIsBoldActive(!isBoldActive)
                    showToast(!isBoldActive ? 'Bold applied' : 'Bold removed')
                  }}
                  title="Bold (⌘B)"
                >
                  <Bold className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8 transition-colors',
                    isItalicActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setIsItalicActive(!isItalicActive)
                    showToast(!isItalicActive ? 'Italic applied' : 'Italic removed')
                  }}
                  title="Italic (⌘I)"
                >
                  <Italic className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8 transition-colors',
                    isUnderlineActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setIsUnderlineActive(!isUnderlineActive)
                    showToast(!isUnderlineActive ? 'Underline applied' : 'Underline removed')
                  }}
                  title="Underline (⌘U)"
                >
                  <Underline className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8 transition-colors',
                    isStrikeActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setIsStrikeActive(!isStrikeActive)
                    showToast('Strikethrough toggled')
                  }}
                  title="Strikethrough (⇧⌘X)"
                >
                  <Strikethrough className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'size-8 transition-colors',
                    isInlineCodeActive
                      ? 'bg-muted text-primary font-mono'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => {
                    setIsInlineCodeActive(!isInlineCodeActive)
                    showToast('Inline code toggled')
                  }}
                  title="Inline Code (⌘E)"
                >
                  <Code className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground size-8"
                  onClick={() => setIsLinkModalOpen(true)}
                  title="Insert Link (⌘K)"
                >
                  <Link2 className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Group 3: Block Elements & Media */}
            <div className="flex items-center gap-1">
              <Separator orientation="vertical" className="mx-0.5 h-4" />

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Blockquote formatted')}
                title="Blockquote (⌘⇧.)"
              >
                <Quote className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() =>
                  insertCallout(calloutType === 'tip' ? 'warning' : calloutType === 'warning' ? 'info' : 'tip')
                }
                title="Toggle Callout Box"
              >
                <Lightbulb className="size-3.5 text-amber-500" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Code block activated')}
                title="Code Block (```)"
              >
                <FileCode className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Bullet list toggled')}
                title="Bullet List (⌘⇧8)"
              >
                <List className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Numbered list toggled')}
                title="Numbered List (⌘⇧7)"
              >
                <ListOrdered className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Horizontal divider inserted')}
                title="Divider (---)"
              >
                <Minus className="size-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Image upload dialog simulated')}
                title="Upload Media"
              >
                <ImageIcon className="size-3.5" />
              </Button>

              <Separator orientation="vertical" className="mx-0.5 h-4" />

              {/* AI Polish Action */}
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 h-8 gap-1 px-2 text-xs font-medium"
                onClick={handleAiAssist}
                title="AI Writing Assistant"
              >
                <Sparkles className="size-3.5" />
                <span className="hidden sm:inline">AI Assist</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN ARTICLE DRAFTING CANVAS / READER PREVIEW */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* PUBLISHED SUCCESS BANNER */}
        {isPublishedSuccess && (
          <div className="mb-8 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-950 dark:text-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-semibold">Story Live on The Engineering Digest</p>
                <p className="text-muted-foreground text-xs">URL: {canonicalUrl}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setIsPublishedSuccess(false)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* ARTICLE HEADER */}
        <article className="space-y-6">
          {/* Topic Category Tag */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 text-xs font-medium tracking-wide">
              <Tag className="text-muted-foreground size-3" />
              {topicTag}
            </Badge>

            {isPreviewMode && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-muted-foreground h-7 text-xs',
                    readerFontSize === 'large' && 'bg-muted text-foreground',
                  )}
                  onClick={() => setReaderFontSize(readerFontSize === 'normal' ? 'large' : 'normal')}
                >
                  <Type className="mr-1 size-3" />
                  {readerFontSize === 'large' ? 'Standard text' : 'Larger text'}
                </Button>
              </div>
            )}
          </div>

          {/* Article Title */}
          {!isPreviewMode ? (
            <div className="space-y-2">
              <Textarea
                value={articleTitle}
                onValueChange={(v) => setArticleTitle(v)}
                rows={2}
                className="text-foreground placeholder:text-muted-foreground/40 w-full resize-none border-0 bg-transparent p-0 text-3xl font-bold tracking-tight focus-visible:ring-0 focus-visible:outline-hidden sm:text-4xl lg:text-5xl"
                placeholder="Title..."
              />
            </div>
          ) : (
            <h1
              className={cn(
                'text-foreground text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl',
                readerFontSize === 'large' && 'text-4xl sm:text-5xl lg:text-6xl',
              )}
            >
              {articleTitle}
            </h1>
          )}

          {/* Article Subtitle */}
          {!isPreviewMode ? (
            <div>
              <Textarea
                value={articleSubtitle}
                onValueChange={(v) => setArticleSubtitle(v)}
                rows={2}
                className="text-muted-foreground placeholder:text-muted-foreground/40 w-full resize-none border-0 bg-transparent p-0 text-lg font-normal focus-visible:ring-0 focus-visible:outline-hidden sm:text-xl"
                placeholder="Add a subtitle..."
              />
            </div>
          ) : (
            <p
              className={cn(
                'text-muted-foreground text-lg leading-relaxed font-normal sm:text-xl',
                readerFontSize === 'large' && 'text-xl sm:text-2xl',
              )}
            >
              {articleSubtitle}
            </p>
          )}

          {/* Author / Byline Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                AR
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm font-semibold">{authorName}</span>
                  <span className="text-muted-foreground text-xs">{authorHandle}</span>
                  {isPreviewMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10 h-6 px-2 text-xs"
                      onClick={() => {
                        setIsFollowing(!isFollowing)
                        showToast(!isFollowing ? 'Following Alex Rivera' : 'Unfollowed')
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  Published in <span className="text-foreground font-medium">{publicationName}</span> · Oct 24, 2024 ·{' '}
                  {readingTimeMinutes} min read
                </p>
              </div>
            </div>

            {/* Social / Reader actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 gap-1.5 text-xs"
                onClick={() => showToast('Audio version playing (6 min narration)')}
              >
                <Volume2 className="size-3.5" />
                <span className="hidden sm:inline">Listen</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn('text-muted-foreground hover:text-foreground size-8', isBookmarked && 'text-primary')}
                onClick={() => {
                  setIsBookmarked(!isBookmarked)
                  showToast(!isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks')
                }}
                title="Bookmark story"
              >
                <Bookmark className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => showToast('Link copied to clipboard')}
                title="Share article"
              >
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* ARTICLE BODY PROSE */}
          <div
            className={cn(
              'text-foreground space-y-6 leading-relaxed',
              readerFontSize === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg',
            )}
          >
            {/* Paragraph 1 */}
            <p>
              For nearly a decade, the standard recipe for building a frontend design system was predictable: spin up a
              private or public npm monorepo, bundle fifty UI components with Rollup or Vite, and force every
              application team to install{' '}
              <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                @acme/design-system
              </code>{' '}
              as a heavyweight runtime dependency.
            </p>

            {/* Stylized Callout Box */}
            <div
              className={cn(
                'my-8 rounded-xl border p-4.5 transition-colors sm:p-5',
                calloutType === 'tip'
                  ? 'text-foreground border-amber-500/30 bg-amber-500/10'
                  : calloutType === 'warning'
                    ? 'text-foreground border-rose-500/30 bg-rose-500/10'
                    : 'text-foreground border-blue-500/30 bg-blue-500/10',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {calloutType === 'tip' ? (
                    <Lightbulb className="size-5 text-amber-600 dark:text-amber-400" />
                  ) : calloutType === 'warning' ? (
                    <AlertTriangle className="size-5 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <Info className="size-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold tracking-tight">
                      {calloutType === 'tip'
                        ? 'Key Architectural Takeaway'
                        : calloutType === 'warning'
                          ? 'Dependency Fragility Warning'
                          : 'Registry Distribution Note'}
                    </h4>
                    {!isPreviewMode && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className={cn(
                            'text-muted-foreground hover:text-foreground min-h-6 rounded px-1.5 py-0.5 text-xs',
                            calloutType === 'tip' && 'text-foreground font-semibold',
                          )}
                          onClick={() => setCalloutType('tip')}
                        >
                          Tip
                        </button>
                        <button
                          type="button"
                          className={cn(
                            'text-muted-foreground hover:text-foreground min-h-6 rounded px-1.5 py-0.5 text-xs',
                            calloutType === 'warning' && 'text-foreground font-semibold',
                          )}
                          onClick={() => setCalloutType('warning')}
                        >
                          Warn
                        </button>
                        <button
                          type="button"
                          className={cn(
                            'text-muted-foreground hover:text-foreground min-h-6 rounded px-1.5 py-0.5 text-xs',
                            calloutType === 'info' && 'text-foreground font-semibold',
                          )}
                          onClick={() => setCalloutType('info')}
                        >
                          Info
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-normal">
                    When UI primitives are distributed via semver npm packages, updating a single button variant
                    requires a patch release, a dependency bump, and a potential cascade of peer-dependency conflicts
                    across twenty consuming micro-frontends.
                  </p>
                </div>
              </div>
            </div>

            {/* Subheading (H2) */}
            <h2 className="text-foreground pt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              1. The "Own Your Code" Revolution
            </h2>

            <p>
              The{' '}
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
              >
                {linkText}
              </a>{' '}
              inverts this dynamic completely. Instead of consuming a closed npm black box, developers pull atomic,
              clean TypeScript source files directly into their repository via CLI tools like{' '}
              <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">shadcn-vue</code> or{' '}
              <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">uipkge</code>.
            </p>

            {/* Syntax-Highlighted Code Block */}
            <div className="border-border bg-muted/40 my-6 overflow-hidden rounded-xl border font-mono text-xs shadow-xs">
              {/* Code Block Header */}
              <div className="border-border bg-card flex items-center justify-between border-b px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className={cn(
                      'flex min-h-6 items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors',
                      activeCodeTab === 'json'
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveCodeTab('json')}
                  >
                    <FileCode className="size-3.5 text-amber-500" />
                    components.json
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex min-h-6 items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors',
                      activeCodeTab === 'bash'
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveCodeTab('bash')}
                  >
                    <Terminal className="size-3.5 text-emerald-500" />
                    Terminal CLI
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-5 px-1.5 font-mono text-xs uppercase">
                    {activeCodeTab === 'json' ? 'JSON' : 'BASH'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                    onClick={copyCodeSnippet}
                  >
                    {isCodeBlockCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{isCodeBlockCopied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>

              {/* Code Content Area */}
              <div className="overflow-x-auto p-4 leading-relaxed">
                {activeCodeTab === 'json' ? (
                  <pre className="text-foreground/90">
                    <code>
                      <span className="text-muted-foreground">{'{'}</span>
                      {'\n  '}
                      <span className="text-primary font-semibold">"$schema"</span>:{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"https://uipkge.dev/schema.json"</span>,
                      {'\n  '}
                      <span className="text-primary font-semibold">"style"</span>:{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"new-york"</span>,{'\n  '}
                      <span className="text-primary font-semibold">"rsc"</span>:{' '}
                      <span className="text-amber-600 dark:text-amber-400">true</span>,{'\n  '}
                      <span className="text-primary font-semibold">"aliases"</span>:{' '}
                      <span className="text-muted-foreground">{'{'}</span>
                      {'\n    '}
                      <span className="text-primary">"components"</span>:{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"@/components/ui"</span>,{'\n    '}
                      <span className="text-primary">"utils"</span>:{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"@/lib/utils"</span>,{'\n    '}
                      <span className="text-primary">"blocks"</span>:{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">"@/components/blocks"</span>
                      {'\n  '}
                      <span className="text-muted-foreground">{'}'}</span>
                      {'\n'}
                      <span className="text-muted-foreground">{'}'}</span>
                    </code>
                  </pre>
                ) : (
                  <pre className="text-foreground/90">
                    <code>
                      <span className="text-muted-foreground"># Add rich article drafting block to your project</span>
                      {'\n'}
                      <span className="text-primary font-semibold">npx</span> shadcn-vue@latest add
                      https://uipkge.dev/r/vue/article-editor-toolbar.json{' '}
                      <span className="text-emerald-600 dark:text-emerald-400">-y</span>
                    </code>
                  </pre>
                )}
              </div>
            </div>

            {/* Stylized Blockquote */}
            <blockquote className="border-primary bg-muted/20 my-8 rounded-r-lg border-l-4 py-3 pr-4 pl-6 italic">
              <p className="text-foreground/90 text-base font-medium sm:text-lg">
                "The component registry model inverts the dependency tree. Instead of depending on an external
                maintainer's release cadence, your team owns every line of component markup, adapting it to your
                product's exact accessibility and branding needs without vendor lock-in."
              </p>
              <footer className="text-muted-foreground mt-2 text-xs font-normal not-italic">
                — Guillermo Rauch, CEO at Vercel
              </footer>
            </blockquote>

            {/* Subheading (H2) */}
            <h2 className="text-foreground pt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              2. Core Architectural Advantages
            </h2>

            <p>
              When evaluating the switch from packaged distributions to registry generation, teams consistently report
              three major velocity unlocks:
            </p>

            {/* Numbered List */}
            <ol className="space-y-3 pl-1">
              <li className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  1
                </span>
                <div>
                  <strong className="text-foreground font-semibold">Zero Runtime Overhead:</strong>
                  <span className="text-muted-foreground ml-1">
                    Unused component variants and dead code branches are automatically pruned during application
                    tree-shaking.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  2
                </span>
                <div>
                  <strong className="text-foreground font-semibold">Direct Source Control:</strong>
                  <span className="text-muted-foreground ml-1">
                    Audit, modify, and patch WCAG accessibility tags directly inside your repository without waiting for
                    upstream PR merges.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  3
                </span>
                <div>
                  <strong className="text-foreground font-semibold">Native OKLCH Token Integration:</strong>
                  <span className="text-muted-foreground ml-1">
                    Colors and elevation variables adapt directly across modern Tailwind CSS v4 design systems.
                  </span>
                </div>
              </li>
            </ol>

            {/* Embedded Media Figure */}
            <div className="border-border bg-card my-8 overflow-hidden rounded-xl border shadow-xs">
              <div className="from-primary/10 via-muted to-primary/5 relative flex h-52 items-center justify-center bg-gradient-to-br sm:h-64">
                <div className="space-y-2 p-6 text-center">
                  <div className="bg-card border-border text-primary inline-flex size-12 items-center justify-center rounded-xl border shadow-xs">
                    <Layers className="size-6" />
                  </div>
                  <h4 className="text-foreground text-sm font-semibold">Unbundled Registry Architecture Flow</h4>
                  <p className="text-muted-foreground max-w-sm text-xs">
                    Registry CLI pulls atomic SFC files directly into src/components/ui
                  </p>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <Badge variant="outline" className="bg-card/80 text-xs backdrop-blur-xs">
                    Figure 1.0
                  </Badge>
                  <Button
                    aria-label="Expand media view"
                    variant="ghost"
                    size="icon"
                    className="bg-card/80 size-7 backdrop-blur-xs"
                    onClick={() => showToast('Expanded media view')}
                  >
                    <Maximize2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="border-border bg-card/60 border-t p-3">
                <p className="text-muted-foreground text-center text-xs italic">
                  Figure 1: Monolithic npm package distribution vs. direct registry source ownership.
                </p>
              </div>
            </div>

            {/* Section Divider */}
            <div className="text-muted-foreground my-10 flex items-center justify-center gap-2">
              <span className="bg-border size-1 rounded-full" />
              <span className="bg-muted-foreground/40 size-1.5 rounded-full" />
              <span className="bg-border size-1 rounded-full" />
            </div>

            {/* Summary Conclusion */}
            <p>
              The shift from monolithic npm packages to unbundled UI registries is not just a tooling trend; it
              represents a fundamental re-alignment of software ownership, empowering engineering teams to build
              resilient interfaces that evolve with their product.
            </p>
          </div>
        </article>

        {/* READER PREVIEW ENGAGEMENT FOOTER (When Preview Mode is Active) */}
        {isPreviewMode && (
          <div className="border-border bg-card/95 sticky bottom-6 z-30 mx-auto mt-12 max-w-lg rounded-full border p-2 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-foreground hover:text-primary flex min-h-6 items-center gap-1.5 text-xs font-semibold transition-colors"
                  onClick={() => {
                    setClapCount((prev) => prev + 1)
                    showToast(`Clapped! (${clapCount + 1} claps total)`)
                  }}
                >
                  <Heart className="size-4 fill-rose-500/20 text-rose-500" />
                  <span>{clapCount}</span>
                </button>

                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1.5 text-xs transition-colors"
                  onClick={() => showToast('Responses panel opened (24 responses)')}
                >
                  <MessageSquare className="size-4" />
                  <span>24</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground h-7 text-xs"
                  onClick={() => {
                    setIsBookmarked(!isBookmarked)
                    showToast(!isBookmarked ? 'Bookmarked' : 'Removed')
                  }}
                >
                  <Bookmark className={cn('mr-1 size-3.5', isBookmarked && 'fill-primary text-primary')} />
                  <span>Bookmark</span>
                </Button>
                <Button
                  aria-label="Close publish modal"
                  size="sm"
                  className="h-7 text-xs font-semibold"
                  onClick={() => setIsPublishModalOpen(true)}
                >
                  Publish
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PUBLISH SETTINGS MODAL / DIALOG */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <Card className="border-border bg-card animate-in fade-in-0 zoom-in-95 w-full max-w-xl shadow-sm duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Publish Story to Publication</CardTitle>
                <CardDescription className="text-xs">
                  Configure publication metadata, topic tags, and newsletter distribution.
                </CardDescription>
              </div>
              <Button
                aria-label="Close publish modal"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                onClick={() => setIsPublishModalOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-4 pt-0 text-sm">
              {/* Story Summary Card */}
              <div className="border-border bg-muted/30 rounded-lg border p-3">
                <h4 className="text-foreground line-clamp-1 text-sm font-semibold">{articleTitle}</h4>
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{articleSubtitle}</p>
                <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                  <span>Author: {authorName}</span>
                  <span>·</span>
                  <span>{wordCount} words</span>
                  <span>·</span>
                  <span>{readingTimeMinutes} min read</span>
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Topic Tags (up to 5)</label>
                <div className="border-input bg-background flex flex-wrap gap-1.5 rounded-lg border p-2">
                  {publishTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
                      {tag}
                      <button
                        aria-label={`Remove tag ${tag}`}
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                  <input
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    type="text"
                    className="placeholder:text-muted-foreground min-w-[100px] flex-1 border-0 bg-transparent p-0 text-xs focus:ring-0 focus:outline-hidden"
                    placeholder="Add a tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                </div>
              </div>

              {/* SEO Meta Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-foreground text-xs font-medium">SEO Meta Description</label>
                  <span className="text-muted-foreground text-xs">{seoDescription.length}/160</span>
                </div>
                <Textarea
                  value={seoDescription}
                  onValueChange={(v) => setSeoDescription(v)}
                  rows={2}
                  className="resize-none text-xs"
                  placeholder="Brief summary for search engines and social cards..."
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Canonical URL</label>
                <Input
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              {/* Newsletter Distribution Toggle */}
              <div className="border-border bg-muted/20 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <p className="text-foreground text-xs font-semibold">Broadcast to Subscribers</p>
                  <p className="text-muted-foreground text-xs">
                    Send as an instant newsletter email to 14,200 active readers.
                  </p>
                </div>
                <input
                  checked={sendNewsletter}
                  onChange={(e) => setSendNewsletter(e.target.checked)}
                  type="checkbox"
                  className="border-border accent-primary size-4 cursor-pointer rounded"
                />
              </div>

              {/* Schedule Options */}
              <div className="flex items-center gap-4 text-xs">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    checked={publishSchedule === 'now'}
                    onChange={() => setPublishSchedule('now')}
                    type="radio"
                    value="now"
                    name="schedule"
                    className="accent-primary cursor-pointer"
                  />
                  <span className="text-foreground font-medium">Publish Now</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    checked={publishSchedule === 'schedule'}
                    onChange={() => setPublishSchedule('schedule')}
                    type="radio"
                    value="schedule"
                    name="schedule"
                    className="accent-primary cursor-pointer"
                  />
                  <span className="text-muted-foreground">Schedule for later</span>
                </label>
              </div>
            </CardContent>

            <CardFooter className="border-border flex items-center justify-end gap-2 border-t pt-4">
              <Button
                aria-label="Close publish modal"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setIsPublishModalOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" className="gap-1.5 text-xs font-semibold shadow-xs" onClick={handlePublish}>
                <Send className="size-3.5" />
                <span>{publishSchedule === 'now' ? 'Confirm & Publish Now' : 'Schedule Story'}</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* INSERT LINK MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <Card className="border-border bg-card w-full max-w-sm shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Insert Hyperlink</CardTitle>
              <CardDescription className="text-xs">Add an external reference link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs">Link Text</label>
                <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs">Destination URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="h-8 font-mono text-xs"
                  placeholder="https://"
                />
              </div>
            </CardContent>
            <CardFooter className="border-border flex items-center justify-end gap-2 border-t pt-3">
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setIsLinkModalOpen(false)
                  showToast('Link inserted successfully!')
                }}
              >
                Apply Link
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* INTERACTIVE TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="border-border bg-popover text-popover-foreground animate-in fade-in slide-in-from-bottom-2 fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-medium shadow-lg duration-150">
          <Check className="text-primary size-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default ArticleEditorToolbar
