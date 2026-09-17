<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const sections = [
  {
    id: 'connect',
    title: 'Point at the warehouse',
    body: 'A read-only role is the whole integration. We mirror the schema, record freshness per table, and flag anything that looks abandoned before you model against it.',
    rows: [
      { name: 'warehouse.orders', detail: 'fresh · 2 min' },
      { name: 'warehouse.refunds', detail: 'fresh · 2 min' },
      { name: 'legacy.orders_v1', detail: 'stale · 41 days' },
    ],
  },
  {
    id: 'model',
    title: 'Write the definition once',
    body: 'Revenue, margin, and pipeline become files with owners. Every consumer resolves the same definition, so the exec summary and the close pack cannot disagree.',
    rows: [
      { name: 'revenue_net', detail: 'v128 · finance' },
      { name: 'margin_by_channel', detail: 'v41 · finance' },
      { name: 'pipeline_weighted', detail: 'v12 · revops' },
    ],
  },
  {
    id: 'serve',
    title: 'Serve it everywhere',
    body: 'Dashboards, scheduled exports, and the API read the same certified metric with the caller’s own scope applied, and each result carries the freshness it was served at.',
    rows: [
      { name: 'Exec summary', detail: 'live' },
      { name: 'Finance close pack', detail: 'live' },
      { name: 'Partner API', detail: 'live' },
    ],
  },
]

const active = ref(0)
const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined

onMounted(() => {
  // Without IntersectionObserver the pinned pane simply stays on the first
  // section and the page reads as stacked copy-and-visual pairs.
  if (!('IntersectionObserver' in window) || !root.value) return
  const targets = root.value.querySelectorAll<HTMLElement>('[data-section]')
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = Number((entry.target as HTMLElement).dataset.section)
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
  <section ref="root" data-slot="feature-sticky-media-scroll" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">How it fits together</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Three moves, in order</h2>
      </div>

      <div class="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-20 lg:space-y-32">
          <div v-for="(section, index) in sections" :key="section.id" :data-section="index" class="scroll-mt-32">
            <p class="text-muted-foreground font-mono text-xs">{{ String(index + 1).padStart(2, '0') }}</p>
            <h3 class="mt-2 text-2xl font-semibold tracking-tight text-balance">{{ section.title }}</h3>
            <p class="text-muted-foreground mt-3 max-w-prose leading-relaxed">{{ section.body }}</p>

            <!-- Inline card below the breakpoint, where nothing can pin usefully. -->
            <Card class="mt-5 lg:hidden">
              <CardContent class="p-0">
                <ul class="divide-border divide-y">
                  <li
                    v-for="row in section.rows"
                    :key="row.name"
                    class="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <span class="min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                    <span class="text-muted-foreground shrink-0 text-xs">{{ row.detail }}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div class="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
          <Card>
            <CardContent class="p-0">
              <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                {{ sections[active].title }}
              </div>
              <ul class="divide-border min-h-[9rem] divide-y">
                <li
                  v-for="row in sections[active].rows"
                  :key="row.name"
                  class="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span class="min-w-0 truncate font-mono text-xs">{{ row.name }}</span>
                  <span class="text-muted-foreground shrink-0 text-xs">{{ row.detail }}</span>
                </li>
              </ul>
              <Separator />
              <p class="text-muted-foreground px-4 py-2.5 text-xs">Step {{ active + 1 }} of {{ sections.length }}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button variant="outline" class="mt-12">Start the walkthrough</Button>
    </div>
  </section>
</template>
