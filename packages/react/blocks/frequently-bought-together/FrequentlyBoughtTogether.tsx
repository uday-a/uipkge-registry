'use client'

import * as React from 'react'
import { Plus, ShoppingBag, Truck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface BundleItem {
  id: string
  name: string
  subtitle: string
  price: number
  image: string
  isMain?: boolean
}

const items: BundleItem[] = [
  {
    id: 'headphones',
    name: 'Pro Studio Headphones',
    subtitle: 'Space Black · Over-Ear Wireless ANC',
    price: 299.0,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    isMain: true,
  },
  {
    id: 'case',
    name: 'Premium Hard Shell Case',
    subtitle: 'Weather-resistant EVA shell with plush velvet lining',
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'cable',
    name: 'Braided 3.5mm Audiophile Cable',
    subtitle: '1.5m Silver-plated OFC copper with gold-plated jacks',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
  },
]

function formatCurrency(val: number) {
  return '$' + val.toFixed(2)
}

export function FrequentlyBoughtTogether() {
  const [selectedIds, setSelectedIds] = React.useState<string[]>(['headphones', 'case', 'cable'])

  function toggleItem(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const selectedItems = React.useMemo(() => items.filter((item) => selectedIds.includes(item.id)), [selectedIds])
  const selectedCount = selectedItems.length

  const originalTotal = React.useMemo(() => selectedItems.reduce((sum, item) => sum + item.price, 0), [selectedItems])

  const discountRate = selectedCount >= 2 ? 0.15 : 0
  const discountAmount = originalTotal * discountRate
  const finalPrice = originalTotal - discountAmount
  const hasDiscount = discountRate > 0

  const buttonText = React.useMemo(() => {
    if (selectedCount === items.length) return `Add all ${items.length} to Cart`
    if (selectedCount > 1) return `Add ${selectedCount} selected to Cart`
    if (selectedCount === 1) return 'Add 1 selected to Cart'
    return 'Select items to add'
  }, [selectedCount])

  const deliveryNote = React.useMemo(() => {
    if (selectedCount >= 2) return 'Free express delivery included with this bundle'
    if (selectedCount === 1) return 'Standard delivery included'
    return 'Select items to view delivery options'
  }, [selectedCount])

  return (
    <Card data-slot="frequently-bought-together" className="mx-auto w-full max-w-4xl space-y-6 p-6 shadow-xs">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Frequently Bought Together</h2>
        <p className="text-muted-foreground text-sm">
          Pair with these recommended essentials for maximum performance and save 15% on the bundle
        </p>
      </div>

      {/* Product Visual Row */}
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-4">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <div
              className={cn(
                'border-border bg-muted/20 relative flex flex-col rounded-xl border p-3 text-left transition-all duration-200 sm:p-4',
                selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-40 grayscale',
              )}
            >
              <div className="border-border bg-background relative mb-3 aspect-square w-full overflow-hidden rounded-lg border">
                <img src={item.image} alt={item.name} className="size-full object-cover" />
                {item.isMain && (
                  <Badge
                    variant="secondary"
                    className="bg-background/90 text-foreground absolute top-2 left-2 text-xs font-medium backdrop-blur-xs"
                  >
                    This item
                  </Badge>
                )}
              </div>
              <span className="text-foreground line-clamp-1 text-xs leading-tight font-semibold sm:text-sm">
                {item.name}
              </span>
              <span className="text-foreground mt-1 text-xs font-semibold tabular-nums sm:text-sm">
                {formatCurrency(item.price)}
              </span>
            </div>

            {index < items.length - 1 && (
              <div
                className="border-border/50 text-muted-foreground bg-muted mx-auto flex size-8 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <Plus className="size-4" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Item Selection Checkbox List */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            className={cn(
              'border-border focus-visible:ring-ring flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors select-none focus-visible:ring-2 focus-visible:outline-none sm:items-center',
              selectedIds.includes(item.id)
                ? 'bg-card hover:border-primary/40'
                : 'border-border/60 bg-muted/10 opacity-60 hover:opacity-80',
            )}
            onClick={() => toggleItem(item.id)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                toggleItem(item.id)
              }
            }}
          >
            <div className="flex items-start gap-3 sm:items-center">
              <Checkbox
                id={item.id}
                checked={selectedIds.includes(item.id)}
                className="pointer-events-none mt-0.5 sm:mt-0"
                tabIndex={-1}
              />
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {item.isMain && <span className="font-semibold">This item: </span>}
                    {item.name}
                  </span>
                  {item.isMain && (
                    <Badge variant="secondary" className="text-xs">
                      Main Item
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">{item.subtitle}</p>
              </div>
            </div>
            <span className="text-foreground shrink-0 text-sm font-semibold tabular-nums">
              {formatCurrency(item.price)}
            </span>
          </div>
        ))}
      </div>

      {/* Price & Bundle Checkout Summary Box */}
      <div className="border-border bg-muted/30 flex flex-col gap-4 rounded-xl border p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {selectedCount >= 2 ? 'Bundle Price' : 'Total Price'}
          </div>
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
              {formatCurrency(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground text-sm font-medium tabular-nums line-through sm:text-base">
                {formatCurrency(originalTotal)}
              </span>
            )}
            {hasDiscount && (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                Save {formatCurrency(discountAmount)} (15% Bundle Discount)
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Truck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{deliveryNote}</span>
          </div>
        </div>

        <Button size="lg" disabled={selectedCount === 0} className="w-full gap-2 font-semibold shadow-xs md:w-auto">
          <ShoppingBag className="size-4" />
          <span>{buttonText}</span>
        </Button>
      </div>
    </Card>
  )
}
