'use client'

import { useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Heart,
  MessageSquare,
  Newspaper,
  Rss,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export interface NewsletterIssue {
  id: string
  issueNumber: number
  volumeDate: string
  title: string
  excerpt: string
  category: 'Architecture' | 'Design Tokens' | 'Performance' | 'Interviews'
  tags: string[]
  readTime: string
  date: string
  commentsCount: number
  likesCount: number
  featured?: boolean
}

export interface NewsletterIssueArchiveProps {
  publicationName?: string
  subtitle?: string
  subscriberCount?: string
  className?: string
}

const categories = ['All Issues', 'Architecture', 'Design Tokens', 'Performance', 'Interviews'] as const

const featuredIssue: NewsletterIssue = {
  id: 'issue-43',
  issueNumber: 43,
  volumeDate: 'Aug 2026',
  title: 'The Death of npm Component Libraries: Why Copy-Paste Architecture Won',
  excerpt:
    'How unbundled UI registries replaced monolithic node_modules packages, eliminated dependency hell, and gave full code ownership back to frontend engineering teams across the industry.',
  category: 'Architecture',
  tags: ['#architecture', '#registries', '#future-of-web', '#tooling'],
  readTime: '9 min read',
  date: 'Aug 25, 2026',
  commentsCount: 128,
  likesCount: 1420,
  featured: true,
}

const archiveIssues: NewsletterIssue[] = [
  {
    id: 'issue-42',
    issueNumber: 42,
    volumeDate: 'Aug 2026',
    title: 'Why Zero-Dependency Registries Are Winning',
    excerpt:
      'A deep dive into why enterprise engineering teams are abandoning monolithic UI packages in favor of composable own-your-code registry models that eliminate breaking upgrade cascades.',
    category: 'Architecture',
    tags: ['#architecture', '#web-performance', '#dx'],
    readTime: '6 min read',
    date: 'Aug 18, 2026',
    commentsCount: 84,
    likesCount: 642,
  },
  {
    id: 'issue-41',
    issueNumber: 41,
    volumeDate: 'Aug 2026',
    title: 'Mastering Tailwind v4: OKLCH Colors & Dynamic Themes',
    excerpt:
      'How modern CSS color spaces and inline theme definitions unlock mathematically perceptually uniform light/dark transitions without CSS variables explosion.',
    category: 'Design Tokens',
    tags: ['#design-tokens', '#css', '#theming'],
    readTime: '8 min read',
    date: 'Aug 11, 2026',
    commentsCount: 56,
    likesCount: 519,
  },
  {
    id: 'issue-40',
    issueNumber: 40,
    volumeDate: 'Aug 2026',
    title: 'Zero-CLS Island Hydration in Modern Web Frameworks',
    excerpt:
      'Eliminating Cumulative Layout Shift when server-rendered islands hydrate in Astro and Nuxt. Practical patterns distilled from serving 1M+ monthly pageviews.',
    category: 'Performance',
    tags: ['#performance', '#core-web-vitals', '#astro'],
    readTime: '5 min read',
    date: 'Aug 04, 2026',
    commentsCount: 92,
    likesCount: 730,
  },
  {
    id: 'issue-39',
    issueNumber: 39,
    volumeDate: 'Jul 2026',
    title: 'Interview: Building High-Craft Interfaces with Paco Coursey',
    excerpt:
      'The creator of cmdk and sonner breaks down spring physics, popover placement math, and why 60fps micro-interactions define software brand trust.',
    category: 'Interviews',
    tags: ['#interviews', '#craft', '#animation'],
    readTime: '11 min read',
    date: 'Jul 28, 2026',
    commentsCount: 147,
    likesCount: 1205,
  },
  {
    id: 'issue-38',
    issueNumber: 38,
    volumeDate: 'Jul 2026',
    title: 'Building Resilient Component APIs with Polymorphic Slots',
    excerpt:
      'Why the asChild composition pattern beat standard prop drilling for accessible primitives, and how Reka UI implements headless polymorphism without DOM overhead.',
    category: 'Architecture',
    tags: ['#architecture', '#vue', '#reka-ui'],
    readTime: '7 min read',
    date: 'Jul 21, 2026',
    commentsCount: 63,
    likesCount: 488,
  },
  {
    id: 'issue-37',
    issueNumber: 37,
    volumeDate: 'Jul 2026',
    title: 'Designing for Multi-Tenant White-Labeling at Scale',
    excerpt:
      'Architecting a headless token graph that dynamically maps corporate brand identities and custom color palettes across 500+ enterprise subdomains in real time.',
    category: 'Design Tokens',
    tags: ['#design-tokens', '#architecture', '#enterprise'],
    readTime: '9 min read',
    date: 'Jul 14, 2026',
    commentsCount: 71,
    likesCount: 610,
  },
]

export function NewsletterIssueArchive({
  publicationName = 'The Unbundled Engineer',
  subtitle = 'Weekly architectural teardowns of modern design systems, web performance, and component registries.',
  subscriberCount = '42,500+ Subscribers · Top 1% on Substack',
  className,
}: NewsletterIssueArchiveProps) {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All Issues')

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setIsSubscribed(true)
  }

  const filteredIssues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return archiveIssues.filter((issue) => {
      const matchesCategory = selectedCategory === 'All Issues' || issue.category === selectedCategory

      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.excerpt.toLowerCase().includes(query) ||
        issue.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        `issue #${issue.issueNumber}`.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory])

  function getCategoryCount(cat: string) {
    if (cat === 'All Issues') return archiveIssues.length
    return archiveIssues.filter((issue) => issue.category === cat).length
  }

  function clearFilters() {
    setSearchQuery('')
    setSelectedCategory('All Issues')
  }

  return (
    <div
      data-slot="newsletter-issue-archive"
      className={cn('mx-auto w-full max-w-5xl space-y-12 px-4 py-8 sm:px-6 sm:py-12', className)}
    >
      {/* Newsletter Header Hero */}
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium shadow-xs">
          <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{subscriberCount}</span>
        </div>

        <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{publicationName}</h1>

        <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">{subtitle}</p>

        {/* Subscribe Form */}
        <div className="mx-auto w-full max-w-md pt-2">
          {!isSubscribed ? (
            <div>
              <form className="flex flex-col gap-2 sm:flex-row sm:gap-0" onSubmit={handleSubscribe}>
                <Input
                  id="newsletter-archive-email-react"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your work email..."
                  required
                  className="bg-card h-11 text-sm shadow-xs sm:rounded-r-none"
                  aria-label="Work email address"
                />
                <Button type="submit" className="h-11 shrink-0 px-6 font-medium sm:rounded-l-none">
                  Subscribe for Free
                </Button>
              </form>
              <p className="text-muted-foreground mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
                <span>Free weekly issues</span>
                <span>Zero spam</span>
                <span>1-click unsubscribe</span>
              </p>
            </div>
          ) : (
            <div className="border-success/30 bg-success/10 text-success inline-flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-xs">
              <Check className="size-4 shrink-0" aria-hidden="true" />
              <span>You&rsquo;re subscribed! Check your inbox for confirmation.</span>
            </div>
          )}
        </div>
      </header>

      {/* Featured Issue Spotlight Card */}
      <section aria-labelledby="featured-issue-heading-react" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2
            id="featured-issue-heading-react"
            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
          >
            Pinned Spotlight Edition
          </h2>
          <Badge variant="outline" className="text-primary border-primary/30 gap-1 text-xs">
            <Sparkles className="size-3" aria-hidden="true" /> Latest Release
          </Badge>
        </div>

        <Card className="border-border/80 bg-card hover:border-primary/40 overflow-hidden shadow-xs transition-all">
          <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-12">
            {/* Text Content */}
            <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="font-mono text-xs">
                    Issue #{featuredIssue.issueNumber} · {featuredIssue.volumeDate}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {featuredIssue.category}
                  </Badge>
                  <span className="text-muted-foreground ml-auto inline-flex items-center gap-1 text-xs">
                    <Clock className="size-3" aria-hidden="true" />
                    {featuredIssue.readTime}
                  </span>
                </div>

                <h3 className="text-foreground hover:text-primary cursor-pointer text-xl font-bold tracking-tight transition-colors sm:text-2xl">
                  {featuredIssue.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{featuredIssue.excerpt}</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {featuredIssue.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-muted-foreground font-mono text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-t pt-3">
                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      {featuredIssue.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquare className="size-3.5" aria-hidden="true" />
                      {featuredIssue.commentsCount} comments
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="size-3.5" aria-hidden="true" />
                      {featuredIssue.likesCount}
                    </span>
                  </div>

                  <Button variant="default" size="sm" className="group gap-1.5 font-medium">
                    Read Issue
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Schematic Cover Illustration */}
            <div className="flex items-center lg:col-span-5">
              <div className="border-border/80 bg-muted/40 w-full rounded-lg border p-4 font-mono text-xs sm:p-5">
                <div className="border-border/60 mb-3 flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-destructive/60 inline-block size-2.5 rounded-full" />
                    <span className="bg-warning/60 inline-block size-2.5 rounded-full" />
                    <span className="bg-success/60 inline-block size-2.5 rounded-full" />
                  </div>
                  <span className="text-muted-foreground text-xs">registry-teardown.ts</span>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <div className="text-primary text-xs font-medium">// Own your component code</div>
                  <div>
                    <span className="text-foreground">$</span> npx shadcn@latest add @uipkge/card
                  </div>
                  <div className="text-emerald-600 dark:text-emerald-400">✔ Fetched raw TypeScript TSX</div>
                  <div className="text-emerald-600 dark:text-emerald-400">✔ Merged local Tailwind v4 tokens</div>
                  <div className="text-muted-foreground/80 pt-1">// Zero runtime package lock-in</div>
                </div>
                <div className="border-border/40 mt-4 flex flex-wrap gap-1.5 border-t pt-3">
                  <span className="bg-background text-foreground border-border rounded border px-2 py-0.5 text-xs">
                    Zero npm deps
                  </span>
                  <span className="bg-background text-foreground border-border rounded border px-2 py-0.5 text-xs">
                    Tailwind v4
                  </span>
                  <span className="bg-background text-foreground border-border rounded border px-2 py-0.5 text-xs">
                    OKLCH
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Search and Filter Bar */}
      <section aria-label="Search and filter archive" className="space-y-4">
        <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
          {/* Search Input */}
          <div className="w-full md:max-w-md">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search issues by title, topic, or tag..."
              prefixIcon={<Search className="size-4" aria-hidden="true" />}
              allowClear
              className="bg-card shadow-xs"
              aria-label="Search archive issues"
            />
          </div>

          {/* Result Counter */}
          <div className="text-muted-foreground flex items-center justify-between gap-3 text-xs md:justify-end">
            <span>
              Showing {filteredIssues.length} {filteredIssues.length === 1 ? 'edition' : 'editions'}
            </span>
            {(searchQuery || selectedCategory !== 'All Issues') && (
              <button
                type="button"
                className="text-primary focus-visible:ring-ring inline-flex items-center gap-1 rounded font-medium hover:underline focus-visible:ring-1 focus-visible:outline-none"
                onClick={clearFilters}
              >
                Reset filters
                <X className="size-3" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by category">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  isSelected
                    ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    isSelected
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-background/80 text-muted-foreground',
                  )}
                >
                  {getCategoryCount(cat)}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Issue Archive List */}
      <section aria-label="Archive issue list">
        {filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className="group border-border/70 bg-card hover:border-primary/40 flex flex-col justify-between transition-all hover:shadow-xs"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      Issue #{issue.issueNumber} · {issue.volumeDate}
                    </Badge>
                    <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                      <Clock className="size-3" aria-hidden="true" />
                      {issue.readTime}
                    </span>
                  </div>

                  <CardTitle className="group-hover:text-primary cursor-pointer pt-2 text-base leading-snug font-semibold tracking-tight transition-colors sm:text-lg">
                    {issue.title}
                  </CardTitle>

                  <CardDescription className="text-muted-foreground mt-1.5 line-clamp-3 text-sm leading-relaxed">
                    {issue.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-0">
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {issue.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-border/60 text-muted-foreground mt-4 flex items-center justify-between border-t pt-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      {issue.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="size-3.5" aria-hidden="true" />
                      {issue.commentsCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="size-3.5" aria-hidden="true" />
                      {issue.likesCount}
                    </span>
                  </div>

                  <a
                    href="#read"
                    className="text-foreground group-hover:text-primary inline-flex items-center gap-1 font-medium transition-colors focus-visible:underline focus-visible:outline-none"
                  >
                    <span>Read Issue</span>
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="border-border bg-card/50 space-y-3 rounded-xl border border-dashed p-10 text-center">
            <Newspaper className="text-muted-foreground/60 mx-auto size-8" aria-hidden="true" />
            <h3 className="text-foreground text-base font-semibold">No issues found</h3>
            <p className="text-muted-foreground mx-auto max-w-sm text-sm">
              No newsletter issues matched &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear search &amp; filters
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Publication Cadence & RSS Bar */}
      <footer className="border-border/80 bg-muted/30 flex flex-col items-center justify-between gap-4 rounded-xl border p-6 text-center shadow-xs sm:flex-row sm:text-left">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Never miss a teardown</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Published every Tuesday morning. Zero sponsor promotions, purely deep technical architecture.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Rss className="size-3.5" aria-hidden="true" />
            RSS Feed
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              const el = document.getElementById('newsletter-archive-email-react')
              el?.focus()
            }}
          >
            <Bookmark className="size-3.5" aria-hidden="true" />
            Join Newsletter
          </Button>
        </div>
      </footer>
    </div>
  )
}
