<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

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

const cardNumber = ref('7482 - 9104 - 6382 - 8492')
const securityPin = ref('4829')
const isChecking = ref(false)
const isVerified = ref(true)
const copied = ref(false)
const applied = ref(false)
const feedbackMessage = ref<string | null>(null)
const filterType = ref<'all' | 'redemptions' | 'loads'>('all')
const transactions = ref<TransactionRecord[]>(initialTransactions)

function formatCardInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})(?=.)/g, '$1 - ')
}

function handleCardNumberChange(e: Event) {
  const target = e.target as HTMLInputElement
  const formatted = formatCardInput(target.value)
  cardNumber.value = formatted
  target.value = formatted
}

function handlePinChange(e: Event) {
  const target = e.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '').slice(0, 4)
  securityPin.value = digits
  target.value = digits
}

const currentBalance = computed(() => {
  if (transactions.value.length === 0) return 0
  return transactions.value[0].balanceAfter
})

const totalLoaded = computed(() => {
  return transactions.value.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
})

const totalSpent = computed(() => {
  return Math.abs(transactions.value.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
})

const lastFourDigits = computed(() => {
  const digits = cardNumber.value.replace(/\D/g, '')
  return digits.length >= 4 ? digits.slice(-4) : '8492'
})

const filteredTransactions = computed(() => {
  if (filterType.value === 'redemptions') {
    return transactions.value.filter((t) => t.type === 'redemption')
  }
  if (filterType.value === 'loads') {
    return transactions.value.filter((t) => t.type === 'activation' || t.type === 'reload')
  }
  return transactions.value
})

function checkBalance() {
  isChecking.value = true
  feedbackMessage.value = null
  setTimeout(() => {
    isChecking.value = false
    isVerified.value = true
    feedbackMessage.value = `Gift card verified. Current active balance is $${currentBalance.value.toFixed(2)}.`
    setTimeout(() => {
      feedbackMessage.value = null
    }, 4000)
  }, 500)
}

function copyCardNumber() {
  const raw = cardNumber.value.replace(/\s+/g, '')
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(raw)
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function applyToOrder() {
  copyCardNumber()
  applied.value = true
  feedbackMessage.value = `Card ending in ${lastFourDigits.value} copied and applied to your checkout session!`
  setTimeout(() => {
    applied.value = false
    feedbackMessage.value = null
  }, 4000)
}

function reloadFunds(amount: number) {
  const newBalance = currentBalance.value + amount
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
  transactions.value = [newRecord, ...transactions.value]
  feedbackMessage.value = `Successfully reloaded +$${amount.toFixed(2)}! New card balance: $${newBalance.toFixed(2)}.`
  setTimeout(() => {
    feedbackMessage.value = null
  }, 4000)
}
</script>

<template>
  <div data-slot="gift-card-balance-checker" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h2 class="text-foreground text-2xl font-bold tracking-tight">Check Gift Card Balance</h2>
          <Badge variant="outline" class="bg-primary/5 text-primary border-primary/20 gap-1">
            <Sparkles class="text-primary size-3" />
            Storefront Pass
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Check your remaining card balance, review past order redemptions, or reload funds.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <TooltipProvider :delay-duration="150">
          <Tooltip>
            <TooltipTrigger as-child>
              <div
                class="border-border bg-card text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs shadow-xs"
              >
                <HelpCircle class="text-primary size-3.5" />
                <span>PIN & Card Guide</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" class="max-w-xs text-xs">
              Locate the 16-digit card code on the back of your physical card or inside your digital gift email. The
              4-digit security PIN is under the scratch-off foil.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>

    <!-- Feedback Banner if active -->
    <div
      v-if="feedbackMessage"
      class="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-700 dark:text-emerald-300"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>{{ feedbackMessage }}</span>
      </div>
    </div>

    <!-- 2-Column Storefront Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Lookup Form & Digital Card Hero -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Lookup Card Form -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base font-semibold">Card Lookup</CardTitle>
              <Badge
                v-if="isVerified"
                variant="outline"
                class="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
              >
                <Check class="size-3" />
                Active Card
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Enter your gift card credentials to view live balance and activity.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4 pb-4">
            <!-- 16-Digit Card Number Input -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="gc-number-input" class="text-foreground text-xs font-medium"> 16-Digit Card Number </label>
                <TooltipProvider :delay-duration="150">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground inline-flex items-center focus-visible:outline-none"
                        aria-label="Gift card number info"
                      >
                        <HelpCircle class="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" class="max-w-xs text-xs">
                      Enter the 16 digits on the back of your card or in your receipt email.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Input
                id="gc-number-input"
                :model-value="cardNumber"
                placeholder="XXXX - XXXX - XXXX - XXXX"
                maxlength="25"
                class="font-mono text-sm"
                :prefix-icon="CreditCard"
                @input="handleCardNumberChange"
              />
            </div>

            <!-- 4-Digit Security PIN Input -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="gc-pin-input" class="text-foreground text-xs font-medium"> Security PIN (4 digits) </label>
                <TooltipProvider :delay-duration="150">
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground inline-flex items-center focus-visible:outline-none"
                        aria-label="Security PIN info"
                      >
                        <HelpCircle class="size-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" class="max-w-xs text-xs">
                      The 4-digit PIN is revealed by scratching the silver foil or listed in your digital claim email.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Input
                id="gc-pin-input"
                :model-value="securityPin"
                type="password"
                placeholder="••••"
                maxlength="4"
                show-password-toggle
                class="font-mono text-sm"
                :prefix-icon="Lock"
                @input="handlePinChange"
              />
            </div>

            <Button type="button" class="w-full font-medium" :disabled="isChecking" @click="checkBalance">
              <RefreshCw v-if="isChecking" class="mr-2 size-4 animate-spin" />
              <ShieldCheck v-else class="mr-2 size-4" />
              {{ isChecking ? 'Verifying Balance...' : 'Check Balance' }}
            </Button>
          </CardContent>
        </Card>

        <!-- Stylized Digital Gift Card Hero Display -->
        <div
          class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-900 p-6 text-white shadow-lg"
        >
          <!-- Ambient Glow Layer -->
          <div
            class="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-emerald-500/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            class="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-indigo-500/15 blur-3xl"
            aria-hidden="true"
          />

          <div class="relative flex flex-col justify-between space-y-6">
            <!-- Card Top Bar: Brand & Pass Badge -->
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  class="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white shadow-inner backdrop-blur-md"
                >
                  <Gift class="size-5 text-emerald-400" />
                </div>
                <div>
                  <p class="text-xs font-bold tracking-wider text-neutral-200 uppercase">Lumen Store</p>
                  <p class="text-xs text-neutral-400">Digital Gift Pass</p>
                </div>
              </div>

              <Badge
                variant="outline"
                class="gap-1.5 border-white/20 bg-white/10 px-2.5 py-0.5 text-xs text-white backdrop-blur-md"
              >
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                Verified Active
              </Badge>
            </div>

            <!-- Card Center: Chip Icon & Balance Display -->
            <div class="space-y-1 pt-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium tracking-wider text-neutral-400 uppercase">Available Balance</span>
                <!-- Chip graphic representation -->
                <div class="flex items-center gap-1 opacity-70">
                  <div
                    class="h-5 w-7 rounded-sm border border-amber-300/40 bg-gradient-to-tr from-amber-400/20 to-amber-200/40"
                  />
                  <span class="font-mono text-xs tracking-tighter text-neutral-400">NFC</span>
                </div>
              </div>

              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
                  ${{ currentBalance.toFixed(2) }}
                </span>
                <span class="text-xs font-medium text-emerald-400">USD</span>
              </div>
            </div>

            <!-- Card Footer: Card Number & Expiry terms -->
            <div class="space-y-2 border-t border-white/10 pt-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-sm tracking-widest text-neutral-200">
                    •••• •••• •••• {{ lastFourDigits }}
                  </span>
                  <button
                    type="button"
                    class="rounded p-1 text-neutral-400 transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:outline-none"
                    aria-label="Copy card number"
                    @click="copyCardNumber"
                  >
                    <Check v-if="copied" class="size-3.5 text-emerald-400" />
                    <Copy v-else class="size-3.5" />
                  </button>
                </div>
                <span v-if="copied" class="animate-in fade-in text-xs font-medium text-emerald-400"> Copied! </span>
              </div>

              <div class="flex items-center justify-between text-xs text-neutral-400">
                <span>Never Expires · No Inactivity Fees</span>
                <span class="font-mono text-neutral-500">PIN: ••••</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="space-y-3">
          <Button variant="default" class="w-full font-medium" @click="applyToOrder">
            <Check v-if="applied" class="mr-2 size-4 text-emerald-300" />
            <ShoppingBag v-else class="mr-2 size-4" />
            {{ applied ? 'Applied to Checkout!' : 'Apply to Next Order' }}
          </Button>

          <!-- Quick Reload Card -->
          <Card class="border-border shadow-xs">
            <CardHeader class="p-4 pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Quick Reload Funds
                </CardTitle>
                <Plus class="text-muted-foreground size-3.5" />
              </div>
            </CardHeader>
            <CardContent class="p-4 pt-0">
              <p class="text-muted-foreground mb-3 text-xs">
                Top up your gift card instantly with a saved payment method.
              </p>
              <div class="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full font-medium tabular-nums"
                  @click="reloadFunds(25)"
                >
                  + $25.00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full font-medium tabular-nums"
                  @click="reloadFunds(50)"
                >
                  + $50.00
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="hover:bg-primary/5 hover:text-primary hover:border-primary/30 w-full font-medium tabular-nums"
                  @click="reloadFunds(100)"
                >
                  + $100.00
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Right Column: Balance Stats & Redemption History Table -->
      <div class="space-y-6 lg:col-span-7">
        <!-- Passbook Summary Metrics -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="border-border bg-card rounded-xl border p-4 shadow-xs">
            <div class="text-muted-foreground mb-1 flex items-center justify-between text-xs">
              <span>Available Balance</span>
              <Wallet class="text-primary size-3.5" />
            </div>
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">
              ${{ currentBalance.toFixed(2) }}
            </p>
            <p class="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check class="size-3" />
              Ready to spend
            </p>
          </div>

          <div class="border-border bg-card rounded-xl border p-4 shadow-xs">
            <div class="text-muted-foreground mb-1 flex items-center justify-between text-xs">
              <span>Total Value Loaded</span>
              <ArrowDownLeft class="size-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">${{ totalLoaded.toFixed(2) }}</p>
            <p class="text-muted-foreground mt-1 text-xs">All top-ups & issue</p>
          </div>

          <div class="border-border bg-card rounded-xl border p-4 shadow-xs">
            <div class="text-muted-foreground mb-1 flex items-center justify-between text-xs">
              <span>Total Redeemed</span>
              <ArrowUpRight class="text-muted-foreground size-3.5" />
            </div>
            <p class="text-foreground text-2xl font-bold tracking-tight tabular-nums">-${{ totalSpent.toFixed(2) }}</p>
            <p class="text-muted-foreground mt-1 text-xs">Past store orders</p>
          </div>
        </div>

        <!-- Redemption & Activity History Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold">Redemption & Activity History</CardTitle>
                <CardDescription class="text-xs">
                  Detailed ledger of card issuance, promotional top-ups, and store checkouts.
                </CardDescription>
              </div>

              <!-- Filter Pills -->
              <div class="border-border bg-muted/40 flex items-center gap-1.5 rounded-lg border p-1 text-xs">
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded px-2.5 py-1 font-medium transition-colors',
                      filterType === 'all'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="filterType = 'all'"
                >
                  All ({{ transactions.length }})
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded px-2.5 py-1 font-medium transition-colors',
                      filterType === 'redemptions'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="filterType = 'redemptions'"
                >
                  Redemptions
                </button>
                <button
                  type="button"
                  :class="
                    cn(
                      'rounded px-2.5 py-1 font-medium transition-colors',
                      filterType === 'loads'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="filterType = 'loads'"
                >
                  Loads
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[110px]">Date</TableHead>
                    <TableHead>Activity & Reference</TableHead>
                    <TableHead class="w-[90px] text-center">Type</TableHead>
                    <TableHead class="w-[100px] text-right">Amount</TableHead>
                    <TableHead class="w-[110px] text-right">Resulting Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="record in filteredTransactions" :key="record.id">
                    <TableCell class="text-muted-foreground text-xs font-medium">
                      {{ record.date }}
                    </TableCell>
                    <TableCell>
                      <div class="space-y-0.5">
                        <p class="text-foreground text-sm leading-none font-medium">
                          {{ record.title }}
                        </p>
                        <p v-if="record.subtitle" class="text-muted-foreground text-xs">
                          {{ record.subtitle }}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell class="text-center">
                      <Badge
                        v-if="record.type === 'activation'"
                        variant="outline"
                        class="border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-normal text-emerald-700 dark:text-emerald-400"
                      >
                        Activation
                      </Badge>
                      <Badge
                        v-else-if="record.type === 'reload'"
                        variant="outline"
                        class="border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-normal text-blue-700 dark:text-blue-400"
                      >
                        Reload
                      </Badge>
                      <Badge v-else variant="secondary" class="px-2 py-0.5 text-xs font-normal"> Redemption </Badge>
                    </TableCell>
                    <TableCell
                      :class="
                        cn(
                          'text-right text-sm font-medium tabular-nums',
                          record.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                        )
                      "
                    >
                      {{
                        record.amount > 0 ? `+$${record.amount.toFixed(2)}` : `-$${Math.abs(record.amount).toFixed(2)}`
                      }}
                    </TableCell>
                    <TableCell class="text-muted-foreground text-right font-mono text-sm tabular-nums">
                      ${{ record.balanceAfter.toFixed(2) }}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter
            class="border-border text-muted-foreground flex flex-col gap-3 border-t p-4 text-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-1.5">
              <ShieldCheck class="text-primary size-4 shrink-0" />
              <span>Protected by 256-bit encryption · Zero liability policy</span>
            </div>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="hover:text-foreground flex min-h-6 items-center gap-1 underline-offset-4 hover:underline"
                @click="checkBalance"
              >
                <RefreshCw class="size-3" />
                Refresh Ledger
              </button>
            </div>
          </CardFooter>
        </Card>

        <!-- Digital Passbook Barcode Card -->
        <Card class="border-border bg-muted/20 shadow-xs">
          <CardContent class="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row sm:p-5">
            <div class="space-y-1 text-center sm:text-left">
              <h4 class="text-foreground flex items-center justify-center gap-2 text-sm font-semibold sm:justify-start">
                <Wallet class="text-primary size-4" />
                In-Store Digital Pass
              </h4>
              <p class="text-muted-foreground max-w-sm text-xs">
                Present this barcode at checkout in any physical store location to scan and redeem card funds.
              </p>
            </div>

            <!-- Barcode Simulation -->
            <div class="border-border bg-card flex flex-col items-center gap-1.5 rounded-lg border p-3 shadow-xs">
              <div class="flex h-10 items-end gap-[3px] px-2" aria-hidden="true">
                <div class="bg-foreground h-full w-[2px]" />
                <div class="bg-foreground h-full w-[4px]" />
                <div class="bg-foreground h-full w-[1px]" />
                <div class="bg-foreground h-full w-[3px]" />
                <div class="bg-foreground h-full w-[2px]" />
                <div class="bg-foreground h-full w-[5px]" />
                <div class="bg-foreground h-full w-[1px]" />
                <div class="bg-foreground h-full w-[3px]" />
                <div class="bg-foreground h-full w-[2px]" />
                <div class="bg-foreground h-full w-[4px]" />
                <div class="bg-foreground h-full w-[2px]" />
                <div class="bg-foreground h-full w-[1px]" />
                <div class="bg-foreground h-full w-[4px]" />
                <div class="bg-foreground h-full w-[2px]" />
                <div class="bg-foreground h-full w-[3px]" />
              </div>
              <span class="text-muted-foreground font-mono text-xs tracking-widest">
                {{ cardNumber }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
