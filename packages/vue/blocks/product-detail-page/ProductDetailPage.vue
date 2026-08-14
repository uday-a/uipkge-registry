<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Flame,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

// Import sub-blocks to compose the canonical enterprise PDP
import FlashSaleOfferBar from '../flash-sale-offer-bar/FlashSaleOfferBar.vue'
import TechnicalSpecsSheet from '../technical-specs-sheet/TechnicalSpecsSheet.vue'
import ProductQaCommunity from '../product-qa-community/ProductQaCommunity.vue'
import CustomerReviews from '../customer-reviews/CustomerReviews.vue'
import FrequentlyBoughtTogether from '../frequently-bought-together/FrequentlyBoughtTogether.vue'

interface ProductVariant {
  id: string
  name: string
  colorHex: string
  sku: string
  inStock: boolean
  stockCount: number
  price: number
  originalPrice: number
  images: { id: string; url: string; alt: string }[]
}

const variants: ProductVariant[] = [
  {
    id: 'var-black',
    name: 'Obsidian Matte Black',
    colorHex: '#18181b',
    sku: 'APX-950-BLK',
    inStock: true,
    stockCount: 14,
    price: 599,
    originalPrice: 749,
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Reference Studio Headphones on Wood Desk',
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro CNC Aluminum Driver Open Back View',
      },
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Lambskin Magnetic Earpads Angle',
      },
      {
        id: 'img-4',
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Studio Audio Cable Interconnects',
      },
    ],
  },
  {
    id: 'var-silver',
    name: 'Lunar Silver Aluminum',
    colorHex: '#94a3b8',
    sku: 'APX-950-SLV',
    inStock: true,
    stockCount: 6,
    price: 599,
    originalPrice: 749,
    images: [
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Lunar Silver Open Back View',
      },
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Silver Edition Desk Shot',
      },
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Earpads Detail',
      },
    ],
  },
  {
    id: 'var-navy',
    name: 'Midnight Studio Navy',
    colorHex: '#1e293b',
    sku: 'APX-950-NVY',
    inStock: true,
    stockCount: 3,
    price: 629,
    originalPrice: 779,
    images: [
      {
        id: 'img-3',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Midnight Navy Studio Edition',
      },
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Navy Perspective',
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
        alt: 'Apex Pro Navy Driver Housing',
      },
    ],
  },
]

const selectedVariantId = ref(variants[0].id)
const activeImageIndex = ref(0)
const quantity = ref(1)
const selectedCable = ref<'4.4mm' | '3.5mm' | 'xlr'>('4.4mm')
const isWishlisted = ref(false)
const addExtendedWarranty = ref(true)
const zipCode = ref('94103')

const currentVariant = computed(() => {
  return variants.find((v) => v.id === selectedVariantId.value) || variants[0]
})

const activeImageUrl = computed(() => {
  return currentVariant.value.images[activeImageIndex.value]?.url || currentVariant.value.images[0].url
})

const finalPrice = computed(() => {
  let base = currentVariant.value.price * quantity.value
  if (addExtendedWarranty.value) base += 49
  return base
})

function selectVariant(v: ProductVariant) {
  selectedVariantId.value = v.id
  activeImageIndex.value = 0
}

function incrementQty() {
  if (quantity.value < currentVariant.value.stockCount) {
    quantity.value++
  }
}

function decrementQty() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

function handleAddToCart() {
  alert(
    `Added ${quantity.value}x ${currentVariant.value.name} (${selectedCable.value}) to cart. Total: $${finalPrice.value}`,
  )
}

function shareLink() {
  alert('Share link copied to clipboard!')
}

function handleExpressBuy() {
  alert(`Initiating Express Apple Pay checkout for $${finalPrice.value}...`)
}
</script>

<template>
  <div data-slot="product-detail-page" class="bg-background text-foreground w-full space-y-10">
    <!-- Breadcrumb Navigation Bar -->
    <nav class="text-muted-foreground flex items-center gap-1.5 text-xs">
      <span class="hover:text-foreground cursor-pointer">Storefront</span>
      <ChevronRight class="size-3.5" />
      <span class="hover:text-foreground cursor-pointer">Pro Audio & Reference</span>
      <ChevronRight class="size-3.5" />
      <span class="hover:text-foreground cursor-pointer">Planar Magnetic</span>
      <ChevronRight class="size-3.5" />
      <span class="text-foreground font-medium">APX-950-PRO Reference Monitor</span>
    </nav>

    <!-- Main Hero Split: Gallery & Buy Box -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <!-- Left Column: Interactive Image Gallery (7 Cols) -->
      <div class="space-y-4 lg:col-span-7">
        <!-- Main Large Showcase Image -->
        <div class="border-border bg-muted/30 relative aspect-4/3 w-full overflow-hidden rounded-xl border shadow-xs">
          <img
            :src="activeImageUrl"
            :alt="currentVariant.name"
            class="size-full object-cover transition-all duration-300 hover:scale-105"
          />

          <!-- Overlaid Badges -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge variant="default" class="h-6 font-mono text-xs font-semibold uppercase"> 2026 Flagship </Badge>
            <Badge variant="secondary" class="h-6 font-mono text-xs text-emerald-600 dark:text-emerald-400">
              Laboratory Calibrated
            </Badge>
          </div>

          <!-- Quick Action Floating Buttons -->
          <div class="absolute top-3 right-3 flex flex-col gap-2">
            <button
              type="button"
              :class="[
                'border-border bg-background/90 flex size-8 items-center justify-center rounded-full border shadow-2xs backdrop-blur-xs transition-colors',
                isWishlisted ? 'text-destructive' : 'text-muted-foreground hover:text-foreground',
              ]"
              @click="isWishlisted = !isWishlisted"
            >
              <Heart class="size-4" :class="{ 'fill-current': isWishlisted }" />
            </button>
            <button
              type="button"
              class="border-border bg-background/90 text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full border shadow-2xs backdrop-blur-xs transition-colors"
              @click="shareLink"
            >
              <Share2 class="size-4" />
            </button>
          </div>
        </div>

        <!-- Thumbnail Selector Row -->
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="(img, idx) in currentVariant.images"
            :key="img.id"
            type="button"
            :class="[
              'bg-muted/20 relative aspect-4/3 overflow-hidden rounded-lg border transition-all',
              activeImageIndex === idx
                ? 'border-primary ring-primary/40 ring-2'
                : 'border-border opacity-70 hover:opacity-100',
            ]"
            @click="activeImageIndex = idx"
          >
            <img :src="img.url" :alt="img.alt" class="size-full object-cover" />
          </button>
        </div>

        <!-- Value Assurance Micro-Bar -->
        <div class="border-border bg-muted/20 grid grid-cols-3 gap-3 rounded-lg border p-3 text-center text-xs">
          <div class="flex flex-col items-center gap-1">
            <Truck class="text-primary size-4" />
            <span class="text-foreground font-medium">Free 2-Day Air</span>
            <span class="text-muted-foreground text-xs">Orders over $150</span>
          </div>
          <div class="border-border/80 flex flex-col items-center gap-1 border-x px-2">
            <RotateCcw class="size-4 text-emerald-500" />
            <span class="text-foreground font-medium">45-Day Trial</span>
            <span class="text-muted-foreground text-xs">Zero-risk return</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <ShieldCheck class="size-4 text-blue-500" />
            <span class="text-foreground font-medium">3-Yr Warranty</span>
            <span class="text-muted-foreground text-xs">Direct factory support</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Buy Box & Product Configuration (5 Cols) -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Title & Rating Header -->
        <div class="space-y-2">
          <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
            <span>SKU: {{ currentVariant.sku }}</span>
            <span>·</span>
            <span>Made in Germany</span>
          </div>

          <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Apex Pro Reference Planar Studio Headphones
          </h1>

          <!-- Reviews summary badge -->
          <div class="flex items-center gap-2 pt-1 text-xs">
            <div class="flex items-center gap-1 text-amber-500">
              <Star class="size-3.5 fill-amber-500" />
              <Star class="size-3.5 fill-amber-500" />
              <Star class="size-3.5 fill-amber-500" />
              <Star class="size-3.5 fill-amber-500" />
              <Star class="size-3.5 fill-amber-500" />
            </div>
            <span class="text-foreground font-semibold">4.9</span>
            <span class="text-muted-foreground">(342 Verified Mastering Reviews)</span>
          </div>
        </div>

        <Separator />

        <!-- Price Section with Live Discount -->
        <div class="space-y-1.5">
          <div class="flex items-baseline gap-3">
            <span class="text-foreground text-3xl font-extrabold tracking-tight"> ${{ currentVariant.price }} </span>
            <span class="text-muted-foreground text-base line-through"> ${{ currentVariant.originalPrice }} </span>
            <Badge variant="secondary" class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Save ${{ currentVariant.originalPrice - currentVariant.price }} (20% OFF)
            </Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            Interest-free installments of ${{ (currentVariant.price / 4).toFixed(2) }}/mo with Affirm or Klarna.
          </p>
        </div>

        <!-- Variant Color Selector -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-foreground font-medium">Finish / Enclosure:</span>
            <span class="text-muted-foreground font-mono font-semibold">{{ currentVariant.name }}</span>
          </div>

          <div class="flex items-center gap-3">
            <button
              v-for="v in variants"
              :key="v.id"
              type="button"
              :class="[
                'group relative flex size-9 items-center justify-center rounded-full border transition-all',
                selectedVariantId === v.id
                  ? 'border-primary ring-primary ring-offset-background ring-2 ring-offset-2'
                  : 'border-border hover:border-muted-foreground',
              ]"
              @click="selectVariant(v)"
            >
              <span
                class="size-6 rounded-full border border-black/10 shadow-2xs"
                :style="{ backgroundColor: v.colorHex }"
              />
            </button>
          </div>
        </div>

        <!-- Cable Termination Selector -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-foreground font-medium">Primary Studio Cable Termination:</span>
            <span class="text-primary font-mono text-xs">Included in package</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              :class="[
                'rounded-lg border p-2.5 text-center transition-all',
                selectedCable === '4.4mm'
                  ? 'border-primary bg-primary/5 text-primary ring-primary font-semibold ring-1'
                  : 'border-border bg-card text-foreground hover:bg-muted/40',
              ]"
              @click="selectedCable = '4.4mm'"
            >
              <div class="font-mono text-xs font-semibold">4.4mm Balanced</div>
              <div class="text-muted-foreground text-xs">Pentaconn TRRRS</div>
            </button>

            <button
              type="button"
              :class="[
                'rounded-lg border p-2.5 text-center transition-all',
                selectedCable === '3.5mm'
                  ? 'border-primary bg-primary/5 text-primary ring-primary font-semibold ring-1'
                  : 'border-border bg-card text-foreground hover:bg-muted/40',
              ]"
              @click="selectedCable = '3.5mm'"
            >
              <div class="font-mono text-xs font-semibold">3.5mm SE + 6.35mm</div>
              <div class="text-muted-foreground text-xs">Screw Adapter</div>
            </button>

            <button
              type="button"
              :class="[
                'rounded-lg border p-2.5 text-center transition-all',
                selectedCable === 'xlr'
                  ? 'border-primary bg-primary/5 text-primary ring-primary font-semibold ring-1'
                  : 'border-border bg-card text-foreground hover:bg-muted/40',
              ]"
              @click="selectedCable = 'xlr'"
            >
              <div class="font-mono text-xs font-semibold">4-Pin XLR Pro</div>
              <div class="text-muted-foreground text-xs">Neutrik Studio</div>
            </button>
          </div>
        </div>

        <!-- Add-on Warranty Checkbox -->
        <label
          class="border-border bg-muted/20 hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs transition-colors"
        >
          <input
            v-model="addExtendedWarranty"
            type="checkbox"
            class="border-border text-primary focus:ring-primary mt-0.5 size-4 rounded"
          />
          <div class="space-y-0.5">
            <div class="flex items-center justify-between">
              <span class="text-foreground font-semibold">Add 3-Year Apex Care+ Accidental Protection</span>
              <span class="text-foreground font-mono font-bold">+$49.00</span>
            </div>
            <p class="text-muted-foreground text-xs">
              Covers accidental drops, driver voice-coil failure, and free earpad replacement.
            </p>
          </div>
        </label>

        <!-- Stock Telemetry & Urgency Notice -->
        <div class="space-y-1.5 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3 text-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-semibold text-orange-600 dark:text-orange-400">
              <Flame class="size-3.5 fill-current" />
              <span>Fulfillment Hub Stock Level</span>
            </div>
            <span class="text-foreground font-mono font-bold">{{ currentVariant.stockCount }} units remaining</span>
          </div>
          <p class="text-muted-foreground text-xs">
            High demand: 18 sound engineers have this item in their active checkout carts.
          </p>
        </div>

        <!-- Quantity & Add to Cart Controls -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center gap-3">
            <!-- Stepper -->
            <div class="border-border bg-background flex h-10 items-center rounded-lg border shadow-2xs">
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center"
                @click="decrementQty"
              >
                <Minus class="size-3.5" />
              </button>
              <span class="text-foreground w-8 text-center font-mono text-xs font-semibold">{{ quantity }}</span>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center"
                @click="incrementQty"
              >
                <Plus class="size-3.5" />
              </button>
            </div>

            <!-- Primary Add to Cart -->
            <Button class="h-10 flex-1 gap-2 font-medium shadow-xs" @click="handleAddToCart">
              <ShoppingCart class="size-4" />
              <span>Add to Cart · ${{ finalPrice }}</span>
            </Button>
          </div>

          <!-- 1-Click Apple Pay / Instant Buy -->
          <Button
            variant="secondary"
            class="border-border h-10 w-full gap-2 border font-semibold shadow-2xs"
            @click="handleExpressBuy"
          >
            <Zap class="size-4 fill-amber-500 text-amber-500" />
            <span>Instant 1-Click Checkout (Apple Pay / G-Pay)</span>
          </Button>
        </div>

        <!-- Shipping Zip Code Estimator -->
        <div class="border-border bg-muted/20 flex items-center gap-2 rounded-lg border p-2.5 text-xs">
          <Truck class="text-muted-foreground size-4 shrink-0" />
          <span class="text-muted-foreground">Deliver to:</span>
          <Input v-model="zipCode" maxlength="5" class="h-7 w-20 text-center font-mono text-xs" />
          <span class="text-foreground font-medium">Fast Delivery: <strong>Tomorrow, 2:00 PM</strong></span>
        </div>
      </div>
    </div>

    <!-- Section 2: Flash Sale & Multi-Buy Tier Deal Bar -->
    <div class="space-y-3">
      <FlashSaleOfferBar
        saleTitle="Audio Pro Week: Limited Master Batch 04"
        :claimedPercent="82"
        :itemsLeft="currentVariant.stockCount"
      />
    </div>

    <!-- Section 3: Frequently Bought Together Bundle -->
    <div class="space-y-4">
      <FrequentlyBoughtTogether />
    </div>

    <!-- Section 4: Engineering & Technical Specifications Sheet -->
    <div class="space-y-4">
      <TechnicalSpecsSheet modelNumber="APX-950-PRO" revision="Studio Edition 2026" />
    </div>

    <!-- Section 5: Verified Customer Reviews & Photo Breakdown -->
    <div class="space-y-4">
      <CustomerReviews />
    </div>

    <!-- Section 6: Customer & Staff Q&A Community -->
    <div class="space-y-4">
      <ProductQaCommunity productName="Apex Pro Reference Planar Headphones" />
    </div>
  </div>
</template>
