<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Flame, Sparkles, Tag, ShieldCheck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface TierOffer {
  id: string
  quantity: number
  discountPct: number
  label: string
  badgeText?: string
  popular?: boolean
}

export interface FlashSaleProps {
  saleTitle?: string
  endTimeIso?: string
  claimedPercent?: number
  itemsLeft?: number
  currentTier?: number
  tiers?: TierOffer[]
  className?: string
}

const props = withDefaults(defineProps<FlashSaleProps>(), {
  saleTitle: 'Lightning Deal: Limited Quantity Batch',
  // 6 hours from now default
  endTimeIso: () => new Date(Date.now() + 6 * 3600 * 1000 + 42 * 60 * 1000 + 19 * 1000).toISOString(),
  claimedPercent: 78,
  itemsLeft: 14,
  currentTier: 2,
  tiers: () => [
    { id: 't1', quantity: 1, discountPct: 15, label: 'Standard Pack', badgeText: 'Save $45' },
    {
      id: 't2',
      quantity: 2,
      discountPct: 25,
      label: 'Duo Studio Bundle',
      badgeText: 'Save $150 · Best Value',
      popular: true,
    },
    { id: 't3', quantity: 3, discountPct: 35, label: 'Team / Lab Triad', badgeText: 'Save $315' },
  ],
})

const emit = defineEmits<{
  (e: 'select-tier', tier: TierOffer): void
  (e: 'claim-deal'): void
}>()

const selectedTierId = ref(props.tiers[1]?.id || props.tiers[0]?.id || '')

const timeLeft = ref({
  hours: '06',
  minutes: '42',
  seconds: '19',
})

let timerInterval: ReturnType<typeof setInterval> | null = null

function updateCountdown() {
  const target = new Date(props.endTimeIso).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)

  timeLeft.value = {
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
  }
}

onMounted(() => {
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function handleSelectTier(tier: TierOffer) {
  selectedTierId.value = tier.id
  emit('select-tier', tier)
}
</script>

<template>
  <div
    data-slot="flash-sale-offer-bar"
    :class="['border-border bg-card w-full overflow-hidden rounded-xl border shadow-xs', className]"
  >
    <!-- Deal Header Banner -->
    <div
      class="border-border bg-muted/40 flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-2.5">
        <div class="border-border bg-background flex size-8 items-center justify-center rounded-lg border shadow-2xs">
          <Flame class="size-4 fill-orange-500/20 text-orange-500" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-foreground text-sm font-semibold tracking-tight">{{ saleTitle }}</span>
            <Badge variant="destructive" class="h-5 gap-1 px-1.5 font-mono text-xs uppercase">
              <span class="bg-background size-1.5 animate-pulse rounded-full" />
              Live
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">Price locks automatically once added to cart.</p>
        </div>
      </div>

      <!-- Live Clock Digits -->
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <span class="text-muted-foreground text-xs font-medium">Ends in:</span>
        <div class="text-foreground flex items-center gap-1 font-mono text-xs font-semibold">
          <span class="border-border bg-background rounded border px-1.5 py-0.5 shadow-2xs">{{ timeLeft.hours }}h</span>
          <span>:</span>
          <span class="border-border bg-background rounded border px-1.5 py-0.5 shadow-2xs"
            >{{ timeLeft.minutes }}m</span
          >
          <span>:</span>
          <span class="border-border bg-background text-destructive rounded border px-1.5 py-0.5 shadow-2xs"
            >{{ timeLeft.seconds }}s</span
          >
        </div>
      </div>
    </div>

    <div class="space-y-4 p-4">
      <!-- Claim Progress Bar -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-foreground flex items-center gap-1.5 font-medium">
            <Sparkles class="size-3.5 text-amber-500" />
            <span>{{ claimedPercent }}% Claimed</span>
          </span>
          <span class="text-destructive font-mono font-medium">Only {{ itemsLeft }} units remaining in stock</span>
        </div>
        <div class="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            class="h-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-500"
            :style="{ width: `${claimedPercent}%` }"
          />
        </div>
      </div>

      <!-- Tier Multi-Buy Cards Grid -->
      <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <button
          v-for="tier in tiers"
          :key="tier.id"
          type="button"
          :class="[
            'relative flex flex-col justify-between rounded-lg border p-3 text-left transition-all',
            selectedTierId === tier.id
              ? 'border-primary bg-primary/5 ring-primary ring-1'
              : 'border-border bg-card hover:border-muted-foreground/40 hover:bg-muted/30',
          ]"
          @click="handleSelectTier(tier)"
        >
          <!-- Popular ribbon -->
          <span
            v-if="tier.popular"
            class="border-border bg-primary text-primary-foreground absolute -top-2.5 right-3 rounded-full border px-2 py-0.5 text-xs font-semibold shadow-xs"
          >
            MOST POPULAR
          </span>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-foreground text-xs font-semibold"
                >Buy {{ tier.quantity }} {{ tier.quantity > 1 ? 'Units' : 'Unit' }}</span
              >
              <Badge variant="secondary" class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                -{{ tier.discountPct }}% OFF
              </Badge>
            </div>
            <div class="text-muted-foreground text-xs font-medium">{{ tier.label }}</div>
          </div>

          <div class="border-border/60 mt-3 flex items-center justify-between border-t pt-2 text-xs">
            <span class="text-muted-foreground">{{ tier.badgeText }}</span>
            <div
              :class="[
                'flex size-4 items-center justify-center rounded-full border text-xs font-bold',
                selectedTierId === tier.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/40',
              ]"
            >
              ✓
            </div>
          </div>
        </button>
      </div>

      <!-- Footer Guarantee & CTA Banner -->
      <div
        class="border-border bg-muted/20 flex flex-col gap-2 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-muted-foreground flex items-center gap-2">
          <ShieldCheck class="size-4 text-emerald-500" />
          <span>30-day price-match guarantee · Free express 2-day dispatch</span>
        </div>
        <Button size="sm" class="gap-1.5 text-xs shadow-xs" @click="$emit('claim-deal')">
          <Tag class="size-3.5" />
          <span>Apply Tier Discount to Cart</span>
        </Button>
      </div>
    </div>
  </div>
</template>
