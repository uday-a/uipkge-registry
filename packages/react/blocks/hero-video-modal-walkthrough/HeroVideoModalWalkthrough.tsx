'use client'

import * as React from 'react'
import { BookOpen, Maximize2, Pause, Play, Sparkles, Star, Volume2, VolumeX, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface VideoChapter {
  id: string
  title: string
  timestamp: string
  description: string
}

const chapters: VideoChapter[] = [
  {
    id: 'intro',
    title: '1. Architecture & Registry Engine',
    timestamp: '0:45',
    description: 'Learn how unbundled components provide 100% source ownership without npm dependencies.',
  },
  {
    id: 'tokens',
    title: '2. OKLCH Theme & Token System',
    timestamp: '1:30',
    description: 'Explore the fluid color space engine and dynamic contrast balancing in Tailwind v4.',
  },
  {
    id: 'parity',
    title: '3. Dual-Framework Parity Model',
    timestamp: '2:15',
    description: 'Deep dive into mirror synchronization between Vue 3.5 SFC and React 19 TSX.',
  },
]

export interface HeroVideoModalWalkthroughProps {
  className?: string
}

export function HeroVideoModalWalkthrough({ className }: HeroVideoModalWalkthroughProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [isMuted, setIsMuted] = React.useState(false)
  const [playbackSpeed, setPlaybackSpeed] = React.useState<1 | 1.5 | 2>(1)
  const [activeChapterIndex, setActiveChapterIndex] = React.useState(0)
  const [progressPercent] = React.useState(38)

  const currentChapter = chapters[activeChapterIndex]

  const openModal = (index = 0) => {
    setActiveChapterIndex(index)
    setIsModalOpen(true)
    setIsPlaying(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsPlaying(false)
  }

  return (
    <section
      data-slot="hero-video-modal-walkthrough"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      {/* Ambient Glow Background */}
      <div className="bg-primary/10 pointer-events-none absolute top-12 left-1/2 -z-10 h-72 w-full max-w-5xl -translate-x-1/2 rounded-full blur-xl" />

      <div className="mx-auto max-w-6xl space-y-12 text-center">
        {/* Headline & Subtitle */}
        <div className="mx-auto max-w-3xl space-y-5">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Sparkles className="text-primary size-3.5" />
            Interactive 3-Minute Architecture Walkthrough
          </Badge>

          <h1 className="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            See how top engineering teams build with UIPKGE.
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Watch a full walkthrough of our design engineering principles, OKLCH token engine, and dual-framework
            component architecture.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button size="lg" className="gap-2 font-semibold shadow-xs" onClick={() => openModal(0)}>
              <Play className="size-4 fill-current" />
              <span>Watch Product Tour (3:30)</span>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2 font-medium">
              <a href="#docs">
                <BookOpen className="text-muted-foreground size-4" />
                <span>Read Architecture RFC</span>
              </a>
            </Button>
          </div>

          {/* Social Proof Avatars & Stars */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 pt-3 text-xs">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="ring-background bg-primary/20 text-primary flex inline-block size-7 items-center justify-center rounded-full text-xs font-bold ring-2">
                RF
              </div>
              <div className="ring-background flex inline-block size-7 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-600 ring-2">
                PC
              </div>
              <div className="ring-background flex inline-block size-7 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-600 ring-2">
                EK
              </div>
              <div className="ring-background flex inline-block size-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-600 ring-2">
                SH
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
              <span className="text-foreground ml-1 font-mono text-xs font-medium">
                4.9/5 by 1,400+ Design Engineers
              </span>
            </div>
          </div>
        </div>

        {/* Video Preview Card & Chapter Trigger Grid */}
        <div className="mx-auto max-w-4xl">
          <Card
            className="border-border bg-card/95 group cursor-pointer overflow-hidden rounded-2xl p-2 shadow-sm backdrop-blur-md"
            onClick={() => openModal(0)}
          >
            {/* Video Thumbnail Frame */}
            <div className="bg-muted/60 border-border/80 relative flex aspect-video flex-col justify-between overflow-hidden rounded-xl border p-6 text-left">
              {/* Overlay Backdrop Texture */}
              <div className="from-background/95 via-background/40 absolute inset-0 z-0 bg-gradient-to-t to-transparent" />

              {/* Top Row: Badge & Length */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-background/80 border-border text-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium backdrop-blur-md">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  <span>Full HD &bull; 60 FPS</span>
                </span>
                <span className="bg-background/80 border-border text-muted-foreground rounded-md border px-2.5 py-1 font-mono text-xs backdrop-blur-md">
                  Total runtime: 3m 30s
                </span>
              </div>

              {/* Center: Play Button Beacon */}
              <div className="relative z-10 flex flex-col items-center justify-center py-8">
                <div className="bg-primary text-primary-foreground shadow-primary/25 flex size-16 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 sm:size-20">
                  <Play className="ml-1 size-7 fill-current sm:size-8" />
                </div>
                <p className="text-foreground mt-4 text-sm font-semibold tracking-tight">
                  Click to Launch Interactive Player
                </p>
              </div>

              {/* Bottom: Chapter Navigation Strip */}
              <div className="border-border/60 relative z-10 grid grid-cols-1 gap-2 border-t pt-2 sm:grid-cols-3">
                {chapters.map((chapter, idx) => (
                  <div
                    key={chapter.id}
                    className="bg-background/60 border-border/50 hover:bg-background/90 rounded-lg border p-2 text-left backdrop-blur-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(idx)
                    }}
                  >
                    <div className="text-muted-foreground flex items-center justify-between font-mono text-xs">
                      <span className="truncate">{chapter.title.split('.')[1]}</span>
                      <span className="text-primary font-bold">{chapter.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Video Dialog Modal */}
      {isModalOpen && (
        <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md sm:p-6">
          <div className="bg-card border-border relative w-full max-w-4xl overflow-hidden rounded-2xl border text-left shadow-sm">
            {/* Modal Top Bar */}
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary size-2.5 rounded-full" />
                <span className="text-foreground font-mono text-xs font-semibold">{currentChapter.title}</span>
              </div>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
                onClick={closeModal}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Simulated Video Playback Viewport */}
            <div className="relative flex aspect-video flex-col justify-between bg-neutral-950 p-6 text-white select-none">
              <div className="flex items-center justify-between font-mono text-xs opacity-80">
                <span>UIPKGE Architecture Masterclass</span>
                <span>OKLCH Engine v2.4</span>
              </div>

              {/* Video Mock Graphic */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                  {!isPlaying ? <Play className="ml-1 size-7 fill-current" /> : <Pause className="size-7" />}
                </div>
                <p className="max-w-md text-center font-mono text-xs text-neutral-400">{currentChapter.description}</p>
              </div>

              {/* Timeline Scrubber & Controls */}
              <div className="space-y-2">
                {/* Progress Bar */}
                <div className="h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-white/20">
                  <div
                    className="bg-primary h-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="hover:text-primary transition-colors"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
                    </button>
                    <button
                      type="button"
                      className="hover:text-primary transition-colors"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                    </button>
                    <span className="text-neutral-400">{currentChapter.timestamp} / 3:30</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded bg-white/10 px-2 py-0.5 transition-colors hover:bg-white/20"
                      onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                    >
                      {playbackSpeed}x
                    </button>
                    <button type="button" className="hover:text-primary p-1 transition-colors">
                      <Maximize2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Chapter Selector Footer */}
            <div className="border-border bg-muted/20 grid grid-cols-3 border-t">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  className={cn(
                    'border-border border-r p-3 text-left font-mono text-xs transition-colors last:border-r-0',
                    activeChapterIndex === idx
                      ? 'bg-background text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setActiveChapterIndex(idx)}
                >
                  <div className="truncate">{ch.title}</div>
                  <div className="text-muted-foreground mt-0.5 text-xs">{ch.timestamp}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
export default HeroVideoModalWalkthrough
