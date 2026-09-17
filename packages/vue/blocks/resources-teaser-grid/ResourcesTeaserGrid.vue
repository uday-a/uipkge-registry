<script setup lang="ts">
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
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
</script>

<template>
  <section data-slot="resources-teaser-grid" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <Badge variant="secondary">Resources</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Notes from the build</h2>
          <p class="text-muted-foreground mt-3 text-lg">
            Engineering write-ups, rollout guides, and the benchmarks behind the claims on this page.
          </p>
        </div>
      </div>

      <div class="mt-10 grid gap-4 lg:grid-cols-3">
        <!-- Featured piece spans two columns; the recent list stacks beside it. -->
        <Card class="group lg:col-span-2">
          <CardContent class="flex h-full flex-col p-6 lg:p-8">
            <div class="flex flex-wrap items-center gap-3">
              <Badge variant="outline">{{ featured.kind }}</Badge>
              <span class="text-muted-foreground text-xs">{{ featured.date }} · {{ featured.readTime }}</span>
            </div>

            <h3 class="mt-4 text-2xl leading-snug font-semibold tracking-tight text-balance">
              {{ featured.title }}
            </h3>
            <p class="text-muted-foreground mt-3 max-w-prose leading-relaxed">{{ featured.excerpt }}</p>

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

        <Card>
          <CardContent class="p-2">
            <ul>
              <li v-for="(post, index) in recent" :key="post.title">
                <a
                  href="#"
                  class="hover:bg-muted focus-visible:ring-ring block rounded-lg p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-wide uppercase">
                    <span>{{ post.kind }}</span>
                    <span aria-hidden="true">·</span>
                    <span>{{ post.readTime }}</span>
                  </div>
                  <p class="mt-1.5 text-sm leading-snug font-medium">{{ post.title }}</p>
                </a>
                <Separator v-if="index < recent.length - 1" />
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div class="border-border mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <p class="text-muted-foreground text-sm">New writing roughly every other week. No newsletter required.</p>
        <Button variant="outline">
          View all resources
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </section>
</template>
