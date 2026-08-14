'use client'

import * as React from 'react'
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  Percent,
  Plus,
  Receipt,
  Save,
  Send,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface ClientPreset {
  id: string
  name: string
  company: string
  email: string
  address: string
}

export interface InvoiceCreatorWizardProps {
  className?: string
  initialInvoiceNumber?: string
  initialIssuerName?: string
  initialIssuerEmail?: string
  initialIssuerAddress?: string
  initialIssuerTaxId?: string
  initialClientName?: string
  initialClientCompany?: string
  initialClientEmail?: string
  initialClientAddress?: string
  initialInvoiceDate?: string
  initialDueDate?: string
  initialPaymentTerms?: string
  initialCurrency?: string
  initialItems?: InvoiceLineItem[]
  initialTaxRate?: number
  initialDiscountType?: 'fixed' | 'percent'
  initialDiscountValue?: number
  initialNotes?: string
  onSaveDraft?: (payload: Record<string, any>) => void
  onSendInvoice?: (payload: Record<string, any>) => void
  onPreviewPdf?: () => void
}

const CLIENT_PRESETS: ClientPreset[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins',
    company: 'Apex Digital Inc.',
    email: 'sarah.jenkins@apexdigital.com',
    address: '742 Evergreen Terrace, Springfield, OR 97477',
  },
  {
    id: 'c2',
    name: 'Marcus Vance',
    company: 'Northwind Global Corp.',
    email: 'marcus.vance@northwind.io',
    address: '452 Broadway, 8th Floor, New York, NY 10013',
  },
  {
    id: 'c3',
    name: 'Elena Rostova',
    company: 'Hyperion Robotics',
    email: 'elena@hyperion-robotics.ai',
    address: '10 Tech Parkway, Suite 300, Boston, MA 02115',
  },
]

const DEFAULT_LINE_ITEMS: InvoiceLineItem[] = [
  {
    id: 'item-1',
    description: 'Design System Architecture & Component Registry',
    quantity: 1,
    unitPrice: 3200,
  },
  {
    id: 'item-2',
    description: 'Frontend Implementation (Vue 3 + React Mirror)',
    quantity: 35,
    unitPrice: 120,
  },
  {
    id: 'item-3',
    description: 'Accessibility & WCAG AA Compliance Audit',
    quantity: 1,
    unitPrice: 850,
  },
]

const PAYMENT_TERMS_MAP: Record<string, string> = {
  receipt: 'Due on Receipt',
  net15: 'Net 15 (Due in 15 days)',
  net30: 'Net 30 (Due in 30 days)',
  net60: 'Net 60 (Due in 60 days)',
}

export function InvoiceCreatorWizard({
  className,
  initialInvoiceNumber = 'INV-2026-0042',
  initialIssuerName = 'Acme Design & Engineering Studio',
  initialIssuerEmail = 'billing@acmestudio.io',
  initialIssuerAddress = '100 Montgomery St, Suite 1400, San Francisco, CA 94104',
  initialIssuerTaxId = 'US-EIN-94-2819034',
  initialClientName = 'Sarah Jenkins',
  initialClientCompany = 'Apex Digital Inc.',
  initialClientEmail = 'sarah.jenkins@apexdigital.com',
  initialClientAddress = '742 Evergreen Terrace, Springfield, OR 97477',
  initialInvoiceDate = '2026-08-21',
  initialDueDate = '2026-09-20',
  initialPaymentTerms = 'net30',
  initialCurrency = 'USD',
  initialItems,
  initialTaxRate = 8.5,
  initialDiscountType = 'fixed',
  initialDiscountValue = 150,
  initialNotes = 'Thank you for your partnership! Please remit payment via wire transfer or online payment link within 30 days. Contact billing@acmestudio.io for any questions.',
  onSaveDraft,
  onSendInvoice,
  onPreviewPdf,
}: InvoiceCreatorWizardProps) {
  // Form State
  const [invoiceNumber] = React.useState(initialInvoiceNumber)
  const [issuerName, setIssuerName] = React.useState(initialIssuerName)
  const [issuerEmail, setIssuerEmail] = React.useState(initialIssuerEmail)
  const [issuerAddress, setIssuerAddress] = React.useState(initialIssuerAddress)
  const [issuerTaxId, setIssuerTaxId] = React.useState(initialIssuerTaxId)

  const [selectedPreset, setSelectedPreset] = React.useState('c1')
  const [clientName, setClientName] = React.useState(initialClientName)
  const [clientCompany, setClientCompany] = React.useState(initialClientCompany)
  const [clientEmail, setClientEmail] = React.useState(initialClientEmail)
  const [clientAddress, setClientAddress] = React.useState(initialClientAddress)

  const [invoiceDate, setInvoiceDate] = React.useState(initialInvoiceDate)
  const [dueDate, setDueDate] = React.useState(initialDueDate)
  const [paymentTerms, setPaymentTerms] = React.useState(initialPaymentTerms)
  const [currency, setCurrency] = React.useState(initialCurrency)

  const [items, setItems] = React.useState<InvoiceLineItem[]>(
    initialItems && initialItems.length > 0
      ? initialItems.map((i) => ({ ...i }))
      : DEFAULT_LINE_ITEMS.map((i) => ({ ...i })),
  )

  const [taxRate, setTaxRate] = React.useState(initialTaxRate)
  const [discountType, setDiscountType] = React.useState<'fixed' | 'percent'>(initialDiscountType)
  const [discountValue, setDiscountValue] = React.useState(initialDiscountValue)
  const [notes, setNotes] = React.useState(initialNotes)

  // Notification toast state
  const [notification, setNotification] = React.useState<{ type: 'success' | 'info'; message: string } | null>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const showNotification = React.useCallback((message: string, type: 'success' | 'info' = 'success') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setNotification({ message, type })
    timeoutRef.current = setTimeout(() => {
      setNotification(null)
    }, 4000)
  }, [])

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId)
    if (presetId === 'custom') return

    const preset = CLIENT_PRESETS.find((c) => c.id === presetId)
    if (preset) {
      setClientName(preset.name)
      setClientCompany(preset.company)
      setClientEmail(preset.email)
      setClientAddress(preset.address)
    }
  }

  const addLineItem = () => {
    const newId = `item-${Date.now()}`
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeLineItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Calculations
  const subtotal = React.useMemo(() => {
    return items.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0
      const price = Number(item.unitPrice) || 0
      return acc + qty * price
    }, 0)
  }, [items])

  const discountAmount = React.useMemo(() => {
    const val = Number(discountValue) || 0
    if (discountType === 'percent') {
      return subtotal * (val / 100)
    }
    return val
  }, [discountValue, discountType, subtotal])

  const effectiveDiscount = React.useMemo(() => {
    return Math.min(subtotal, Math.max(0, discountAmount))
  }, [subtotal, discountAmount])

  const taxableAmount = React.useMemo(() => {
    return Math.max(0, subtotal - effectiveDiscount)
  }, [subtotal, effectiveDiscount])

  const taxAmount = React.useMemo(() => {
    const rate = Number(taxRate) || 0
    return taxableAmount * (rate / 100)
  }, [taxableAmount, taxRate])

  const totalDue = React.useMemo(() => {
    return taxableAmount + taxAmount
  }, [taxableAmount, taxAmount])

  const formatCurrency = React.useCallback(
    (amount: number, curr: string = currency) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: curr,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount)
      } catch {
        const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'AU$' }
        const s = symbols[curr] || '$'
        return `${s}${amount.toFixed(2)}`
      }
    },
    [currency],
  )

  const formatDate = React.useCallback((dateStr: string) => {
    if (!dateStr) return '—'
    try {
      const [y, m, d] = dateStr.split('-').map(Number)
      if (!y || !m || !d) return dateStr
      const date = new Date(y, m - 1, d)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }, [])

  const getPayload = React.useCallback(() => {
    return {
      invoiceNumber,
      issuer: {
        name: issuerName,
        email: issuerEmail,
        address: issuerAddress,
        taxId: issuerTaxId,
      },
      client: {
        name: clientName,
        company: clientCompany,
        email: clientEmail,
        address: clientAddress,
      },
      dates: {
        issued: invoiceDate,
        due: dueDate,
        terms: paymentTerms,
      },
      currency,
      items,
      calculations: {
        subtotal,
        discount: effectiveDiscount,
        tax: taxAmount,
        total: totalDue,
      },
      notes,
    }
  }, [
    invoiceNumber,
    issuerName,
    issuerEmail,
    issuerAddress,
    issuerTaxId,
    clientName,
    clientCompany,
    clientEmail,
    clientAddress,
    invoiceDate,
    dueDate,
    paymentTerms,
    currency,
    items,
    subtotal,
    effectiveDiscount,
    taxAmount,
    totalDue,
    notes,
  ])

  const handleSaveDraft = () => {
    const payload = getPayload()
    onSaveDraft?.(payload)
    showNotification(`Draft invoice ${invoiceNumber} saved successfully.`, 'info')
  }

  const handleSendInvoice = () => {
    const payload = getPayload()
    onSendInvoice?.(payload)
    showNotification(`Invoice ${invoiceNumber} sent to ${clientEmail || 'client'}.`, 'success')
  }

  const handlePreviewPdf = () => {
    onPreviewPdf?.()
    showNotification(`Generating printable PDF preview for ${invoiceNumber}...`, 'info')
  }

  return (
    <div data-slot="invoice-creator-wizard" className={cn('mx-auto w-full max-w-7xl space-y-6', className)}>
      {/* Top Action Header */}
      <div className="border-border flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Create New Invoice</h1>
            <Badge wrap variant="outline" className="px-2 py-0.5 font-mono text-xs font-semibold">
              {invoiceNumber}
            </Badge>
            <Badge wrap variant="secondary" className="text-xs">
              Draft
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Build itemized invoices with live calculation, instant document preview, and client presets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePreviewPdf}>
            <FileText className="size-3.5" aria-hidden="true" />
            Preview PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleSaveDraft}>
            <Save className="size-3.5" aria-hidden="true" />
            Save Draft
          </Button>
          <Button size="sm" className="gap-1.5 text-xs font-medium" onClick={handleSendInvoice}>
            <Send className="size-3.5" aria-hidden="true" />
            Send Invoice
          </Button>
        </div>
      </div>

      {/* Notification Toast / Alert Banner */}
      {notification && (
        <div
          className={cn(
            'flex flex-wrap items-center justify-between rounded-lg border px-4 py-2.5 text-xs transition-all sm:text-sm',
            notification.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-primary/30 bg-primary/10 text-primary',
          )}
          role="status"
        >
          <div className="flex flex-wrap items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            className="min-h-6 text-xs font-semibold underline-offset-2 opacity-80 hover:underline hover:opacity-100"
            onClick={() => setNotification(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2-Column Invoice Builder Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Form Builder */}
        <div className="space-y-6 lg:col-span-7">
          {/* Section 1: Business & Client Details */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Building2 className="text-primary size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Business & Client Details</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Configure your issuing entity information and bill-to client contact.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Issuer Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    From (Issuer)
                  </span>
                  <span className="text-muted-foreground font-mono text-xs">ID: {invoiceNumber}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="issuer-name" className="text-foreground text-xs font-medium">
                      Business / Organization Name
                    </label>
                    <Input
                      id="issuer-name"
                      value={issuerName}
                      onChange={(e) => setIssuerName(e.target.value)}
                      placeholder="Business name"
                      size="small"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="issuer-email" className="text-foreground text-xs font-medium">
                      Billing Email
                    </label>
                    <Input
                      id="issuer-email"
                      type="email"
                      value={issuerEmail}
                      onChange={(e) => setIssuerEmail(e.target.value)}
                      placeholder="billing@company.com"
                      size="small"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="issuer-tax" className="text-foreground text-xs font-medium">
                      Tax ID / VAT Registration
                    </label>
                    <Input
                      id="issuer-tax"
                      value={issuerTaxId}
                      onChange={(e) => setIssuerTaxId(e.target.value)}
                      placeholder="Tax ID / EIN"
                      size="small"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="issuer-address" className="text-foreground text-xs font-medium">
                      Business Address
                    </label>
                    <Input
                      id="issuer-address"
                      value={issuerAddress}
                      onChange={(e) => setIssuerAddress(e.target.value)}
                      placeholder="Street, City, State, ZIP"
                      size="small"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Client Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Bill To (Client)
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs">Quick Preset:</span>
                    <div className="w-48">
                      <Select value={selectedPreset} onValueChange={handlePresetChange}>
                        <SelectTrigger size="sm" className="h-7 text-xs">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {CLIENT_PRESETS.map((preset) => (
                            <SelectItem key={preset.id} value={preset.id}>
                              {preset.company}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Custom Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="client-name" className="text-foreground text-xs font-medium">
                      Contact Name
                    </label>
                    <Input
                      id="client-name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Client contact name"
                      size="small"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="client-company" className="text-foreground text-xs font-medium">
                      Company Name
                    </label>
                    <Input
                      id="client-company"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="Client company name"
                      size="small"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="client-email" className="text-foreground text-xs font-medium">
                      Client Email
                    </label>
                    <Input
                      id="client-email"
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@company.com"
                      size="small"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="client-address" className="text-foreground text-xs font-medium">
                      Client Address
                    </label>
                    <Input
                      id="client-address"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Street, City, Postal Code"
                      size="small"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice Timing & Currency */}
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label htmlFor="invoice-date" className="text-foreground text-xs font-medium">
                    Invoice Date
                  </label>
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="due-date" className="text-foreground text-xs font-medium">
                    Due Date
                  </label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    size="small"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="payment-terms" className="text-foreground text-xs font-medium">
                    Payment Terms
                  </label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger id="payment-terms" size="sm" className="h-8 text-xs">
                      <SelectValue placeholder="Terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receipt">Due on Receipt</SelectItem>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="currency-select" className="text-foreground text-xs font-medium">
                    Currency
                  </label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency-select" size="sm" className="h-8 text-xs">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Interactive Line Items */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Receipt className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Line Items</CardTitle>
                </div>
                <Badge wrap variant="secondary" className="font-mono text-xs tabular-nums">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Itemize deliverables, billable hours, software licenses, or custom services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-border text-muted-foreground border-b">
                      <th className="pb-2 font-medium">Description</th>
                      <th className="w-20 pb-2 text-right font-medium">Qty</th>
                      <th className="w-28 pb-2 text-right font-medium">Unit Price</th>
                      <th className="w-24 pb-2 text-right font-medium">Line Total</th>
                      <th className="w-10 pb-2 text-center font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-2.5 pr-2">
                          <Input
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            placeholder="Service or product description..."
                            size="small"
                            className="w-full"
                          />
                        </td>
                        <td className="px-2 py-2.5">
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                            size="small"
                            className="w-20 text-right tabular-nums"
                          />
                        </td>
                        <td className="px-2 py-2.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                            size="small"
                            className="w-28 text-right tabular-nums"
                          />
                        </td>
                        <td className="text-foreground py-2.5 pl-2 text-right font-medium whitespace-nowrap tabular-nums">
                          {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                        </td>
                        <td className="py-2.5 pl-1 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive size-7 transition-colors disabled:opacity-30"
                            disabled={items.length <= 1}
                            aria-label="Remove item"
                            onClick={() => removeLineItem(item.id)}
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2">
                <Button type="button" variant="outline" size="sm" className="gap-1 text-xs" onClick={addLineItem}>
                  <Plus className="size-3.5" aria-hidden="true" />
                  Add Line Item
                </Button>
                <div className="text-muted-foreground text-xs">
                  Subtotal:{' '}
                  <span className="text-foreground font-semibold tabular-nums">{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Adjustments & Payment Terms */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Percent className="text-primary size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Adjustments & Notes</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Itemize tax rates, discount subtractions, and client payment instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Tax percentage */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between">
                    <label htmlFor="tax-rate" className="text-foreground text-xs font-medium">
                      Tax Rate (%)
                    </label>
                    <span className="text-muted-foreground text-xs tabular-nums">+{formatCurrency(taxAmount)}</span>
                  </div>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    placeholder="8.5"
                    size="small"
                  />
                </div>

                {/* Discount */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between">
                    <label htmlFor="discount-val" className="text-foreground text-xs font-medium">
                      Discount
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className={cn(
                          'min-h-6 rounded px-1.5 py-0.5 text-xs font-medium transition-colors',
                          discountType === 'fixed'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => setDiscountType('fixed')}
                      >
                        Fixed ($)
                      </button>
                      <button
                        type="button"
                        className={cn(
                          'min-h-6 rounded px-1.5 py-0.5 text-xs font-medium transition-colors',
                          discountType === 'percent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => setDiscountType('percent')}
                      >
                        Percent (%)
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      id="discount-val"
                      type="number"
                      min="0"
                      step="1"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder="0"
                      size="small"
                      className="w-full"
                    />
                    <span className="text-xs font-medium whitespace-nowrap text-emerald-600 tabular-nums dark:text-emerald-400">
                      -{formatCurrency(effectiveDiscount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes / Terms */}
              <div className="space-y-1.5">
                <label htmlFor="invoice-notes" className="text-foreground text-xs font-medium">
                  Notes & Terms for Client
                </label>
                <Textarea
                  id="invoice-notes"
                  value={notes}
                  onValueChange={setNotes}
                  rows={3}
                  placeholder="Payment instructions, bank wire info, or a personal thank you note..."
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Paper Document Preview */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between px-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <Eye className="size-3.5" aria-hidden="true" />
                Live Document Preview
              </span>
            </div>
            <span className="text-muted-foreground font-mono text-xs">Printable A4</span>
          </div>

          {/* Paper Invoice Card */}
          <div className="bg-card text-card-foreground border-border/80 relative space-y-6 overflow-hidden rounded-xl border p-6 shadow-md transition-all sm:p-7">
            {/* Document Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded border text-xs font-bold">
                    AS
                  </div>
                  <div className="text-foreground text-sm leading-tight font-bold sm:text-base">
                    {issuerName || 'Business Name'}
                  </div>
                </div>
                <p className="text-muted-foreground max-w-[200px] text-xs leading-relaxed">
                  {issuerAddress || 'Address not set'}
                </p>
                <p className="text-muted-foreground font-mono text-xs">{issuerEmail || 'billing@domain.com'}</p>
                {issuerTaxId && <p className="text-muted-foreground/80 font-mono text-xs">Tax: {issuerTaxId}</p>}
              </div>

              <div className="shrink-0 space-y-1 text-right">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">Invoice</span>
                <div className="text-foreground font-mono text-xs font-bold sm:text-sm">{invoiceNumber}</div>
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  Ready to Send
                </Badge>
              </div>
            </div>

            <Separator className="opacity-60" />

            {/* Invoice Details: Bill To & Dates */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Billed To</span>
                <p className="text-foreground font-semibold">{clientName || 'Client Name'}</p>
                {clientCompany && <p className="text-muted-foreground font-medium">{clientCompany}</p>}
                <p className="text-muted-foreground leading-relaxed">{clientAddress || 'No address provided'}</p>
                <p className="text-muted-foreground font-mono">{clientEmail || 'client@email.com'}</p>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Invoice Details
                </span>
                <div className="space-y-0.5">
                  <div className="text-muted-foreground flex justify-between gap-2 sm:justify-end">
                    <span>Issued:</span>
                    <span className="text-foreground font-medium tabular-nums">{formatDate(invoiceDate)}</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between gap-2 sm:justify-end">
                    <span>Due:</span>
                    <span className="text-foreground font-medium tabular-nums">{formatDate(dueDate)}</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between gap-2 sm:justify-end">
                    <span>Terms:</span>
                    <span className="text-foreground font-medium">
                      {PAYMENT_TERMS_MAP[paymentTerms] || paymentTerms}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="opacity-60" />

            {/* Line Items Table */}
            <div className="space-y-2">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-border/80 text-muted-foreground border-b font-medium">
                      <th className="pb-2 text-left">Item & Description</th>
                      <th className="w-12 pb-2 text-center">Qty</th>
                      <th className="w-16 pb-2 text-right">Rate</th>
                      <th className="w-20 pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/40 divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="text-foreground">
                        <td className="py-2 pr-2">
                          <p className="leading-snug font-medium">{item.description || 'Custom Deliverable'}</p>
                        </td>
                        <td className="text-muted-foreground px-1 py-2 text-center tabular-nums">{item.quantity}</td>
                        <td className="text-muted-foreground px-1 py-2 text-right tabular-nums">
                          {formatCurrency(Number(item.unitPrice) || 0)}
                        </td>
                        <td className="py-2 pl-2 text-right font-medium tabular-nums">
                          {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Separator className="opacity-60" />

            {/* Calculations Summary */}
            <div className="space-y-2 text-xs">
              <div className="text-muted-foreground flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground font-medium tabular-nums">{formatCurrency(subtotal)}</span>
              </div>

              {effectiveDiscount > 0 && (
                <div className="flex justify-between font-medium text-emerald-600 dark:text-emerald-400">
                  <span>Discount {discountType === 'percent' ? `(${discountValue}%)` : ''}</span>
                  <span className="tabular-nums">-{formatCurrency(effectiveDiscount)}</span>
                </div>
              )}

              {taxRate > 0 && (
                <div className="text-muted-foreground flex justify-between">
                  <span>Tax ({taxRate}%)</span>
                  <span className="text-foreground font-medium tabular-nums">+{formatCurrency(taxAmount)}</span>
                </div>
              )}

              <Separator className="my-1.5 opacity-80" />

              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 pt-1">
                <span className="text-foreground text-sm font-bold">Total Due</span>
                <span className="text-foreground text-lg font-bold tabular-nums sm:text-xl">
                  {formatCurrency(totalDue)}
                </span>
              </div>
            </div>

            {/* Notes / Payment Info Callout */}
            <div className="bg-muted/50 border-border/70 space-y-2 rounded-lg border p-3.5 text-xs">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <CreditCard className="text-primary size-3.5" aria-hidden="true" />
                <span>Payment Instructions</span>
              </div>
              {notes && <p className="text-muted-foreground leading-relaxed">{notes}</p>}
              <div className="border-border/50 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-1.5 font-mono text-xs">
                <span>ACH / Wire: **** 9104</span>
                <span>Routing: **** 4892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
