'use client'

import * as React from 'react'
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  FileCode2,
  FileText,
  Link,
  Mic,
  Pause,
  Play,
  Quote,
  Radio,
  RotateCcw,
  RotateCw,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface AudioWaveformTranscriptProps {
  className?: string
}

export interface SpeakerTurn {
  id: string
  speakerId: 'elena' | 'marcus'
  speakerName: string
  speakerRole: 'Host' | 'Guest'
  speakerHandle: string
  avatarFallback: string
  startTime: number // in seconds
  endTime: number // in seconds
  timecode: string // e.g. '00:15'
  duration: string // e.g. '04:07'
  text: string
}

export interface SpeakerProfile {
  id: 'elena' | 'marcus'
  name: string
  role: 'Host' | 'Guest'
  handle: string
  avatarFallback: string
  ratioPercent: number
  totalSpeakingTime: string
  totalSeconds: number
  turnsCount: number
  wordCount: number
  wpm: number
  accentColor: string
}

const TOTAL_DURATION_SECONDS = 2912 // 48:32

const speakers: Record<'elena' | 'marcus', SpeakerProfile> = {
  elena: {
    id: 'elena',
    name: 'Elena Rostova',
    role: 'Host',
    handle: '@erostova',
    avatarFallback: 'ER',
    ratioPercent: 45,
    totalSpeakingTime: '21:50',
    totalSeconds: 1310,
    turnsCount: 3,
    wordCount: 4120,
    wpm: 142,
    accentColor: 'bg-primary text-primary-foreground',
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Vance',
    role: 'Guest',
    handle: '@marcusvance',
    avatarFallback: 'MV',
    ratioPercent: 55,
    totalSpeakingTime: '26:42',
    totalSeconds: 1602,
    turnsCount: 2,
    wordCount: 4860,
    wpm: 156,
    accentColor: 'bg-indigo-600 text-white dark:bg-indigo-500',
  },
}

const turns: SpeakerTurn[] = [
  {
    id: 'turn-1',
    speakerId: 'elena',
    speakerName: 'Elena Rostova',
    speakerRole: 'Host',
    speakerHandle: '@erostova',
    avatarFallback: 'ER',
    startTime: 15,
    endTime: 262,
    timecode: '00:15',
    duration: '04:07',
    text: 'Welcome back to the Design Systems Podcast. Today we are diving into one of the most consequential shifts happening in frontend architecture: moving away from monolithic UI component libraries published on npm toward unbundled, copy-and-paste registries where developers own the code. I am joined by Marcus Vance, principal architect at Component Lab. Marcus, when you look at teams maintaining enterprise design systems today, why has the traditional npm package model started to show its limits?',
  },
  {
    id: 'turn-2',
    speakerId: 'marcus',
    speakerName: 'Marcus Vance',
    speakerRole: 'Guest',
    speakerHandle: '@marcusvance',
    avatarFallback: 'MV',
    startTime: 262,
    endTime: 765,
    timecode: '04:22',
    duration: '08:23',
    text: 'Thanks for having me, Elena. The fundamental challenge with versioned npm component libraries is the tight coupling between visual tokens, DOM accessibility primitives, and release cycles. When a consumer app needs a minor adjustment to an accessibility attribute or a custom animation spring, they end up blocked on a semver release or forced into fragile CSS overrides. With the registry model pioneered by shadcn, components are delivered as transparent source code. You get the benefit of world-class headless defaults—like Reka UI and Radix—while retaining complete ownership to tailor and extend the implementation directly inside your repository.',
  },
  {
    id: 'turn-3',
    speakerId: 'elena',
    speakerName: 'Elena Rostova',
    speakerRole: 'Host',
    speakerHandle: '@erostova',
    avatarFallback: 'ER',
    startTime: 765,
    endTime: 1450,
    timecode: '12:45',
    duration: '11:25',
    text: 'That distinction between primitives and blocks is so critical. In our work, we insist that primitives like Button, Card, and Dialog strictly encapsulate mechanics—focus trapping, keyboard navigation, and theme tokens—while blocks compose those primitives into layouts top-to-bottom without baking in rigid schemas. What is your take on multi-framework parity? How should teams bridge the gap when supporting both Vue and React without duplicating tokens or drift in visual behavior?',
  },
  {
    id: 'turn-4',
    speakerId: 'marcus',
    speakerName: 'Marcus Vance',
    speakerRole: 'Guest',
    speakerHandle: '@marcusvance',
    avatarFallback: 'MV',
    startTime: 1450,
    endTime: 2295,
    timecode: '24:10',
    duration: '14:05',
    text: 'Single source of truth at the CSS and token layer is non-negotiable. If you define your OKLCH color palettes, semantic typography scales, and spring easing curves in standard Tailwind tokens, both the Vue SFC and React JSX implementations consume the identical styling contracts. Headless primitives in Vue via Reka UI and in React via Radix share nearly 1:1 state machines. When the code is unbundled, automated visual regression tools can diff both frameworks side-by-side on every commit, ensuring zero drift.',
  },
  {
    id: 'turn-5',
    speakerId: 'elena',
    speakerName: 'Elena Rostova',
    speakerRole: 'Host',
    speakerHandle: '@erostova',
    avatarFallback: 'ER',
    startTime: 2295,
    endTime: 2912,
    timecode: '38:15',
    duration: '10:17',
    text: 'That clarity is empowering. For engineering teams looking to adopt this architecture, we have published the complete registry manifests, storybook-grade island demos, and cross-framework components at uipkge.dev. Marcus, thank you so much for joining us and breaking down the future of modern component engineering. Check the episode description below for the full transcript files, timecode markers, and code examples.',
  },
]

// 72-bar simulated waveform amplitude dataset
const waveformBars = [
  28, 42, 60, 82, 68, 45, 32, 54, 76, 92, 98, 75, 50, 35, 58, 70, 88, 96, 90, 64, 48, 62, 80, 94, 86, 55, 40, 66, 84,
  98, 100, 88, 62, 42, 54, 76, 90, 94, 80, 58, 45, 68, 85, 96, 90, 70, 52, 36, 56, 78, 90, 92, 82, 60, 48, 70, 88, 96,
  90, 72, 50, 35, 52, 70, 86, 92, 80, 58, 42, 30, 22, 16,
]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function AudioWaveformTranscript({ className }: AudioWaveformTranscriptProps) {
  const [currentTime, setCurrentTime] = React.useState(262) // starts at 04:22
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState<1 | 1.25 | 1.5 | 2>(1)
  const [isMuted, setIsMuted] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedSpeakerFilter, setSelectedSpeakerFilter] = React.useState<'all' | 'elena' | 'marcus'>('all')
  const [onlyMatchingTurns, setOnlyMatchingTurns] = React.useState(false)
  const [copiedLinkId, setCopiedLinkId] = React.useState<string | null>(null)
  const [copiedQuoteId, setCopiedQuoteId] = React.useState<string | null>(null)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [isExportMenuOpen, setIsExportMenuOpen] = React.useState(false)
  const [hoverTimecode, setHoverTimecode] = React.useState<string | null>(null)
  const [hoverPositionPercent, setHoverPositionPercent] = React.useState<number | null>(null)

  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = React.useCallback((msg: string) => {
    setToastMessage(msg)
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null)
    }, 2500)
  }, [])

  // Playback timer interval
  React.useEffect(() => {
    if (!isPlaying) return

    const intervalTime = 1000 / playbackSpeed
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= TOTAL_DURATION_SECONDS) {
          setIsPlaying(false)
          return TOTAL_DURATION_SECONDS
        }
        return prev + 1
      })
    }, intervalTime)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    }
  }, [])

  const seekTo = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(TOTAL_DURATION_SECONDS, seconds)))
  }

  const skip = (deltaSeconds: number) => {
    seekTo(currentTime + deltaSeconds)
  }

  // Active turn ID based on current playback time
  const activeTurnId = React.useMemo(() => {
    const current = turns.find((t) => currentTime >= t.startTime && currentTime < t.endTime)
    return current ? current.id : turns[0].id
  }, [currentTime])

  // Highlight segmenter
  const highlightSegments = (text: string, query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return [{ text, match: false }]
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part) => ({
      text: part,
      match: part.toLowerCase() === trimmed.toLowerCase(),
    }))
  }

  // Search match count
  const totalSearchMatches = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return 0
    let count = 0
    turns.forEach((turn) => {
      const text = turn.text.toLowerCase()
      let pos = 0
      while ((pos = text.indexOf(query, pos)) !== -1) {
        count++
        pos += query.length
      }
    })
    return count
  }, [searchQuery])

  // Filtered turns
  const displayedTurns = React.useMemo(() => {
    return turns.filter((turn) => {
      if (selectedSpeakerFilter !== 'all' && turn.speakerId !== selectedSpeakerFilter) {
        return false
      }
      if (onlyMatchingTurns && searchQuery.trim()) {
        return turn.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
      }
      return true
    })
  }, [selectedSpeakerFilter, onlyMatchingTurns, searchQuery])

  // Copy timestamp link
  const copyTimestampLink = async (turn: SpeakerTurn) => {
    const link = `https://uipkge.dev/podcast/ep48#t=${turn.timecode}`
    try {
      await navigator.clipboard.writeText(link)
      setCopiedLinkId(turn.id)
      showToast(`Copied timecode link for ${turn.timecode}`)
      setTimeout(() => {
        setCopiedLinkId(null)
      }, 2000)
    } catch {
      showToast(`Timecode: ${link}`)
    }
  }

  // Quote snippet
  const copyQuoteSnippet = async (turn: SpeakerTurn) => {
    const quote = `"[${turn.timecode}] ${turn.speakerName} (${turn.speakerRole}): ${turn.text}"`
    try {
      await navigator.clipboard.writeText(quote)
      setCopiedQuoteId(turn.id)
      showToast(`Quote from ${turn.speakerName} copied to clipboard`)
      setTimeout(() => {
        setCopiedQuoteId(null)
      }, 2000)
    } catch {
      showToast('Quote snippet copied')
    }
  }

  // Export VTT
  const downloadVtt = () => {
    let vttContent = `WEBVTT - Design Systems Podcast · Episode 48 Transcript\n\n`
    turns.forEach((turn, idx) => {
      const startHour = '00:' + turn.timecode + '.000'
      const endMins = Math.floor(turn.endTime / 60)
      const endSecs = Math.floor(turn.endTime % 60)
      const endTimecode = `00:${String(endMins).padStart(2, '0')}:${String(endSecs).padStart(2, '0')}.000`

      vttContent += `${idx + 1}\n`
      vttContent += `${startHour} --> ${endTimecode}\n`
      vttContent += `<v ${turn.speakerName}>${turn.text}\n\n`
    })

    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-systems-podcast-ep48.vtt'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded WebVTT transcript file')
    setIsExportMenuOpen(false)
  }

  // Export TXT
  const downloadTxt = () => {
    let txtContent = `Design Systems Podcast · Episode 48 Transcript\n`
    txtContent += `Total Duration: 48:32 | Elena Rostova (Host) · Marcus Vance (Guest)\n\n`
    txtContent += `============================================================\n\n`

    turns.forEach((turn) => {
      txtContent += `[${turn.timecode}] ${turn.speakerName} (${turn.speakerRole}):\n`
      txtContent += `${turn.text}\n\n`
    })

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-systems-podcast-ep48.txt'
    a.click()
    URL.revokeObjectURL(url)
    showToast('Downloaded Plain Text transcript file')
    setIsExportMenuOpen(false)
  }

  // Copy full transcript to clipboard
  const copyFullTranscript = async () => {
    let fullTxt = `Design Systems Podcast · Episode 48 Transcript (48:32)\n\n`
    turns.forEach((turn) => {
      fullTxt += `[${turn.timecode}] ${turn.speakerName} (${turn.speakerRole}):\n${turn.text}\n\n`
    })
    try {
      await navigator.clipboard.writeText(fullTxt)
      showToast('Full transcript copied to clipboard')
    } catch {
      showToast('Transcript copied')
    }
    setIsExportMenuOpen(false)
  }

  // Waveform handlers
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, clickX / rect.width))
    seekTo(ratio * TOTAL_DURATION_SECONDS)
  }

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width))
    setHoverPositionPercent(ratio * 100)
    setHoverTimecode(formatTime(ratio * TOTAL_DURATION_SECONDS))
  }

  const handleWaveformMouseLeave = () => {
    setHoverPositionPercent(null)
    setHoverTimecode(null)
  }

  return (
    <div data-slot="audio-waveform-transcript" className={cn('text-foreground w-full space-y-6', className)}>
      {/* Top Audio Bar Card */}
      <Card className="border-border bg-card overflow-hidden shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge wrap variant="secondary" className="gap-1 font-mono text-xs">
                  <Radio className="text-primary size-3 animate-pulse" />
                  Episode 48
                </Badge>
                <Badge wrap variant="outline" className="text-muted-foreground text-xs">
                  Audio Transcript
                </Badge>
                <span className="text-muted-foreground font-mono text-xs tabular-nums">MP3 · 320 kbps · Stereo</span>
              </div>
              <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                Design Systems Podcast · Episode 48 Transcript
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                Elena Rostova with Marcus Vance on unbundled registries, token architecture, and headless Vue & React
                parity.
              </CardDescription>
            </div>

            {/* Export Transcript Menu Action */}
            <div className="relative shrink-0">
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="gap-1.5 font-medium shadow-xs"
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
              >
                <Download className="text-muted-foreground size-3.5" />
                <span>Export Transcript</span>
                <ChevronDown className="text-muted-foreground size-3" />
              </Button>

              {/* Export Dropdown Menu */}
              {isExportMenuOpen && (
                <div className="border-border bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border p-1 shadow-md">
                  <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">Download Formats</div>
                  <button
                    type="button"
                    className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs"
                    onClick={downloadVtt}
                  >
                    <FileCode2 className="text-primary size-3.5" />
                    <div>
                      <div className="font-medium">Export as .VTT</div>
                      <div className="text-muted-foreground text-xs">WebVTT subtitle captions</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs"
                    onClick={downloadTxt}
                  >
                    <FileText className="size-3.5 text-indigo-500" />
                    <div>
                      <div className="font-medium">Export as .TXT</div>
                      <div className="text-muted-foreground text-xs">Plain text with timestamps</div>
                    </div>
                  </button>
                  <Separator className="my-1" />
                  <button
                    type="button"
                    className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs"
                    onClick={copyFullTranscript}
                  >
                    <Copy className="text-muted-foreground size-3.5" />
                    <span className="font-medium">Copy Full Text to Clipboard</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Interactive Waveform Scrubber */}
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center justify-between gap-x-2 font-mono text-xs tabular-nums">
              <span className="text-foreground font-semibold">{formatTime(currentTime)}</span>
              <span className="text-xs">{formatTime(TOTAL_DURATION_SECONDS)}</span>
            </div>

            <div
              className="group bg-muted/40 border-border/60 hover:bg-muted/60 focus-visible:ring-ring relative h-16 w-full cursor-pointer rounded-lg border p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              role="slider"
              tabIndex={0}
              aria-label="Audio scrubber"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={TOTAL_DURATION_SECONDS}
              onClick={handleWaveformClick}
              onMouseMove={handleWaveformMouseMove}
              onMouseLeave={handleWaveformMouseLeave}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault()
                  skip(-5)
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault()
                  skip(5)
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  seekTo(0)
                } else if (e.key === 'End') {
                  e.preventDefault()
                  seekTo(TOTAL_DURATION_SECONDS)
                }
              }}
            >
              {/* Hover timestamp pill indicator */}
              {hoverPositionPercent !== null && hoverTimecode !== null && (
                <div
                  className="bg-foreground text-background pointer-events-none absolute -top-7 z-20 -translate-x-1/2 rounded px-1.5 py-0.5 font-mono text-xs tabular-nums shadow-xs"
                  style={{ left: `${hoverPositionPercent}%` }}
                >
                  {hoverTimecode}
                </div>
              )}

              {/* Waveform bars */}
              <div className="flex h-full w-full items-center justify-between gap-[2px]">
                {waveformBars.map((amplitude, idx) => {
                  const isPlayed = (idx / waveformBars.length) * TOTAL_DURATION_SECONDS <= currentTime
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'flex-1 rounded-full transition-all duration-100',
                        isPlayed ? 'bg-primary' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/45',
                      )}
                      style={{ height: `${Math.max(12, amplitude)}%` }}
                    />
                  )
                })}
              </div>

              {/* Playhead cursor line */}
              <div
                className="bg-foreground pointer-events-none absolute top-0 bottom-0 w-0.5 shadow-xs"
                style={{ left: `${(currentTime / TOTAL_DURATION_SECONDS) * 100}%` }}
              >
                <div className="bg-foreground absolute -top-1 -left-1 size-2.5 rounded-full" />
              </div>

              {/* Speaker distribution ribbon beneath waveform */}
              <div className="absolute right-0 -bottom-1 left-0 flex h-1 overflow-hidden rounded-b">
                <div className="bg-primary/70 w-[8.9%]" title="Elena (00:15 - 04:22)" />
                <div className="w-[17.3%] bg-indigo-500/70" title="Marcus (04:22 - 12:45)" />
                <div className="bg-primary/70 w-[23.6%]" title="Elena (12:45 - 24:10)" />
                <div className="w-[29.0%] bg-indigo-500/70" title="Marcus (24:10 - 38:15)" />
                <div className="bg-primary/70 w-[21.2%]" title="Elena (38:15 - 48:32)" />
              </div>
            </div>
          </div>

          {/* Audio Player Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Playback buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                title="Rewind 15 seconds"
                onClick={() => skip(-15)}
              >
                <RotateCcw className="size-4" />
              </Button>

              <Button
                size="icon"
                variant="default"
                className="size-10 rounded-full shadow-sm"
                title={isPlaying ? 'Pause audio' : 'Play audio'}
                onClick={() => setIsPlaying((prev) => !prev)}
              >
                {isPlaying ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5 fill-current" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                title="Skip forward 15 seconds"
                onClick={() => skip(15)}
              >
                <RotateCw className="size-4" />
              </Button>

              <div className="text-muted-foreground ml-2 hidden items-center gap-1.5 font-mono text-xs tabular-nums sm:flex">
                <Clock className="text-muted-foreground size-3.5" />
                <span>
                  {formatTime(currentTime)} / {formatTime(TOTAL_DURATION_SECONDS)}
                </span>
              </div>
            </div>

            {/* Speed and Volume controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Speed Toggles */}
              <div className="border-border bg-muted/30 flex items-center rounded-lg border p-0.5 text-xs">
                {([1, 1.25, 1.5, 2] as const).map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    className={cn(
                      'cursor-pointer rounded px-2 py-1 font-mono font-medium transition-colors',
                      playbackSpeed === speed
                        ? 'bg-background text-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setPlaybackSpeed(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Volume Mute Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground size-8"
                title={isMuted ? 'Unmute' : 'Mute'}
                onClick={() => setIsMuted((prev) => !prev)}
              >
                {isMuted ? <VolumeX className="text-destructive size-4" /> : <Volume2 className="size-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speaker Talking Time Ratio Bar Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Mic className="text-primary size-4" />
              <CardTitle className="text-base font-semibold">Speaker Diarization & Talking Time</CardTitle>
            </div>
            <div className="text-muted-foreground text-xs">2 speakers identified · 48m 32s total recorded speech</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Segmented Ratio Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs tabular-nums">
              <span className="text-primary flex items-center gap-1 font-medium">
                <span className="bg-primary inline-block size-2 rounded-full" />
                Elena Rostova (Host): 45% (21:50)
              </span>
              <span className="flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                Marcus Vance (Guest): 55% (26:42)
                <span className="inline-block size-2 rounded-full bg-indigo-500" />
              </span>
            </div>

            <div className="bg-muted/60 border-border/40 flex h-3 w-full gap-0.5 overflow-hidden rounded-full border p-0.5">
              <div
                className="bg-primary h-full rounded-l-full transition-all duration-300"
                style={{ width: '45%' }}
                title="Elena Rostova: 45% talking time"
              />
              <div
                className="h-full rounded-r-full bg-indigo-600 transition-all duration-300 dark:bg-indigo-500"
                style={{ width: '55%' }}
                title="Marcus Vance: 55% talking time"
              />
            </div>
          </div>

          {/* Speaker Metadata Cards Grid */}
          <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
            {/* Elena Profile */}
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedSpeakerFilter === 'elena'
                  ? 'border-primary bg-primary/5 ring-primary/30 ring-1'
                  : 'border-border bg-muted/20 hover:bg-muted/40',
              )}
              aria-pressed={selectedSpeakerFilter === 'elena'}
              onClick={() => setSelectedSpeakerFilter((prev) => (prev === 'elena' ? 'all' : 'elena'))}
            >
              <div className="flex items-center gap-3">
                <Avatar className="border-border size-9 border">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {speakers.elena.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{speakers.elena.name}</span>
                    <Badge wrap variant="default" className="px-1.5 py-0 text-xs">
                      Host
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-xs">{speakers.elena.handle}</div>
                </div>
              </div>
              <div className="space-y-0.5 text-right font-mono text-xs tabular-nums">
                <div className="text-foreground font-semibold">{speakers.elena.totalSpeakingTime}</div>
                <div className="text-muted-foreground text-xs">
                  {speakers.elena.wordCount.toLocaleString()} words · {speakers.elena.wpm} wpm
                </div>
              </div>
            </button>

            {/* Marcus Profile */}
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedSpeakerFilter === 'marcus'
                  ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30'
                  : 'border-border bg-muted/20 hover:bg-muted/40',
              )}
              aria-pressed={selectedSpeakerFilter === 'marcus'}
              onClick={() => setSelectedSpeakerFilter((prev) => (prev === 'marcus' ? 'all' : 'marcus'))}
            >
              <div className="flex items-center gap-3">
                <Avatar className="border-border size-9 border">
                  <AvatarFallback className="bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {speakers.marcus.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold">{speakers.marcus.name}</span>
                    <Badge
                      wrap
                      variant="secondary"
                      className="bg-indigo-500/10 px-1.5 py-0 text-xs text-indigo-600 dark:text-indigo-400"
                    >
                      Guest
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-xs">{speakers.marcus.handle}</div>
                </div>
              </div>
              <div className="space-y-0.5 text-right font-mono text-xs tabular-nums">
                <div className="text-foreground font-semibold">{speakers.marcus.totalSpeakingTime}</div>
                <div className="text-muted-foreground text-xs">
                  {speakers.marcus.wordCount.toLocaleString()} words · {speakers.marcus.wpm} wpm
                </div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Search and Filter Controls */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search keywords in transcript (e.g. registry, token, Reka UI)..."
            className="bg-card border-border pr-20 pl-9 text-xs shadow-xs sm:text-sm"
          />
          <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1">
            {searchQuery.trim() && (
              <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs tabular-nums">
                {totalSearchMatches} {totalSearchMatches === 1 ? 'match' : 'matches'}
              </span>
            )}
            {searchQuery.trim() && (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground cursor-pointer rounded p-0.5"
                title="Clear search"
                onClick={() => setSearchQuery('')}
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Speaker Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 cursor-pointer text-xs',
              selectedSpeakerFilter === 'all' &&
                'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
            )}
            onClick={() => setSelectedSpeakerFilter('all')}
          >
            All Speakers (5)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 cursor-pointer text-xs',
              selectedSpeakerFilter === 'elena' &&
                'bg-primary text-primary-foreground border-primary hover:bg-primary/90',
            )}
            onClick={() => setSelectedSpeakerFilter('elena')}
          >
            Elena Rostova · Host (3)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-8 cursor-pointer text-xs',
              selectedSpeakerFilter === 'marcus' &&
                'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500',
            )}
            onClick={() => setSelectedSpeakerFilter('marcus')}
          >
            Marcus Vance · Guest (2)
          </Button>
        </div>
      </div>

      {/* Active Search Filter Summary if active */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between gap-x-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
            <span>
              Found <strong>{totalSearchMatches}</strong> occurrences of "<strong>{searchQuery}</strong>" across
              transcript
            </span>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-semibold underline underline-offset-2 hover:opacity-80"
            onClick={() => setSearchQuery('')}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Interactive Speech-to-Text Transcript Feed */}
      <div className="space-y-4">
        {displayedTurns.map((turn) => {
          const isActive = activeTurnId === turn.id
          return (
            <div
              key={turn.id}
              id={turn.id}
              className={cn(
                'group relative rounded-xl border p-4 transition-all duration-200 sm:p-5',
                isActive
                  ? 'border-primary bg-primary/[0.03] dark:bg-primary/[0.06] ring-primary/30 shadow-sm ring-1'
                  : 'border-border bg-card hover:border-border/80 shadow-xs',
              )}
            >
              {/* Top Turn Header */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                {/* Speaker Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="border-border/80 size-8 border sm:size-9">
                    <AvatarFallback
                      className={cn(
                        'text-xs font-semibold',
                        turn.speakerId === 'elena'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                      )}
                    >
                      {turn.avatarFallback}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">{turn.speakerName}</span>
                    <Badge
                      wrap
                      variant={turn.speakerRole === 'Host' ? 'default' : 'secondary'}
                      className={cn(
                        'px-2 py-0 text-xs',
                        turn.speakerRole === 'Guest' &&
                          'border-transparent bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
                      )}
                    >
                      {turn.speakerRole}
                    </Badge>

                    {/* Active Turn Badge */}
                    {isActive && (
                      <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs font-medium">
                        <span className="bg-primary size-1.5 rounded-full" />
                        NOW PLAYING
                      </span>
                    )}
                  </div>
                </div>

                {/* Timecode Pill & Turn Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Clickable Timecode Pill */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:border-primary h-7 cursor-pointer gap-1 px-2 font-mono text-xs tabular-nums"
                    title="Seek audio to this timestamp"
                    onClick={() => {
                      seekTo(turn.startTime)
                      setIsPlaying(true)
                    }}
                  >
                    <Clock className="text-primary size-3" />
                    <span>[{turn.timecode}]</span>
                  </Button>

                  {/* Copy Timestamp Link */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-7"
                    title="Copy timestamp link"
                    onClick={() => copyTimestampLink(turn)}
                  >
                    {copiedLinkId === turn.id ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Link className="size-3.5" />
                    )}
                  </Button>

                  {/* Quote Snippet Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-7"
                    title="Quote this turn"
                    onClick={() => copyQuoteSnippet(turn)}
                  >
                    {copiedQuoteId === turn.id ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Quote className="size-3.5" />
                    )}
                  </Button>

                  {/* Play Turn Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary size-7"
                    title="Play from here"
                    onClick={() => {
                      seekTo(turn.startTime)
                      setIsPlaying(true)
                    }}
                  >
                    <Play className="size-3.5 fill-current" />
                  </Button>
                </div>
              </div>

              {/* Transcribed Paragraph Text with Search Highlighting */}
              <p className="text-foreground/90 selection:bg-primary/20 text-sm leading-relaxed font-normal sm:text-base">
                {highlightSegments(turn.text, searchQuery).map((seg, i) =>
                  seg.match ? (
                    <mark
                      key={i}
                      className="rounded bg-amber-500/25 px-1 py-0.5 font-medium text-amber-950 transition-colors dark:bg-amber-400/30 dark:text-amber-100"
                    >
                      {seg.text}
                    </mark>
                  ) : (
                    <React.Fragment key={i}>{seg.text}</React.Fragment>
                  ),
                )}
              </p>

              {/* Turn Footer Meta */}
              <div className="text-muted-foreground/80 border-border/40 mt-3 flex items-center justify-between gap-x-2 border-t pt-2 font-mono text-xs">
                <span>Turn duration: {turn.duration}</span>
                <span className="text-xs">{turn.speakerHandle}</span>
              </div>
            </div>
          )
        })}

        {/* Empty state when no turns match filter */}
        {displayedTurns.length === 0 && (
          <div className="border-border bg-muted/20 space-y-2 rounded-xl border border-dashed px-4 py-12 text-center">
            <p className="text-foreground text-sm font-semibold">No matching transcript segments found</p>
            <p className="text-muted-foreground text-xs">
              No dialogue matched query "{searchQuery}". Try adjusting your search term or clearing speaker filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-xs"
              onClick={() => {
                setSearchQuery('')
                setSelectedSpeakerFilter('all')
              }}
            >
              Reset Search & Filters
            </Button>
          </div>
        )}
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="border-border bg-popover text-popover-foreground animate-in slide-in-from-bottom-2 fade-in-0 fixed right-6 bottom-6 z-50 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium shadow-lg sm:text-sm">
          <Check className="size-4 shrink-0 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default AudioWaveformTranscript
