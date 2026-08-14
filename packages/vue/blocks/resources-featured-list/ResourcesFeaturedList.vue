<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
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
</script>

<template>
  <section data-slot="resources-featured-list" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Badge variant="secondary">Reading</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Start here</h2>
        </div>
        <Button variant="link" class="h-auto p-0 text-sm">
          All writing
          <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
        </Button>
      </div>

      <div class="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Card class="group">
          <CardContent class="flex h-full flex-col p-6 lg:p-8">
            <div class="flex flex-wrap items-center gap-3">
              <Badge variant="outline">{{ featured.kind }}</Badge>
              <span class="text-muted-foreground text-xs">{{ featured.date }} · {{ featured.read }}</span>
            </div>
            <h3 class="mt-4 text-2xl leading-snug font-semibold tracking-tight text-balance">{{ featured.title }}</h3>
            <p class="text-muted-foreground mt-3 leading-relaxed">{{ featured.excerpt }}</p>

            <div class="mt-auto flex items-center gap-3 pt-8">
              <Avatar class="size-9">
                <AvatarFallback class="text-xs">{{ featured.author.initials }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">{{ featured.author.name }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ featured.author.role }}</p>
              </div>
              <Button variant="ghost" size="sm" class="ml-auto">
                Read
                <ArrowUpRight
                  class="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Further reading</p>
          <ol class="mt-4">
            <li v-for="(entry, index) in further" :key="entry.title">
              <a
                href="#"
                class="hover:bg-muted focus-visible:ring-ring group -mx-3 flex items-start gap-4 rounded-lg px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span class="text-muted-foreground/70 mt-0.5 shrink-0 font-mono text-xs">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm leading-snug">{{ entry.title }}</span>
                  <span class="text-muted-foreground mt-1 block font-mono text-xs">
                    {{ entry.kind }} · {{ entry.date }} · {{ entry.read }}
                  </span>
                </span>
                <ArrowUpRight
                  class="text-muted-foreground mt-0.5 size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
              <Separator v-if="index < further.length - 1" />
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
