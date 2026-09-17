<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, ShoppingBag, Truck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface BundleItem {
  id: string
  name: string
  subtitle: string
  price: number
  image: string
  isMain?: boolean
}

const items: BundleItem[] = [
  {
    id: 'headphones',
    name: 'Pro Studio Headphones',
    subtitle: 'Space Black · Over-Ear Wireless ANC',
    price: 299.0,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    isMain: true,
  },
  {
    id: 'case',
    name: 'Premium Hard Shell Case',
    subtitle: 'Weather-resistant EVA shell with plush velvet lining',
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cable',
    name: 'Braided 3.5mm Audiophile Cable',
    subtitle: '1.5m Silver-plated OFC copper with gold-plated jacks',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
  },
]

const selectedIds = ref<string[]>(['headphones', 'case', 'cable'])

function toggleItem(id: string) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((itemId) => itemId !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

const selectedItems = computed(() => items.filter((item) => selectedIds.value.includes(item.id)))
const selectedCount = computed(() => selectedItems.value.length)

const originalTotal = computed(() => selectedItems.value.reduce((sum, item) => sum + item.price, 0))

const discountRate = computed(() => (selectedCount.value >= 2 ? 0.15 : 0))
const discountAmount = computed(() => originalTotal.value * discountRate.value)
const finalPrice = computed(() => originalTotal.value - discountAmount.value)
const hasDiscount = computed(() => discountRate.value > 0)

const buttonText = computed(() => {
  if (selectedCount.value === items.length) return `Add all ${items.length} to Cart`
  if (selectedCount.value > 1) return `Add ${selectedCount.value} selected to Cart`
  if (selectedCount.value === 1) return 'Add 1 selected to Cart'
  return 'Select items to add'
})

const deliveryNote = computed(() => {
  if (selectedCount.value >= 2) return 'Free express delivery included with this bundle'
  if (selectedCount.value === 1) return 'Standard delivery included'
  return 'Select items to view delivery options'
})

function formatCurrency(val: number) {
  return '$' + val.toFixed(2)
}
</script>

<template>
  <Card data-slot="frequently-bought-together" class="mx-auto w-full max-w-4xl space-y-6 p-6 shadow-xs">
    <!-- Header -->
    <div class="space-y-1.5">
      <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Frequently Bought Together</h2>
      <p class="text-muted-foreground text-sm">
        Pair with these recommended essentials for maximum performance and save 15% on the bundle
      </p>
    </div>

    <!-- Product Visual Row -->
    <div class="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-4">
      <template v-for="(item, index) in items" :key="item.id">
        <div
          class="border-border bg-muted/20 relative flex flex-col rounded-xl border p-3 text-left transition-all duration-200 sm:p-4"
          :class="selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-40 grayscale'"
        >
          <div class="border-border bg-background relative mb-3 aspect-square w-full overflow-hidden rounded-lg border">
            <img :src="item.image" :alt="item.name" class="size-full object-cover" />
            <Badge
              v-if="item.isMain"
              variant="secondary"
              class="bg-background/90 text-foreground absolute top-2 left-2 text-xs font-medium backdrop-blur-xs"
            >
              This item
            </Badge>
          </div>
          <span class="text-foreground line-clamp-1 text-xs leading-tight font-semibold sm:text-sm">
            {{ item.name }}
          </span>
          <span class="text-foreground mt-1 text-xs font-semibold tabular-nums sm:text-sm">
            {{ formatCurrency(item.price) }}
          </span>
        </div>

        <div
          v-if="index < items.length - 1"
          class="border-border/50 text-muted-foreground bg-muted mx-auto flex size-8 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <Plus class="size-4" />
        </div>
      </template>
    </div>

    <!-- Item Selection Checkbox List -->
    <div class="space-y-2.5">
      <div
        v-for="item in items"
        :key="item.id"
        role="button"
        tabindex="0"
        class="border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors select-none focus-visible:ring-2 focus-visible:outline-none sm:items-center"
        :class="
          selectedIds.includes(item.id)
            ? 'bg-card hover:border-primary/40'
            : 'border-border/60 bg-muted/10 opacity-60 hover:opacity-80'
        "
        @click="toggleItem(item.id)"
        @keydown.space.prevent="toggleItem(item.id)"
        @keydown.enter.prevent="toggleItem(item.id)"
      >
        <div class="flex items-start gap-3 sm:items-center">
          <Checkbox
            :id="item.id"
            :model-value="selectedIds.includes(item.id)"
            class="pointer-events-none mt-0.5 sm:mt-0"
            tabindex="-1"
          />
          <div class="space-y-0.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-foreground text-sm font-medium">
                <span v-if="item.isMain" class="font-semibold">This item: </span>
                {{ item.name }}
              </span>
              <Badge v-if="item.isMain" variant="secondary" class="text-xs"> Main Item </Badge>
            </div>
            <p class="text-muted-foreground text-xs">{{ item.subtitle }}</p>
          </div>
        </div>
        <span class="text-foreground shrink-0 text-sm font-semibold tabular-nums">
          {{ formatCurrency(item.price) }}
        </span>
      </div>
    </div>

    <!-- Price & Bundle Checkout Summary Box -->
    <div
      class="border-border bg-muted/30 flex flex-col gap-4 rounded-xl border p-4 sm:p-5 md:flex-row md:items-center md:justify-between"
    >
      <div class="space-y-1.5">
        <div class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {{ selectedCount >= 2 ? 'Bundle Price' : 'Total Price' }}
        </div>
        <div class="flex flex-wrap items-baseline gap-2.5">
          <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
            {{ formatCurrency(finalPrice) }}
          </span>
          <span
            v-if="hasDiscount"
            class="text-muted-foreground text-sm font-medium tabular-nums line-through sm:text-base"
          >
            {{ formatCurrency(originalTotal) }}
          </span>
          <Badge
            v-if="hasDiscount"
            variant="outline"
            class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            Save {{ formatCurrency(discountAmount) }} (15% Bundle Discount)
          </Badge>
        </div>
        <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Truck class="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{{ deliveryNote }}</span>
        </div>
      </div>

      <Button size="lg" :disabled="selectedCount === 0" class="w-full gap-2 font-semibold shadow-xs md:w-auto">
        <ShoppingBag class="size-4" />
        <span>{{ buttonText }}</span>
      </Button>
    </div>
  </Card>
</template>
