<script setup lang="ts">
import { ArrowRight, Check, GitBranch, ShieldCheck, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import type { Component } from 'vue'

// Explicit shape: the three preview panels are structurally different, so the
// optional keys keep the union from collapsing when the template narrows.
interface FeatureRow {
  eyebrow: string
  icon: Component
  title: string
  body: string
  points: string[]
  link: string
  reverse: boolean
  preview: {
    label: string
    lines?: { text: string; tone: 'add' | 'remove' | 'same' }[]
    rules?: { scope: string; value: string; allowed: boolean }[]
    stats?: { name: string; detail: string }[]
  }
}

const rows: FeatureRow[] = [
  {
    eyebrow: 'Versioning',
    icon: GitBranch,
    title: 'Every change is a reviewable diff',
    body: 'Dashboards, metrics, and permissions are stored as plain files. Changes open a pull request instead of silently overwriting production.',
    points: ['Branch per change', 'Review before publish', 'One-click revert'],
    link: 'How version control works',
    reverse: false,
    preview: {
      label: 'metrics/revenue.yml',
      lines: [
        { text: '+ window: trailing_28d', tone: 'add' },
        { text: '- window: trailing_30d', tone: 'remove' },
        { text: '  owner: finance-analytics', tone: 'same' },
      ],
    },
  },
  {
    eyebrow: 'Access',
    icon: ShieldCheck,
    title: 'Permissions that follow the row, not the dashboard',
    body: 'Scope is evaluated at query time from your identity provider, so a shared link never leaks a region or account the viewer cannot see.',
    points: ['Row-level filters', 'SCIM group sync', 'Audited every query'],
    link: 'Read the access model',
    reverse: true,
    preview: {
      label: 'Effective access — EMEA analyst',
      rules: [
        { scope: 'region', value: 'EMEA only', allowed: true },
        { scope: 'revenue.net', value: 'Visible', allowed: true },
        { scope: 'payroll.*', value: 'Blocked', allowed: false },
      ],
    },
  },
  {
    eyebrow: 'Performance',
    icon: Zap,
    title: 'Cached where it matters, fresh where it counts',
    body: 'Hot aggregates are materialised on a schedule you control. Everything else falls through to the warehouse so the number is never stale by accident.',
    points: ['Per-metric freshness', 'Warehouse pass-through', 'Cost ceiling per team'],
    link: 'See the caching rules',
    reverse: false,
    preview: {
      label: 'Freshness',
      stats: [
        { name: 'Revenue rollup', detail: 'materialised · 5 min' },
        { name: 'Pipeline by stage', detail: 'materialised · 1 hr' },
        { name: 'Raw event search', detail: 'live query' },
      ],
    },
  },
]
</script>

<template>
  <section data-slot="feature-alternating-rows" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="max-w-2xl">
        <Badge variant="secondary">Platform</Badge>
        <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Built like infrastructure, not a widget</h2>
        <p class="text-muted-foreground mt-3 text-lg">
          Three decisions that stop a reporting layer from rotting after the first quarter.
        </p>
      </div>

      <div class="mt-16 space-y-16 lg:space-y-24">
        <div v-for="row in rows" :key="row.title" class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div :class="row.reverse ? 'lg:order-2' : ''">
            <div class="text-muted-foreground flex items-center gap-2">
              <component :is="row.icon" class="size-4" aria-hidden="true" />
              <span class="font-mono text-xs tracking-[0.14em] uppercase">{{ row.eyebrow }}</span>
            </div>
            <h3 class="mt-4 text-2xl font-semibold tracking-tight">{{ row.title }}</h3>
            <p class="text-muted-foreground mt-3 leading-relaxed">{{ row.body }}</p>
            <ul class="mt-6 space-y-2.5">
              <li v-for="point in row.points" :key="point" class="flex items-start gap-2.5 text-sm">
                <Check class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{{ point }}</span>
              </li>
            </ul>
            <Button variant="link" class="mt-5 h-auto p-0">
              {{ row.link }}
              <ArrowRight class="ml-1.5 size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <Card :class="row.reverse ? 'lg:order-1' : ''">
            <CardContent class="p-0">
              <div class="border-border text-muted-foreground border-b px-4 py-2.5 font-mono text-xs">
                {{ row.preview.label }}
              </div>

              <!-- Diff preview -->
              <div v-if="row.preview.lines" class="space-y-1 p-4 font-mono text-xs">
                <p
                  v-for="line in row.preview.lines"
                  :key="line.text"
                  :class="
                    line.tone === 'add'
                      ? 'text-success'
                      : line.tone === 'remove'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                  "
                >
                  {{ line.text }}
                </p>
              </div>

              <!-- Access preview -->
              <div v-else-if="row.preview.rules" class="divide-border divide-y">
                <div
                  v-for="rule in row.preview.rules"
                  :key="rule.scope"
                  class="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <span class="font-mono text-xs">{{ rule.scope }}</span>
                  <Badge :variant="rule.allowed ? 'secondary' : 'outline'">{{ rule.value }}</Badge>
                </div>
              </div>

              <!-- Freshness preview -->
              <div v-else class="p-4">
                <ul class="space-y-3">
                  <li v-for="stat in row.preview.stats" :key="stat.name">
                    <div class="flex items-baseline justify-between gap-4">
                      <span class="text-sm font-medium">{{ stat.name }}</span>
                      <span class="text-muted-foreground font-mono text-xs">{{ stat.detail }}</span>
                    </div>
                    <Separator class="mt-3" />
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>
