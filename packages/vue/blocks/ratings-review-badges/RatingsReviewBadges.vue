<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

const platforms = [
  { name: 'G2', score: 4.8, reviews: 412, award: 'Leader — Analytics Platforms, Winter 2026' },
  { name: 'Capterra', score: 4.7, reviews: 268, award: 'Best Value — Business Intelligence' },
  { name: 'Product Hunt', score: 4.9, reviews: 1340, award: '#1 Product of the Day' },
  { name: 'TrustRadius', score: 4.6, reviews: 97, award: 'Top Rated — Data Governance' },
]

const distribution = [
  { stars: 5, share: 78 },
  { stars: 4, share: 16 },
  { stars: 3, share: 4 },
  { stars: 2, share: 1 },
  { stars: 1, share: 1 },
]

const STAR_SLOTS = [1, 2, 3, 4, 5]

/** Fill percentage for one star slot, so a 4.6 renders a real partial star. */
function fillFor(score: number, slot: number) {
  return `${Math.min(Math.max(score - (slot - 1), 0), 1) * 100}%`
}
</script>

<template>
  <section data-slot="ratings-review-badges" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Reviews</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Rated by the people who run it daily</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Every score below is pulled from a public review platform. None of them are ours to edit.
        </p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="platform in platforms" :key="platform.name">
          <CardContent class="p-5">
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-sm font-semibold">{{ platform.name }}</p>
              <p class="text-muted-foreground font-mono text-xs">{{ platform.reviews }} reviews</p>
            </div>

            <div class="mt-3 flex items-center gap-2">
              <div class="flex items-center gap-0.5" role="img" :aria-label="`${platform.score} out of 5`">
                <span v-for="slot in STAR_SLOTS" :key="slot" class="relative inline-flex">
                  <Star class="text-muted-foreground/30 size-4" aria-hidden="true" />
                  <!-- Dynamic clip width is the only way to draw a partial star. -->
                  <span
                    class="absolute inset-y-0 left-0 overflow-hidden"
                    :style="{ width: fillFor(platform.score, slot) }"
                    aria-hidden="true"
                  >
                    <Star class="fill-primary text-primary size-4" />
                  </span>
                </span>
              </div>
              <span class="text-sm font-medium">{{ platform.score.toFixed(1) }}</span>
            </div>

            <p class="text-muted-foreground mt-4 text-xs leading-relaxed">{{ platform.award }}</p>
          </CardContent>
        </Card>
      </div>

      <Separator class="my-10" />

      <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <p class="font-display text-5xl font-bold tracking-tight">4.8</p>
          <p class="text-muted-foreground mt-2 text-sm">
            Weighted average across 2,117 verified reviews on four platforms.
          </p>
          <Button variant="outline" class="mt-5">Read the reviews</Button>
        </div>

        <dl class="space-y-3">
          <div v-for="row in distribution" :key="row.stars" class="flex items-center gap-4">
            <dt class="text-muted-foreground w-12 shrink-0 font-mono text-xs">{{ row.stars }} star</dt>
            <dd class="flex min-w-0 grow items-center gap-4">
              <Progress :model-value="row.share" class="h-1.5" :aria-label="`${row.stars} star reviews`" />
              <span class="text-muted-foreground w-10 shrink-0 text-right font-mono text-xs">{{ row.share }}%</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
