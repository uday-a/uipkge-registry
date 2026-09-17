'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface ReturnsPortalProps {
  initialStep?: number
  initialOrderNumber?: string
  initialEmail?: string
  className?: string
}

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

export function ReturnsPortal({
  initialStep = 1,
  initialOrderNumber = '#ORD-84920',
  initialEmail = 'sarah.connor@example.com',
  className,
}: ReturnsPortalProps) {
  const [step, setStep] = React.useState(initialStep)
  const [orderNumber, setOrderNumber] = React.useState(initialOrderNumber)
  const [email, setEmail] = React.useState(initialEmail)

  const [selectedItems, setSelectedItems] = React.useState<Record<string, boolean>>({
    'item-1': true,
    'item-2': false,
    'item-3': false,
  })

  const [returnQuantities, setReturnQuantities] = React.useState<Record<string, number>>({
    'item-1': 1,
    'item-2': 1,
    'item-3': 1,
  })

  const [returnReasons, setReturnReasons] = React.useState<Record<string, string>>({
    'item-1': 'Wrong size',
    'item-2': 'Changed mind',
    'item-3': 'Item defective',
  })

  const [resolution, setResolution] = React.useState<'exchange' | 'store-credit' | 'original-payment'>('store-credit')
  const [exchangeSize, setExchangeSize] = React.useState('Medium (M)')
  const [isDownloaded, setIsDownloaded] = React.useState(false)

  React.useEffect(() => {
    setStep(initialStep)
  }, [initialStep])

  const selectedItemsCount = orderItems.reduce((acc, item) => {
    if (selectedItems[item.id]) {
      return acc + (returnQuantities[item.id] || 1)
    }
    return acc
  }, 0)

  const itemsSubtotal = orderItems.reduce((acc, item) => {
    if (selectedItems[item.id]) {
      return acc + item.price * (returnQuantities[item.id] || 1)
    }
    return acc
  }, 0)

  const storeCreditBonus = itemsSubtotal * 0.1
  const totalStoreCredit = itemsSubtotal + storeCreditBonus

  function formatCurrency(val: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val)
  }

  function onStepperInput(value: number) {
    if (value < step && step !== 4) {
      setStep(value)
    }
  }

  function goToNext() {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  function goToPrevious() {
    if (step > 1 && step < 4) {
      setStep(step - 1)
    }
  }

  function toggleItemSelection(id: string) {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  function reset() {
    setStep(1)
    setIsDownloaded(false)
    setSelectedItems({
      'item-1': true,
      'item-2': false,
      'item-3': false,
    })
    setReturnQuantities({
      'item-1': 1,
      'item-2': 1,
      'item-3': 1,
    })
    setReturnReasons({
      'item-1': 'Wrong size',
      'item-2': 'Changed mind',
      'item-3': 'Item defective',
    })
    setResolution('store-credit')
    setExchangeSize('Medium (M)')
  }

  return (
    <Card data-slot="returns-portal" className={cn('border-border mx-auto w-full max-w-3xl shadow-xs', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold">Returns & Exchange Portal</CardTitle>
            <CardDescription className="text-xs">
              Self-serve return, exchange, or refund for your recent order.
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            <Truck className="text-muted-foreground mr-1 size-3" />
            Prepaid Shipping
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Stepper steps={steps} value={step} onValueChange={onStepperInput} className="mb-6" />

        {/* Step 1: Find Order */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-foreground text-sm font-semibold">Find your order</h3>
              <p className="text-muted-foreground text-xs">
                Enter your order number and email address to start a return or exchange.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="returns-order-number" className="text-foreground text-xs font-medium">
                  Order number
                </label>
                <Input
                  id="returns-order-number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="#ORD-84920"
                  autoComplete="off"
                />
                <p className="text-muted-foreground text-xs">Found on your order confirmation email.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="returns-email" className="text-foreground text-xs font-medium">
                  Email address
                </label>
                <Input
                  id="returns-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="sarah.connor@example.com"
                  autoComplete="email"
                />
                <p className="text-muted-foreground text-xs">The email address used at checkout.</p>
              </div>
            </div>

            <div className="border-border bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5">
              <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" />
              <div className="space-y-0.5 text-xs">
                <p className="text-foreground font-medium">30-Day Hassle-Free Return Policy</p>
                <p className="text-muted-foreground">
                  Eligible items can be returned within 30 days of delivery. Free shipping on all exchanges and store
                  credit requests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Items */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-[12rem]">
                <h3 className="text-foreground text-sm font-semibold">Select items to return</h3>
                <p className="text-muted-foreground text-xs">
                  Order {orderNumber || '#ORD-84920'} • Placed Oct 14, 2026 • 3 items eligible
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {selectedItemsCount} of 3 selected
              </Badge>
            </div>

            <div className="space-y-3">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-lg border p-4 transition-colors',
                    selectedItems[item.id]
                      ? 'border-primary/50 bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                      : 'border-border bg-card hover:bg-muted/20',
                  )}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="pt-0.5">
                      <Checkbox
                        id={`check-${item.id}`}
                        checked={selectedItems[item.id]}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </div>

                    <div className="border-border bg-muted/60 text-muted-foreground flex size-12 shrink-0 items-center justify-center rounded-md border">
                      <Shirt className="size-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <label
                            htmlFor={`check-${item.id}`}
                            className="text-foreground cursor-pointer text-sm font-medium select-none"
                          >
                            {item.name}
                          </label>
                          <p className="text-muted-foreground text-xs">
                            {item.variant} • SKU: {item.sku}
                          </p>
                        </div>
                        <span className="text-foreground shrink-0 text-sm font-semibold">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedItems[item.id] && (
                    <div className="border-border/60 mt-3.5 grid grid-cols-1 gap-3 border-t pt-3.5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-foreground text-xs font-medium">Qty to return</label>
                        <Select
                          value={String(returnQuantities[item.id] || 1)}
                          onValueChange={(val) => setReturnQuantities((prev) => ({ ...prev, [item.id]: Number(val) }))}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
                            <SelectValue placeholder="Qty" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: item.maxQty }, (_, idx) => idx + 1).map((q) => (
                              <SelectItem key={q} value={String(q)}>
                                {q} {q === 1 ? 'item' : 'items'} (of {item.maxQty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-foreground text-xs font-medium">Return reason</label>
                        <Select
                          value={returnReasons[item.id]}
                          onValueChange={(val) => setReturnReasons((prev) => ({ ...prev, [item.id]: val }))}
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            {returnReasonsList.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-border bg-muted/40 flex items-center justify-between rounded-lg border p-3 text-xs">
              <span className="text-muted-foreground">
                {selectedItemsCount > 0 ? (
                  <>
                    <span className="text-foreground font-medium">{selectedItemsCount}</span> item
                    {selectedItemsCount === 1 ? '' : 's'} selected
                  </>
                ) : (
                  'No items selected yet'
                )}
              </span>
              <span className="text-foreground font-medium">Estimated Value: {formatCurrency(itemsSubtotal)}</span>
            </div>
          </div>
        )}

        {/* Step 3: Choose Resolution */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-foreground text-sm font-semibold">Choose return resolution</h3>
              <p className="text-muted-foreground text-xs">Select how you would like your return or refund handled.</p>
            </div>

            <RadioGroup
              value={resolution}
              onValueChange={(val) => setResolution(val as typeof resolution)}
              className="gap-3"
            >
              {/* Option A: Exchange */}
              <div
                className={cn(
                  'flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                  resolution === 'exchange'
                    ? 'border-primary bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                    : 'border-border hover:bg-muted/40',
                )}
                onClick={() => setResolution('exchange')}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem id="res-exchange" value="exchange" className="mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="text-primary size-4" />
                      <label htmlFor="res-exchange" className="text-foreground cursor-pointer text-sm font-medium">
                        Exchange for different size / color
                      </label>
                      <Badge variant="outline" className="text-xs">
                        Free shipping
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Reserve replacement item immediately. Ships as soon as carrier scans the return package.
                    </p>
                  </div>
                </div>

                {resolution === 'exchange' && (
                  <div
                    className="border-border/60 mt-1 space-y-1.5 border-t pt-3 pl-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="text-foreground text-xs font-medium">Select replacement size</label>
                    <Select value={exchangeSize} onValueChange={setExchangeSize}>
                      <SelectTrigger className="h-8 w-full max-w-xs text-xs">
                        <SelectValue placeholder="Select replacement size" />
                      </SelectTrigger>
                      <SelectContent>
                        {exchangeSizesList.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Option B: Store Credit (+10% Bonus) */}
              <div
                className={cn(
                  'flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                  resolution === 'store-credit'
                    ? 'border-primary bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                    : 'border-border hover:bg-muted/40',
                )}
                onClick={() => setResolution('store-credit')}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem id="res-store-credit" value="store-credit" className="mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <label htmlFor="res-store-credit" className="text-foreground cursor-pointer text-sm font-medium">
                        Store Credit (+10% Bonus value)
                      </label>
                      <Badge variant="success" className="text-xs">
                        +10% Bonus
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Fastest refund
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Get <span className="text-foreground font-medium">{formatCurrency(totalStoreCredit)}</span> in
                      store credit ({formatCurrency(itemsSubtotal)} + {formatCurrency(storeCreditBonus)} bonus). Digital
                      card delivered by email instantly upon drop-off scan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option C: Original Payment Method */}
              <div
                className={cn(
                  'flex cursor-pointer flex-col gap-3 rounded-lg border p-4 transition-colors',
                  resolution === 'original-payment'
                    ? 'border-primary bg-primary/[0.02] dark:bg-primary/10 shadow-xs'
                    : 'border-border hover:bg-muted/40',
                )}
                onClick={() => setResolution('original-payment')}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem id="res-original" value="original-payment" className="mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CreditCard className="text-muted-foreground size-4" />
                      <label htmlFor="res-original" className="text-foreground cursor-pointer text-sm font-medium">
                        Original Payment Method
                      </label>
                      <Badge variant="outline" className="text-xs">
                        Visa •••• 4242
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Refund of {formatCurrency(itemsSubtotal)} back to your card. Processed in 3–5 business days after
                      carrier drop-off.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Summary calculation box */}
            <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-4 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Selected items subtotal</span>
                <span className="text-foreground font-medium">{formatCurrency(itemsSubtotal)}</span>
              </div>
              {resolution === 'store-credit' && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Bonus store credit (+10%)</span>
                  <span className="font-medium">+{formatCurrency(storeCreditBonus)}</span>
                </div>
              )}
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Prepaid return shipping</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>
              <div className="border-border text-foreground flex items-center justify-between border-t pt-2 text-sm font-semibold">
                <span>
                  {resolution === 'store-credit'
                    ? 'Total Store Credit'
                    : resolution === 'exchange'
                      ? 'Exchange Value'
                      : 'Total Refund'}
                </span>
                <span className={resolution === 'store-credit' ? 'text-emerald-600 dark:text-emerald-400' : ''}>
                  {resolution === 'store-credit' ? formatCurrency(totalStoreCredit) : formatCurrency(itemsSubtotal)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation & Label */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2 py-2 text-center">
              <div className="relative mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-foreground text-base font-semibold">Return Authorized & Confirmed</h3>
              <p className="text-muted-foreground mx-auto max-w-md text-xs">
                Your return request has been submitted. A prepaid shipping label and confirmation receipt have been sent
                to <span className="text-foreground font-medium">{email || 'sarah.connor@example.com'}</span>.
              </p>
            </div>

            {/* Return Details Overview */}
            <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
              <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-xs">Return ID</span>
                  <p className="text-foreground font-mono text-sm font-semibold">#RET-2026-849</p>
                </div>
                <Badge variant="success" className="gap-1 text-xs">
                  <Check className="size-3" /> Authorized
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground">Carrier</span>
                  <p className="text-foreground font-medium">USPS Ground Advantage™</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground">Tracking Number</span>
                  <p className="text-foreground font-mono font-medium">9400 1118 9956 2849</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-muted-foreground">Selected Resolution</span>
                  <p className="text-foreground font-medium">
                    {resolution === 'store-credit'
                      ? `Store Credit (${formatCurrency(totalStoreCredit)})`
                      : resolution === 'exchange'
                        ? `Exchange (${exchangeSize})`
                        : `Refund to Visa •••• 4242`}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Download Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                aria-label="Download attachment"
                className="flex-1 gap-2"
                size="default"
                onClick={() => setIsDownloaded(true)}
              >
                <Download className="size-4" />
                {isDownloaded ? 'Label Downloaded (PDF)' : 'Download Prepaid Shipping Label (PDF)'}
              </Button>
              <Button variant="outline" className="gap-2" size="default">
                <Printer className="size-4" />
                Print Return Slip
              </Button>
            </div>

            {/* Drop-off instructions & QR code card */}
            <div className="border-border bg-card space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-foreground text-xs font-semibold tracking-wide uppercase">
                  Carrier Drop-off Pass & Instructions
                </h4>
                <Badge variant="outline" className="text-xs">
                  No printer required
                </Badge>
              </div>

              <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
                <div className="space-y-3 text-xs sm:col-span-2">
                  <div className="flex items-start gap-2.5">
                    <div className="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      1
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-foreground font-medium">Pack your items</p>
                      <p className="text-muted-foreground">
                        Place returned items with tags inside the original shipping bag or any sturdy box.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      2
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-foreground font-medium">Attach label or show QR code</p>
                      <p className="text-muted-foreground">
                        Tape the downloaded shipping label to the box, or present the digital QR pass at the drop-off
                        counter.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="bg-muted text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                      3
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-foreground font-medium">Drop off before Nov 15, 2026</p>
                      <p className="text-muted-foreground">
                        Bring to any USPS Post Office, USPS drop box, or authorized FedEx shipping point.
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR code visual */}
                <div className="border-border bg-muted/40 flex flex-col items-center justify-center space-y-2 rounded-lg border p-3 text-center sm:col-span-1">
                  <svg
                    className="text-foreground size-24"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    aria-label="Prepaid return shipping QR dropoff code"
                  >
                    {/* Top-left finder */}
                    <rect
                      x="10"
                      y="10"
                      width="24"
                      height="24"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <rect x="17" y="17" width="10" height="10" rx="1" fill="currentColor" />
                    {/* Top-right finder */}
                    <rect
                      x="66"
                      y="10"
                      width="24"
                      height="24"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <rect x="73" y="17" width="10" height="10" rx="1" fill="currentColor" />
                    {/* Bottom-left finder */}
                    <rect
                      x="10"
                      y="66"
                      width="24"
                      height="24"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <rect x="17" y="73" width="10" height="10" rx="1" fill="currentColor" />
                    {/* Data dots */}
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
                  <span className="text-foreground font-mono text-xs font-semibold">RET-2026-849</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground text-xs"
                onClick={reset}
              >
                Start another return
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {step < 4 && (
        <CardFooter className="border-border flex flex-wrap items-center justify-between gap-2 border-t pt-2">
          {step > 1 ? (
            <Button variant="ghost" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="mr-1 size-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <span className="text-muted-foreground text-xs">Step {step} of 4</span>

          {step === 1 && (
            <Button size="sm" disabled={!orderNumber.trim() || !email.trim()} onClick={goToNext}>
              Find Order
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}

          {step === 2 && (
            <Button size="sm" disabled={selectedItemsCount === 0} onClick={goToNext}>
              Choose Resolution
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}

          {step === 3 && (
            <Button size="sm" onClick={goToNext}>
              Confirm & Print Label
              <Check className="ml-1 size-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
