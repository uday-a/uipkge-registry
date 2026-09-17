<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Truck,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface OrderItem {
  id: string
  name: string
  variant: string
  quantity: number
  price: string
  image: string
}

interface TrackingStep {
  id: string
  title: string
  date: string
  status: 'completed' | 'current' | 'upcoming'
  description: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const orderItems: OrderItem[] = [
  {
    id: 'item-1',
    name: 'Studio Wireless Noise-Canceling Headphones',
    variant: 'Space Gray • Over-Ear',
    quantity: 1,
    price: '$179.00',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-2',
    name: 'Braided USB-C Fast Charging Cable (2m)',
    variant: 'Midnight Black • 100W PD',
    quantity: 2,
    price: '$38.00',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 'item-3',
    name: 'Magnetic Aluminum Desk Stand',
    variant: 'Silver • Anodized Aluminum',
    quantity: 1,
    price: '$35.00',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=160&auto=format&fit=crop&q=80',
  },
]

const trackingSteps: TrackingStep[] = [
  {
    id: 'step-1',
    title: 'Order Placed',
    date: 'Aug 21, 2026 • 10:42 AM',
    status: 'completed',
    description: 'Payment authorized & order confirmed',
  },
  {
    id: 'step-2',
    title: 'Processing',
    date: 'Aug 22, 2026 • 02:15 PM',
    status: 'completed',
    description: 'Item picked & packed at warehouse',
  },
  {
    id: 'step-3',
    title: 'Shipped',
    date: 'Aug 23, 2026 • 09:30 AM',
    status: 'current',
    description: 'In transit via FedEx Priority • Chicago, IL',
  },
  {
    id: 'step-4',
    title: 'Delivered',
    date: 'Est. Aug 27, 2026',
    status: 'upcoming',
    description: 'Estimated delivery to front door',
  },
]
</script>

<template>
  <div data-slot="order-confirmation" :class="cn('w-full space-y-6', props.class)">
    <!-- Success Banner Card -->
    <Card class="border shadow-xs">
      <CardContent class="flex flex-col items-center p-6 text-center sm:p-10">
        <div
          class="relative flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/10 sm:size-20 dark:text-emerald-400"
        >
          <CheckCircle2 class="size-8 sm:size-10" aria-hidden="true" />
        </div>

        <div class="mt-6 max-w-xl space-y-2">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            <span class="size-1.5 rounded-full bg-emerald-500"></span>
            Order Confirmed
          </div>
          <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Thank you for your order!</h1>
          <p class="text-muted-foreground text-sm sm:text-base">
            We've received your order
            <span class="text-foreground font-mono font-semibold">#ORD-92841</span>
            and sent a confirmation email to
            <span class="text-foreground font-medium">customer@example.com</span>.
          </p>
        </div>

        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button class="gap-2 shadow-xs">
            <ExternalLink class="size-4" aria-hidden="true" />
            Track Shipment
          </Button>
          <Button aria-label="Download attachment" variant="outline" class="gap-2 shadow-xs">
            <Download class="size-4" aria-hidden="true" />
            Download Receipt
          </Button>
          <Button variant="ghost" class="text-muted-foreground hover:text-foreground"> Continue Shopping </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Tracking Stepper Card -->
    <Card class="border shadow-xs">
      <CardHeader class="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Truck class="text-primary size-4" aria-hidden="true" />
            <CardTitle class="text-base font-semibold">Shipment Progress</CardTitle>
            <Badge variant="secondary" class="bg-primary/10 text-primary text-xs font-medium">In Transit</Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            Carrier:
            <span class="text-foreground font-medium">FedEx Priority</span>
            • Tracking:
            <span class="text-foreground font-mono font-medium">#FX-9821734910</span>
          </p>
        </div>
        <div class="border-border/80 bg-muted/40 rounded-lg border px-3 py-1.5 text-xs">
          <span class="text-muted-foreground">Estimated Delivery:</span>
          <span class="text-foreground ml-1 font-semibold">Thursday, Aug 27, 2026</span>
        </div>
      </CardHeader>
      <CardContent class="pt-4">
        <!-- Desktop Stepper (md+) -->
        <div class="hidden md:block">
          <div class="grid grid-cols-4 gap-4">
            <div v-for="(step, idx) in trackingSteps" :key="step.id" class="relative flex flex-col">
              <div class="relative flex items-center">
                <!-- Connecting Line before current step -->
                <div
                  v-if="idx > 0"
                  class="absolute top-1/2 right-1/2 -z-0 h-0.5 w-full -translate-y-1/2"
                  :class="step.status === 'upcoming' ? 'bg-muted' : 'bg-primary'"
                ></div>

                <!-- Connecting Line after current step -->
                <div
                  v-if="idx < trackingSteps.length - 1"
                  class="absolute top-1/2 left-1/2 -z-0 h-0.5 w-full -translate-y-1/2"
                  :class="trackingSteps[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary'"
                ></div>

                <!-- Step Indicator Circle -->
                <div class="relative z-10 mx-auto flex items-center justify-center">
                  <div
                    v-if="step.status === 'completed'"
                    class="bg-primary text-primary-foreground ring-background flex size-8 items-center justify-center rounded-full ring-4"
                  >
                    <Check class="size-4" aria-hidden="true" />
                  </div>
                  <div
                    v-else-if="step.status === 'current'"
                    class="border-primary bg-background text-primary ring-background flex size-8 items-center justify-center rounded-full border-2 ring-4"
                  >
                    <span class="relative flex size-2.5">
                      <span class="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                      <span class="bg-primary relative inline-flex size-2.5 rounded-full"></span>
                    </span>
                  </div>
                  <div
                    v-else
                    class="border-muted-foreground/30 bg-muted/40 text-muted-foreground ring-background flex size-8 items-center justify-center rounded-full border-2 ring-4"
                  >
                    <Package class="size-3.5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <!-- Step Info -->
              <div class="mt-3 text-center">
                <p
                  class="text-sm font-semibold"
                  :class="step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'"
                >
                  {{ step.title }}
                </p>
                <p class="text-muted-foreground mt-0.5 text-xs tabular-nums">{{ step.date }}</p>
                <p class="text-muted-foreground/80 mt-0.5 text-xs">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Stepper (< md) -->
        <div class="space-y-4 md:hidden">
          <div v-for="(step, idx) in trackingSteps" :key="step.id" class="flex items-start gap-3">
            <div class="flex flex-col items-center">
              <div
                v-if="step.status === 'completed'"
                class="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full"
              >
                <Check class="size-3.5" aria-hidden="true" />
              </div>
              <div
                v-else-if="step.status === 'current'"
                class="border-primary bg-background text-primary flex size-7 shrink-0 items-center justify-center rounded-full border-2"
              >
                <span class="relative flex size-2">
                  <span class="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                  <span class="bg-primary relative inline-flex size-2 rounded-full"></span>
                </span>
              </div>
              <div
                v-else
                class="border-muted-foreground/30 bg-muted/40 text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border-2"
              >
                <Package class="size-3" aria-hidden="true" />
              </div>

              <div
                v-if="idx < trackingSteps.length - 1"
                class="mt-1 h-8 w-0.5"
                :class="trackingSteps[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary'"
              ></div>
            </div>

            <div class="min-w-0 flex-1 pt-0.5 pb-2">
              <div class="flex items-center justify-between gap-2">
                <p
                  class="text-sm font-semibold"
                  :class="step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'"
                >
                  {{ step.title }}
                </p>
                <span class="text-muted-foreground text-xs tabular-nums">{{ step.date }}</span>
              </div>
              <p class="text-muted-foreground mt-0.5 text-xs">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 2-Column Details Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column: Itemized Order Summary -->
      <div class="lg:col-span-7">
        <Card class="border shadow-xs">
          <CardHeader class="pb-4">
            <CardTitle class="text-base font-semibold">Order Summary</CardTitle>
            <CardDescription>3 items in shipment</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Items list -->
            <div class="space-y-4">
              <div v-for="item in orderItems" :key="item.id" class="flex items-center gap-4">
                <div class="border-border bg-muted/40 relative size-16 shrink-0 overflow-hidden rounded-lg border">
                  <img :src="item.image" :alt="item.name" class="h-full w-full object-cover" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-foreground truncate text-sm font-medium">{{ item.name }}</p>
                  <p class="text-muted-foreground text-xs">{{ item.variant }}</p>
                  <p class="text-muted-foreground mt-1 text-xs">Qty: {{ item.quantity }}</p>
                </div>
                <div class="text-right">
                  <p class="text-foreground text-sm font-semibold tabular-nums">{{ item.price }}</p>
                </div>
              </div>
            </div>

            <Separator />

            <!-- Cost breakdown -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Subtotal</span>
                <span class="text-foreground font-medium tabular-nums">$252.00</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Shipping (FedEx Priority)</span>
                <span class="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">Free</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Estimated Tax</span>
                <span class="text-foreground font-medium tabular-nums">$12.50</span>
              </div>
            </div>

            <Separator />

            <!-- Total -->
            <div class="flex items-center justify-between">
              <span class="text-foreground text-base font-semibold">Total</span>
              <span class="text-foreground text-xl font-bold tabular-nums sm:text-2xl">$264.50</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Customer & Delivery Details -->
      <div class="space-y-6 lg:col-span-5">
        <!-- Shipping Address Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <MapPin class="text-muted-foreground size-4" aria-hidden="true" />
              <CardTitle class="text-base font-semibold">Shipping Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div class="space-y-0.5">
              <p class="text-foreground font-medium">Alex Morgan</p>
              <p class="text-muted-foreground">742 Evergreen Terrace, Suite 4B</p>
              <p class="text-muted-foreground">Springfield, OR 97477</p>
              <p class="text-muted-foreground">United States</p>
              <p class="text-muted-foreground mt-1 text-xs">+1 (555) 234-5678</p>
            </div>
            <div class="border-border bg-muted/30 rounded-md border p-2.5 text-xs">
              <span class="text-muted-foreground">Delivery Method:</span>
              <span class="text-foreground ml-1 font-medium">FedEx Priority Express</span>
            </div>
          </CardContent>
        </Card>

        <!-- Payment Method Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <CreditCard class="text-muted-foreground size-4" aria-hidden="true" />
              <CardTitle class="text-base font-semibold">Payment Method</CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div
                  class="border-border bg-muted/40 text-foreground flex h-7 w-11 items-center justify-center rounded border font-mono text-xs font-bold"
                >
                  VISA
                </div>
                <div>
                  <p class="text-foreground text-sm font-medium">Visa ending in 4242</p>
                  <p class="text-muted-foreground text-xs">Expires 08/29</p>
                </div>
              </div>
              <Badge variant="secondary" class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Paid</Badge>
            </div>
            <p class="text-muted-foreground text-xs">Billing address matches shipping address</p>
          </CardContent>
        </Card>

        <!-- Need Help Card -->
        <Card class="border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <HelpCircle class="text-muted-foreground size-4" aria-hidden="true" />
              <CardTitle class="text-base font-semibold">Need Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <p class="text-muted-foreground text-xs">
              Questions about your order? Chat with support or email support@example.com.
            </p>
            <div class="space-y-2 pt-1">
              <Button variant="outline" size="sm" class="w-full justify-start gap-2 text-xs shadow-xs">
                <MessageSquare class="size-3.5" aria-hidden="true" />
                Chat with Support
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-foreground w-full justify-start gap-2 text-xs"
              >
                <Mail class="size-3.5" aria-hidden="true" />
                support@example.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
