<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// One concrete scenario beats four abstract ones: the reader can check it
// against their own Tuesday.
const steps = [
  {
    actor: 'Controller',
    action: 'Notices Q1 revenue in the board deck is £41k above the close pack.',
    recorded: 'Nothing yet — this is the part that used to take a day to explain.',
  },
  {
    actor: 'Controller',
    action: 'Opens the metric and reads its history instead of asking the analytics team.',
    recorded: 'Definition v127, changed 14 Feb by finance-analytics, reviewed by A. Reyes.',
  },
  {
    actor: 'Analyst',
    action: 'Sees the deck was built on v126, before the trailing window changed.',
    recorded: 'Consumer list shows which dashboards still resolve the older version.',
  },
  {
    actor: 'Analyst',
    action: 'Republishes the deck against the current definition; the gap disappears.',
    recorded: 'Publish event, with the before and after figures attached.',
  },
  {
    actor: 'Auditor',
    action: 'Six months later, asks why Q1 was restated.',
    recorded: 'The whole chain above, exported as a single PDF in under a minute.',
  },
]
</script>

<template>
  <section data-slot="use-cases-scenario-walkthrough" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">A Tuesday</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Two numbers disagree. Here is the whole sequence.
        </h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Not a feature list — the actual path, including what the system writes down at each step.
        </p>
      </div>

      <ol class="mt-12 space-y-4">
        <li v-for="(step, index) in steps" :key="step.action" class="grid grid-cols-[auto_1fr] gap-x-5">
          <div class="flex flex-col items-center">
            <span
              class="border-border bg-card text-muted-foreground relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <span v-if="index < steps.length - 1" class="bg-border w-px grow" aria-hidden="true" />
          </div>

          <Card class="mb-4">
            <CardContent class="p-5">
              <Badge variant="outline">{{ step.actor }}</Badge>
              <p class="mt-3 text-sm leading-relaxed">{{ step.action }}</p>
              <Separator class="my-3" />
              <p class="text-muted-foreground text-xs leading-relaxed">
                <span class="font-medium">Recorded: </span>{{ step.recorded }}
              </p>
            </CardContent>
          </Card>
        </li>
      </ol>

      <div class="border-border mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <p class="text-muted-foreground text-sm">Total elapsed, start to resolution: about nine minutes.</p>
        <Button>
          Walk through it yourself
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </section>
</template>
