<script setup lang="ts">
import { ArrowRight, Headphones, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Each path says who it suits and what happens next. A two-button choice with
// no stated difference just makes the reader pick the bigger button.
const paths = [
  {
    icon: Zap,
    label: 'Start it yourself',
    suits: 'One team, an existing warehouse, and someone comfortable opening a pull request.',
    next: ['Connect a read-only role', 'Publish one certified metric', 'Invite the rest of the team'],
    cta: 'Start free',
    variant: 'default' as const,
    note: 'No card. Cancel from the dashboard.',
  },
  {
    icon: Headphones,
    label: 'Have us run it',
    suits: 'Multiple teams, a regulated estate, or a close that cannot slip during migration.',
    next: ['Scoping call with an engineer', 'Five-week guided rollout', 'Hand-over to your team'],
    cta: 'Book a scoping call',
    variant: 'outline' as const,
    note: 'Median first reply: 3 h 40 m.',
  },
]
</script>

<template>
  <section data-slot="cta-split-panel" class="bg-background">
    <div class="mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <div class="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Two ways in</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pick the one that matches your situation
        </h2>
      </div>

      <div class="mt-10 grid items-stretch gap-4 md:grid-cols-2">
        <Card v-for="path in paths" :key="path.label">
          <CardContent class="flex h-full flex-col p-6">
            <span
              class="border-border text-muted-foreground flex size-10 items-center justify-center rounded-lg border"
              aria-hidden="true"
            >
              <component :is="path.icon" class="size-4" />
            </span>

            <h3 class="mt-4 text-lg font-semibold tracking-tight">{{ path.label }}</h3>
            <p class="text-muted-foreground mt-2 text-sm leading-relaxed">{{ path.suits }}</p>

            <Separator class="my-5" />

            <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">What happens next</p>
            <ol class="mt-3 space-y-2">
              <li v-for="(step, index) in path.next" :key="step" class="flex items-start gap-2.5 text-sm">
                <span class="text-muted-foreground/70 mt-px font-mono text-xs">{{ index + 1 }}</span>
                <span>{{ step }}</span>
              </li>
            </ol>

            <div class="mt-auto pt-6">
              <Button :variant="path.variant" class="w-full">
                {{ path.cta }}
                <ArrowRight class="ml-2 size-4" aria-hidden="true" />
              </Button>
              <p class="text-muted-foreground mt-2 text-center text-xs">{{ path.note }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
