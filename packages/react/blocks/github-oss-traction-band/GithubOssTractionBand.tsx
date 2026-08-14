'use client'

import * as React from 'react'
import {
  Check,
  Copy,
  GitBranch,
  GitPullRequest,
  MessageSquare,
  Package,
  Star,
  Terminal,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const Github = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 016 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
  </svg>
)

interface ReleaseItem {
  version: string
  date: string
  title: string
  type: 'feature' | 'primitive' | 'block'
}

const recentReleases: ReleaseItem[] = [
  { version: 'v2.4.0', date: 'Yesterday', title: 'Added 12 new Marketing & Conversion Workbenches', type: 'block' },
  {
    version: 'v2.3.8',
    date: '3 days ago',
    title: 'OKLCH Dynamic Theme Engine & Tailored HSL generator',
    type: 'feature',
  },
  { version: 'v2.3.5', date: 'Last week', title: 'Added SegmentedGauge & SmoothFunnel primitives', type: 'primitive' },
  {
    version: 'v2.3.0',
    date: '2 weeks ago',
    title: 'Full React 19 single-curly-brace AST parity validation',
    type: 'feature',
  },
]

export interface GithubOssTractionBandProps {
  className?: string
}

export function GithubOssTractionBand({ className }: GithubOssTractionBandProps) {
  const [starCount] = React.useState('14.8k')
  const [isCopied, setIsCopied] = React.useState(false)
  const [commandText] = React.useState('npx shadcn add https://uipkge.dev/r/react/init.json')

  const copyCommand = () => {
    navigator.clipboard.writeText(commandText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <section
      data-slot="github-oss-traction-band"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      {/* Ambient Glow Background */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" />

      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="border-border/60 flex flex-col items-center justify-between gap-6 border-b pb-8 text-center md:flex-row md:text-left">
          <div className="space-y-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
              <Github className="size-3.5" />
              100% Free &amp; Open Source on GitHub
            </Badge>
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Backed by a thriving open-source community.
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Zero vendor lock-in. 100% unbundled source code ownership under the permissive MIT License.
            </p>
          </div>

          {/* GitHub Primary Action */}
          <div className="flex shrink-0 items-center gap-3">
            <Button asChild size="lg" className="gap-2 font-semibold shadow-xs">
              <a href="https://github.com/uday-a/uipkge" target="_blank" rel="noreferrer">
                <Github className="size-4" />
                <span>Star on GitHub</span>
                <Badge
                  variant="outline"
                  className="bg-primary-foreground/20 text-primary-foreground ml-1 border-transparent font-mono text-xs"
                >
                  {starCount}
                </Badge>
              </a>
            </Button>
          </div>
        </div>

        {/* 4-Stat Community Traction Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Stars */}
          <Card className="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-mono text-xs">GitHub Stars</span>
              <Star className="size-4 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-foreground font-mono text-3xl font-bold">14,820</p>
            <p className="flex items-center gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-3" /> +420 this week
            </p>
          </Card>

          {/* Weekly Installs */}
          <Card className="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-mono text-xs">Weekly Installs</span>
              <Package className="text-primary size-4" />
            </div>
            <p className="text-foreground font-mono text-3xl font-bold">142,500</p>
            <p className="text-muted-foreground font-mono text-xs">Across Vue &amp; React</p>
          </Card>

          {/* Active Contributors */}
          <Card className="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-mono text-xs">Contributors</span>
              <GitPullRequest className="size-4 text-emerald-500" />
            </div>
            <p className="text-foreground font-mono text-3xl font-bold">84+</p>
            <p className="text-muted-foreground font-mono text-xs">Design engineers</p>
          </Card>

          {/* Discord Community */}
          <Card className="border-border bg-card/80 space-y-2 rounded-2xl p-5 shadow-xs">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-mono text-xs">Community</span>
              <MessageSquare className="size-4 text-blue-500" />
            </div>
            <p className="text-foreground font-mono text-3xl font-bold">4,200+</p>
            <p className="text-muted-foreground font-mono text-xs">Active builders</p>
          </Card>
        </div>

        {/* Live Release Pulse & Quick CLI Card */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Recent Releases Feed */}
          <Card className="border-border bg-card/90 space-y-4 rounded-2xl p-6 text-left shadow-sm">
            <div className="border-border flex items-center justify-between border-b pb-3">
              <h3 className="text-foreground flex items-center gap-2 font-mono text-sm font-bold">
                <GitBranch className="text-primary size-4" /> Recent Registry Releases
              </h3>
              <span className="text-muted-foreground font-mono text-xs">Continuous Shipping</span>
            </div>

            <div className="space-y-3">
              {recentReleases.map((rel, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono font-bold">{rel.version}</span>
                      <Badge variant="outline" className="font-mono text-xs capitalize">
                        {rel.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-snug">{rel.title}</p>
                  </div>
                  <span className="text-muted-foreground shrink-0 font-mono text-xs">{rel.date}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Install CLI Terminal */}
          <Card className="border-border bg-card/90 flex flex-col justify-between space-y-4 rounded-2xl p-6 text-left shadow-sm">
            <div className="space-y-1">
              <h3 className="text-foreground flex items-center gap-2 font-mono text-sm font-bold">
                <Terminal className="size-4 text-emerald-500" /> Quickstart CLI
              </h3>
              <p className="text-muted-foreground text-xs">
                Add tokens, utils, and theme scaffolding into your repository in seconds.
              </p>
            </div>

            {/* Code Box */}
            <div className="border-border bg-background text-foreground flex items-center justify-between gap-2 overflow-hidden rounded-xl border p-3.5 font-mono text-xs">
              <span className="text-muted-foreground truncate">
                <span className="text-primary font-bold">&gt;</span> {commandText}
              </span>
              <Button size="sm" variant="ghost" className="h-8 shrink-0 gap-1.5 px-2 text-xs" onClick={copyCommand}>
                {isCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>
            </div>

            <div className="text-muted-foreground border-border/60 flex items-center justify-between border-t pt-2 font-mono text-xs">
              <span>Supports Vue 3.5, Nuxt, React 19, Next.js</span>
              <span className="font-semibold text-emerald-500">&check; Zero lock-in</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default GithubOssTractionBand
