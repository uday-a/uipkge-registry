<script setup lang="ts">
import { ArrowRight, Quote } from 'lucide-vue-next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const results = [
  { value: '5 days', label: 'off the monthly close' },
  { value: '11 → 1', label: 'reconciliation spreadsheets' },
  { value: '340', label: 'certified metrics published' },
  { value: '6 weeks', label: 'kickoff to full hand-over' },
]

const facts = [
  { term: 'Industry', detail: 'Freight forwarding' },
  { term: 'Size', detail: '1,200 staff · 18 countries' },
  { term: 'Stack', detail: 'Snowflake · dbt · Okta' },
  { term: 'Live since', detail: 'Q1 2026' },
]
</script>

<template>
  <section data-slot="case-study-featured-story" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <article>
          <Badge variant="secondary">Case study</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            How Northwind Logistics closed the books five days early
          </h2>

          <div class="mt-8 space-y-8">
            <div>
              <h3 class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">The challenge</h3>
              <p class="mt-2.5 leading-relaxed">
                Month-end ran on eleven spreadsheets maintained by four people across three time zones. Every close
                opened with a reconciliation pass nobody had budgeted for, and restatements were tracked in email.
              </p>
            </div>

            <div>
              <h3 class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">The approach</h3>
              <p class="mt-2.5 leading-relaxed">
                We mirrored the warehouse schema, rebuilt revenue and margin as versioned definitions, and reconciled
                them against the prior four quarters before anything was published. A single regional team piloted the
                first close; the rest of finance moved over two weeks later.
              </p>
            </div>

            <div>
              <h3 class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">The result</h3>
              <p class="mt-2.5 leading-relaxed">
                Close now starts from a reconciled position. Restatements open a reviewable change instead of a thread,
                and the audit pack is generated from the same history.
              </p>
            </div>
          </div>

          <figure class="border-border mt-10 border-l-2 pl-6">
            <Quote class="text-muted-foreground/60 size-5" aria-hidden="true" />
            <blockquote class="mt-3 text-lg leading-snug font-medium text-balance">
              We stopped arguing about whose number was right and started arguing about what to do next. That is the
              whole change, and it was worth the six weeks.
            </blockquote>
            <figcaption class="mt-5 flex items-center gap-3">
              <Avatar class="size-9">
                <AvatarFallback class="text-xs">EW</AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-medium">Erin Walsh</p>
                <p class="text-muted-foreground text-xs">VP Finance, Northwind Logistics</p>
              </div>
            </figcaption>
          </figure>

          <Button class="mt-10">
            Read the full story
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </Button>
        </article>

        <!-- Sticky results panel: keeps the numbers in view while the narrative scrolls. -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent class="p-6">
              <h3 class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Results</h3>
              <dl class="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
                <div v-for="result in results" :key="result.label">
                  <dt class="sr-only">{{ result.label }}</dt>
                  <dd>
                    <span class="font-display block text-2xl font-bold tracking-tight">{{ result.value }}</span>
                    <span class="text-muted-foreground mt-1 block text-xs leading-snug">{{ result.label }}</span>
                  </dd>
                </div>
              </dl>

              <Separator class="my-6" />

              <dl class="space-y-3">
                <div v-for="fact in facts" :key="fact.term" class="flex items-baseline justify-between gap-4 text-sm">
                  <dt class="text-muted-foreground">{{ fact.term }}</dt>
                  <dd class="text-right font-medium">{{ fact.detail }}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  </section>
</template>
