<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const studies = [
  {
    metric: '5 days',
    metricLabel: 'off the monthly close',
    company: 'Northwind Logistics',
    industry: 'Freight forwarding · 1,200 staff',
    outcome: 'Replaced eleven reconciliation spreadsheets with one certified revenue model.',
    quote: 'We stopped arguing about whose number was right and started arguing about what to do next.',
    author: { name: 'Erin Walsh', role: 'VP Finance', initials: 'EW' },
  },
  {
    metric: '71%',
    metricLabel: 'fewer ad-hoc data requests',
    company: 'Halden Health',
    industry: 'Provider network · 40 clinics',
    outcome: 'Clinic leads self-serve their own quality metrics without filing a ticket.',
    quote: 'The analytics team went from a request queue to actually building things again.',
    author: { name: 'Daniel Brooks', role: 'Head of Analytics', initials: 'DB' },
  },
  {
    metric: '2.4pp',
    metricLabel: 'tighter forecast accuracy',
    company: 'Verity Retail Group',
    industry: 'Omnichannel retail · 310 stores',
    outcome: 'Sales and finance now forecast off the same pipeline definition, snapshotted weekly.',
    quote: 'Forecast review stopped opening with twenty minutes of reconciling two decks.',
    author: { name: 'Priya Raman', role: 'RevOps Director', initials: 'PR' },
  },
]
</script>

<template>
  <section data-slot="case-study-metric-cards" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <Badge variant="secondary">Customer results</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What changed after the rollout</h2>
          <p class="text-muted-foreground mt-3 text-lg">
            Three teams, measured against their own numbers from the quarter before.
          </p>
        </div>
        <Button variant="outline">All case studies</Button>
      </div>

      <div class="mt-10 grid gap-4 md:grid-cols-3">
        <Card v-for="study in studies" :key="study.company" class="group">
          <CardContent class="flex h-full flex-col p-6">
            <!-- Metric leads: it is the only part that survives a skim. -->
            <p class="font-display text-4xl font-bold tracking-tight">{{ study.metric }}</p>
            <p class="text-muted-foreground mt-1 text-sm">{{ study.metricLabel }}</p>

            <Separator class="my-5" />

            <p class="text-sm font-semibold">{{ study.company }}</p>
            <p class="text-muted-foreground mt-0.5 text-xs">{{ study.industry }}</p>
            <p class="mt-4 text-sm leading-relaxed">{{ study.outcome }}</p>

            <blockquote class="border-border text-muted-foreground mt-5 border-l-2 pl-4 text-sm italic">
              “{{ study.quote }}”
            </blockquote>

            <div class="mt-auto flex items-center gap-3 pt-6">
              <Avatar class="size-8">
                <AvatarFallback class="text-xs">{{ study.author.initials }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <p class="truncate text-sm font-medium">{{ study.author.name }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ study.author.role }}</p>
              </div>
              <Button variant="ghost" size="icon" class="ml-auto" :aria-label="`Read the ${study.company} case study`">
                <ArrowUpRight
                  class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
