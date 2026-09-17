<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowDownLeft,
  ArrowDownUp,
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  Copy,
  Fuel,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const copied = ref(false)
const fullAddress = '0x71C856402244243b92834b9d09c2534575823a9F'
const shortAddress = '0x71C...3a9F'

function copyAddress() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(fullAddress)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

interface Asset {
  id: string
  name: string
  symbol: string
  price: string
  rawPrice: number
  change24h: string
  isPositive: boolean
  balance: string
  rawBalance: number
  fiatValue: string
  allocation: string
  color: string
}

const assets: Asset[] = [
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,450.00',
    rawPrice: 3450.0,
    change24h: '+3.2%',
    isPositive: true,
    balance: '24.5 ETH',
    rawBalance: 24.5,
    fiatValue: '$84,525.00',
    allocation: '56.8%',
    color: '#627EEA',
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$64,200.00',
    rawPrice: 64200.0,
    change24h: '+1.8%',
    isPositive: true,
    balance: '0.58 BTC',
    rawBalance: 0.58,
    fiatValue: '$37,236.00',
    allocation: '25.0%',
    color: '#F7931A',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    price: '$148.50',
    rawPrice: 148.5,
    change24h: '-1.1%',
    isPositive: false,
    balance: '120.4 SOL',
    rawBalance: 120.4,
    fiatValue: '$17,879.40',
    allocation: '12.0%',
    color: '#14F195',
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    price: '$1.00',
    rawPrice: 1.0,
    change24h: '+0.01%',
    isPositive: true,
    balance: '7,450.00 USDC',
    rawBalance: 7450.0,
    fiatValue: '$7,450.00',
    allocation: '5.0%',
    color: '#2775CA',
  },
  {
    id: 'link',
    name: 'Chainlink',
    symbol: 'LINK',
    price: '$18.30',
    rawPrice: 18.3,
    change24h: '+5.4%',
    isPositive: true,
    balance: '100.0 LINK',
    rawBalance: 100.0,
    fiatValue: '$1,830.10',
    allocation: '1.2%',
    color: '#375BD2',
  },
]

// Quick Swap State
const fromTokenSymbol = ref('ETH')
const toTokenSymbol = ref('USDC')
const payAmount = ref('1.5')
const slippage = ref('0.5')
const isSwapping = ref(false)
const swapSuccess = ref(false)

function selectTradePair(symbol: string) {
  fromTokenSymbol.value = symbol
  toTokenSymbol.value = symbol === 'USDC' ? 'ETH' : 'USDC'
}

const tokenMap = computed(() => {
  const map: Record<string, Asset> = {}
  for (const asset of assets) {
    map[asset.symbol] = asset
  }
  return map
})

const fromAsset = computed(() => tokenMap.value[fromTokenSymbol.value] || assets[0])
const toAsset = computed(() => tokenMap.value[toTokenSymbol.value] || assets[3])

const calculatedReceive = computed(() => {
  const amount = parseFloat(payAmount.value) || 0
  if (amount <= 0) return '0.00'
  const fromFiat = amount * fromAsset.value.rawPrice
  const receiveUnits = fromFiat / toAsset.value.rawPrice
  if (toAsset.value.rawPrice >= 100) {
    return receiveUnits.toFixed(4)
  }
  return receiveUnits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const fiatPayFormatted = computed(() => {
  const amount = parseFloat(payAmount.value) || 0
  return (amount * fromAsset.value.rawPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
})

const fiatReceiveFormatted = computed(() => {
  const amount = parseFloat(payAmount.value) || 0
  return (amount * fromAsset.value.rawPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
})

const exchangeRateFormatted = computed(() => {
  const rate = fromAsset.value.rawPrice / toAsset.value.rawPrice
  const formattedRate =
    rate > 100
      ? rate.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : rate.toLocaleString('en-US', { maximumFractionDigits: 6 })
  return `1 ${fromAsset.value.symbol} ≈ ${formattedRate} ${toAsset.value.symbol}`
})

function flipTokens() {
  const temp = fromTokenSymbol.value
  fromTokenSymbol.value = toTokenSymbol.value
  toTokenSymbol.value = temp
}

function setMaxPay() {
  payAmount.value = String(fromAsset.value.rawBalance)
}

function handleExecuteSwap() {
  isSwapping.value = true
  setTimeout(() => {
    isSwapping.value = false
    swapSuccess.value = true
    setTimeout(() => {
      swapSuccess.value = false
    }, 3000)
  }, 1200)
}
</script>

<template>
  <div data-slot="crypto-wallet-portfolio" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- Header Section -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <div
            class="bg-primary/10 text-primary border-primary/20 flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
            aria-hidden="true"
          >
            <Wallet class="size-5" />
          </div>
          <h1 class="text-foreground text-2xl font-bold tracking-tight">Main Treasury Vault</h1>
          <Badge
            variant="outline"
            class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-normal text-emerald-600 dark:text-emerald-400"
          >
            <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            Ethereum Mainnet
          </Badge>
        </div>

        <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span class="bg-muted/70 text-foreground border-border/80 rounded border px-2 py-0.5 font-mono font-medium">
            {{ shortAddress }}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-foreground size-6"
            aria-label="Copy wallet address"
            @click="copyAddress"
          >
            <Check v-if="copied" class="size-3.5 text-emerald-500" aria-hidden="true" />
            <Copy v-else class="size-3.5" aria-hidden="true" />
          </Button>
          <span class="inline-flex items-center gap-1">
            <ShieldCheck class="text-primary size-3.5" aria-hidden="true" />
            Multi-Sig (3 of 5)
          </span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" class="gap-1.5 shadow-xs">
          <ArrowUpRight class="size-4" aria-hidden="true" />
          Send
        </Button>
        <Button variant="outline" size="sm" class="gap-1.5 shadow-xs">
          <ArrowDownLeft class="size-4" aria-hidden="true" />
          Receive
        </Button>
        <Button size="sm" class="gap-1.5 shadow-xs">
          <ArrowLeftRight class="size-4" aria-hidden="true" />
          Swap
        </Button>
      </div>
    </header>

    <!-- Main Grid: Portfolio Overview + Holdings Table & Quick Swap Calculator -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Hero Portfolio Card & Holdings Table (8 cols) -->
      <div class="space-y-6 lg:col-span-8">
        <!-- Hero Portfolio Balance Card -->
        <Card class="border-border overflow-hidden shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardDescription class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Total Portfolio Value
              </CardDescription>
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span class="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
                Live Oracle Feed
              </div>
            </div>
            <div class="mt-2 flex flex-wrap items-baseline gap-3">
              <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                $148,920.50
              </span>
              <div
                class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
              >
                <TrendingUp class="size-3.5" aria-hidden="true" />
                +$6,420.10 (+4.51%)
                <span class="text-muted-foreground ml-0.5 font-normal">24h</span>
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-4 pt-1">
            <!-- Stacked Allocation Bar -->
            <div class="space-y-2">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span class="text-foreground font-medium">Asset Allocation</span>
                <span class="tabular-nums">5 Assets</span>
              </div>
              <div
                class="bg-muted/60 border-border/50 flex h-3 w-full gap-0.5 overflow-hidden rounded-full border p-0.5"
              >
                <div
                  v-for="asset in assets"
                  :key="asset.id"
                  :style="{ width: asset.allocation, backgroundColor: asset.color }"
                  class="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full hover:opacity-90"
                  :title="`${asset.name} (${asset.symbol}): ${asset.allocation}`"
                />
              </div>

              <!-- Allocation Legend -->
              <div class="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs">
                <div v-for="asset in assets" :key="asset.id" class="flex items-center gap-1.5">
                  <span
                    class="size-2.5 shrink-0 rounded-full shadow-xs"
                    :style="{ backgroundColor: asset.color }"
                    aria-hidden="true"
                  />
                  <span class="text-foreground font-medium">{{ asset.symbol }}</span>
                  <span class="text-muted-foreground tabular-nums">{{ asset.allocation }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Asset Holdings Table Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-foreground text-base font-semibold">Asset Holdings</CardTitle>
                <CardDescription class="text-muted-foreground text-xs">
                  Real-time token prices, balances, and portfolio share.
                </CardDescription>
              </div>
              <Badge variant="secondary" class="text-xs font-normal tabular-nums"> 5 Assets </Badge>
            </div>
          </CardHeader>
          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="pl-6">Asset</TableHead>
                    <TableHead class="text-right">Price (24h)</TableHead>
                    <TableHead class="text-right">Holdings</TableHead>
                    <TableHead class="hidden text-right sm:table-cell">Portfolio Share</TableHead>
                    <TableHead class="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="asset in assets" :key="asset.id" class="hover:bg-muted/40 transition-colors">
                    <!-- Token Icon, Name, Symbol -->
                    <TableCell class="py-3.5 pl-6">
                      <div class="flex items-center gap-3">
                        <!-- Ethereum SVG -->
                        <svg
                          v-if="asset.id === 'eth'"
                          viewBox="0 0 32 32"
                          class="size-8 shrink-0 rounded-full shadow-xs"
                          aria-hidden="true"
                        >
                          <circle cx="16" cy="16" r="16" fill="#627EEA" />
                          <path fill="#ffffff" fill-opacity="0.6" d="M16.5 4v8.87l7.5 3.35z" />
                          <path fill="#ffffff" d="M16.5 4L9 16.22l7.5-3.35z" />
                          <path fill="#ffffff" fill-opacity="0.6" d="M16.5 21.97v6.03L24 17.62z" />
                          <path fill="#ffffff" d="M16.5 28v-6.03L9 17.62z" />
                          <path fill="#ffffff" fill-opacity="0.2" d="M16.5 20.57l7.5-4.35-7.5-3.35z" />
                          <path fill="#ffffff" fill-opacity="0.6" d="M9 16.22l7.5 4.35v-7.7z" />
                        </svg>
                        <!-- Bitcoin SVG -->
                        <svg
                          v-else-if="asset.id === 'btc'"
                          viewBox="0 0 32 32"
                          class="size-8 shrink-0 rounded-full shadow-xs"
                          aria-hidden="true"
                        >
                          <circle cx="16" cy="16" r="16" fill="#F7931A" />
                          <path
                            fill="#ffffff"
                            d="M22.5 13.5c.3-1.9-1.2-2.9-3.2-3.6l.7-2.6-1.6-.4-.6 2.5c-.4-.1-.9-.2-1.3-.3l.6-2.5-1.6-.4-.7 2.6c-.3-.1-.7-.2-1-.2l-2.2-.5-.4 1.7s.9.2.9.2c.5.1.6.4.6.6l-.6 2.5c0 0 .1 0 .2 0l-.2 0-.9 3.5c-.1.2-.3.4-.6.3 0 0-.9-.2-.9-.2l-.8 1.8 2.1.5c.4.1.8.2 1.2.3l-.7 2.7 1.6.4.7-2.6c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.7c2.8.5 4.8.3 5.7-2.2.7-2-.1-3.1-1.5-3.8 1.1-.3 1.8-1 2-2.5zm-3.6 5.4c-.5 2-3.9.9-5 .6l.9-3.6c1.1.3 4.6.8 4.1 3zm.5-5.6c-.5 1.8-3.3.9-4.2.7l.8-3.3c.9.2 3.8.7 3.4 2.6z"
                          />
                        </svg>
                        <!-- Solana SVG -->
                        <svg
                          v-else-if="asset.id === 'sol'"
                          viewBox="0 0 32 32"
                          class="size-8 shrink-0 rounded-full shadow-xs"
                          aria-hidden="true"
                        >
                          <circle cx="16" cy="16" r="16" fill="#14151a" />
                          <path
                            fill="#14F195"
                            d="M8.5 21.8l1.8-1.8c.3-.3.7-.5 1.1-.5h10.4c.5 0 .9.6.6 1l-1.8 1.8c-.3.3-.7.5-1.1.5H9.1c-.5 0-.9-.6-.6-1z"
                          />
                          <path
                            fill="#9945FF"
                            d="M8.5 12.8l1.8-1.8c.3-.3.7-.5 1.1-.5h10.4c.5 0 .9.6.6 1l-1.8 1.8c-.3.3-.7.5-1.1.5H9.1c-.5 0-.9-.6-.6-1z"
                          />
                          <path
                            fill="#00C2FF"
                            d="M23.5 17.3l-1.8 1.8c-.3.3-.7.5-1.1.5H10.2c-.5 0-.9-.6-.6-1l1.8-1.8c.3-.3.7-.5 1.1-.5h10.4c.5 0 .9.6.6 1z"
                          />
                        </svg>
                        <!-- USDC SVG -->
                        <svg
                          v-else-if="asset.id === 'usdc'"
                          viewBox="0 0 32 32"
                          class="size-8 shrink-0 rounded-full shadow-xs"
                          aria-hidden="true"
                        >
                          <circle cx="16" cy="16" r="16" fill="#2775CA" />
                          <path
                            fill="#ffffff"
                            d="M16 6a10 10 0 1010 10A10.01 10.01 0 0016 6zm0 18a8 8 0 118-8 8.01 8.01 0 01-8 8zm1-12h-2v1.1a3.5 3.5 0 00-2 3.1c0 2 1.5 2.7 3 3.1 1.2.3 1.8.6 1.8 1.2s-.6 1.1-1.6 1.1a3.4 3.4 0 01-2.4-.9l-.8 1.4a4.8 4.8 0 003 1.1V20h2v-1.1a3.4 3.4 0 002-3.1c0-2.1-1.6-2.8-3.1-3.2-1.1-.3-1.7-.6-1.7-1.1 0-.5.5-1 1.5-1a3.1 3.1 0 012 .7l.8-1.4a4.5 4.5 0 00-2.5-.9z"
                          />
                        </svg>
                        <!-- Chainlink SVG -->
                        <svg
                          v-else-if="asset.id === 'link'"
                          viewBox="0 0 32 32"
                          class="size-8 shrink-0 rounded-full shadow-xs"
                          aria-hidden="true"
                        >
                          <circle cx="16" cy="16" r="16" fill="#375BD2" />
                          <path
                            fill="#ffffff"
                            d="M16 7l-7.8 4.5v9L16 25l7.8-4.5v-9L16 7zm5.2 12l-5.2 3-5.2-3v-6l5.2-3 5.2 3v6z"
                          />
                        </svg>
                        <div>
                          <div class="text-foreground flex items-center gap-1.5 text-sm font-medium">
                            {{ asset.name }}
                          </div>
                          <div class="text-muted-foreground font-mono text-xs">
                            {{ asset.symbol }}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <!-- Current Price & 24h Change -->
                    <TableCell class="py-3.5 text-right">
                      <div class="text-foreground text-sm font-medium tabular-nums">{{ asset.price }}</div>
                      <div
                        :class="
                          cn(
                            'flex items-center justify-end gap-0.5 text-xs font-medium tabular-nums',
                            asset.isPositive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400',
                          )
                        "
                      >
                        <TrendingUp v-if="asset.isPositive" class="size-3" aria-hidden="true" />
                        <TrendingDown v-else class="size-3" aria-hidden="true" />
                        {{ asset.change24h }}
                      </div>
                    </TableCell>

                    <!-- Holdings Amount & Fiat Value -->
                    <TableCell class="py-3.5 text-right">
                      <div class="text-foreground text-sm font-medium tabular-nums">{{ asset.balance }}</div>
                      <div class="text-muted-foreground text-xs tabular-nums">{{ asset.fiatValue }}</div>
                    </TableCell>

                    <!-- Portfolio Share -->
                    <TableCell class="hidden py-3.5 text-right sm:table-cell">
                      <Badge variant="outline" class="border-border/80 font-mono text-xs tabular-nums">
                        {{ asset.allocation }}
                      </Badge>
                    </TableCell>

                    <!-- Actions -->
                    <TableCell class="py-3.5 pr-6 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          class="h-7 px-2.5 text-xs shadow-xs"
                          @click="selectTradePair(asset.symbol)"
                        >
                          Trade
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                        >
                          Transfer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Quick Swap Widget & Security Info (4 cols) -->
      <div class="space-y-6 lg:col-span-4">
        <!-- Quick Swap Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-foreground flex items-center gap-1.5 text-base font-semibold">
                <RefreshCw class="text-primary size-4" aria-hidden="true" />
                Quick Swap
              </CardTitle>
              <!-- Slippage Settings -->
              <div class="flex items-center gap-1">
                <button
                  v-for="opt in ['0.1', '0.5', '1.0']"
                  :key="opt"
                  type="button"
                  :class="
                    cn(
                      'focus-visible:ring-ring min-h-6 rounded px-1.5 py-0.5 font-mono text-xs transition-colors focus-visible:ring-1 focus-visible:outline-none',
                      slippage === opt
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground bg-muted/60',
                    )
                  "
                  @click="slippage = opt"
                >
                  {{ opt }}%
                </button>
              </div>
            </div>
            <CardDescription class="text-muted-foreground text-xs">
              Swap instant liquidity across decentralized pools.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3">
            <!-- From Token Box -->
            <div class="bg-muted/40 border-border/80 space-y-2 rounded-lg border p-3">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <label for="swap-pay-input" class="font-medium">You Pay</label>
                <div class="flex items-center gap-1.5">
                  <span class="tabular-nums">Balance: {{ fromAsset.balance }}</span>
                  <button
                    type="button"
                    class="text-primary min-h-6 text-xs font-semibold uppercase hover:underline focus-visible:outline-none"
                    @click="setMaxPay"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between gap-3">
                <Input
                  id="swap-pay-input"
                  v-model="payAmount"
                  type="number"
                  step="any"
                  min="0"
                  class="h-8 border-none px-0 text-lg font-semibold tabular-nums shadow-none focus-within:ring-0"
                  placeholder="0.0"
                />

                <!-- From Token Selector Pill -->
                <div
                  class="bg-background border-border flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 shadow-xs select-none"
                >
                  <span
                    class="size-2 shrink-0 rounded-full"
                    :style="{ backgroundColor: fromAsset.color }"
                    aria-hidden="true"
                  />
                  <span class="text-foreground text-xs font-semibold">{{ fromAsset.symbol }}</span>
                </div>
              </div>

              <div class="text-muted-foreground text-xs tabular-nums">≈ {{ fiatPayFormatted }}</div>
            </div>

            <!-- Invert Flip Button -->
            <div class="relative z-10 -my-1 flex justify-center">
              <Button
                variant="outline"
                size="icon-sm"
                class="border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground size-8 rounded-full shadow-xs transition-transform active:scale-95"
                aria-label="Flip swap token pair"
                @click="flipTokens"
              >
                <ArrowDownUp class="size-4" aria-hidden="true" />
              </Button>
            </div>

            <!-- To Token Box -->
            <div class="bg-muted/40 border-border/80 space-y-2 rounded-lg border p-3">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span class="font-medium">You Receive</span>
                <span class="tabular-nums">Balance: {{ toAsset.balance }}</span>
              </div>

              <div class="flex items-center justify-between gap-3">
                <div class="text-foreground flex h-8 items-center text-lg font-semibold tabular-nums">
                  {{ calculatedReceive }}
                </div>

                <!-- To Token Selector Pill -->
                <div
                  class="bg-background border-border flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 shadow-xs select-none"
                >
                  <span
                    class="size-2 shrink-0 rounded-full"
                    :style="{ backgroundColor: toAsset.color }"
                    aria-hidden="true"
                  />
                  <span class="text-foreground text-xs font-semibold">{{ toAsset.symbol }}</span>
                </div>
              </div>

              <div class="text-muted-foreground text-xs tabular-nums">≈ {{ fiatReceiveFormatted }}</div>
            </div>

            <!-- Trade Details Summary -->
            <div class="border-border/60 bg-muted/20 text-muted-foreground space-y-1.5 rounded-md border p-2.5 text-xs">
              <div class="flex items-center justify-between">
                <span>Exchange Rate</span>
                <span class="text-foreground font-medium tabular-nums">{{ exchangeRateFormatted }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <Fuel class="text-muted-foreground size-3" aria-hidden="true" />
                  Est. Network Gas
                </span>
                <span class="text-foreground font-medium tabular-nums">~$3.40 (Fast)</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Slippage Tolerance</span>
                <span class="text-foreground font-medium tabular-nums">{{ slippage }}%</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Price Impact</span>
                <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">&lt; 0.01%</span>
              </div>
            </div>

            <!-- Execute Swap Button -->
            <Button
              class="w-full font-semibold shadow-xs transition-all"
              size="lg"
              :disabled="isSwapping || (parseFloat(payAmount) || 0) <= 0"
              @click="handleExecuteSwap"
            >
              <RefreshCw v-if="isSwapping" class="size-4 animate-spin" aria-hidden="true" />
              <Check v-else-if="swapSuccess" class="size-4 text-emerald-300" aria-hidden="true" />
              <span v-if="isSwapping">Routing Transaction...</span>
              <span v-else-if="swapSuccess">Swap Confirmed!</span>
              <span v-else>Swap {{ fromAsset.symbol }} for {{ toAsset.symbol }}</span>
            </Button>

            <p class="text-muted-foreground text-center text-xs">
              Direct routing via Uniswap v3 & Curve liquidity pools.
            </p>
          </CardContent>
        </Card>

        <!-- Security & Vault Status Summary -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-2">
            <CardTitle class="text-foreground flex items-center gap-1.5 text-sm font-semibold">
              <ShieldCheck class="size-4 text-emerald-500" aria-hidden="true" />
              Vault Security & Policies
            </CardTitle>
          </CardHeader>
          <CardContent class="text-muted-foreground space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span>Threshold Policy</span>
              <span class="text-foreground font-mono font-medium">3 / 5 Approvals</span>
            </div>
            <Separator class="my-1" />
            <div class="flex items-center justify-between">
              <span>Daily Spend Limit</span>
              <span class="text-foreground font-medium tabular-nums">$500,000.00</span>
            </div>
            <Separator class="my-1" />
            <div class="flex items-center justify-between">
              <span>Hardware Key Modules</span>
              <Badge
                variant="outline"
                class="border-emerald-500/30 text-xs font-normal text-emerald-600 dark:text-emerald-400"
              >
                5 Ledger HSMs Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
