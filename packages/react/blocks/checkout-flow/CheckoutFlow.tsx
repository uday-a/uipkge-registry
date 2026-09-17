'use client'

import * as React from 'react'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { PaymentCard } from '@/components/ui/payment-card'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/ui/stepper'
import { Separator } from '@/components/ui/separator'
import { PaymentForm } from '@/components/blocks/PaymentForm'

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

export interface CheckoutFlowProps {
  items: CartItem[]
  currency?: string
  shippingFee?: number
  taxRate?: number
  onSubmit?: (data: PaymentPayload) => Promise<{ orderId: string }>
  onComplete?: (payload: { orderId: string }) => void
  onCancel?: () => void
}

type Step = 'cart' | 'payment' | 'confirm' | 'success' | 'error'

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

const STYLE_ID = 'checkout-flow-styles'
const STYLE_CONTENT = `
.checkout-flow-anim-forward,
.checkout-flow-anim-back {
  animation-duration: 280ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}
.checkout-flow-anim-forward {
  animation-name: checkout-flow-forward;
}
.checkout-flow-anim-back {
  animation-name: checkout-flow-back;
}
@keyframes checkout-flow-forward {
  from { transform: translateX(24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes checkout-flow-back {
  from { transform: translateX(-24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.checkout-flow-check-draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: checkout-flow-check-draw 700ms cubic-bezier(0.4, 0, 0.2, 1) 120ms forwards;
}
@keyframes checkout-flow-check-draw {
  to { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .checkout-flow-anim-forward,
  .checkout-flow-anim-back {
    animation-duration: 0ms;
  }
  .checkout-flow-check-draw {
    animation: none;
    stroke-dashoffset: 0;
  }
}
`

const stepperSteps = [
  { id: 'cart', title: 'Cart' },
  { id: 'payment', title: 'Payment' },
  { id: 'confirm', title: 'Confirm' },
]

export function CheckoutFlow({
  items,
  currency = 'USD',
  shippingFee = 0,
  taxRate = 0,
  onSubmit,
  onComplete,
  onCancel,
}: CheckoutFlowProps) {
  const [step, setStep] = React.useState<Step>('cart')
  const [direction, setDirection] = React.useState<'forward' | 'back'>('forward')

  const [cart, setCart] = React.useState<CartItem[]>(() => items.map((i) => ({ ...i })))
  const [paymentPayload, setPaymentPayload] = React.useState<PaymentPayload | null>(null)
  const [orderId, setOrderId] = React.useState<string | null>(null)
  const [lastError, setLastError] = React.useState<Error | null>(null)
  const [placing, setPlacing] = React.useState(false)

  // Mirror Vue's watch(() => props.items): reset the working cart when the
  // incoming items prop changes.
  React.useEffect(() => {
    setCart(items.map((i) => ({ ...i })))
  }, [items])

  // Inject keyframes + reduced-motion rules once.
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = STYLE_CONTENT
    document.head.appendChild(el)
  }, [])

  function go(next: Step) {
    const order: Record<Step, number> = { cart: 0, payment: 1, confirm: 2, success: 3, error: 3 }
    setDirection(order[next] >= order[step] ? 'forward' : 'back')
    setStep(next)
  }

  const subtotal = React.useMemo(() => cart.reduce((s, i) => s + i.qty * i.price, 0), [cart])
  const tax = React.useMemo(() => subtotal * taxRate, [subtotal, taxRate])
  const total = React.useMemo(() => subtotal + shippingFee + tax, [subtotal, shippingFee, tax])

  const fmt = (n: number) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)
    } catch {
      return `${currency} ${n.toFixed(2)}`
    }
  }

  const stepIndex = step === 'cart' ? 1 : step === 'payment' ? 2 : 3

  function dec(item: CartItem) {
    if (item.qty > 1) setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i)))
  }
  function inc(item: CartItem) {
    setCart((prev) => prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)))
  }
  function remove(item: CartItem) {
    setCart((prev) => prev.filter((i) => i.id !== item.id))
  }

  async function placeOrder() {
    if (!paymentPayload || placing) return
    setPlacing(true)
    try {
      let nextOrderId: string
      if (onSubmit) {
        const res = await onSubmit(paymentPayload)
        nextOrderId = res?.orderId ?? Math.random().toString(36).slice(2, 10).toUpperCase()
      } else {
        nextOrderId = Math.random().toString(36).slice(2, 10).toUpperCase()
      }
      setOrderId(nextOrderId)
      onComplete?.({ orderId: nextOrderId })
      go('success')
    } catch (err) {
      setLastError(err instanceof Error ? err : new Error(String(err)))
      go('error')
    } finally {
      setPlacing(false)
    }
  }

  function onPaymentSuccess() {
    go('confirm')
  }

  function captureFormPayload(payload: PaymentPayload) {
    setPaymentPayload(payload)
  }

  // Confetti — 60 particles, simple physics, ~1.8s
  const [particles, setParticles] = React.useState<Particle[]>([])
  const confettiRaf = React.useRef<number | null>(null)
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const fireConfetti = React.useCallback(() => {
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
    const initial: Particle[] = Array.from({ length: 60 }, (_, id) => ({
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
    setParticles(initial)
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      if (elapsed > 1800) {
        setParticles([])
        confettiRaf.current = null
        return
      }
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx * 0.25,
          y: p.y + p.vy * 0.25,
          vy: p.vy + 0.45,
          rot: p.rot + p.vr,
        })),
      )
      confettiRaf.current = requestAnimationFrame(tick)
    }
    confettiRaf.current = requestAnimationFrame(tick)
  }, [reducedMotion])

  React.useEffect(() => {
    if (step === 'success') fireConfetti()
  }, [step, fireConfetti])

  React.useEffect(() => {
    return () => {
      if (confettiRaf.current) cancelAnimationFrame(confettiRaf.current)
    }
  }, [])

  const animClass = direction === 'forward' ? 'checkout-flow-anim-forward' : 'checkout-flow-anim-back'

  return (
    <div
      data-slot="checkout-flow"
      className="bg-card text-card-foreground mx-auto w-full max-w-3xl overflow-hidden rounded-xl border shadow-sm"
    >
      {/* Stepper header (hidden on end states) */}
      {step !== 'success' && step !== 'error' && (
        <div className="bg-muted/30 border-b px-6 py-4">
          <Stepper steps={stepperSteps} value={stepIndex} />
        </div>
      )}

      <div className="relative min-h-[420px]">
        {/* CART */}
        {step === 'cart' && (
          <div key="cart" className={`p-6 ${animClass}`}>
            <h3 className="mb-4 text-lg font-semibold">Your cart</h3>

            {cart.length === 0 ? (
              <div className="text-muted-foreground py-12 text-center text-sm">Your cart is empty.</div>
            ) : (
              <ul className="divide-border divide-y">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <div className="bg-muted size-14 shrink-0 overflow-hidden rounded-md">
                      {item.image && <img src={item.image} alt={item.name} className="size-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs">{fmt(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon-sm" aria-label="Decrease" onClick={() => dec(item)}>
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                      <Button variant="outline" size="icon-sm" aria-label="Increase" onClick={() => inc(item)}>
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <div className="w-20 text-right text-sm font-medium tabular-nums">{fmt(item.qty * item.price)}</div>
                    <Button variant="ghost" size="icon-sm" aria-label="Remove" onClick={() => remove(item)}>
                      <Trash2 className="text-muted-foreground size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <Separator className="my-4" />

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{fmt(subtotal)}</dd>
              </div>
              {shippingFee > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{fmt(shippingFee)}</dd>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd>{fmt(tax)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{fmt(total)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex justify-between">
              <Button variant="ghost" onClick={() => onCancel?.()}>
                Cancel
              </Button>
              <Button disabled={cart.length === 0} onClick={() => go('payment')}>
                Continue to payment →
              </Button>
            </div>
          </div>
        )}

        {/* PAYMENT */}
        {step === 'payment' && (
          <div key="payment" className={`p-6 ${animClass}`}>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
              onClick={() => go('cart')}
            >
              <ArrowLeft className="size-3.5" /> Back to cart
            </button>
            <PaymentForm
              amount={total}
              currency={currency}
              onBrandChange={(b) => {
                /* parent could react */ void b
              }}
              onSuccess={onPaymentSuccess}
              onSubmit={async (payload) => {
                captureFormPayload(payload) /* defer real call to confirm step */
              }}
            />
          </div>
        )}

        {/* CONFIRM */}
        {step === 'confirm' && (
          <div key="confirm" className={`p-6 ${animClass}`}>
            <h3 className="mb-4 text-lg font-semibold">Review your order</h3>

            <div className="mb-4 flex items-start gap-4 rounded-lg border p-4">
              {paymentPayload && (
                <PaymentCard
                  number={paymentPayload.number}
                  name={paymentPayload.name}
                  expiry={paymentPayload.expiry}
                  brand={paymentPayload.brand}
                  variant="compact"
                  flip={false}
                />
              )}
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium">Paying with card ending {paymentPayload?.number.slice(-4)}</p>
                <p className="text-muted-foreground">
                  {paymentPayload?.name} · expires {paymentPayload?.expiry}
                </p>
                <button className="text-primary mt-2 text-xs underline" onClick={() => go('payment')}>
                  Change payment method
                </button>
              </div>
            </div>

            <ul className="divide-border divide-y border-y">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="truncate">
                    {item.qty} × {item.name}
                  </span>
                  <span className="tabular-nums">{fmt(item.qty * item.price)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{fmt(subtotal)}</dd>
              </div>
              {shippingFee > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{fmt(shippingFee)}</dd>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd>{fmt(tax)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{fmt(total)}</dd>
              </div>
            </dl>

            <div className="mt-5 flex justify-between">
              <Button variant="outline" onClick={() => go('payment')}>
                <ArrowLeft className="mr-1.5 size-4" /> Back
              </Button>
              <Button disabled={placing} onClick={placeOrder}>
                {placing ? 'Placing order…' : `Place order · ${fmt(total)}`}
              </Button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <div key="success" className={`relative flex flex-col items-center px-6 py-14 text-center ${animClass}`}>
            {/* Confetti layer */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: p.x + '%',
                    top: p.y + '%',
                    width: p.size + 'px',
                    height: p.size + 'px',
                    background: p.color,
                    transform: `rotate(${p.rot}deg)`,
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>

            <div className="bg-primary/10 ring-primary/30 relative grid size-20 place-items-center rounded-full ring-2">
              <svg
                viewBox="0 0 52 52"
                className="text-primary size-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 27 L23 36 L40 18" pathLength={100} className="checkout-flow-check-draw" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-semibold">Order placed</h3>
            <p className="text-muted-foreground mt-1 text-sm">Thanks — a confirmation will be sent shortly.</p>
            <div className="bg-muted mt-4 inline-flex rounded-md px-3 py-1.5 font-mono text-sm">#{orderId}</div>
            <Button variant="outline" className="mt-6" onClick={() => onCancel?.()}>
              Back to home
            </Button>
          </div>
        )}

        {/* ERROR */}
        {step === 'error' && (
          <div key="error" className={`flex flex-col items-center px-6 py-14 text-center ${animClass}`}>
            <div className="bg-destructive/10 ring-destructive/30 relative grid size-20 place-items-center rounded-full ring-2">
              <svg
                viewBox="0 0 52 52"
                className="text-destructive size-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M16 16 L36 36 M36 16 L16 36" pathLength={100} className="checkout-flow-check-draw" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-semibold">Payment failed</h3>
            <p className="text-muted-foreground mt-1 max-w-xs text-sm">
              {lastError?.message || 'Something went wrong while charging your card.'}
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={() => onCancel?.()}>
                Cancel
              </Button>
              <Button onClick={() => go('payment')}>Try again</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
