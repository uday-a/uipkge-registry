<script setup lang="ts">
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkline } from '@/components/ui/charts/sparkline'
import { KpiGrid } from '@/components/ui/kpi-grid'

const headcount = [108, 112, 115, 119, 121, 122, 124]
const openRoles = [18, 16, 17, 15, 14, 13, 12]
const timeToFill = [42, 40, 38, 39, 36, 34, 32]
const attrition = [8.4, 8.1, 8.6, 8.2, 7.9, 8.0, 7.6]
</script>

<template>
  <KpiGrid data-slot="dashboard-kpis">
    <Card class="flex flex-col justify-between">
      <CardHeader class="flex flex-row items-start justify-between pb-2">
        <CardTitle class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Headcount</CardTitle>
        <span
          class="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium"
        >
          <TrendingUp class="size-3" aria-hidden="true" />
          +12
        </span>
      </CardHeader>
      <CardContent class="space-y-3">
        <p class="text-2xl font-semibold tracking-tight tabular-nums">124</p>
        <Sparkline :data="headcount" :height="36" aria-label="Headcount trend" />
      </CardContent>
    </Card>

    <Card class="flex flex-col justify-between">
      <CardHeader class="flex flex-row items-start justify-between pb-2">
        <CardTitle class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Open roles</CardTitle>
        <span
          class="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium"
        >
          <TrendingDown class="size-3" aria-hidden="true" />
          −6
        </span>
      </CardHeader>
      <CardContent class="space-y-3">
        <p class="text-2xl font-semibold tracking-tight tabular-nums">12</p>
        <Sparkline :data="openRoles" :height="36" aria-label="Open roles trend" />
      </CardContent>
    </Card>

    <Card class="flex flex-col justify-between">
      <CardHeader class="flex flex-row items-start justify-between pb-2">
        <CardTitle class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Time to fill</CardTitle>
        <span
          class="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium"
        >
          <TrendingDown class="size-3" aria-hidden="true" />
          −10d
        </span>
      </CardHeader>
      <CardContent class="space-y-3">
        <p class="text-2xl font-semibold tracking-tight tabular-nums">32d</p>
        <Sparkline :data="timeToFill" :height="36" aria-label="Time to fill trend" />
      </CardContent>
    </Card>

    <Card class="flex flex-col justify-between">
      <CardHeader class="flex flex-row items-start justify-between pb-2">
        <CardTitle class="text-muted-foreground text-xs font-medium tracking-widest uppercase">Attrition</CardTitle>
        <span
          class="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium"
        >
          <TrendingDown class="size-3" aria-hidden="true" />
          −0.8pt
        </span>
      </CardHeader>
      <CardContent class="space-y-3">
        <p class="text-2xl font-semibold tracking-tight tabular-nums">7.6%</p>
        <Sparkline :data="attrition" :height="36" aria-label="Attrition trend" />
      </CardContent>
    </Card>
  </KpiGrid>
</template>
