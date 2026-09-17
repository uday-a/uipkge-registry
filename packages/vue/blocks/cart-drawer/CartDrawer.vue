<script lang="ts">
export interface CartItem {
  id: string
  name: string
  variant: string
  price: number
  originalPrice?: number
  qty: number
  inStock?: boolean
  image: string
}

export const DEFAULT_ITEMS: CartItem[] = [
  {
    id: 'item-1',
    name: 'Aero Minimalist Runner',
    variant: 'Size: 10.5 · Color: Matte Black',
    price: 120,
    originalPrice: 140,
    qty: 1,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-2',
    name: 'Technical Shell Parka',
    variant: 'Size: L · Color: Mineral Gray',
    price: 95,
    originalPrice: 110,
    qty: 1,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-3',
    name: 'Minimalist Leather Cardholder',
    variant: 'Size: Slim · Color: Saddle Brown',
    price: 70,
    originalPrice: 85,
    qty: 1,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80',
  },
]
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Leaf, Lock, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Sparkles, Tag, Trash2, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface Props {
  variant?: 'drawer' | 'page'
  items?: CartItem[]
  currency?: string
  freeShippingThreshold?: number
  taxRate?: number
  initialPromoCode?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'drawer',
  items: () => DEFAULT_ITEMS,
  currency: 'USD',
  freeShippingThreshold: 300,
  taxRate: 0.08,
  initialPromoCode: '',
})

const emit = defineEmits<{
  checkout: [items: CartItem[], total: number]
  continueShopping: []
  close: []
  updateQuantity: [id: string, qty: number]
  removeItem: [id: string]
  applyPromo: [code: string]
  removePromo: []
}>()

const cartItems = ref<CartItem[]>(props.items.map((item) => ({ ...item })))
const promoCodeInput = ref('')
const appliedPromo = ref<string>(props.initialPromoCode)
const promoDiscount = ref<number>(props.initialPromoCode ? 20 : 0)
const promoError = ref('')
const promoSuccess = ref('')

watch(
  () => props.items,
  (newItems) => {
    cartItems.value = newItems.map((item) => ({ ...item }))
  },
  { deep: true },
)

const totalItemsCount = computed(() => cartItems.value.reduce((acc, item) => acc + item.qty, 0))

const subtotal = computed(() => cartItems.value.reduce((acc, item) => acc + item.price * item.qty, 0))

const isFreeShippingUnlocked = computed(
  () => subtotal.value >= props.freeShippingThreshold && cartItems.value.length > 0,
)

const amountAwayFromFreeShipping = computed(() => Math.max(0, props.freeShippingThreshold - subtotal.value))

const shippingProgress = computed(() => {
  if (cartItems.value.length === 0) return 0
  return Math.min(100, Math.round((subtotal.value / props.freeShippingThreshold) * 100))
})

const shippingFee = computed(() => {
  if (cartItems.value.length === 0) return 0
  return isFreeShippingUnlocked.value ? 0 : 15
})

const discountedSubtotal = computed(() => Math.max(0, subtotal.value - promoDiscount.value))

const estimatedTax = computed(() => {
  if (cartItems.value.length === 0) return 0
  return Number((discountedSubtotal.value * props.taxRate).toFixed(2))
})

const total = computed(() => {
  if (cartItems.value.length === 0) return 0
  return Number((discountedSubtotal.value + shippingFee.value + estimatedTax.value).toFixed(2))
})

function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: props.currency,
      minimumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function updateQuantity(id: string, delta: number) {
  const item = cartItems.value.find((i) => i.id === id)
  if (!item) return
  const newQty = item.qty + delta
  if (newQty <= 0) {
    removeItem(id)
  } else {
    item.qty = newQty
    emit('updateQuantity', id, newQty)
  }
}

function removeItem(id: string) {
  cartItems.value = cartItems.value.filter((i) => i.id !== id)
  emit('removeItem', id)
}

function handleApplyPromo() {
  promoError.value = ''
  promoSuccess.value = ''
  const trimmed = promoCodeInput.value.trim().toUpperCase()
  if (!trimmed) return

  if (trimmed === 'SUMMER20' || trimmed === 'SAVE20') {
    appliedPromo.value = trimmed
    promoDiscount.value = 20
    promoSuccess.value = '$20.00 coupon discount applied!'
    promoCodeInput.value = ''
    emit('applyPromo', trimmed)
  } else if (trimmed === 'SAVE10') {
    appliedPromo.value = trimmed
    promoDiscount.value = 10
    promoSuccess.value = '$10.00 coupon discount applied!'
    promoCodeInput.value = ''
    emit('applyPromo', trimmed)
  } else {
    appliedPromo.value = trimmed
    promoDiscount.value = 15
    promoSuccess.value = 'Promo code applied!'
    promoCodeInput.value = ''
    emit('applyPromo', trimmed)
  }
}

function handleRemovePromo() {
  appliedPromo.value = ''
  promoDiscount.value = 0
  promoSuccess.value = ''
  promoError.value = ''
  emit('removePromo')
}

function handleCheckout() {
  emit('checkout', cartItems.value, total.value)
}

function handleContinueShopping() {
  emit('continueShopping')
}

function handleClose() {
  emit('close')
}

function resetCart() {
  cartItems.value = DEFAULT_ITEMS.map((item) => ({ ...item }))
}
</script>

<template>
  <div data-slot="cart-drawer" :class="cn('w-full', props.class)">
    <!-- DRAWER VARIANT -->
    <div
      v-if="variant === 'drawer'"
      class="bg-card text-card-foreground border-border/80 mx-auto flex h-full max-h-[820px] min-h-[640px] w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-xs"
    >
      <!-- Drawer Header -->
      <div class="border-border/60 flex shrink-0 items-center justify-between border-b px-5 py-4">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-semibold tracking-tight">Shopping Cart</h2>
          <Badge v-if="totalItemsCount > 0" variant="secondary" class="tabular-nums">
            {{ totalItemsCount }}
          </Badge>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Close cart drawer" @click="handleClose">
          <X class="size-4" />
        </Button>
      </div>

      <!-- Free Shipping Meter -->
      <div v-if="cartItems.length > 0" class="bg-muted/30 border-border/40 shrink-0 border-b px-5 py-3.5">
        <div class="flex items-center justify-between gap-2 text-xs">
          <span v-if="isFreeShippingUnlocked" class="text-primary flex items-center gap-1.5 font-medium">
            <Sparkles class="size-3.5" />
            You've unlocked Free Express Shipping!
          </span>
          <span v-else class="text-muted-foreground">
            🎉 You're
            <strong class="text-foreground font-semibold tabular-nums">{{
              formatCurrency(amountAwayFromFreeShipping)
            }}</strong>
            away from Free Shipping!
          </span>
          <span class="text-muted-foreground font-medium tabular-nums">{{ shippingProgress }}%</span>
        </div>
        <Progress :model-value="shippingProgress" class="mt-2 h-1.5" />
      </div>

      <!-- Drawer Body: Line Items or Empty State -->
      <div class="flex-1 overflow-y-auto p-5">
        <div v-if="cartItems.length === 0" class="flex h-full flex-col items-center justify-center py-12 text-center">
          <div class="bg-muted text-muted-foreground mb-4 flex size-14 items-center justify-center rounded-full">
            <ShoppingBag class="size-7 stroke-[1.5]" />
          </div>
          <h3 class="text-base font-semibold">Your cart is empty</h3>
          <p class="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our latest items!
          </p>
          <Button class="mt-5 gap-2" size="sm" @click="resetCart">
            <ShoppingBag class="size-3.5" />
            Explore Products
          </Button>
        </div>

        <div v-else class="space-y-4">
          <ul class="divide-border/60 divide-y" role="list">
            <li v-for="item in cartItems" :key="item.id" class="flex gap-3.5 py-4 first:pt-0 last:pb-0">
              <div
                class="border-border/60 bg-muted/40 relative size-20 shrink-0 overflow-hidden rounded-lg border shadow-xs"
              >
                <img :src="item.image" :alt="item.name" class="size-full object-cover" />
              </div>

              <div class="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="text-foreground truncate text-sm leading-snug font-medium">
                      {{ item.name }}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="text-muted-foreground hover:text-destructive -mt-1 -mr-1.5 size-7 shrink-0"
                      :aria-label="`Remove ${item.name} from cart`"
                      @click="removeItem(item.id)"
                    >
                      <Trash2 class="size-3.5" />
                    </Button>
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs">
                    {{ item.variant }}
                  </p>
                  <div class="mt-1 flex items-center gap-1.5">
                    <span class="size-1.5 rounded-full bg-emerald-500"></span>
                    <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">In stock</span>
                  </div>
                </div>

                <div class="mt-2.5 flex items-center justify-between">
                  <div class="border-border/80 bg-background flex items-center rounded-md border shadow-xs">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="size-7 rounded-none rounded-l-md"
                      :aria-label="`Decrease quantity for ${item.name}`"
                      @click="updateQuantity(item.id, -1)"
                    >
                      <Minus class="size-3" />
                    </Button>
                    <span class="w-7 text-center text-xs font-medium tabular-nums">{{ item.qty }}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="size-7 rounded-none rounded-r-md"
                      :aria-label="`Increase quantity for ${item.name}`"
                      @click="updateQuantity(item.id, 1)"
                    >
                      <Plus class="size-3" />
                    </Button>
                  </div>

                  <div class="text-right">
                    <span
                      v-if="item.originalPrice"
                      class="text-muted-foreground mr-1.5 text-xs tabular-nums line-through"
                    >
                      {{ formatCurrency(item.originalPrice * item.qty) }}
                    </span>
                    <span class="text-foreground text-sm font-semibold tabular-nums">
                      {{ formatCurrency(item.price * item.qty) }}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <Separator class="my-3" />

          <!-- Promo Code Section -->
          <div class="space-y-2">
            <div
              v-if="appliedPromo"
              class="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
            >
              <div class="flex items-center gap-2">
                <Tag class="text-primary size-3.5" />
                <span class="text-foreground font-medium">{{ appliedPromo }}</span>
                <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  -{{ formatCurrency(promoDiscount) }}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                class="text-muted-foreground hover:text-foreground size-6"
                aria-label="Remove promo code"
                @click="handleRemovePromo"
              >
                <X class="size-3.5" />
              </Button>
            </div>

            <div v-else class="flex gap-2">
              <Input
                v-model="promoCodeInput"
                placeholder="Promo code (e.g. SUMMER20)"
                size="small"
                class="text-xs"
                @keydown.enter.prevent="handleApplyPromo"
              />
              <Button
                variant="outline"
                size="sm"
                class="shrink-0 text-xs"
                :disabled="!promoCodeInput.trim()"
                @click="handleApplyPromo"
              >
                Apply
              </Button>
            </div>
            <p v-if="promoSuccess" class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {{ promoSuccess }}
            </p>
            <p v-if="promoError" class="text-destructive text-xs">
              {{ promoError }}
            </p>
          </div>
        </div>
      </div>

      <!-- Drawer Footer: Summary & Actions -->
      <div v-if="cartItems.length > 0" class="border-border/60 bg-card shrink-0 space-y-3 border-t p-5">
        <div class="space-y-1.5 text-xs">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Subtotal</span>
            <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(subtotal) }}</span>
          </div>

          <div v-if="promoDiscount > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Coupon ({{ appliedPromo }})</span>
            <span class="font-medium tabular-nums">-{{ formatCurrency(promoDiscount) }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-muted-foreground">Estimated Shipping</span>
            <span v-if="shippingFee === 0" class="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
            <span v-else class="text-foreground font-medium tabular-nums">{{ formatCurrency(shippingFee) }}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-muted-foreground">Estimated Tax</span>
            <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(estimatedTax) }}</span>
          </div>

          <Separator class="my-2" />

          <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm">
            <span class="font-semibold">Total</span>
            <span class="font-semibold tabular-nums">{{ formatCurrency(total) }}</span>
          </div>
        </div>

        <div class="space-y-2 pt-1">
          <Button class="w-full justify-center gap-2 font-medium shadow-xs" size="default" @click="handleCheckout">
            <Lock class="size-3.5" />
            Proceed to Checkout
          </Button>

          <Button
            variant="ghost"
            class="text-muted-foreground hover:text-foreground w-full text-xs"
            size="sm"
            @click="handleContinueShopping"
          >
            Continue Shopping
          </Button>
        </div>

        <!-- Guarantee badges -->
        <div
          class="border-border/40 text-muted-foreground grid grid-cols-1 gap-2 border-t pt-3 text-center text-xs sm:grid-cols-3"
        >
          <div class="flex flex-col items-center gap-1">
            <RotateCcw class="size-3.5" />
            <span>30-day returns</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <ShieldCheck class="size-3.5" />
            <span>256-bit secure</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <Leaf class="size-3.5" />
            <span>Carbon neutral</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FULL PAGE VARIANT -->
    <div v-else class="mx-auto w-full max-w-6xl space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Shopping Cart</h1>
          <p class="text-muted-foreground mt-0.5 text-xs">
            Review your selected items and calculate shipping before checkout.
          </p>
        </div>
        <Badge v-if="totalItemsCount > 0" variant="outline" class="w-fit text-xs tabular-nums">
          {{ totalItemsCount }} items in cart
        </Badge>
      </div>

      <!-- Free Shipping Banner -->
      <div v-if="cartItems.length > 0" class="bg-card border-border/80 rounded-xl border p-4 shadow-xs">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2 text-xs">
            <Sparkles v-if="isFreeShippingUnlocked" class="text-primary size-4" />
            <span v-if="isFreeShippingUnlocked" class="text-primary font-semibold">
              You've unlocked Free Express Shipping on this order!
            </span>
            <span v-else class="text-muted-foreground">
              🎉 You're
              <strong class="text-foreground font-semibold tabular-nums">{{
                formatCurrency(amountAwayFromFreeShipping)
              }}</strong>
              away from Free Shipping!
            </span>
          </div>
          <span class="text-muted-foreground text-xs font-medium tabular-nums">{{ shippingProgress }}% completed</span>
        </div>
        <Progress :model-value="shippingProgress" class="mt-2.5 h-2" />
      </div>

      <!-- Empty State for Page -->
      <div
        v-if="cartItems.length === 0"
        class="bg-card border-border/80 flex flex-col items-center justify-center rounded-2xl border py-16 text-center shadow-xs"
      >
        <div class="bg-muted text-muted-foreground mb-4 flex size-16 items-center justify-center rounded-full">
          <ShoppingBag class="size-8 stroke-[1.5]" />
        </div>
        <h2 class="text-lg font-semibold">Your cart is currently empty</h2>
        <p class="text-muted-foreground mt-1 max-w-sm text-sm">
          Before you proceed to checkout you must add some products to your shopping cart.
        </p>
        <Button class="mt-6 gap-2" size="default" @click="resetCart">
          <ShoppingBag class="size-4" />
          Explore Products
        </Button>
      </div>

      <!-- Page Grid: Items (Left) & Order Summary (Right) -->
      <div v-else class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <!-- Left: Line Items list -->
        <div class="space-y-4 lg:col-span-8">
          <div class="bg-card border-border/80 divide-border/60 divide-y rounded-2xl border shadow-xs">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-4">
                <div
                  class="border-border/60 bg-muted/40 relative size-20 shrink-0 overflow-hidden rounded-lg border shadow-xs"
                >
                  <img :src="item.image" :alt="item.name" class="size-full object-cover" />
                </div>
                <div>
                  <h3 class="text-foreground text-sm font-semibold">
                    {{ item.name }}
                  </h3>
                  <p class="text-muted-foreground mt-0.5 text-xs">
                    {{ item.variant }}
                  </p>
                  <div class="mt-1.5 flex items-center gap-2">
                    <span class="size-1.5 rounded-full bg-emerald-500"></span>
                    <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">In stock</span>
                    <span class="text-muted-foreground text-xs font-normal tabular-nums">
                      · {{ formatCurrency(item.price) }} each
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between gap-6 sm:justify-end">
                <div class="border-border/80 bg-background flex items-center rounded-md border shadow-xs">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    class="size-8 rounded-none rounded-l-md"
                    :aria-label="`Decrease quantity for ${item.name}`"
                    @click="updateQuantity(item.id, -1)"
                  >
                    <Minus class="size-3.5" />
                  </Button>
                  <span class="w-8 text-center text-xs font-medium tabular-nums">{{ item.qty }}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    class="size-8 rounded-none rounded-r-md"
                    :aria-label="`Increase quantity for ${item.name}`"
                    @click="updateQuantity(item.id, 1)"
                  >
                    <Plus class="size-3.5" />
                  </Button>
                </div>

                <div class="w-24 text-right">
                  <span v-if="item.originalPrice" class="text-muted-foreground block text-xs tabular-nums line-through">
                    {{ formatCurrency(item.originalPrice * item.qty) }}
                  </span>
                  <span class="text-foreground text-base font-semibold tabular-nums">
                    {{ formatCurrency(item.price * item.qty) }}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-destructive size-8"
                  :aria-label="`Remove ${item.name} from cart`"
                  @click="removeItem(item.id)"
                >
                  <Trash2 class="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Bottom bar: Guarantees -->
          <div class="bg-card border-border/80 grid grid-cols-1 gap-4 rounded-xl border p-4 shadow-xs sm:grid-cols-3">
            <div class="flex items-center gap-3 text-xs">
              <div class="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <RotateCcw class="size-4" />
              </div>
              <div>
                <p class="font-medium">Free 30-Day Returns</p>
                <p class="text-muted-foreground">Hassle-free return policy</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <div class="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <ShieldCheck class="size-4" />
              </div>
              <div>
                <p class="font-medium">256-Bit SSL Security</p>
                <p class="text-muted-foreground">Bank-grade data encryption</p>
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <div class="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                <Leaf class="size-4" />
              </div>
              <div>
                <p class="font-medium">Carbon Neutral</p>
                <p class="text-muted-foreground">Offset delivery emissions</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sticky Order Summary Card -->
        <div class="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
          <div class="bg-card border-border/80 space-y-4 rounded-2xl border p-5 shadow-xs">
            <h2 class="text-base font-semibold">Order Summary</h2>

            <!-- Promo Input -->
            <div class="space-y-2">
              <label class="text-muted-foreground text-xs font-medium">Have a coupon code?</label>
              <div
                v-if="appliedPromo"
                class="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
              >
                <div class="flex items-center gap-2">
                  <Tag class="text-primary size-3.5" />
                  <span class="text-foreground font-medium">{{ appliedPromo }}</span>
                  <span class="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                    -{{ formatCurrency(promoDiscount) }}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-muted-foreground hover:text-foreground size-6"
                  aria-label="Remove coupon"
                  @click="handleRemovePromo"
                >
                  <X class="size-3.5" />
                </Button>
              </div>
              <div v-else class="flex gap-2">
                <Input
                  v-model="promoCodeInput"
                  placeholder="Enter code (SUMMER20)"
                  size="small"
                  class="text-xs"
                  @keydown.enter.prevent="handleApplyPromo"
                />
                <Button
                  variant="outline"
                  size="sm"
                  class="shrink-0 text-xs"
                  :disabled="!promoCodeInput.trim()"
                  @click="handleApplyPromo"
                >
                  Apply
                </Button>
              </div>
            </div>

            <Separator />

            <!-- Cost Breakdown -->
            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Subtotal</span>
                <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(subtotal) }}</span>
              </div>

              <div v-if="promoDiscount > 0" class="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Coupon ({{ appliedPromo }})</span>
                <span class="font-medium tabular-nums">-{{ formatCurrency(promoDiscount) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-muted-foreground">Estimated Shipping</span>
                <span v-if="shippingFee === 0" class="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                <span v-else class="text-foreground font-medium tabular-nums">{{ formatCurrency(shippingFee) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-muted-foreground">Estimated Tax (8%)</span>
                <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(estimatedTax) }}</span>
              </div>

              <Separator class="my-2" />

              <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-base font-semibold">
                <span>Total</span>
                <span class="tabular-nums">{{ formatCurrency(total) }}</span>
              </div>
            </div>

            <Button class="w-full justify-center gap-2 font-medium shadow-xs" size="lg" @click="handleCheckout">
              <Lock class="size-4" />
              Proceed to Checkout
            </Button>

            <Button
              variant="ghost"
              class="text-muted-foreground hover:text-foreground w-full text-xs"
              size="sm"
              @click="handleContinueShopping"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
