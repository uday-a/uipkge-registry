<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const steps = [
  {
    id: 'connect',
    label: 'Connect',
    action: 'Point us at the warehouse with a read-only role.',
    result: 'Schema mirrored, 412 tables catalogued, nothing copied out.',
    rows: [
      { name: 'warehouse.orders', detail: '2.4M rows' },
      { name: 'warehouse.refunds', detail: '88k rows' },
      { name: 'warehouse.fx_rates', detail: 'daily' },
    ],
  },
  {
    id: 'define',
    label: 'Define',
    action: 'Author the metric as a file and open a pull request.',
    result: 'Reviewed by its owner, with a diff and a revert path.',
    rows: [
      { name: 'revenue_net', detail: 'finance-analytics' },
      { name: 'margin_by_channel', detail: 'finance-analytics' },
      { name: 'pipeline_weighted', detail: 'revops' },
    ],
  },
  {
    id: 'certify',
    label: 'Certify',
    action: 'Reconcile the definition against the prior four quarters.',
    result: 'Sign-off recorded; the metric can now be published.',
    rows: [
      { name: 'Q4 2025', detail: 'matched' },
      { name: 'Q3 2025', detail: 'matched' },
      { name: 'Q2 2025', detail: 'matched' },
    ],
  },
  {
    id: 'publish',
    label: 'Publish',
    action: 'Release to every consumer at once.',
    result: 'Dashboards, exports, and the API resolve the same number.',
    rows: [
      { name: 'Exec summary', detail: 'live' },
      { name: 'Finance close pack', detail: 'live' },
      { name: 'Partner API', detail: 'live' },
    ],
  },
]
</script>

<template>
  <section data-slot="how-it-works-tabbed-steps" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">How it works</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Pick a stage to see what it produces</h2>
      </div>

      <Tabs default-value="connect" orientation="vertical" class="mt-10">
        <div class="grid gap-8 lg:grid-cols-[16rem_1fr] lg:gap-12">
          <!-- Vertical tab rail: orientation is set on both list and triggers so
               arrow keys move up and down rather than left and right. -->
          <TabsList variant="underline" orientation="vertical" class="h-auto w-full flex-col items-stretch">
            <TabsTrigger
              v-for="(step, index) in steps"
              :key="step.id"
              :value="step.id"
              variant="underline"
              orientation="vertical"
              class="justify-start gap-3"
            >
              <span class="text-muted-foreground font-mono text-xs">{{ String(index + 1).padStart(2, '0') }}</span>
              {{ step.label }}
            </TabsTrigger>
          </TabsList>

          <TabsContent v-for="step in steps" :key="step.id" :value="step.id" class="mt-0">
            <!-- min-h keeps the panel from collapsing between stages. -->
            <div class="grid min-h-[20rem] gap-6 sm:grid-cols-2">
              <div>
                <p class="text-muted-foreground text-sm">You do</p>
                <p class="mt-1.5 text-lg leading-snug font-medium text-balance">{{ step.action }}</p>

                <Separator class="my-5" />

                <p class="text-muted-foreground text-sm">You get</p>
                <p class="mt-1.5 flex items-start gap-2 text-sm leading-relaxed">
                  <Check class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{{ step.result }}</span>
                </p>

                <Button variant="link" class="mt-5 h-auto p-0">Read this step in the docs</Button>
              </div>

              <Card class="self-start">
                <CardContent class="p-0">
                  <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                    {{ step.label }}
                  </div>
                  <ul class="divide-border divide-y">
                    <li
                      v-for="row in step.rows"
                      :key="row.name"
                      class="flex items-center justify-between gap-4 px-4 py-2.5"
                    >
                      <span class="min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                      <span class="text-muted-foreground shrink-0 text-xs">{{ row.detail }}</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  </section>
</template>
