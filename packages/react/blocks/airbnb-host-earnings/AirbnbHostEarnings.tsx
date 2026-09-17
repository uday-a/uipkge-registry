'use client'

import * as React from 'react'
import {
  Building2,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Home,
  Landmark,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ReservationPayout {
  id: string
  confirmationCode: string
  guest: {
    name: string
    avatar: string
    initials: string
  }
  property: string
  location: string
  datesBooked: string
  nightsCount: number
  nightlyRate: string
  cleaningFee: string
  hostServiceFee: string
  netPayout: string
  status: 'paid' | 'processing'
}

const reservations: ReservationPayout[] = [
  {
    id: 'res-1',
    confirmationCode: 'HM-8924A',
    guest: {
      name: 'Sophia Martinez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      initials: 'SM',
    },
    property: 'Malibu Beachfront Villa',
    location: 'Malibu, CA',
    datesBooked: 'Aug 18-24 (6 nights)',
    nightsCount: 6,
    nightlyRate: '$650.00',
    cleaningFee: '$350.00',
    hostServiceFee: '-$127.50',
    netPayout: '$4,122.50',
    status: 'paid',
  },
  {
    id: 'res-2',
    confirmationCode: 'HM-8919B',
    guest: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'DK',
    },
    property: 'Aspen Luxury Chalet',
    location: 'Aspen, CO',
    datesBooked: 'Aug 12-16 (4 nights)',
    nightsCount: 4,
    nightlyRate: '$720.00',
    cleaningFee: '$250.00',
    hostServiceFee: '-$94.00',
    netPayout: '$3,036.00',
    status: 'paid',
  },
  {
    id: 'res-3',
    confirmationCode: 'HM-8912C',
    guest: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      initials: 'ER',
    },
    property: 'Maui Oceanfront Suite',
    location: 'Maui, HI',
    datesBooked: 'Aug 04-10 (6 nights)',
    nightsCount: 6,
    nightlyRate: '$580.00',
    cleaningFee: '$300.00',
    hostServiceFee: '-$113.40',
    netPayout: '$3,666.60',
    status: 'paid',
  },
  {
    id: 'res-4',
    confirmationCode: 'HM-8931D',
    guest: {
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      initials: 'MV',
    },
    property: 'Malibu Beachfront Villa',
    location: 'Malibu, CA',
    datesBooked: 'Aug 25-31 (6 nights)',
    nightsCount: 6,
    nightlyRate: '$690.00',
    cleaningFee: '$350.00',
    hostServiceFee: '-$134.70',
    netPayout: '$4,355.30',
    status: 'processing',
  },
]

export function AirbnbHostEarnings({ className }: { className?: string }) {
  const [selectedProperty, setSelectedProperty] = React.useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('this-month')
  const [isPricingApplied, setIsPricingApplied] = React.useState(false)

  return (
    <div data-slot="airbnb-host-earnings" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Host Earnings &amp; Revenue Analytics
          </h1>
          <p className="text-muted-foreground text-sm">
            Short-term rental portfolio revenue, occupancy yield metrics, and automated payout disbursement schedule.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48 text-xs" aria-label="Select property">
              <Home className="text-muted-foreground mr-1.5 size-3.5" />
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties (3)</SelectItem>
              <SelectItem value="malibu">Malibu Beachfront Villa</SelectItem>
              <SelectItem value="aspen">Aspen Luxury Chalet</SelectItem>
              <SelectItem value="maui">Maui Oceanfront Suite</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-52 text-xs" aria-label="Select timeframe">
              <Calendar className="text-muted-foreground mr-1.5 size-3.5" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month · August 2026</SelectItem>
              <SelectItem value="last-month">Last Month · July 2026</SelectItem>
              <SelectItem value="q3">Last 90 Days (Peak Summer)</SelectItem>
              <SelectItem value="ytd">Year to Date · 2026</SelectItem>
            </SelectContent>
          </Select>

          <Button aria-label="Download attachment" variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            <span>Export Tax 1099 CSV</span>
          </Button>
        </div>
      </div>

      {/* 4 Primary Host KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Earnings */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
                  aria-hidden="true"
                >
                  <DollarSign className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Gross Earnings</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                +14.2% vs last month
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$18,450.00</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Net after 3% fee: $17,896.50</p>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Projected month-end:</span>
                <span className="text-foreground font-semibold tabular-nums">$21,400.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="border-border bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <CalendarCheck className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Occupancy Rate</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                +6.2% vs area avg
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">88.5%</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">27 of 31 nights booked</p>
            </div>
            <div className="space-y-1.5">
              <Progress
                value={88.5}
                className="h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-600 dark:[&_[data-slot=progress-indicator]]:bg-emerald-500"
              />
              <div className="text-muted-foreground flex items-center justify-between text-xs tabular-nums">
                <span>4 nights open</span>
                <span>2 instant holds</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Daily Rate (ADR) */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="border-border bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <TrendingUp className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">Average Daily Rate (ADR)</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                +$45.00 vs baseline
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$683.33</span>
                <span className="text-muted-foreground text-xs font-normal">/ night</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs">Blended across active portfolio</p>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Weekend surge rate:</span>
                <span className="text-foreground font-semibold tabular-nums">$820.00 / night</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RevPAR (Revenue per Available Room) */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className="border-border bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                  aria-hidden="true"
                >
                  <Building2 className="size-4" />
                </div>
                <CardTitle className="text-muted-foreground text-sm font-medium">RevPAR (Yield / Unit)</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                +18.4% YoY
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$604.75</span>
              </div>
              <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">Market benchmark: $512.00</p>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Regional yield index:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Top 5% in submarket</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Grid: Upcoming Payouts Schedule & Dynamic Pricing Suggestions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Payouts Schedule Card */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Upcoming Payouts Schedule</CardTitle>
                <CardDescription>
                  Automated direct deposits sent to your verified checking account 24 hours post check-in.
                </CardDescription>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="mr-1 size-3" />
                Auto-Transfer Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Next Payout Focus Box */}
            <div className="border-border bg-muted/40 rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Landmark className="size-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Next Payout
                    </span>
                    <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$4,250.00</div>
                    <p className="text-foreground text-xs font-medium">
                      Direct Deposit to Chase •••• 4892 ·{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Arriving Aug 24</span>
                    </p>
                  </div>
                </div>
                <Badge wrap variant="secondary" className="text-xs">
                  Scheduled
                </Badge>
              </div>
            </div>

            {/* Completed YTD & Bank Info Row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="border-border bg-card rounded-lg border p-3.5 shadow-xs">
                <span className="text-muted-foreground text-xs font-medium">Completed payouts YTD</span>
                <div className="text-foreground mt-1 text-xl font-bold tracking-tight tabular-nums">$92,400.00</div>
                <p className="text-muted-foreground mt-0.5 text-xs">18 completed disbursement cycles</p>
              </div>
              <div className="border-border bg-card rounded-lg border p-3.5 shadow-xs">
                <span className="text-muted-foreground text-xs font-medium">Settlement routing</span>
                <div className="text-foreground mt-1 text-sm font-semibold">JPMorgan Chase Bank</div>
                <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">Routing: 021000021 · $0 held</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-muted-foreground text-xs">
                Payouts release automatically 24h after each guest check-in.
              </p>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Building2 className="size-3.5" />
                <span>Manage Bank Account</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Pricing Suggestions Card */}
        <Card className="flex flex-col justify-between shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Dynamic Pricing Suggestions</CardTitle>
                <CardDescription>
                  Machine-learning demand forecasts and local holiday surge pricing recommendations.
                </CardDescription>
              </div>
              <Badge
                wrap
                variant="outline"
                className="gap-1 border-amber-500/20 bg-amber-500/10 text-xs font-semibold text-amber-600 dark:text-amber-400"
              >
                <Sparkles className="size-3" />
                Smart Rates
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Suggestion Banner Box */}
            <div className="border-border/80 bg-muted/30 hover:bg-muted/50 rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 shadow-xs dark:text-amber-400">
                  <Sparkles className="size-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-foreground text-sm font-semibold">
                      High demand weekend Sep 4-7: increase ADR by +15%
                    </h4>
                    <Badge wrap variant="outline" className="text-xs font-medium">
                      Labor Day Peak
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Regional guest search volume is up +48% in Malibu and Maui. Raising base rate from $680.00 to
                    $782.00/night captures peak holiday yield.
                  </p>

                  <div className="border-border/60 grid grid-cols-1 gap-2 border-t pt-2.5 text-xs sm:grid-cols-3">
                    <div>
                      <span className="text-muted-foreground">Current ADR:</span>
                      <p className="text-foreground font-semibold tabular-nums">$680.00 / night</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suggested ADR:</span>
                      <p className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        $782.00 (+15%)
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-muted-foreground">Est. Extra Rev:</span>
                      <p className="text-foreground font-semibold tabular-nums">+$408.00 (4 nights)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Applied State / Action Buttons */}
            {isPricingApplied ? (
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs">
                <div className="flex flex-wrap items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Suggested +15% rate applied for Sep 4-7 ($782.00/night).</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setIsPricingApplied(false)}>
                  Undo
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-muted-foreground text-xs">Algorithm confidence score: 96%</span>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Customize Rules
                  </Button>
                  <Button size="sm" className="gap-1.5 text-xs" onClick={() => setIsPricingApplied(true)}>
                    <Sparkles className="size-3.5" />
                    <span>Apply Suggested Rate</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Breakdown Table Card */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Monthly Revenue Breakdown</CardTitle>
              <CardDescription>
                Itemized guest reservations, cleaning fee payouts, platform service commissions, and net disbursements.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="w-fit text-xs font-normal tabular-nums">
              4 reservations · August 2026
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Guest &amp; Reservation</TableHead>
                  <TableHead className="min-w-[160px]">Property Booked</TableHead>
                  <TableHead>Dates Booked</TableHead>
                  <TableHead className="text-right">Nightly Rate</TableHead>
                  <TableHead className="text-right">Cleaning Fee</TableHead>
                  <TableHead className="text-right">Host Fee (3%)</TableHead>
                  <TableHead className="text-right">Net Payout</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((res) => (
                  <TableRow key={res.id} className="hover:bg-muted/50">
                    {/* Guest Column */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm" className="shrink-0">
                          <AvatarImage src={res.guest.avatar} alt={res.guest.name} />
                          <AvatarFallback className="text-xs font-medium">{res.guest.initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <div className="text-foreground text-sm font-semibold">{res.guest.name}</div>
                          <div className="text-muted-foreground font-mono text-xs tabular-nums">
                            {res.confirmationCode}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Property Booked */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="text-foreground text-sm font-medium">{res.property}</div>
                        <div className="text-muted-foreground text-xs">{res.location}</div>
                      </div>
                    </TableCell>

                    {/* Dates Booked */}
                    <TableCell>
                      <div className="text-foreground text-xs font-medium tabular-nums">{res.datesBooked}</div>
                    </TableCell>

                    {/* Nightly Rate */}
                    <TableCell className="text-right">
                      <div className="text-foreground text-xs font-semibold tabular-nums">{res.nightlyRate}</div>
                      <div className="text-muted-foreground text-xs tabular-nums">{res.nightsCount} nights</div>
                    </TableCell>

                    {/* Cleaning Fee */}
                    <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                      {res.cleaningFee}
                    </TableCell>

                    {/* Host Service Fee */}
                    <TableCell className="text-muted-foreground text-right text-xs tabular-nums">
                      {res.hostServiceFee}
                    </TableCell>

                    {/* Net Payout */}
                    <TableCell className="text-foreground text-right text-sm font-bold tabular-nums">
                      {res.netPayout}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs font-semibold tabular-nums',
                          res.status === 'paid' &&
                            'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                          res.status === 'processing' &&
                            'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400',
                        )}
                      >
                        {res.status === 'paid' ? (
                          <span className="flex items-center gap-1">
                            <Check className="size-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            Processing
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AirbnbHostEarnings
