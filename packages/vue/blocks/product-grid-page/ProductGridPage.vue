<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'

interface ProductColor {
  id: string
  name: string
  class: string
  colorCode: string
}

interface Product {
  id: string
  name: string
  brand: string
  category: string
  categoryId: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  badge?: {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  image: string
  colors: ProductColor[]
  createdAt: number
  featuredRank: number
}

interface CategoryOption {
  id: string
  label: string
}

interface BrandOption {
  id: string
  label: string
}

interface ColorOption {
  id: string
  label: string
  class: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const CATEGORIES: CategoryOption[] = [
  { id: 'sneakers', label: 'Sneakers' },
  { id: 'running', label: 'Running' },
  { id: 'boots', label: 'Boots' },
  { id: 'loafers', label: 'Loafers' },
]

const BRANDS: BrandOption[] = [
  { id: 'Nike', label: 'Nike' },
  { id: 'Adidas', label: 'Adidas' },
  { id: 'New Balance', label: 'New Balance' },
  { id: 'Salomon', label: 'Salomon' },
]

const COLORS: ColorOption[] = [
  { id: 'black', label: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900 border-zinc-800' },
  { id: 'white', label: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border-zinc-300' },
  { id: 'sage', label: 'Sage', class: 'bg-emerald-800 border-emerald-700' },
  { id: 'navy', label: 'Navy', class: 'bg-slate-900 border-slate-800' },
  { id: 'amber', label: 'Amber', class: 'bg-amber-600 border-amber-500' },
]

const RATING_OPTIONS = [
  { value: 4.8, label: '4.8 stars & above' },
  { value: 4.5, label: '4.5 stars & above' },
  { value: 4.0, label: '4.0 stars & above' },
]

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'XT-6 GORE-TEX Trail Running Shoe',
    brand: 'Salomon',
    category: 'Running',
    categoryId: 'running',
    price: 220,
    originalPrice: 245,
    rating: 4.9,
    reviewCount: 128,
    badge: { label: 'Best Seller', variant: 'default' },
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c1', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c2', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
      { id: 'c3', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
    ],
    createdAt: 1708000000000,
    featuredRank: 1,
  },
  {
    id: 'prod-2',
    name: 'Air Max Pulse Premium',
    brand: 'Nike',
    category: 'Sneakers',
    categoryId: 'sneakers',
    price: 150,
    originalPrice: 180,
    rating: 4.8,
    reviewCount: 94,
    badge: { label: '-20% OFF', variant: 'destructive' },
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c4', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
      { id: 'c5', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c6', name: 'Amber', class: 'bg-amber-600', colorCode: 'amber' },
    ],
    createdAt: 1708500000000,
    featuredRank: 2,
  },
  {
    id: 'prod-3',
    name: '990v6 Made in USA Core Sneaker',
    brand: 'New Balance',
    category: 'Sneakers',
    categoryId: 'sneakers',
    price: 200,
    rating: 4.9,
    reviewCount: 215,
    badge: { label: 'New', variant: 'secondary' },
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c7', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
      { id: 'c8', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
      { id: 'c9', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
    ],
    createdAt: 1709000000000,
    featuredRank: 3,
  },
  {
    id: 'prod-4',
    name: 'Ultraboost Light Performance Runner',
    brand: 'Adidas',
    category: 'Running',
    categoryId: 'running',
    price: 190,
    originalPrice: 210,
    rating: 4.7,
    reviewCount: 86,
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c10', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c11', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
    ],
    createdAt: 1707000000000,
    featuredRank: 4,
  },
  {
    id: 'prod-5',
    name: 'Tor Ultra Hi Waterproof Boot',
    brand: 'Salomon',
    category: 'Boots',
    categoryId: 'boots',
    price: 260,
    rating: 4.8,
    reviewCount: 62,
    badge: { label: 'Trending', variant: 'outline' },
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c12', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c13', name: 'Amber', class: 'bg-amber-600', colorCode: 'amber' },
    ],
    createdAt: 1708800000000,
    featuredRank: 5,
  },
  {
    id: 'prod-6',
    name: 'Penny Lug Leather Loafer',
    brand: 'Adidas',
    category: 'Loafers',
    categoryId: 'loafers',
    price: 160,
    originalPrice: 190,
    rating: 4.5,
    reviewCount: 41,
    badge: { label: 'Sale', variant: 'destructive' },
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c14', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c15', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
    ],
    createdAt: 1706000000000,
    featuredRank: 6,
  },
  {
    id: 'prod-7',
    name: 'Fresh Foam X Trail 574 v2',
    brand: 'New Balance',
    category: 'Running',
    categoryId: 'running',
    price: 135,
    originalPrice: 155,
    rating: 4.6,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c16', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
      { id: 'c17', name: 'Amber', class: 'bg-amber-600', colorCode: 'amber' },
      { id: 'c18', name: 'White', class: 'bg-zinc-100 dark:bg-zinc-200 border border-zinc-300', colorCode: 'white' },
    ],
    createdAt: 1707500000000,
    featuredRank: 7,
  },
  {
    id: 'prod-8',
    name: 'Tech Fleece Runner Low Boot',
    brand: 'Nike',
    category: 'Boots',
    categoryId: 'boots',
    price: 185,
    rating: 4.7,
    reviewCount: 53,
    badge: { label: 'New', variant: 'secondary' },
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=700&auto=format&fit=crop&q=80',
    colors: [
      { id: 'c19', name: 'Black', class: 'bg-zinc-950 dark:bg-zinc-900', colorCode: 'black' },
      { id: 'c20', name: 'Navy', class: 'bg-slate-900', colorCode: 'navy' },
      { id: 'c21', name: 'Sage', class: 'bg-emerald-800', colorCode: 'sage' },
    ],
    createdAt: 1708900000000,
    featuredRank: 8,
  },
]

const selectedCategories = ref<string[]>([])
const priceRange = ref<[number, number]>([50, 300])
const selectedColors = ref<string[]>([])
const selectedBrands = ref<string[]>([])
const minRating = ref<number>(0)
const sortBy = ref<string>('featured')
const wishlistIds = ref<Set<string>>(new Set(['prod-1', 'prod-5']))
const addedToCartIds = ref<Set<string>>(new Set())
const activeProductColor = ref<Record<string, string>>({})
const page = ref(1)
const totalPages = 3
const isMobileFilterOpen = ref(false)

function toggleCategory(id: string, checked: boolean) {
  if (checked) {
    selectedCategories.value = [...selectedCategories.value, id]
  } else {
    selectedCategories.value = selectedCategories.value.filter((item) => item !== id)
  }
  page.value = 1
}

function toggleBrand(id: string, checked: boolean) {
  if (checked) {
    selectedBrands.value = [...selectedBrands.value, id]
  } else {
    selectedBrands.value = selectedBrands.value.filter((item) => item !== id)
  }
  page.value = 1
}

function toggleColor(id: string) {
  if (selectedColors.value.includes(id)) {
    selectedColors.value = selectedColors.value.filter((item) => item !== id)
  } else {
    selectedColors.value = [...selectedColors.value, id]
  }
  page.value = 1
}

function setRating(val: number) {
  if (minRating.value === val) {
    minRating.value = 0
  } else {
    minRating.value = val
  }
  page.value = 1
}

function toggleWishlist(id: string) {
  const next = new Set(wishlistIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  wishlistIds.value = next
}

function isWishlisted(id: string) {
  return wishlistIds.value.has(id)
}

function addToCart(id: string) {
  const next = new Set(addedToCartIds.value)
  next.add(id)
  addedToCartIds.value = next
  setTimeout(() => {
    const updated = new Set(addedToCartIds.value)
    updated.delete(id)
    addedToCartIds.value = updated
  }, 1600)
}

function isAddedToCart(id: string) {
  return addedToCartIds.value.has(id)
}

function selectProductColor(productId: string, colorCode: string) {
  activeProductColor.value = {
    ...activeProductColor.value,
    [productId]: colorCode,
  }
}

function resetFilters() {
  selectedCategories.value = []
  priceRange.value = [50, 300]
  selectedColors.value = []
  selectedBrands.value = []
  minRating.value = 0
  page.value = 1
}

const hasActiveFilters = computed(() => {
  return (
    selectedCategories.value.length > 0 ||
    selectedBrands.value.length > 0 ||
    selectedColors.value.length > 0 ||
    minRating.value > 0 ||
    priceRange.value[0] > 50 ||
    priceRange.value[1] < 300
  )
})

const activeFilterCount = computed(() => {
  let count = 0
  if (selectedCategories.value.length > 0) count += selectedCategories.value.length
  if (selectedBrands.value.length > 0) count += selectedBrands.value.length
  if (selectedColors.value.length > 0) count += selectedColors.value.length
  if (minRating.value > 0) count += 1
  if (priceRange.value[0] > 50 || priceRange.value[1] < 300) count += 1
  return count
})

function getCategoryCount(catId: string) {
  return PRODUCTS.filter((p) => p.categoryId === catId).length
}

function getBrandCount(brand: string) {
  return PRODUCTS.filter((p) => p.brand === brand).length
}

const filteredProducts = computed(() => {
  return PRODUCTS.filter((product) => {
    if (selectedCategories.value.length > 0 && !selectedCategories.value.includes(product.categoryId)) {
      return false
    }
    if (product.price < priceRange.value[0] || product.price > priceRange.value[1]) {
      return false
    }
    if (selectedColors.value.length > 0) {
      const hasMatchingColor = product.colors.some((c) => selectedColors.value.includes(c.colorCode))
      if (!hasMatchingColor) return false
    }
    if (selectedBrands.value.length > 0 && !selectedBrands.value.includes(product.brand)) {
      return false
    }
    if (minRating.value > 0 && product.rating < minRating.value) {
      return false
    }
    return true
  }).sort((a, b) => {
    if (sortBy.value === 'price-asc') return a.price - b.price
    if (sortBy.value === 'price-desc') return b.price - a.price
    if (sortBy.value === 'rating-desc') return b.rating - a.rating
    if (sortBy.value === 'newest') return b.createdAt - a.createdAt
    return a.featuredRank - b.featuredRank
  })
})
</script>

<template>
  <div data-slot="product-grid-page" :class="cn('w-full space-y-8', props.class)">
    <!-- Breadcrumb -->
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" class="inline-flex min-h-6 items-center">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#" class="inline-flex min-h-6 items-center">Shop</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Footwear</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <!-- Header & Toolbar -->
    <div class="border-border flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">All Footwear</h1>
          <Badge variant="secondary" class="font-normal tabular-nums"> {{ filteredProducts.length }} items </Badge>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Engineered for performance, trail endurance, and everyday urban utility.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Mobile Filter Drawer Trigger -->
        <Sheet v-model:open="isMobileFilterOpen">
          <SheetTrigger as-child>
            <Button variant="outline" size="sm" class="gap-2 md:hidden">
              <SlidersHorizontal class="size-4" />
              <span>Filters</span>
              <Badge v-if="activeFilterCount > 0" variant="secondary" class="ml-1 px-1.5 py-0 text-xs">
                {{ activeFilterCount }}
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-full max-w-xs overflow-y-auto p-6">
            <SheetHeader class="text-left">
              <div class="flex items-center justify-between">
                <SheetTitle class="text-base font-semibold">Filters</SheetTitle>
                <Button
                  v-if="hasActiveFilters"
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-normal"
                  @click="resetFilters"
                >
                  Reset all
                </Button>
              </div>
              <SheetDescription class="text-xs"> Narrow down footwear by category, price, and specs. </SheetDescription>
            </SheetHeader>

            <div class="mt-6 space-y-6">
              <!-- Categories -->
              <div class="space-y-3">
                <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Category</h3>
                <div class="space-y-2.5">
                  <div v-for="cat in CATEGORIES" :key="cat.id" class="flex items-center justify-between">
                    <label
                      :for="`mobile-cat-${cat.id}`"
                      class="text-foreground flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        :id="`mobile-cat-${cat.id}`"
                        :model-value="selectedCategories.includes(cat.id)"
                        @update:model-value="toggleCategory(cat.id, $event === true)"
                      />
                      <span>{{ cat.label }}</span>
                    </label>
                    <span class="text-muted-foreground text-xs tabular-nums">{{ getCategoryCount(cat.id) }}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <!-- Price Range -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Price Range</h3>
                  <span class="text-foreground text-xs font-medium tabular-nums">
                    ${{ priceRange[0] }} – ${{ priceRange[1] }}
                  </span>
                </div>
                <Slider v-model="priceRange" :min="50" :max="300" :step="5" :range="true" class="py-2" />
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span>$50</span>
                  <span>$300</span>
                </div>
              </div>

              <Separator />

              <!-- Color Swatches -->
              <div class="space-y-3">
                <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Color</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="color in COLORS"
                    :key="color.id"
                    type="button"
                    :title="color.label"
                    class="focus-visible:ring-ring relative flex size-8 items-center justify-center rounded-full border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
                    :class="[
                      color.class,
                      selectedColors.includes(color.id)
                        ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                        : 'border-border',
                    ]"
                    @click="toggleColor(color.id)"
                  >
                    <Check
                      v-if="selectedColors.includes(color.id)"
                      class="size-4"
                      :class="color.id === 'white' ? 'text-zinc-950' : 'text-white'"
                    />
                    <span class="sr-only">{{ color.label }}</span>
                  </button>
                </div>
              </div>

              <Separator />

              <!-- Brand -->
              <div class="space-y-3">
                <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Brand</h3>
                <div class="space-y-2.5">
                  <div v-for="b in BRANDS" :key="b.id" class="flex items-center justify-between">
                    <label
                      :for="`mobile-brand-${b.id}`"
                      class="text-foreground flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        :id="`mobile-brand-${b.id}`"
                        :model-value="selectedBrands.includes(b.id)"
                        @update:model-value="toggleBrand(b.id, $event === true)"
                      />
                      <span>{{ b.label }}</span>
                    </label>
                    <span class="text-muted-foreground text-xs tabular-nums">{{ getBrandCount(b.id) }}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <!-- Rating -->
              <div class="space-y-3">
                <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Rating</h3>
                <div class="space-y-2">
                  <button
                    v-for="opt in RATING_OPTIONS"
                    :key="opt.value"
                    type="button"
                    class="hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors"
                    :class="minRating === opt.value ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'"
                    @click="setRating(opt.value)"
                  >
                    <div class="flex items-center gap-1.5">
                      <Star class="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{{ opt.label }}</span>
                    </div>
                    <Check v-if="minRating === opt.value" class="text-primary size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <!-- Sort Select -->
        <div class="flex items-center gap-2">
          <span class="text-muted-foreground hidden text-xs sm:inline-block">Sort by:</span>
          <Select v-model="sortBy">
            <SelectTrigger class="h-9 w-44 text-xs sm:text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- 2-Column Main Layout -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
      <!-- Left Desktop Sidebar -->
      <aside class="hidden space-y-6 md:block" aria-label="Product filters">
        <div class="flex items-center justify-between">
          <h2 class="text-foreground text-sm font-semibold tracking-tight">Filters</h2>
          <Button
            v-if="hasActiveFilters"
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground h-auto p-0 text-xs font-normal"
            @click="resetFilters"
          >
            Reset all
          </Button>
        </div>

        <Separator />

        <!-- Category checkboxes -->
        <div class="space-y-3">
          <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Category</h3>
          <div class="space-y-2.5">
            <div v-for="cat in CATEGORIES" :key="cat.id" class="flex items-center justify-between">
              <label :for="`cat-${cat.id}`" class="text-foreground flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  :id="`cat-${cat.id}`"
                  :model-value="selectedCategories.includes(cat.id)"
                  @update:model-value="toggleCategory(cat.id, $event === true)"
                />
                <span>{{ cat.label }}</span>
              </label>
              <span class="text-muted-foreground text-xs tabular-nums">{{ getCategoryCount(cat.id) }}</span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Price Range Slider -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Price Range</h3>
            <span class="text-foreground text-xs font-medium tabular-nums">
              ${{ priceRange[0] }} – ${{ priceRange[1] }}
            </span>
          </div>
          <Slider v-model="priceRange" :min="50" :max="300" :step="5" :range="true" class="py-2" />
          <div class="text-muted-foreground flex items-center justify-between text-xs">
            <span>$50</span>
            <span>$300</span>
          </div>
        </div>

        <Separator />

        <!-- Color Swatches -->
        <div class="space-y-3">
          <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Color</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in COLORS"
              :key="color.id"
              type="button"
              :title="color.label"
              class="focus-visible:ring-ring relative flex size-7 items-center justify-center rounded-full border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none"
              :class="[
                color.class,
                selectedColors.includes(color.id)
                  ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                  : 'border-border',
              ]"
              @click="toggleColor(color.id)"
            >
              <Check
                v-if="selectedColors.includes(color.id)"
                class="size-3.5"
                :class="color.id === 'white' ? 'text-zinc-950' : 'text-white'"
              />
              <span class="sr-only">{{ color.label }}</span>
            </button>
          </div>
        </div>

        <Separator />

        <!-- Brand checkboxes -->
        <div class="space-y-3">
          <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Brand</h3>
          <div class="space-y-2.5">
            <div v-for="b in BRANDS" :key="b.id" class="flex items-center justify-between">
              <label :for="`brand-${b.id}`" class="text-foreground flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  :id="`brand-${b.id}`"
                  :model-value="selectedBrands.includes(b.id)"
                  @update:model-value="toggleBrand(b.id, $event === true)"
                />
                <span>{{ b.label }}</span>
              </label>
              <span class="text-muted-foreground text-xs tabular-nums">{{ getBrandCount(b.id) }}</span>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Rating Filter -->
        <div class="space-y-3">
          <h3 class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Customer Rating</h3>
          <div class="space-y-1.5">
            <button
              v-for="opt in RATING_OPTIONS"
              :key="opt.value"
              type="button"
              class="hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors"
              :class="minRating === opt.value ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'"
              @click="setRating(opt.value)"
            >
              <div class="flex items-center gap-1.5">
                <Star class="size-3.5 fill-amber-400 text-amber-400" />
                <span>{{ opt.label }}</span>
              </div>
              <Check v-if="minRating === opt.value" class="text-primary size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Right Product Grid Area -->
      <section class="min-w-0 space-y-6">
        <!-- Active Filter Chips -->
        <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
          <Badge v-for="catId in selectedCategories" :key="catId" variant="secondary" class="gap-1.5 py-1 text-xs">
            <span>Category: {{ CATEGORIES.find((c) => c.id === catId)?.label }}</span>
            <button
              type="button"
              class="hover:text-foreground text-muted-foreground focus-visible:outline-none"
              aria-label="Remove category filter"
              @click="toggleCategory(catId, false)"
            >
              <X class="size-3" />
            </button>
          </Badge>

          <Badge v-for="brand in selectedBrands" :key="brand" variant="secondary" class="gap-1.5 py-1 text-xs">
            <span>Brand: {{ brand }}</span>
            <button
              type="button"
              class="hover:text-foreground text-muted-foreground focus-visible:outline-none"
              aria-label="Remove brand filter"
              @click="toggleBrand(brand, false)"
            >
              <X class="size-3" />
            </button>
          </Badge>

          <Badge v-for="colorId in selectedColors" :key="colorId" variant="secondary" class="gap-1.5 py-1 text-xs">
            <span>Color: {{ COLORS.find((c) => c.id === colorId)?.label }}</span>
            <button
              type="button"
              class="hover:text-foreground text-muted-foreground focus-visible:outline-none"
              aria-label="Remove color filter"
              @click="toggleColor(colorId)"
            >
              <X class="size-3" />
            </button>
          </Badge>

          <Badge v-if="minRating > 0" variant="secondary" class="gap-1.5 py-1 text-xs">
            <span>Rating: {{ minRating }}+ Stars</span>
            <button
              type="button"
              class="hover:text-foreground text-muted-foreground focus-visible:outline-none"
              aria-label="Remove rating filter"
              @click="minRating = 0"
            >
              <X class="size-3" />
            </button>
          </Badge>

          <Badge v-if="priceRange[0] > 50 || priceRange[1] < 300" variant="secondary" class="gap-1.5 py-1 text-xs">
            <span>Price: ${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
            <button
              type="button"
              class="hover:text-foreground text-muted-foreground focus-visible:outline-none"
              aria-label="Reset price filter"
              @click="priceRange = [50, 300]"
            >
              <X class="size-3" />
            </button>
          </Badge>

          <Button
            variant="link"
            size="sm"
            class="text-muted-foreground hover:text-foreground h-auto px-1 text-xs"
            @click="resetFilters"
          >
            Clear all
          </Button>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredProducts.length === 0"
          class="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center"
        >
          <div class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <RotateCcw class="size-6" />
          </div>
          <h3 class="text-foreground mt-4 text-base font-semibold">No matching footwear found</h3>
          <p class="text-muted-foreground mt-1 max-w-sm text-xs sm:text-sm">
            Try adjusting your price range, clearing selected colors, or resetting your filters to see more results.
          </p>
          <Button variant="outline" size="sm" class="mt-4 gap-2" @click="resetFilters">
            <RotateCcw class="size-3.5" />
            <span>Reset filters</span>
          </Button>
        </div>

        <!-- 3-Column Product Grid -->
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group border-border bg-card hover:border-border/80 relative flex flex-col overflow-hidden rounded-xl border p-3 shadow-xs transition-all duration-200 hover:shadow-md"
          >
            <!-- Image Aspect Square Container -->
            <div class="bg-muted/40 relative aspect-square w-full overflow-hidden rounded-lg">
              <img
                :src="product.image"
                :alt="product.name"
                class="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />

              <!-- Top Left Badge -->
              <div v-if="product.badge" class="absolute top-2.5 left-2.5 z-10">
                <Badge :variant="product.badge.variant" class="text-xs shadow-xs">
                  {{ product.badge.label }}
                </Badge>
              </div>

              <!-- Top Right Wishlist Heart -->
              <button
                type="button"
                aria-label="Toggle wishlist"
                class="bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full shadow-xs backdrop-blur-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                :class="{ 'text-red-500 hover:text-red-600': isWishlisted(product.id) }"
                @click.stop="toggleWishlist(product.id)"
              >
                <Heart
                  class="size-4 transition-transform active:scale-90"
                  :class="{ 'fill-current': isWishlisted(product.id) }"
                />
              </button>

              <!-- Quick Add Button (Visible on hover & focus) -->
              <div
                class="absolute inset-x-2.5 bottom-2.5 z-10 opacity-100 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-200 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
              >
                <Button
                  size="sm"
                  class="w-full gap-1.5 text-xs font-medium shadow-sm"
                  :variant="isAddedToCart(product.id) ? 'default' : 'default'"
                  @click.stop="addToCart(product.id)"
                >
                  <Check v-if="isAddedToCart(product.id)" class="size-3.5" />
                  <ShoppingBag v-else class="size-3.5" />
                  <span>{{ isAddedToCart(product.id) ? 'Added to Cart' : 'Quick Add' }}</span>
                </Button>
              </div>
            </div>

            <!-- Card Body -->
            <div class="mt-3 flex flex-1 flex-col justify-between space-y-2">
              <div>
                <!-- Color swatches preview -->
                <div class="flex items-center gap-1.5">
                  <button
                    v-for="color in product.colors"
                    :key="color.id"
                    type="button"
                    :title="color.name"
                    class="size-6 rounded-full transition-transform hover:scale-125 focus-visible:outline-none"
                    :class="[
                      color.class,
                      activeProductColor[product.id] === color.colorCode
                        ? 'ring-1.5 ring-primary ring-offset-background ring-offset-1'
                        : '',
                    ]"
                    @click.stop="selectProductColor(product.id, color.colorCode)"
                  >
                    <span class="sr-only">{{ color.name }}</span>
                  </button>
                  <span class="text-muted-foreground ml-1 text-xs">
                    {{ product.colors.length }} {{ product.colors.length === 1 ? 'color' : 'colors' }}
                  </span>
                </div>

                <!-- Brand & Category -->
                <div class="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                  <span>{{ product.brand }} · {{ product.category }}</span>
                  <div class="flex items-center gap-1">
                    <Star class="size-3 fill-amber-400 text-amber-400" />
                    <span class="text-foreground font-medium">{{ product.rating }}</span>
                    <span class="text-muted-foreground">({{ product.reviewCount }})</span>
                  </div>
                </div>

                <!-- Title -->
                <h3
                  class="text-foreground group-hover:text-primary mt-1 line-clamp-1 cursor-pointer text-sm font-medium transition-colors"
                  :title="product.name"
                >
                  {{ product.name }}
                </h3>
              </div>

              <!-- Price Row -->
              <div class="flex min-w-0 flex-wrap items-baseline gap-2 pt-1">
                <span class="text-foreground text-base font-semibold"> ${{ product.price.toFixed(2) }} </span>
                <span v-if="product.originalPrice" class="text-muted-foreground text-xs line-through">
                  ${{ product.originalPrice.toFixed(2) }}
                </span>
                <span v-if="product.originalPrice" class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Save ${{ (product.originalPrice - product.price).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination Footer -->
        <nav
          v-if="filteredProducts.length > 0"
          class="border-border flex items-center justify-between border-t pt-6"
          aria-label="Pagination"
        >
          <Button variant="outline" size="sm" class="gap-1 text-xs" :disabled="page === 1" @click="page--">
            <ChevronLeft class="size-4" />
            <span>Previous</span>
          </Button>

          <div class="flex items-center gap-1">
            <Button
              v-for="n in totalPages"
              :key="n"
              :variant="n === page ? 'outline' : 'ghost'"
              size="sm"
              class="size-8 p-0 text-xs tabular-nums"
              :aria-current="n === page ? 'page' : undefined"
              @click="page = n"
            >
              {{ n }}
            </Button>
          </div>

          <Button variant="outline" size="sm" class="gap-1 text-xs" :disabled="page === totalPages" @click="page++">
            <span>Next</span>
            <ChevronRight class="size-4" />
          </Button>
        </nav>
      </section>
    </div>
  </div>
</template>
