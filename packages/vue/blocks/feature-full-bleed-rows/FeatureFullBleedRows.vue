<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const rows = [
  {
    eyebrow: 'Modelling',
    title: 'The definition is the product',
    body: 'Dashboards are an output. What your company argues about is the formula behind the number, so that is the thing that gets an owner, a review, and a history.',
    detail: [
      { label: 'Authored in', value: 'Your repository' },
      { label: 'Reviewed by', value: 'The named owner' },
      { label: 'Reverted in', value: 'One click' },
    ],
    reverse: false,
  },
  {
    eyebrow: 'Governance',
    title: 'Permissions that survive a share',
    body: 'Scope resolves per query from your identity provider, so forwarding a dashboard link never widens what the recipient can see. Every evaluation is logged.',
    detail: [
      { label: 'Resolved at', value: 'Query time' },
      { label: 'Sourced from', value: 'SCIM groups' },
      { label: 'Retained for', value: '7 years' },
    ],
    reverse: true,
  },
  {
    eyebrow: 'Operations',
    title: 'Cost you can see before the invoice',
    body: 'Query budgets are enforced by the planner before execution, and each dashboard reports what it costs to open. Spend stops being a monthly surprise.',
    detail: [
      { label: 'Enforced at', value: 'Plan time' },
      { label: 'Scoped per', value: 'Team' },
      { label: 'Reported per', value: 'Dashboard' },
    ],
    reverse: false,
  },
]
</script>

<template>
  <section data-slot="feature-full-bleed-rows" class="bg-background">
    <!-- Bands alternate surface as well as side, so the eye has two cues that a
         new section started rather than relying on whitespace alone. -->
    <div
      v-for="(row, index) in rows"
      :key="row.title"
      class="border-border border-b"
      :class="index % 2 === 1 ? 'bg-muted/40' : 'bg-background'"
    >
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div :class="row.reverse ? 'lg:order-2' : ''">
          <Badge variant="secondary">{{ row.eyebrow }}</Badge>
          <h2 class="mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{{ row.title }}</h2>
          <p class="text-muted-foreground mt-3 max-w-prose leading-relaxed">{{ row.body }}</p>
          <Button variant="link" class="mt-4 h-auto p-0">
            Read the detail
            <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>

        <Card
          :class="[
            row.reverse
              ? 'lg:order-1 lg:-ml-[calc((100vw-100%)/2)] lg:rounded-l-none lg:border-l-0'
              : 'lg:-mr-[calc((100vw-100%)/2)] lg:rounded-r-none lg:border-r-0',
          ]"
        >
          <CardContent class="p-0">
            <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
              {{ row.eyebrow.toLowerCase() }}
            </div>
            <dl>
              <template v-for="(entry, entryIndex) in row.detail" :key="entry.label">
                <div class="flex items-center justify-between gap-4 px-4 py-3">
                  <dt class="text-muted-foreground text-sm">{{ entry.label }}</dt>
                  <dd class="text-sm font-medium">{{ entry.value }}</dd>
                </div>
                <Separator v-if="entryIndex < row.detail.length - 1" />
              </template>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
