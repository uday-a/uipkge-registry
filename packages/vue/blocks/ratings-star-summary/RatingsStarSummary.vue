<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const score = 4.7
const total = 2117

const distribution = [
  { stars: 5, count: 1587 },
  { stars: 4, count: 381 },
  { stars: 3, count: 97 },
  { stars: 2, count: 31 },
  { stars: 1, count: 21 },
]

const STAR_SLOTS = [1, 2, 3, 4, 5]

/** Fill percentage for one slot, so 4.7 draws a real partial star. */
function fillFor(slot: number) {
  return `${Math.min(Math.max(score - (slot - 1), 0), 1) * 100}%`
}
</script>

<template>
  <section data-slot="ratings-star-summary" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <Badge variant="secondary">Reviews</Badge>
      <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        What {{ total.toLocaleString() }} people say
      </h2>

      <Card class="mt-8">
        <CardContent class="grid gap-8 p-6 sm:grid-cols-[auto_1fr] sm:gap-12 sm:p-8">
          <div class="text-center sm:text-left">
            <p class="font-display text-5xl font-bold tracking-tight">{{ score.toFixed(1) }}</p>
            <div
              class="mt-2 flex items-center justify-center gap-0.5 sm:justify-start"
              role="img"
              :aria-label="`${score} out of 5`"
            >
              <span v-for="slot in STAR_SLOTS" :key="slot" class="relative inline-flex">
                <Star class="text-muted-foreground/30 size-4" aria-hidden="true" />
                <span
                  class="absolute inset-y-0 left-0 overflow-hidden"
                  :style="{ width: fillFor(slot) }"
                  aria-hidden="true"
                >
                  <Star class="fill-primary text-primary size-4" />
                </span>
              </span>
            </div>
            <p class="text-muted-foreground mt-2 text-xs">{{ total.toLocaleString() }} verified reviews</p>
          </div>

          <Separator orientation="vertical" class="hidden h-auto sm:block" />

          <dl class="space-y-2.5">
            <div v-for="row in distribution" :key="row.stars" class="flex items-center gap-4">
              <dt class="text-muted-foreground w-12 shrink-0 font-mono text-xs">{{ row.stars }} star</dt>
              <dd class="flex min-w-0 grow items-center gap-4">
                <Progress
                  :model-value="Math.round((row.count / total) * 100)"
                  class="h-1.5"
                  :aria-label="`${row.stars} star reviews`"
                />
                <span class="text-muted-foreground w-12 shrink-0 text-right font-mono text-xs">
                  {{ row.count.toLocaleString() }}
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div class="mt-6 flex flex-wrap items-center gap-4">
        <Button variant="outline">Read the one-star reviews</Button>
        <p class="text-muted-foreground text-sm">They are the useful ones, and we have not hidden them.</p>
      </div>
    </div>
  </section>
</template>
