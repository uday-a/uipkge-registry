import Story from '../../components/story/Story'
import { Card, CardContent, CardHeader, CardTitle } from '@react-registry/card'
import { Sparkline } from '@react-registry/charts'
import { KpiGrid } from '@react-registry/kpi-grid'
import { Activity, Briefcase, CalendarClock, DollarSign, TrendingUp, UserCheck, Users } from 'lucide-react'

const headcount = [108, 112, 115, 119, 121, 122, 124]
const revenue = [820, 880, 905, 940, 980, 1050, 1180]

export default function KpiGridDemo() {
  return (
    <>
      <Story
        title="Default — four explicit tiles"
        description="KpiGrid is just a responsive grid container (2 / 3 / 4 columns). You compose each tile inline as a Card so the call-site reads top-to-bottom with no hidden item rendering."
      >
        <KpiGrid>
          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                TOTAL EMPLOYEES
              </CardTitle>
              <div className="bg-primary/10 text-primary/70 rounded-lg p-2">
                <Users className="size-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">124</div>
            </CardContent>
            <div className="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span className="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +12
              </span>
              <span className="text-muted-foreground">this month</span>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ACTIVE
              </CardTitle>
              <div className="bg-primary/10 text-primary/70 rounded-lg p-2">
                <UserCheck className="size-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">116</div>
            </CardContent>
            <div className="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span className="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +2%
              </span>
              <span className="text-muted-foreground">QoQ</span>
            </div>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ON LEAVE
              </CardTitle>
              <CalendarClock className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">5</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                TERMINATED
              </CardTitle>
              <Briefcase className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">3</div>
            </CardContent>
          </Card>
        </KpiGrid>
      </Story>

      <Story title="Three columns" description="Use the columns prop to change density. Accepts 2, 3, or 4.">
        <KpiGrid columns={3}>
          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                REVENUE
              </CardTitle>
              <DollarSign className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">$1.2M</div>
            </CardContent>
            <div className="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span className="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +8.4%
              </span>
              <span className="text-muted-foreground">YoY</span>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                CONVERSION
              </CardTitle>
              <TrendingUp className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">3.7%</div>
            </CardContent>
            <div className="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span className="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +0.6pp
              </span>
              <span className="text-muted-foreground">WoW</span>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ACTIVE USERS
              </CardTitle>
              <Activity className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">8,412</div>
            </CardContent>
            <div className="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                -1.2%
              </span>
              <span className="text-muted-foreground">WoW</span>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                HEADCOUNT
              </CardTitle>
              <Users className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">124</div>
              <Sparkline data={headcount} height={36} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                REVENUE TREND
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Sparkline data={revenue} height={64} />
            </CardContent>
          </Card>

          <div className="bg-muted/50 flex flex-col justify-center rounded-lg border border-dashed p-6">
            <div className="text-muted-foreground text-xs font-medium tracking-widest uppercase">PIPELINE</div>
            <div className="mt-2 text-3xl font-bold tabular-nums">42</div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ACTIVE
              </CardTitle>
              <UserCheck className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">116</div>
            </CardContent>
          </Card>
        </KpiGrid>
      </Story>

      <Story
        title="Two tiles"
        description="Single, double, triple — however many children you pass, the grid wraps responsively. Below: just two."
      >
        <KpiGrid columns={2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                REVENUE
              </CardTitle>
              <DollarSign className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">$1.2M</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ACTIVE USERS
              </CardTitle>
              <Activity className="text-muted-foreground size-4" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">8,412</div>
            </CardContent>
          </Card>
        </KpiGrid>
      </Story>

      <Story
        title="Sparkline-led tiles"
        description="When the trend matters more than the absolute value, lead with the sparkline and pin the label + value at the top. Same grid container — what changes is the tile composition."
      >
        <KpiGrid>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                HEADCOUNT
              </CardTitle>
              <div className="text-xl font-bold tabular-nums">124</div>
            </CardHeader>
            <CardContent className="pt-0">
              <Sparkline data={headcount} height={48} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                REVENUE
              </CardTitle>
              <div className="text-xl font-bold tabular-nums">$1.18M</div>
            </CardHeader>
            <CardContent className="pt-0">
              <Sparkline data={revenue} height={48} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                CONVERSIONS
              </CardTitle>
              <div className="text-xl font-bold tabular-nums">3.7%</div>
            </CardHeader>
            <CardContent className="pt-0">
              <Sparkline data={[18, 22, 25, 31, 28, 33, 37]} height={48} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                CHURN
              </CardTitle>
              <div className="text-xl font-bold tabular-nums">0.9%</div>
            </CardHeader>
            <CardContent className="pt-0">
              <Sparkline data={[2.1, 1.8, 1.5, 1.4, 1.2, 1.0, 0.9]} height={48} />
            </CardContent>
          </Card>
        </KpiGrid>
      </Story>
    </>
  )
}
