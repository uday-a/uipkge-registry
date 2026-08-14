'use client'

import * as React from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileCode2,
  ListVideo,
  Play,
  PlayCircle,
  Repeat,
  Repeat1,
  Search,
  Shuffle,
  SkipForward,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

export interface VideoResource {
  id: string
  name: string
  size: string
  type: 'code' | 'figma' | 'pdf'
}

export interface PlaylistItem {
  id: string
  index: number
  title: string
  instructor: string
  instructorRole: string
  instructorAvatar: string
  duration: string
  durationSec: number
  category: string
  summary: string
  isCompleted: boolean
  thumbnailGradient: string
  resources: VideoResource[]
}

const initialPlaylist: PlaylistItem[] = [
  {
    id: 'vid-01',
    index: 1,
    title: '01. Introduction to Component Registries',
    instructor: 'Marcus Vance',
    instructorRole: 'Principal Design Engineer',
    instructorAvatar: 'MV',
    duration: '14:20',
    durationSec: 860,
    category: 'Architecture',
    summary: 'Understanding unbundled component distribution, registry manifests, and own-your-code paradigms.',
    isCompleted: true,
    thumbnailGradient: 'from-slate-800 to-zinc-950',
    resources: [
      { id: 'res-1a', name: 'registry-schema-spec.pdf', size: '1.2 MB', type: 'pdf' },
      { id: 'res-1b', name: 'starter-registry.json', size: '48 KB', type: 'code' },
    ],
  },
  {
    id: 'vid-02',
    index: 2,
    title: '02. Headless Reka UI Primitives',
    instructor: 'Elena Rostova',
    instructorRole: 'Staff Frontend Engineer',
    instructorAvatar: 'ER',
    duration: '18:45',
    durationSec: 1125,
    category: 'Accessibility',
    summary: 'Composition with asChild, polymorphic slot mechanics, and ARIA state tree management.',
    isCompleted: true,
    thumbnailGradient: 'from-zinc-800 to-slate-950',
    resources: [
      { id: 'res-2a', name: 'reka-composition-cheatsheet.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 'res-2b', name: 'accessible-dialog.vue', size: '14 KB', type: 'code' },
    ],
  },
  {
    id: 'vid-03',
    index: 3,
    title: '03. Building with OKLCH Tokens',
    instructor: 'Sarah Connor',
    instructorRole: 'Design Systems Architect',
    instructorAvatar: 'SC',
    duration: '22:10',
    durationSec: 1330,
    category: 'Color Systems',
    summary: 'Perceptually uniform color spaces, wide-gamut Display P3 gamut mapping, and dark mode contrast.',
    isCompleted: false,
    thumbnailGradient: 'from-slate-850 to-zinc-950',
    resources: [
      { id: 'res-3a', name: 'tokens.config.css', size: '14.2 KB', type: 'code' },
      { id: 'res-3b', name: 'oklch-palette-matrix.fig', size: '4.8 MB', type: 'figma' },
      { id: 'res-3c', name: 'apca-contrast-guide.pdf', size: '1.1 MB', type: 'pdf' },
    ],
  },
  {
    id: 'vid-04',
    index: 4,
    title: '04. Micro-Interactions & Spring Physics',
    instructor: 'Alex Chen',
    instructorRole: 'Motion Design Lead',
    instructorAvatar: 'AC',
    duration: '19:35',
    durationSec: 1175,
    category: 'Motion & Physics',
    summary: 'Crafting tactile UI states, gesture dampening, spring curves, and 120fps hardware acceleration.',
    isCompleted: false,
    thumbnailGradient: 'from-zinc-800 to-zinc-950',
    resources: [
      { id: 'res-4a', name: 'spring-curves-preset.ts', size: '8.4 KB', type: 'code' },
      { id: 'res-4b', name: 'gesture-lab.fig', size: '3.6 MB', type: 'figma' },
    ],
  },
  {
    id: 'vid-05',
    index: 5,
    title: '05. Multi-Framework Parity Testing',
    instructor: 'Marcus Vance',
    instructorRole: 'Principal Design Engineer',
    instructorAvatar: 'MV',
    duration: '16:50',
    durationSec: 1010,
    category: 'Testing & Quality',
    summary: 'Automating visual regression tests and unit tests across dual Vue 3 and React 19 packages.',
    isCompleted: false,
    thumbnailGradient: 'from-slate-800 to-slate-950',
    resources: [
      { id: 'res-5a', name: 'parity-test-matrix.ts', size: '22.0 KB', type: 'code' },
      { id: 'res-5b', name: 'playwright.config.ts', size: '6.5 KB', type: 'code' },
    ],
  },
  {
    id: 'vid-06',
    index: 6,
    title: '06. CI/CD Deployment to Cloudflare',
    instructor: 'David Kim',
    instructorRole: 'DevOps & Cloud Engineer',
    instructorAvatar: 'DK',
    duration: '25:15',
    durationSec: 1515,
    category: 'DevOps & Edge',
    summary: 'Automating multi-framework build chains, registry sync, and edge deployment via Wrangler.',
    isCompleted: false,
    thumbnailGradient: 'from-zinc-850 to-zinc-950',
    resources: [
      { id: 'res-6a', name: 'wrangler.toml', size: '3.4 KB', type: 'code' },
      { id: 'res-6b', name: 'deploy-pipeline.yml', size: '5.1 KB', type: 'code' },
    ],
  },
]

export interface VideoPlaylistSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function VideoPlaylistSidebar({ className, ...props }: VideoPlaylistSidebarProps) {
  const [playlist, setPlaylist] = React.useState<PlaylistItem[]>(initialPlaylist)
  const [activeVideoId, setActiveVideoId] = React.useState<string>('vid-03')
  const [autoPlay, setAutoPlay] = React.useState<boolean>(true)
  const [isLooping, setIsLooping] = React.useState<boolean>(false)
  const [isShuffled, setIsShuffled] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [downloadedAssets, setDownloadedAssets] = React.useState<Record<string, boolean>>({})

  const activeVideo = React.useMemo(() => {
    return playlist.find((item) => item.id === activeVideoId) || playlist[0]
  }, [playlist, activeVideoId])

  const completedCount = React.useMemo(() => {
    return playlist.filter((item) => item.isCompleted).length
  }, [playlist])

  const totalCount = playlist.length
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const filteredVideos = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return playlist
    return playlist.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.instructor.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    )
  }, [playlist, searchQuery])

  const selectVideo = (id: string) => {
    setActiveVideoId(id)
  }

  const toggleComplete = (id: string) => {
    setPlaylist((prev) => prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)))
  }

  const nextVideo = () => {
    const currentIndex = playlist.findIndex((item) => item.id === activeVideoId)
    if (currentIndex === -1) return

    if (isShuffled) {
      const remaining = playlist.filter((item) => item.id !== activeVideoId)
      if (remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length)
        setActiveVideoId(remaining[randomIndex].id)
      }
      return
    }

    if (currentIndex < playlist.length - 1) {
      setActiveVideoId(playlist[currentIndex + 1].id)
    } else if (isLooping) {
      setActiveVideoId(playlist[0].id)
    }
  }

  const handleDownload = (assetId: string) => {
    setDownloadedAssets((prev) => ({ ...prev, [assetId]: true }))
    setTimeout(() => {
      setDownloadedAssets((prev) => ({ ...prev, [assetId]: false }))
    }, 2000)
  }

  return (
    <div
      data-slot="video-playlist-sidebar"
      className={cn('text-foreground mx-auto w-full max-w-2xl space-y-4', className)}
      {...props}
    >
      {/* Main Playlist Control Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="space-y-3 pb-3 sm:pb-4">
          {/* Badge row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 text-xs font-semibold">
                <ListVideo className="text-primary size-3.5" />
                <span>Video Playlist</span>
              </Badge>
              <Badge variant="outline" className="text-muted-foreground gap-1 font-mono text-xs">
                <Clock className="size-3" />
                <span>1h 56m Total</span>
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs font-medium">UIPKGE Masterclass Series</span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <CardTitle className="text-foreground text-lg font-bold tracking-tight sm:text-xl">
              Mastering Full-Stack UI Engineering
            </CardTitle>
            <CardDescription className="text-xs">
              Curated playlist on headless primitives, OKLCH token systems, fluid motion physics, and registry CI
              pipelines.
            </CardDescription>
          </div>

          {/* Progress bar and counter */}
          <div className="bg-muted/40 border-border/70 space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-semibold">
                <span className="font-mono tabular-nums">{completedCount}</span> /{' '}
                <span className="font-mono tabular-nums">{totalCount}</span> Videos Completed
              </span>
              <span className="text-primary font-mono font-bold tabular-nums">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Toolbar: Autoplay switch, Loop & Shuffle toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Autoplay next switch */}
            <div className="flex items-center gap-2.5">
              <Switch id="autoplay-switch-react" checked={autoPlay} onCheckedChange={setAutoPlay} size="sm" />
              <label
                htmlFor="autoplay-switch-react"
                className="text-foreground flex cursor-pointer items-center gap-1.5 text-xs font-medium select-none"
              >
                <Sparkles className="text-primary size-3.5" />
                <span>Autoplay Next Video</span>
              </label>
            </div>

            {/* Loop and Shuffle Buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7.5 gap-1.5 px-2.5 text-xs font-medium transition-colors',
                  isLooping
                    ? 'border-primary/30 bg-primary/10 text-primary border font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-pressed={isLooping}
                aria-label="Toggle loop playlist"
                onClick={() => setIsLooping(!isLooping)}
              >
                {isLooping ? <Repeat1 className="size-3.5" /> : <Repeat className="size-3.5" />}
                <span>Loop</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-7.5 gap-1.5 px-2.5 text-xs font-medium transition-colors',
                  isShuffled
                    ? 'border-primary/30 bg-primary/10 text-primary border font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-pressed={isShuffled}
                aria-label="Toggle shuffle playlist"
                onClick={() => setIsShuffled(!isShuffled)}
              >
                <Shuffle className="size-3.5" />
                <span>Shuffle</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Currently Active Video Card */}
      <Card className="border-primary/40 from-primary/5 via-card to-card relative overflow-hidden bg-gradient-to-br shadow-xs">
        <div className="bg-primary absolute top-0 right-0 left-0 h-0.5" />
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1.5 text-xs font-semibold">
                <span className="size-1.5 animate-pulse rounded-full bg-white" />
                <span>Now Playing</span>
              </Badge>
              <Badge variant="outline" className="font-mono text-xs font-medium">
                Lesson {activeVideo.index} of {totalCount}
              </Badge>
            </div>
            <span className="text-muted-foreground font-mono text-xs font-semibold tabular-nums">
              {activeVideo.duration}
            </span>
          </div>

          <div className="space-y-1 pt-1">
            <CardTitle className="text-foreground text-base font-bold tracking-tight sm:text-lg">
              {activeVideo.title}
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">{activeVideo.summary}</CardDescription>
          </div>

          {/* Instructor and Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="border-primary/30 bg-primary/15 text-primary flex size-7 items-center justify-center rounded-full border text-xs font-bold">
                {activeVideo.instructorAvatar}
              </div>
              <div>
                <p className="text-foreground text-xs font-semibold">{activeVideo.instructor}</p>
                <p className="text-muted-foreground text-xs">
                  {activeVideo.instructorRole} · {activeVideo.category}
                </p>
              </div>
            </div>

            {/* Video status controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeVideo.isCompleted ? 'secondary' : 'outline'}
                size="sm"
                className="h-7.5 gap-1.5 px-2.5 text-xs font-medium"
                onClick={() => toggleComplete(activeVideo.id)}
              >
                {activeVideo.isCompleted ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Check className="size-3.5" />
                )}
                <span>{activeVideo.isCompleted ? 'Completed' : 'Mark as Watched'}</span>
              </Button>

              <Button size="sm" className="h-7.5 gap-1.5 px-2.5 text-xs font-semibold shadow-xs" onClick={nextVideo}>
                <span>Next</span>
                <SkipForward className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Downloadable Lesson Exercise Files */}
        <CardContent className="border-border/60 bg-muted/20 border-t pt-3 pb-3.5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-tight uppercase">
                <FileCode2 className="text-primary size-3.5" />
                <span>Lesson Exercise Files</span>
              </p>
              <span className="text-muted-foreground font-mono text-xs">{activeVideo.resources.length} Files</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {activeVideo.resources.map((res) => (
                <div
                  key={res.id}
                  className="border-border/80 bg-card hover:bg-muted/40 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="border-primary/20 bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold">
                      {res.type === 'code' ? 'TS' : res.type === 'figma' ? 'FIG' : 'PDF'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-medium">{res.name}</p>
                      <p className="text-muted-foreground font-mono text-xs">{res.size}</p>
                    </div>
                  </div>

                  <Button
                    aria-label="Download attachment"
                    variant="outline"
                    size="sm"
                    className="h-6.5 shrink-0 gap-1 px-2 text-xs font-medium"
                    onClick={() => handleDownload(res.id)}
                  >
                    {downloadedAssets[res.id] ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Download className="size-3" />
                    )}
                    <span>{downloadedAssets[res.id] ? 'Saved' : 'Get'}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playlist Queue & List Header */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="space-y-3 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-foreground text-sm font-bold tracking-tight">Playlist Queue</CardTitle>
              <Badge variant="secondary" className="font-mono text-xs">
                {totalCount} Videos
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs font-medium">Click any lesson to play</span>
          </div>

          {/* Search / Filter input */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter playlist by title, instructor, or topic..."
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-md border pr-3 pl-8 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
            />
          </div>
        </CardHeader>

        {/* Video Items List */}
        <CardContent className="divide-border/60 divide-y p-0">
          {filteredVideos.map((video) => {
            const isActive = activeVideoId === video.id
            return (
              <div
                key={video.id}
                tabIndex={0}
                role="button"
                aria-label={`Play ${video.title}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative flex cursor-pointer items-center justify-between gap-3 p-3 transition-colors duration-150',
                  isActive ? 'border-primary/50 bg-primary/10 ring-primary/20 shadow-xs ring-1' : 'hover:bg-muted/40',
                )}
                onClick={() => selectVideo(video.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    selectVideo(video.id)
                  }
                }}
              >
                {/* Left active highlight bar */}
                {isActive && <div className="bg-primary absolute top-2 bottom-2 left-0 w-1 rounded-r shadow-xs" />}

                {/* Left Section: Index / Status Indicator + Video Thumbnail */}
                <div className="flex min-w-0 items-center gap-3">
                  {/* Play / Equalizer / Completed Status Icon */}
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    {isActive ? (
                      /* Animated Equalizer Sound Bars */
                      <div className="flex h-3.5 w-3.5 items-end justify-center gap-0.5" title="Playing">
                        <span className="bg-primary h-3 w-0.5 animate-pulse rounded-full" />
                        <span
                          className="bg-primary h-4 w-0.5 animate-pulse rounded-full"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="bg-primary h-2 w-0.5 animate-pulse rounded-full"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    ) : video.isCompleted ? (
                      <CheckCircle2
                        className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="text-muted-foreground font-mono text-xs font-semibold tabular-nums">
                        {video.index.toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  {/* 16:9 Video Thumbnail Preview */}
                  <div
                    className={cn(
                      'relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 bg-gradient-to-br shadow-xs sm:w-28',
                      video.thumbnailGradient,
                    )}
                  >
                    {/* Center Play Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle
                        className={cn(
                          'size-5 transition-transform group-hover:scale-110',
                          isActive ? 'text-primary fill-primary/20' : 'text-zinc-400/80',
                        )}
                      />
                    </div>

                    {/* Duration Badge (Bottom-Right) */}
                    <div className="absolute right-1 bottom-1 rounded bg-black/85 px-1 py-0.5 font-mono text-xs font-semibold text-white tabular-nums backdrop-blur-xs">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Title & Instructor Info */}
                  <div className="min-w-0 space-y-0.5">
                    <p
                      className={cn(
                        'truncate text-xs font-semibold transition-colors sm:text-sm',
                        isActive ? 'text-primary font-bold' : 'text-foreground group-hover:text-primary',
                      )}
                    >
                      {video.title}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      <span>{video.instructor}</span>
                      <span className="mx-1.5">·</span>
                      <span>{video.category}</span>
                    </p>
                  </div>
                </div>

                {/* Right Section: Status Badge & Quick Watch Toggle */}
                <div className="flex shrink-0 items-center gap-2">
                  {isActive ? (
                    <Badge variant="default" className="hidden px-2 py-0.5 text-xs font-semibold sm:inline-flex">
                      Playing
                    </Badge>
                  ) : video.isCompleted ? (
                    <Badge
                      variant="outline"
                      className="hidden gap-1 px-1.5 py-0.5 text-xs font-medium text-emerald-600 sm:inline-flex dark:text-emerald-400"
                    >
                      <Check className="size-3" />
                      <span>Watched</span>
                    </Badge>
                  ) : null}

                  {/* Toggle complete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-7 shrink-0"
                    aria-label={video.isCompleted ? 'Mark as unwatched' : 'Mark as watched'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleComplete(video.id)
                    }}
                  >
                    {video.isCompleted ? (
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isActive ? (
                      <Play className="text-primary size-3.5 fill-current" />
                    ) : (
                      <Check className="text-muted-foreground/60 hover:text-foreground size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}

          {filteredVideos.length === 0 && (
            <div className="text-muted-foreground p-8 text-center text-xs">No lessons match your search criteria.</div>
          )}
        </CardContent>

        <CardFooter className="border-border/60 bg-muted/20 flex items-center justify-between border-t p-3 text-xs">
          <span className="text-muted-foreground">Mastering Full-Stack UI Engineering</span>
          <span className="text-muted-foreground font-mono font-medium tabular-nums">
            {completedCount}/{totalCount} Completed ({progressPercent}%)
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}

export default VideoPlaylistSidebar
