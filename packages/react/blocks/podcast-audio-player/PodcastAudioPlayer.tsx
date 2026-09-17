'use client'

import * as React from 'react'
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FastForward,
  Headphones,
  Heart,
  ListMusic,
  Mic,
  Pause,
  Play,
  Radio,
  RotateCcw,
  RotateCw,
  Share2,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

export interface Chapter {
  id: number
  title: string
  subtitle: string
  start: number
  end: number
  durationFormatted: string
}

export interface Panelist {
  name: string
  role: string
  company: string
  avatar: string
  fallback: string
  bio: string
  handle: string
}

export interface ReferenceLink {
  title: string
  description: string
  url: string
  tag: string
}

const waveformBars = [
  32, 48, 65, 88, 60, 42, 75, 96, 85, 62, 50, 78, 92, 100, 84, 60, 38, 70, 88, 95, 80, 54, 42, 68, 85, 92, 76, 60, 46,
  64, 82, 45,
]

const chapters: Chapter[] = [
  {
    id: 1,
    title: 'Intro & State of Tooling',
    subtitle: 'Why traditional CSS workflows break at scale',
    start: 0, // 00:00
    end: 495, // 08:15
    durationFormatted: '08:15',
  },
  {
    id: 2,
    title: 'The Monorepo Pivot',
    subtitle: 'Moving away from monolithic npm component packages',
    start: 495, // 08:15
    end: 1360, // 22:40
    durationFormatted: '14:25',
  },
  {
    id: 3,
    title: 'OKLCH Math & Contrast Engines',
    subtitle: 'Perceptual uniformity, APCA contrast & wide-gamut P3',
    start: 1360, // 22:40
    end: 2290, // 38:10
    durationFormatted: '15:30',
  },
  {
    id: 4,
    title: 'Q&A & Future Standards',
    subtitle: 'Audience questions, migration playbooks & CSS Color 5',
    start: 2290, // 38:10
    end: 2912, // 48:32
    durationFormatted: '10:22',
  },
]

const panelists: Panelist[] = [
  {
    name: 'Elena Rostova',
    role: 'Staff Design Engineer',
    company: 'Linear',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fallback: 'ER',
    bio: 'Pioneered Linear dark mode tokens, high-density keyboard workflows, and micro-interactions.',
    handle: '@erostova',
  },
  {
    name: 'Marcus Vance',
    role: 'Head of UI Architecture',
    company: 'Vercel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    fallback: 'MV',
    bio: 'Core architect on headless design systems, token compilers, and zero-runtime CSS workflows.',
    handle: '@marcusvance',
  },
  {
    name: 'Dr. Aris Thorne',
    role: 'Color Science Lead',
    company: 'W3C CSS Working Group',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    fallback: 'AT',
    bio: 'Author on CSS Color Module 4 & 5, APCA contrast metric integration, and gamut mapping algorithms.',
    handle: '@aristhorne',
  },
]

const referenceLinks: ReferenceLink[] = [
  {
    title: 'OKLCH Color Space Visualizer',
    description: 'Interactive gamut mapper, lightness ramp generator, and P3 inspector.',
    url: 'https://oklch.com',
    tag: 'Tooling',
  },
  {
    title: 'W3C CSS Color Module Level 4',
    description: 'Official W3C specification defining oklch(), oklab(), and wide-gamut coordinates.',
    url: 'https://www.w3.org/TR/css-color-4/',
    tag: 'Specification',
  },
  {
    title: 'UIPKGE Component Registry Architecture',
    description: 'The unbundled registry distribution model for Vue and React design systems.',
    url: 'https://uipkge.dev',
    tag: 'Architecture',
  },
  {
    title: 'APCA Accessible Perceptual Contrast Algorithm',
    description: 'Next-generation readability standard replacing legacy WCAG 2 ratio formulas.',
    url: 'https://git.apcacontrast.com',
    tag: 'Accessibility',
  },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function PodcastAudioPlayer({ className }: { className?: string }) {
  // Audio Playback State
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(860) // 14:20
  const totalDuration = 2912 // 48:32
  const [volume, setVolume] = React.useState(80)
  const [isMuted, setIsMuted] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1.0)
  const speedOptions = [1.0, 1.25, 1.5, 2.0]
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [isLiked, setIsLiked] = React.useState(false)
  const [likeCount, setLikeCount] = React.useState(342)
  const [isCopied, setIsCopied] = React.useState(false)
  const [isDownloaded, setIsDownloaded] = React.useState(false)

  // Timer Effect
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev < totalDuration) {
            return prev + 1
          } else {
            setIsPlaying(false)
            return prev
          }
        })
      }, 1000 / playbackSpeed)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, playbackSpeed, totalDuration])

  const formattedCurrentTime = formatTime(currentTime)
  const formattedTotalTime = formatTime(totalDuration)
  const remainingTime = `-${formatTime(totalDuration - currentTime)}`
  const progressPercent = (currentTime / totalDuration) * 100

  const currentChapter = React.useMemo(() => {
    return chapters.find((c) => currentTime >= c.start && currentTime < c.end) || chapters[chapters.length - 1]
  }, [currentTime])

  const currentChapterProgress = React.useMemo(() => {
    const ch = currentChapter
    const elapsed = currentTime - ch.start
    const total = ch.end - ch.start
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }, [currentTime, currentChapter])

  const seekTo = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(seconds, totalDuration)))
  }

  const handleWaveformClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
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

  const skipToNextChapter = () => {
    const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id)
    if (currentIndex < chapters.length - 1) {
      seekTo(chapters[currentIndex + 1].start)
    }
  }

  const skipToPrevChapter = () => {
    const ch = currentChapter
    if (currentTime - ch.start > 4) {
      seekTo(ch.start)
    } else {
      const currentIndex = chapters.findIndex((c) => c.id === ch.id)
      if (currentIndex > 0) {
        seekTo(chapters[currentIndex - 1].start)
      } else {
        seekTo(0)
      }
    }
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  const toggleLike = () => {
    setIsLiked((prev) => {
      const next = !prev
      setLikeCount((c) => (next ? c + 1 : c - 1))
      return next
    })
  }

  const handleCopyLink = () => {
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleDownload = () => {
    setIsDownloaded(true)
    setTimeout(() => {
      setIsDownloaded(false)
    }, 3000)
  }

  return (
    <div
      data-slot="podcast-audio-player"
      className={['bg-background text-foreground w-full space-y-6', className].filter(Boolean).join(' ')}
    >
      {/* EPISODE HERO CARD */}
      <Card className="overflow-hidden border shadow-xs">
        <CardContent className="p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Column: Cover Art & Episode Details */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {/* Podcast Cover Artwork Thumbnail */}
              <div className="from-primary/20 via-primary/10 to-background ring-border/80 group relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br shadow-md ring-1 sm:size-32">
                {/* Animated Soundwave/Vinyl Graphic */}
                <div className="border-primary/30 absolute inset-2 rounded-xl border border-dashed opacity-60 transition-transform duration-700 group-hover:rotate-45" />
                <div className="bg-card/90 relative z-10 flex size-14 items-center justify-center rounded-xl border shadow-xs">
                  <Radio className="text-primary size-7" />
                </div>
                <div className="bg-background/90 text-foreground absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold shadow-xs">
                  EP #48
                </div>
              </div>

              {/* Episode Meta & Titles */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="gap-1 text-xs font-semibold">
                    <Mic className="text-primary size-3" />
                    <span>The Design Systems Podcast</span>
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs">
                    Season 4 · Episode #48
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Lossless 320kbps
                  </Badge>
                </div>

                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                  Deconstructing OKLCH & Zero-Dependency Component Registries
                </h1>

                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                  {/* Hosts Avatars */}
                  <div className="flex items-center gap-2">
                    <div className="flex shrink-0 -space-x-2 overflow-hidden">
                      <Avatar className="border-background ring-border size-6 border-2 ring-1">
                        <AvatarImage src={panelists[0].avatar} alt={panelists[0].name} />
                        <AvatarFallback>{panelists[0].fallback}</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-background ring-border size-6 border-2 ring-1">
                        <AvatarImage src={panelists[1].avatar} alt={panelists[1].name} />
                        <AvatarFallback>{panelists[1].fallback}</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-background ring-border size-6 border-2 ring-1">
                        <AvatarImage src={panelists[2].avatar} alt={panelists[2].name} />
                        <AvatarFallback>{panelists[2].fallback}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-foreground font-medium">Elena Rostova, Marcus Vance & Dr. Aris Thorne</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 font-mono text-xs tabular-nums">
                    <Clock className="size-3.5" />
                    <span>48 mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Primary Hero Actions */}
            <div className="flex flex-wrap items-center gap-2 border-t pt-4 lg:border-t-0 lg:pt-0">
              {/* Like Button */}
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
                onClick={toggleLike}
              >
                <Heart className={`size-4 ${isLiked ? 'fill-current' : 'text-muted-foreground'}`} />
                <span className="font-mono tabular-nums">{likeCount}</span>
              </Button>

              {/* Bookmark Button */}
              <Button
                variant="outline"
                size="icon"
                className="size-9 shadow-xs"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark episode'}
                onClick={() => setIsBookmarked((b) => !b)}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="text-primary size-4" />
                ) : (
                  <Bookmark className="text-muted-foreground size-4" />
                )}
              </Button>

              {/* Share / Copy Link */}
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
                onClick={handleCopyLink}
              >
                {isCopied ? <Check className="size-4 text-emerald-500" /> : <Share2 className="size-4" />}
                <span>{isCopied ? 'Link Copied' : 'Share'}</span>
              </Button>

              {/* Download Episode */}
              <Button
                variant="outline"
                size="icon"
                className="size-9 shadow-xs"
                aria-label={isDownloaded ? 'Downloaded' : 'Download episode'}
                onClick={handleDownload}
              >
                {isDownloaded ? <Check className="size-4 text-emerald-500" /> : <Download className="size-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AUDIO PLAYER CONTROLS (CENTERPIECE) */}
      <Card className="border shadow-xs">
        <CardContent className="space-y-6 p-5 sm:p-7">
          {/* Currently Playing Chapter Header */}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-primary size-2 animate-pulse rounded-full" />
                <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                  Now Playing · Chapter {currentChapter.id} of {chapters.length}
                </span>
              </div>
              <h2 className="text-foreground text-base font-bold tracking-tight sm:text-lg">{currentChapter.title}</h2>
              <p className="text-muted-foreground text-xs">{currentChapter.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 self-start font-mono text-xs font-semibold tabular-nums sm:self-auto">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 gap-1 px-2.5 py-1">
                <span className="text-primary font-bold">{formattedCurrentTime}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{formattedTotalTime}</span>
              </Badge>
              <span className="text-muted-foreground text-xs">{remainingTime}</span>
            </div>
          </div>

          {/* 32-BAR VISUAL SVG AUDIO WAVEFORM SCRUBBER */}
          <div className="space-y-2">
            <div
              className="group/wave bg-muted/30 hover:bg-muted/50 border-border/80 relative flex h-24 w-full cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors select-none"
              role="slider"
              aria-label="Audio Waveform Scrubber"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={totalDuration}
              onClick={handleWaveformClick}
            >
              {/* Background SVG Waveform Bars */}
              <div className="flex h-full w-full items-center justify-between gap-1 sm:gap-1.5">
                {waveformBars.map((barHeight, index) => {
                  const isPlayed = (index / waveformBars.length) * 100 <= progressPercent
                  const isCurrentBar = isPlaying && Math.floor((progressPercent / 100) * waveformBars.length) === index

                  return (
                    <div key={index} className="flex h-full flex-1 items-center justify-center">
                      {/* Single Audio Bar */}
                      <div
                        className={[
                          'w-full max-w-[8px] rounded-full transition-all duration-150',
                          isPlayed ? 'bg-primary' : 'bg-muted-foreground/25 group-hover/wave:bg-muted-foreground/35',
                          isCurrentBar ? 'ring-primary/40 scale-y-110 ring-2' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          height: `${barHeight}%`,
                        }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Interactive Timeline Cursor Scrubber Line */}
              <div
                className="bg-foreground pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 transition-all"
                style={{ left: `${progressPercent}%` }}
              >
                <div className="bg-primary ring-background absolute -top-1 left-1/2 size-3.5 -translate-x-1/2 rounded-full shadow-md ring-2 transition-transform group-hover/wave:scale-125" />
              </div>

              {/* Chapter Notch Markers on Waveform Bottom */}
              <div className="pointer-events-none absolute right-4 bottom-1.5 left-4 flex justify-between">
                {chapters.map((ch) => (
                  <span
                    key={ch.id}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${(ch.start / totalDuration) * 100}%` }}
                  >
                    <span className="bg-muted-foreground/50 h-2 w-0.5" />
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Time & Chapter Range Indicators */}
            <div className="text-muted-foreground flex items-center justify-between font-mono text-xs tabular-nums">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold">{formattedCurrentTime}</span>
                <span>(Chapter progress: {Math.round(currentChapterProgress)}%)</span>
              </div>
              <span>{formattedTotalTime}</span>
            </div>
          </div>

          {/* MAIN PLAYBACK CONTROLS BAR */}
          <div className="flex flex-col items-center justify-between gap-4 pt-2 md:flex-row">
            {/* Left: Secondary Tools (Speed & Chapter Navigation) */}
            <div className="flex items-center gap-2">
              {/* Speed Selector Button */}
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-accent h-9 gap-1 px-2.5 font-mono text-xs font-bold shadow-xs"
                aria-label="Cycle Playback Speed"
                onClick={cycleSpeed}
              >
                <FastForward className="text-primary size-3.5" />
                <span>{playbackSpeed.toFixed(playbackSpeed % 1 === 0 ? 1 : 2)}x</span>
              </Button>

              {/* Previous Chapter */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-9"
                aria-label="Previous Chapter"
                onClick={skipToPrevChapter}
              >
                <SkipBack className="size-4" />
              </Button>

              {/* Next Chapter */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-9"
                aria-label="Next Chapter"
                onClick={skipToNextChapter}
              >
                <SkipForward className="size-4" />
              </Button>
            </div>

            {/* Center: Core Transport Buttons (15s Rewind, Play/Pause, 15s Fast Forward) */}
            <div className="flex items-center gap-3">
              {/* 15s Rewind */}
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full shadow-xs"
                aria-label="Rewind 15 seconds"
                onClick={() => skipSeconds(-15)}
              >
                <RotateCcw className="size-4.5" />
              </Button>

              {/* Primary Play / Pause Circle Button */}
              <Button
                variant="default"
                size="icon"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring size-13 rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 active:scale-95"
                aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
                onClick={() => setIsPlaying((p) => !p)}
              >
                {isPlaying ? (
                  <Pause className="size-6 fill-current" />
                ) : (
                  <Play className="ml-0.5 size-6 fill-current" />
                )}
              </Button>

              {/* 15s Fast Forward */}
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-full shadow-xs"
                aria-label="Fast forward 15 seconds"
                onClick={() => skipSeconds(15)}
              >
                <RotateCw className="size-4.5" />
              </Button>
            </div>

            {/* Right: Volume Slider Controls */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-9"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-4.5 text-rose-500" />
                ) : volume < 50 ? (
                  <Volume1 className="size-4.5" />
                ) : (
                  <Volume2 className="size-4.5" />
                )}
              </Button>

              <div className="w-24 sm:w-28">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={(val) => {
                    if (isMuted) setIsMuted(false)
                    setVolume(val[0])
                  }}
                  min={0}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-muted-foreground w-8 text-right font-mono text-xs tabular-nums">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>
          </div>

          <Separator />

          {/* CHAPTER NAVIGATION BAR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListMusic className="text-primary size-4" />
                <h3 className="text-foreground text-xs font-bold tracking-tight uppercase">Chapter Navigation</h3>
              </div>
              <span className="text-muted-foreground font-mono text-xs">4 Chapters · 48m 32s Total</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {chapters.map((ch) => {
                const isActive = currentChapter.id === ch.id
                return (
                  <div
                    key={ch.id}
                    className={[
                      'group flex cursor-pointer flex-col justify-between rounded-xl border p-3 text-xs transition-all duration-200',
                      isActive
                        ? 'border-primary/50 bg-primary/5 ring-primary/20 shadow-xs ring-1'
                        : 'bg-card hover:bg-muted/40 border-border/70',
                    ].join(' ')}
                    onClick={() => seekTo(ch.start)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={isActive ? 'default' : 'outline'}
                          className="h-5 px-1.5 font-mono text-xs font-semibold"
                        >
                          CH {ch.id}
                        </Badge>
                        <span className="text-muted-foreground font-mono text-xs tabular-nums">
                          {formatTime(ch.start)}
                        </span>
                      </div>
                      <div className="text-foreground line-clamp-1 font-semibold">{ch.title}</div>
                      <div className="text-muted-foreground line-clamp-1 text-xs">{ch.subtitle}</div>
                    </div>

                    {/* Active Chapter Progress Mini Indicator */}
                    <div className="mt-2.5 pt-1">
                      {isActive ? (
                        <Progress value={currentChapterProgress} className="h-1" />
                      ) : (
                        <div
                          className={[
                            'h-1 w-full rounded-full',
                            currentTime >= ch.end ? 'bg-primary/40' : 'bg-muted',
                          ].join(' ')}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* EPISODE SHOW NOTES & GUEST LINKS ACCORDION */}
      <Card className="border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary size-4" />
              <CardTitle className="text-base font-bold tracking-tight sm:text-lg">
                Episode Show Notes & Comprehensive Guide
              </CardTitle>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Full Notes
            </Badge>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            Deep dive references, color math formulas, guest bios, and resource bookmarks from this episode.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-1">
          <Accordion type="single" collapsible defaultValue="summary" className="w-full">
            {/* Accordion Item 1: Episode Summary */}
            <AccordionItem value="summary">
              <AccordionTrigger className="text-xs font-semibold hover:no-underline sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                    1
                  </span>
                  <span>Executive Summary & Key Takeaways</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 text-xs leading-relaxed">
                <p className="text-muted-foreground">
                  In this episode, we break down why traditional HSL and sRGB color models fall short when building
                  modern, accessible multi-theme design systems. We explore how the OKLCH color space decouples
                  perceptual lightness from chroma and hue, eliminating contrast inversion bugs when shifting from light
                  to OLED dark mode.
                </p>

                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
                  <div className="bg-muted/30 space-y-1 rounded-lg border p-3">
                    <div className="text-foreground font-semibold">Perceptual Uniformity</div>
                    <p className="text-muted-foreground text-xs">
                      Lightness (L) in OKLCH remains consistent regardless of hue angle, unlike HSL where yellow appears
                      far brighter than blue.
                    </p>
                  </div>

                  <div className="bg-muted/30 space-y-1 rounded-lg border p-3">
                    <div className="text-foreground font-semibold">Zero-Dependency Registries</div>
                    <p className="text-muted-foreground text-xs">
                      Unbundled component distribution gives engineering teams 100% source code ownership with zero
                      semantic version drift.
                    </p>
                  </div>

                  <div className="bg-muted/30 space-y-1 rounded-lg border p-3">
                    <div className="text-foreground font-semibold">Tailwind v4 @theme</div>
                    <p className="text-muted-foreground text-xs">
                      Direct CSS variable binding with OKLCH tokens unlocks dynamic color-mix tints without JavaScript
                      runtime overhead.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 2: Detailed Chapter Breakdown */}
            <AccordionItem value="chapters">
              <AccordionTrigger className="text-xs font-semibold hover:no-underline sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </span>
                  <span>Timestamped Chapter Breakdown & Discussion Topics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2.5 pt-2 text-xs">
                {chapters.map((ch) => (
                  <div
                    key={ch.id}
                    className="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-semibold">
                          Chapter {ch.id}: {ch.title}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">{ch.subtitle}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 px-2.5 font-mono text-xs font-bold tabular-nums"
                      onClick={() => seekTo(ch.start)}
                    >
                      <Play className="text-primary size-2.5 fill-current" />
                      <span>{formatTime(ch.start)}</span>
                    </Button>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 3: Featured Panelists & Guests */}
            <AccordionItem value="panelists">
              <AccordionTrigger className="text-xs font-semibold hover:no-underline sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                    3
                  </span>
                  <span>Featured Hosts & Guest Panel</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {panelists.map((person) => (
                    <div
                      key={person.name}
                      className="bg-muted/25 flex flex-col justify-between space-y-3 rounded-xl border p-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="ring-border size-10 border ring-1">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback>{person.fallback}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-foreground truncate font-bold">{person.name}</div>
                          <div className="text-muted-foreground truncate text-xs">{person.role}</div>
                          <Badge variant="secondary" className="h-4 px-1 text-xs">
                            {person.company}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">{person.bio}</p>
                      <div className="text-primary font-mono text-xs">{person.handle}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Accordion Item 4: Mentioned Resources & External Links */}
            <AccordionItem value="resources">
              <AccordionTrigger className="text-xs font-semibold hover:no-underline sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                    4
                  </span>
                  <span>Mentioned Resources & Specifications</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2.5 pt-2 text-xs">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {referenceLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-muted/25 hover:bg-muted/50 group flex flex-col justify-between rounded-xl border p-3.5 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground group-hover:text-primary flex items-center gap-1.5 font-semibold transition-colors">
                            {link.title}
                            <ExternalLink className="text-muted-foreground group-hover:text-primary size-3 transition-colors" />
                          </span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {link.tag}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">{link.description}</p>
                      </div>
                      <div className="text-muted-foreground pt-2 font-mono text-xs">{link.url}</div>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>

        <CardFooter className="bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs">
          <div className="text-muted-foreground flex items-center gap-2">
            <Headphones className="text-primary size-4" />
            <span>Produced by The Design Systems Guild · All rights reserved</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopyLink}>
              <Copy className="mr-1 size-3.5" />
              <span>Copy Transcript Link</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PodcastAudioPlayer
