'use client'

import * as React from 'react'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileCode2,
  FileText,
  Layers,
  Maximize2,
  MessageSquare,
  MessageSquareQuote,
  Minimize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Search,
  Sparkles,
  Subtitles,
  ThumbsUp,
  Trash2,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export interface TranscriptItem {
  id: string
  start: number
  end: number
  speaker: string
  text: string
}

export interface NoteItem {
  id: string
  timestamp: number
  text: string
  createdAt: string
}

export interface QuestionItem {
  id: string
  timestamp: number
  author: string
  avatar: string
  question: string
  upvotes: number
  hasUpvoted?: boolean
  answer?: {
    author: string
    role: string
    text: string
    isInstructor?: boolean
  }
}

const initialTranscript: TranscriptItem[] = [
  {
    id: 't-1',
    start: 0,
    end: 75,
    speaker: 'Sarah Connor',
    text: 'Welcome back! In this lesson, we are tackling one of the trickiest parts of design systems: building resilient dark-mode token palettes using the OKLCH color space.',
  },
  {
    id: 't-2',
    start: 75,
    end: 220,
    speaker: 'Sarah Connor',
    text: 'Why do traditional HSL and sRGB color models fall short? Because perceptual brightness is non-uniform — pure blue at 50% lightness looks vastly darker to the human eye than pure yellow at 50% lightness.',
  },
  {
    id: 't-3',
    start: 220,
    end: 384,
    speaker: 'Sarah Connor',
    text: 'OKLCH solves this by decoupling perceived lightness (L) from chroma (C) and hue (H). When you step lightness down by 10%, the perceived luminance decreases identically regardless of hue angle.',
  },
  {
    id: 't-4',
    start: 384,
    end: 555,
    speaker: 'Sarah Connor',
    text: 'When calculating contrast in OKLCH, lightness is perceptually uniform across hues, which prevents dark-mode contrast crushing. Notice our formula on the slide.',
  },
  {
    id: 't-5',
    start: 555,
    end: 750,
    speaker: 'Sarah Connor',
    text: 'Next, let us discuss wide-gamut Display P3 displays. While P3 provides 25% richer saturation, we must ensure automatic fallback clamping for legacy sRGB monitors.',
  },
  {
    id: 't-6',
    start: 750,
    end: 945,
    speaker: 'Sarah Connor',
    text: 'In dark mode, human retinas are more sensitive to intense chroma saturation on dark surfaces. A solid heuristic is to reduce chroma by 15% to 20% on OLED dark backgrounds.',
  },
  {
    id: 't-7',
    start: 945,
    end: 1120,
    speaker: 'Sarah Connor',
    text: 'To wrap up, download the starter configuration below. In the next lesson, we will wire these token variables directly into our Tailwind CSS v4 @theme inline directives.',
  },
]

const initialNotes: NoteItem[] = [
  {
    id: 'n-1',
    timestamp: 102, // 01:42
    text: 'Pure blue vs pure yellow in HSL: huge luminance mismatch. OKLCH fixes this at the root.',
    createdAt: '2 hours ago',
  },
  {
    id: 'n-2',
    timestamp: 252, // 04:12
    text: 'Review color-mix in oklab formulas — can generate surface elevation tints with a single token!',
    createdAt: '1 hour ago',
  },
  {
    id: 'n-3',
    timestamp: 384, // 06:24
    text: 'Lightness rule: Keep L >= 0.70 for primary brand text on dark surfaces to guarantee APCA Lc 60 minimum.',
    createdAt: 'Just now',
  },
]

const initialQuestions: QuestionItem[] = [
  {
    id: 'q-1',
    timestamp: 225, // 03:45
    author: 'David K.',
    avatar: 'DK',
    question: 'Is browser support for OKLCH color-mix and raw oklch() ready for enterprise SaaS applications?',
    upvotes: 18,
    hasUpvoted: false,
    answer: {
      author: 'Sarah Connor',
      role: 'Instructor',
      isInstructor: true,
      text: 'Yes! OKLCH has 98%+ global browser support across all evergreen browsers. Tailwind CSS v4 uses it as the default token format natively.',
    },
  },
  {
    id: 'q-2',
    timestamp: 380, // 06:20
    author: 'Elena R.',
    avatar: 'ER',
    question: 'How do you prevent high chroma vibration on dark OLED zinc-950 surfaces?',
    upvotes: 12,
    hasUpvoted: false,
    answer: {
      author: 'Sarah Connor',
      role: 'Instructor',
      isInstructor: true,
      text: 'Scale down chroma by multiplying C * 0.82 on dark tokens, while boosting lightness by +0.08 to preserve legibility without glare.',
    },
  },
]

const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function LessonVideoPlayer() {
  // Video Playback State
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(384) // 06:24
  const [totalDuration] = React.useState(1120) // 18:40
  const [bufferedPercent] = React.useState(78)
  const [volume] = React.useState(85)
  const [isMuted, setIsMuted] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.25)
  const [showCaptions, setShowCaptions] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('transcript')
  const [transcriptSearch, setTranscriptSearch] = React.useState('')
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [copiedAsset, setCopiedAsset] = React.useState<string | null>(null)

  // Notes and Q&A state
  const [notesList, setNotesList] = React.useState<NoteItem[]>(initialNotes)
  const [newNoteText, setNewNoteText] = React.useState('')
  const [questionsList, setQuestionsList] = React.useState<QuestionItem[]>(initialQuestions)
  const [newQuestionText, setNewQuestionText] = React.useState('')

  // Video interval timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev < totalDuration) {
            return prev + 1
          }
          setIsPlaying(false)
          return prev
        })
      }, 1000 / playbackSpeed)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, playbackSpeed, totalDuration])

  const formattedCurrentTime = formatTime(currentTime)
  const formattedTotalTime = formatTime(totalDuration)
  const progressPercent = (currentTime / totalDuration) * 100

  const seekTo = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(seconds, totalDuration)))
  }

  const handleSeekClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, clickX / rect.width))
    seekTo(Math.round(ratio * totalDuration))
  }

  const skipSeconds = (delta: number) => {
    seekTo(currentTime + delta)
  }

  const cycleSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackSpeed)
    const nextIndex = (currentIndex + 1) % speedOptions.length
    setPlaybackSpeed(speedOptions[nextIndex])
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const activeTranscriptItem =
    initialTranscript.find((item) => currentTime >= item.start && currentTime < item.end) || initialTranscript[0]

  const filteredTranscript = initialTranscript.filter((item) => {
    const query = transcriptSearch.trim().toLowerCase()
    if (!query) return true
    return item.text.toLowerCase().includes(query) || item.speaker.toLowerCase().includes(query)
  })

  const handleAddNote = () => {
    const text = newNoteText.trim()
    if (!text) return
    setNotesList([
      {
        id: `note-${Date.now()}`,
        timestamp: currentTime,
        text,
        createdAt: 'Just now',
      },
      ...notesList,
    ])
    setNewNoteText('')
  }

  const handleDeleteNote = (id: string) => {
    setNotesList((prev) => prev.filter((n) => n.id !== id))
  }

  const handleAddQuestion = () => {
    const text = newQuestionText.trim()
    if (!text) return
    setQuestionsList([
      {
        id: `q-${Date.now()}`,
        timestamp: currentTime,
        author: 'You (Student)',
        avatar: 'ME',
        question: text,
        upvotes: 1,
        hasUpvoted: true,
      },
      ...questionsList,
    ])
    setNewQuestionText('')
  }

  const toggleUpvote = (id: string) => {
    setQuestionsList((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const hasUpvoted = !q.hasUpvoted
          return {
            ...q,
            hasUpvoted,
            upvotes: hasUpvoted ? q.upvotes + 1 : q.upvotes - 1,
          }
        }
        return q
      }),
    )
  }

  const handleCopyAsset = (name: string) => {
    setCopiedAsset(name)
    setTimeout(() => {
      setCopiedAsset(null)
    }, 2000)
  }

  return (
    <div data-slot="lesson-video-player" className="bg-background text-foreground w-full space-y-5">
      {/* Top Lesson Navigation & Course Header Bar */}
      <header className="bg-card rounded-xl border p-4 shadow-xs sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left: Course Context & Lesson Title */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Design Systems with Tailwind CSS v4</span>
              <ChevronRight className="text-muted-foreground size-3.5" />
              <Badge variant="outline" className="gap-1 text-xs font-semibold">
                <Layers className="text-primary size-3" />
                <span>Module 1: Design Tokens Architecture</span>
              </Badge>
              <span className="text-muted-foreground hidden font-medium sm:inline">Lesson 4 of 12</span>
            </div>

            <h1 className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
              Lesson 4: Building Resilient OKLCH Dark-Mode Token Palettes
            </h1>
          </div>

          {/* Right: Progress Indicator & Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Course Progress Pill */}
            <div className="bg-muted/40 hidden items-center gap-2 rounded-lg border px-3 py-1.5 sm:flex">
              <div className="space-y-1 text-right">
                <div className="text-muted-foreground text-xs font-medium">Module Progress</div>
                <div className="font-mono text-xs font-bold tabular-nums">4/12 (33%)</div>
              </div>
              <div className="w-12">
                <Progress value={33} className="h-1.5" />
              </div>
            </div>

            {/* Bookmark Button */}
            <Button
              variant="outline"
              size="icon"
              className="size-8.5"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              {isBookmarked ? (
                <BookmarkCheck className="text-primary size-4" />
              ) : (
                <Bookmark className="text-muted-foreground size-4" />
              )}
            </Button>

            {/* Complete Lesson Button */}
            <Button
              variant={isCompleted ? 'default' : 'outline'}
              size="sm"
              className="h-8.5 gap-1.5 text-xs font-semibold shadow-xs"
              onClick={() => setIsCompleted(!isCompleted)}
            >
              {isCompleted ? <CheckCircle2 className="size-3.5" /> : <Check className="size-3.5" />}
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </Button>

            {/* Next Lesson Button */}
            <Button variant="default" size="sm" className="h-8.5 gap-1.5 text-xs font-semibold shadow-xs">
              <span>Next Lesson</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* 2-Column Classroom Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Video Player Canvas + Takeaways & Downloads (8 cols) */}
        <section className="space-y-5 lg:col-span-8">
          {/* Video Screen Container (Dark Video Canvas) */}
          <div className="group relative flex min-h-[260px] w-full flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-white shadow-lg select-none">
            {/* Top Video Overlay Info Bar */}
            <div className="z-20 flex items-center justify-between p-3.5 sm:p-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-900/80 px-2 py-0.5 font-mono text-xs font-medium text-zinc-300 backdrop-blur-md"
                >
                  1080p 60fps HD
                </Badge>
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/20 text-primary-foreground px-2 py-0.5 text-xs font-semibold backdrop-blur-md"
                >
                  Lesson 4 / 12
                </Badge>
              </div>

              {/* Instructor Watermark */}
              <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300 backdrop-blur-md">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="font-medium">Sarah Connor</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400">Principal Design Engineer</span>
              </div>
            </div>

            {/* Video Presentation Slide & Diagram Visual */}
            <div className="relative my-auto flex flex-col items-center justify-center px-6 py-4 text-center">
              {/* Simulated Code & Color Token Slide Matrix */}
              <div className="relative w-full max-w-xl space-y-3 rounded-lg border border-zinc-800/80 bg-zinc-900/85 p-4 text-left shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-rose-500/80" />
                      <span className="size-2.5 rounded-full bg-amber-500/80" />
                      <span className="size-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-xs text-zinc-400">tokens.config.css — OKLCH Palette Engine</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-400"
                  >
                    APCA Lc 74 (AAA)
                  </Badge>
                </div>

                {/* Code Syntax Sample */}
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300">
                  <code>
                    <span className="text-zinc-500">/* OKLCH Perceptual Uniformity Matrix */</span>
                    {'\n'}
                    <span className="text-purple-400">@theme inline</span> {'{\n'}{' '}
                    <span className="text-cyan-400">--color-primary</span>:{' '}
                    <span className="text-amber-300">oklch(0.62 0.19 259.8)</span>;{' '}
                    <span className="text-zinc-500">/* Brand Base */</span>
                    {'\n'} <span className="text-cyan-400">--color-surface-dark</span>:{' '}
                    <span className="text-amber-300">oklch(0.18 0.02 260.0)</span>;{' '}
                    <span className="text-zinc-500">/* OLED Safe */</span>
                    {'\n'}
                    {'}'}
                  </code>
                </pre>

                {/* Color Palette Swatch Strip */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-zinc-400">Lightness Ramp:</span>
                  <div className="flex flex-1 items-center gap-1.5">
                    <div className="h-5 flex-1 rounded bg-[oklch(0.95_0.04_259.8)] shadow-xs" title="95% L" />
                    <div className="h-5 flex-1 rounded bg-[oklch(0.80_0.10_259.8)] shadow-xs" title="80% L" />
                    <div
                      className="h-5 flex-1 rounded bg-[oklch(0.62_0.19_259.8)] shadow-xs ring-1 ring-white/60"
                      title="62% L (Base)"
                    />
                    <div className="h-5 flex-1 rounded bg-[oklch(0.40_0.15_259.8)] shadow-xs" title="40% L" />
                    <div className="h-5 flex-1 rounded bg-[oklch(0.18_0.02_259.8)] shadow-xs" title="18% L (Dark)" />
                  </div>
                </div>
              </div>

              {/* Big Center Play / Pause Floating Button */}
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring absolute inset-0 m-auto flex size-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="size-6 fill-current" />
                ) : (
                  <Play className="ml-0.5 size-6 fill-current" />
                )}
              </button>
            </div>

            {/* Captions Subtitles Overlay Box */}
            {showCaptions && activeTranscriptItem && (
              <div className="z-20 mx-auto mb-1 max-w-xl rounded-lg border border-white/10 bg-black/80 px-4 py-1.5 text-center text-xs font-medium text-zinc-200 shadow-md backdrop-blur-md sm:text-sm">
                <span className="text-zinc-400">[{formatTime(activeTranscriptItem.start)}]</span>{' '}
                {activeTranscriptItem.text}
              </div>
            )}

            {/* Custom Player Controls Bar (Bottom Overlay) */}
            <div className="z-20 space-y-2 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-3 sm:px-4 sm:pt-4 sm:pb-3.5">
              {/* Scrubber Timeline Bar */}
              <div
                className="group/bar relative flex h-4 w-full cursor-pointer items-center"
                role="slider"
                aria-label="Video Timeline Scrubber"
                aria-valuenow={currentTime}
                aria-valuemin={0}
                aria-valuemax={totalDuration}
                onClick={handleSeekClick}
              >
                {/* Background Full Track */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800 transition-all group-hover/bar:h-2.5">
                  {/* Buffer Progress */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-zinc-700 transition-all"
                    style={{ width: `${bufferedPercent}%` }}
                  />
                  {/* Played Progress */}
                  <div
                    className="bg-primary absolute top-0 bottom-0 left-0 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Scrubber Dot Handle */}
                <div
                  className="bg-primary absolute size-3.5 -translate-x-1/2 rounded-full shadow-md ring-2 ring-white transition-transform group-hover/bar:scale-125"
                  style={{ left: `${progressPercent}%` }}
                />
              </div>

              {/* Controls Row: Play, Skip, Timestamps, Speed, Audio, Screen */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                {/* Left Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Play / Pause */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-white hover:bg-white/15"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="size-4.5 fill-current" />
                    ) : (
                      <Play className="size-4.5 fill-current" />
                    )}
                  </Button>

                  {/* 15s Rewind */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                    aria-label="Rewind 15 seconds"
                    onClick={() => skipSeconds(-15)}
                  >
                    <RotateCcw className="size-4" />
                  </Button>

                  {/* 15s Fast Forward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                    aria-label="Fast forward 15 seconds"
                    onClick={() => skipSeconds(15)}
                  >
                    <RotateCw className="size-4" />
                  </Button>

                  {/* Volume Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="size-4 text-rose-400" />
                    ) : volume < 50 ? (
                      <Volume1 className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                  </Button>

                  {/* Timestamp Display */}
                  <div className="flex items-center gap-1 font-mono text-xs font-semibold text-zinc-300 tabular-nums sm:ml-1">
                    <span className="text-white">{formattedCurrentTime}</span>
                    <span className="text-zinc-500">/</span>
                    <span className="text-zinc-400">{formattedTotalTime}</span>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Speed Selector Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 font-mono text-xs font-bold text-zinc-300 hover:bg-white/15 hover:text-white"
                    aria-label="Cycle Playback Speed"
                    onClick={cycleSpeed}
                  >
                    {playbackSpeed}x
                  </Button>

                  {/* Captions Subtitles Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`size-8 transition-colors ${
                      showCaptions
                        ? 'text-primary hover:bg-white/15'
                        : 'text-zinc-400 hover:bg-white/15 hover:text-white'
                    }`}
                    aria-label={showCaptions ? 'Hide Subtitles' : 'Show Subtitles'}
                    onClick={() => setShowCaptions(!showCaptions)}
                  >
                    <Subtitles className="size-4" />
                  </Button>

                  {/* Fullscreen Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-zinc-300 hover:bg-white/15 hover:text-white"
                    aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Key Takeaways & Downloadable Assets Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Key Takeaways Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-2.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight uppercase">
                    <Sparkles className="text-primary size-3.5" />
                    Key Takeaways
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    OKLCH v4
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Essential architectural concepts taught in this lecture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <div className="bg-muted/30 flex items-start gap-2.5 rounded-lg border p-2.5">
                  <div className="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    1
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">Perceptual Uniformity:</span>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      OKLCH lightness remains constant across all hues, maintaining predictable contrast ratios across
                      both dark and light palettes.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 flex items-start gap-2.5 rounded-lg border p-2.5">
                  <div className="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">Display P3 Gamut Clamping:</span>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      Leverage vibrant P3 color gamuts on supported displays while automatically fallback-clamping for
                      sRGB displays.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 flex items-start gap-2.5 rounded-lg border p-2.5">
                  <div className="bg-primary/10 text-primary mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    3
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">Chroma Scaling in Dark Mode:</span>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      Scale down chroma by 15-20% on deep dark backgrounds to prevent ocular fatigue and visual
                      vibration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Downloadable Source Code & Assets Card */}
            <Card className="shadow-xs">
              <CardHeader className="pb-2.5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight uppercase">
                    <FileCode2 className="text-primary size-3.5" />
                    Lesson Assets & Code
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    3 Files
                  </Badge>
                </div>
                <CardDescription className="text-xs">Starter boilerplate and token configuration files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {/* Asset 1 */}
                <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2.5 transition-colors">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold">
                      TS
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-semibold">tokens.config.ts</p>
                      <p className="text-muted-foreground font-mono text-xs">14.2 KB · Tailwind v4 Theme</p>
                    </div>
                  </div>
                  <Button
                    aria-label="Download attachment"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => handleCopyAsset('tokens.config.ts')}
                  >
                    {copiedAsset === 'tokens.config.ts' ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Download className="size-3" />
                    )}
                    <span>{copiedAsset === 'tokens.config.ts' ? 'Saved' : 'Download'}</span>
                  </Button>
                </div>

                {/* Asset 2 */}
                <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2.5 transition-colors">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      FIG
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-semibold">palette-matrix.fig</p>
                      <p className="text-muted-foreground font-mono text-xs">4.8 MB · Token Library</p>
                    </div>
                  </div>
                  <Button
                    aria-label="Download attachment"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => handleCopyAsset('palette-matrix.fig')}
                  >
                    {copiedAsset === 'palette-matrix.fig' ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Download className="size-3" />
                    )}
                    <span>{copiedAsset === 'palette-matrix.fig' ? 'Saved' : 'Download'}</span>
                  </Button>
                </div>

                {/* Asset 3 */}
                <div className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2.5 transition-colors">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-rose-500/10 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-semibold">apca-contrast-guide.pdf</p>
                      <p className="text-muted-foreground font-mono text-xs">1.1 MB · Cheat Sheet</p>
                    </div>
                  </div>
                  <Button
                    aria-label="Download attachment"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    onClick={() => handleCopyAsset('apca-contrast-guide.pdf')}
                  >
                    {copiedAsset === 'apca-contrast-guide.pdf' ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Download className="size-3" />
                    )}
                    <span>{copiedAsset === 'apca-contrast-guide.pdf' ? 'Saved' : 'Download'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Right Column: Interactive Transcript & Notes Workspace (4 cols) */}
        <aside className="flex flex-col lg:col-span-4">
          <Card className="flex h-full flex-col overflow-hidden shadow-xs">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
              {/* Tabs Navigation Header */}
              <div className="bg-muted/30 border-b p-2.5">
                <TabsList className="grid h-8.5 w-full grid-cols-3">
                  <TabsTrigger value="transcript" className="gap-1 text-xs font-medium">
                    <FileText className="size-3" />
                    <span>Transcript</span>
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="gap-1 text-xs font-medium">
                    <BookmarkCheck className="size-3" />
                    <span>Notes</span>
                    <Badge variant="secondary" className="ml-0.5 px-1 py-0 text-xs">
                      {notesList.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="qa" className="gap-1 text-xs font-medium">
                    <MessageSquareQuote className="size-3" />
                    <span>Q&A</span>
                    <Badge variant="secondary" className="ml-0.5 px-1 py-0 text-xs">
                      {questionsList.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TAB 1: Interactive Transcript */}
              <TabsContent value="transcript" className="m-0 flex flex-1 flex-col focus-visible:outline-none">
                {/* Search Transcript Filter */}
                <div className="border-b p-3">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
                    <Input
                      value={transcriptSearch}
                      onChange={(e) => setTranscriptSearch(e.target.value)}
                      placeholder="Search lecture transcript..."
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                </div>

                {/* Transcript Segments List */}
                <div className="max-h-[580px] flex-1 space-y-2.5 overflow-y-auto p-3.5">
                  {filteredTranscript.map((item) => {
                    const isActive = currentTime >= item.start && currentTime < item.end
                    return (
                      <div
                        key={item.id}
                        className={`group cursor-pointer rounded-lg border p-3 text-xs transition-all duration-200 ${
                          isActive
                            ? 'border-primary/50 bg-primary/10 ring-primary/20 shadow-xs ring-1'
                            : 'border-border/70 bg-card hover:bg-muted/40'
                        }`}
                        onClick={() => seekTo(item.start)}
                      >
                        <div className="mb-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-6 gap-1 rounded-md px-1.5 font-mono text-xs font-bold tabular-nums"
                              onClick={(e) => {
                                e.stopPropagation()
                                seekTo(item.start)
                              }}
                            >
                              <Play className="size-2.5 fill-current" />
                              <span>{formatTime(item.start)}</span>
                            </Button>
                            <span className="text-muted-foreground text-xs font-medium">{item.speaker}</span>
                          </div>

                          {isActive && (
                            <Badge variant="default" className="gap-1 px-1.5 py-0 text-xs font-semibold">
                              <span className="size-1.5 animate-pulse rounded-full bg-white" />
                              <span>Playing</span>
                            </Badge>
                          )}
                        </div>

                        <p
                          className={`leading-relaxed ${
                            isActive
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                        >
                          {item.text}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Transcript Footer Notice */}
                <div className="bg-muted/30 text-muted-foreground border-t p-2.5 text-center text-xs">
                  Click any line to jump to that timestamp in the lecture.
                </div>
              </TabsContent>

              {/* TAB 2: Timestamped Notes Workspace */}
              <TabsContent value="notes" className="m-0 flex flex-1 flex-col focus-visible:outline-none">
                {/* Note Composer */}
                <div className="bg-muted/20 space-y-2 border-b p-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight">
                      <Clock className="text-primary size-3.5" />
                      <span>Add Note at {formattedCurrentTime}</span>
                    </label>
                    <span className="text-muted-foreground font-mono text-xs">Captures current playback time</span>
                  </div>

                  <Textarea
                    value={newNoteText}
                    onValueChange={(v) => setNewNoteText(v)}
                    rows={2}
                    className="resize-y text-xs leading-relaxed"
                    placeholder={`Write your thoughts or takeaway at ${formattedCurrentTime}...`}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                        handleAddNote()
                      }
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Press ⌘+Enter to save</span>
                    <Button
                      size="sm"
                      className="h-7.5 gap-1 px-3 text-xs font-semibold"
                      disabled={!newNoteText.trim()}
                      onClick={handleAddNote}
                    >
                      <Plus className="size-3.5" />
                      <span>Save Note</span>
                    </Button>
                  </div>
                </div>

                {/* Saved Notes List */}
                <div className="max-h-[500px] flex-1 space-y-2.5 overflow-y-auto p-3.5">
                  {notesList.map((note) => (
                    <div
                      key={note.id}
                      className="group bg-card hover:border-border rounded-lg border p-3 text-xs shadow-xs transition-colors"
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary h-5 gap-1 rounded px-1.5 font-mono text-xs font-bold tabular-nums"
                          onClick={() => seekTo(note.timestamp)}
                        >
                          <Play className="size-2.5 fill-current" />
                          <span>{formatTime(note.timestamp)}</span>
                        </Button>

                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-xs">{note.createdAt}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive size-5 opacity-0 group-hover:opacity-100"
                            aria-label="Delete note"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-foreground leading-relaxed">{note.text}</p>
                    </div>
                  ))}

                  {notesList.length === 0 && (
                    <div className="text-muted-foreground py-8 text-center text-xs">
                      No personal notes yet. Add your first note above!
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 3: Q&A Community Discussion */}
              <TabsContent value="qa" className="m-0 flex flex-1 flex-col focus-visible:outline-none">
                {/* Question Composer */}
                <div className="bg-muted/20 space-y-2 border-b p-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight">
                      <MessageSquare className="text-primary size-3.5" />
                      <span>Ask Instructor at {formattedCurrentTime}</span>
                    </label>
                    <span className="text-muted-foreground font-mono text-xs">Tagged to this video time</span>
                  </div>

                  <Input
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Ask a question about this topic..."
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddQuestion()
                      }
                    }}
                  />

                  <div className="flex items-center justify-end">
                    <Button
                      size="sm"
                      className="h-7 gap-1 px-3 text-xs font-semibold"
                      disabled={!newQuestionText.trim()}
                      onClick={handleAddQuestion}
                    >
                      <span>Post Question</span>
                    </Button>
                  </div>
                </div>

                {/* Questions Thread List */}
                <div className="max-h-[500px] flex-1 space-y-3 overflow-y-auto p-3.5">
                  {questionsList.map((q) => (
                    <div key={q.id} className="bg-card space-y-2.5 rounded-lg border p-3 text-xs shadow-xs">
                      {/* Question Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                            {q.avatar}
                          </div>
                          <div>
                            <span className="text-foreground font-semibold">{q.author}</span>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-muted-foreground ml-1.5 h-auto p-0 font-mono text-xs"
                              onClick={() => seekTo(q.timestamp)}
                            >
                              [{formatTime(q.timestamp)}]
                            </Button>
                          </div>
                        </div>

                        {/* Upvote Button */}
                        <Button
                          variant={q.hasUpvoted ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 gap-1 px-1.5 text-xs"
                          onClick={() => toggleUpvote(q.id)}
                        >
                          <ThumbsUp className="size-2.5" />
                          <span className="font-mono tabular-nums">{q.upvotes}</span>
                        </Button>
                      </div>

                      {/* Question Text */}
                      <p className="text-foreground leading-relaxed">{q.question}</p>

                      {/* Instructor Answer if available */}
                      {q.answer && (
                        <div className="bg-muted/40 border-primary/20 space-y-1 rounded-md border p-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-xs font-semibold">{q.answer.author}</span>
                            <Badge variant="default" className="bg-emerald-600 px-1 py-0 text-xs font-normal">
                              Instructor Verified
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed">{q.answer.text}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default LessonVideoPlayer
