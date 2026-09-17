<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

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

const cards = ref<VirtualCard[]>(initialCards)
const selectedId = ref<string>('vc-1')
const showDetails = ref<boolean>(false)
const copied = ref<boolean>(false)
const actionFeedback = ref<string | null>(null)

const selectedCard = computed(() => cards.value.find((c) => c.id === selectedId.value) ?? cards.value[0])

const selectedPercent = computed(() => {
  if (!selectedCard.value || selectedCard.value.limit === 0) return 0
  return Math.min(100, Math.round((selectedCard.value.spent / selectedCard.value.limit) * 100))
})

const isSelectedFrozen = computed(() => selectedCard.value?.status === 'Frozen')

function toggleFreeze(id: string) {
  cards.value = cards.value.map((c) => {
    if (c.id === id) {
      const nextStatus = c.status === 'Active' ? 'Frozen' : 'Active'
      return { ...c, status: nextStatus }
    }
    return c
  })
}

function handleCopyNumber() {
  if (!selectedCard.value) return
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(selectedCard.value.fullNumber.replace(/\s+/g, ''))
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function adjustLimit(cardId: string) {
  cards.value = cards.value.map((c) => {
    if (c.id === cardId) {
      const newLimit = c.limit === 5000 ? 7500 : c.limit === 10000 ? 12000 : c.limit + 1000
      return { ...c, limit: newLimit }
    }
    return c
  })
  showFeedback(`Limit updated to $${selectedCard.value.limit.toLocaleString()}`)
}

function terminateCard(cardId: string) {
  if (cards.value.length <= 1) {
    showFeedback('Cannot terminate the last remaining card')
    return
  }
  const remaining = cards.value.filter((c) => c.id !== cardId)
  cards.value = remaining
  if (selectedId.value === cardId) {
    selectedId.value = remaining[0].id
  }
  showFeedback('Card terminated permanently')
}

function issueNewCard() {
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
  cards.value = [newCard, ...cards.value]
  selectedId.value = newId
  showFeedback('New virtual card issued successfully')
}

function showFeedback(msg: string) {
  actionFeedback.value = msg
  setTimeout(() => {
    if (actionFeedback.value === msg) {
      actionFeedback.value = null
    }
  }, 3000)
}
</script>

<template>
  <div data-slot="virtual-card-manager" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5">
          <h2 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">Virtual Cards</h2>
          <Badge wrap variant="secondary" class="font-mono text-xs tabular-nums">{{ cards.length }} Cards</Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          Generate instant corporate cards for subscriptions, vendors, and team expense limits.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button size="sm" class="gap-1.5 shadow-xs" @click="issueNewCard">
          <Plus class="size-4" />
          Issue New Card
        </Button>
      </div>
    </div>

    <!-- Notification / Action Toast feedback -->
    <div
      v-if="actionFeedback"
      class="bg-primary/10 text-primary border-primary/20 flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs font-medium transition-all"
    >
      <div class="flex items-center gap-2">
        <Sparkles class="size-4 shrink-0" />
        <span>{{ actionFeedback }}</span>
      </div>
      <Button
        aria-label="Dismiss notification"
        variant="ghost"
        size="xs"
        class="h-6 px-2 text-xs"
        @click="actionFeedback = null"
        >Dismiss</Button
      >
    </div>

    <!-- Virtual Card Visual Hero -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="border-b pb-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <CardTitle class="text-base font-semibold">{{ selectedCard.name }}</CardTitle>
              <Badge
                :variant="selectedCard.status === 'Active' ? 'success' : 'warning'"
                class="text-xs whitespace-normal"
              >
                {{ selectedCard.status }}
              </Badge>
            </div>
            <CardDescription class="mt-0.5 text-xs">
              {{ selectedCard.purpose }} · {{ selectedCard.billingCycle }}
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="font-mono text-xs"> Ending in {{ selectedCard.last4 }} </Badge>
        </div>
      </CardHeader>

      <CardContent class="pt-6">
        <div class="grid gap-6 lg:grid-cols-12 lg:items-center">
          <!-- Stylized Dark Credit Card Container -->
          <div class="lg:col-span-6 xl:col-span-5">
            <div
              :class="
                cn(
                  'relative aspect-[1.586/1] w-full max-w-[420px] rounded-2xl p-6 text-white transition-all duration-300 lg:max-w-full',
                  'border border-zinc-700/60 bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 shadow-xl',
                  isSelectedFrozen && 'contrast-95 grayscale filter',
                )
              "
            >
              <!-- Ambient light accents -->
              <div
                class="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-indigo-500/15 blur-2xl"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-emerald-500/10 blur-2xl"
                aria-hidden="true"
              />

              <!-- Frozen watermark overlay -->
              <div
                v-if="isSelectedFrozen"
                class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-950/70 backdrop-blur-xs"
              >
                <div
                  class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-xs font-semibold tracking-wider text-amber-200 uppercase"
                >
                  <Snowflake class="size-3.5" />
                  Card Frozen
                </div>
                <p class="text-xs text-zinc-400">Transactions are currently blocked</p>
              </div>

              <!-- Top Row: Chip & Contactless + Brand Logo -->
              <div class="relative z-10 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <!-- Metallic EMV Chip -->
                  <div
                    class="relative flex h-8 w-11 items-center justify-center rounded-md border border-amber-300/40 bg-gradient-to-br from-amber-200/30 via-amber-400/20 to-amber-600/30 shadow-inner"
                    aria-hidden="true"
                  >
                    <div class="absolute inset-0 grid grid-cols-3 grid-rows-2 border-amber-300/30">
                      <div class="border-r border-b border-amber-400/30" />
                      <div class="border-r border-b border-amber-400/30" />
                      <div class="border-b border-amber-400/30" />
                      <div class="border-r border-amber-400/30" />
                      <div class="border-r border-amber-400/30" />
                      <div />
                    </div>
                  </div>

                  <!-- NFC Wave icon -->
                  <div class="rotate-90 text-zinc-400/80" aria-hidden="true">
                    <Radio class="size-4" />
                  </div>
                </div>

                <!-- Brand Indicator -->
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-medium tracking-wider text-zinc-400 uppercase">Virtual</span>
                  <div v-if="selectedCard.brand === 'mastercard'" class="flex -space-x-2" aria-label="Mastercard">
                    <div class="size-6 rounded-full bg-red-500/90" />
                    <div class="size-6 rounded-full bg-amber-400/90 mix-blend-screen" />
                  </div>
                  <div v-else class="text-base font-bold tracking-widest text-zinc-100 italic" aria-label="Visa">
                    VISA
                  </div>
                </div>
              </div>

              <!-- Middle Row: Card Number & Quick Actions -->
              <div class="relative z-10 my-auto pt-4">
                <div class="flex items-center justify-between gap-2">
                  <p
                    class="font-mono text-lg font-medium tracking-[0.16em] text-zinc-100 tabular-nums drop-shadow-sm sm:text-xl"
                  >
                    {{ showDetails ? selectedCard.fullNumber : `•••• •••• •••• ${selectedCard.last4}` }}
                  </p>
                  <div class="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="size-7 text-zinc-300 hover:bg-white/10 hover:text-white"
                      :aria-label="showDetails ? 'Hide card number' : 'Reveal card number'"
                      @click="showDetails = !showDetails"
                    >
                      <EyeOff v-if="showDetails" class="size-3.5" />
                      <Eye v-else class="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="size-7 text-zinc-300 hover:bg-white/10 hover:text-white"
                      aria-label="Copy card number"
                      @click="handleCopyNumber"
                    >
                      <Check v-if="copied" class="size-3.5 text-emerald-400" />
                      <Copy v-else class="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Bottom Row: Cardholder, Expiry, CVV -->
              <div class="relative z-10 flex items-end justify-between pt-2">
                <div class="space-y-0.5">
                  <p class="font-mono text-xs tracking-wider text-zinc-400 uppercase">Cardholder</p>
                  <p class="max-w-[140px] truncate text-xs font-semibold tracking-wide text-zinc-200 uppercase">
                    {{ selectedCard.holder }}
                  </p>
                </div>

                <div class="space-y-0.5">
                  <p class="font-mono text-xs tracking-wider text-zinc-400 uppercase">Expires</p>
                  <p class="font-mono text-xs font-medium text-zinc-200 tabular-nums">{{ selectedCard.expiry }}</p>
                </div>

                <div class="space-y-0.5 text-right">
                  <p class="font-mono text-xs tracking-wider text-zinc-400 uppercase">CVV</p>
                  <p class="font-mono text-xs font-medium text-zinc-200 tabular-nums">
                    {{ showDetails ? selectedCard.cvv : '•••' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Controls & Spending Breakdown -->
          <div class="space-y-6 lg:col-span-6 xl:col-span-7">
            <!-- Spending Limit Meter -->
            <div class="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Monthly Spending Limit</span>
                <span class="text-muted-foreground font-mono text-xs tabular-nums">
                  ${{ selectedCard.spent.toLocaleString() }} / ${{ selectedCard.limit.toLocaleString() }}
                </span>
              </div>

              <Progress :model-value="selectedPercent" class="h-2" />

              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span class="text-foreground font-medium tabular-nums">
                  ${{ Math.max(0, selectedCard.limit - selectedCard.spent).toLocaleString() }} available
                </span>
                <span class="font-medium tabular-nums"> {{ selectedPercent }}% utilized </span>
              </div>
            </div>

            <!-- Card Controls Row -->
            <div class="grid gap-3 sm:grid-cols-3">
              <!-- Freeze Card Toggle -->
              <div
                class="border-border bg-card flex items-center justify-between rounded-lg border p-3 sm:flex-col sm:items-start sm:justify-between sm:gap-2"
              >
                <div class="space-y-0.5">
                  <p class="text-foreground text-xs font-medium">Freeze Card</p>
                  <p class="text-muted-foreground text-xs">Block charges</p>
                </div>
                <Switch
                  :model-value="isSelectedFrozen"
                  size="sm"
                  aria-label="Toggle card freeze status"
                  @update:model-value="toggleFreeze(selectedCard.id)"
                />
              </div>

              <!-- Change Limit Button -->
              <Button
                variant="outline"
                size="sm"
                class="h-auto flex-col items-start gap-1 p-3 text-left"
                @click="adjustLimit(selectedCard.id)"
              >
                <div class="flex w-full items-center justify-between">
                  <span class="text-foreground text-xs font-medium">Adjust Limit</span>
                  <SlidersHorizontal class="text-muted-foreground size-3.5" />
                </div>
                <span class="text-muted-foreground text-xs font-normal">Edit monthly cap</span>
              </Button>

              <!-- Terminate Card Button -->
              <Button
                variant="outline"
                size="sm"
                class="text-destructive hover:text-destructive hover:bg-destructive/10 border-border h-auto flex-col items-start gap-1 p-3 text-left"
                @click="terminateCard(selectedCard.id)"
              >
                <div class="flex w-full items-center justify-between">
                  <span class="text-xs font-medium">Terminate</span>
                  <Trash2 class="size-3.5" />
                </div>
                <span class="text-muted-foreground text-xs font-normal">Close permanently</span>
              </Button>
            </div>

            <!-- Card Meta Specs -->
            <div class="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Cardholder</span>
                <div class="flex items-center gap-1.5 pt-0.5">
                  <Avatar size="xs" class="size-4.5">
                    <AvatarImage :src="selectedCard.avatar" :alt="selectedCard.holder" />
                    <AvatarFallback class="text-xs">{{ selectedCard.initials }}</AvatarFallback>
                  </Avatar>
                  <span class="truncate text-xs font-medium">{{ selectedCard.holder }}</span>
                </div>
              </div>

              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Card Type</span>
                <p class="text-foreground text-xs font-medium">{{ selectedCard.type }}</p>
              </div>

              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Fraud Protection</span>
                <div class="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck class="size-3.5" />
                  <span>3D Secure Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Active Cards Grid / Table -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="border-b pb-4">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Active Cards List</CardTitle>
            <CardDescription class="mt-0.5 text-xs">
              All company virtual cards currently assigned to team members and services.
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="font-mono text-xs tabular-nums"> {{ cards.length }} Issued </Badge>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="divide-border divide-y">
          <div
            v-for="card in cards"
            :key="card.id"
            :class="
              cn(
                'group flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
                selectedId === card.id ? 'bg-muted/40' : 'hover:bg-muted/20',
              )
            "
          >
            <!-- Card Identity & Number -->
            <div class="flex min-w-0 items-center gap-3.5 sm:w-1/3">
              <div
                :class="
                  cn(
                    'border-border flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs transition-transform',
                    card.status === 'Frozen' ? 'bg-muted/60 text-muted-foreground' : 'bg-primary/10 text-primary',
                  )
                "
              >
                <CreditCard class="size-5" />
              </div>

              <div class="min-w-0 flex-1 space-y-0.5">
                <div class="flex items-center gap-2">
                  <p class="text-foreground truncate text-sm font-medium">{{ card.name }}</p>
                </div>
                <div class="text-muted-foreground flex items-center gap-2 text-xs">
                  <span class="font-mono tabular-nums">•••• {{ card.last4 }}</span>
                  <span>·</span>
                  <span class="uppercase">{{ card.brand }}</span>
                </div>
              </div>
            </div>

            <!-- Cardholder Avatar & Name -->
            <div class="flex items-center gap-2 sm:w-1/5">
              <Avatar size="sm">
                <AvatarImage :src="card.avatar" :alt="card.holder" />
                <AvatarFallback>{{ card.initials }}</AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <p class="text-foreground truncate text-xs font-medium">{{ card.holder }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ card.type }}</p>
              </div>
            </div>

            <!-- Spending Limit & Progress -->
            <div class="space-y-1.5 sm:w-1/4">
              <div class="flex items-center justify-between text-xs">
                <span class="text-foreground font-mono font-medium tabular-nums">
                  ${{ card.spent.toLocaleString() }} / ${{ card.limit.toLocaleString() }}
                </span>
                <span class="text-muted-foreground font-mono tabular-nums">
                  {{ Math.round((card.spent / card.limit) * 100) }}%
                </span>
              </div>
              <Progress :model-value="Math.min(100, Math.round((card.spent / card.limit) * 100))" class="h-1.5" />
            </div>

            <!-- Status Badge & Actions -->
            <div class="flex items-center justify-between gap-3 sm:justify-end">
              <Badge :variant="card.status === 'Active' ? 'success' : 'warning'" class="text-xs whitespace-normal">
                {{ card.status }}
              </Badge>

              <div class="flex items-center gap-1.5">
                <Button
                  :variant="selectedId === card.id ? 'secondary' : 'ghost'"
                  size="sm"
                  class="text-xs"
                  @click="selectedId = card.id"
                >
                  {{ selectedId === card.id ? 'Viewing' : 'View Card' }}
                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  :aria-label="card.status === 'Active' ? 'Freeze card' : 'Unfreeze card'"
                  @click="toggleFreeze(card.id)"
                >
                  <Snowflake v-if="card.status === 'Active'" class="text-muted-foreground size-4" />
                  <Zap v-else class="size-4 text-amber-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
