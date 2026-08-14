'use client'

import * as React from 'react'
import { ArrowRight, BellRing, BookOpen, Check, Mail, Send } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface NewsletterSignupProps {
  variant?: 'centered' | 'split'
}

interface ChannelOption {
  id: string
  title: string
  frequency: string
  description: string
  badge: string
}

const channels: ChannelOption[] = [
  {
    id: 'architecture',
    title: 'Architecture & Token Deep Dives',
    frequency: 'Bi-Weekly',
    description: 'Technical breakdowns on OKLCH color science, headless AST transformers, and zero-lockin paradigms.',
    badge: 'Flagship',
  },
  {
    id: 'releases',
    title: 'Registry Ship Notes & RFCs',
    frequency: 'Monthly',
    description: 'Direct changelogs, new workbench releases, breaking primitive refactors, and roadmap discussions.',
    badge: 'Changelog',
  },
  {
    id: 'security',
    title: 'Security & Dependency Bulletins',
    frequency: 'As-Needed',
    description: 'Zero-day vulnerability alerts, upstream headless primitive fixes, and patch notifications.',
    badge: 'Critical',
  },
]

const recentIssues = [
  {
    id: 48,
    date: 'Aug 2026',
    title: 'The Death of Monolithic npm UI Packages',
    reads: '4 min read',
    tags: ['Architecture', 'Registry', 'AST'],
    snippet:
      'Why the next decade of frontend engineering belongs to unbundled registries where the consumer owns the source code.',
  },
  {
    id: 47,
    date: 'Jul 2026',
    title: 'OKLCH Theming in Tailwind CSS v4',
    reads: '6 min read',
    tags: ['Tailwind v4', 'Color Science', 'Tokens'],
    snippet:
      'Mastering perceptual lightness, chroma gamut mapping, and dynamic theme switching without runtime CSS bloat.',
  },
]

export function NewsletterSignup({ variant = 'split' }: NewsletterSignupProps) {
  const [email, setEmail] = React.useState('')
  const [selectedChannel, setSelectedChannel] = React.useState('architecture')
  const [submitted, setSubmitted] = React.useState(false)
  const [activePreviewIssue, setActivePreviewIssue] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !email.includes('@')) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 400)
  }

  return (
    <section
      data-slot="newsletter-signup"
      className="bg-background relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Mail className="text-primary size-3.5" />
            Engineering Dispatch & Architecture Radar
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Ship notes, not marketing fluff.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Join 18,400+ frontend architects, design engineers, and systems builders. Plain-text insights into component
            architecture, token systems, and dual-framework engineering.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Channel Selector & Live Dispatch Form (7 Cols) */}
          <div className="space-y-6 lg:col-span-7">
            <Card className="border-border bg-card overflow-hidden shadow-sm">
              <CardHeader className="bg-muted/20 border-border/60 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <BellRing className="text-primary size-4" />
                    Select Dispatch Track
                  </CardTitle>
                  <span className="text-muted-foreground font-mono text-xs">Zero Spam Guarantee</span>
                </div>
                <CardDescription className="text-xs">
                  Choose the telemetry streams you want delivered to your inbox.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 p-6">
                {/* Channel Radio Cards */}
                <div className="space-y-2.5">
                  {channels.map((ch) => {
                    const isSelected = selectedChannel === ch.id
                    return (
                      <div
                        key={ch.id}
                        className={cn(
                          'group cursor-pointer rounded-xl border p-3.5 transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                            : 'border-border bg-background hover:bg-muted/40',
                        )}
                        onClick={() => setSelectedChannel(ch.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                'flex size-3.5 items-center justify-center rounded-full border transition-colors',
                                isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                              )}
                            >
                              {isSelected && <div className="bg-primary-foreground size-1.5 rounded-full" />}
                            </div>
                            <span className="text-foreground text-xs font-semibold">{ch.title}</span>
                          </div>
                          <Badge variant="outline" className="font-mono text-xs">
                            {ch.frequency}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1.5 pl-5.5 text-xs leading-relaxed">{ch.description}</p>
                      </div>
                    )
                  })}
                </div>

                <Separator />

                {/* Dispatch Subscription Input */}
                {!submitted ? (
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input
                        type="email"
                        placeholder="architect@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-10 flex-1 font-mono text-xs"
                        aria-label="Email address for dispatch"
                      />
                      <Button type="submit" disabled={isSubmitting} className="h-10 gap-1.5 px-5 text-xs font-semibold">
                        <span>Subscribe to Stream</span>
                        <Send className="size-3.5" />
                      </Button>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between pt-1 font-mono text-xs">
                      <span>Plain text &bull; 1-click unsubscribe</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        18,412 Active Subscribers
                      </span>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-center">
                    <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-5" />
                    </div>
                    <p className="text-foreground text-sm font-semibold">Dispatches Activated!</p>
                    <p className="text-muted-foreground text-xs">
                      Verification sent to <strong className="text-foreground font-mono">{email}</strong>. Check your
                      inbox to confirm delivery.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Recent Issue Sampler & Archives (5 Cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase">
                <BookOpen className="text-primary size-3.5" /> Archive Sampler
              </p>
              <span className="text-muted-foreground font-mono text-xs">
                Issue #{recentIssues[activePreviewIssue].id}
              </span>
            </div>

            {/* Interactive Issue Cards */}
            <div className="space-y-3">
              {recentIssues.map((issue, idx) => (
                <div
                  key={issue.id}
                  className={cn(
                    'bg-card cursor-pointer rounded-xl border p-4 transition-all',
                    activePreviewIssue === idx ? 'border-primary/50 shadow-xs' : 'border-border hover:border-border/80',
                  )}
                  onClick={() => setActivePreviewIssue(idx)}
                >
                  <div className="text-muted-foreground mb-1.5 flex items-center justify-between font-mono text-xs">
                    <span>
                      {issue.date} &bull; Issue #{issue.id}
                    </span>
                    <span className="text-foreground font-medium">{issue.reads}</span>
                  </div>
                  <h3 className="text-foreground mb-1.5 text-sm leading-snug font-bold">{issue.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{issue.snippet}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {issue.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-1.5 py-0 font-mono text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RSS note */}
            <div className="border-border bg-muted/20 text-muted-foreground flex items-center justify-between rounded-lg border p-3.5 text-xs">
              <span className="font-mono">Prefer RSS feeds?</span>
              <a
                href="https://uipkge.dev/rss.xml"
                target="_blank"
                rel="noreferrer"
                className="text-primary inline-flex items-center gap-1 font-mono hover:underline"
              >
                uipkge.dev/rss.xml <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default NewsletterSignup
