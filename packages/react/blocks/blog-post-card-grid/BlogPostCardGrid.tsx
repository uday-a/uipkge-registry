'use client'

import * as React from 'react'
import { useState, useMemo, type FormEvent } from 'react'
import { ArrowRight, BookOpen, Check, Clock, Loader2, Mail, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface Author {
  name: string
  role: string
  avatar: string
  initials: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: 'Architecture' | 'Design Systems' | 'Performance' | 'Tutorials'
  readTime: string
  date: string
  image: string
  author: Author
}

export interface BlogPostCardGridProps extends React.HTMLAttributes<HTMLElement> {
  showFeatured?: boolean
}

const categories = ['All', 'Architecture', 'Design Systems', 'Performance', 'Tutorials'] as const
type Category = (typeof categories)[number]

const featuredPost: BlogPost = {
  id: 'featured-1',
  title: 'Deconstructing Event-Driven Micro-Frontends at Scale',
  excerpt:
    'How we transitioned a monolithic dashboard into decoupled, independently deployable island architectures using web components, resilient event buses, and broadcast channels.',
  category: 'Architecture',
  readTime: '8 min read',
  date: 'Aug 18, 2026',
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
  author: {
    name: 'Elena Rostova',
    role: 'Principal Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'ER',
  },
}

const initialPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Architecting Token Hierarchies in Tailwind CSS v4',
    excerpt:
      'A comprehensive guide to structured OKLCH color palettes, dynamic light and dark elevation layers, and type scale ergonomics.',
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'Aug 16, 2026',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Marcus Chen',
      role: 'Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'MC',
    },
  },
  {
    id: 'post-2',
    title: 'Eliminating Layout Shift in Hydrated Islands',
    excerpt:
      'Techniques for zero-CLS component streaming, skeleton synchronization, and sub-100ms Interaction to Next Paint (INP).',
    category: 'Performance',
    readTime: '6 min read',
    date: 'Aug 14, 2026',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Sarah Jenkins',
      role: 'Performance Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      initials: 'SJ',
    },
  },
  {
    id: 'post-3',
    title: 'Deterministic State Synchronization Over WebSockets',
    excerpt:
      'Building conflict-free collaborative data models with operational transformation and CRDTs for multi-tenant SaaS.',
    category: 'Architecture',
    readTime: '7 min read',
    date: 'Aug 11, 2026',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Devon Vance',
      role: 'Distributed Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      initials: 'DV',
    },
  },
  {
    id: 'post-4',
    title: 'Building Headless Accessible Dropdowns with Reka UI',
    excerpt:
      'Step-by-step implementation of focus trap management, keyboard navigation patterns, and polymorphic slot composition.',
    category: 'Tutorials',
    readTime: '4 min read',
    date: 'Aug 08, 2026',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Aaliyah Patel',
      role: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'AP',
    },
  },
  {
    id: 'post-5',
    title: 'Fluid Typography and Motion Curves in Modern Web Apps',
    excerpt:
      'Using CSS clamp functions and spring physics to create tactile, responsive interfaces that adapt directly across devices.',
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'Aug 04, 2026',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Lucas Meyer',
      role: 'UI Engineer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      initials: 'LM',
    },
  },
  {
    id: 'post-6',
    title: 'Continuous Benchmarking with Playwright and GitHub Actions',
    excerpt:
      'Automate regression detection for memory leaks, bundle sizes, and render latency directly within your CI pull request checks.',
    category: 'Tutorials',
    readTime: '6 min read',
    date: 'Jul 30, 2026',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      initials: 'ER',
    },
  },
]

const additionalPosts: BlogPost[] = [
  {
    id: 'post-7',
    title: 'Optimizing JavaScript Garbage Collection in High-Frequency Canvas',
    excerpt:
      'How object pooling and typed array buffers solved stuttering frame rates during real-time telemetry rendering.',
    category: 'Performance',
    readTime: '9 min read',
    date: 'Jul 26, 2026',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Marcus Chen',
      role: 'Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'MC',
    },
  },
  {
    id: 'post-8',
    title: 'Resilient Edge Caching Strategies for Dynamic Multi-Region APIs',
    excerpt:
      'Configuring stale-while-revalidate headers, cache tagging, and instant surrogate key purging across worldwide POPs.',
    category: 'Architecture',
    readTime: '7 min read',
    date: 'Jul 22, 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Devon Vance',
      role: 'Distributed Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      initials: 'DV',
    },
  },
  {
    id: 'post-9',
    title: 'Designing High-Contrast Dark Modes without Washing Out Brand Identity',
    excerpt:
      'Tuning APCA perceptual contrast ratios, luminance curves, and colored alpha borders in enterprise dark themes.',
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'Jul 18, 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Aaliyah Patel',
      role: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'AP',
    },
  },
]

export function BlogPostCardGrid({ showFeatured = true, className, ...props }: BlogPostCardGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showAllPosts, setShowAllPosts] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const visiblePosts = useMemo(() => {
    const pool = showAllPosts ? [...initialPosts, ...additionalPosts] : initialPosts
    if (activeCategory === 'All') return pool
    return pool.filter((p) => p.category === activeCategory)
  }, [showAllPosts, activeCategory])

  const isHeroVisible = showFeatured && (activeCategory === 'All' || featuredPost.category === activeCategory)

  function handleCategorySelect(cat: Category) {
    setActiveCategory(cat)
  }

  function handleLoadMore() {
    setIsLoadingMore(true)
    setTimeout(() => {
      setShowAllPosts(true)
      setIsLoadingMore(false)
    }, 400)
  }

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!emailInput.includes('@')) return
    setIsSubscribed(true)
  }

  return (
    <section
      data-slot="blog-post-card-grid"
      className={cn('bg-background w-full py-12 sm:py-16 lg:py-20', className)}
      {...props}
    >
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:space-y-16 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs font-medium">
              <Sparkles className="text-primary size-3.5" aria-hidden="true" />
              From the Blog
            </Badge>
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Latest Articles &amp; Engineering Deep Dives
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              Technical essays on software architecture, design systems, and frontend performance.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Article categories">
            {categories.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={activeCategory === cat ? 'default' : 'outline'}
                className="rounded-full text-xs font-medium transition-all"
                aria-selected={activeCategory === cat}
                role="tab"
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Hero Article Card */}
        {isHeroVisible && (
          <Card className="group/hero border-border bg-card hover:border-primary/30 relative overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Hero Image Container */}
              <div className="bg-muted relative aspect-video min-h-[260px] min-w-0 overflow-hidden sm:min-h-[340px] lg:col-span-7 lg:aspect-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover/hero:scale-105"
                />
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground border-transparent text-xs font-medium shadow-xs">
                    <Sparkles className="mr-1 size-3" aria-hidden="true" />
                    Featured Story
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-background/90 text-foreground border-border/60 text-xs font-medium shadow-xs backdrop-blur-md"
                  >
                    {featuredPost.category}
                  </Badge>
                </div>
              </div>

              {/* Hero Content Panel */}
              <CardContent className="flex flex-col justify-between space-y-6 p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <div className="space-y-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                    <BookOpen className="text-primary size-3.5" aria-hidden="true" />
                    <span>Editorial Dispatch</span>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" aria-hidden="true" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h3 className="text-foreground group-hover/hero:text-primary text-2xl leading-tight font-bold tracking-tight transition-colors sm:text-3xl">
                    <a href="#" className="focus-visible:ring-ring focus-visible:underline focus-visible:outline-none">
                      {featuredPost.title}
                    </a>
                  </h3>

                  <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed sm:text-base">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="space-y-5 pt-2">
                  <Separator className="bg-border/60" />
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="default" className="border-border/60 border shadow-xs">
                        <AvatarImage src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                        <AvatarFallback text={featuredPost.author.initials} />
                      </Avatar>
                      <div>
                        <p className="text-foreground text-sm font-semibold">{featuredPost.author.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {featuredPost.date} &middot; {featuredPost.author.role}
                        </p>
                      </div>
                    </div>

                    <Button size="sm" className="group/btn gap-1.5">
                      <span>Read Article</span>
                      <ArrowRight
                        className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* 3-Column Article Card Grid */}
        {visiblePosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => (
              <Card
                key={post.id}
                className="group border-border bg-card hover:border-primary/30 flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md"
              >
                {/* Article Image Placeholder with 16:9 Aspect */}
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-background/85 text-foreground border-border/50 text-xs font-medium shadow-xs backdrop-blur-md"
                    >
                      {post.category}
                    </Badge>
                  </div>
                </div>

                {/* Article Body */}
                <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                  <div className="space-y-2.5">
                    <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold tracking-tight transition-colors">
                      <a
                        href="#"
                        className="focus-visible:ring-ring focus-visible:underline focus-visible:outline-none"
                      >
                        {post.title}
                      </a>
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                  </div>

                  {/* Author Row & Reading Time Pill */}
                  <div className="space-y-4 pt-2">
                    <Separator className="bg-border/60" />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar size="sm" className="border-border/60 border">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback text={post.author.initials} />
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-xs font-medium">{post.author.name}</p>
                          <p className="text-muted-foreground truncate text-xs">{post.date}</p>
                        </div>
                      </div>

                      <div className="text-muted-foreground bg-muted/60 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium">
                        <Clock className="size-3" aria-hidden="true" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State When No Posts Match Category */
          <div className="border-border bg-card/40 space-y-3 rounded-xl border border-dashed p-10 text-center">
            <div className="bg-muted text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-full">
              <BookOpen className="size-6" aria-hidden="true" />
            </div>
            <h3 className="text-foreground text-base font-semibold">No articles found</h3>
            <p className="text-muted-foreground text-sm">
              There are no articles published yet under &ldquo;{activeCategory}&rdquo;.
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveCategory('All')}>
              Show all articles
            </Button>
          </div>
        )}

        {/* Load More Stories Button */}
        {!showAllPosts && visiblePosts.length > 0 && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8 font-medium shadow-xs"
              disabled={isLoadingMore}
              onClick={handleLoadMore}
            >
              {isLoadingMore && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              <span>{isLoadingMore ? 'Loading articles...' : 'Load More Stories'}</span>
            </Button>
          </div>
        )}

        {/* Newsletter Subscribe Box */}
        <Card className="border-border bg-card/60 relative overflow-hidden shadow-xs">
          <div className="bg-primary/10 pointer-events-none absolute -top-12 -right-12 size-48 rounded-full blur-3xl" />
          <CardContent className="relative z-10 flex flex-col items-center justify-between gap-8 p-8 sm:p-10 md:flex-row">
            <div className="max-w-xl space-y-2 text-center md:text-left">
              <div className="bg-primary/10 text-primary mx-auto flex size-10 items-center justify-center rounded-lg md:mx-0">
                <Mail className="size-5" aria-hidden="true" />
              </div>
              <h3 className="text-foreground text-2xl font-bold tracking-tight">Subscribe to our editorial dispatch</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get weekly teardowns on frontend architecture, component design systems, and web performance delivered
                straight to your inbox.
              </p>
            </div>

            <div className="w-full max-w-md">
              {!isSubscribed ? (
                <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubscribe}>
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    type="email"
                    placeholder="name@company.com"
                    required
                    aria-label="Email address"
                    className="bg-background h-10 shadow-xs"
                  />
                  <Button type="submit" className="shrink-0">
                    Subscribe
                  </Button>
                </form>
              ) : (
                <div className="bg-primary/10 border-primary/20 text-foreground flex items-center gap-3 rounded-lg border p-3.5 text-sm font-medium">
                  <Check className="text-primary size-5 shrink-0" aria-hidden="true" />
                  <span>You're subscribed! Check your inbox for the welcome issue.</span>
                </div>
              )}
              {!isSubscribed && (
                <p className="text-muted-foreground mt-2 text-center text-xs sm:text-left">
                  No spam. Sent bi-weekly. Unsubscribe with one click.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
