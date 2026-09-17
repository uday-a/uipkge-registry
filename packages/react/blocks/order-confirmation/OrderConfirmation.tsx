'use client'

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
} from 'lucide-react'
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

interface OrderConfirmationProps {
  className?: string
}

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

export function OrderConfirmation({ className }: OrderConfirmationProps) {
  return (
    <div data-slot="order-confirmation" className={cn('w-full space-y-6', className)}>
      {/* Success Banner Card */}
      <Card className="border shadow-xs">
        <CardContent className="flex flex-col items-center p-6 text-center sm:p-10">
          <div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-8 ring-emerald-500/10 sm:size-20 dark:text-emerald-400">
            <CheckCircle2 className="size-8 sm:size-10" aria-hidden="true" />
          </div>

          <div className="mt-6 max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Order Confirmed
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Thank you for your order!</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              We've received your order <span className="text-foreground font-mono font-semibold">#ORD-92841</span> and
              sent a confirmation email to <span className="text-foreground font-medium">customer@example.com</span>.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button className="gap-2 shadow-xs">
              <ExternalLink className="size-4" aria-hidden="true" />
              Track Shipment
            </Button>
            <Button aria-label="Download attachment" variant="outline" className="gap-2 shadow-xs">
              <Download className="size-4" aria-hidden="true" />
              Download Receipt
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Stepper Card */}
      <Card className="border shadow-xs">
        <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Truck className="text-primary size-4" aria-hidden="true" />
              <CardTitle className="text-base font-semibold">Shipment Progress</CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs font-medium">
                In Transit
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Carrier: <span className="text-foreground font-medium">FedEx Priority</span> • Tracking:{' '}
              <span className="text-foreground font-mono font-medium">#FX-9821734910</span>
            </p>
          </div>
          <div className="border-border/80 bg-muted/40 rounded-lg border px-3 py-1.5 text-xs">
            <span className="text-muted-foreground">Estimated Delivery:</span>
            <span className="text-foreground ml-1 font-semibold">Thursday, Aug 27, 2026</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Desktop Stepper (md+) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-4">
              {trackingSteps.map((step, idx) => (
                <div key={step.id} className="relative flex flex-col">
                  <div className="relative flex items-center">
                    {/* Connecting Line before current step */}
                    {idx > 0 && (
                      <div
                        className={cn(
                          'absolute top-1/2 right-1/2 -z-0 h-0.5 w-full -translate-y-1/2',
                          step.status === 'upcoming' ? 'bg-muted' : 'bg-primary',
                        )}
                      />
                    )}

                    {/* Connecting Line after current step */}
                    {idx < trackingSteps.length - 1 && (
                      <div
                        className={cn(
                          'absolute top-1/2 left-1/2 -z-0 h-0.5 w-full -translate-y-1/2',
                          trackingSteps[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary',
                        )}
                      />
                    )}

                    {/* Step Indicator Circle */}
                    <div className="relative z-10 mx-auto flex items-center justify-center">
                      {step.status === 'completed' ? (
                        <div className="bg-primary text-primary-foreground ring-background flex size-8 items-center justify-center rounded-full ring-4">
                          <Check className="size-4" aria-hidden="true" />
                        </div>
                      ) : step.status === 'current' ? (
                        <div className="border-primary bg-background text-primary ring-background flex size-8 items-center justify-center rounded-full border-2 ring-4">
                          <span className="relative flex size-2.5">
                            <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                            <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
                          </span>
                        </div>
                      ) : (
                        <div className="border-muted-foreground/30 bg-muted/40 text-muted-foreground ring-background flex size-8 items-center justify-center rounded-full border-2 ring-4">
                          <Package className="size-3.5" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step Info */}
                  <div className="mt-3 text-center">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">{step.date}</p>
                    <p className="text-muted-foreground/80 mt-0.5 text-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Stepper (< md) */}
          <div className="space-y-4 md:hidden">
            {trackingSteps.map((step, idx) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {step.status === 'completed' ? (
                    <div className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full">
                      <Check className="size-3.5" aria-hidden="true" />
                    </div>
                  ) : step.status === 'current' ? (
                    <div className="border-primary bg-background text-primary flex size-7 shrink-0 items-center justify-center rounded-full border-2">
                      <span className="relative flex size-2">
                        <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                        <span className="bg-primary relative inline-flex size-2 rounded-full" />
                      </span>
                    </div>
                  ) : (
                    <div className="border-muted-foreground/30 bg-muted/40 text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border-2">
                      <Package className="size-3" aria-hidden="true" />
                    </div>
                  )}

                  {idx < trackingSteps.length - 1 && (
                    <div
                      className={cn(
                        'mt-1 h-8 w-0.5',
                        trackingSteps[idx + 1].status === 'upcoming' ? 'bg-muted' : 'bg-primary',
                      )}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-0.5 pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        step.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground',
                      )}
                    >
                      {step.title}
                    </p>
                    <span className="text-muted-foreground text-xs tabular-nums">{step.date}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2-Column Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Itemized Order Summary */}
        <div className="lg:col-span-7">
          <Card className="border shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Order Summary</CardTitle>
              <CardDescription>3 items in shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items list */}
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="border-border bg-muted/40 relative size-16 shrink-0 overflow-hidden rounded-lg border">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs">{item.variant}</p>
                      <p className="text-muted-foreground mt-1 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground text-sm font-semibold tabular-nums">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cost breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium tabular-nums">$252.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping (FedEx Priority)</span>
                  <span className="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="text-foreground font-medium tabular-nums">$12.50</span>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-foreground text-base font-semibold">Total</span>
                <span className="text-foreground text-xl font-bold tabular-nums sm:text-2xl">$264.50</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Customer & Delivery Details */}
        <div className="space-y-6 lg:col-span-5">
          {/* Shipping Address Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-muted-foreground size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Shipping Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-0.5">
                <p className="text-foreground font-medium">Alex Morgan</p>
                <p className="text-muted-foreground">742 Evergreen Terrace, Suite 4B</p>
                <p className="text-muted-foreground">Springfield, OR 97477</p>
                <p className="text-muted-foreground">United States</p>
                <p className="text-muted-foreground mt-1 text-xs">+1 (555) 234-5678</p>
              </div>
              <div className="border-border bg-muted/30 rounded-md border p-2.5 text-xs">
                <span className="text-muted-foreground">Delivery Method:</span>
                <span className="text-foreground ml-1 font-medium">FedEx Priority Express</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Payment Method</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="border-border bg-muted/40 text-foreground flex h-7 w-11 items-center justify-center rounded border font-mono text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Visa ending in 4242</p>
                    <p className="text-muted-foreground text-xs">Expires 08/29</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Paid
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">Billing address matches shipping address</p>
            </CardContent>
          </Card>

          {/* Need Help Card */}
          <Card className="border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="text-muted-foreground size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Need Help?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground text-xs">
                Questions about your order? Chat with support or email support@example.com.
              </p>
              <div className="space-y-2 pt-1">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs shadow-xs">
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  Chat with Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground w-full justify-start gap-2 text-xs"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  support@example.com
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
