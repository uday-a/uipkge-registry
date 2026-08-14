'use client'

import * as React from 'react'
import { useState, useMemo, useCallback } from 'react'
import {
  AlertCircle,
  Bookmark,
  Building2,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  TrendingDown,
  Truck,
  Upload,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

export interface WholesaleProduct {
  id: string
  sku: string
  name: string
  variant: string
  casePack: number
  msrpUnitPrice: number
  wholesaleUnitPrice: number
  cases: number
  availableCases: number
  image: string
  category: string
}

export interface WholesaleB2bQuickOrderProps {
  poNumber?: string
  accountName?: string
  accountTier?: string
  tierDiscountPercent?: number
  paymentTerms?: string
  freeFreightThreshold?: number
  initialProducts?: WholesaleProduct[]
  className?: string
  onSubmitOrder?: (payload: {
    poNumber: string
    items: WholesaleProduct[]
    subtotal: number
    totalUnits: number
    totalCases: number
    savings: number
  }) => void
  onSaveTemplate?: (items: WholesaleProduct[]) => void
  onExportCsv?: (items: WholesaleProduct[]) => void
}

export const DEFAULT_WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    id: 'prod-1',
    sku: 'SKU-84920',
    name: 'Pro Studio Headphones',
    variant: 'Matte Black · Pro Series',
    casePack: 12,
    msrpUnitPrice: 299.0,
    wholesaleUnitPrice: 194.35,
    cases: 4,
    availableCases: 450,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    category: 'Audio & Acoustics',
  },
  {
    id: 'prod-2',
    sku: 'SKU-49102',
    name: 'Aero Minimalist Runner',
    variant: 'Arctic White · US 10-12 Assorted',
    casePack: 10,
    msrpUnitPrice: 140.0,
    wholesaleUnitPrice: 91.0,
    cases: 3,
    availableCases: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
    category: 'Footwear',
  },
  {
    id: 'prod-3',
    sku: 'SKU-77215',
    name: 'Technical Shell Parka',
    variant: 'Mineral Gray · Waterproof 3L',
    casePack: 8,
    msrpUnitPrice: 220.0,
    wholesaleUnitPrice: 143.0,
    cases: 2,
    availableCases: 95,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80',
    category: 'Outerwear',
  },
  {
    id: 'prod-4',
    sku: 'SKU-10934',
    name: 'Braided USB-C Cable',
    variant: 'Space Gray · 2m 240W EPR',
    casePack: 24,
    msrpUnitPrice: 25.0,
    wholesaleUnitPrice: 16.25,
    cases: 2,
    availableCases: 620,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
    category: 'Hardware & Cables',
  },
  {
    id: 'prod-5',
    sku: 'SKU-63821',
    name: 'Leather Cardholder',
    variant: 'Saddle Brown · Full-Grain Veg-Tan',
    casePack: 20,
    msrpUnitPrice: 50.0,
    wholesaleUnitPrice: 32.5,
    cases: 1,
    availableCases: 24,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80',
    category: 'Leather Goods',
  },
]

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val)
}

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val)
}

export function WholesaleB2bQuickOrder({
  poNumber = 'PO-2026-8841B',
  accountName = 'Northwind Retailers',
  accountTier = 'Tier 3 Wholesale Partner',
  tierDiscountPercent = 35,
  paymentTerms = 'Net 30 Invoicing',
  freeFreightThreshold = 10000,
  initialProducts,
  className,
  onSubmitOrder,
  onSaveTemplate,
  onExportCsv,
}: WholesaleB2bQuickOrderProps) {
  const [products, setProducts] = useState<WholesaleProduct[]>(() =>
    initialProducts
      ? JSON.parse(JSON.stringify(initialProducts))
      : JSON.parse(JSON.stringify(DEFAULT_WHOLESALE_PRODUCTS)),
  )

  const [poRef] = useState(poNumber)
  const [showCsvBox, setShowCsvBox] = useState(false)
  const [csvPasteText, setCsvPasteText] = useState('')
  const [pasteFeedback, setPasteFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [templateSaved, setTemplateSaved] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Computations
  const totalCases = useMemo(() => products.reduce((acc, p) => acc + (Number(p.cases) || 0), 0), [products])
  const totalUnits = useMemo(
    () => products.reduce((acc, p) => acc + (Number(p.cases) || 0) * p.casePack, 0),
    [products],
  )
  const wholesaleSubtotal = useMemo(
    () => products.reduce((acc, p) => acc + (Number(p.cases) || 0) * p.casePack * p.wholesaleUnitPrice, 0),
    [products],
  )
  const msrpTotal = useMemo(
    () => products.reduce((acc, p) => acc + (Number(p.cases) || 0) * p.casePack * p.msrpUnitPrice, 0),
    [products],
  )
  const totalSavings = useMemo(() => Math.max(0, msrpTotal - wholesaleSubtotal), [msrpTotal, wholesaleSubtotal])
  const savingsPercent = useMemo(() => {
    if (msrpTotal <= 0) return tierDiscountPercent
    return Math.round((totalSavings / msrpTotal) * 100)
  }, [msrpTotal, totalSavings, tierDiscountPercent])

  const isFreeFreight = wholesaleSubtotal >= freeFreightThreshold
  const freightAmount = isFreeFreight ? 0 : 250
  const grandTotal = wholesaleSubtotal + freightAmount

  const nextTierTarget = 50000
  const nextTierRemaining = Math.max(0, nextTierTarget - wholesaleSubtotal)
  const tierProgressPercent = Math.min(100, Math.round((wholesaleSubtotal / nextTierTarget) * 100))

  // Actions
  const updateCases = useCallback((id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const current = Number(p.cases) || 0
          const next = Math.max(0, Math.min(p.availableCases, current + delta))
          return { ...p, cases: next }
        }
        return p
      }),
    )
  }, [])

  const setCases = useCallback((id: string, val: string | number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const parsed = parseInt(String(val), 10)
          const next = isNaN(parsed) || parsed < 0 ? 0 : Math.min(p.availableCases, parsed)
          return { ...p, cases: next }
        }
        return p
      }),
    )
  }, [])

  const clearLine = useCallback((id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, cases: 0 } : p)))
  }, [])

  const resetAllCases = useCallback(() => {
    setProducts((prev) => prev.map((p) => ({ ...p, cases: 0 })))
    setPasteFeedback(null)
  }, [])

  const restoreDefaultCases = useCallback(() => {
    setProducts(JSON.parse(JSON.stringify(DEFAULT_WHOLESALE_PRODUCTS)))
    setPasteFeedback(null)
  }, [])

  const applyCsvPaste = useCallback(() => {
    setPasteFeedback(null)
    if (!csvPasteText.trim()) {
      setPasteFeedback({
        type: 'error',
        message: 'Please paste SKU and case quantity rows to parse.',
      })
      return
    }

    const lines = csvPasteText.split(/\r?\n/)
    let updatedCount = 0
    const unknownSkus: string[] = []

    setProducts((prev) => {
      const cloned = prev.map((p) => ({ ...p }))
      for (const rawLine of lines) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#') || line.toLowerCase().startsWith('sku')) continue

        const parts = line.split(/[,;\t]+/).map((s) => s.trim())
        if (parts.length >= 2) {
          const skuQuery = parts[0].toUpperCase()
          const qty = parseInt(parts[1], 10)

          if (!isNaN(qty)) {
            const product = cloned.find(
              (p) => p.sku.toUpperCase() === skuQuery || p.sku.toUpperCase().includes(skuQuery),
            )
            if (product) {
              product.cases = Math.max(0, Math.min(product.availableCases, qty))
              updatedCount++
            } else {
              unknownSkus.push(parts[0])
            }
          }
        }
      }
      return cloned
    })

    if (updatedCount > 0) {
      setPasteFeedback({
        type: 'success',
        message: `Successfully updated ${updatedCount} SKU line items in bulk matrix.${
          unknownSkus.length > 0
            ? ` Note: ${unknownSkus.length} SKU(s) not found in catalog (${unknownSkus.slice(0, 3).join(', ')}).`
            : ''
        }`,
      })
    } else {
      setPasteFeedback({
        type: 'error',
        message: 'No matching catalog SKUs found. Verify format: SKU-84920, 10',
      })
    }
  }, [csvPasteText])

  const loadSampleCsv = useCallback(() => {
    const sample = `SKU-84920, 8\nSKU-49102, 5\nSKU-77215, 4\nSKU-10934, 12\nSKU-63821, 6`
    setCsvPasteText(sample)

    // Parse sample directly
    const lines = sample.split(/\r?\n/)
    setProducts((prev) => {
      const cloned = prev.map((p) => ({ ...p }))
      let count = 0
      for (const rawLine of lines) {
        const parts = rawLine.split(/[,;\t]+/).map((s) => s.trim())
        if (parts.length >= 2) {
          const skuQuery = parts[0].toUpperCase()
          const qty = parseInt(parts[1], 10)
          const product = cloned.find((p) => p.sku.toUpperCase() === skuQuery)
          if (product && !isNaN(qty)) {
            product.cases = Math.max(0, Math.min(product.availableCases, qty))
            count++
          }
        }
      }
      return cloned
    })
    setPasteFeedback({
      type: 'success',
      message: 'Sample manifest loaded and applied to matrix (5 SKUs updated).',
    })
  }, [])

  const handleSaveTemplate = useCallback(() => {
    setTemplateSaved(true)
    onSaveTemplate?.(products)
    setTimeout(() => {
      setTemplateSaved(false)
    }, 4000)
  }, [products, onSaveTemplate])

  const handleSubmitOrder = useCallback(() => {
    if (totalCases === 0) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setOrderSubmitted(true)
      onSubmitOrder?.({
        poNumber: poRef,
        items: products.filter((p) => p.cases > 0),
        subtotal: wholesaleSubtotal,
        totalUnits,
        totalCases,
        savings: totalSavings,
      })
    }, 600)
  }, [totalCases, poRef, products, wholesaleSubtotal, totalUnits, totalSavings, onSubmitOrder])

  const handleExportCsv = useCallback(() => {
    onExportCsv?.(products)
    const header =
      'SKU,Product Name,Variant,Case Pack Multiplier,Cases Ordered,Total Units,Wholesale Unit Price,Line Total\n'
    const rows = products
      .filter((p) => p.cases > 0)
      .map(
        (p) =>
          `"${p.sku}","${p.name}","${p.variant}",${p.casePack},${p.cases},${p.cases * p.casePack},${p.wholesaleUnitPrice},${(p.cases * p.casePack * p.wholesaleUnitPrice).toFixed(2)}`,
      )
      .join('\n')
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows)
    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('href', csvContent)
    downloadLink.setAttribute('download', `${poRef}-order-matrix.csv`)
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }, [products, onExportCsv, poRef])

  return (
    <div
      data-slot="wholesale-b2b-quick-order"
      className={cn('bg-background text-foreground w-full space-y-6', className)}
    >
      {/* Header & Account Info */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Building2 className="size-3.5" />
                  <span>{accountName}</span>
                  <span>·</span>
                  <span>{accountTier}</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <Sparkles className="mr-1 size-3" />
                  {tierDiscountPercent}% Off MSRP Wholesale Tier
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                Wholesale & B2B Bulk Order Matrix
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                Build your purchase order by entering case quantities below or pasting bulk SKU manifests with automated
                case multipliers.
              </CardDescription>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                aria-label="Close CSV paste"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-medium"
                onClick={() => setShowCsvBox(!showCsvBox)}
              >
                <FileSpreadsheet className="size-3.5" />
                <span>{showCsvBox ? 'Hide CSV Paste' : 'Upload CSV Order'}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" onClick={handleSaveTemplate}>
                <Bookmark className="size-3.5" />
                <span>Save Order Template</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Account Terms & Partner Meta Strip */}
          <div className="bg-muted/40 border-border grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4 sm:gap-4">
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">PO Reference</div>
              <div className="font-mono text-sm font-semibold">{poRef}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Payment Terms</div>
              <div className="text-foreground flex items-center gap-1 text-sm font-semibold">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>{paymentTerms}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Freight Status</div>
              <div
                className={cn(
                  'text-sm font-semibold tabular-nums',
                  isFreeFreight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                )}
              >
                {isFreeFreight ? 'Free Ground Freight' : '$250 Standard Freight'}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Volume Tier Status</div>
              <div className="text-foreground text-sm font-semibold">
                Tier 3 <span className="text-muted-foreground font-normal">({tierDiscountPercent}% Margin)</span>
              </div>
            </div>
          </div>

          {/* Volume Tier Margin Incentive Banner */}
          <div className="border-border bg-card/60 mt-3 rounded-lg border p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="size-4 shrink-0 text-emerald-500" />
                <div className="text-xs">
                  <span className="text-foreground font-semibold">Tier 4 Milestone ($50,000):</span>
                  <span className="text-muted-foreground ml-1">
                    {nextTierRemaining > 0
                      ? `Add ${formatCurrency(nextTierRemaining)} more to unlock 42% Tier 4 Enterprise Margin.`
                      : 'Tier 4 Enterprise Margin (42%) Unlocked!'}
                  </span>
                </div>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>{tierProgressPercent}% to Tier 4</span>
                <div className="bg-muted border-border h-2 w-24 overflow-hidden rounded-full border">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${tierProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Saved Alert */}
      {templateSaved && (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 sm:text-sm dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Bookmark className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Order matrix saved as your primary template. You can re-populate this draft at any time.</span>
          </div>
          <Button
            variant="ghost"
            size="xs"
            className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            aria-label="Dismiss notification"
            onClick={() => setTemplateSaved(false)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Order Submitted Success Alert */}
      {orderSubmitted && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 sm:p-5 dark:text-emerald-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold sm:text-base">Purchase Order {poRef} Submitted Successfully!</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Your bulk order of{' '}
                  <strong className="text-foreground">
                    {totalCases} cases ({totalUnits} units)
                  </strong>{' '}
                  totaling <strong className="text-foreground">{formatCurrency(grandTotal)}</strong> has been queued for
                  warehouse dispatch under {paymentTerms}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleExportCsv}
              >
                <Download className="mr-1.5 size-3.5" />
                Download PO PDF
              </Button>
              <Button size="sm" className="text-xs" onClick={() => setOrderSubmitted(false)}>
                Start New Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick SKU & Quantity CSV Paste Box */}
      {showCsvBox && (
        <Card className="border-border bg-card shadow-xs transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-primary size-4" />
                <CardTitle className="text-sm font-semibold sm:text-base">
                  Quick Paste SKU & Quantity Manifest
                </CardTitle>
              </div>
              <Button
                aria-label="Close CSV paste"
                variant="ghost"
                size="xs"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowCsvBox(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <CardDescription className="text-muted-foreground text-xs">
              Paste CSV rows with SKU identifier and case quantity (one item per line, e.g.{' '}
              <code className="bg-muted rounded px-1 font-mono">SKU-84920, 10</code>) to auto-populate matrix.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Textarea
              value={csvPasteText}
              onValueChange={(val) => setCsvPasteText(val)}
              placeholder={'SKU-84920, 8\nSKU-49102, 5\nSKU-77215, 4\nSKU-10934, 12\nSKU-63821, 6'}
              rows={4}
              className="font-mono text-xs"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="text-xs font-medium" onClick={applyCsvPaste}>
                  <Upload className="mr-1.5 size-3.5" />
                  Apply SKU List to Matrix
                </Button>
                <Button variant="outline" size="sm" className="text-xs font-medium" onClick={loadSampleCsv}>
                  Load Sample Data
                </Button>
                {csvPasteText && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground text-xs"
                    onClick={() => setCsvPasteText('')}
                  >
                    Clear Input
                  </Button>
                )}
              </div>
              <div className="text-muted-foreground text-xs">Supports comma, tab, and semicolon delimited lines</div>
            </div>

            {/* Parse Feedback Alert */}
            {pasteFeedback && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-2.5 text-xs',
                  pasteFeedback.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-destructive/30 bg-destructive/10 text-destructive',
                )}
              >
                {pasteFeedback.type === 'success' ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="size-4 shrink-0" />
                )}
                <span>{pasteFeedback.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bulk SKU Matrix Table Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-border border-b pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Bulk SKU Order Matrix</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                {products.length} wholesale catalog items available with active case multipliers.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                className="text-muted-foreground text-xs"
                onClick={restoreDefaultCases}
              >
                <RefreshCw className="mr-1 size-3" />
                Reset Defaults
              </Button>
              <Button variant="outline" size="xs" className="text-muted-foreground text-xs" onClick={resetAllCases}>
                <Trash2 className="mr-1 size-3" />
                Zero All
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full max-w-[760px] min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-[300px] text-xs font-semibold">Product & SKU Identifier</TableHead>
                  <TableHead className="text-xs font-semibold">Case Multiplier</TableHead>
                  <TableHead className="text-xs font-semibold">Unit Price</TableHead>
                  <TableHead className="text-xs font-semibold">Case Quantity</TableHead>
                  <TableHead className="text-xs font-semibold">Availability</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Line Total</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow
                    key={product.id}
                    className={cn('transition-colors', product.cases > 0 && 'bg-primary/5 dark:bg-primary/5')}
                  >
                    {/* Product Thumbnail & Details */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="border-border bg-muted/40 size-12 shrink-0 rounded-lg border object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-foreground truncate text-sm font-medium">{product.name}</div>
                          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <span className="font-mono">{product.sku}</span>
                            <span>·</span>
                            <span className="truncate">{product.variant}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Case Pack Multiplier */}
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Package className="text-muted-foreground size-3.5" />
                        <span className="text-foreground font-mono text-xs font-medium tabular-nums">
                          {product.casePack} units / case
                        </span>
                      </div>
                    </TableCell>

                    {/* Pricing (MSRP vs Wholesale) */}
                    <TableCell className="py-3.5">
                      <div className="space-y-0.5">
                        <div className="text-foreground text-sm font-semibold tabular-nums">
                          {formatCurrency(product.wholesaleUnitPrice)}
                          <span className="text-muted-foreground text-xs font-normal"> wholesale</span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span className="tabular-nums line-through">
                            {formatCurrency(product.msrpUnitPrice)} MSRP
                          </span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            -
                            {Math.round(
                              ((product.msrpUnitPrice - product.wholesaleUnitPrice) / product.msrpUnitPrice) * 100,
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Quantity Stepper Input */}
                    <TableCell className="py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Button
                            aria-label="Decrease cases"
                            variant="outline"
                            size="xs"
                            className="size-7 p-0"
                            disabled={product.cases <= 0}
                            onClick={() => updateCases(product.id, -1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <Input
                            value={product.cases}
                            type="number"
                            min={0}
                            max={product.availableCases}
                            className="h-7 w-16 text-center font-mono text-xs tabular-nums"
                            onChange={(e) => setCases(product.id, e.target.value)}
                          />
                          <Button
                            aria-label="Increase cases"
                            variant="outline"
                            size="xs"
                            className="size-7 p-0"
                            disabled={product.cases >= product.availableCases}
                            onClick={() => updateCases(product.id, 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <div className="text-muted-foreground font-mono text-xs tabular-nums">
                          {product.cases} {product.cases === 1 ? 'case' : 'cases'} ={' '}
                          <strong className="text-foreground">{product.cases * product.casePack}</strong> units
                        </div>
                      </div>
                    </TableCell>

                    {/* Stock Status */}
                    <TableCell className="py-3.5">
                      {product.availableCases > 50 ? (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        >
                          In Stock · {formatNumber(product.availableCases)} cases
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400"
                        >
                          Low Stock · {product.availableCases} cases
                        </Badge>
                      )}
                    </TableCell>

                    {/* Line Total */}
                    <TableCell className="py-3.5 text-right">
                      <div className="space-y-0.5">
                        <div className="text-foreground font-mono text-sm font-bold tabular-nums">
                          {formatCurrency(product.cases * product.casePack * product.wholesaleUnitPrice)}
                        </div>
                        {product.cases > 0 ? (
                          <div className="font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400">
                            Save{' '}
                            {formatCurrency(
                              product.cases * product.casePack * (product.msrpUnitPrice - product.wholesaleUnitPrice),
                            )}
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-xs">0 units</div>
                        )}
                      </div>
                    </TableCell>

                    {/* Row Clear Action */}
                    <TableCell className="py-3.5 text-center">
                      {product.cases > 0 && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-muted-foreground hover:text-destructive size-7 p-0"
                          title="Clear row quantity"
                          onClick={() => clearLine(product.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Order Summary Footer */}
      <div className="bg-card/95 border-border sticky bottom-4 z-20 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Summary Totals Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
            {/* Total Units */}
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Total Units</div>
              <div className="font-mono text-base font-bold tabular-nums sm:text-lg">
                {formatNumber(totalUnits)} Units
              </div>
              <div className="text-muted-foreground font-mono text-xs tabular-nums">{totalCases} Cases ordered</div>
            </div>

            {/* Wholesale Subtotal */}
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Wholesale Subtotal</div>
              <div className="font-mono text-base font-bold tabular-nums sm:text-lg">
                {formatCurrency(wholesaleSubtotal)}
              </div>
              <div className="text-muted-foreground text-xs">MSRP {formatCurrency(msrpTotal)}</div>
            </div>

            {/* Tier Savings */}
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Tier Volume Savings</div>
              <div className="font-mono text-base font-bold text-emerald-600 tabular-nums sm:text-lg dark:text-emerald-400">
                -{formatCurrency(totalSavings)}
              </div>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {savingsPercent}% Margin Savings
              </div>
            </div>

            {/* Freight & Terms */}
            <div className="space-y-0.5">
              <div className="text-muted-foreground text-xs font-medium">Freight & Terms</div>
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Truck className="text-primary size-3.5 shrink-0" />
                <span>{isFreeFreight ? 'Free Freight (>$10k)' : '$250 Ground'}</span>
              </div>
              <div className="text-muted-foreground text-xs">{paymentTerms}</div>
            </div>
          </div>

          {/* Submit & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              className="text-xs font-medium"
              disabled={totalCases === 0}
              onClick={handleExportCsv}
            >
              <Download className="mr-1.5 size-3.5" />
              Export CSV
            </Button>

            <Button
              size="default"
              className="gap-2 text-xs font-semibold sm:text-sm"
              disabled={totalCases === 0 || isSubmitting}
              onClick={handleSubmitOrder}
            >
              {!isSubmitting ? <Send className="size-4" /> : <RefreshCw className="size-4 animate-spin" />}
              <span>{isSubmitting ? 'Processing PO...' : 'Submit Wholesale Purchase Order'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WholesaleB2bQuickOrder
