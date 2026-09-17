<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "@/components/ui/charts";
import { KpiGrid } from "@/components/ui/kpi-grid";
import {
  Activity,
  Briefcase,
  CalendarClock,
  DollarSign,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-vue-next";

const headcount = [108, 112, 115, 119, 121, 122, 124];
const revenue = [820, 880, 905, 940, 980, 1050, 1180];
</script>

<template>
  <Story
    title="Default — four explicit tiles"
    description="KpiGrid is just a responsive grid container (2 / 3 / 4 columns). You compose each tile inline as a Card so the call-site reads top-to-bottom with no hidden item rendering."
  >
    <KpiGrid>
      <Card class="flex flex-col justify-between">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >TOTAL EMPLOYEES</CardTitle
          >
          <div class="bg-primary/10 text-primary/70 rounded-lg p-2">
            <Users class="size-4" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold tracking-tight">124</div>
        </CardContent>
        <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
          <span
            class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
            >+12</span
          >
          <span class="text-muted-foreground">this month</span>
        </div>
      </Card>

      <Card class="flex flex-col justify-between">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >ACTIVE</CardTitle
          >
          <div class="bg-primary/10 text-primary/70 rounded-lg p-2">
            <UserCheck class="size-4" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold tracking-tight">116</div>
        </CardContent>
        <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
          <span
            class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
            >+2%</span
          >
          <span class="text-muted-foreground">QoQ</span>
        </div>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >ON LEAVE</CardTitle
          >
          <CalendarClock
            class="text-muted-foreground size-4"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">5</div></CardContent
        >
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >TERMINATED</CardTitle
          >
          <Briefcase class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">3</div></CardContent
        >
      </Card>
    </KpiGrid>
  </Story>

  <Story
    title="Three columns"
    description="Use the columns prop to change density. Accepts 2, 3, or 4."
  >
    <KpiGrid :columns="3">
      <Card class="flex flex-col justify-between">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >REVENUE</CardTitle
          >
          <DollarSign class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">
            $1.2M
          </div></CardContent
        >
        <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
          <span
            class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
            >+8.4%</span
          >
          <span class="text-muted-foreground">YoY</span>
        </div>
      </Card>

      <Card class="flex flex-col justify-between">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >CONVERSION</CardTitle
          >
          <TrendingUp class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">
            3.7%
          </div></CardContent
        >
        <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
          <span
            class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
            >+0.6pp</span
          >
          <span class="text-muted-foreground">WoW</span>
        </div>
      </Card>

      <Card class="flex flex-col justify-between">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >ACTIVE USERS</CardTitle
          >
          <Activity class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">
            8,412
          </div></CardContent
        >
        <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
          <span
            class="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
            >-1.2%</span
          >
          <span class="text-muted-foreground">WoW</span>
        </div>
      </Card>
    </KpiGrid>
  </Story>

  <Story
    title="Mixed tile shapes"
    description="Children are arbitrary — drop in a Card with an inline Sparkline, a chart-led layout, a custom dashed tile, or anything else. KpiGrid only owns the grid."
  >
    <KpiGrid>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >HEADCOUNT</CardTitle
          >
          <Users class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold tracking-tight">124</div>
          <Sparkline :data="headcount" :height="36" class="mt-2" />
        </CardContent>
      </Card>

      <Card class="flex flex-col">
        <CardHeader class="pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >REVENUE TREND</CardTitle
          >
        </CardHeader>
        <CardContent class="pt-0">
          <Sparkline :data="revenue" :height="64" />
        </CardContent>
      </Card>

      <div
        class="bg-muted/50 flex flex-col justify-center rounded-lg border border-dashed p-6"
      >
        <div
          class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
        >
          PIPELINE
        </div>
        <div class="mt-2 text-3xl font-bold tabular-nums">42</div>
      </div>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >ACTIVE</CardTitle
          >
          <UserCheck class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">116</div></CardContent
        >
      </Card>
    </KpiGrid>
  </Story>

  <Story
    title="Two tiles"
    description="Single, double, triple — however many children you pass, the grid wraps responsively. Below: just two."
  >
    <KpiGrid :columns="2">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >REVENUE</CardTitle
          >
          <DollarSign class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">
            $1.2M
          </div></CardContent
        >
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >ACTIVE USERS</CardTitle
          >
          <Activity class="text-muted-foreground size-4" aria-hidden="true" />
        </CardHeader>
        <CardContent
          ><div class="text-2xl font-bold tracking-tight">
            8,412
          </div></CardContent
        >
      </Card>
    </KpiGrid>
  </Story>

  <Story
    title="Sparkline-led tiles"
    description="When the trend matters more than the absolute value, lead with the sparkline and pin the label + value at the top. Same grid container — what changes is the tile composition."
  >
    <KpiGrid>
      <Card>
        <CardHeader class="pb-1">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >HEADCOUNT</CardTitle
          >
          <div class="text-xl font-bold tabular-nums">124</div>
        </CardHeader>
        <CardContent class="pt-0">
          <Sparkline :data="headcount" :height="48" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-1">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >REVENUE</CardTitle
          >
          <div class="text-xl font-bold tabular-nums">$1.18M</div>
        </CardHeader>
        <CardContent class="pt-0">
          <Sparkline :data="revenue" :height="48" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-1">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >CONVERSIONS</CardTitle
          >
          <div class="text-xl font-bold tabular-nums">3.7%</div>
        </CardHeader>
        <CardContent class="pt-0">
          <Sparkline :data="[18, 22, 25, 31, 28, 33, 37]" :height="48" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-1">
          <CardTitle
            class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
            >CHURN</CardTitle
          >
          <div class="text-xl font-bold tabular-nums">0.9%</div>
        </CardHeader>
        <CardContent class="pt-0">
          <Sparkline :data="[2.1, 1.8, 1.5, 1.4, 1.2, 1.0, 0.9]" :height="48" />
        </CardContent>
      </Card>
    </KpiGrid>
  </Story>
</template>
