import * as React from 'react'
import { ArrowRight, Play, Video, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface VideoTestimonial {
  id: string
  name: string
  role: string
  company: string
  category: 'fintech' | 'saas' | 'ai'
  quote: string
  duration: string
  metricHighlight: string
  metricLabel: string
}

export interface SocialProofVideoWallProps {
  title?: string
  description?: string
  testimonials?: VideoTestimonial[]
  className?: string
}

const DEFAULT_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'story-1',
    name: 'Elena Rostova',
    role: 'Staff Frontend Architect',
    company: 'FinFlow Global',
    category: 'fintech',
    quote:
      'Unbundled components gave our core engineering team complete ownership over PCI-compliant ledger tables without maintaining a bloated bespoke fork.',
    duration: '2:14',
    metricHighlight: '4.2x Faster',
    metricLabel: 'Sprint delivery velocity',
  },
  {
    id: 'story-2',
    name: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'Synthetix AI',
    category: 'ai',
    quote:
      'Our AI canvas needed sub-millisecond AST updates. Copying pure Vue and React primitives eliminated hours of npm dependency version conflicts.',
    duration: '1:48',
    metricHighlight: '-380 KB',
    metricLabel: 'Zero runtime bundle overhead',
  },
  {
    id: 'story-3',
    name: 'Sarah Chen',
    role: 'Head of Product Design',
    company: 'Linearis Cloud',
    category: 'saas',
    quote:
      'The Tailwind v4 token system and OKLCH color palettes match our design system tokens 1:1. Zero translation friction between Figma and code.',
    duration: '3:05',
    metricHighlight: '100% Token Sync',
    metricLabel: 'Figma to code parity',
  },
  {
    id: 'story-4',
    name: 'Devon Wright',
    role: 'Principal Engineer',
    company: 'OmniStream Data',
    category: 'saas',
    quote:
      'We replaced 14 disparate npm UI libraries with a single clean registry pull. Full keyboard ergonomics and ARIA compliance right out of the box.',
    duration: '2:30',
    metricHighlight: '14 -> 1',
    metricLabel: 'Vendor dependency consolidation',
  },
]

export function SocialProofVideoWall({
  title = 'Trusted by world-class design engineers and platform architects.',
  description = 'Discover how high-velocity engineering organizations leverage unbundled UI primitives to build ultra-fast, accessible products.',
  testimonials = DEFAULT_TESTIMONIALS,
  className,
}: SocialProofVideoWallProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'all' | 'fintech' | 'saas' | 'ai'>('all')
  const [activeVideo, setActiveVideo] = React.useState<VideoTestimonial | null>(null)

  const filteredTestimonials = React.useMemo(() => {
    if (selectedCategory === 'all') return testimonials
    return testimonials.filter((t) => t.category === selectedCategory)
  }, [testimonials, selectedCategory])

  return (
    <section
      data-slot="social-proof-video-wall"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#customer-stories"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Video className="text-primary size-3.5" />
            <span>Engineering Case Studies</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Customer Stories' },
              { id: 'saas', label: 'Enterprise SaaS' },
              { id: 'fintech', label: 'Fintech & Security' },
              { id: 'ai', label: 'AI & Data Platforms' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  selectedCategory === cat.id
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedCategory(cat.id as any)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid (2x2) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredTestimonials.map((item) => (
            <Card
              key={item.id}
              className="group border-border bg-card/80 hover:border-primary/40 relative flex flex-col justify-between overflow-hidden shadow-xs backdrop-blur-xs transition-all hover:shadow-sm"
            >
              <CardContent className="space-y-5 p-6">
                {/* Simulated Video Preview Banner */}
                <div
                  className="border-border bg-muted/60 group/video relative flex aspect-16/9 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border"
                  onClick={() => setActiveVideo(item)}
                >
                  {/* Center Play Icon */}
                  <div className="bg-background/90 text-primary flex size-12 items-center justify-center rounded-full shadow-md transition-transform group-hover/video:scale-110">
                    <Play className="fill-primary size-5 pl-0.5" />
                  </div>

                  {/* Top Pill (Duration) */}
                  <div className="bg-background/80 text-foreground absolute right-2.5 bottom-2.5 rounded px-2 py-0.5 font-mono text-xs font-medium backdrop-blur-xs">
                    {item.duration}
                  </div>

                  {/* Top Left Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <Badge
                      variant="outline"
                      className="border-border/80 bg-background/80 font-mono text-xs tracking-wider uppercase backdrop-blur-xs"
                    >
                      {item.company}
                    </Badge>
                  </div>
                </div>

                {/* Quote & Speaker Details */}
                <div className="space-y-3">
                  <p className="text-muted-foreground text-xs leading-relaxed italic">&ldquo;{item.quote}&rdquo;</p>

                  <div className="border-border/80 flex items-center justify-between border-t pt-3">
                    <div>
                      <div className="text-foreground text-xs font-bold">{item.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.role} &bull; {item.company}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-emerald-500">{item.metricHighlight}</div>
                      <div className="text-muted-foreground text-xs">{item.metricLabel}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Modal Simulation */}
        {activeVideo && (
          <div
            className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="border-border bg-card relative w-full max-w-2xl space-y-4 rounded-xl border p-6 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Video className="text-primary size-4" />
                  <span className="text-foreground text-sm font-bold">
                    {activeVideo.company} &bull; Architecture Deep-Dive
                  </span>
                </div>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground rounded-md p-1"
                  onClick={() => setActiveVideo(null)}
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Video Play Area */}
              <div className="border-border bg-muted/40 flex aspect-16/9 w-full flex-col items-center justify-center space-y-2 rounded-lg border p-6 text-center">
                <div className="bg-primary text-primary-foreground flex size-14 animate-pulse items-center justify-center rounded-full shadow-lg">
                  <Play className="fill-primary-foreground size-6 pl-0.5" />
                </div>
                <div className="text-foreground text-xs font-bold">Streaming Case Study (HD 1080p)</div>
                <div className="text-muted-foreground text-xs">
                  {activeVideo.name} &bull; {activeVideo.role}
                </div>
              </div>

              <div className="text-muted-foreground text-xs">&ldquo;{activeVideo.quote}&rdquo;</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
