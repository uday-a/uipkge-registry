<script lang="ts">
export interface ComparisonSpec {
  price: string
  driverSize: string
  batteryLife: string
  ancType: string
  waterResistance: string
  weight: string
  accessories: string
  connectivity?: string
  fastCharging?: string
  microphone?: string
  warranty?: string
}

export interface ComparisonProduct {
  id: string
  name: string
  tagline: string
  badge: string
  badgeVariant?: 'default' | 'secondary' | 'outline'
  price: string
  numericPrice: number
  rating: number
  reviewsCount: number
  image: string
  inStock: boolean
  shipping: string
  specs: ComparisonSpec
}

export interface SpecField {
  key: keyof ComparisonSpec
  label: string
  category: 'Key Specifications' | 'Audio & Connectivity' | 'Package & Warranty'
  description?: string
}

export const DEFAULT_COMPARISON_PRODUCTS: ComparisonProduct[] = [
  {
    id: 'prod-headphones',
    name: 'Pro Wireless Headphones',
    tagline: 'Flagship Over-Ear Studio Sound',
    badge: 'Best Overall',
    badgeVariant: 'default',
    price: '$299.00',
    numericPrice: 299,
    rating: 4.9,
    reviewsCount: 1240,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    shipping: 'Free Next-Day Delivery',
    specs: {
      price: '$299.00',
      driverSize: '40mm Graphene',
      batteryLife: '40 Hours',
      ancType: 'Adaptive ANC',
      waterResistance: 'IPX4',
      weight: '245g',
      accessories: 'Hard Travel Case, 3.5mm Cable, USB-C Cable, Airplane Adapter',
      connectivity: 'Bluetooth 5.3 + Multipoint',
      fastCharging: '10 min charge = 3 hrs playback',
      microphone: '6 Mics with Beamforming AI',
      warranty: '2-Year Manufacturer Warranty',
    },
  },
  {
    id: 'prod-earbuds',
    name: 'Aero Studio Earbuds',
    tagline: 'Compact True Wireless In-Ear',
    badge: 'Editor Choice',
    badgeVariant: 'secondary',
    price: '$199.00',
    numericPrice: 199,
    rating: 4.7,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    shipping: 'Free 2-Day Delivery',
    specs: {
      price: '$199.00',
      driverSize: '11mm Dynamic',
      batteryLife: '28 Hours',
      ancType: 'Standard ANC',
      waterResistance: 'IPX5',
      weight: '54g',
      accessories: 'Wireless Charging Case, 4 Pairs Silicone Tips (XS/S/M/L), USB-C Cable',
      connectivity: 'Bluetooth 5.3 + Multipoint',
      fastCharging: '10 min charge = 3 hrs playback',
      microphone: '4 Mics with Wind Noise Guard',
      warranty: '2-Year Manufacturer Warranty',
    },
  },
  {
    id: 'prod-sport',
    name: 'Active ANC Sport',
    tagline: 'Rugged Ergonomic Workout Earphones',
    badge: 'Best Value',
    badgeVariant: 'secondary',
    price: '$149.00',
    numericPrice: 149,
    rating: 4.6,
    reviewsCount: 620,
    image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80',
    inStock: true,
    shipping: 'Free Standard Delivery',
    specs: {
      price: '$149.00',
      driverSize: '10mm Hybrid',
      batteryLife: '24 Hours',
      ancType: 'Passive Noise Isolation',
      waterResistance: 'IPX7 Waterproof',
      weight: '62g',
      accessories: 'Compact Case, Secure Wingtips, 3 Pairs Memory Foam Tips, USB-C Cable',
      connectivity: 'Bluetooth 5.3',
      fastCharging: '10 min charge = 3 hrs playback',
      microphone: '2 Mics with Environmental Noise Cancellation',
      warranty: '2-Year Manufacturer Warranty',
    },
  },
]

export const SPEC_FIELDS: SpecField[] = [
  {
    key: 'price',
    label: 'Price',
    category: 'Key Specifications',
    description: 'Manufacturer suggested retail price',
  },
  {
    key: 'driverSize',
    label: 'Driver Size',
    category: 'Key Specifications',
    description: 'Acoustic transducer diameter and diaphragm material',
  },
  {
    key: 'batteryLife',
    label: 'Battery Life',
    category: 'Key Specifications',
    description: 'Total listening duration with active cancellation enabled',
  },
  {
    key: 'ancType',
    label: 'ANC Type',
    category: 'Key Specifications',
    description: 'Acoustic cancellation and transparency algorithm type',
  },
  {
    key: 'waterResistance',
    label: 'Water Resistance',
    category: 'Key Specifications',
    description: 'Ingress protection rating against moisture and dust',
  },
  {
    key: 'weight',
    label: 'Weight',
    category: 'Key Specifications',
    description: 'Total physical mass including ear cushions/enclosures',
  },
  {
    key: 'accessories',
    label: 'In-Box Accessories',
    category: 'Package & Warranty',
    description: 'Included bundled cables, adapters, and travel protection',
  },
  {
    key: 'connectivity',
    label: 'Connectivity',
    category: 'Audio & Connectivity',
    description: 'Wireless Bluetooth specification and dual-device pairing',
  },
  {
    key: 'fastCharging',
    label: 'Fast Charging',
    category: 'Audio & Connectivity',
    description: 'Quick-boost charging time for emergency playback',
  },
  {
    key: 'microphone',
    label: 'Microphone Array',
    category: 'Audio & Connectivity',
    description: 'Voice pickup sensors and beamforming algorithms',
  },
  {
    key: 'warranty',
    label: 'Warranty',
    category: 'Package & Warranty',
    description: 'Manufacturer warranty coverage period',
  },
]
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  RotateCcw,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Props {
  defaultOpen?: boolean
  defaultHighlightDiffs?: boolean
  products?: ComparisonProduct[]
  mode?: 'dock' | 'expanded'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  defaultHighlightDiffs: false,
  mode: 'dock',
})

const emit = defineEmits<{
  'update:open': [open: boolean]
  addToCart: [product: ComparisonProduct]
  removeProduct: [productId: string]
  clearAll: []
  restoreProducts: []
}>()

const isExpanded = ref(props.defaultOpen || props.mode === 'expanded')
const highlightDiffs = ref(props.defaultHighlightDiffs)
const selectedProducts = ref<ComparisonProduct[]>([...(props.products ?? DEFAULT_COMPARISON_PRODUCTS)])
const addedProductId = ref<string | null>(null)

watch(
  () => props.products,
  (newProducts) => {
    selectedProducts.value = [...(newProducts ?? [])]
  },
  { deep: true },
)

watch(isExpanded, (val) => {
  emit('update:open', val)
})

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function toggleProduct(product: ComparisonProduct) {
  if (selectedProducts.value.some((p) => p.id === product.id)) {
    handleRemoveProduct(product.id)
  } else {
    selectedProducts.value = [...selectedProducts.value, product]
  }
}

function handleRemoveProduct(id: string) {
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== id)
  emit('removeProduct', id)
}

function handleClearAll() {
  selectedProducts.value = []
  emit('clearAll')
}

function handleRestoreProducts() {
  selectedProducts.value = [...DEFAULT_COMPARISON_PRODUCTS]
  emit('restoreProducts')
}

function handleAddToCart(product: ComparisonProduct) {
  addedProductId.value = product.id
  emit('addToCart', product)
  setTimeout(() => {
    if (addedProductId.value === product.id) {
      addedProductId.value = null
    }
  }, 1800)
}

// Diff detection: checks if values differ across the currently selected products
function isRowDiff(specKey: keyof ComparisonSpec): boolean {
  if (selectedProducts.value.length <= 1) return false
  const firstVal = selectedProducts.value[0]?.specs[specKey]
  return selectedProducts.value.some((p) => p.specs[specKey] !== firstVal)
}

const categories = computed(() => {
  const cats: Array<{ name: string; fields: SpecField[] }> = []
  for (const field of SPEC_FIELDS) {
    let group = cats.find((c) => c.name === field.category)
    if (!group) {
      group = { name: field.category, fields: [] }
      cats.push(group)
    }
    group.fields.push(field)
  }
  return cats
})

const diffCount = computed(() => {
  return SPEC_FIELDS.filter((f) => isRowDiff(f.key)).length
})
</script>

<template>
  <div
    data-slot="product-comparison-drawer"
    :class="
      cn('bg-background text-foreground relative flex w-full flex-col overflow-hidden rounded-xl border', props.class)
    "
  >
    <!-- Background Mock Catalog Page Preview (Context for Dock) -->
    <div v-if="mode === 'dock'" class="bg-muted/10 flex flex-col p-4 sm:p-6 lg:p-8">
      <div class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold tracking-wider uppercase">
              Audio Lab
            </span>
            <span class="text-muted-foreground text-xs font-medium">Over-Ear & In-Ear Systems</span>
          </div>
          <h2 class="text-xl font-bold tracking-tight sm:text-2xl">High-Fidelity Audio Lineup</h2>
          <p class="text-muted-foreground mt-1 text-xs sm:text-sm">
            Select flagship models below to compare acoustic architectures, battery runtime, and diffs side by side.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Button
            v-if="selectedProducts.length < DEFAULT_COMPARISON_PRODUCTS.length"
            variant="outline"
            size="sm"
            class="text-xs"
            @click="handleRestoreProducts"
          >
            <RotateCcw class="mr-1.5 size-3.5" />
            Reset Selection
          </Button>
          <Button variant="default" size="sm" class="text-xs" @click="toggleExpanded">
            <SlidersHorizontal class="mr-1.5 size-3.5" />
            {{ isExpanded ? 'Hide Comparison' : `Compare (${selectedProducts.length})` }}
          </Button>
        </div>
      </div>

      <!-- Mock Catalog Cards Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in DEFAULT_COMPARISON_PRODUCTS"
          :key="product.id"
          class="bg-card hover:border-border group relative flex flex-col justify-between rounded-lg border p-4 shadow-xs transition-colors"
          :class="{
            'ring-primary/20 border-primary/40 ring-1': selectedProducts.some((p) => p.id === product.id),
          }"
        >
          <div>
            <div class="bg-muted/40 relative aspect-4/3 w-full overflow-hidden rounded-md">
              <img
                :src="product.image"
                :alt="product.name"
                class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute top-2.5 left-2.5">
                <Badge :variant="product.badgeVariant || 'default'" class="text-xs font-medium shadow-xs">
                  {{ product.badge }}
                </Badge>
              </div>
            </div>

            <div class="mt-3.5 space-y-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-xs text-amber-500">
                  <Star class="size-3.5 fill-current" />
                  <span class="text-foreground font-semibold tabular-nums">{{ product.rating }}</span>
                  <span class="text-muted-foreground">({{ product.reviewsCount.toLocaleString() }})</span>
                </div>
                <span class="text-sm font-bold tabular-nums">{{ product.price }}</span>
              </div>
              <h3 class="text-foreground text-sm font-semibold tracking-tight">{{ product.name }}</h3>
              <p class="text-muted-foreground line-clamp-1 text-xs">{{ product.tagline }}</p>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between gap-2 border-t pt-3">
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1.5 text-xs font-medium transition-colors"
              @click="toggleProduct(product)"
            >
              <div
                class="flex size-4 items-center justify-center rounded border transition-colors"
                :class="
                  selectedProducts.some((p) => p.id === product.id)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/40 bg-background'
                "
              >
                <Check v-if="selectedProducts.some((p) => p.id === product.id)" class="size-3 stroke-[3]" />
              </div>
              <span>{{ selectedProducts.some((p) => p.id === product.id) ? 'Comparing' : 'Add to compare' }}</span>
            </button>

            <Button
              size="sm"
              variant="outline"
              class="h-8 text-xs"
              :disabled="addedProductId === product.id"
              @click="handleAddToCart(product)"
            >
              <Check v-if="addedProductId === product.id" class="text-success mr-1 size-3.5" />
              <ShoppingCart v-else class="mr-1 size-3.5" />
              {{ addedProductId === product.id ? 'Added' : 'Add' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Sticky Comparison Bar (Dock at Bottom) -->
    <div
      v-if="mode === 'dock' && !isExpanded"
      class="bg-background/95 supports-[backdrop-filter]:bg-background/85 sticky bottom-0 z-30 w-full border-t p-3 backdrop-blur-md transition-all sm:p-4"
    >
      <div class="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <!-- Selected Products List -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:gap-3 sm:pb-0">
          <div class="flex shrink-0 items-center gap-1.5 pr-2">
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Layers class="size-4" />
            </div>
            <div class="flex flex-col">
              <span class="text-xs leading-tight font-semibold">Compare Dock</span>
              <span class="text-muted-foreground text-xs tabular-nums">
                {{ selectedProducts.length }} / {{ DEFAULT_COMPARISON_PRODUCTS.length }} selected
              </span>
            </div>
          </div>

          <Separator orientation="vertical" class="hidden h-8 sm:block" />

          <!-- Selected Thumbnails -->
          <div v-if="selectedProducts.length > 0" class="flex items-center gap-2">
            <div
              v-for="product in selectedProducts"
              :key="product.id"
              class="bg-card group hover:border-primary/40 relative flex shrink-0 items-center gap-2 rounded-lg border p-1.5 pr-2.5 shadow-2xs transition-all"
            >
              <img :src="product.image" :alt="product.name" class="size-9 rounded-md object-cover" />
              <div class="flex flex-col">
                <span class="max-w-[110px] truncate text-xs font-medium sm:max-w-[130px]">{{ product.name }}</span>
                <span class="text-muted-foreground text-xs font-semibold tabular-nums">{{ product.price }}</span>
              </div>
              <button
                type="button"
                class="bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full border opacity-0 shadow-2xs transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                :aria-label="`Remove ${product.name} from comparison`"
                @click.stop="handleRemoveProduct(product.id)"
              >
                <X class="size-2.5" />
              </button>
            </div>
          </div>

          <div v-else class="text-muted-foreground flex items-center gap-2 py-1 text-xs">
            <span>No products in comparison dock.</span>
            <button type="button" class="text-primary font-medium hover:underline" @click="handleRestoreProducts">
              Restore 3 Items
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex shrink-0 items-center justify-end gap-2">
          <Button
            v-if="selectedProducts.length > 0"
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground h-8 text-xs font-medium"
            @click="handleClearAll"
          >
            Clear All
          </Button>

          <Button
            variant="default"
            size="sm"
            class="h-8 gap-1.5 text-xs font-medium shadow-xs"
            :disabled="selectedProducts.length === 0"
            @click="toggleExpanded"
          >
            <span>Compare {{ selectedProducts.length }} Items</span>
            <ChevronUp class="size-3.5" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Expanded Full Specification Matrix Drawer / Container -->
    <div
      v-if="isExpanded || mode === 'expanded'"
      class="bg-background motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 relative flex w-full flex-col border-t shadow-lg motion-safe:duration-200"
    >
      <!-- Matrix Header Controls Bar -->
      <div
        class="bg-card/90 supports-[backdrop-filter]:bg-card/75 sticky top-0 z-30 border-b px-4 py-3.5 backdrop-blur-md sm:px-6"
      >
        <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div class="flex items-center gap-3">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <SlidersHorizontal class="size-4" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold tracking-tight">Specification Matrix</h3>
                <Badge variant="secondary" class="text-xs font-semibold tabular-nums">
                  {{ selectedProducts.length }} Selected
                </Badge>
                <Badge
                  v-if="highlightDiffs"
                  variant="outline"
                  class="border-primary/40 bg-primary/5 text-primary text-xs"
                >
                  <Sparkles class="mr-1 size-3" />
                  Diffs Highlighted ({{ diffCount }})
                </Badge>
              </div>
              <p class="text-muted-foreground text-xs">
                Side-by-side technical breakdown across drivers, battery, acoustics, and box contents.
              </p>
            </div>
          </div>

          <!-- Controls: Diff Switch & Close -->
          <div class="flex items-center gap-4">
            <div class="flex items-center space-x-2">
              <Switch
                id="vue-diff-toggle"
                size="sm"
                :model-value="highlightDiffs"
                @update:model-value="(val) => (highlightDiffs = val)"
              />
              <label for="vue-diff-toggle" class="cursor-pointer text-xs font-medium select-none">
                Highlight Differences Only
              </label>
            </div>

            <Button
              v-if="mode === 'dock'"
              variant="outline"
              size="sm"
              class="h-8 gap-1 text-xs"
              @click="toggleExpanded"
            >
              <span>Collapse</span>
              <ChevronDown class="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Specification Matrix Content -->
      <div v-if="selectedProducts.length === 0" class="flex flex-col items-center justify-center p-12 text-center">
        <div class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <Trash2 class="size-6" />
        </div>
        <h4 class="mt-3 text-sm font-semibold">No Products Selected</h4>
        <p class="text-muted-foreground mt-1 max-w-sm text-xs">
          You have cleared all items from comparison. Restore the baseline audio products to explore differences.
        </p>
        <Button variant="default" size="sm" class="mt-4 text-xs" @click="handleRestoreProducts">
          <RotateCcw class="mr-1.5 size-3.5" />
          Restore 3 Items
        </Button>
      </div>

      <div v-else class="w-full overflow-x-auto">
        <table class="w-full max-w-[760px] min-w-full border-separate border-spacing-0 text-left text-xs">
          <!-- Sticky Product Card Header Row -->
          <thead>
            <tr>
              <th
                scope="col"
                class="bg-background text-muted-foreground sticky top-0 left-0 z-20 w-[200px] min-w-[180px] border-b p-4 align-bottom font-medium"
              >
                <div class="space-y-1">
                  <span class="text-foreground text-xs font-semibold tracking-wider uppercase">Attributes</span>
                  <p class="text-muted-foreground text-xs font-normal">
                    {{ selectedProducts.length }} products compared
                  </p>
                </div>
              </th>

              <!-- Product Columns -->
              <th
                v-for="product in selectedProducts"
                :key="product.id"
                scope="col"
                class="bg-background relative w-[240px] min-w-[220px] border-b p-4 align-top"
              >
                <div class="flex flex-col gap-3">
                  <!-- Remove button -->
                  <div class="flex items-center justify-between gap-2">
                    <Badge :variant="product.badgeVariant || 'default'" class="text-xs font-medium">
                      {{ product.badge }}
                    </Badge>
                    <button
                      type="button"
                      class="text-muted-foreground hover:bg-muted hover:text-foreground flex size-6 items-center justify-center rounded-md transition-colors"
                      :aria-label="`Remove ${product.name}`"
                      @click="handleRemoveProduct(product.id)"
                    >
                      <X class="size-3.5" />
                    </button>
                  </div>

                  <!-- Product Hero Visual -->
                  <div class="flex items-center gap-3">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="size-16 rounded-md border object-cover shadow-2xs"
                    />
                    <div class="flex flex-col">
                      <span class="text-foreground text-xs leading-tight font-semibold">{{ product.name }}</span>
                      <div class="mt-1 flex items-center gap-1 text-xs text-amber-500">
                        <Star class="size-3 fill-current" />
                        <span class="text-foreground font-medium tabular-nums">{{ product.rating }}</span>
                      </div>
                      <span class="text-foreground mt-1 text-sm font-bold tabular-nums">{{ product.price }}</span>
                    </div>
                  </div>

                  <!-- Quick Buy Trigger -->
                  <Button
                    size="sm"
                    variant="default"
                    class="w-full gap-1.5 text-xs shadow-xs"
                    :disabled="addedProductId === product.id"
                    @click="handleAddToCart(product)"
                  >
                    <Check v-if="addedProductId === product.id" class="text-success size-3.5" />
                    <ShoppingCart v-else class="size-3.5" />
                    {{ addedProductId === product.id ? 'Added to Cart' : 'Add to Cart' }}
                  </Button>
                </div>
              </th>
            </tr>
          </thead>

          <!-- Table Body grouped by Category -->
          <tbody v-for="category in categories" :key="category.name">
            <!-- Category Subheading Header Row -->
            <tr>
              <th
                :colspan="selectedProducts.length + 1"
                scope="colgroup"
                class="bg-muted/60 text-muted-foreground sticky left-0 z-10 border-b px-4 py-2 text-xs font-semibold tracking-wider uppercase"
              >
                {{ category.name }}
              </th>
            </tr>

            <!-- Specification Rows -->
            <tr
              v-for="field in category.fields"
              :key="field.key"
              class="group/row transition-colors"
              :class="[
                isRowDiff(field.key) && highlightDiffs
                  ? 'bg-primary/[0.04] dark:bg-primary/[0.08]'
                  : 'hover:bg-muted/20',
                !isRowDiff(field.key) && highlightDiffs ? 'opacity-40' : 'opacity-100',
              ]"
            >
              <!-- Spec Label Cell (Sticky Left) -->
              <th
                scope="row"
                class="bg-background group-hover/row:bg-muted/30 sticky left-0 z-10 border-b p-3.5 align-middle text-xs font-medium"
              >
                <div class="flex items-center justify-between gap-1.5">
                  <div class="flex flex-col">
                    <span class="text-foreground font-medium">{{ field.label }}</span>
                    <span v-if="field.description" class="text-muted-foreground text-xs font-normal">
                      {{ field.description }}
                    </span>
                  </div>
                  <span
                    v-if="isRowDiff(field.key) && highlightDiffs"
                    class="bg-primary/10 text-primary shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold"
                  >
                    Diff
                  </span>
                </div>
              </th>

              <!-- Spec Values for Each Selected Product -->
              <td
                v-for="product in selectedProducts"
                :key="product.id"
                class="text-foreground border-b p-3.5 align-middle text-xs"
              >
                <div class="flex items-center gap-1.5">
                  <span
                    :class="{
                      'font-semibold tabular-nums':
                        field.key === 'price' || field.key === 'weight' || field.key === 'batteryLife',
                      'text-foreground font-medium': isRowDiff(field.key),
                      'text-muted-foreground': !isRowDiff(field.key),
                    }"
                  >
                    {{ product.specs[field.key] || '—' }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Sticky Bottom Buy Triggers Footer -->
          <tfoot>
            <tr class="bg-card sticky bottom-0 z-20">
              <th scope="row" class="bg-card sticky left-0 z-20 border-t p-4 align-middle">
                <div class="space-y-0.5">
                  <span class="text-foreground text-xs font-semibold">Sticky Buy Trigger</span>
                  <p class="text-muted-foreground text-xs">All purchases backed by 30-day money-back guarantee.</p>
                </div>
              </th>

              <td v-for="product in selectedProducts" :key="product.id" class="border-t p-4 align-middle">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <span class="text-foreground text-xs font-bold tabular-nums">{{ product.price }}</span>
                    <span class="text-muted-foreground text-xs">{{ product.shipping }}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    class="w-full gap-1.5 text-xs shadow-xs"
                    :disabled="addedProductId === product.id"
                    @click="handleAddToCart(product)"
                  >
                    <Check v-if="addedProductId === product.id" class="text-success size-3.5" />
                    <ShoppingCart v-else class="size-3.5" />
                    {{ addedProductId === product.id ? 'Added' : 'Buy Now' }}
                  </Button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
