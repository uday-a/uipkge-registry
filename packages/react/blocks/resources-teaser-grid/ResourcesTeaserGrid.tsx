'use client'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const featured = {
  kind: 'Engineering',
  title: 'Why we version metric definitions instead of dashboards',
  excerpt:
    'Dashboards are the output. The definition is the thing teams argue about, so that is what belongs under review — with a diff, an owner, and a revert path.',
  readTime: '9 min read',
  date: 'Feb 18, 2026',
  author: { name: 'Marcus Ellery', role: 'Staff Engineer', initials: 'ME' },
}

const recent = [
  { kind: 'Guide', title: 'A reconciliation checklist for your first close', readTime: '6 min' },
  { kind: 'Benchmark', title: 'What close speed actually looks like across 240 finance teams', readTime: '11 min' },
  { kind: 'Changelog', title: 'Row-level scoping now evaluates against SCIM groups', readTime: '3 min' },
  { kind: 'Opinion', title: 'Self-serve analytics fails for reasons that are not technical', readTime: '7 min' },
]

export function ResourcesTeaserGrid() {
  return (
    <section data-slot="resources-teaser-grid" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="secondary">Resources</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Notes from the build</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Engineering write-ups, rollout guides, and the benchmarks behind the claims on this page.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {/* Featured piece spans two columns; the recent list stacks beside it. */}
          <Card className="group lg:col-span-2">
            <CardContent className="flex h-full flex-col p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{featured.kind}</Badge>
                <span className="text-muted-foreground text-xs">
                  {featured.date} · {featured.readTime}
                </span>
              </div>

              <h3 className="mt-4 text-2xl leading-snug font-semibold tracking-tight text-balance">{featured.title}</h3>
              <p className="text-muted-foreground mt-3 max-w-prose leading-relaxed">{featured.excerpt}</p>

              <div className="mt-auto flex items-center gap-3 pt-8">
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs">{featured.author.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{featured.author.name}</p>
                  <p className="text-muted-foreground truncate text-xs">{featured.author.role}</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Read
                  <ArrowUpRight
                    className="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <ul>
                {recent.map((post, index) => (
                  <li key={post.title}>
                    <a
                      href="#"
                      className="hover:bg-muted focus-visible:ring-ring block rounded-lg p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-wide uppercase">
                        <span>{post.kind}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <p className="mt-1.5 text-sm leading-snug font-medium">{post.title}</p>
                    </a>
                    {index < recent.length - 1 && <Separator />}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="border-border mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="text-muted-foreground text-sm">New writing roughly every other week. No newsletter required.</p>
          <Button variant="outline">
            View all resources
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
