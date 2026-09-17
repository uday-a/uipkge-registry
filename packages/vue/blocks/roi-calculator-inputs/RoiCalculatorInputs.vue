<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

// One reactive model keyed by input id. Refs nested inside a computed array do
// not unwrap in the template, so v-model against them silently fails to write.
const model = reactive<Record<string, number[]>>({
  analysts: [6],
  days: [9],
  rate: [520],
})

// Stating the model beneath the number is what stops this reading as a toy.
// Every figure below is derived from the three inputs and nothing else.
const DAYS_SAVED_SHARE = 0.55
const CLOSES_PER_YEAR = 12

const inputs = [
  { id: 'analysts', label: 'People involved in close', min: 1, max: 40, step: 1, format: (v: number) => `${v}` },
  { id: 'days', label: 'Days the close takes today', min: 2, max: 20, step: 1, format: (v: number) => `${v} days` },
  { id: 'rate', label: 'Fully-loaded day rate', min: 200, max: 1200, step: 20, format: (v: number) => `£${v}` },
]

const daysSaved = computed(() => Math.round(model.days[0] * DAYS_SAVED_SHARE * 10) / 10)
const annualSaving = computed(() => Math.round(daysSaved.value * CLOSES_PER_YEAR * model.analysts[0] * model.rate[0]))
const formatted = computed(() => `£${annualSaving.value.toLocaleString('en-GB')}`)
</script>

<template>
  <section data-slot="roi-calculator-inputs" class="bg-background">
    <div class="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Estimate</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What the close currently costs you</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Three inputs, one arithmetic model, stated in full underneath. Adjust anything that looks wrong.
        </p>
      </div>

      <Card class="mt-10">
        <CardContent class="grid gap-8 p-6 sm:grid-cols-[1.2fr_1fr] sm:p-8">
          <div class="space-y-6">
            <div v-for="input in inputs" :key="input.id">
              <div class="flex items-baseline justify-between gap-4">
                <label :for="input.id" class="text-sm font-medium">{{ input.label }}</label>
                <span class="font-mono text-sm tabular-nums">{{ input.format(model[input.id][0]) }}</span>
              </div>
              <Slider
                :id="input.id"
                v-model="model[input.id]"
                :min="input.min"
                :max="input.max"
                :step="input.step"
                class="mt-3"
                :aria-label="input.label"
              />
            </div>
          </div>

          <div class="border-border bg-muted/30 flex flex-col justify-center rounded-lg border p-6 text-center">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Estimated annual saving</p>
            <p class="font-display mt-2 text-4xl font-bold tracking-tight tabular-nums">{{ formatted }}</p>
            <p class="text-muted-foreground mt-2 text-xs">
              {{ daysSaved }} days saved per close, {{ CLOSES_PER_YEAR }} closes a year
            </p>
            <Button class="mt-5">
              Check it against your numbers
              <ArrowRight class="ml-2 size-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>

        <Separator />

        <div class="px-6 py-4 sm:px-8">
          <p class="text-muted-foreground text-xs leading-relaxed">
            <span class="font-medium">The model. </span>
            Saving = days saved × closes per year × people × day rate, where days saved assumes
            {{ Math.round(DAYS_SAVED_SHARE * 100) }}% of close time is reconciliation that certified definitions remove.
            That share is the median across 240 rollouts; yours will differ, and the figure is only as good as that
            assumption.
          </p>
        </div>
      </Card>
    </div>
  </section>
</template>
