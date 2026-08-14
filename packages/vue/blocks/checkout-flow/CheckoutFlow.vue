<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { ArrowLeft, Check, Minus, Plus, Trash2, X } from 'lucide-vue-next'
import { PaymentCard } from '@/components/ui/payment-card'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/ui/stepper'
import { Separator } from '@/components/ui/separator'
import PaymentForm from '@/components/blocks/PaymentForm.vue'

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'
interface PaymentPayload {
  number: string
  name: string
  expiry: string
  cvc: string
  brand: CardBrand
}

interface CartItem {
  id: string
  name: string
  image?: string
  qty: number
  price: number
}

const props = withDefaults(
  defineProps<{
    items: CartItem[]
    currency?: string
    shippingFee?: number
    taxRate?: number
    onSubmit?: (data: PaymentPayload) => Promise<{ orderId: string }>
  }>(),
  {
    currency: 'USD',
    shippingFee: 0,
    taxRate: 0,
  },
)

const emit = defineEmits<{
  complete: [payload: { orderId: string }]
  cancel: []
}>()

type Step = 'cart' | 'payment' | 'confirm' | 'success' | 'error'
const step = ref<Step>('cart')
const direction = ref<'forward' | 'back'>('forward')

const cart = ref<CartItem[]>(props.items.map((i) => ({ ...i })))
const paymentPayload = ref<PaymentPayload | null>(null)
const orderId = ref<string | null>(null)
const lastError = ref<Error | null>(null)
const placing = ref(false)

watch(
  () => props.items,
  (next) => {
    cart.value = next.map((i) => ({ ...i }))
  },
)

function go(next: Step) {
  const order: Record<Step, number> = { cart: 0, payment: 1, confirm: 2, success: 3, error: 3 }
  direction.value = order[next] >= order[step.value] ? 'forward' : 'back'
  step.value = next
}

const subtotal = computed(() => cart.value.reduce((s, i) => s + i.qty * i.price, 0))
const tax = computed(() => subtotal.value * props.taxRate)
const total = computed(() => subtotal.value + props.shippingFee + tax.value)

const fmt = (n: number) => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: props.currency }).format(n)
  } catch {
    return `${props.currency} ${n.toFixed(2)}`
  }
}

const stepIndex = computed(() => {
  if (step.value === 'cart') return 1
  if (step.value === 'payment') return 2
  return 3
})

const stepperSteps = [
  { id: 'cart', title: 'Cart' },
  { id: 'payment', title: 'Payment' },
  { id: 'confirm', title: 'Confirm' },
]

function dec(item: CartItem) {
  if (item.qty > 1) item.qty--
}
function inc(item: CartItem) {
  item.qty++
}
function remove(item: CartItem) {
  cart.value = cart.value.filter((i) => i.id !== item.id)
}

async function placeOrder() {
  if (!paymentPayload.value || placing.value) return
  placing.value = true
  try {
    if (props.onSubmit) {
      const res = await props.onSubmit(paymentPayload.value)
      orderId.value = res?.orderId ?? Math.random().toString(36).slice(2, 10).toUpperCase()
    } else {
      orderId.value = Math.random().toString(36).slice(2, 10).toUpperCase()
    }
    emit('complete', { orderId: orderId.value })
    go('success')
  } catch (err) {
    lastError.value = err instanceof Error ? err : new Error(String(err))
    go('error')
  } finally {
    placing.value = false
  }
}

function onPaymentSuccess() {
  go('confirm')
}

function captureFormPayload(payload: PaymentPayload) {
  paymentPayload.value = payload
}

// Confetti — 50 particles, simple physics, ~1.4s
interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  color: string
  size: number
}
const particles = ref<Particle[]>([])
let confettiRaf: number | null = null
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

function fireConfetti() {
  if (reducedMotion) return
  // Pull theme tokens at runtime so confetti follows the active palette
  // (light/dark mode + any consumer theme override). Falls back to a
  // sensible default if the variable isn't defined.
  const cs = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const tok = (name: string, fallback: string) => cs?.getPropertyValue(name).trim() || fallback
  const colors = [
    tok('--chart-1', 'oklch(0.65 0.18 145)'),
    tok('--chart-2', 'oklch(0.6 0.22 260)'),
    tok('--chart-3', 'oklch(0.7 0.16 75)'),
    tok('--chart-4', 'oklch(0.65 0.2 330)'),
    tok('--chart-5', 'oklch(0.6 0.22 30)'),
    tok('--primary', 'oklch(0.55 0.22 260)'),
  ]
  particles.value = Array.from({ length: 60 }, (_, id) => ({
    id,
    x: 50,
    y: 40,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 14 - 4,
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 6,
  }))
  const start = performance.now()
  const tick = (now: number) => {
    const elapsed = now - start
    if (elapsed > 1800) {
      particles.value = []
      confettiRaf = null
      return
    }
    particles.value = particles.value.map((p) => ({
      ...p,
      x: p.x + p.vx * 0.25,
      y: p.y + p.vy * 0.25,
      vy: p.vy + 0.45,
      rot: p.rot + p.vr,
    }))
    confettiRaf = requestAnimationFrame(tick)
  }
  confettiRaf = requestAnimationFrame(tick)
}

watch(step, (s) => {
  if (s === 'success') fireConfetti()
})

onUnmounted(() => {
  if (confettiRaf) cancelAnimationFrame(confettiRaf)
})

const transitionName = computed(() => (direction.value === 'forward' ? 'flow-forward' : 'flow-back'))
</script>

<template>
  <div
    data-slot="checkout-flow"
    class="bg-card text-card-foreground mx-auto w-full max-w-3xl overflow-hidden rounded-xl border shadow-sm"
  >
    <!-- Stepper header (hidden on end states) -->
    <div v-if="step !== 'success' && step !== 'error'" class="bg-muted/30 border-b px-6 py-4">
      <Stepper :steps="stepperSteps" :model-value="stepIndex" />
    </div>

    <div class="relative min-h-[420px]">
      <Transition :name="transitionName" mode="out-in">
        <!-- CART -->
        <div v-if="step === 'cart'" key="cart" class="p-6">
          <h3 class="mb-4 text-lg font-semibold">Your cart</h3>

          <div v-if="cart.length === 0" class="text-muted-foreground py-12 text-center text-sm">
            Your cart is empty.
          </div>

          <ul v-else class="divide-border divide-y">
            <li v-for="item in cart" :key="item.id" class="flex items-center gap-3 py-3">
              <div class="bg-muted size-14 shrink-0 overflow-hidden rounded-md">
                <img v-if="item.image" :src="item.image" :alt="item.name" class="size-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ item.name }}</p>
                <p class="text-muted-foreground text-xs">{{ fmt(item.price) }} each</p>
              </div>
              <div class="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" aria-label="Decrease" @click="dec(item)"
                  ><Minus class="size-3.5"
                /></Button>
                <span class="w-8 text-center text-sm tabular-nums">{{ item.qty }}</span>
                <Button variant="outline" size="icon-sm" aria-label="Increase" @click="inc(item)"
                  ><Plus class="size-3.5"
                /></Button>
              </div>
              <div class="w-20 text-right text-sm font-medium tabular-nums">{{ fmt(item.qty * item.price) }}</div>
              <Button variant="ghost" size="icon-sm" aria-label="Remove" @click="remove(item)">
                <Trash2 class="text-muted-foreground size-4" />
              </Button>
            </li>
          </ul>

          <Separator class="my-4" />

          <dl class="space-y-1.5 text-sm">
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Subtotal</dt>
              <dd>{{ fmt(subtotal) }}</dd>
            </div>
            <div v-if="shippingFee > 0" class="flex justify-between">
              <dt class="text-muted-foreground">Shipping</dt>
              <dd>{{ fmt(shippingFee) }}</dd>
            </div>
            <div v-if="taxRate > 0" class="flex justify-between">
              <dt class="text-muted-foreground">Tax</dt>
              <dd>{{ fmt(tax) }}</dd>
            </div>
            <div class="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{{ fmt(total) }}</dd>
            </div>
          </dl>

          <div class="mt-5 flex justify-between">
            <Button variant="ghost" @click="emit('cancel')">Cancel</Button>
            <Button :disabled="cart.length === 0" @click="go('payment')">Continue to payment →</Button>
          </div>
        </div>

        <!-- PAYMENT -->
        <div v-else-if="step === 'payment'" key="payment" class="p-6">
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
            @click="go('cart')"
          >
            <ArrowLeft class="size-3.5" /> Back to cart
          </button>
          <PaymentForm
            :amount="total"
            :currency="currency"
            @success="onPaymentSuccess"
            :on-submit="
              async (payload) => {
                captureFormPayload(payload) /* defer real call to confirm step */
              }
            "
          />
        </div>

        <!-- CONFIRM -->
        <div v-else-if="step === 'confirm'" key="confirm" class="p-6">
          <h3 class="mb-4 text-lg font-semibold">Review your order</h3>

          <div class="mb-4 flex items-start gap-4 rounded-lg border p-4">
            <PaymentCard
              v-if="paymentPayload"
              :number="paymentPayload.number"
              :name="paymentPayload.name"
              :expiry="paymentPayload.expiry"
              :brand="paymentPayload.brand"
              variant="compact"
              :flip="false"
            />
            <div class="min-w-0 flex-1 text-sm">
              <p class="font-medium">Paying with card ending {{ paymentPayload?.number.slice(-4) }}</p>
              <p class="text-muted-foreground">{{ paymentPayload?.name }} · expires {{ paymentPayload?.expiry }}</p>
              <button class="text-primary mt-2 text-xs underline" @click="go('payment')">Change payment method</button>
            </div>
          </div>

          <ul class="divide-border divide-y border-y">
            <li v-for="item in cart" :key="item.id" class="flex justify-between py-2 text-sm">
              <span class="truncate">{{ item.qty }} × {{ item.name }}</span>
              <span class="tabular-nums">{{ fmt(item.qty * item.price) }}</span>
            </li>
          </ul>

          <dl class="mt-3 space-y-1 text-sm">
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Subtotal</dt>
              <dd>{{ fmt(subtotal) }}</dd>
            </div>
            <div v-if="shippingFee > 0" class="flex justify-between">
              <dt class="text-muted-foreground">Shipping</dt>
              <dd>{{ fmt(shippingFee) }}</dd>
            </div>
            <div v-if="taxRate > 0" class="flex justify-between">
              <dt class="text-muted-foreground">Tax</dt>
              <dd>{{ fmt(tax) }}</dd>
            </div>
            <div class="flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{{ fmt(total) }}</dd>
            </div>
          </dl>

          <div class="mt-5 flex justify-between">
            <Button variant="outline" @click="go('payment')"><ArrowLeft class="mr-1.5 size-4" /> Back</Button>
            <Button :disabled="placing" @click="placeOrder">{{
              placing ? 'Placing order…' : `Place order · ${fmt(total)}`
            }}</Button>
          </div>
        </div>

        <!-- SUCCESS -->
        <div
          v-else-if="step === 'success'"
          key="success"
          class="relative flex flex-col items-center px-6 py-14 text-center"
        >
          <!-- Confetti layer -->
          <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              v-for="p in particles"
              :key="p.id"
              class="absolute"
              :style="{
                left: p.x + '%',
                top: p.y + '%',
                width: p.size + 'px',
                height: p.size + 'px',
                background: p.color,
                transform: `rotate(${p.rot}deg)`,
                borderRadius: '2px',
              }"
            />
          </div>

          <div class="bg-primary/10 ring-primary/30 relative grid size-20 place-items-center rounded-full ring-2">
            <svg
              viewBox="0 0 52 52"
              class="text-primary size-12"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14 27 L23 36 L40 18" pathLength="100" class="check-draw" />
            </svg>
          </div>
          <h3 class="mt-5 text-xl font-semibold">Order placed</h3>
          <p class="text-muted-foreground mt-1 text-sm">Thanks — a confirmation will be sent shortly.</p>
          <div class="bg-muted mt-4 inline-flex rounded-md px-3 py-1.5 font-mono text-sm">#{{ orderId }}</div>
          <Button variant="outline" class="mt-6" @click="emit('cancel')">Back to home</Button>
        </div>

        <!-- ERROR -->
        <div v-else-if="step === 'error'" key="error" class="flex flex-col items-center px-6 py-14 text-center">
          <div
            class="bg-destructive/10 ring-destructive/30 relative grid size-20 place-items-center rounded-full ring-2"
          >
            <svg
              viewBox="0 0 52 52"
              class="text-destructive size-12"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M16 16 L36 36 M36 16 L16 36" pathLength="100" class="check-draw" />
            </svg>
          </div>
          <h3 class="mt-5 text-xl font-semibold">Payment failed</h3>
          <p class="text-muted-foreground mt-1 max-w-xs text-sm">
            {{ lastError?.message || 'Something went wrong while charging your card.' }}
          </p>
          <div class="mt-6 flex gap-2">
            <Button variant="outline" @click="emit('cancel')">Cancel</Button>
            <Button @click="go('payment')">Try again</Button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.flow-forward-enter-active,
.flow-forward-leave-active,
.flow-back-enter-active,
.flow-back-leave-active {
  transition:
    transform 280ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 220ms ease;
}
.flow-forward-enter-from {
  transform: translateX(24px);
  opacity: 0;
}
.flow-forward-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}
.flow-back-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}
.flow-back-leave-to {
  transform: translateX(24px);
  opacity: 0;
}

.check-draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: check-draw 700ms cubic-bezier(0.4, 0, 0.2, 1) 120ms forwards;
}
@keyframes check-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow-forward-enter-active,
  .flow-forward-leave-active,
  .flow-back-enter-active,
  .flow-back-leave-active {
    transition-duration: 0ms;
  }
  .check-draw {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
