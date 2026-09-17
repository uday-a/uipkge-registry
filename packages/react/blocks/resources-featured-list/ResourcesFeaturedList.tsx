'use client'

import { Fragment } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const featured = {
  kind: 'Benchmark',
  title: 'What close speed actually looks like across 240 finance teams',
  excerpt:
    'We asked every customer for their close calendar before and after rollout, then threw out the ones who changed headcount mid-period. What is left is 186 teams and a distribution that is wider than any vendor page admits.',
  date: 'Mar 04, 2026',
  read: '11 min',
  author: { name: 'Anna Reyes', role: 'Data Lead', initials: 'AR' },
}

const further = [
  { title: 'Why we version metric definitions instead of dashboards', kind: 'Essay', date: 'Feb 18', read: '9 min' },
  { title: 'Query planning against three warehouses at once', kind: 'Deep dive', date: 'Feb 02', read: '14 min' },
  { title: 'A reconciliation checklist for your first close', kind: 'Guide', date: 'Jan 21', read: '6 min' },
  {
    title: 'Self-serve analytics fails for reasons that are not technical',
    kind: 'Opinion',
    date: 'Jan 09',
    read: '7 min',
  },
  { title: 'What our audit log actually records, field by field', kind: 'Reference', date: 'Dec 15', read: '5 min' },
]

export function ResourcesFeaturedList() {
  return (
    <section data-slot="resources-featured-list" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge variant="secondary">Reading</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Start here</h2>
          </div>
          <Button variant="link" className="h-auto p-0 text-sm">
            All writing
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Card className="group">
            <CardContent className="flex h-full flex-col p-6 lg:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{featured.kind}</Badge>
                <span className="text-muted-foreground text-xs">
                  {featured.date} · {featured.read}
                </span>
              </div>
              <h3 className="mt-4 text-2xl leading-snug font-semibold tracking-tight text-balance">{featured.title}</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">{featured.excerpt}</p>

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

          <div>
            <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Further reading</p>
            <ol className="mt-4">
              {further.map((entry, index) => (
                <Fragment key={entry.title}>
                  <li>
                    <a
                      href="#"
                      className="hover:bg-muted focus-visible:ring-ring group -mx-3 flex items-start gap-4 rounded-lg px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <span className="text-muted-foreground/70 mt-0.5 shrink-0 font-mono text-xs">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm leading-snug">{entry.title}</span>
                        <span className="text-muted-foreground mt-1 block font-mono text-xs">
                          {entry.kind} · {entry.date} · {entry.read}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="text-muted-foreground mt-0.5 size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                  {index < further.length - 1 && <Separator />}
                </Fragment>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
