'use client'

import * as React from 'react'
import {
  Award,
  Building2,
  Calculator,
  Check,
  FileSpreadsheet,
  Info,
  Layers,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface CapTableOwnershipSummaryProps {
  initialInvestment?: number
  initialPreMoney?: number
  className?: string
}

export interface Shareholder {
  id: string
  name: string
  role: string
  avatar: string
  shareClass: 'Common Stock' | 'Series Seed Preferred' | 'ISO Option Pool'
  shares: number
  ownershipPct: number
  equityValue: number
  vestingDetail: string
  vestedMonths: number
  totalMonths: number
  isVestedComplete: boolean
  grantDate: string
  liquidationPref?: string
}

const initialShareholders: Shareholder[] = [
  {
    id: 'sh-1',
    name: 'Elena Rostova',
    role: 'Co-Founder & CEO',
    avatar: 'ER',
    shareClass: 'Common Stock',
    shares: 3500000,
    ownershipPct: 35.0,
    equityValue: 15750000,
    vestingDetail: '48-Month Vesting · 24/48 Months Vested',
    vestedMonths: 24,
    totalMonths: 48,
    isVestedComplete: false,
    grantDate: 'Feb 15, 2024 · 1-yr Cliff (Satisfied)',
  },
  {
    id: 'sh-2',
    name: 'Marcus Vance',
    role: 'Co-Founder & CTO',
    avatar: 'MV',
    shareClass: 'Common Stock',
    shares: 2500000,
    ownershipPct: 25.0,
    equityValue: 11250000,
    vestingDetail: '48-Month Vesting · 24/48 Months Vested',
    vestedMonths: 24,
    totalMonths: 48,
    isVestedComplete: false,
    grantDate: 'Feb 15, 2024 · 1-yr Cliff (Satisfied)',
  },
  {
    id: 'sh-3',
    name: 'Founders Fund / Seed Syndicate',
    role: 'Lead Seed Investor',
    avatar: 'FF',
    shareClass: 'Series Seed Preferred',
    shares: 1500000,
    ownershipPct: 15.0,
    equityValue: 6750000,
    vestingDetail: 'Fully Vested (100%) · 1.0x Non-Participating',
    vestedMonths: 48,
    totalMonths: 48,
    isVestedComplete: true,
    grantDate: 'Aug 10, 2024 · Board Seat (1)',
    liquidationPref: '1.0x Pref ($6.75M)',
  },
  {
    id: 'sh-4',
    name: 'Sequoia Scout Seed SPV',
    role: 'Seed Co-Investor',
    avatar: 'SQ',
    shareClass: 'Series Seed Preferred',
    shares: 1000000,
    ownershipPct: 10.0,
    equityValue: 4500000,
    vestingDetail: 'Fully Vested (100%) · 1.0x Non-Participating',
    vestedMonths: 48,
    totalMonths: 48,
    isVestedComplete: true,
    grantDate: 'Aug 10, 2024 · Pro-Rata Rights',
    liquidationPref: '1.0x Pref ($4.50M)',
  },
  {
    id: 'sh-5',
    name: 'Unallocated Employee Option Pool',
    role: '2024 Equity Incentive Plan (EIP)',
    avatar: 'EP',
    shareClass: 'ISO Option Pool',
    shares: 1500000,
    ownershipPct: 15.0,
    equityValue: 6750000,
    vestingDetail: 'Authorized Pool · Available for Future Key Hires',
    vestedMonths: 0,
    totalMonths: 48,
    isVestedComplete: false,
    grantDate: 'Board Authorized · Dec 01, 2024',
  },
]

export function CapTableOwnershipSummary({
  initialInvestment = 10000000,
  initialPreMoney = 50000000,
  className,
}: CapTableOwnershipSummaryProps) {
  const currentSharePrice = 4.5
  const currentTotalShares = 10000000

  const [shareholders, setShareholders] = React.useState<Shareholder[]>(initialShareholders)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedClassFilter, setSelectedClassFilter] = React.useState<
    'All' | 'Common Stock' | 'Series Seed Preferred' | 'ISO Option Pool'
  >('All')

  // Export Cap Table feedback state
  const [isExporting, setIsExporting] = React.useState(false)
  const [exportSuccess, setExportSuccess] = React.useState(false)

  const handleExportCapTable = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExportSuccess(true)
      setTimeout(() => {
        setExportSuccess(false)
      }, 2500)
    }, 1000)
  }

  // Issue Grant Modal State
  const [isGrantDialogOpen, setIsGrantDialogOpen] = React.useState(false)
  const [grantSuccessMessage, setGrantSuccessMessage] = React.useState(false)
  const [grantName, setGrantName] = React.useState('')
  const [grantRole, setGrantRole] = React.useState('')
  const [grantShares, setGrantShares] = React.useState(50000)
  const [grantClass, setGrantClass] = React.useState<'ISO Options' | 'NSO Options' | 'Restricted Stock'>('ISO Options')
  const grantVesting = '4-Year Vesting · 1-Year Cliff (25%), then Monthly'

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!grantName.trim() || grantShares <= 0) return

    setGrantSuccessMessage(true)
    setTimeout(() => {
      setGrantSuccessMessage(false)
      setIsGrantDialogOpen(false)
      setGrantName('')
      setGrantRole('')
      setGrantShares(50000)
    }, 1500)
  }

  // Filtered Shareholders
  const filteredShareholders = React.useMemo(() => {
    return shareholders.filter((sh) => {
      if (selectedClassFilter !== 'All' && sh.shareClass !== selectedClassFilter) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = sh.name.toLowerCase().includes(q)
        const matchRole = sh.role.toLowerCase().includes(q)
        const matchClass = sh.shareClass.toLowerCase().includes(q)
        return matchName || matchRole || matchClass
      }
      return true
    })
  }, [shareholders, selectedClassFilter, searchQuery])

  // Round Modeling Simulator State
  const [simPreMoney, setSimPreMoney] = React.useState(initialPreMoney)
  const [simInvestment, setSimInvestment] = React.useState(initialInvestment)

  const setPresetScenario = (preMoney: number, investment: number) => {
    setSimPreMoney(preMoney)
    setSimInvestment(investment)
  }

  // Dynamic Round Calculations
  const simPostMoney = React.useMemo(() => simPreMoney + simInvestment, [simPreMoney, simInvestment])
  const simNewSharePrice = React.useMemo(() => {
    if (currentTotalShares <= 0) return 0
    return simPreMoney / currentTotalShares
  }, [simPreMoney, currentTotalShares])

  const simNewSharesIssued = React.useMemo(() => {
    if (simNewSharePrice <= 0) return 0
    return Math.round(simInvestment / simNewSharePrice)
  }, [simInvestment, simNewSharePrice])

  const simTotalPostShares = React.useMemo(
    () => currentTotalShares + simNewSharesIssued,
    [currentTotalShares, simNewSharesIssued],
  )

  const simFounderShares = 6000000
  const simSeedShares = 2500000
  const simOptionShares = 1500000

  const simFounderPct = React.useMemo(() => (simFounderShares / simTotalPostShares) * 100, [simTotalPostShares])
  const simSeedPct = React.useMemo(() => (simSeedShares / simTotalPostShares) * 100, [simTotalPostShares])
  const simOptionPct = React.useMemo(() => (simOptionShares / simTotalPostShares) * 100, [simTotalPostShares])
  const simNewInvestorPct = React.useMemo(
    () => (simNewSharesIssued / simTotalPostShares) * 100,
    [simNewSharesIssued, simTotalPostShares],
  )

  const simFounderValue = React.useMemo(() => (simFounderPct / 100) * simPostMoney, [simFounderPct, simPostMoney])
  const simSeedValue = React.useMemo(() => (simSeedPct / 100) * simPostMoney, [simSeedPct, simPostMoney])
  const simOptionValue = React.useMemo(() => (simOptionPct / 100) * simPostMoney, [simOptionPct, simPostMoney])

  const formatCurrency = (val: number): string => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatNumber = (val: number): string => {
    return val.toLocaleString('en-US')
  }

  const formatPercent = (val: number, decimals = 1): string => {
    return `${val.toFixed(decimals)}%`
  }

  return (
    <div data-slot="cap-table-ownership-summary" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Top Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              aria-hidden="true"
            >
              <Building2 className="size-5" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                Capitalization Table &amp; Equity Ownership
              </h1>
            </div>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-normal text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              Audited · Series Seed
            </Badge>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-muted/70 text-foreground border-border/80 rounded border px-2 py-0.5 font-medium">
              UIPKGE Technologies Inc. · Delaware C-Corp
            </span>
            <span>EIN: 93-8472910</span>
            <span className="inline-flex items-center gap-1 font-mono">
              <ShieldCheck className="text-primary size-3.5" aria-hidden="true" />
              409A FMV: ${currentSharePrice.toFixed(2)}/share
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 shadow-xs transition-colors"
            disabled={isExporting}
            onClick={handleExportCapTable}
          >
            {isExporting ? (
              <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
            ) : exportSuccess ? (
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <FileSpreadsheet className="size-4" aria-hidden="true" />
            )}
            <span>
              {exportSuccess ? 'Cap Table Exported!' : isExporting ? 'Exporting...' : 'Export Cap Table (Excel)'}
            </span>
          </Button>

          <Button size="sm" className="gap-1.5 shadow-xs" onClick={() => setIsGrantDialogOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Issue Equity Grant
          </Button>
        </div>
      </header>

      {/* Issue Equity Grant Dialog Modal Overlay */}
      {isGrantDialogOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="grant-dialog-title-react"
        >
          <Card className="border-border w-full max-w-lg shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-x-2">
                <CardTitle id="grant-dialog-title-react" className="flex items-center gap-2 text-base font-semibold">
                  <Award className="text-primary size-5" />
                  Issue New Equity Option Grant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground size-7"
                  aria-label="Close dialog"
                  onClick={() => setIsGrantDialogOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <CardDescription className="text-xs">
                Authorize and draft an option grant under the 2024 Equity Incentive Plan (EIP).
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {grantSuccessMessage ? (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                  <Check className="mx-auto size-6 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-foreground mt-2 text-sm font-semibold">Option Grant Issued &amp; Drafted!</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Sent to Board of Directors for electronic consent signature.
                  </p>
                </div>
              ) : (
                <form className="space-y-3.5" onSubmit={handleCreateGrant}>
                  <div className="space-y-1.5">
                    <label htmlFor="grantee-name-react" className="text-foreground text-xs font-medium">
                      Grantee Legal Name
                    </label>
                    <Input
                      id="grantee-name-react"
                      value={grantName}
                      onChange={(e) => setGrantName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Chen"
                      required
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="grantee-role-react" className="text-foreground text-xs font-medium">
                        Role / Title
                      </label>
                      <Input
                        id="grantee-role-react"
                        value={grantRole}
                        onChange={(e) => setGrantRole(e.target.value)}
                        placeholder="e.g. Principal AI Scientist"
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="grant-quantity-react" className="text-foreground text-xs font-medium">
                        Number of Options / Shares
                      </label>
                      <Input
                        id="grant-quantity-react"
                        type="number"
                        min="1000"
                        step="1000"
                        value={grantShares}
                        onChange={(e) => setGrantShares(Number(e.target.value))}
                        required
                        className="h-9 font-mono text-xs tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-foreground text-xs font-medium">Equity Class</label>
                      <div className="border-border bg-muted/30 flex h-9 items-center justify-between rounded-md border px-3 text-xs">
                        <span className="font-medium">{grantClass}</span>
                        <Badge variant="outline" className="text-xs">
                          EIP-2024
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-foreground text-xs font-medium">Exercise Price (409A FMV)</label>
                      <div className="border-border bg-muted/30 flex h-9 items-center justify-between rounded-md border px-3 font-mono text-xs tabular-nums">
                        <span>${currentSharePrice.toFixed(2)} / share</span>
                        <span className="text-muted-foreground text-xs">Fair Market</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-medium">Standard Vesting Schedule</label>
                    <Input value={grantVesting} readOnly className="bg-muted/40 h-9 text-xs" />
                    <p className="text-muted-foreground text-xs">
                      25% vests at 12-month cliff; remaining 75% vests monthly in 36 equal installments.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsGrantDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" className="gap-1.5">
                      <Check className="size-4" />
                      Draft &amp; Issue Grant
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4 Capital Structure Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Fully Diluted Shares Card */}
        <Card className="border-border relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Total Fully Diluted Shares</CardTitle>
            <div className="bg-primary/10 text-primary rounded-md p-1.5">
              <Layers className="size-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">10,000,000</div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span>Authorized: 15,000,000</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">66.7% Issued</span>
            </div>
          </CardContent>
        </Card>

        {/* Founder Common Stock Card */}
        <Card className="border-border relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Founder Common Stock</CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
              <Users className="size-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">6,000,000</span>
              <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">60.0%</span>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span>2 Co-Founders</span>
              <span className="font-mono tabular-nums">$27,000,000.00</span>
            </div>
          </CardContent>
        </Card>

        {/* Series Seed Preferred Card */}
        <Card className="border-border relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Series Seed Preferred</CardTitle>
            <div className="rounded-md bg-purple-500/10 p-1.5 text-purple-600 dark:text-purple-400">
              <TrendingUp className="size-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">2,500,000</span>
              <span className="font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">25.0%</span>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span>2 Seed Investors · 1.0x Pref</span>
              <span className="font-mono tabular-nums">$11,250,000.00</span>
            </div>
          </CardContent>
        </Card>

        {/* Unallocated Option Pool Card */}
        <Card className="border-border relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Unallocated Option Pool</CardTitle>
            <div className="rounded-md bg-sky-500/10 p-1.5 text-sky-600 dark:text-sky-400">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">1,500,000</span>
              <span className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">15.0%</span>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span>2024 EIP Pool</span>
              <span className="font-mono tabular-nums">$6,750,000.00</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Valuation Hero & Visual Stacked Ownership Bar Card */}
      <Card className="border-border overflow-hidden shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardDescription className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Current Post-Money Valuation
              </CardDescription>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  $45,000,000.00
                </span>
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  <TrendingUp className="size-3.5" aria-hidden="true" />
                  Seed Round Closed
                  <span className="text-muted-foreground ml-0.5 font-normal">($4.50/share)</span>
                </div>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>Cap Table Reconciled</span>
              </div>
              <span className="font-mono">10,000,000 Total Units</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Multi-segment Stacked Ownership Bar */}
          <div className="space-y-2">
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span className="text-foreground font-medium">Fully Diluted Equity Distribution</span>
              <span className="tabular-nums">100.0% Allocation</span>
            </div>

            <div className="bg-muted/60 border-border/50 flex h-4 w-full gap-0.5 overflow-hidden rounded-full border p-0.5">
              {/* Founders 60% Emerald */}
              <div
                style={{ width: '60%' }}
                className="h-full rounded-l-full bg-emerald-500 transition-all duration-300 hover:opacity-90"
                title="Founders (Common Stock): 60.0% · 6,000,000 Shares"
              />
              {/* Seed Investors 25% Purple */}
              <div
                style={{ width: '25%' }}
                className="h-full bg-purple-500 transition-all duration-300 hover:opacity-90"
                title="Seed Investors (Preferred): 25.0% · 2,500,000 Shares"
              />
              {/* Option Pool 15% Blue */}
              <div
                style={{ width: '15%' }}
                className="h-full rounded-r-full bg-sky-500 transition-all duration-300 hover:opacity-90"
                title="Unallocated Option Pool: 15.0% · 1,500,000 Shares"
              />
            </div>

            {/* Stacked Bar Legend */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              <div className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-x-2 rounded-md border p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-emerald-500 shadow-xs" aria-hidden="true" />
                  <div>
                    <div className="text-foreground font-medium">Founders (Common)</div>
                    <div className="text-muted-foreground font-mono tabular-nums">6,000,000 shares</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground font-bold tabular-nums">60.0%</div>
                  <div className="text-muted-foreground font-mono tabular-nums">$27,000,000.00</div>
                </div>
              </div>

              <div className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-x-2 rounded-md border p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-purple-500 shadow-xs" aria-hidden="true" />
                  <div>
                    <div className="text-foreground font-medium">Seed Investors (Preferred)</div>
                    <div className="text-muted-foreground font-mono tabular-nums">2,500,000 shares</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground font-bold tabular-nums">25.0%</div>
                  <div className="text-muted-foreground font-mono tabular-nums">$11,250,000.00</div>
                </div>
              </div>

              <div className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-x-2 rounded-md border p-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full bg-sky-500 shadow-xs" aria-hidden="true" />
                  <div>
                    <div className="text-foreground font-medium">Employee Option Pool</div>
                    <div className="text-muted-foreground font-mono tabular-nums">1,500,000 shares</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-foreground font-bold tabular-nums">15.0%</div>
                  <div className="text-muted-foreground font-mono tabular-nums">$6,750,000.00</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shareholder Breakdown Table Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-border/60 border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-foreground text-base font-semibold">
                Shareholder &amp; Equity Register
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-0.5 text-xs">
                Detailed registry of individual grants, share classes, fully diluted ownership, and vesting timelines.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-56">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shareholder or role..."
                  className="h-8 pl-8 text-xs"
                />
              </div>

              {/* Share Class Filter Buttons */}
              <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedClassFilter === 'All'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedClassFilter('All')}
                >
                  All (5)
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedClassFilter === 'Common Stock'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedClassFilter('Common Stock')}
                >
                  Common (2)
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedClassFilter === 'Series Seed Preferred'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedClassFilter('Series Seed Preferred')}
                >
                  Preferred (2)
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedClassFilter === 'ISO Option Pool'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedClassFilter('ISO Option Pool')}
                >
                  Pool (1)
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[260px] pl-6 text-xs font-medium">Shareholder / Entity</TableHead>
                  <TableHead className="w-[180px] text-xs font-medium">Share Class</TableHead>
                  <TableHead className="text-right text-xs font-medium">Shares Owned</TableHead>
                  <TableHead className="text-right text-xs font-medium">Fully Diluted %</TableHead>
                  <TableHead className="text-right text-xs font-medium">Total Equity Value</TableHead>
                  <TableHead className="min-w-[240px] pr-6 text-xs font-medium">Vesting &amp; Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShareholders.map((sh) => (
                  <TableRow key={sh.id} className="hover:bg-muted/30 transition-colors">
                    {/* Shareholder Name & Role */}
                    <TableCell className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="border-border/80 size-9 border shadow-xs">
                          <AvatarFallback
                            className={cn(
                              'text-xs font-bold',
                              sh.shareClass === 'Common Stock'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : sh.shareClass === 'Series Seed Preferred'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                  : 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
                            )}
                          >
                            {
                              {
                                'Common Stock': sh.avatar,
                                'Series Seed Preferred': sh.avatar,
                                'ISO Option Pool': sh.avatar,
                              }[sh.shareClass]
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-foreground truncate text-xs font-semibold">{sh.name}</div>
                          <div className="text-muted-foreground truncate text-xs">{sh.role}</div>
                          <div className="text-muted-foreground/70 font-mono text-xs">{sh.grantDate}</div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Share Class Badge */}
                    <TableCell className="py-3.5">
                      {sh.shareClass === 'Common Stock' ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        >
                          Common Stock
                        </Badge>
                      ) : sh.shareClass === 'Series Seed Preferred' ? (
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-600 dark:text-purple-400"
                        >
                          Series Seed Preferred
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-sky-500/30 bg-sky-500/10 text-xs font-medium text-sky-600 dark:text-sky-400"
                        >
                          ISO Option Pool
                        </Badge>
                      )}
                    </TableCell>

                    {/* Shares Owned */}
                    <TableCell className="py-3.5 text-right">
                      <div className="text-foreground font-mono text-sm font-bold tabular-nums">
                        {
                          {
                            'Common Stock': formatNumber(sh.shares),
                            'Series Seed Preferred': formatNumber(sh.shares),
                            'ISO Option Pool': formatNumber(sh.shares),
                          }[sh.shareClass]
                        }
                      </div>
                      <div className="text-muted-foreground text-xs">Shares</div>
                    </TableCell>

                    {/* Fully Diluted Ownership Percentage */}
                    <TableCell className="py-3.5 text-right">
                      <div className="text-foreground font-mono text-sm font-semibold tabular-nums">
                        {formatPercent(sh.ownershipPct)}
                      </div>
                      <div className="text-muted-foreground text-xs">of 10,000,000</div>
                    </TableCell>

                    {/* Total Equity Value */}
                    <TableCell className="py-3.5 text-right">
                      <div className="text-foreground font-mono text-sm font-semibold tabular-nums">
                        {formatCurrency(sh.equityValue)}
                      </div>
                      <div className="text-muted-foreground text-xs">@ $4.50/share</div>
                    </TableCell>

                    {/* Vesting Status Progress */}
                    <TableCell className="py-3.5 pr-6">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs">
                          <span className="text-foreground font-medium">
                            {sh.isVestedComplete
                              ? '100% Vested'
                              : sh.vestedMonths > 0
                                ? `${Math.round((sh.vestedMonths / sh.totalMonths) * 100)}% Vested`
                                : 'Unallocated'}
                          </span>
                          <span className="text-muted-foreground font-mono tabular-nums">
                            {sh.vestedMonths}/{sh.totalMonths} mo
                          </span>
                        </div>

                        <div className="bg-muted/80 relative h-2 w-full overflow-hidden rounded-full">
                          <div
                            className={cn(
                              'h-full transition-all duration-300',
                              sh.isVestedComplete
                                ? 'bg-purple-500'
                                : sh.vestedMonths > 0
                                  ? 'bg-emerald-500'
                                  : 'bg-sky-500/40',
                            )}
                            style={{
                              width: `${sh.isVestedComplete ? 100 : (sh.vestedMonths / sh.totalMonths) * 100}%`,
                            }}
                          />
                        </div>

                        <div className="text-muted-foreground text-xs">{sh.vestingDetail}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Summary Bar */}
          <div className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-4 border-t px-6 py-3 text-xs">
            <div className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredShareholders.length}</span> of{' '}
              <span className="text-foreground font-semibold">5</span> cap table stakeholders
            </div>
            <div className="flex flex-wrap items-center gap-6 font-mono">
              <div>
                <span className="text-muted-foreground">Total Shares: </span>
                <span className="text-foreground font-bold tabular-nums">10,000,000</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Ownership: </span>
                <span className="text-foreground font-bold tabular-nums">100.0%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Valuation: </span>
                <span className="text-foreground font-bold tabular-nums">$45,000,000.00</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Round Modeling Simulator Card (Series A Dilution Simulator) */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Calculator className="size-4" aria-hidden="true" />
                </div>
                <CardTitle className="text-foreground text-base font-semibold">
                  Round Modeling Simulator (Series A Pro-Forma)
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-xs">
                Simulate Series A pre-money valuation and capital raised to preview diluted ownership percentages, new
                share price, and stakeholder equity value accretion.
              </CardDescription>
            </div>

            {/* Preset Scenario Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-medium"
                onClick={() => setPresetScenario(30000000, 5000000)}
              >
                $5M @ $30M Pre
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-medium"
                onClick={() => setPresetScenario(50000000, 10000000)}
              >
                $10M @ $50M Pre
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-medium"
                onClick={() => setPresetScenario(60000000, 15000000)}
              >
                $15M @ $60M Pre
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Simulator Inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Pre-Money Valuation Input */}
            <div className="bg-muted/30 border-border/80 space-y-2 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs">
                <label htmlFor="sim-pre-money-react" className="text-foreground font-semibold">
                  Series A Pre-Money Valuation
                </label>
                <span className="text-muted-foreground font-mono tabular-nums">
                  ${(simPreMoney / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="sim-pre-money-react"
                  type="number"
                  step="1000000"
                  min="10000000"
                  value={simPreMoney}
                  onChange={(e) => setSimPreMoney(Number(e.target.value) || 0)}
                  className="font-mono text-base font-bold tabular-nums"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Implies a share price of{' '}
                <strong className="text-foreground font-mono tabular-nums">
                  ${simNewSharePrice.toFixed(2)} / share
                </strong>{' '}
                (+{(((simNewSharePrice - currentSharePrice) / currentSharePrice) * 100).toFixed(1)}% step-up).
              </p>
            </div>

            {/* New Investment Raised Input */}
            <div className="bg-muted/30 border-border/80 space-y-2 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs">
                <label htmlFor="sim-investment-react" className="text-foreground font-semibold">
                  Series A Capital Raised
                </label>
                <span className="text-muted-foreground font-mono tabular-nums">
                  ${(simInvestment / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="sim-investment-react"
                  type="number"
                  step="1000000"
                  min="1000000"
                  value={simInvestment}
                  onChange={(e) => setSimInvestment(Number(e.target.value) || 0)}
                  className="font-mono text-base font-bold tabular-nums"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Issues{' '}
                <strong className="text-foreground font-mono tabular-nums">
                  {formatNumber(simNewSharesIssued)} new shares
                </strong>{' '}
                to Series A lead syndicate.
              </p>
            </div>
          </div>

          {/* Calculated Pro-Forma Summary Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="border-border/60 bg-muted/20 space-y-1 rounded-md border p-3">
              <div className="text-muted-foreground text-xs">Post-Money Valuation</div>
              <div className="text-foreground font-mono text-lg font-bold tabular-nums">
                {formatCurrency(simPostMoney)}
              </div>
              <div className="text-muted-foreground text-xs">Pre-Money + Investment</div>
            </div>

            <div className="border-border/60 bg-muted/20 space-y-1 rounded-md border p-3">
              <div className="text-muted-foreground text-xs">Series A Share Price</div>
              <div className="text-foreground font-mono text-lg font-bold tabular-nums">
                ${simNewSharePrice.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">
                vs ${currentSharePrice.toFixed(2)} Seed (+
                {(((simNewSharePrice - currentSharePrice) / currentSharePrice) * 100).toFixed(1)}%)
              </div>
            </div>

            <div className="border-border/60 bg-muted/20 space-y-1 rounded-md border p-3">
              <div className="text-muted-foreground text-xs">Total Diluted Shares</div>
              <div className="text-foreground font-mono text-lg font-bold tabular-nums">
                {formatNumber(simTotalPostShares)}
              </div>
              <div className="text-muted-foreground text-xs">+{formatNumber(simNewSharesIssued)} New Shares</div>
            </div>

            <div className="border-border/60 bg-muted/20 space-y-1 rounded-md border p-3">
              <div className="text-muted-foreground text-xs">Investor Dilution Rate</div>
              <div className="text-foreground font-mono text-lg font-bold text-amber-600 tabular-nums dark:text-amber-400">
                {formatPercent(simNewInvestorPct)}
              </div>
              <div className="text-muted-foreground text-xs">Effective Round Dilution</div>
            </div>
          </div>

          {/* Post-Round Dilution & Valuation Comparison Table */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs">
              <span className="text-foreground font-semibold">Post-Series A Ownership Comparison</span>
              <span className="text-muted-foreground">Pro-Forma Stakeholder Impact</span>
            </div>

            {/* Visual Comparison Bar */}
            <div className="space-y-1.5">
              <div className="bg-muted/60 border-border/50 flex h-4 w-full gap-0.5 overflow-hidden rounded-full border p-0.5">
                <div
                  style={{ width: `${simFounderPct}%` }}
                  className="h-full rounded-l-full bg-emerald-500 transition-all duration-300"
                  title={`Founders: ${simFounderPct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${simSeedPct}%` }}
                  className="h-full bg-purple-500 transition-all duration-300"
                  title={`Seed Investors: ${simSeedPct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${simOptionPct}%` }}
                  className="h-full bg-sky-500 transition-all duration-300"
                  title={`Option Pool: ${simOptionPct.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${simNewInvestorPct}%` }}
                  className="h-full rounded-r-full bg-amber-500 transition-all duration-300"
                  title={`Series A Investors: ${simNewInvestorPct.toFixed(1)}%`}
                />
              </div>
            </div>

            {/* Stakeholder Comparative Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Founders */}
              <div className="border-border/80 bg-card space-y-2 rounded-lg border p-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-x-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span className="text-foreground font-semibold">Founders</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    {formatPercent(simFounderPct)}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Dilution:</span>
                  <span className="font-mono text-red-600 tabular-nums dark:text-red-400">
                    60.0% &rarr; {formatPercent(simFounderPct)} (-{(60 - simFounderPct).toFixed(1)}%)
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Equity Value:</span>
                  <span className="text-foreground font-mono font-semibold tabular-nums">
                    {formatCurrency(simFounderValue)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Value Accretion:</span>
                  <span className="font-mono font-semibold tabular-nums">
                    +{formatCurrency(simFounderValue - 27000000)}
                  </span>
                </div>
              </div>

              {/* Seed Investors */}
              <div className="border-border/80 bg-card space-y-2 rounded-lg border p-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-x-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-purple-500" aria-hidden="true" />
                    <span className="text-foreground font-semibold">Seed Investors</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-purple-500/30 font-mono text-xs text-purple-600 dark:text-purple-400"
                  >
                    {formatPercent(simSeedPct)}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Dilution:</span>
                  <span className="font-mono text-red-600 tabular-nums dark:text-red-400">
                    25.0% &rarr; {formatPercent(simSeedPct)} (-{(25 - simSeedPct).toFixed(1)}%)
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Equity Value:</span>
                  <span className="text-foreground font-mono font-semibold tabular-nums">
                    {formatCurrency(simSeedValue)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Value Accretion:</span>
                  <span className="font-mono font-semibold tabular-nums">
                    +{formatCurrency(simSeedValue - 11250000)}
                  </span>
                </div>
              </div>

              {/* Option Pool */}
              <div className="border-border/80 bg-card space-y-2 rounded-lg border p-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-x-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sky-500" aria-hidden="true" />
                    <span className="text-foreground font-semibold">Option Pool</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-sky-500/30 font-mono text-xs text-sky-600 dark:text-sky-400"
                  >
                    {formatPercent(simOptionPct)}
                  </Badge>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Dilution:</span>
                  <span className="font-mono text-red-600 tabular-nums dark:text-red-400">
                    15.0% &rarr; {formatPercent(simOptionPct)} (-{(15 - simOptionPct).toFixed(1)}%)
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Equity Value:</span>
                  <span className="text-foreground font-mono font-semibold tabular-nums">
                    {formatCurrency(simOptionValue)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Value Accretion:</span>
                  <span className="font-mono font-semibold tabular-nums">
                    +{formatCurrency(simOptionValue - 6750000)}
                  </span>
                </div>
              </div>

              {/* New Series A Investors */}
              <div className="border-border/80 bg-card space-y-2 rounded-lg border p-3 text-xs shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-x-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
                    <span className="text-foreground font-semibold">Series A Syndicate</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 font-mono text-xs text-amber-600 dark:text-amber-400"
                  >
                    New Investor
                  </Badge>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>New Ownership:</span>
                  <span className="font-mono font-bold text-amber-600 tabular-nums dark:text-amber-400">
                    {formatPercent(simNewInvestorPct)}
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2">
                  <span>Shares Purchased:</span>
                  <span className="text-foreground font-mono font-semibold tabular-nums">
                    {formatNumber(simNewSharesIssued)}
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-2 text-xs">
                  <span>Capital Invested:</span>
                  <span className="text-foreground font-mono font-semibold tabular-nums">
                    {formatCurrency(simInvestment)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Banner Callout */}
          <div className="border-border/60 bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5 text-xs">
            <Info className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="text-muted-foreground space-y-1">
              <span className="text-foreground font-semibold">Round Dynamics Takeaway: </span>
              Raising <span className="text-foreground font-mono font-medium">{formatCurrency(simInvestment)}</span> at
              a <span className="text-foreground font-mono font-medium">{formatCurrency(simPreMoney)}</span> pre-money
              valuation generates a{' '}
              <span className="text-foreground font-mono font-medium">${simNewSharePrice.toFixed(2)}</span> share price.
              Although existing founders experience{' '}
              <span className="text-foreground font-mono font-medium">{(60 - simFounderPct).toFixed(1)}%</span>{' '}
              dilution, their net equity value increases by{' '}
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(simFounderValue - 27000000)}
              </span>{' '}
              (+{(((simFounderValue - 27000000) / 27000000) * 100).toFixed(1)}%) due to the valuation step-up.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CapTableOwnershipSummary
