<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Printer,
  RefreshCw,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stepper } from '@/components/ui/stepper'

export interface OrderItem {
  id: string
  name: string
  variant: string
  sku: string
  price: number
  maxQty: number
}

const props = withDefaults(
  defineProps<{
    initialStep?: number
    initialOrderNumber?: string
    initialEmail?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    initialStep: 1,
    initialOrderNumber: '#ORD-84920',
    initialEmail: 'sarah.connor@example.com',
  },
)

const steps = [
  { id: 1, title: 'Find Order' },
  { id: 2, title: 'Select Items' },
  { id: 3, title: 'Choose Resolution' },
  { id: 4, title: 'Confirm & Print' },
]

const orderItems: OrderItem[] = [
  {
    id: 'item-1',
    name: 'Merino Wool Crewneck Sweater',
    variant: 'Midnight Navy / Size L',
    sku: 'MWC-NAV-L',
    price: 120,
    maxQty: 1,
  },
  {
    id: 'item-2',
    name: 'Classic Canvas High-Tops',
    variant: 'Off-White / US 10.5',
    sku: 'CCHT-OW-105',
    price: 85,
    maxQty: 1,
  },
  {
    id: 'item-3',
    name: 'Tailored Chino Trousers',
    variant: 'Olive / 32x32',
    sku: 'TCT-OLV-32',
    price: 95,
    maxQty: 2,
  },
]

const returnReasonsList = ['Wrong size', 'Item defective', 'Not as described', 'Changed mind', 'Arrived late']

const exchangeSizesList = ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)']

const step = ref(props.initialStep)
const orderNumber = ref(props.initialOrderNumber)
const email = ref(props.initialEmail)

const selectedItems = ref<Record<string, boolean>>({
  'item-1': true,
  'item-2': false,
  'item-3': false,
})

const returnQuantities = ref<Record<string, number>>({
  'item-1': 1,
  'item-2': 1,
  'item-3': 1,
})

const returnReasons = ref<Record<string, string>>({
  'item-1': 'Wrong size',
  'item-2': 'Changed mind',
  'item-3': 'Item defective',
})

const resolution = ref<'exchange' | 'store-credit' | 'original-payment'>('store-credit')
const exchangeSize = ref('Medium (M)')
const isDownloaded = ref(false)

watch(
  () => props.initialStep,
  (val) => {
    step.value = val
  },
)

const selectedItemsCount = computed(() => {
  return orderItems.reduce((acc, item) => {
    if (selectedItems.value[item.id]) {
      return acc + (returnQuantities.value[item.id] || 1)
    }
    return acc
  }, 0)
})

const itemsSubtotal = computed(() => {
  return orderItems.reduce((acc, item) => {
    if (selectedItems.value[item.id]) {
      return acc + item.price * (returnQuantities.value[item.id] || 1)
    }
    return acc
  }, 0)
})

const storeCreditBonus = computed(() => {
  return itemsSubtotal.value * 0.1
})

const totalStoreCredit = computed(() => {
  return itemsSubtotal.value + storeCreditBonus.value
})

function formatCurrency(val: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val)
}

function onStepperInput(value: number) {
  if (value < step.value && step.value !== 4) {
    step.value = value
  }
}

function goToNext() {
  if (step.value < 4) {
    step.value += 1
  }
}

function goToPrevious() {
  if (step.value > 1 && step.value < 4) {
    step.value -= 1
  }
}

function toggleItemSelection(id: string) {
  selectedItems.value[id] = !selectedItems.value[id]
}

function reset() {
  step.value = 1
  isDownloaded.value = false
  selectedItems.value = {
    'item-1': true,
    'item-2': false,
    'item-3': false,
  }
  returnQuantities.value = {
    'item-1': 1,
    'item-2': 1,
    'item-3': 1,
  }
  returnReasons.value = {
    'item-1': 'Wrong size',
    'item-2': 'Changed mind',
    'item-3': 'Item defective',
  }
  resolution.value = 'store-credit'
  exchangeSize.value = 'Medium (M)'
}
</script>

<template>
  <Card data-slot="returns-portal" :class="cn('border-border mx-auto w-full max-w-3xl shadow-xs', props.class)">
    <CardHeader class="pb-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <CardTitle class="text-base font-semibold">Returns & Exchange Portal</CardTitle>
          <CardDescription class="text-xs"
            >Self-serve return, exchange, or refund for your recent order.</CardDescription
          >
        </div>
        <Badge variant="outline" class="shrink-0 text-xs">
          <Truck class="text-muted-foreground mr-1 size-3" />
          Prepaid Shipping
        </Badge>
      </div>
    </CardHeader>

    <CardContent class="space-y-6">
      <Stepper :steps="steps" :model-value="step" class="mb-6" @update:model-value="onStepperInput" />

      <!-- Step 1: Find Order -->
      <div v-if="step === 1" class="space-y-5">
        <div class="space-y-1">
          <h3 class="text-foreground text-sm font-semibold">Find your order</h3>
          <p class="text-muted-foreground text-xs">
            Enter your order number and email address to start a return or exchange.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <label for="returns-order-number" class="text-foreground text-xs font-medium">Order number</label>
            <Input id="returns-order-number" v-model="orderNumber" placeholder="#ORD-84920" autocomplete="off" />
            <p class="text-muted-foreground text-xs">Found on your order confirmation email.</p>
          </div>

          <div class="space-y-1.5">
            <label for="returns-email" class="text-foreground text-xs font-medium">Email address</label>
            <Input
              id="returns-email"
              v-model="email"
              type="email"
              placeholder="sarah.connor@example.com"
              autocomplete="email"
            />
            <p class="text-muted-foreground text-xs">The email address used at checkout.</p>
          </div>
        </div>

        <div class="border-border bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5">
          <ShieldCheck class="text-primary mt-0.5 size-4 shrink-0" />
          <div class="space-y-0.5 text-xs">
            <p class="text-foreground font-medium">30-Day Hassle-Free Return Policy</p>
            <p class="text-muted-foreground">
              Eligible items can be returned within 30 days of delivery. Free shipping on all exchanges and store credit
              requests.
            </p>
          </div>
        </div>
      </div>

      <!-- Step 2: Select Items -->
      <div v-else-if="step === 2" class="space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="min-w-[12rem]">
            <h3 class="text-foreground text-sm font-semibold">Select items to return</h3>
            <p class="text-muted-foreground text-xs">
              Order {{ orderNumber || '#ORD-84920' }} • Placed Oct 14, 2026 • 3 items eligible
            </p>
          </div>
          <Badge variant="secondary" class="text-xs"> {{ selectedItemsCount }} of 3 selected </Badge>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in orderItems"
            :key="item.id"
            :class="
              cn(
                'rounded-lg border p-4 transition-colors',
                selectedItems[item.id]
                  ? 'border-primary/50 bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                  : 'border-border bg-card hover:bg-muted/20',
              )
            "
          >
            <div class="flex items-start gap-3.5">
              <div class="pt-0.5">
                <Checkbox
                  :id="`check-${item.id}`"
                  :model-value="selectedItems[item.id]"
                  @update:model-value="toggleItemSelection(item.id)"
                />
              </div>

              <div
                class="border-border bg-muted/60 text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md border"
              >
                <Shirt class="size-6" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <label
                      :for="`check-${item.id}`"
                      class="text-foreground cursor-pointer text-sm font-medium select-none"
                    >
                      {{ item.name }}
                    </label>
                    <p class="text-muted-foreground text-xs">{{ item.variant }} • SKU: {{ item.sku }}</p>
                  </div>
                  <span class="text-foreground shrink-0 text-sm font-semibold">
                    {{ formatCurrency(item.price) }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-if="selectedItems[item.id]"
              class="border-border/60 mt-3.5 grid grid-cols-1 gap-3 border-t pt-3.5 sm:grid-cols-2"
            >
              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Qty to return</label>
                <Select
                  :model-value="String(returnQuantities[item.id] || 1)"
                  @update:model-value="(val) => (returnQuantities[item.id] = Number(val))"
                >
                  <SelectTrigger class="h-8 w-full text-xs">
                    <SelectValue placeholder="Qty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="q in item.maxQty" :key="q" :value="String(q)">
                      {{ q }} {{ q === 1 ? 'item' : 'items' }} (of {{ item.maxQty }})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-1.5">
                <label class="text-foreground text-xs font-medium">Return reason</label>
                <Select v-model="returnReasons[item.id]">
                  <SelectTrigger class="h-8 w-full text-xs">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="reason in returnReasonsList" :key="reason" :value="reason">
                      {{ reason }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div class="border-border bg-muted/40 flex items-center justify-between rounded-lg border p-3 text-xs">
          <span class="text-muted-foreground">
            <template v-if="selectedItemsCount > 0">
              <span class="text-foreground font-medium">{{ selectedItemsCount }}</span> item{{
                selectedItemsCount === 1 ? '' : 's'
              }}
              selected
            </template>
            <template v-else> No items selected yet </template>
          </span>
          <span class="text-foreground font-medium"> Estimated Value: {{ formatCurrency(itemsSubtotal) }} </span>
        </div>
      </div>

      <!-- Step 3: Choose Resolution -->
      <div v-else-if="step === 3" class="space-y-5">
        <div class="space-y-1">
          <h3 class="text-foreground text-sm font-semibold">Choose return resolution</h3>
          <p class="text-muted-foreground text-xs">Select how you would like your return or refund handled.</p>
        </div>

        <RadioGroup v-model="resolution" class="gap-3">
          <!-- Option A: Exchange -->
          <div
            :class="
              cn(
                'flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                resolution === 'exchange'
                  ? 'border-primary bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                  : 'border-border hover:bg-muted/40',
              )
            "
            @click="resolution = 'exchange'"
          >
            <div class="flex items-start gap-3">
              <RadioGroupItem id="res-exchange" value="exchange" class="mt-0.5" />
              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <RefreshCw class="text-primary size-4" />
                  <label for="res-exchange" class="text-foreground cursor-pointer text-sm font-medium">
                    Exchange for different size / color
                  </label>
                  <Badge variant="outline" class="text-xs">Free shipping</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Reserve replacement item immediately. Ships as soon as carrier scans the return package.
                </p>
              </div>
            </div>

            <div
              v-if="resolution === 'exchange'"
              class="border-border/60 mt-1 space-y-1.5 border-t pt-3 pl-7"
              @click.stop
            >
              <label class="text-foreground text-xs font-medium">Select replacement size</label>
              <Select v-model="exchangeSize">
                <SelectTrigger class="h-8 w-full max-w-xs text-xs">
                  <SelectValue placeholder="Select replacement size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="size in exchangeSizesList" :key="size" :value="size">
                    {{ size }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Option B: Store Credit (+10% Bonus) -->
          <div
            :class="
              cn(
                'flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                resolution === 'store-credit'
                  ? 'border-primary bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                  : 'border-border hover:bg-muted/40',
              )
            "
            @click="resolution = 'store-credit'"
          >
            <div class="flex items-start gap-3">
              <RadioGroupItem id="res-store-credit" value="store-credit" class="mt-0.5" />
              <div class="flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <Sparkles class="size-4 text-emerald-600 dark:text-emerald-400" />
                  <label for="res-store-credit" class="text-foreground cursor-pointer text-sm font-medium">
                    Store Credit (+10% Bonus value)
                  </label>
                  <Badge variant="success" class="text-xs">+10% Bonus</Badge>
                  <Badge variant="secondary" class="text-xs">Fastest refund</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Get <span class="text-foreground font-medium">{{ formatCurrency(totalStoreCredit) }}</span> in store
                  credit ({{ formatCurrency(itemsSubtotal) }} + {{ formatCurrency(storeCreditBonus) }} bonus). Digital
                  card delivered by email instantly upon drop-off scan.
                </p>
              </div>
            </div>
          </div>

          <!-- Option C: Original Payment Method -->
          <div
            :class="
              cn(
                'flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                resolution === 'original-payment'
                  ? 'border-primary bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                  : 'border-border hover:bg-muted/40',
              )
            "
            @click="resolution = 'original-payment'"
          >
            <div class="flex items-start gap-3">
              <RadioGroupItem id="res-original" value="original-payment" class="mt-0.5" />
              <div class="flex-1 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <CreditCard class="text-muted-foreground size-4" />
                  <label for="res-original" class="text-foreground cursor-pointer text-sm font-medium">
                    Original Payment Method
                  </label>
                  <Badge variant="outline" class="text-xs">Visa •••• 4242</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Refund of {{ formatCurrency(itemsSubtotal) }} back to your card. Processed in 3–5 business days after
                  carrier drop-off.
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>

        <!-- Summary calculation box -->
        <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-4 text-xs">
          <div class="text-muted-foreground flex items-center justify-between">
            <span>Selected items subtotal</span>
            <span class="text-foreground font-medium">{{ formatCurrency(itemsSubtotal) }}</span>
          </div>
          <div
            v-if="resolution === 'store-credit'"
            class="flex items-center justify-between text-emerald-600 dark:text-emerald-400"
          >
            <span>Bonus store credit (+10%)</span>
            <span class="font-medium">+{{ formatCurrency(storeCreditBonus) }}</span>
          </div>
          <div class="text-muted-foreground flex items-center justify-between">
            <span>Prepaid return shipping</span>
            <span class="font-medium text-emerald-600 dark:text-emerald-400">FREE</span>
          </div>
          <div
            class="border-border text-foreground flex items-center justify-between border-t pt-2 text-sm font-semibold"
          >
            <span>
              {{
                resolution === 'store-credit'
                  ? 'Total Store Credit'
                  : resolution === 'exchange'
                    ? 'Exchange Value'
                    : 'Total Refund'
              }}
            </span>
            <span :class="resolution === 'store-credit' ? 'text-emerald-600 dark:text-emerald-400' : ''">
              {{ resolution === 'store-credit' ? formatCurrency(totalStoreCredit) : formatCurrency(itemsSubtotal) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Step 4: Confirmation & Label -->
      <div v-else class="space-y-6">
        <div class="space-y-2 py-2 text-center">
          <div
            class="relative mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="size-6" />
          </div>
          <h3 class="text-foreground text-base font-semibold">Return Authorized & Confirmed</h3>
          <p class="text-muted-foreground mx-auto max-w-md text-xs">
            Your return request has been submitted. A prepaid shipping label and confirmation receipt have been sent to
            <span class="text-foreground font-medium">{{ email || 'sarah.connor@example.com' }}</span
            >.
          </p>
        </div>

        <!-- Return Details Overview -->
        <div class="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
          <div class="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div class="space-y-0.5">
              <span class="text-muted-foreground text-xs">Return ID</span>
              <p class="text-foreground font-mono text-sm font-semibold">#RET-2026-849</p>
            </div>
            <Badge variant="success" class="gap-1 text-xs"> <Check class="size-3" /> Authorized </Badge>
          </div>

          <div class="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
            <div class="space-y-0.5">
              <span class="text-muted-foreground">Carrier</span>
              <p class="text-foreground font-medium">USPS Ground Advantage™</p>
            </div>
            <div class="space-y-0.5">
              <span class="text-muted-foreground">Tracking Number</span>
              <p class="text-foreground font-mono font-medium">9400 1118 9956 2849</p>
            </div>
            <div class="space-y-0.5">
              <span class="text-muted-foreground">Selected Resolution</span>
              <p class="text-foreground font-medium">
                {{
                  resolution === 'store-credit'
                    ? `Store Credit (${formatCurrency(totalStoreCredit)})`
                    : resolution === 'exchange'
                      ? `Exchange (${exchangeSize})`
                      : `Refund to Visa •••• 4242`
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Download Buttons -->
        <div class="flex flex-col gap-3 sm:flex-row">
          <Button aria-label="Download attachment" class="flex-1 gap-2" size="default" @click="isDownloaded = true">
            <Download class="size-4" />
            {{ isDownloaded ? 'Label Downloaded (PDF)' : 'Download Prepaid Shipping Label (PDF)' }}
          </Button>
          <Button variant="outline" class="gap-2" size="default">
            <Printer class="size-4" />
            Print Return Slip
          </Button>
        </div>

        <!-- Drop-off instructions & QR code card -->
        <div class="border-border bg-card space-y-4 rounded-lg border p-4">
          <div class="flex items-center justify-between">
            <h4 class="text-foreground text-xs font-semibold tracking-wide uppercase">
              Carrier Drop-off Pass & Instructions
            </h4>
            <Badge variant="outline" class="text-xs">No printer required</Badge>
          </div>

          <div class="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
            <div class="space-y-3 text-xs sm:col-span-2">
              <div class="flex items-start gap-2.5">
                <div
                  class="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                >
                  1
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-medium">Pack your items</p>
                  <p class="text-muted-foreground">
                    Place returned items with tags inside the original shipping bag or any sturdy box.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div
                  class="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                >
                  2
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-medium">Attach label or show QR code</p>
                  <p class="text-muted-foreground">
                    Tape the downloaded shipping label to the box, or present the digital QR pass at the drop-off
                    counter.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <div
                  class="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                >
                  3
                </div>
                <div class="space-y-0.5">
                  <p class="text-foreground font-medium">Drop off before Nov 15, 2026</p>
                  <p class="text-muted-foreground">
                    Bring to any USPS Post Office, USPS drop box, or authorized FedEx shipping point.
                  </p>
                </div>
              </div>
            </div>

            <!-- QR code visual -->
            <div
              class="border-border bg-muted/40 flex flex-col items-center justify-center space-y-2 rounded-lg border p-3 text-center sm:col-span-1"
            >
              <svg
                class="text-foreground size-24"
                viewBox="0 0 100 100"
                fill="currentColor"
                aria-label="Prepaid return shipping QR dropoff code"
              >
                <!-- Top-left finder -->
                <rect x="10" y="10" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="4" />
                <rect x="17" y="17" width="10" height="10" rx="1" fill="currentColor" />
                <!-- Top-right finder -->
                <rect x="66" y="10" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="4" />
                <rect x="73" y="17" width="10" height="10" rx="1" fill="currentColor" />
                <!-- Bottom-left finder -->
                <rect x="10" y="66" width="24" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="4" />
                <rect x="17" y="73" width="10" height="10" rx="1" fill="currentColor" />
                <!-- Data dots -->
                <rect x="42" y="12" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="52" y="12" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="42" y="24" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="52" y="24" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="12" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="24" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="36" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="48" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="60" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="72" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="84" y="42" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="42" y="54" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="54" y="54" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="66" y="54" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="78" y="54" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="42" y="66" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="54" y="66" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="66" y="78" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="78" y="66" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="42" y="78" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="54" y="78" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="84" y="78" width="6" height="6" rx="1" fill="currentColor" />
              </svg>
              <span class="text-foreground font-mono text-xs font-semibold">RET-2026-849</span>
            </div>
          </div>
        </div>

        <div class="pt-2 text-center">
          <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-foreground text-xs" @click="reset">
            Start another return
          </Button>
        </div>
      </div>
    </CardContent>

    <CardFooter v-if="step < 4" class="border-border flex flex-wrap items-center justify-between gap-2 border-t pt-2">
      <Button v-if="step > 1" variant="ghost" size="sm" @click="goToPrevious">
        <ChevronLeft class="mr-1 size-4" />
        Back
      </Button>
      <div v-else />

      <span class="text-muted-foreground text-xs">Step {{ step }} of 4</span>

      <Button v-if="step === 1" size="sm" :disabled="!orderNumber.trim() || !email.trim()" @click="goToNext">
        Find Order
        <ChevronRight class="ml-1 size-4" />
      </Button>

      <Button v-else-if="step === 2" size="sm" :disabled="selectedItemsCount === 0" @click="goToNext">
        Choose Resolution
        <ChevronRight class="ml-1 size-4" />
      </Button>

      <Button v-else-if="step === 3" size="sm" @click="goToNext">
        Confirm & Print Label
        <Check class="ml-1 size-4" />
      </Button>
    </CardFooter>
  </Card>
</template>
