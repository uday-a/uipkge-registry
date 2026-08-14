<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface Props {
  initialSendAmount?: number
  initialFromCurrency?: string
  initialToCurrency?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialSendAmount: 1000,
  initialFromCurrency: 'USD',
  initialToCurrency: 'EUR',
})

const emit = defineEmits<{
  (
    e: 'transfer',
    payload: {
      sendAmount: number
      fromCurrency: string
      toCurrency: string
      recipientGets: number
      fee: number
      rate: number
    },
  ): void
}>()

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

const sendAmount = ref<number>(props.initialSendAmount)
const fromCurrency = ref<string>(props.initialFromCurrency)
const toCurrency = ref<string>(props.initialToCurrency)
const isRefreshing = ref<boolean>(false)
const refreshSuccess = ref<boolean>(false)
const paymentMethod = ref<'bank' | 'card'>('bank')

const fromCurrencyObj = computed(() => CURRENCIES.find((c) => c.code === fromCurrency.value) || CURRENCIES[0])
const toCurrencyObj = computed(() => CURRENCIES.find((c) => c.code === toCurrency.value) || CURRENCIES[1])

// Dynamic mid-market rate calculation
const exchangeRate = computed(() => {
  if (!fromCurrencyObj.value || !toCurrencyObj.value) return 1
  return toCurrencyObj.value.rateToBase / fromCurrencyObj.value.rateToBase
})

const inverseExchangeRate = computed(() => {
  if (exchangeRate.value === 0) return 0
  return 1 / exchangeRate.value
})

const formattedExchangeRate = computed(() => {
  const r = exchangeRate.value
  if (r >= 100) return r.toFixed(2)
  if (r >= 1) return r.toFixed(4)
  return r.toFixed(5)
})

// Fee breakdown logic
const fixedBaseFee = computed(() => {
  // Base fixed fee equivalent to ~$1.20 USD
  const fromRate = fromCurrencyObj.value.rateToBase
  const base = 1.2 * fromRate
  return paymentMethod.value === 'card' ? base * 1.6 : base
})

const variableRate = computed(() => (paymentMethod.value === 'card' ? 0.0065 : 0.0035))

const variableFee = computed(() => {
  const amt = Number(sendAmount.value) || 0
  return amt * variableRate.value
})

const totalFee = computed(() => {
  return fixedBaseFee.value + variableFee.value
})

const amountToConvert = computed(() => {
  const amt = Number(sendAmount.value) || 0
  return Math.max(0, amt - totalFee.value)
})

const recipientGets = computed(() => {
  return amountToConvert.value * exchangeRate.value
})

// Bank comparison calculation
const bankWireFee = computed(() => 20 * fromCurrencyObj.value.rateToBase)
const bankMarkupSpread = 0.032 // 3.2% average hidden bank margin
const bankTotalCost = computed(() => {
  const amt = Number(sendAmount.value) || 0
  return bankWireFee.value + amt * bankMarkupSpread
})

const estimatedSavings = computed(() => {
  return Math.max(0, bankTotalCost.value - totalFee.value)
})

function formatAmount(val: number, currencyCode: string): string {
  const isZeroDecimal = currencyCode === 'JPY'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(val)
}

function handleSwap() {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}

function handleSelectPair(pair: PopularPair) {
  fromCurrency.value = pair.from
  toCurrency.value = pair.to
}

function handleRefresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    refreshSuccess.value = true
    setTimeout(() => {
      refreshSuccess.value = false
    }, 2000)
  }, 450)
}

function handleTransfer() {
  emit('transfer', {
    sendAmount: Number(sendAmount.value) || 0,
    fromCurrency: fromCurrency.value,
    toCurrency: toCurrency.value,
    recipientGets: recipientGets.value,
    fee: totalFee.value,
    rate: exchangeRate.value,
  })
}

function getPairRate(fromCode: string, toCode: string): string {
  const f = CURRENCIES.find((c) => c.code === fromCode)?.rateToBase || 1
  const t = CURRENCIES.find((c) => c.code === toCode)?.rateToBase || 1
  const rate = t / f
  return rate >= 100 ? rate.toFixed(2) : rate.toFixed(4)
}
</script>

<template>
  <div :class="cn('mx-auto w-full max-w-2xl space-y-6', props.class)" data-slot="currency-converter-widget">
    <!-- Header Section -->
    <div class="space-y-2">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Currency Converter & International Transfer
        </h2>
        <Badge variant="outline" class="gap-1.5 py-1 text-xs font-normal">
          <span class="size-2 animate-pulse rounded-full bg-emerald-500" />
          Live Market Rates
        </Badge>
      </div>
      <p class="text-muted-foreground text-sm">
        Real-time mid-market exchange rates with transparent fees. No hidden markups.
      </p>

      <!-- Refresh & Current Mid-market rate banner -->
      <div
        class="border-border bg-muted/40 text-muted-foreground flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3.5 py-2 text-xs"
      >
        <div class="flex items-center gap-2">
          <span class="text-foreground font-medium">
            Mid-market rate: 1 {{ fromCurrencyObj.code }} = {{ formattedExchangeRate }} {{ toCurrencyObj.code }}
          </span>
          <span>Updated 1m ago</span>
        </div>
        <button
          type="button"
          aria-label="Refresh exchange rates"
          class="text-foreground hover:text-primary focus-visible:ring-ring inline-flex min-h-6 items-center gap-1 rounded px-1.5 py-0.5 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          @click="handleRefresh"
        >
          <RefreshCw
            :class="cn('size-3.5 transition-transform duration-500', isRefreshing ? 'text-primary animate-spin' : '')"
          />
          <span>{{ refreshSuccess ? 'Refreshed!' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- Main Converter Card -->
    <Card class="border-border shadow-xs">
      <CardContent class="space-y-4 p-5 sm:p-6">
        <!-- Payment method tab pill -->
        <div class="flex items-center justify-between gap-2">
          <div class="border-border bg-muted/50 inline-flex rounded-lg border p-1 text-xs">
            <button
              type="button"
              :class="
                cn(
                  'min-h-6 rounded-md px-3 py-1 font-medium transition-all',
                  paymentMethod === 'bank'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="paymentMethod = 'bank'"
            >
              Bank Transfer (Lowest Fee)
            </button>
            <button
              type="button"
              :class="
                cn(
                  'min-h-6 rounded-md px-3 py-1 font-medium transition-all',
                  paymentMethod === 'card'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )
              "
              @click="paymentMethod = 'card'"
            >
              Debit / Credit Card
            </button>
          </div>

          <span class="text-muted-foreground hidden text-xs sm:inline-flex"> Guaranteed rate for 24h </span>
        </div>

        <!-- "You send" Input Container -->
        <div
          class="border-input bg-card focus-within:border-ring focus-within:ring-ring/20 rounded-xl border p-3.5 shadow-2xs transition-colors focus-within:ring-2"
        >
          <div class="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
            <label for="send-amount-input" class="text-foreground font-medium">You send</label>
            <span>Max limit: $100,000 / transfer</span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex flex-1 items-baseline gap-1">
              <span class="text-muted-foreground text-xl font-semibold select-none sm:text-2xl">
                {{ fromCurrencyObj.symbol }}
              </span>
              <input
                id="send-amount-input"
                v-model.number="sendAmount"
                type="number"
                min="1"
                step="any"
                placeholder="1,000.00"
                class="text-foreground placeholder:text-muted-foreground/40 w-full bg-transparent text-2xl font-bold tracking-tight tabular-nums outline-none sm:text-3xl"
              />
            </div>

            <!-- From Currency Selector -->
            <div class="w-36 shrink-0">
              <Select v-model="fromCurrency">
                <SelectTrigger class="bg-muted/40 h-11 w-full text-xs font-medium sm:text-sm">
                  <div class="flex items-center gap-2 text-left">
                    <span class="text-base leading-none">{{ fromCurrencyObj.flag }}</span>
                    <span class="font-semibold">{{ fromCurrencyObj.code }}</span>
                  </div>
                </SelectTrigger>
                <SelectContent class="max-h-64">
                  <SelectItem v-for="curr in CURRENCIES" :key="curr.code" :value="curr.code">
                    <div class="flex items-center gap-2">
                      <span class="text-base">{{ curr.flag }}</span>
                      <span class="font-semibold">{{ curr.code }}</span>
                      <span class="text-muted-foreground truncate text-xs">({{ curr.name }})</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <!-- Transfer Breakdown Rail (Vertical Connector) -->
        <div
          class="before:bg-border relative my-1 space-y-3.5 py-2 pl-6 before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-px"
        >
          <!-- Step 1: Fee -->
          <div class="relative flex items-center justify-between text-xs">
            <div
              class="border-border bg-card text-muted-foreground absolute -left-[19px] flex size-3.5 items-center justify-center rounded-full border"
            >
              <Minus class="size-2.5" />
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-foreground font-semibold tabular-nums">
                -{{ fromCurrencyObj.symbol }}{{ formatAmount(totalFee, fromCurrencyObj.code) }}
                {{ fromCurrencyObj.code }}
              </span>
              <span class="text-muted-foreground">Transfer fee</span>
              <Badge variant="secondary" class="text-muted-foreground h-4.5 px-1.5 text-xs font-normal">
                {{ paymentMethod === 'card' ? '0.65% + $1.20' : '0.35% + $1.20' }}
              </Badge>
            </div>
            <span class="text-muted-foreground hidden sm:inline">Transparent fixed rate</span>
          </div>

          <!-- Step 2: Amount to convert -->
          <div class="relative flex items-center justify-between text-xs">
            <div
              class="border-border bg-card text-muted-foreground absolute -left-[19px] flex size-3.5 items-center justify-center rounded-full border"
            >
              <span class="text-xs leading-none font-bold">=</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-foreground font-semibold tabular-nums">
                {{ fromCurrencyObj.symbol }}{{ formatAmount(amountToConvert, fromCurrencyObj.code) }}
                {{ fromCurrencyObj.code }}
              </span>
              <span class="text-muted-foreground">Amount to convert</span>
            </div>
            <span class="text-muted-foreground hidden sm:inline">Net transfer base</span>
          </div>

          <!-- Step 3: Guaranteed Exchange Rate & Swap Button Line -->
          <div class="relative flex flex-wrap items-center justify-between gap-2 text-xs">
            <div
              class="border-primary/50 bg-primary text-primary-foreground absolute -left-[19px] flex size-3.5 items-center justify-center rounded-full border"
            >
              <Lock class="size-2" />
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-foreground font-semibold tabular-nums"> × {{ formattedExchangeRate }} </span>
              <span class="text-muted-foreground">Guaranteed mid-market rate</span>
              <Badge
                variant="outline"
                class="gap-1 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <Lock class="size-2.5" />
                24h Guarantee
              </Badge>
            </div>

            <!-- Swap Currencies Button -->
            <button
              type="button"
              aria-label="Swap currencies"
              class="border-border bg-card text-foreground hover:bg-accent hover:border-primary/50 focus-visible:ring-ring inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-2xs transition-all focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              @click="handleSwap"
            >
              <ArrowUpDown class="text-primary size-3" />
              <span>Swap</span>
            </button>
          </div>
        </div>

        <!-- "Recipient gets" Input / Output Container -->
        <div
          class="border-input bg-card focus-within:border-ring focus-within:ring-ring/20 rounded-xl border p-3.5 shadow-2xs transition-colors focus-within:ring-2"
        >
          <div class="text-muted-foreground mb-1.5 flex items-center justify-between text-xs">
            <label class="text-foreground font-medium">Recipient gets</label>
            <span class="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
              <Zap class="size-3" />
              {{ toCurrencyObj.deliverySpeed }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex min-w-0 flex-1 items-baseline gap-1">
              <span class="text-muted-foreground text-xl font-semibold select-none sm:text-2xl">
                {{ toCurrencyObj.symbol }}
              </span>
              <div
                class="text-foreground w-full truncate text-2xl font-bold tracking-tight tabular-nums select-all sm:text-3xl"
              >
                {{ formatAmount(recipientGets, toCurrencyObj.code) }}
              </div>
            </div>

            <!-- To Currency Selector -->
            <div class="w-36 shrink-0">
              <Select v-model="toCurrency">
                <SelectTrigger class="bg-muted/40 h-11 w-full text-xs font-medium sm:text-sm">
                  <div class="flex items-center gap-2 text-left">
                    <span class="text-base leading-none">{{ toCurrencyObj.flag }}</span>
                    <span class="font-semibold">{{ toCurrencyObj.code }}</span>
                  </div>
                </SelectTrigger>
                <SelectContent class="max-h-64">
                  <SelectItem v-for="curr in CURRENCIES" :key="curr.code" :value="curr.code">
                    <div class="flex items-center gap-2">
                      <span class="text-base">{{ curr.flag }}</span>
                      <span class="font-semibold">{{ curr.code }}</span>
                      <span class="text-muted-foreground truncate text-xs">({{ curr.name }})</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <!-- Delivery Speed & Savings Breakdown Banner -->
        <div class="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 text-xs">
              <span class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full">
                <Zap class="size-3.5" />
              </span>
              <div>
                <p class="text-foreground font-semibold">Estimated delivery: {{ toCurrencyObj.deliverySpeed }}</p>
                <p class="text-muted-foreground">Via {{ toCurrencyObj.deliveryNetwork }}</p>
              </div>
            </div>

            <Badge
              variant="outline"
              class="gap-1 border-amber-500/30 bg-amber-500/10 py-1 text-xs text-amber-600 dark:text-amber-400"
            >
              <Sparkles class="size-3" />
              Save ~{{ fromCurrencyObj.symbol }}{{ formatAmount(estimatedSavings, fromCurrencyObj.code) }}
              {{ fromCurrencyObj.code }}
            </Badge>
          </div>

          <Separator />

          <!-- Comparison vs Standard High-Street Bank -->
          <div class="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div class="bg-card/60 border-border flex items-start gap-2 rounded-md border p-2.5">
              <ShieldCheck class="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div>
                <p class="text-foreground font-medium">UIPKGE Transfer</p>
                <p class="text-muted-foreground text-xs">
                  Fee: {{ fromCurrencyObj.symbol }}{{ formatAmount(totalFee, fromCurrencyObj.code) }} · 0% exchange
                  spread
                </p>
              </div>
            </div>

            <div class="bg-card/60 border-border flex items-start gap-2 rounded-md border p-2.5 opacity-75">
              <Building2 class="text-muted-foreground mt-0.5 size-4 shrink-0" />
              <div>
                <p class="text-foreground font-medium">Standard Bank Wire</p>
                <p class="text-muted-foreground text-xs">
                  Fee: ~{{ fromCurrencyObj.symbol }}{{ formatAmount(bankTotalCost, fromCurrencyObj.code) }} · ~3.2%
                  hidden spread
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Primary Action Button -->
        <Button class="h-11 w-full gap-2 text-base font-semibold shadow-sm" @click="handleTransfer">
          <span
            >Get Started / Send {{ fromCurrencyObj.symbol
            }}{{ formatAmount(sendAmount || 0, fromCurrencyObj.code) }}</span
          >
          <ArrowRight class="size-4" />
        </Button>

        <p class="text-muted-foreground flex items-center justify-center gap-1.5 text-center text-xs">
          <Lock class="text-muted-foreground size-3" />
          <span>Rates locked for 24 hours. Licensed & regulated financial institution.</span>
        </p>
      </CardContent>
    </Card>

    <!-- Popular Currency Pairs Quick Rate Ticker -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-foreground text-sm font-semibold">Popular Currency Pairs</h3>
        <span class="text-muted-foreground text-xs">Click pair to load</span>
      </div>

      <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <button
          v-for="pair in POPULAR_PAIRS"
          :key="pair.id"
          type="button"
          :class="
            cn(
              'hover:bg-accent focus-visible:ring-ring flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
              fromCurrency === pair.from && toCurrency === pair.to
                ? 'border-primary bg-primary/5 ring-primary/20 ring-1'
                : 'border-border bg-card',
            )
          "
          @click="handleSelectPair(pair)"
        >
          <div class="flex w-full items-center justify-between text-xs">
            <span class="text-foreground font-semibold">{{ pair.from }} / {{ pair.to }}</span>
            <span
              :class="
                cn(
                  'flex items-center text-xs font-medium',
                  pair.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
                )
              "
            >
              <ArrowUpRight v-if="pair.trend === 'up'" class="size-3" />
              <ArrowDownRight v-else class="size-3" />
              {{ pair.change24h > 0 ? `+${pair.change24h}%` : `${pair.change24h}%` }}
            </span>
          </div>

          <div class="text-foreground text-sm font-bold tabular-nums">
            {{ getPairRate(pair.from, pair.to) }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
