<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Naming the metric each role is judged on is what lets someone self-select
// without reading all four cards.
const roles = [
  {
    initials: 'FC',
    role: 'Financial controller',
    job: 'Close the books without a reconciliation relay.',
    week: 'Reconcile revenue and margin against the ledger, then lock the period.',
    metric: 'Days to close',
  },
  {
    initials: 'AL',
    role: 'Analytics lead',
    job: 'Stop being a query queue for the rest of the company.',
    week: 'Publish the ten numbers that generate the most tickets as certified metrics.',
    metric: 'Ad-hoc requests per month',
  },
  {
    initials: 'RO',
    role: 'RevOps',
    job: 'Make forecast review about the forecast.',
    week: 'Agree one pipeline definition with finance and snapshot it weekly.',
    metric: 'Forecast accuracy band',
  },
  {
    initials: 'DE',
    role: 'Data engineer',
    job: 'Stop owning an undocumented reporting service.',
    week: 'Move definitions into the repo and delete the bespoke extract jobs.',
    metric: 'Pipelines maintained',
  },
]
</script>

<template>
  <section data-slot="use-cases-role-cards" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">By role</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Find the card with your job on it</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Each one names the work of the first week and the number that role is actually judged on.
        </p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2">
        <Card v-for="role in roles" :key="role.role" class="group">
          <CardContent class="flex h-full flex-col p-6">
            <div class="flex items-center gap-3">
              <Avatar class="size-9">
                <AvatarFallback class="text-xs">{{ role.initials }}</AvatarFallback>
              </Avatar>
              <p class="text-sm font-semibold">{{ role.role }}</p>
            </div>

            <p class="mt-4 text-base leading-snug font-medium text-balance">{{ role.job }}</p>

            <Separator class="my-4" />

            <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">First week</p>
            <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ role.week }}</p>

            <div class="border-border mt-auto flex items-center justify-between gap-3 border-t pt-4">
              <span class="text-xs">
                <span class="text-muted-foreground">Measured on </span>
                <span class="font-medium">{{ role.metric }}</span>
              </span>
              <Button variant="ghost" size="sm" class="h-auto shrink-0 px-2 py-1">
                Read
                <ArrowUpRight
                  class="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
