'use client'

import * as React from 'react'
import {
  Calendar,
  Download,
  Megaphone,
  Plus,
  Search,
  Share2,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ChannelPerformance {
  id: string
  name: string
  campaignCount: number
  spend: string
  impressions: string
  clicks: string
  ctr: string
  cpc: string
  cpa: string
  roas: string
  roasStatus: 'high' | 'medium' | 'low'
  conversions: number
  revenue: string
  active: boolean
  icon: React.ComponentType<{ className?: string }>
  iconClass: string
}

const initialChannels: ChannelPerformance[] = [
  {
    id: 'google-search',
    name: 'Google Search Ads',
    campaignCount: 6,
    spend: '$11,200.00',
    impressions: '248,500',
    clicks: '14,910',
    ctr: '6.00%',
    cpc: '$0.75',
    cpa: '$42.10',
    roas: '4.2x',
    roasStatus: 'high',
    conversions: 266,
    revenue: '$47,040.00',
    active: true,
    icon: Search,
    iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'meta-ads',
    name: 'Meta / Instagram Ads',
    campaignCount: 8,
    spend: '$7,650.00',
    impressions: '420,000',
    clicks: '8,400',
    ctr: '2.00%',
    cpc: '$0.91',
    cpa: '$49.35',
    roas: '3.1x',
    roasStatus: 'high',
    conversions: 155,
    revenue: '$23,715.00',
    active: true,
    icon: Share2,
    iconClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'linkedin-ads',
    name: 'LinkedIn Sponsored',
    campaignCount: 3,
    spend: '$3,800.00',
    impressions: '54,000',
    clicks: '1,080',
    ctr: '2.00%',
    cpc: '$3.52',
    cpa: '$64.40',
    roas: '2.4x',
    roasStatus: 'medium',
    conversions: 59,
    revenue: '$9,120.00',
    active: true,
    icon: Megaphone,
    iconClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  },
  {
    id: 'twitter-ads',
    name: 'Twitter / X Ads',
    campaignCount: 2,
    spend: '$2,200.00',
    impressions: '110,000',
    clicks: '1,650',
    ctr: '1.50%',
    cpc: '$1.33',
    cpa: '$68.75',
    roas: '1.8x',
    roasStatus: 'low',
    conversions: 32,
    revenue: '$3,960.00',
    active: false,
    icon: Zap,
    iconClass: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
  },
]

interface TopCampaign {
  id: string
  rank: number
  name: string
  channel: string
  targetNiche: string
  spend: string
  revenue: string
  cpa: string
  roas: string
}

const topCampaigns: TopCampaign[] = [
  {
    id: 'camp-1',
    rank: 1,
    name: 'Q3 Retargeting · High-Intent Abandoned Cart',
    channel: 'Google Search Ads',
    targetNiche: 'SaaS Mid-Market Decision Makers',
    spend: '$4,120.00',
    revenue: '$22,248.00',
    cpa: '$34.33',
    roas: '5.4x',
  },
  {
    id: 'camp-2',
    rank: 2,
    name: 'Competitor Keyword Conquesting - Core US',
    channel: 'Google Search Ads',
    targetNiche: 'Direct B2B Search Intent',
    spend: '$6,800.00',
    revenue: '$31,280.00',
    cpa: '$38.20',
    roas: '4.6x',
  },
  {
    id: 'camp-3',
    rank: 3,
    name: 'Founder Video Testimonial - Lookalike 1%',
    channel: 'Meta / Instagram Ads',
    targetNiche: 'Seed & Series A Tech Founders',
    spend: '$3,450.00',
    revenue: '$13,110.00',
    cpa: '$46.00',
    roas: '3.8x',
  },
]

export function AdSpendRoiDashboard({ className }: { className?: string }) {
  const [selectedPeriod, setSelectedPeriod] = React.useState('this-month')
  const [channels, setChannels] = React.useState<ChannelPerformance[]>(initialChannels)

  const handleToggleChannel = (id: string, active: boolean) => {
    setChannels((prev) => prev.map((ch) => (ch.id === id ? { ...ch, active } : ch)))
  }

  return (
    <div data-slot="ad-spend-roi-dashboard" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Paid Acquisition & Ad Spend ROI
          </h1>
          <p className="text-muted-foreground text-sm">
            Multi-channel paid acquisition ad spend, blended ROAS, and CAC performance dashboard.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-56 text-xs" aria-label="Select date range">
              <Calendar className="text-muted-foreground mr-1.5 size-3.5" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month · Aug 2026</SelectItem>
              <SelectItem value="last-month">Last Month · Jul 2026</SelectItem>
              <SelectItem value="last-30">Last 30 Days</SelectItem>
              <SelectItem value="last-90">Last 90 Days (Q3)</SelectItem>
              <SelectItem value="ytd">Year to Date · 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button aria-label="Download attachment" variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            <span>Export Campaign CSV</span>
          </Button>
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            <span>Connect Ad Account</span>
          </Button>
        </div>
      </div>

      {/* 4 Primary Performance KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Ad Spend */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="border-border bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Wallet className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Total Ad Spend</CardTitle>
              </div>
              <Badge wrap variant="outline" className="text-xs font-normal tabular-nums">
                82.8% pacing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$24,850.00</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">Monthly budget $30,000.00</p>
            </div>
            <div className="space-y-1.5">
              <Progress value={82.8} className="[&_[data-slot=progress-indicator]]:bg-primary h-1.5" />
              <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
                <span>$5,150.00 headroom</span>
                <span>10 days left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attributed Revenue */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
                  aria-hidden="true"
                >
                  <TrendingUp className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Attributed Revenue</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                3.39x Blended ROAS
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$84,200.00</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Direct ad touch attribution</p>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Period growth:</span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  +$18,450.00 (+28.1%)
                </span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Target ROAS: 2.80x (exceeded)</p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Acquisition Cost (CAC) */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="border-border bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Target className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Customer Acquisition Cost</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                <TrendingDown className="size-3" />
                <span>-$6.20 vs last month</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$48.50</span>
                <span className="text-muted-foreground text-xs">/ customer</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Blended across all 4 channels</p>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target CAC ceiling:</span>
                <span className="text-foreground font-semibold tabular-nums">$55.00 max</span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                11.8% below budget cap
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Conversions */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className="border-border bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Users className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Total Conversions</CardTitle>
              </div>
              <Badge wrap variant="outline" className="text-xs font-normal tabular-nums">
                +64 vs Jul
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">512</span>
                <span className="text-foreground text-sm font-semibold">Paid Customers</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">Avg order value $164.45</p>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Blended Conversion Rate:</span>
                <span className="text-foreground font-semibold tabular-nums">14.2%</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Organic lift multiplier: 1.18x</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance Comparison Table */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Channel Performance Comparison</CardTitle>
              <CardDescription>
                Unit economics, click-through rates, acquisition volumes, and return on ad spend across channels.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="w-fit text-xs font-normal tabular-nums">
              4 channels active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Channel & Campaigns</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Impressions & Clicks (CTR)</TableHead>
                  <TableHead className="text-right">CPC & CPA</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">Conversions & Rev</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => {
                  const Icon = channel.icon
                  const spendNum = parseFloat(channel.spend.replace(/[$,]/g, ''))
                  const pct = ((spendNum / 24850) * 100).toFixed(1)
                  return (
                    <TableRow key={channel.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs',
                              channel.iconClass,
                            )}
                            aria-hidden="true"
                          >
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <div className="text-foreground text-sm font-semibold">{channel.name}</div>
                            <div className="text-muted-foreground text-xs tabular-nums">
                              {channel.campaignCount} active campaigns
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-foreground text-sm font-semibold tabular-nums">{channel.spend}</div>
                        <div className="text-muted-foreground text-xs tabular-nums">{pct}% of total</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-foreground text-xs font-medium tabular-nums">
                          {channel.impressions} imp
                        </div>
                        <div className="text-muted-foreground text-xs tabular-nums">
                          {channel.clicks} clicks ({channel.ctr})
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-foreground text-xs font-semibold tabular-nums">{channel.cpc} CPC</div>
                        <div className="text-muted-foreground text-xs tabular-nums">{channel.cpa} CPA</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs font-bold tabular-nums',
                            channel.roasStatus === 'high' &&
                              'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                            channel.roasStatus === 'medium' &&
                              'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                            channel.roasStatus === 'low' &&
                              'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                          )}
                        >
                          {channel.roas} ROAS
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-foreground text-xs font-bold tabular-nums">{channel.revenue}</div>
                        <div className="text-muted-foreground text-xs tabular-nums">
                          {channel.conversions} conversions
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-muted-foreground text-xs font-medium">
                            {channel.active ? 'Active' : 'Paused'}
                          </span>
                          <Switch
                            checked={channel.active}
                            onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                            aria-label={`Toggle status for ${channel.name}`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section: Top Performing Campaigns & Budget Allocation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Performing Campaigns Breakdown Card */}
        <Card className="shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Performing Campaigns</CardTitle>
              <Badge wrap variant="outline" className="gap-1 text-xs">
                <Sparkles className="size-3 text-amber-500" />
                <span>Highest ROAS</span>
              </Badge>
            </div>
            <CardDescription>
              Ad creatives and targeting sets driving highest attribution revenue and ROAS.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border-border bg-muted/30 hover:bg-muted/60 flex flex-col gap-3 rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <Badge
                      wrap
                      variant={campaign.rank === 1 ? 'default' : 'secondary'}
                      className="flex size-6 shrink-0 items-center justify-center rounded-full p-0 text-xs font-bold tabular-nums"
                    >
                      #{campaign.rank}
                    </Badge>
                    <div className="space-y-0.5">
                      <h4 className="text-foreground text-sm font-semibold">{campaign.name}</h4>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge wrap variant="outline" className="text-xs font-normal">
                          {campaign.channel}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{campaign.targetNiche}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    wrap
                    variant="outline"
                    className="shrink-0 border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
                  >
                    {campaign.roas} ROAS
                  </Badge>
                </div>

                <div className="border-border/60 grid grid-cols-1 gap-2 border-t pt-2 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">Spend:</span>
                    <p className="text-foreground font-semibold tabular-nums">{campaign.spend}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Attributed Rev:</span>
                    <p className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                      {campaign.revenue}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-muted-foreground">Unit CPA:</span>
                    <p className="text-foreground font-semibold tabular-nums">{campaign.cpa}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget Allocation & Channel Efficiency Card */}
        <Card className="shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Budget Allocation & Guardrails</CardTitle>
              <Badge wrap variant="outline" className="text-xs font-normal">
                Automated Pacing
              </Badge>
            </div>
            <CardDescription>
              Live capital distribution by ad channel with automated spend-shift recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Spend pacing summary box */}
            <div className="border-border bg-muted/40 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 rounded-lg border p-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Total Deployed Spend
                </p>
                <p className="text-foreground text-3xl font-bold tracking-tight tabular-nums">$24,850.00</p>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-xs">
                  Budget Cap: <strong className="text-foreground font-semibold tabular-nums">$30,000.00</strong>
                </span>
                <p className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  $5,150.00 (17.2%) remaining
                </p>
              </div>
            </div>

            {/* Channel Share Progress Bars */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Google Search Ads (45.1%)</span>
                  <span className="text-foreground font-semibold tabular-nums">$11,200.00 / 4.2x ROAS</span>
                </div>
                <Progress value={45.1} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-blue-600" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Meta / Instagram Ads (30.8%)</span>
                  <span className="text-foreground font-semibold tabular-nums">$7,650.00 / 3.1x ROAS</span>
                </div>
                <Progress value={30.8} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-indigo-600" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">LinkedIn Sponsored (15.3%)</span>
                  <span className="text-foreground font-semibold tabular-nums">$3,800.00 / 2.4x ROAS</span>
                </div>
                <Progress value={15.3} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-sky-600" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium">Twitter / X Ads (8.8%)</span>
                  <span className="text-muted-foreground font-semibold tabular-nums">$2,200.00 / 1.8x ROAS</span>
                </div>
                <Progress value={8.8} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-zinc-500" />
              </div>
            </div>

            <Separator />

            {/* Growth Strategy Note */}
            <div className="border-border/80 bg-muted/20 flex items-start gap-3 rounded-lg border p-3">
              <Sparkles className="text-primary mt-0.5 size-4 shrink-0" />
              <div className="space-y-1">
                <h5 className="text-foreground text-xs font-semibold">Growth Optimization Insight</h5>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Google Search & Meta campaigns are outperforming blended ROAS target (+0.59x). Pausing Twitter / X Ads
                  saves $73.30/day to reallocate into the highest-converting Q3 Retargeting set.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdSpendRoiDashboard
