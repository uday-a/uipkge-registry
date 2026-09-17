'use client'

import * as React from 'react'
import {
  ArrowUpRight,
  Check,
  Coins,
  Copy,
  Flame,
  Fuel,
  Lock,
  Percent,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Unlock,
  Wallet,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'

export interface DefiStakingYieldVaultProps extends React.HTMLAttributes<HTMLDivElement> {}

interface TokenOption {
  symbol: string
  name: string
  price: number
  balance: number
  apyBoost: number
  description: string
  iconColor: string
}

const tokenOptions: TokenOption[] = [
  {
    symbol: 'ETH',
    name: 'Native Ether',
    price: 3450.0,
    balance: 32.5,
    apyBoost: 0,
    description: 'Base Layer Staking',
    iconColor: '#627EEA',
  },
  {
    symbol: 'stETH',
    name: 'Lido Staked ETH',
    price: 3450.0,
    balance: 15.2,
    apyBoost: 0,
    description: '1:1 Rebase Token',
    iconColor: '#00A3FF',
  },
  {
    symbol: 'wstETH',
    name: 'Wrapped stETH',
    price: 4015.0,
    balance: 8.4,
    apyBoost: 0.15,
    description: 'Compounding Value Token',
    iconColor: '#0052FF',
  },
]

interface LockupOption {
  id: string
  label: string
  durationText: string
  days: number
  boost: number
  badge: string
}

const lockupOptions: LockupOption[] = [
  { id: 'flex', label: 'Flexible', durationText: '0-Day Lock', days: 0, boost: 0, badge: 'Flexible' },
  { id: '30d', label: '30 Days', durationText: '30-Day Lock', days: 30, boost: 0.5, badge: '+0.5% APY' },
  { id: '90d', label: '90 Days', durationText: '90-Day Lock', days: 90, boost: 1.2, badge: '+1.2% APY' },
  { id: '365d', label: '365 Days', durationText: '365-Day Lock', days: 365, boost: 2.5, badge: '+2.5% APY' },
]

interface VaultItem {
  id: string
  name: string
  pairSymbol: string
  protocol: string
  apy: string
  apyRaw: number
  tvl: string
  risk: 'Low Risk' | 'Medium Risk' | 'High Risk'
  riskVariant: 'emerald' | 'amber' | 'rose'
  strategy: string
  metricLabel: string
  metricValue: string
  isCurrentVault?: boolean
}

const yieldVaults: VaultItem[] = [
  {
    id: 'eth-usdc-lp',
    name: 'ETH-USDC LP',
    pairSymbol: 'ETH + USDC',
    protocol: 'Uniswap v3 · Concentrated',
    apy: '12.40%',
    apyRaw: 12.4,
    tvl: '$58,420,000.00',
    risk: 'Medium Risk',
    riskVariant: 'amber',
    strategy: 'Automated Rebalancing Range ±5%',
    metricLabel: '24h Volume',
    metricValue: '$4.2M Vol',
    isCurrentVault: false,
  },
  {
    id: 'liquid-staked-eth',
    name: 'Liquid Staked ETH',
    pairSymbol: 'ETH / stETH',
    protocol: 'Lido & Distributed Validator',
    apy: '7.42%',
    apyRaw: 7.42,
    tvl: '$142,850,000.00',
    risk: 'Low Risk',
    riskVariant: 'emerald',
    strategy: 'Consensus Layer + MEV Boost',
    metricLabel: 'Lockup Period',
    metricValue: 'Instant 0-Day',
    isCurrentVault: true,
  },
  {
    id: 'stablecoin-vault',
    name: 'Stablecoin Multi-Vault',
    pairSymbol: 'USDC + USDT + DAI',
    protocol: 'Curve & Morpho Blue Optimizer',
    apy: '9.80%',
    apyRaw: 9.8,
    tvl: '$94,180,000.00',
    risk: 'Low Risk',
    riskVariant: 'emerald',
    strategy: 'Multi-Asset Lending & Arbitrage Yield',
    metricLabel: 'Coverage',
    metricValue: 'Nexus Mutual Protected',
    isCurrentVault: false,
  },
]

export function DefiStakingYieldVault({ className, ...props }: DefiStakingYieldVaultProps) {
  // Wallet State
  const [isWalletConnected, setIsWalletConnected] = React.useState(true)
  const walletAddress = '0x71C856402244243b92834b9d09c2534575823a9F'
  const shortAddress = '0x71C...3a9F'
  const [copied, setCopied] = React.useState(false)

  const copyAddress = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [walletAddress])

  // Rewards State
  const [unclaimedEth, setUnclaimedEth] = React.useState(0.485)
  const [isClaiming, setIsClaiming] = React.useState(false)
  const [claimSuccess, setClaimSuccess] = React.useState(false)

  const unclaimedUsd = React.useMemo(() => {
    return (unclaimedEth * 3450).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }, [unclaimedEth])

  const handleClaimRewards = () => {
    if (unclaimedEth <= 0 || isClaiming) return
    setIsClaiming(true)
    setTimeout(() => {
      setIsClaiming(false)
      setClaimSuccess(true)
      setUnclaimedEth(0)
      setTimeout(() => {
        setClaimSuccess(false)
      }, 3500)
    }, 1200)
  }

  // Simulator State
  const [selectedTokenSymbol, setSelectedTokenSymbol] = React.useState('ETH')
  const [selectedLockupId, setSelectedLockupId] = React.useState('flex')
  const [stakeAmountStr, setStakeAmountStr] = React.useState('10.0')
  const [isStaking, setIsStaking] = React.useState(false)
  const [stakeSuccess, setStakeSuccess] = React.useState(false)

  const currentToken = React.useMemo(() => {
    return tokenOptions.find((t) => t.symbol === selectedTokenSymbol) ?? tokenOptions[0]
  }, [selectedTokenSymbol])

  const currentLockup = React.useMemo(() => {
    return lockupOptions.find((l) => l.id === selectedLockupId) ?? lockupOptions[0]
  }, [selectedLockupId])

  const parsedAmount = React.useMemo(() => {
    const val = parseFloat(stakeAmountStr)
    return isNaN(val) || val < 0 ? 0 : val
  }, [stakeAmountStr])

  const baseVaultApy = 7.42
  const effectiveApy = React.useMemo(() => {
    const total = baseVaultApy + currentLockup.boost + currentToken.apyBoost
    return total.toFixed(2)
  }, [currentLockup.boost, currentToken.apyBoost])

  const stakedFiatValue = React.useMemo(() => {
    return (parsedAmount * currentToken.price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [parsedAmount, currentToken.price])

  const annualYieldEth = React.useMemo(() => {
    const rate = parseFloat(effectiveApy) / 100
    return (parsedAmount * rate).toFixed(3)
  }, [effectiveApy, parsedAmount])

  const annualYieldUsd = React.useMemo(() => {
    const rate = parseFloat(effectiveApy) / 100
    const usd = parsedAmount * rate * currentToken.price
    return usd.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [effectiveApy, parsedAmount, currentToken.price])

  const monthlyYieldUsd = React.useMemo(() => {
    const rate = parseFloat(effectiveApy) / 100
    const usd = (parsedAmount * rate * currentToken.price) / 12
    return usd.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [effectiveApy, parsedAmount, currentToken.price])

  const monthlyYieldEth = React.useMemo(() => {
    const rate = parseFloat(effectiveApy) / 100
    return ((parsedAmount * rate) / 12).toFixed(4)
  }, [effectiveApy, parsedAmount])

  const dailyYieldUsd = React.useMemo(() => {
    const rate = parseFloat(effectiveApy) / 100
    const usd = (parsedAmount * rate * currentToken.price) / 365
    return usd.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }, [effectiveApy, parsedAmount, currentToken.price])

  const dailyYieldEth = React.useMemo(() => {
    const rate = parseFloat(effectiveApy) / 100
    return ((parsedAmount * rate) / 365).toFixed(5)
  }, [effectiveApy, parsedAmount])

  const handleSliderChange = (vals: number[]) => {
    if (vals && vals[0] !== undefined) {
      setStakeAmountStr(vals[0].toFixed(2))
    }
  }

  const setPercentageAmount = (pct: number) => {
    const amt = currentToken.balance * (pct / 100)
    setStakeAmountStr(amt.toFixed(2))
  }

  const setMaxAmount = () => {
    setStakeAmountStr(currentToken.balance.toFixed(2))
  }

  const handleExecuteStake = () => {
    if (parsedAmount <= 0 || isStaking) return
    setIsStaking(true)
    setTimeout(() => {
      setIsStaking(false)
      setStakeSuccess(true)
      setTimeout(() => {
        setStakeSuccess(false)
      }, 3500)
    }, 1400)
  }

  return (
    <div
      data-slot="defi-staking-yield-vault"
      className={cn('mx-auto w-full max-w-6xl space-y-6', className)}
      {...props}
    >
      {/* Header Section */}
      <header className="border-border/80 bg-card/60 rounded-xl border p-4 shadow-xs backdrop-blur-xs sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title & Protocol Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                aria-hidden="true"
              >
                <Zap className="size-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    ETH Liquid Staking & Yield Vault v3
                  </h1>
                  <Badge variant="outline" className="border-border/80 font-mono text-xs font-normal">
                    v3.2 Protocol
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              {/* Audit Badge */}
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-normal text-emerald-600 dark:text-emerald-400"
              >
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Audited by Trail of Bits & OpenZeppelin
              </Badge>

              {/* TVL Badge */}
              <Badge variant="secondary" className="gap-1.5 font-medium tabular-nums">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                $142,850,000.00 TVL
              </Badge>

              <span className="text-muted-foreground hidden items-center gap-1 sm:inline-flex">
                <Sparkles className="size-3 text-amber-500" aria-hidden="true" />
                Auto-Compounding Enabled
              </span>
            </div>
          </div>

          {/* Wallet Connection Action */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isWalletConnected ? (
              <>
                <div className="border-border bg-muted/60 flex items-center gap-2 rounded-lg border px-3 py-1.5 shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span className="text-foreground font-mono text-xs font-medium">{shortAddress}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-foreground size-5"
                    aria-label="Copy wallet address"
                    onClick={copyAddress}
                  >
                    {copied ? (
                      <Check className="size-3 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="shadow-xs" onClick={() => setIsWalletConnected(false)}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button size="sm" className="gap-2 shadow-xs" onClick={() => setIsWalletConnected(true)}>
                <Wallet className="size-4" aria-hidden="true" />
                Connect Web3 Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 4 Staking Performance KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Net Staking APY */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Net Staking APY
              </CardDescription>
              <div
                className="flex size-7 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              >
                <TrendingUp className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums sm:text-3xl dark:text-emerald-400">
                7.42% APY
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Auto-Compounding daily
            </div>
            <p className="text-muted-foreground tabular-nums">Base 4.92% + 2.50% MEV Boost</p>
          </CardContent>
        </Card>

        {/* Card 2: Your Staked Balance */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Your Staked Balance
              </CardDescription>
              <div
                className="border-primary/30 bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md border"
                aria-hidden="true"
              >
                <Coins className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                24.50 ETH
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-1 text-xs">
            <div className="text-muted-foreground font-medium tabular-nums">≈ $84,525.00 USD</div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="border-border/80 px-1.5 py-0 text-xs font-normal">
                Active in Vault v3
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Unclaimed Rewards */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Unclaimed Rewards
              </CardDescription>
              <div
                className="flex size-7 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              >
                <Sparkles className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                {unclaimedEth} stETH
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 text-xs">
            <div className="text-muted-foreground font-medium tabular-nums">≈ ${unclaimedUsd} USD</div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-full gap-1.5 text-xs font-medium shadow-xs"
              disabled={unclaimedEth <= 0 || isClaiming}
              onClick={handleClaimRewards}
            >
              {isClaiming ? (
                <RefreshCw className="size-3 animate-spin" aria-hidden="true" />
              ) : claimSuccess ? (
                <Check className="size-3 text-emerald-500" aria-hidden="true" />
              ) : null}
              {isClaiming ? 'Claiming On-Chain...' : claimSuccess ? 'Rewards Claimed!' : 'Claim Rewards'}
            </Button>
          </CardContent>
        </Card>

        {/* Card 4: Staking Pool Share */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Staking Pool Share
              </CardDescription>
              <div
                className="flex size-7 items-center justify-center rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                aria-hidden="true"
              >
                <Percent className="size-4" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">0.017%</span>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>of total vault</span>
              <span className="text-foreground font-medium tabular-nums">$142.85M TVL</span>
            </div>
            <div className="bg-muted/80 h-1.5 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[17%] rounded-full transition-all duration-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Staking Simulator & Yield Directory */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Deposit & Stake Calculator (7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-foreground flex items-center gap-2 text-base font-semibold sm:text-lg">
                    <Zap className="text-primary size-5" aria-hidden="true" />
                    Deposit & Stake Calculator
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    Simulate staking yields with custom lockup multipliers and real-time auto-compounding.
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  {effectiveApy}% APY
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Token Selector Tabs */}
              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <label className="text-foreground font-medium">Select Staking Asset</label>
                  <span className="tabular-nums">
                    Available: {currentToken.balance} {currentToken.symbol}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {tokenOptions.map((token) => {
                    const isSelected = selectedTokenSymbol === token.symbol
                    return (
                      <button
                        key={token.symbol}
                        type="button"
                        className={cn(
                          'border-border/80 focus-visible:ring-ring flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                            : 'bg-card hover:bg-muted/50 text-muted-foreground',
                        )}
                        onClick={() => setSelectedTokenSymbol(token.symbol)}
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            {token.symbol === 'ETH' && (
                              <svg
                                viewBox="0 0 32 32"
                                className="size-5 shrink-0 rounded-full shadow-xs"
                                aria-hidden="true"
                              >
                                <circle cx="16" cy="16" r="16" fill="#627EEA" />
                                <path fill="#ffffff" fillOpacity="0.6" d="M16.5 4v8.87l7.5 3.35z" />
                                <path fill="#ffffff" d="M16.5 4L9 16.22l7.5-3.35z" />
                                <path fill="#ffffff" fillOpacity="0.6" d="M16.5 21.97v6.03L24 17.62z" />
                                <path fill="#ffffff" d="M16.5 28v-6.03L9 17.62z" />
                                <path fill="#ffffff" fillOpacity="0.2" d="M16.5 20.57l7.5-4.35-7.5-3.35z" />
                                <path fill="#ffffff" fillOpacity="0.6" d="M9 16.22l7.5 4.35v-7.7z" />
                              </svg>
                            )}
                            {token.symbol === 'stETH' && (
                              <svg
                                viewBox="0 0 32 32"
                                className="size-5 shrink-0 rounded-full shadow-xs"
                                aria-hidden="true"
                              >
                                <circle cx="16" cy="16" r="16" fill="#00A3FF" />
                                <path fill="#ffffff" fillOpacity="0.8" d="M16 4.5l-6.5 10.8 6.5 3.9 6.5-3.9z" />
                                <path fill="#ffffff" d="M16 19.2l-6.5-3.9L16 27.5l6.5-12.2z" />
                                <circle cx="16" cy="16" r="3.5" fill="#ffffff" fillOpacity="0.3" />
                              </svg>
                            )}
                            {token.symbol === 'wstETH' && (
                              <svg
                                viewBox="0 0 32 32"
                                className="size-5 shrink-0 rounded-full shadow-xs"
                                aria-hidden="true"
                              >
                                <circle cx="16" cy="16" r="16" fill="#0052FF" />
                                <path fill="#ffffff" d="M16 5.5l-5.8 9.5 5.8 3.5 5.8-3.5z" />
                                <path fill="#ffffff" fillOpacity="0.6" d="M16 18.5l-5.8-3.5 5.8 11 5.8-11z" />
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="13.5"
                                  stroke="#F5AC37"
                                  strokeWidth="2"
                                  fill="none"
                                  strokeDasharray="3 2"
                                />
                              </svg>
                            )}
                            <span className="text-foreground text-xs font-semibold">{token.symbol}</span>
                          </div>
                          {isSelected && (
                            <span className="text-primary size-3.5" aria-hidden="true">
                              <Check className="size-3.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs tabular-nums">{token.balance} avail.</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Amount Input & Quick Percentages */}
              <div className="bg-muted/40 border-border/80 space-y-3 rounded-lg border p-4">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <label htmlFor="stake-amount-input-react" className="text-foreground font-medium">
                    Deposit Amount
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="tabular-nums">
                      Wallet: {currentToken.balance} {currentToken.symbol}
                    </span>
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 inline-flex min-h-6 items-center px-1 font-semibold uppercase transition-colors focus-visible:outline-none"
                      onClick={setMaxAmount}
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Input Row */}
                <div className="flex items-center justify-between gap-3">
                  <Input
                    id="stake-amount-input-react"
                    value={stakeAmountStr}
                    onChange={(e) => setStakeAmountStr(e.target.value)}
                    type="number"
                    step="any"
                    min="0"
                    className="h-9 border-none bg-transparent px-0 text-xl font-bold tracking-tight tabular-nums shadow-none focus-visible:ring-0"
                    placeholder="0.0"
                  />

                  <div className="border-border bg-background flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold shadow-xs">
                    <span>{currentToken.symbol}</span>
                  </div>
                </div>

                {/* USD Approximation & Presets */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-muted-foreground tabular-nums">≈ ${stakedFiatValue} USD</span>
                  <div className="flex items-center gap-1">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        className="border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground min-h-6 rounded border px-2 py-0.5 font-mono text-xs transition-colors focus-visible:ring-1 focus-visible:outline-none"
                        onClick={() => setPercentageAmount(pct)}
                      >
                        {pct === 100 ? 'MAX' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Slider */}
                <div className="pt-2">
                  <Slider
                    value={[Math.min(parsedAmount, currentToken.balance)]}
                    onValueChange={handleSliderChange}
                    min={0}
                    max={currentToken.balance}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Lockup Duration Selector */}
              <div className="space-y-2">
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">Lockup Duration & Boost</span>
                  <span className="text-muted-foreground">Longer lockups multiply daily yields</span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {lockupOptions.map((opt) => {
                    const isSelected = selectedLockupId === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={cn(
                          'border-border/80 focus-visible:ring-ring flex flex-col items-center justify-center gap-1 rounded-lg border p-2.5 text-center transition-all focus-visible:ring-2 focus-visible:outline-none',
                          isSelected
                            ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                            : 'bg-card hover:bg-muted/50 text-muted-foreground',
                        )}
                        onClick={() => setSelectedLockupId(opt.id)}
                      >
                        <div className="flex items-center gap-1">
                          {opt.days === 0 ? (
                            <Unlock className="text-muted-foreground size-3.5" aria-hidden="true" />
                          ) : (
                            <Lock className="text-primary size-3.5" aria-hidden="true" />
                          )}
                          <span className="text-foreground text-xs font-semibold">{opt.label}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-border/60 font-mono text-xs font-normal tabular-nums',
                            opt.boost > 0
                              ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'text-muted-foreground',
                          )}
                        >
                          {opt.badge}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Estimated Returns Highlight Box */}
              <div className="space-y-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                    <Flame className="size-4 text-emerald-500" aria-hidden="true" />
                    Estimated Annual Yield
                  </span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    {effectiveApy}% APY
                  </Badge>
                </div>

                {/* Main Yield Value */}
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xl font-bold tracking-tight text-emerald-600 tabular-nums sm:text-2xl dark:text-emerald-400">
                    +${annualYieldUsd} / year
                  </span>
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    ({annualYieldEth} {currentToken.symbol})
                  </span>
                </div>

                <Separator className="bg-emerald-500/20" />

                {/* Yield Breakdown Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Daily Returns</div>
                    <div className="text-foreground font-medium tabular-nums">+${dailyYieldUsd}</div>
                    <div className="text-muted-foreground font-mono text-xs tabular-nums">
                      {dailyYieldEth} {currentToken.symbol}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-muted-foreground">Monthly Returns</div>
                    <div className="text-foreground font-medium tabular-nums">+${monthlyYieldUsd}</div>
                    <div className="text-muted-foreground font-mono text-xs tabular-nums">
                      {monthlyYieldEth} {currentToken.symbol}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-0.5 sm:col-span-1">
                    <div className="text-muted-foreground">Network Gas & Fee</div>
                    <div className="text-foreground flex items-center gap-1 font-medium tabular-nums">
                      <Fuel className="text-muted-foreground size-3" aria-hidden="true" />
                      ~$2.85 (0% fee)
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">No exit penalty</div>
                  </div>
                </div>
              </div>

              {/* Primary Stake CTA Button */}
              <Button
                size="lg"
                className="w-full gap-2 font-semibold shadow-xs transition-all"
                disabled={parsedAmount <= 0 || isStaking}
                onClick={handleExecuteStake}
              >
                {isStaking ? (
                  <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                ) : stakeSuccess ? (
                  <Check className="size-4 text-emerald-300" aria-hidden="true" />
                ) : (
                  <Zap className="size-4" aria-hidden="true" />
                )}
                {isStaking
                  ? 'Submitting Staking Transaction...'
                  : stakeSuccess
                    ? `Successfully Staked ${parsedAmount} ${currentToken.symbol}!`
                    : `Stake ${parsedAmount > 0 ? `${parsedAmount} ${currentToken.symbol}` : 'ETH'} Now`}
              </Button>

              <div className="text-muted-foreground flex items-center justify-center gap-2 text-center text-xs">
                <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden="true" />
                <span>Smart contracts verified on Etherscan · 100% non-custodial</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Yield Vaults Directory (5 Cols) */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground text-base font-semibold">Yield Vaults Directory</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    Active liquidity pools and automated yield strategies.
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs font-normal tabular-nums">
                  3 Vaults Active
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3.5">
              {yieldVaults.map((vault) => (
                <div
                  key={vault.id}
                  className={cn(
                    'border-border/80 relative space-y-3 rounded-lg border p-3.5 transition-all',
                    vault.isCurrentVault
                      ? 'bg-primary/5 border-primary/40 ring-primary/20 ring-1'
                      : 'bg-card hover:bg-muted/30',
                  )}
                >
                  {/* Vault Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-sm font-semibold">{vault.name}</span>
                        {vault.isCurrentVault && (
                          <Badge
                            variant="outline"
                            className="border-primary/40 bg-primary/10 text-primary px-1.5 py-0 text-xs font-medium"
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs">{vault.protocol}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-emerald-600 tabular-nums sm:text-lg dark:text-emerald-400">
                        {vault.apy} APY
                      </div>
                      <div className="text-muted-foreground font-mono text-xs tabular-nums">{vault.tvl}</div>
                    </div>
                  </div>

                  {/* Vault Meta Details */}
                  <div className="border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 rounded-md border p-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          'px-1.5 py-0 text-xs font-normal',
                          vault.riskVariant === 'emerald'
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                        )}
                      >
                        {vault.risk}
                      </Badge>
                      <span className="text-muted-foreground max-w-[140px] truncate sm:max-w-none">
                        {vault.strategy}
                      </span>
                    </div>
                    <div className="text-muted-foreground font-medium tabular-nums">{vault.metricValue}</div>
                  </div>

                  {/* Vault Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-muted-foreground font-mono text-xs">{vault.pairSymbol}</span>
                    <Button
                      variant={vault.isCurrentVault ? 'default' : 'outline'}
                      size="sm"
                      className="h-7 px-3 text-xs shadow-xs"
                    >
                      <span>{vault.isCurrentVault ? 'Manage Vault' : 'Deposit Pool'}</span>
                      <ArrowUpRight className="ml-1 size-3" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="border-border/60 bg-muted/20 flex flex-col gap-2 rounded-b-xl border-t p-3.5 text-xs">
              <div className="text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="size-4 shrink-0 text-amber-500" aria-hidden="true" />
                <span>Yields adjust dynamically with Ethereum validator queue and DEX trading fee volumes.</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DefiStakingYieldVault
