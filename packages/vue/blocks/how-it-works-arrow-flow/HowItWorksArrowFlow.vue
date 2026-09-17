<script setup lang="ts">
import { ArrowRight, Boxes, FileCheck, GitPullRequest, Send } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const stages = [
  { icon: Boxes, label: 'Connect', body: 'Read-only credentials to the warehouse.', artefact: 'Schema mirror' },
  { icon: GitPullRequest, label: 'Define', body: 'Metrics authored as reviewable files.', artefact: 'Merged PR' },
  { icon: FileCheck, label: 'Certify', body: 'Reconciled against the prior quarters.', artefact: 'Sign-off' },
  { icon: Send, label: 'Publish', body: 'Rolled out to every consumer at once.', artefact: 'Live metric' },
]
</script>

<template>
  <section data-slot="how-it-works-arrow-flow" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">The flow</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Four stages, one artefact each</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Every stage ends in something you can point at, so progress is never a status update.
        </p>
      </div>

      <!-- Arrows sit between cells rather than inside cards, so they stay put
           when a card's copy runs longer. Below md the row becomes a rail. -->
      <div class="mt-12 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-0">
        <template v-for="(stage, index) in stages" :key="stage.label">
          <div class="flex items-center gap-4 md:contents">
            <Card class="flex-1 md:h-full">
              <CardContent class="p-5">
                <span
                  class="border-border text-muted-foreground flex size-9 items-center justify-center rounded-lg border"
                  aria-hidden="true"
                >
                  <component :is="stage.icon" class="size-4" />
                </span>
                <p class="mt-4 text-sm font-semibold">{{ stage.label }}</p>
                <p class="text-muted-foreground mt-1.5 text-xs leading-relaxed">{{ stage.body }}</p>
                <p class="text-muted-foreground/80 mt-3 font-mono text-[11px] tracking-wide uppercase">
                  → {{ stage.artefact }}
                </p>
              </CardContent>
            </Card>
          </div>

          <div
            v-if="index < stages.length - 1"
            class="text-muted-foreground/50 hidden items-center justify-center px-2 md:flex"
            aria-hidden="true"
          >
            <ArrowRight class="size-4" />
          </div>
        </template>
      </div>

      <div class="mt-10">
        <Button variant="outline">
          Walk through a real rollout
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </section>
</template>
