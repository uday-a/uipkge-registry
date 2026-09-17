'use client'

import * as React from 'react'
import {
  Check,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

interface VirtualCard {
  id: string
  name: string
  brand: 'mastercard' | 'visa'
  last4: string
  fullNumber: string
  holder: string
  avatar: string
  initials: string
  expiry: string
  cvv: string
  spent: number
  limit: number
  type: 'Monthly Recurring' | 'Single-use'
  status: 'Active' | 'Frozen'
  billingCycle: string
  purpose: string
}

const initialCards: VirtualCard[] = [
  {
    id: 'vc-1',
    name: 'AWS & Cloud Infrastructure',
    brand: 'mastercard',
    last4: '8492',
    fullNumber: '5532 8920 4108 8492',
    holder: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: 'ER',
    expiry: '08/29',
    cvv: '482',
    spent: 4200,
    limit: 5000,
    type: 'Monthly Recurring',
    status: 'Active',
    billingCycle: 'Resets on 1st of month',
    purpose: 'Cloud compute, S3 buckets, and RDS instances',
  },
  {
    id: 'vc-2',
    name: 'Marketing & Ad Spend',
    brand: 'visa',
    last4: '3190',
    fullNumber: '4012 8831 9204 3190',
    holder: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    initials: 'MC',
    expiry: '11/28',
    cvv: '915',
    spent: 8750,
    limit: 10000,
    type: 'Monthly Recurring',
    status: 'Active',
    billingCycle: 'Resets on 1st of month',
    purpose: 'Google Ads, LinkedIn campaigns, and Meta Ads',
  },
  {
    id: 'vc-3',
    name: 'Travel & Conferences',
    brand: 'visa',
    last4: '6021',
    fullNumber: '4111 5900 1284 6021',
    holder: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    initials: 'SJ',
    expiry: '03/27',
    cvv: '304',
    spent: 1850,
    limit: 2500,
    type: 'Single-use',
    status: 'Frozen',
    billingCycle: 'Single event allowance',
    purpose: 'Q3 Design Systems Summit flights and lodging',
  },
  {
    id: 'vc-4',
    name: 'SaaS Subscriptions',
    brand: 'mastercard',
    last4: '9455',
    fullNumber: '5241 7719 3302 9455',
    holder: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    initials: 'ER',
    expiry: '05/29',
    cvv: '729',
    spent: 620,
    limit: 1200,
    type: 'Monthly Recurring',
    status: 'Active',
    billingCycle: 'Resets on 1st of month',
    purpose: 'GitHub Enterprise, Figma, and Slack licenses',
  },
]

export interface VirtualCardManagerProps {
  className?: string
}

export function VirtualCardManager({ className }: VirtualCardManagerProps) {
  const [cards, setCards] = React.useState<VirtualCard[]>(initialCards)
  const [selectedId, setSelectedId] = React.useState<string>('vc-1')
  const [showDetails, setShowDetails] = React.useState<boolean>(false)
  const [copied, setCopied] = React.useState<boolean>(false)
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null)

  const selectedCard = cards.find((c) => c.id === selectedId) ?? cards[0]
  const isSelectedFrozen = selectedCard?.status === 'Frozen'
  const selectedPercent =
    selectedCard && selectedCard.limit > 0
      ? Math.min(100, Math.round((selectedCard.spent / selectedCard.limit) * 100))
      : 0

  const showFeedback = React.useCallback((msg: string) => {
    setActionFeedback(msg)
    setTimeout(() => {
      setActionFeedback((prev) => (prev === msg ? null : prev))
    }, 3000)
  }, [])

  const toggleFreeze = React.useCallback((id: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Frozen' : 'Active'
          return { ...c, status: nextStatus }
        }
        return c
      }),
    )
  }, [])

  const handleCopyNumber = React.useCallback(() => {
    if (!selectedCard) return
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(selectedCard.fullNumber.replace(/\s+/g, ''))
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedCard])

  const adjustLimit = React.useCallback(
    (cardId: string) => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === cardId) {
            const newLimit = c.limit === 5000 ? 7500 : c.limit === 10000 ? 12000 : c.limit + 1000
            return { ...c, limit: newLimit }
          }
          return c
        }),
      )
      const current = cards.find((c) => c.id === cardId)
      const newLimit = current
        ? current.limit === 5000
          ? 7500
          : current.limit === 10000
            ? 12000
            : current.limit + 1000
        : 0
      showFeedback(`Limit updated to $${newLimit.toLocaleString()}`)
    },
    [cards, showFeedback],
  )

  const terminateCard = React.useCallback(
    (cardId: string) => {
      if (cards.length <= 1) {
        showFeedback('Cannot terminate the last remaining card')
        return
      }
      const remaining = cards.filter((c) => c.id !== cardId)
      setCards(remaining)
      if (selectedId === cardId) {
        setSelectedId(remaining[0].id)
      }
      showFeedback('Card terminated permanently')
    },
    [cards, selectedId, showFeedback],
  )

  const issueNewCard = React.useCallback(() => {
    const newId = `vc-${Date.now().toString().slice(-4)}`
    const newLast4 = Math.floor(1000 + Math.random() * 9000).toString()
    const newCard: VirtualCard = {
      id: newId,
      name: 'AI & API Workloads',
      brand: 'visa',
      last4: newLast4,
      fullNumber: `4400 1284 9912 ${newLast4}`,
      holder: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: 'ER',
      expiry: '09/30',
      cvv: '814',
      spent: 0,
      limit: 3000,
      type: 'Monthly Recurring',
      status: 'Active',
      billingCycle: 'Resets on 1st of month',
      purpose: 'OpenAI, Anthropic, and Vector DB infrastructure',
    }
    setCards((prev) => [newCard, ...prev])
    setSelectedId(newId)
    showFeedback('New virtual card issued successfully')
  }, [showFeedback])

  return (
    <div data-slot="virtual-card-manager" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">Virtual Cards</h2>
            <Badge wrap variant="secondary" className="font-mono text-xs tabular-nums">
              {cards.length} Cards
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Generate instant corporate cards for subscriptions, vendors, and team expense limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5 shadow-xs" onClick={issueNewCard}>
            <Plus className="size-4" />
            Issue New Card
          </Button>
        </div>
      </div>

      {/* Notification / Action feedback */}
      {actionFeedback && (
        <div className="bg-primary/10 text-primary border-primary/20 flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs font-medium transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <Button
            aria-label="Dismiss notification"
            variant="ghost"
            size="xs"
            className="h-6 px-2 text-xs"
            onClick={() => setActionFeedback(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Virtual Card Visual Hero */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">{selectedCard.name}</CardTitle>
                <Badge wrap variant={selectedCard.status === 'Active' ? 'success' : 'warning'} className="text-xs">
                  {selectedCard.status}
                </Badge>
              </div>
              <CardDescription className="mt-0.5 text-xs">
                {selectedCard.purpose} · {selectedCard.billingCycle}
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="font-mono text-xs">
              Ending in {selectedCard.last4}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Stylized Dark Credit Card Container */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div
                className={cn(
                  'relative aspect-[1.586/1] w-full rounded-2xl p-6 text-white transition-all duration-300 lg:max-w-[420px]',
                  'border border-zinc-700/60 bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 shadow-xl',
                  isSelectedFrozen && 'contrast-95 grayscale filter',
                )}
              >
                {/* Ambient light accents */}
                <div
                  className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-indigo-500/15 blur-2xl"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-500/10 blur-2xl"
                  aria-hidden="true"
                />

                {/* Frozen watermark overlay */}
                {isSelectedFrozen && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-950/70 backdrop-blur-xs">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-amber-200 uppercase">
                      <Snowflake className="size-3.5" />
                      Card Frozen
                    </div>
                    <p className="text-xs text-zinc-400">Transactions are currently blocked</p>
                  </div>
                )}

                {/* Top Row: Chip & Contactless + Brand Logo */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Metallic EMV Chip */}
                    <div
                      className="relative flex h-8 w-11 items-center justify-center rounded-md border border-amber-300/40 bg-gradient-to-br from-amber-200/30 via-amber-400/20 to-amber-600/30 shadow-inner"
                      aria-hidden="true"
                    >
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 border-amber-300/30">
                        <div className="border-r border-b border-amber-400/30" />
                        <div className="border-r border-b border-amber-400/30" />
                        <div className="border-b border-amber-400/30" />
                        <div className="border-r border-amber-400/30" />
                        <div className="border-r border-amber-400/30" />
                        <div />
                      </div>
                    </div>

                    {/* NFC Wave icon */}
                    <div className="rotate-90 text-zinc-400/80" aria-hidden="true">
                      <Radio className="size-4" />
                    </div>
                  </div>

                  {/* Brand Indicator */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-medium tracking-wider text-zinc-400 uppercase">
                      Virtual
                    </span>
                    {selectedCard.brand === 'mastercard' ? (
                      <div className="flex -space-x-2" aria-label="Mastercard">
                        <div className="size-6 rounded-full bg-red-500/90" />
                        <div className="size-6 rounded-full bg-amber-400/90 mix-blend-screen" />
                      </div>
                    ) : (
                      <div className="text-base font-bold tracking-widest text-zinc-100 italic" aria-label="Visa">
                        VISA
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle Row: Card Number & Quick Actions */}
                <div className="relative z-10 my-auto pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-lg font-medium tracking-[0.16em] text-zinc-100 tabular-nums drop-shadow-sm sm:text-xl">
                      {showDetails ? selectedCard.fullNumber : `•••• •••• •••• ${selectedCard.last4}`}
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 text-zinc-300 hover:bg-white/10 hover:text-white"
                        aria-label={showDetails ? 'Hide card number' : 'Reveal card number'}
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="size-7 text-zinc-300 hover:bg-white/10 hover:text-white"
                        aria-label="Copy card number"
                        onClick={handleCopyNumber}
                      >
                        {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Cardholder, Expiry, CVV */}
                <div className="relative z-10 flex items-end justify-between pt-2">
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs tracking-wider text-zinc-400 uppercase">Cardholder</p>
                    <p className="max-w-[140px] truncate text-xs font-semibold tracking-wide text-zinc-200 uppercase">
                      {selectedCard.holder}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-mono text-xs tracking-wider text-zinc-400 uppercase">Expires</p>
                    <p className="font-mono text-xs font-medium text-zinc-200 tabular-nums">{selectedCard.expiry}</p>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <p className="font-mono text-xs tracking-wider text-zinc-400 uppercase">CVV</p>
                    <p className="font-mono text-xs font-medium text-zinc-200 tabular-nums">
                      {showDetails ? selectedCard.cvv : '•••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Controls & Spending Breakdown */}
            <div className="space-y-6 lg:col-span-6 xl:col-span-7">
              {/* Spending Limit Meter */}
              <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Spending Limit</span>
                  <span className="text-muted-foreground font-mono text-xs tabular-nums">
                    ${selectedCard.spent.toLocaleString()} / ${selectedCard.limit.toLocaleString()}
                  </span>
                </div>

                <Progress value={selectedPercent} className="h-2" />

                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium tabular-nums">
                    ${Math.max(0, selectedCard.limit - selectedCard.spent).toLocaleString()} available
                  </span>
                  <span className="font-medium tabular-nums">{selectedPercent}% utilized</span>
                </div>
              </div>

              {/* Card Controls Row */}
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Freeze Card Toggle */}
                <div className="border-border bg-card flex items-center justify-between rounded-lg border p-3 sm:flex-col sm:items-start sm:justify-between sm:gap-2">
                  <div className="space-y-0.5">
                    <p className="text-foreground text-xs font-medium">Freeze Card</p>
                    <p className="text-muted-foreground text-xs">Block charges</p>
                  </div>
                  <Switch
                    checked={isSelectedFrozen}
                    size="sm"
                    aria-label="Toggle card freeze status"
                    onCheckedChange={() => toggleFreeze(selectedCard.id)}
                  />
                </div>

                {/* Change Limit Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto flex-col items-start gap-1 p-3 text-left"
                  onClick={() => adjustLimit(selectedCard.id)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-foreground text-xs font-medium">Adjust Limit</span>
                    <SlidersHorizontal className="text-muted-foreground size-3.5" />
                  </div>
                  <span className="text-muted-foreground text-xs font-normal">Edit monthly cap</span>
                </Button>

                {/* Terminate Card Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border h-auto flex-col items-start gap-1 p-3 text-left"
                  onClick={() => terminateCard(selectedCard.id)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-medium">Terminate</span>
                    <Trash2 className="size-3.5" />
                  </div>
                  <span className="text-muted-foreground text-xs font-normal">Close permanently</span>
                </Button>
              </div>

              {/* Card Meta Specs */}
              <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-xs">Cardholder</span>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Avatar size="xs" className="size-4.5">
                      <AvatarImage src={selectedCard.avatar} alt={selectedCard.holder} />
                      <AvatarFallback className="text-xs">{selectedCard.initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-xs font-medium">{selectedCard.holder}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-xs">Card Type</span>
                  <p className="text-foreground text-xs font-medium">{selectedCard.type}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-xs">Fraud Protection</span>
                  <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-3.5" />
                    <span>3D Secure Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Cards Grid / Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Active Cards List</CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                All company virtual cards currently assigned to team members and services.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="font-mono text-xs tabular-nums">
              {cards.length} Issued
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-border divide-y">
            {cards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  'group flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
                  selectedId === card.id ? 'bg-muted/40' : 'hover:bg-muted/20',
                )}
              >
                {/* Card Identity & Number */}
                <div className="flex min-w-0 items-center gap-3.5 sm:w-1/3">
                  <div
                    className={cn(
                      'border-border flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs transition-transform',
                      card.status === 'Frozen' ? 'bg-muted/60 text-muted-foreground' : 'bg-primary/10 text-primary',
                    )}
                  >
                    <CreditCard className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground truncate text-sm font-medium">{card.name}</p>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span className="font-mono tabular-nums">•••• {card.last4}</span>
                      <span>·</span>
                      <span className="uppercase">{card.brand}</span>
                    </div>
                  </div>
                </div>

                {/* Cardholder Avatar & Name */}
                <div className="flex items-center gap-2 sm:w-1/5">
                  <Avatar size="sm">
                    <AvatarImage src={card.avatar} alt={card.holder} />
                    <AvatarFallback>{card.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-xs font-medium">{card.holder}</p>
                    <p className="text-muted-foreground truncate text-xs">{card.type}</p>
                  </div>
                </div>

                {/* Spending Limit & Progress */}
                <div className="space-y-1.5 sm:w-1/4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-mono font-medium tabular-nums">
                      ${card.spent.toLocaleString()} / ${card.limit.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground font-mono tabular-nums">
                      {Math.round((card.spent / card.limit) * 100)}%
                    </span>
                  </div>
                  <Progress value={Math.min(100, Math.round((card.spent / card.limit) * 100))} className="h-1.5" />
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <Badge wrap variant={card.status === 'Active' ? 'success' : 'warning'} className="text-xs">
                    {card.status}
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant={selectedId === card.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedId(card.id)}
                    >
                      {selectedId === card.id ? 'Viewing' : 'View Card'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={card.status === 'Active' ? 'Freeze card' : 'Unfreeze card'}
                      onClick={() => toggleFreeze(card.id)}
                    >
                      {card.status === 'Active' ? (
                        <Snowflake className="text-muted-foreground size-4" />
                      ) : (
                        <Zap className="size-4 text-amber-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
