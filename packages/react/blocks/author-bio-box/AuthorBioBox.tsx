'use client'

import * as React from 'react'
import { ArrowUpRight, BadgeCheck, BookOpen, Check, Globe, MapPin, Rss, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface AuthorBioBoxProps {
  /** 'default' is the standard editorial signature card; 'split' arranges profile and articles side-by-side; 'compact' tightens padding. */
  variant?: 'default' | 'split' | 'compact'
  className?: string
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.66.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

function SubstackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  )
}

export function AuthorBioBox({ variant = 'default', className }: AuthorBioBoxProps) {
  const [isFollowing, setIsFollowing] = React.useState(false)
  const [isSubscribedRss, setIsSubscribedRss] = React.useState(false)

  const toggleFollow = () => setIsFollowing((prev) => !prev)
  const toggleRss = () => setIsSubscribedRss((prev) => !prev)

  return (
    <Card
      data-slot="author-bio-box"
      className={cn('border-border bg-card text-card-foreground relative overflow-hidden shadow-xs', className)}
    >
      {/* Subtle gradient background highlight */}
      <div
        className="from-primary/10 via-primary/5 pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br to-transparent"
        aria-hidden="true"
      />

      {variant === 'split' ? (
        <CardContent className="relative p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="space-y-5 lg:col-span-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="relative size-16 shrink-0 sm:size-20">
                  <Avatar size="2xl" className="ring-background size-16 shadow-xs ring-2 sm:size-20">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                      alt="Elena Rostova"
                    />
                    <AvatarFallback className="text-lg font-semibold sm:text-xl">ER</AvatarFallback>
                  </Avatar>
                  <div
                    className="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full shadow-xs ring-2 sm:size-6"
                    title="Verified Author"
                  >
                    <BadgeCheck className="size-3.5 sm:size-4" />
                  </div>
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h3>
                    <Badge variant="secondary" className="gap-1 text-xs font-medium">
                      <BadgeCheck className="text-primary size-3.5" /> Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Principal Design Engineer &amp; Core Contributor
                  </p>
                  <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                Specializing in design token mathematics, headless accessibility primitives, and high-performance
                dual-framework monorepos. Former Staff Engineer at Vercel.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    variant={isFollowing ? 'secondary' : 'default'}
                    size="sm"
                    className="gap-2 transition-all"
                    onClick={toggleFollow}
                  >
                    {isFollowing ? <Check className="size-4 text-emerald-500" /> : <UserPlus className="size-4" />}
                    <span>{isFollowing ? 'Following' : 'Follow Author'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'gap-2 transition-all',
                      isSubscribedRss && 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    )}
                    onClick={toggleRss}
                  >
                    <Rss className="size-4 text-amber-600 dark:text-amber-400" />
                    <span>{isSubscribedRss ? 'Subscribed via RSS' : 'RSS Feed'}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on X (Twitter)">
                      <XIcon className="size-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on GitHub">
                      <GithubIcon className="size-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Elena Rostova on LinkedIn"
                    >
                      <LinkedinIcon className="size-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a
                      href="https://elenarostova.dev"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Elena Rostova's Website"
                    >
                      <Globe className="size-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <a
                      href="https://substack.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Elena Rostova on Substack"
                    >
                      <SubstackIcon className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                  <BookOpen className="text-primary size-4" />
                  <span>Recent Articles</span>
                </div>
                <span className="text-muted-foreground text-xs">3 published</span>
              </div>

              <div className="grid gap-3">
                <a
                  href="#article-1"
                  className="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="min-w-0 space-y-1">
                    <span className="text-muted-foreground text-xs">5 min read · Aug 18</span>
                    <h4 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                      Why Zero-Dependency Registries Are Winning
                    </h4>
                  </div>
                  <div className="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md border transition-all">
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>

                <a
                  href="#article-2"
                  className="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="min-w-0 space-y-1">
                    <span className="text-muted-foreground text-xs">8 min read · Aug 10</span>
                    <h4 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                      Deconstructing OKLCH Color Palettes in Tailwind v4
                    </h4>
                  </div>
                  <div className="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md border transition-all">
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>

                <a
                  href="#article-3"
                  className="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div className="min-w-0 space-y-1">
                    <span className="text-muted-foreground text-xs">12 min read · Jul 28</span>
                    <h4 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                      Polymorphic Reka UI Primitives Architecture
                    </h4>
                  </div>
                  <div className="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md border transition-all">
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      ) : variant === 'compact' ? (
        <CardContent className="relative space-y-5 p-5">
          <div className="flex items-center gap-3.5">
            <div className="relative size-12 shrink-0">
              <Avatar size="lg" className="ring-background size-12 ring-2">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                  alt="Elena Rostova"
                />
                <AvatarFallback className="text-sm font-semibold">ER</AvatarFallback>
              </Avatar>
              <div className="bg-primary text-primary-foreground ring-background absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full ring-1">
                <BadgeCheck className="size-3" />
              </div>
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-foreground truncate text-base font-bold tracking-tight">Elena Rostova</h3>
                <Badge variant="secondary" className="h-4 px-1.5 text-xs font-medium">
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground truncate text-xs">Principal Design Engineer</p>
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
            Specializing in design token mathematics, headless accessibility primitives, and high-performance
            dual-framework monorepos. Former Staff Engineer at Vercel.
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant={isFollowing ? 'secondary' : 'default'}
                size="sm"
                className="h-7 gap-1.5 px-2.5 text-xs"
                onClick={toggleFollow}
              >
                {isFollowing ? <Check className="size-3 text-emerald-500" /> : <UserPlus className="size-3" />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-7 gap-1.5 px-2.5 text-xs',
                  isSubscribedRss && 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                )}
                onClick={toggleRss}
              >
                <Rss className="size-3 text-amber-600 dark:text-amber-400" />
                <span>{isSubscribedRss ? 'Subscribed' : 'RSS'}</span>
              </Button>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon-sm" className="size-7" asChild>
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on X (Twitter)">
                  <XIcon className="size-3.5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" className="size-7" asChild>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on GitHub">
                  <GithubIcon className="size-3.5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" className="size-7" asChild>
                <a
                  href="https://elenarostova.dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Elena Rostova's Website"
                >
                  <Globe className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2.5">
            <div className="text-muted-foreground flex items-center justify-between text-xs font-medium">
              <span className="tracking-wider uppercase">Latest Article</span>
              <span>Aug 18</span>
            </div>
            <a
              href="#article-1"
              className="group border-border/60 bg-muted/20 hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-2 rounded-md border p-2.5 transition-all focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-foreground group-hover:text-primary truncate text-xs font-semibold transition-colors">
                Why Zero-Dependency Registries Are Winning
              </span>
              <ArrowUpRight className="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </CardContent>
      ) : (
        <CardContent className="relative space-y-6 p-6 sm:p-8">
          {/* Top Author Profile */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="relative size-16 shrink-0 sm:size-20">
              <Avatar size="2xl" className="ring-background size-16 shadow-xs ring-2 sm:size-20">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                  alt="Elena Rostova"
                />
                <AvatarFallback className="text-lg font-semibold sm:text-xl">ER</AvatarFallback>
              </Avatar>
              <div
                className="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full shadow-xs ring-2 sm:size-6"
                title="Verified Author"
              >
                <BadgeCheck className="size-3.5 sm:size-4" />
              </div>
            </div>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h3>
                <Badge variant="secondary" className="gap-1 text-xs font-medium">
                  <BadgeCheck className="text-primary size-3.5" /> Verified Author
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Principal Design Engineer &amp; Core Contributor
              </p>
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <MapPin className="size-3.5 shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Author Bio Paragraph */}
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Specializing in design token mathematics, headless accessibility primitives, and high-performance
            dual-framework monorepos. Former Staff Engineer at Vercel.
          </p>

          {/* Actions & Social Links Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant={isFollowing ? 'secondary' : 'default'}
                size="sm"
                className="gap-2 transition-all"
                onClick={toggleFollow}
              >
                {isFollowing ? <Check className="size-4 text-emerald-500" /> : <UserPlus className="size-4" />}
                <span>{isFollowing ? 'Following' : 'Follow Author'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 transition-all',
                  isSubscribedRss && 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                )}
                onClick={toggleRss}
              >
                <Rss className="size-4 text-amber-600 dark:text-amber-400" />
                <span>{isSubscribedRss ? 'Subscribed via RSS' : 'RSS Feed'}</span>
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" asChild>
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on X (Twitter)">
                  <XIcon className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on GitHub">
                  <GithubIcon className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on LinkedIn">
                  <LinkedinIcon className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a
                  href="https://elenarostova.dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Elena Rostova's Website"
                >
                  <Globe className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" asChild>
                <a href="https://substack.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on Substack">
                  <SubstackIcon className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Separator */}
          <Separator />

          {/* Recent Articles by Author List (3 items) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                <BookOpen className="text-primary size-4" />
                <span>Recent Articles by Author</span>
              </div>
              <span className="text-muted-foreground text-xs">3 published</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-1">
              {/* Article 1 */}
              <a
                href="#article-1"
                className="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="min-w-0 space-y-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs font-normal">
                      Registry
                    </Badge>
                    <span>5 min read · Aug 18</span>
                  </div>
                  <h4 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                    Why Zero-Dependency Registries Are Winning
                  </h4>
                </div>
                <div className="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-all">
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>

              {/* Article 2 */}
              <a
                href="#article-2"
                className="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="min-w-0 space-y-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs font-normal">
                      Design Tokens
                    </Badge>
                    <span>8 min read · Aug 10</span>
                  </div>
                  <h4 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                    Deconstructing OKLCH Color Palettes in Tailwind v4
                  </h4>
                </div>
                <div className="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-all">
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>

              {/* Article 3 */}
              <a
                href="#article-3"
                className="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
              >
                <div className="min-w-0 space-y-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs font-normal">
                      Architecture
                    </Badge>
                    <span>12 min read · Jul 28</span>
                  </div>
                  <h4 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                    Polymorphic Reka UI Primitives Architecture
                  </h4>
                </div>
                <div className="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-all">
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
