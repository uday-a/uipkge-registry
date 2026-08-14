<script setup lang="ts">
import { ArrowRight, Check, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const included = [
  'Unlimited certified metric definitions',
  'Unlimited viewers and editors',
  'Row-level access from your identity provider',
  'Query budgets enforced per team',
  'Audit log export, 7-year retention',
  'SOC 2 report under NDA',
]

// Naming exclusions is what makes a single plan credible. A list of only
// inclusions invites the reader to assume the gap is hidden somewhere.
const excluded = [
  'On-premise deployment behind your firewall',
  'Custom SLAs below 99.9%',
  'Professional services beyond the five-week rollout',
]
</script>

<template>
  <section data-slot="pricing-single-plan" class="bg-background">
    <div class="mx-auto max-w-3xl px-6 py-20 lg:py-28">
      <div class="text-center">
        <Badge variant="secondary">Pricing</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">One plan, one number</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          No seat maths and no feature gates. The only thing that scales is query volume.
        </p>
      </div>

      <Card class="mt-10">
        <CardContent class="p-8">
          <div class="flex flex-wrap items-baseline gap-3">
            <span class="font-display text-4xl font-bold tracking-tight">£1,400</span>
            <span class="text-muted-foreground">per month, billed annually</span>
          </div>
          <p class="text-muted-foreground mt-2 text-sm">
            Includes 2 million queries a month. Beyond that it is £0.0004 per query, capped by your own budgets.
          </p>

          <Button size="lg" class="mt-6 w-full sm:w-auto">
            Start the 30-day trial
            <ArrowRight class="ml-2 size-4" aria-hidden="true" />
          </Button>

          <Separator class="my-8" />

          <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Included</p>
          <ul class="mt-3 grid gap-2.5 sm:grid-cols-2">
            <li v-for="item in included" :key="item" class="flex items-start gap-2.5 text-sm">
              <Check class="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{{ item }}</span>
            </li>
          </ul>

          <Separator class="my-6" />

          <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Not included</p>
          <ul class="mt-3 space-y-2.5">
            <li v-for="item in excluded" :key="item" class="flex items-start gap-2.5 text-sm">
              <X class="text-muted-foreground/50 mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span class="text-muted-foreground">{{ item }}</span>
            </li>
          </ul>

          <Separator class="my-6" />

          <p class="text-muted-foreground text-sm leading-relaxed">
            Past roughly 20 million queries a month, or if any of the exclusions above are hard requirements, a
            conversation will get you a better answer than this page can.
          </p>
          <Button variant="outline" class="mt-4">Talk to us instead</Button>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
