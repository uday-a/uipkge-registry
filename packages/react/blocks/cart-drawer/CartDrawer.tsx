'use client'

import * as React from 'react'
import { Leaf, Lock, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Sparkles, Tag, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

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

export interface CartDrawerProps {
  variant?: 'drawer' | 'page'
  items?: CartItem[]
  currency?: string
  freeShippingThreshold?: number
  taxRate?: number
  initialPromoCode?: string
  className?: string
  onCheckout?: (items: CartItem[], total: number) => void
  onContinueShopping?: () => void
  onClose?: () => void
  onUpdateQuantity?: (id: string, qty: number) => void
  onRemoveItem?: (id: string) => void
  onApplyPromo?: (code: string) => void
  onRemovePromo?: () => void
}

const DEFAULT_ITEMS: CartItem[] = [
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

export function CartDrawer({
  variant = 'drawer',
  items = DEFAULT_ITEMS,
  currency = 'USD',
  freeShippingThreshold = 300,
  taxRate = 0.08,
  initialPromoCode = '',
  className,
  onCheckout,
  onContinueShopping,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
  onRemovePromo,
}: CartDrawerProps) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(() => items.map((item) => ({ ...item })))
  const [promoCodeInput, setPromoCodeInput] = React.useState('')
  const [appliedPromo, setAppliedPromo] = React.useState<string>(initialPromoCode)
  const [promoDiscount, setPromoDiscount] = React.useState<number>(initialPromoCode ? 20 : 0)
  const [promoError, setPromoError] = React.useState('')
  const [promoSuccess, setPromoSuccess] = React.useState('')

  React.useEffect(() => {
    setCartItems(items.map((item) => ({ ...item })))
  }, [items])

  const totalItemsCount = React.useMemo(() => cartItems.reduce((acc, item) => acc + item.qty, 0), [cartItems])

  const subtotal = React.useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0), [cartItems])

  const isFreeShippingUnlocked = subtotal >= freeShippingThreshold && cartItems.length > 0
  const amountAwayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingProgress =
    cartItems.length === 0 ? 0 : Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShippingUnlocked ? 0 : 15
  const discountedSubtotal = Math.max(0, subtotal - promoDiscount)
  const estimatedTax = cartItems.length === 0 ? 0 : Number((discountedSubtotal * taxRate).toFixed(2))
  const total = cartItems.length === 0 ? 0 : Number((discountedSubtotal + shippingFee + estimatedTax).toFixed(2))

  const formatCurrency = React.useCallback(
    (amount: number) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits: 2,
        }).format(amount)
      } catch {
        return `$${amount.toFixed(2)}`
      }
    },
    [currency],
  )

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== id) return [item]
        const newQty = item.qty + delta
        if (newQty <= 0) {
          onRemoveItem?.(id)
          return []
        }
        onUpdateQuantity?.(id, newQty)
        return [{ ...item, qty: newQty }]
      }),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
    onRemoveItem?.(id)
  }

  const handleApplyPromo = () => {
    setPromoError('')
    setPromoSuccess('')
    const trimmed = promoCodeInput.trim().toUpperCase()
    if (!trimmed) return

    if (trimmed === 'SUMMER20' || trimmed === 'SAVE20') {
      setAppliedPromo(trimmed)
      setPromoDiscount(20)
      setPromoSuccess('$20.00 coupon discount applied!')
      setPromoCodeInput('')
      onApplyPromo?.(trimmed)
    } else if (trimmed === 'SAVE10') {
      setAppliedPromo(trimmed)
      setPromoDiscount(10)
      setPromoSuccess('$10.00 coupon discount applied!')
      setPromoCodeInput('')
      onApplyPromo?.(trimmed)
    } else {
      setAppliedPromo(trimmed)
      setPromoDiscount(15)
      setPromoSuccess('Promo code applied!')
      setPromoCodeInput('')
      onApplyPromo?.(trimmed)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo('')
    setPromoDiscount(0)
    setPromoSuccess('')
    setPromoError('')
    onRemovePromo?.()
  }

  const handleCheckout = () => {
    onCheckout?.(cartItems, total)
  }

  const resetCart = () => {
    setCartItems(DEFAULT_ITEMS.map((item) => ({ ...item })))
  }

  return (
    <div data-slot="cart-drawer" className={cn('w-full', className)}>
      {variant === 'drawer' ? (
        /* DRAWER VARIANT */
        <div className="bg-card text-card-foreground border-border/80 mx-auto flex h-full max-h-[820px] min-h-[640px] w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-xs">
          {/* Drawer Header */}
          <div className="border-border/60 flex shrink-0 items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight">Shopping Cart</h2>
              {totalItemsCount > 0 && (
                <Badge variant="secondary" className="tabular-nums">
                  {totalItemsCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Close cart drawer" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>

          {/* Free Shipping Meter */}
          {cartItems.length > 0 && (
            <div className="bg-muted/30 border-border/40 shrink-0 border-b px-5 py-3.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                {isFreeShippingUnlocked ? (
                  <span className="text-primary flex items-center gap-1.5 font-medium">
                    <Sparkles className="size-3.5" />
                    You've unlocked Free Express Shipping!
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    🎉 You're{' '}
                    <strong className="text-foreground font-semibold tabular-nums">
                      {formatCurrency(amountAwayFromFreeShipping)}
                    </strong>{' '}
                    away from Free Shipping!
                  </span>
                )}
                <span className="text-muted-foreground font-medium tabular-nums">{shippingProgress}%</span>
              </div>
              <Progress value={shippingProgress} className="mt-2 h-1.5" />
            </div>
          )}

          {/* Drawer Body: Line Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-5">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="bg-muted text-muted-foreground mb-4 flex size-14 items-center justify-center rounded-full">
                  <ShoppingBag className="size-7 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-semibold">Your cart is empty</h3>
                <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
                  Looks like you haven't added any products to your cart yet. Explore our latest items!
                </p>
                <Button className="mt-5 gap-2" size="sm" onClick={resetCart}>
                  <ShoppingBag className="size-3.5" />
                  Explore Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="divide-border/60 divide-y" role="list">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex gap-3.5 py-4 first:pt-0 last:pb-0">
                      <div className="border-border/60 bg-muted/40 relative size-20 shrink-0 overflow-hidden rounded-lg border shadow-xs">
                        <img src={item.image} alt={item.name} className="size-full object-cover" />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-foreground truncate text-sm leading-snug font-medium">{item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive -mt-1 -mr-1.5 size-7 shrink-0"
                              aria-label={`Remove ${item.name} from cart`}
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-xs">{item.variant}</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">In stock</span>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="border-border/80 bg-background flex items-center rounded-md border shadow-xs">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="size-7 rounded-none rounded-l-md"
                              aria-label={`Decrease quantity for ${item.name}`}
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="w-7 text-center text-xs font-medium tabular-nums">{item.qty}</span>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="size-7 rounded-none rounded-r-md"
                              aria-label={`Increase quantity for ${item.name}`}
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            {item.originalPrice && (
                              <span className="text-muted-foreground mr-1.5 text-xs tabular-nums line-through">
                                {formatCurrency(item.originalPrice * item.qty)}
                              </span>
                            )}
                            <span className="text-foreground text-sm font-semibold tabular-nums">
                              {formatCurrency(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <Separator className="my-3" />

                {/* Promo Code Section */}
                <div className="space-y-2">
                  {appliedPromo ? (
                    <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="text-primary size-3.5" />
                        <span className="text-foreground font-medium">{appliedPromo}</span>
                        <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                          -{formatCurrency(promoDiscount)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground size-6"
                        aria-label="Remove promo code"
                        onClick={handleRemovePromo}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Promo code (e.g. SUMMER20)"
                        size="small"
                        className="text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleApplyPromo()
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 text-xs"
                        disabled={!promoCodeInput.trim()}
                        onClick={handleApplyPromo}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                  {promoSuccess && (
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{promoSuccess}</p>
                  )}
                  {promoError && <p className="text-destructive text-xs">{promoError}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer: Summary & Actions */}
          {cartItems.length > 0 && (
            <div className="border-border/60 bg-card shrink-0 space-y-3 border-t p-5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium tabular-nums">{formatCurrency(subtotal)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Coupon ({appliedPromo})</span>
                    <span className="font-medium tabular-nums">-{formatCurrency(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                  ) : (
                    <span className="text-foreground font-medium tabular-nums">{formatCurrency(shippingFee)}</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="text-foreground font-medium tabular-nums">{formatCurrency(estimatedTax)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  className="w-full justify-center gap-2 font-medium shadow-xs"
                  size="default"
                  onClick={handleCheckout}
                >
                  <Lock className="size-3.5" />
                  Proceed to Checkout
                </Button>

                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground w-full text-xs"
                  size="sm"
                  onClick={onContinueShopping}
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Guarantee badges */}
              <div className="border-border/40 text-muted-foreground grid grid-cols-1 gap-2 border-t pt-3 text-center text-xs sm:grid-cols-3">
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="size-3.5" />
                  <span>30-day returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="size-3.5" />
                  <span>256-bit secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Leaf className="size-3.5" />
                  <span>Carbon neutral</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* FULL PAGE VARIANT */
        <div className="mx-auto w-full max-w-6xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Review your selected items and calculate shipping before checkout.
              </p>
            </div>
            {totalItemsCount > 0 && (
              <Badge variant="outline" className="w-fit text-xs tabular-nums">
                {totalItemsCount} items in cart
              </Badge>
            )}
          </div>

          {/* Free Shipping Banner */}
          {cartItems.length > 0 && (
            <div className="bg-card border-border/80 rounded-xl border p-4 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs">
                  {isFreeShippingUnlocked ? (
                    <>
                      <Sparkles className="text-primary size-4" />
                      <span className="text-primary font-semibold">
                        You've unlocked Free Express Shipping on this order!
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      🎉 You're{' '}
                      <strong className="text-foreground font-semibold tabular-nums">
                        {formatCurrency(amountAwayFromFreeShipping)}
                      </strong>{' '}
                      away from Free Shipping!
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-xs font-medium tabular-nums">
                  {shippingProgress}% completed
                </span>
              </div>
              <Progress value={shippingProgress} className="mt-2.5 h-2" />
            </div>
          )}

          {/* Empty State for Page */}
          {cartItems.length === 0 ? (
            <div className="bg-card border-border/80 flex flex-col items-center justify-center rounded-2xl border py-16 text-center shadow-xs">
              <div className="bg-muted text-muted-foreground mb-4 flex size-16 items-center justify-center rounded-full">
                <ShoppingBag className="size-8 stroke-[1.5]" />
              </div>
              <h2 className="text-lg font-semibold">Your cart is currently empty</h2>
              <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                Before you proceed to checkout you must add some products to your shopping cart.
              </p>
              <Button className="mt-6 gap-2" size="default" onClick={resetCart}>
                <ShoppingBag className="size-4" />
                Explore Products
              </Button>
            </div>
          ) : (
            /* Page Grid: Items (Left) & Order Summary (Right) */
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
              {/* Left: Line Items list */}
              <div className="space-y-4 lg:col-span-8">
                <div className="bg-card border-border/80 divide-border/60 divide-y rounded-2xl border shadow-xs">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="border-border/60 bg-muted/40 relative size-20 shrink-0 overflow-hidden rounded-lg border shadow-xs">
                          <img src={item.image} alt={item.name} className="size-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-foreground text-sm font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground mt-0.5 text-xs">{item.variant}</p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">In stock</span>
                            <span className="text-muted-foreground text-xs font-normal tabular-nums">
                              · {formatCurrency(item.price)} each
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                        <div className="border-border/80 bg-background flex items-center rounded-md border shadow-xs">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 rounded-none rounded-l-md"
                            aria-label={`Decrease quantity for ${item.name}`}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="w-8 text-center text-xs font-medium tabular-nums">{item.qty}</span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 rounded-none rounded-r-md"
                            aria-label={`Increase quantity for ${item.name}`}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>

                        <div className="w-24 text-right">
                          {item.originalPrice && (
                            <span className="text-muted-foreground block text-xs tabular-nums line-through">
                              {formatCurrency(item.originalPrice * item.qty)}
                            </span>
                          )}
                          <span className="text-foreground text-base font-semibold tabular-nums">
                            {formatCurrency(item.price * item.qty)}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-destructive size-8"
                          aria-label={`Remove ${item.name} from cart`}
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom bar: Guarantees */}
                <div className="bg-card border-border/80 grid grid-cols-1 gap-4 rounded-xl border p-4 shadow-xs sm:grid-cols-3">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                      <RotateCcw className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">Free 30-Day Returns</p>
                      <p className="text-muted-foreground">Hassle-free return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                      <ShieldCheck className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">256-Bit SSL Security</p>
                      <p className="text-muted-foreground">Bank-grade data encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                      <Leaf className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">Carbon Neutral</p>
                      <p className="text-muted-foreground">Offset delivery emissions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Sticky Order Summary Card */}
              <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
                <div className="bg-card border-border/80 space-y-4 rounded-2xl border p-5 shadow-xs">
                  <h2 className="text-base font-semibold">Order Summary</h2>

                  {/* Promo Input */}
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-xs font-medium">Have a coupon code?</label>
                    {appliedPromo ? (
                      <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border px-3 py-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Tag className="text-primary size-3.5" />
                          <span className="text-foreground font-medium">{appliedPromo}</span>
                          <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                            -{formatCurrency(promoDiscount)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-foreground size-6"
                          aria-label="Remove coupon"
                          onClick={handleRemovePromo}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          placeholder="Enter code (SUMMER20)"
                          size="small"
                          className="text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleApplyPromo()
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-xs"
                          disabled={!promoCodeInput.trim()}
                          onClick={handleApplyPromo}
                        >
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Cost Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium tabular-nums">{formatCurrency(subtotal)}</span>
                    </div>

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                        <span>Coupon ({appliedPromo})</span>
                        <span className="font-medium tabular-nums">-{formatCurrency(promoDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      {shippingFee === 0 ? (
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                      ) : (
                        <span className="text-foreground font-medium tabular-nums">{formatCurrency(shippingFee)}</span>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tax (8%)</span>
                      <span className="text-foreground font-medium tabular-nums">{formatCurrency(estimatedTax)}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-base font-semibold">
                      <span>Total</span>
                      <span className="tabular-nums">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full justify-center gap-2 font-medium shadow-xs"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <Lock className="size-4" />
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground w-full text-xs"
                    size="sm"
                    onClick={onContinueShopping}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
