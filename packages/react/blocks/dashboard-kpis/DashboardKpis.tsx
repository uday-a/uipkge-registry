'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkline } from '@/components/ui/charts/sparkline'
import { KpiGrid } from '@/components/ui/kpi-grid'

const headcount = [108, 112, 115, 119, 121, 122, 124]
const openRoles = [18, 16, 17, 15, 14, 13, 12]
const timeToFill = [42, 40, 38, 39, 36, 34, 32]
const attrition = [8.4, 8.1, 8.6, 8.2, 7.9, 8.0, 7.6]

export function DashboardKpis() {
  return (
    <KpiGrid data-slot="dashboard-kpis">
      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Headcount
          </CardTitle>
          <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium">
            <TrendingUp className="size-3" aria-hidden="true" />
            +12
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">124</p>
          <Sparkline data={headcount} height={36} ariaLabel="Headcount trend" />
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Open roles
          </CardTitle>
          <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium">
            <TrendingDown className="size-3" aria-hidden="true" />
            −6
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">12</p>
          <Sparkline data={openRoles} height={36} ariaLabel="Open roles trend" />
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Time to fill
          </CardTitle>
          <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium">
            <TrendingDown className="size-3" aria-hidden="true" />
            −10d
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">32d</p>
          <Sparkline data={timeToFill} height={36} ariaLabel="Time to fill trend" />
        </CardContent>
      </Card>

      <Card className="flex flex-col justify-between">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Attrition
          </CardTitle>
          <span className="bg-success/10 text-success inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium">
            <TrendingDown className="size-3" aria-hidden="true" />
            −0.8pt
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">7.6%</p>
          <Sparkline data={attrition} height={36} ariaLabel="Attrition trend" />
        </CardContent>
      </Card>
    </KpiGrid>
  )
}
