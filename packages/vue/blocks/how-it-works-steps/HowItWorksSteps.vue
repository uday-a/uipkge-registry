<script setup lang="ts">
import { CloudUpload, Plug, Rocket } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const steps = [
  {
    icon: Plug,
    title: 'Connect your stack',
    body: 'Point us at Postgres, Snowflake, or a CSV drop. Read-only credentials, no agent to install.',
    detail: '~4 min',
  },
  {
    icon: CloudUpload,
    title: 'Map your metrics',
    body: 'Pick the columns that matter. We infer types, generate the schema, and flag anything ambiguous.',
    detail: '~10 min',
  },
  {
    icon: Rocket,
    title: 'Ship the dashboard',
    body: 'Publish to your team with row-level permissions already applied. Iterate without a redeploy.',
    detail: 'Same day',
  },
]
</script>

<template>
  <section data-slot="how-it-works-steps" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">How it works</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Three steps from credentials to dashboard
        </h2>
        <p class="text-muted-foreground mt-3 text-lg">
          No migration, no rewrite. Most teams finish the whole path in an afternoon.
        </p>
      </div>

      <div class="relative mt-14">
        <!-- Connector rail: decorative, so it lives outside the <ol> rather than
             adding a phantom list item for screen readers. -->
        <div
          class="bg-border pointer-events-none absolute top-6 right-[16.67%] left-[16.67%] hidden h-px md:block"
          aria-hidden="true"
        />

        <ol class="grid gap-10 md:grid-cols-3 md:gap-8">
          <li
            v-for="(step, index) in steps"
            :key="step.title"
            class="relative flex flex-col items-start md:items-center"
          >
            <div
              class="border-border bg-card text-foreground relative z-10 flex size-12 items-center justify-center rounded-full border font-mono text-sm font-semibold"
            >
              {{ String(index + 1).padStart(2, '0') }}
            </div>

            <div class="mt-5 md:text-center">
              <component :is="step.icon" class="text-muted-foreground mb-3 size-5 md:mx-auto" aria-hidden="true" />
              <h3 class="text-base font-semibold">{{ step.title }}</h3>
              <p class="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed md:mx-auto">{{ step.body }}</p>
              <p class="text-muted-foreground/80 mt-3 font-mono text-xs tracking-wide uppercase">{{ step.detail }}</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="border-border mt-14 flex flex-wrap items-center gap-4 border-t pt-8">
        <Button>Start the walkthrough</Button>
        <Button variant="ghost">Read the setup guide</Button>
      </div>
    </div>
  </section>
</template>
