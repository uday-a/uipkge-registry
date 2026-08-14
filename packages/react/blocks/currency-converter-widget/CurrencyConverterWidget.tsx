'use client'

import * as React from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  Building2,
  Lock,
  Minus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export interface CurrencyOption {
  code: string
  name: string
  symbol: string
  flag: string
  rateToBase: number // USD base = 1.0
  deliverySpeed: string
  deliveryNetwork: string
}

export interface PopularPair {
  id: string
  from: string
  to: string
  change24h: number
  trend: 'up' | 'down'
}

export interface TransferPayload {
  sendAmount: number
  fromCurrency: string
  toCurrency: string
  recipientGets: number
  fee: number
  rate: number
}

export interface CurrencyConverterWidgetProps {
  initialSendAmount?: number
  initialFromCurrency?: string
  initialToCurrency?: string
  className?: string
  onTransfer?: (payload: TransferPayload) => void
}

const CURRENCIES: CurrencyOption[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    rateToBase: 1.0,
    deliverySpeed: 'in minutes',
    deliveryNetwork: 'FedNow / RTP',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rateToBase: 0.9245,
    deliverySpeed: 'in minutes',
    deliveryNetwork: 'SEPA Instant',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    rateToBase: 0.7892,
    deliverySpeed: 'in seconds',
    deliveryNetwork: 'Faster Payments',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    rateToBase: 154.6,
    deliverySpeed: 'within 4 hours',
    deliveryNetwork: 'Zengin System',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    flag: '🇨🇦',
    rateToBase: 1.378,
    deliverySpeed: 'in minutes',
    deliveryNetwork: 'Interac Direct',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    rateToBase: 1.523,
    deliverySpeed: 'in minutes',
    deliveryNetwork: 'NPP / PayID',
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    rateToBase: 1.348,
    deliverySpeed: 'instant',
    deliveryNetwork: 'FAST Network',
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    flag: '🇨🇭',
    rateToBase: 0.898,
    deliverySpeed: 'in minutes',
    deliveryNetwork: 'SIC Instant',
  },
]

const POPULAR_PAIRS: PopularPair[] = [
  { id: 'eur-usd', from: 'EUR', to: 'USD', change24h: 0.18, trend: 'up' },
  { id: 'gbp-usd', from: 'GBP', to: 'USD', change24h: 0.24, trend: 'up' },
  { id: 'usd-jpy', from: 'USD', to: 'JPY', change24h: -0.32, trend: 'down' },
  { id: 'usd-cad', from: 'USD', to: 'CAD', change24h: 0.09, trend: 'up' },
  { id: 'usd-eur', from: 'USD', to: 'EUR', change24h: -0.18, trend: 'down' },
  { id: 'gbp-eur', from: 'GBP', to: 'EUR', change24h: 0.05, trend: 'up' },
]

function formatAmount(val: number, currencyCode: string): string {
  const isZeroDecimal = currencyCode === 'JPY'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(val)
}

function getPairRate(fromCode: string, toCode: string): string {
  const f = CURRENCIES.find((c) => c.code === fromCode)?.rateToBase || 1
  const t = CURRENCIES.find((c) => c.code === toCode)?.rateToBase || 1
  const rate = t / f
  return rate >= 100 ? rate.toFixed(2) : rate.toFixed(4)
}

export function CurrencyConverterWidget({
  initialSendAmount = 1000,
  initialFromCurrency = 'USD',
  initialToCurrency = 'EUR',
  className,
  onTransfer,
}: CurrencyConverterWidgetProps) {
  const [sendAmount, setSendAmount] = React.useState<number>(initialSendAmount)
  const [fromCurrency, setFromCurrency] = React.useState<string>(initialFromCurrency)
  const [toCurrency, setToCurrency] = React.useState<string>(initialToCurrency)
  const [paymentMethod, setPaymentMethod] = React.useState<'bank' | 'card'>('bank')
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false)
  const [refreshSuccess, setRefreshSuccess] = React.useState<boolean>(false)

  const fromCurrencyObj = React.useMemo(
    () => CURRENCIES.find((c) => c.code === fromCurrency) || CURRENCIES[0],
    [fromCurrency],
  )
  const toCurrencyObj = React.useMemo(
    () => CURRENCIES.find((c) => c.code === toCurrency) || CURRENCIES[1],
    [toCurrency],
  )

  // Dynamic mid-market rate calculation
  const exchangeRate = React.useMemo(() => {
    if (!fromCurrencyObj || !toCurrencyObj) return 1
    return toCurrencyObj.rateToBase / fromCurrencyObj.rateToBase
  }, [fromCurrencyObj, toCurrencyObj])

  const formattedExchangeRate = React.useMemo(() => {
    if (exchangeRate >= 100) return exchangeRate.toFixed(2)
    if (exchangeRate >= 1) return exchangeRate.toFixed(4)
    return exchangeRate.toFixed(5)
  }, [exchangeRate])

  // Fee calculation logic
  const fixedBaseFee = React.useMemo(() => {
    const base = 1.2 * fromCurrencyObj.rateToBase
    return paymentMethod === 'card' ? base * 1.6 : base
  }, [fromCurrencyObj, paymentMethod])

  const variableRate = paymentMethod === 'card' ? 0.0065 : 0.0035
  const variableFee = (sendAmount || 0) * variableRate
  const totalFee = fixedBaseFee + variableFee
  const amountToConvert = Math.max(0, (sendAmount || 0) - totalFee)
  const recipientGets = amountToConvert * exchangeRate

  // Bank comparison calculation
  const bankWireFee = 20 * fromCurrencyObj.rateToBase
  const bankMarkupSpread = 0.032 // 3.2% average hidden bank margin
  const bankTotalCost = bankWireFee + (sendAmount || 0) * bankMarkupSpread
  const estimatedSavings = Math.max(0, bankTotalCost - totalFee)

  const handleSwap = React.useCallback(() => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }, [fromCurrency, toCurrency])

  const handleSelectPair = React.useCallback((pair: PopularPair) => {
    setFromCurrency(pair.from)
    setToCurrency(pair.to)
  }, [])

  const handleRefresh = React.useCallback(() => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setRefreshSuccess(true)
      setTimeout(() => {
        setRefreshSuccess(false)
      }, 2000)
    }, 450)
  }, [isRefreshing])

  const handleTransfer = React.useCallback(() => {
    onTransfer?.({
      sendAmount: Number(sendAmount) || 0,
      fromCurrency,
      toCurrency,
      recipientGets,
      fee: totalFee,
      rate: exchangeRate,
    })
  }, [sendAmount, fromCurrency, toCurrency, recipientGets, totalFee, exchangeRate, onTransfer])

  return (
    <div className={cn('mx-auto w-full max-w-2xl space-y-6', className)} data-slot="currency-converter-widget">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Currency Converter & International Transfer
          </h2>
          <Badge variant="outline" className="gap-1.5 py-1 text-xs font-normal">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Live Market Rates
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Real-time mid-market exchange rates with transparent fees. No hidden markups.
        </p>

        {/* Refresh & Current Mid-market rate banner */}
        <div className="border-border bg-muted/40 text-muted-foreground flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-medium">
              Mid-market rate: 1 {fromCurrencyObj.code} = {formattedExchangeRate} {toCurrencyObj.code}
            </span>
            <span>Updated 1m ago</span>
          </div>
          <button
            type="button"
            aria-label="Refresh exchange rates"
            className="text-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-6 items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            onClick={handleRefresh}
          >
            <RefreshCw
              className={cn(
                'size-3.5 transition-transform duration-500',
                isRefreshing ? 'text-primary animate-spin' : '',
              )}
            />
            <span>{refreshSuccess ? 'Refreshed!' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Main Converter Card */}
      <Card className="border-border shadow-xs">
        <CardContent className="space-y-4 p-5 sm:p-6">
          {/* Payment method tab pill */}
          <div className="flex items-center justify-between gap-2">
            <div className="border-border bg-muted/50 inline-flex rounded-lg border p-1 text-xs">
              <button
                type="button"
                className={cn(
                  'min-h-6 rounded-md px-3 py-1 font-medium transition-all',
                  paymentMethod === 'bank'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setPaymentMethod('bank')}
              >
                Bank Transfer (Lowest Fee)
              </button>
              <button
                type="button"
                className={cn(
                  'min-h-6 rounded-md px-3 py-1 font-medium transition-all',
                  paymentMethod === 'card'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setPaymentMethod('card')}
              >
                Debit / Credit Card
              </button>
            </div>

            <span className="text-muted-foreground hidden text-xs sm:inline-flex">Guaranteed rate for 24h</span>
          </div>

          {/* "You send" Input Container */}
          <div className="border-input bg-card focus-within:border-ring focus-within:ring-ring/20 rounded-xl border p-3.5 shadow-2xs transition-colors focus-within:ring-2">
            <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
              <label htmlFor="send-amount-react-input" className="text-foreground font-medium">
                You send
              </label>
              <span>Max limit: $100,000 / transfer</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-1 items-baseline gap-1">
                <span className="text-muted-foreground text-xl font-semibold select-none sm:text-2xl">
                  {fromCurrencyObj.symbol}
                </span>
                <input
                  id="send-amount-react-input"
                  value={Number.isNaN(sendAmount) ? '' : sendAmount}
                  onChange={(e) => setSendAmount(Number.parseFloat(e.target.value) || 0)}
                  type="number"
                  min="1"
                  step="any"
                  placeholder="1,000.00"
                  className="text-foreground placeholder:text-muted-foreground/40 w-full bg-transparent text-2xl font-bold tracking-tight tabular-nums outline-none sm:text-3xl"
                />
              </div>

              {/* From Currency Selector */}
              <div className="w-36 shrink-0">
                <Select value={fromCurrency} onValueChange={(val) => setFromCurrency(val)}>
                  <SelectTrigger className="bg-muted/40 h-11 w-full text-xs font-medium sm:text-sm">
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-base leading-none">{fromCurrencyObj.flag}</span>
                      <span className="font-semibold">{fromCurrencyObj.code}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{curr.flag}</span>
                          <span className="font-semibold">{curr.code}</span>
                          <span className="text-muted-foreground truncate text-xs">({curr.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Transfer Breakdown Rail (Vertical Connector) */}
          <div className="before:bg-border relative my-1 space-y-3.5 py-2 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-px">
            {/* Step 1: Fee */}
            <div className="relative flex items-center justify-between text-xs">
              <div className="border-border bg-card text-muted-foreground absolute -left-[19px] flex size-3.5 items-center justify-center rounded-full border">
                <Minus className="size-2.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold tabular-nums">
                  -{fromCurrencyObj.symbol}
                  {formatAmount(totalFee, fromCurrencyObj.code)} {fromCurrencyObj.code}
                </span>
                <span className="text-muted-foreground">Transfer fee</span>
                <Badge variant="secondary" className="text-muted-foreground h-4.5 px-1.5 text-xs font-normal">
                  {paymentMethod === 'card' ? '0.65% + $1.20' : '0.35% + $1.20'}
                </Badge>
              </div>
              <span className="text-muted-foreground hidden sm:inline">Transparent fixed rate</span>
            </div>

            {/* Step 2: Amount to convert */}
            <div className="relative flex items-center justify-between text-xs">
              <div className="border-border bg-card text-muted-foreground absolute -left-[19px] flex size-3.5 items-center justify-center rounded-full border">
                <span className="text-xs leading-none font-bold">=</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold tabular-nums">
                  {fromCurrencyObj.symbol}
                  {formatAmount(amountToConvert, fromCurrencyObj.code)} {fromCurrencyObj.code}
                </span>
                <span className="text-muted-foreground">Amount to convert</span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">Net transfer base</span>
            </div>

            {/* Step 3: Guaranteed Exchange Rate & Swap Button Line */}
            <div className="relative flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="border-primary/50 bg-primary text-primary-foreground absolute -left-[19px] flex size-3.5 items-center justify-center rounded-full border">
                <Lock className="size-2" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-foreground font-semibold tabular-nums">× {formattedExchangeRate}</span>
                <span className="text-muted-foreground">Guaranteed mid-market rate</span>
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <Lock className="size-2.5" />
                  24h Guarantee
                </Badge>
              </div>

              {/* Swap Currencies Button */}
              <button
                type="button"
                aria-label="Swap currencies"
                className="border-border bg-card text-foreground hover:bg-accent hover:border-primary/50 focus-visible:ring-ring inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all focus-visible:ring-2 focus-visible:outline-none active:scale-95"
                onClick={handleSwap}
              >
                <ArrowUpDown className="text-primary size-3" />
                <span>Swap</span>
              </button>
            </div>
          </div>

          {/* "Recipient gets" Input / Output Container */}
          <div className="border-input bg-card focus-within:border-ring focus-within:ring-ring/20 rounded-xl border p-3.5 shadow-2xs transition-colors focus-within:ring-2">
            <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
              <label className="text-foreground font-medium">Recipient gets</label>
              <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <Zap className="size-3" />
                {toCurrencyObj.deliverySpeed}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-0 flex-1 items-baseline gap-1">
                <span className="text-muted-foreground text-xl font-semibold select-none sm:text-2xl">
                  {toCurrencyObj.symbol}
                </span>
                <div className="text-foreground w-full truncate text-2xl font-bold tracking-tight tabular-nums select-all sm:text-3xl">
                  {formatAmount(recipientGets, toCurrencyObj.code)}
                </div>
              </div>

              {/* To Currency Selector */}
              <div className="w-36 shrink-0">
                <Select value={toCurrency} onValueChange={(val) => setToCurrency(val)}>
                  <SelectTrigger className="bg-muted/40 h-11 w-full text-xs font-medium sm:text-sm">
                    <div className="flex items-center gap-2 text-left">
                      <span className="text-base leading-none">{toCurrencyObj.flag}</span>
                      <span className="font-semibold">{toCurrencyObj.code}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{curr.flag}</span>
                          <span className="font-semibold">{curr.code}</span>
                          <span className="text-muted-foreground truncate text-xs">({curr.name})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Delivery Speed & Savings Breakdown Banner */}
          <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full">
                  <Zap className="size-3.5" />
                </span>
                <div>
                  <p className="text-foreground font-semibold">Estimated delivery: {toCurrencyObj.deliverySpeed}</p>
                  <p className="text-muted-foreground">Via {toCurrencyObj.deliveryNetwork}</p>
                </div>
              </div>

              <Badge
                variant="outline"
                className="gap-1 border-amber-500/30 bg-amber-500/10 py-1 text-xs text-amber-600 dark:text-amber-400"
              >
                <Sparkles className="size-3" />
                Save ~{fromCurrencyObj.symbol}
                {formatAmount(estimatedSavings, fromCurrencyObj.code)} {fromCurrencyObj.code}
              </Badge>
            </div>

            <Separator />

            {/* Comparison vs Standard High-Street Bank */}
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div className="bg-card/60 border-border flex items-start gap-2 rounded-md border p-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-foreground font-medium">UIPKGE Transfer</p>
                  <p className="text-muted-foreground text-xs">
                    Fee: {fromCurrencyObj.symbol}
                    {formatAmount(totalFee, fromCurrencyObj.code)} · 0% exchange spread
                  </p>
                </div>
              </div>

              <div className="bg-card/60 border-border flex items-start gap-2 rounded-md border p-2.5 opacity-75">
                <Building2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-foreground font-medium">Standard Bank Wire</p>
                  <p className="text-muted-foreground text-xs">
                    Fee: ~{fromCurrencyObj.symbol}
                    {formatAmount(bankTotalCost, fromCurrencyObj.code)} · ~3.2% hidden spread
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <Button className="h-11 w-full gap-2 text-base font-semibold shadow-sm" onClick={handleTransfer}>
            <span>
              Get Started / Send {fromCurrencyObj.symbol}
              {formatAmount(sendAmount || 0, fromCurrencyObj.code)}
            </span>
            <ArrowRight className="size-4" />
          </Button>

          <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-xs">
            <Lock className="text-muted-foreground size-3" />
            <span>Rates locked for 24 hours. Licensed & regulated financial institution.</span>
          </p>
        </CardContent>
      </Card>

      {/* Popular Currency Pairs Quick Rate Ticker */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-sm font-semibold">Popular Currency Pairs</h3>
          <span className="text-muted-foreground text-xs">Click pair to load</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {POPULAR_PAIRS.map((pair) => {
            const isSelected = fromCurrency === pair.from && toCurrency === pair.to
            return (
              <button
                key={pair.id}
                type="button"
                className={cn(
                  'hover:bg-accent focus-visible:ring-ring flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                  isSelected ? 'border-primary bg-primary/5 ring-primary/20 ring-1' : 'border-border bg-card',
                )}
                onClick={() => handleSelectPair(pair)}
              >
                <div className="flex w-full items-center justify-between text-xs">
                  <span className="text-foreground font-semibold">
                    {pair.from} / {pair.to}
                  </span>
                  <span
                    className={cn(
                      'flex items-center text-xs font-medium',
                      pair.trend === 'up'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400',
                    )}
                  >
                    {pair.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {pair.change24h > 0 ? `+${pair.change24h}%` : `${pair.change24h}%`}
                  </span>
                </div>

                <div className="text-foreground text-sm font-bold tabular-nums">{getPairRate(pair.from, pair.to)}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
