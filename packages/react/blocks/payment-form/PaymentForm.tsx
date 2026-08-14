'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { PaymentCard } from '@/components/ui/payment-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'
type Wallet = 'apple' | 'google' | 'paypal'

export interface PaymentPayload {
  number: string
  name: string
  expiry: string
  cvc: string
  brand: CardBrand
}

export interface PaymentFormProps {
  amount: number
  currency?: string
  showWallets?: boolean
  wallets?: Wallet[]
  onSubmit?: (data: PaymentPayload) => Promise<void>
  onSuccess?: () => void
  onError?: (err: Error) => void
  onBrandChange?: (brand: CardBrand) => void
  onWallet?: (kind: Wallet) => void
}

function detectBrand(raw: string): CardBrand {
  const n = raw.replace(/\D/g, '')
  if (!n) return 'unknown'
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(6011|65|64[4-9])/.test(n)) return 'discover'
  return 'unknown'
}

function luhn(digits: string): boolean {
  let sum = 0
  let alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (alt) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    alt = !alt
  }
  return sum % 10 === 0 && digits.length >= 13
}

// Wallet brand wordmark paths (from simpleicons.org, MIT-licensed).
const APPLE_PAY_PATH =
  'M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z'
const GOOGLE_PAY_PATH =
  'M3.963 7.235A3.963 3.963 0 00.422 9.419a3.963 3.963 0 000 3.559 3.963 3.963 0 003.541 2.184c1.07 0 1.97-.352 2.627-.957.748-.69 1.18-1.71 1.18-2.916a4.722 4.722 0 00-.07-.806H3.964v1.526h2.14a1.835 1.835 0 01-.79 1.205c-.356.241-.814.379-1.35.379-1.034 0-1.911-.697-2.225-1.636a2.375 2.375 0 010-1.517c.314-.94 1.191-1.636 2.225-1.636a2.152 2.152 0 011.52.594l1.132-1.13a3.808 3.808 0 00-2.652-1.033zm6.501.55v6.9h.886V11.89h1.465c.603 0 1.11-.196 1.522-.588a1.911 1.911 0 00.635-1.464 1.92 1.92 0 00-.635-1.456 2.125 2.125 0 00-1.522-.598zm2.427.85a1.156 1.156 0 01.823.365 1.176 1.176 0 010 1.686 1.171 1.171 0 01-.877.357H11.35V8.635h1.487a1.156 1.156 0 01.054 0zm4.124 1.175c-.842 0-1.477.308-1.907.925l.781.491c.288-.417.68-.626 1.175-.626a1.255 1.255 0 01.856.323 1.009 1.009 0 01.366.785v.202c-.34-.193-.774-.289-1.3-.289-.617 0-1.11.145-1.479.434-.37.288-.554.677-.554 1.165a1.476 1.476 0 00.525 1.156c.35.308.785.463 1.305.463.61 0 1.098-.27 1.465-.81h.038v.655h.848v-2.909c0-.61-.19-1.09-.568-1.44-.38-.35-.896-.525-1.551-.525zm2.263.154l1.946 4.422-1.098 2.38h.915L24 9.963h-.965l-1.368 3.391h-.02l-1.406-3.39zm-2.146 2.368c.494 0 .88.11 1.156.33 0 .372-.147.696-.44.973a1.413 1.413 0 01-.997.414 1.081 1.081 0 01-.69-.232.708.708 0 01-.293-.578c0-.257.12-.47.363-.647.24-.173.54-.26.9-.26Z'
const PAYPAL_PATH =
  'M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86m6.57 5.546c0 3.41-3.01 6.853-6.958 6.853h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z'

const SHAKE_STYLE_ID = 'payment-form-styles'
const SHAKE_STYLE_CONTENT = `
@keyframes payment-form-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(2px); }
}
.payment-form-shake {
  animation: payment-form-shake 320ms cubic-bezier(0.36, 0.07, 0.19, 0.97);
}
@media (prefers-reduced-motion: reduce) {
  .payment-form-shake { animation: none; }
}
`

export function PaymentForm({
  amount,
  currency = 'USD',
  showWallets = true,
  wallets = ['apple', 'google', 'paypal'],
  onSubmit,
  onSuccess,
  onError,
  onBrandChange,
  onWallet,
}: PaymentFormProps) {
  // Inject keyframes once.
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(SHAKE_STYLE_ID)) return
    const el = document.createElement('style')
    el.id = SHAKE_STYLE_ID
    el.textContent = SHAKE_STYLE_CONTENT
    document.head.appendChild(el)
  }, [])

  const [number, setNumber] = React.useState('')
  const [name, setName] = React.useState('')
  const [expiry, setExpiry] = React.useState('')
  const [cvc, setCvc] = React.useState('')
  const [cvcFocused, setCvcFocused] = React.useState(false)

  const [submitting, setSubmitting] = React.useState(false)
  const [succeeded, setSucceeded] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string | null>>({
    number: null,
    name: null,
    expiry: null,
    cvc: null,
  })
  const [shakeKey, setShakeKey] = React.useState(0)

  const brand = React.useMemo<CardBrand>(() => detectBrand(number), [number])
  const lastBrand = React.useRef<CardBrand>('unknown')

  function onBrandMaybeChanged(nextBrand: CardBrand) {
    if (nextBrand !== lastBrand.current) {
      lastBrand.current = nextBrand
      onBrandChange?.(nextBrand)
    }
  }

  function formatNumber(raw: string, b: CardBrand): string {
    const digits = raw.replace(/\D/g, '').slice(0, b === 'amex' ? 15 : 16)
    if (b === 'amex') {
      return digits.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*$/, (_m, a, bb, c) => [a, bb, c].filter(Boolean).join(' '))
    }
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  function onNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const nextBrand = detectBrand(e.target.value)
    const next = formatNumber(e.target.value, nextBrand)
    setNumber(next)
    setErrors((prev) => ({ ...prev, number: null }))
    onBrandMaybeChanged(nextBrand)
  }

  function formatExpiry(raw: string): string {
    const d = raw.replace(/\D/g, '').slice(0, 4)
    if (d.length <= 2) return d
    return `${d.slice(0, 2)}/${d.slice(2)}`
  }

  function onExpiryInput(e: React.ChangeEvent<HTMLInputElement>) {
    setExpiry(formatExpiry(e.target.value))
    setErrors((prev) => ({ ...prev, expiry: null }))
  }

  function onCvcInput(e: React.ChangeEvent<HTMLInputElement>) {
    const max = brand === 'amex' ? 4 : 3
    setCvc(e.target.value.replace(/\D/g, '').slice(0, max))
    setErrors((prev) => ({ ...prev, cvc: null }))
  }

  function onNameInput(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function validate(): boolean {
    const digits = number.replace(/\D/g, '')
    const expectedLen = brand === 'amex' ? 15 : 16
    const next: Record<string, string | null> = { number: null, name: null, expiry: null, cvc: null }

    next.number = !digits
      ? 'Card number required'
      : digits.length !== expectedLen
        ? `Card number must be ${expectedLen} digits`
        : !luhn(digits)
          ? 'Card number is invalid'
          : null

    next.name = !name.trim() ? 'Name required' : name.trim().length < 2 ? 'Name too short' : null

    const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)
    if (!expOk) {
      next.expiry = 'Use MM/YY'
    } else {
      const [m, y] = expiry.split('/').map(Number)
      const now = new Date()
      const expDate = new Date(2000 + y, m - 1, 1)
      expDate.setMonth(expDate.getMonth() + 1)
      next.expiry = expDate <= now ? 'Card has expired' : null
    }

    const cvcLen = brand === 'amex' ? 4 : 3
    next.cvc = cvc.length !== cvcLen ? `CVC must be ${cvcLen} digits` : null

    setErrors(next)
    const ok = Object.values(next).every((e) => !e)
    if (!ok) setShakeKey((k) => k + 1)
    return ok
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting || succeeded) return
    if (!validate()) return

    setSubmitting(true)
    try {
      const payload: PaymentPayload = {
        number: number.replace(/\D/g, ''),
        name: name.trim(),
        expiry,
        cvc,
        brand,
      }
      if (onSubmit) await onSubmit(payload)
      setSucceeded(true)
      onSuccess?.()
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)))
      setShakeKey((k) => k + 1)
    } finally {
      setSubmitting(false)
    }
  }

  const formattedAmount = React.useMemo(() => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
    } catch {
      return `${currency} ${amount.toFixed(2)}`
    }
  }, [currency, amount])

  const walletList = React.useMemo(() => wallets.filter((w) => ['apple', 'google', 'paypal'].includes(w)), [wallets])

  return (
    <div
      data-slot="payment-form"
      className="bg-card text-card-foreground mx-auto w-full max-w-md rounded-xl border p-6 shadow-sm"
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">Pay {formattedAmount}</h3>
        <span className="text-muted-foreground text-xs tracking-wider uppercase">Secure checkout</span>
      </div>

      {/* Wallets row */}
      {showWallets && walletList.length > 0 && (
        <div className="mb-4 space-y-3">
          <div
            className={[
              'grid gap-2',
              walletList.length === 1 ? '' : walletList.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {walletList.includes('apple') && (
              <button
                type="button"
                aria-label="Pay with Apple Pay"
                className="flex h-11 items-center justify-center rounded-md bg-black px-3 text-white transition-transform hover:scale-[1.02] active:scale-100"
                onClick={() => onWallet?.('apple')}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-auto" fill="currentColor" aria-hidden="true">
                  <path d={APPLE_PAY_PATH} />
                </svg>
              </button>
            )}
            {walletList.includes('google') && (
              <button
                type="button"
                aria-label="Pay with Google Pay"
                className="flex h-11 items-center justify-center rounded-md border bg-white px-3 text-slate-800 shadow-sm transition-transform hover:scale-[1.02] active:scale-100"
                onClick={() => onWallet?.('google')}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-auto" fill="currentColor" aria-hidden="true">
                  <path d={GOOGLE_PAY_PATH} />
                </svg>
              </button>
            )}
            {walletList.includes('paypal') && (
              <button
                type="button"
                aria-label="Pay with PayPal"
                className="flex h-11 items-center justify-center rounded-md bg-[#003087] px-3 text-white transition-transform hover:scale-[1.02] active:scale-100"
                onClick={() => onWallet?.('paypal')}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-auto" fill="currentColor" aria-hidden="true">
                  <path d={PAYPAL_PATH} />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs tracking-widest uppercase">or pay with card</span>
            <div className="bg-border h-px flex-1" />
          </div>
        </div>
      )}

      {/* Live preview card */}
      <div aria-hidden="true" className="mb-5 flex justify-center">
        <PaymentCard number={number} name={name} expiry={expiry} cvc={cvc} flipped={cvcFocused} size="md" />
      </div>

      {/* Form */}
      <form className="space-y-3" data-shake={shakeKey} onSubmit={submit}>
        <div className="grid gap-1.5">
          <Label htmlFor="cc-number">Card number</Label>
          <Input
            id="cc-number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={number}
            aria-invalid={!!errors.number}
            aria-describedby="cc-number-err"
            className={errors.number ? 'border-destructive payment-form-shake' : ''}
            onChange={onNumberInput}
          />
          {errors.number && (
            <p id="cc-number-err" className="text-destructive text-xs" role="alert">
              {errors.number}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="cc-name">Name on card</Label>
          <Input
            id="cc-name"
            value={name}
            autoComplete="cc-name"
            placeholder="Jane Doe"
            aria-invalid={!!errors.name}
            aria-describedby="cc-name-err"
            className={errors.name ? 'border-destructive payment-form-shake' : ''}
            onChange={onNameInput}
          />
          {errors.name && (
            <p id="cc-name-err" className="text-destructive text-xs" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="cc-exp">Expiry</Label>
            <Input
              id="cc-exp"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              aria-invalid={!!errors.expiry}
              aria-describedby="cc-exp-err"
              className={errors.expiry ? 'border-destructive payment-form-shake' : ''}
              onChange={onExpiryInput}
            />
            {errors.expiry && (
              <p id="cc-exp-err" className="text-destructive text-xs" role="alert">
                {errors.expiry}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cc-cvc">CVC</Label>
            <Input
              id="cc-cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={brand === 'amex' ? '1234' : '123'}
              value={cvc}
              aria-invalid={!!errors.cvc}
              aria-describedby="cc-cvc-err"
              className={errors.cvc ? 'border-destructive payment-form-shake' : ''}
              onChange={onCvcInput}
              onFocus={() => setCvcFocused(true)}
              onBlur={() => setCvcFocused(false)}
            />
            {errors.cvc && (
              <p id="cc-cvc-err" className="text-destructive text-xs" role="alert">
                {errors.cvc}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="mt-2 h-11 w-full text-base" disabled={submitting || succeeded}>
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {succeeded ? <span>Paid ✓</span> : submitting ? <span>Processing…</span> : <span>Pay {formattedAmount}</span>}
        </Button>
      </form>
    </div>
  )
}
