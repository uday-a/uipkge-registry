<script setup lang="ts">
import { ArrowUpRight, Quote } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const capabilities = ['Versioned definitions', 'Row-level access', 'Query budgets', 'Drift alerting', 'Audit export']

const budgets = [
  { team: 'Finance', used: 62 },
  { team: 'RevOps', used: 38 },
  { team: 'Product', used: 81 },
]
</script>

<template>
  <section data-slot="bento-asymmetric-grid" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">The shape of it</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">One layer, five jobs</h2>
      </div>

      <!-- Spans are explicit rather than auto-flowed, so rearranging the
           composition is a class change and not a reshuffle of the markup. -->
      <div class="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-rows-2">
        <Card class="sm:row-span-2">
          <CardContent class="flex h-full flex-col p-6">
            <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Everything included</p>
            <h3 class="mt-3 text-xl font-semibold tracking-tight text-balance">No feature gates between plans</h3>
            <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
              Limits differ; capabilities do not. The list below is on every plan from the first day of a trial.
            </p>

            <Separator class="my-5" />

            <ul class="space-y-2.5">
              <li v-for="capability in capabilities" :key="capability" class="flex items-center gap-2.5 text-sm">
                <span class="bg-primary size-1.5 shrink-0 rounded-full" aria-hidden="true" />
                <span>{{ capability }}</span>
              </li>
            </ul>

            <Button variant="outline" size="sm" class="mt-auto self-start pt-0 [&]:mt-6">Compare plans</Button>
          </CardContent>
        </Card>

        <Card class="sm:col-span-2">
          <CardContent class="flex h-full flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p class="font-display text-4xl font-bold tracking-tight">4.2 days</p>
              <p class="text-muted-foreground mt-1 text-sm">median time to close, down from 9.4</p>
            </div>
            <Badge variant="secondary" class="shrink-0">240 rollouts</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Query budgets</p>
            <div class="mt-4 space-y-3">
              <div v-for="budget in budgets" :key="budget.team">
                <div class="flex items-baseline justify-between gap-3">
                  <span class="text-xs font-medium">{{ budget.team }}</span>
                  <span class="text-muted-foreground font-mono text-xs">{{ budget.used }}%</span>
                </div>
                <Progress :model-value="budget.used" class="mt-1.5 h-1.5" :aria-label="`${budget.team} budget used`" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="group">
          <CardContent class="flex h-full flex-col p-6">
            <Quote class="text-muted-foreground/60 size-4" aria-hidden="true" />
            <blockquote class="mt-3 text-sm leading-relaxed">
              “We stopped arguing about whose number was right.”
            </blockquote>
            <p class="text-muted-foreground mt-auto pt-4 text-xs">Erin Walsh · VP Finance, Northwind</p>
            <Button variant="ghost" size="sm" class="mt-2 h-auto justify-start px-0 text-xs">
              Read the story
              <ArrowUpRight
                class="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
