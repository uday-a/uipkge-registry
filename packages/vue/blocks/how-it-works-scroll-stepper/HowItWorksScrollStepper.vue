<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const steps = [
  {
    id: 'connect',
    title: 'Connect the warehouse',
    body: 'A read-only role and the account URL. We mirror the schema and catalogue what is there — no agent, no extract, no copy of your data leaving the account.',
  },
  {
    id: 'define',
    title: 'Define the metrics that matter',
    body: 'Start with the numbers that already appear in the board deck. Each becomes a versioned definition with an owner, reviewed like any other change in the repo.',
  },
  {
    id: 'certify',
    title: 'Certify against history',
    body: 'Every definition is reconciled against the prior four quarters before it can be published. Mismatches surface as a diff, not as a surprise in the close.',
  },
  {
    id: 'publish',
    title: 'Publish once, everywhere',
    body: 'Dashboards, scheduled exports, and the API all resolve the same definition. Changing it updates every consumer, and reverting is the same one click.',
  },
]

const active = ref(0)
const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
  // Without IntersectionObserver the rail simply stays on the first step and
  // the copy reads as a plain ordered list.
  if (!('IntersectionObserver' in window) || !root.value) return
  const targets = root.value.querySelectorAll<HTMLElement>('[data-step]')
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.step)
        if (!Number.isNaN(index)) active.value = index
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  targets.forEach((target) => observer?.observe(target))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section ref="root" data-slot="how-it-works-scroll-stepper" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Walkthrough</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Scroll through the first week</h2>
      </div>

      <div class="mt-12 grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <!-- Sticky rail tracks whichever step is nearest the viewport middle. -->
        <div class="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent class="p-5">
              <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Progress</p>
              <Progress
                :model-value="((active + 1) / steps.length) * 100"
                class="mt-3 h-1.5"
                aria-label="Walkthrough progress"
              />
              <ol class="mt-5 space-y-3">
                <li
                  v-for="(step, index) in steps"
                  :key="step.id"
                  class="flex items-start gap-3 text-sm transition-colors"
                  :class="index === active ? 'text-foreground' : 'text-muted-foreground'"
                >
                  <span
                    class="mt-1 size-1.5 shrink-0 rounded-full transition-colors"
                    :class="index === active ? 'bg-primary' : 'bg-muted-foreground/40'"
                    aria-hidden="true"
                  />
                  <span class="font-medium">{{ step.title }}</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <ol class="space-y-16 lg:space-y-28">
          <li v-for="(step, index) in steps" :key="step.id" :data-step="index" class="scroll-mt-32">
            <p class="text-muted-foreground font-mono text-xs">{{ String(index + 1).padStart(2, '0') }}</p>
            <h3 class="mt-2 text-2xl font-semibold tracking-tight text-balance">{{ step.title }}</h3>
            <p class="text-muted-foreground mt-3 max-w-prose leading-relaxed">{{ step.body }}</p>
          </li>
        </ol>
      </div>

      <div class="mt-12">
        <Button>
          Start the walkthrough
          <ArrowRight class="ml-2 size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </section>
</template>
