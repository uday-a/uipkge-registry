'use client'

import * as React from 'react'
import { useMemo } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Gift,
  HelpCircle,
  Lock,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface GiftCardBalanceCheckerProps {
  className?: string
}

interface TransactionRecord {
  id: string
  date: string
  reference: string
  title: string
  subtitle?: string
  type: 'activation' | 'redemption' | 'reload'
  amount: number
  balanceAfter: number
  status: 'Completed' | 'Pending'
}

const initialTransactions: TransactionRecord[] = [
  {
    id: 'tx-1',
    date: 'Dec 19, 2024',
    reference: '#ORD-84112',
    title: 'Store Checkout Redemption',
    subtitle: 'Order #ORD-84112 · Leather Travel Wallet',
    type: 'redemption',
    amount: -15.0,
    balanceAfter: 150.0,
    status: 'Completed',
  },
  {
    id: 'tx-2',
    date: 'Nov 04, 2024',
    reference: '#ORD-84920',
    title: 'Store Checkout Redemption',
    subtitle: 'Order #ORD-84920 · Merino Knit Sweater',
    type: 'redemption',
    amount: -35.0,
    balanceAfter: 165.0,
    status: 'Completed',
  },
  {
    id: 'tx-3',
    date: 'Oct 12, 2024',
    reference: '#ACT-99014',
    title: 'Initial Activation & Fund Issue',
    subtitle: 'Digital Storefront Pass Issued',
    type: 'activation',
    amount: 200.0,
    balanceAfter: 200.0,
    status: 'Completed',
  },
]

export function GiftCardBalanceChecker({ className }: GiftCardBalanceCheckerProps) {
  const [cardNumber, setCardNumber] = React.useState('7482 - 9104 - 6382 - 8492')
  const [securityPin, setSecurityPin] = React.useState('4829')
  const [isChecking, setIsChecking] = React.useState(false)
  const [isVerified, setIsVerified] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const [applied, setApplied] = React.useState(false)
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null)
  const [filterType, setFilterType] = React.useState<'all' | 'redemptions' | 'loads'>('all')
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>(initialTransactions)

  function formatCardInput(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})(?=.)/g, '$1 - ')
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCardInput(e.target.value)
    setCardNumber(formatted)
  }

  function handlePinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    setSecurityPin(digits)
  }

  const currentBalance = useMemo(() => {
    if (transactions.length === 0) return 0
    return transactions[0].balanceAfter
  }, [transactions])

  const totalLoaded = useMemo(() => {
    return transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const totalSpent = useMemo(() => {
    return Math.abs(transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
  }, [transactions])

  const lastFourDigits = useMemo(() => {
    const digits = cardNumber.replace(/\D/g, '')
    return digits.length >= 4 ? digits.slice(-4) : '8492'
  }, [cardNumber])

  const filteredTransactions = useMemo(() => {
    if (filterType === 'redemptions') {
      return transactions.filter((t) => t.type === 'redemption')
    }
    if (filterType === 'loads') {
      return transactions.filter((t) => t.type === 'activation' || t.type === 'reload')
    }
    return transactions
  }, [transactions, filterType])

  function checkBalance() {
    setIsChecking(true)
    setFeedbackMessage(null)
    setTimeout(() => {
      setIsChecking(false)
      setIsVerified(true)
      setFeedbackMessage(`Gift card verified. Current active balance is $${currentBalance.toFixed(2)}.`)
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 4000)
    }, 500)
  }

  function copyCardNumber() {
    const raw = cardNumber.replace(/\s+/g, '')
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(raw)
    }
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  function applyToOrder() {
    copyCardNumber()
    setApplied(true)
    setFeedbackMessage(`Card ending in ${lastFourDigits} copied and applied to your checkout session!`)
    setTimeout(() => {
      setApplied(false)
      setFeedbackMessage(null)
    }, 4000)
  }

  function reloadFunds(amount: number) {
    const newBalance = currentBalance + amount
    const newRecord: TransactionRecord = {
      id: `tx-${Date.now()}`,
      date: 'Today',
      reference: `#RLD-${Math.floor(10000 + Math.random() * 90000)}`,
      title: 'Manual Online Fund Reload',
      subtitle: `Instant Online Top-Up (+ $${amount.toFixed(2)})`,
      type: 'reload',
      amount: amount,
      balanceAfter: newBalance,
      status: 'Completed',
    }
    setTransactions((prev) => [newRecord, ...prev])
    setFeedbackMessage(`Successfully reloaded +$${amount.toFixed(2)}! New card balance: $${newBalance.toFixed(2)}.`)
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 4000)
  }

  return (
    <div data-slot="gift-card-balance-checker" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Check Gift Card Balance</h2>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-1">
              <Sparkles className="text-primary size-3" />
              Storefront Pass
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Check your remaining card balance, review past order redemptions, or reload funds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="border-border bg-card text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs shadow-xs">
                  <HelpCircle className="text-primary size-3.5" />
                  <span>PIN & Card Guide</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs text-xs">
                Locate the 16-digit card code on the back of your physical card or inside your digital gift email. The
                4-digit security PIN is under the scratch-off foil.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Feedback Banner if active */}
      {feedbackMessage && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{feedbackMessage}</span>
          </div>
        </div>
      )}

      {/* 2-Column Storefront Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Lookup Form & Digital Card Hero */}
        <div className="space-y-6 lg:col-span-5">
          {/* Lookup Card Form */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Card Lookup</CardTitle>
                {isVerified && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                  >
                    <Check className="size-3" />
                    Active Card
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                Enter your gift card credentials to view live balance and activity.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-4">
              {/* 16-Digit Card Number Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="gc-number-input-react" className="text-foreground text-xs font-medium">
                    16-Digit Card Number
                  </label>
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground inline-flex items-center focus-visible:outline-none"
                          aria-label="Gift card number info"
                        >
                          <HelpCircle className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Enter the 16 digits on the back of your card or in your receipt email.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Input
                  id="gc-number-input-react"
                  value={cardNumber}
                  placeholder="XXXX - XXXX - XXXX - XXXX"
                  maxLength={25}
                  className="font-mono text-sm"
                  prefixIcon={<CreditCard className="size-4" />}
                  onChange={handleCardNumberChange}
                />
              </div>

              {/* 4-Digit Security PIN Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="gc-pin-input-react" className="text-foreground text-xs font-medium">
                    Security PIN (4 digits)
                  </label>
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground inline-flex items-center focus-visible:outline-none"
                          aria-label="Security PIN info"
                        >
                          <HelpCircle className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        The 4-digit PIN is revealed by scratching the silver foil or listed in your digital claim email.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <Input
                  id="gc-pin-input-react"
                  value={securityPin}
                  type="password"
                  placeholder="••••"
                  maxLength={4}
                  showPasswordToggle
                  className="font-mono text-sm"
                  prefixIcon={<Lock className="size-4" />}
                  onChange={handlePinChange}
                />
              </div>

              <Button type="button" className="w-full font-medium" disabled={isChecking} onClick={checkBalance}>
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 size-4 animate-spin" />
                    Verifying Balance...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 size-4" />
                    Check Balance
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Stylized Digital Gift Card Hero Display */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-900 p-6 text-white shadow-lg">
            {/* Ambient Glow Layer */}
            <div
              className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-emerald-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-indigo-500/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex flex-col justify-between space-y-6">
              {/* Card Top Bar: Brand & Pass Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white shadow-inner backdrop-blur-md">
                    <Gift className="size-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-neutral-200 uppercase">Lumen Store</p>
                    <p className="text-xs text-neutral-400">Digital Gift Pass</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="gap-1.5 border-white/20 bg-white/10 px-2.5 py-0.5 text-xs text-white backdrop-blur-md"
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Verified Active
                </Badge>
              </div>

              {/* Card Center: Chip Icon & Balance Display */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
                    Available Balance
                  </span>
                  {/* Chip graphic representation */}
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="h-5 w-7 rounded-sm border border-amber-300/40 bg-gradient-to-tr from-amber-400/20 to-amber-200/40" />
                    <span className="font-mono text-xs tracking-tighter text-neutral-400">NFC</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
                    ${currentBalance.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-emerald-400">USD</span>
                </div>
              </div>

              {/* Card Footer: Card Number & Expiry terms */}
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm tracking-widest text-neutral-200">
                      •••• •••• •••• {lastFourDigits}
                    </span>
                    <button
                      type="button"
                      className="rounded p-1 text-neutral-400 transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:outline-none"
                      aria-label="Copy card number"
                      onClick={copyCardNumber}
                    >
                      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                  {copied && <span className="animate-in fade-in text-xs font-medium text-emerald-400">Copied!</span>}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Never Expires · No Inactivity Fees</span>
                  <span className="font-mono text-neutral-500">PIN: ••••</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-3">
            <Button variant="default" className="w-full font-medium" onClick={applyToOrder}>
              {applied ? (
                <>
                  <Check className="mr-2 size-4 text-emerald-300" />
                  Applied to Checkout!
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 size-4" />
                  Apply to Next Order
                </>
              )}
            </Button>

            {/* Quick Reload Card */}
            <Card className="border-border shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Quick Reload Funds
                  </CardTitle>
                  <Plus className="text-muted-foreground size-3.5" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground mb-3 text-xs">
                  Top up your gift card instantly with a saved payment method.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full font-medium tabular-nums"
                    onClick={() => reloadFunds(25)}
                  >
                    + $25.00
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full font-medium tabular-nums"
                    onClick={() => reloadFunds(50)}
                  >
                    + $50.00
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full font-medium tabular-nums"
                    onClick={() => reloadFunds(100)}
                  >
                    + $100.00
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Balance Stats & Redemption History Table */}
        <div className="space-y-6 lg:col-span-7">
          {/* Passbook Summary Metrics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
              <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                <span>Available Balance</span>
                <Wallet className="text-primary size-3.5" />
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                ${currentBalance.toFixed(2)}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="size-3" />
                Ready to spend
              </p>
            </div>

            <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
              <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                <span>Total Value Loaded</span>
                <ArrowDownLeft className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                ${totalLoaded.toFixed(2)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">All top-ups & issue</p>
            </div>

            <div className="border-border bg-card rounded-xl border p-4 shadow-xs">
              <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                <span>Total Redeemed</span>
                <ArrowUpRight className="text-muted-foreground size-3.5" />
              </div>
              <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                -${totalSpent.toFixed(2)}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">Past store orders</p>
            </div>
          </div>

          {/* Redemption & Activity History Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Redemption & Activity History</CardTitle>
                  <CardDescription className="text-xs">
                    Detailed ledger of card issuance, promotional top-ups, and store checkouts.
                  </CardDescription>
                </div>

                {/* Filter Pills */}
                <div className="border-border bg-muted/40 flex items-center gap-1.5 rounded-lg border p-1 text-xs">
                  <button
                    type="button"
                    className={cn(
                      'rounded px-2.5 py-1 font-medium transition-colors',
                      filterType === 'all'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setFilterType('all')}
                  >
                    All ({transactions.length})
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded px-2.5 py-1 font-medium transition-colors',
                      filterType === 'redemptions'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setFilterType('redemptions')}
                  >
                    Redemptions
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded px-2.5 py-1 font-medium transition-colors',
                      filterType === 'loads'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setFilterType('loads')}
                  >
                    Loads
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[110px]">Date</TableHead>
                      <TableHead>Activity & Reference</TableHead>
                      <TableHead className="w-[90px] text-center">Type</TableHead>
                      <TableHead className="w-[100px] text-right">Amount</TableHead>
                      <TableHead className="w-[110px] text-right">Resulting Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="text-muted-foreground text-xs font-medium">{record.date}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-foreground text-sm leading-none font-medium">{record.title}</p>
                            {record.subtitle && <p className="text-muted-foreground text-xs">{record.subtitle}</p>}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {record.type === 'activation' && (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-normal text-emerald-700 dark:text-emerald-400"
                            >
                              Activation
                            </Badge>
                          )}
                          {record.type === 'reload' && (
                            <Badge
                              variant="outline"
                              className="border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-normal text-blue-700 dark:text-blue-400"
                            >
                              Reload
                            </Badge>
                          )}
                          {record.type === 'redemption' && (
                            <Badge variant="secondary" className="px-2 py-0.5 text-xs font-normal">
                              Redemption
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right text-sm font-medium tabular-nums',
                            record.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                          )}
                        >
                          {record.amount > 0
                            ? `+$${record.amount.toFixed(2)}`
                            : `-$${Math.abs(record.amount).toFixed(2)}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right font-mono text-sm tabular-nums">
                          ${record.balanceAfter.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            <CardFooter className="border-border text-muted-foreground flex flex-col gap-3 border-t p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="text-primary size-4 shrink-0" />
                <span>Protected by 256-bit encryption · Zero liability policy</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hover:text-foreground flex min-h-6 items-center gap-1 underline-offset-4 hover:underline"
                  onClick={checkBalance}
                >
                  <RefreshCw className="size-3" />
                  Refresh Ledger
                </button>
              </div>
            </CardFooter>
          </Card>

          {/* Digital Passbook Barcode Card */}
          <Card className="border-border bg-muted/20 shadow-xs">
            <CardContent className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row sm:p-5">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-foreground flex items-center justify-center gap-2 text-sm font-semibold sm:justify-start">
                  <Wallet className="text-primary size-4" />
                  In-Store Digital Pass
                </h4>
                <p className="text-muted-foreground max-w-sm text-xs">
                  Present this barcode at checkout in any physical store location to scan and redeem card funds.
                </p>
              </div>

              {/* Barcode Simulation */}
              <div className="border-border bg-card flex flex-col items-center gap-1.5 rounded-lg border p-3 shadow-xs">
                <div className="flex h-10 items-end gap-[3px] px-2" aria-hidden="true">
                  <div className="bg-foreground h-full w-[2px]" />
                  <div className="bg-foreground h-full w-[4px]" />
                  <div className="bg-foreground h-full w-[1px]" />
                  <div className="bg-foreground h-full w-[3px]" />
                  <div className="bg-foreground h-full w-[2px]" />
                  <div className="bg-foreground h-full w-[5px]" />
                  <div className="bg-foreground h-full w-[1px]" />
                  <div className="bg-foreground h-full w-[3px]" />
                  <div className="bg-foreground h-full w-[2px]" />
                  <div className="bg-foreground h-full w-[4px]" />
                  <div className="bg-foreground h-full w-[2px]" />
                  <div className="bg-foreground h-full w-[1px]" />
                  <div className="bg-foreground h-full w-[4px]" />
                  <div className="bg-foreground h-full w-[2px]" />
                  <div className="bg-foreground h-full w-[3px]" />
                </div>
                <span className="text-muted-foreground font-mono text-xs tracking-widest">{cardNumber}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GiftCardBalanceChecker
