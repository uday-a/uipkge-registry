<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Percent,
  Plus,
  Printer,
  Receipt,
  Save,
  Send,
  Sparkles,
  Trash2,
  User,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

interface Props {
  class?: HTMLAttributes['class']
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
}

const props = withDefaults(defineProps<Props>(), {
  initialInvoiceNumber: 'INV-2026-0042',
  initialIssuerName: 'Acme Design & Engineering Studio',
  initialIssuerEmail: 'billing@acmestudio.io',
  initialIssuerAddress: '100 Montgomery St, Suite 1400, San Francisco, CA 94104',
  initialIssuerTaxId: 'US-EIN-94-2819034',
  initialClientName: 'Sarah Jenkins',
  initialClientCompany: 'Apex Digital Inc.',
  initialClientEmail: 'sarah.jenkins@apexdigital.com',
  initialClientAddress: '742 Evergreen Terrace, Springfield, OR 97477',
  initialInvoiceDate: '2026-08-21',
  initialDueDate: '2026-09-20',
  initialPaymentTerms: 'net30',
  initialCurrency: 'USD',
  initialTaxRate: 8.5,
  initialDiscountType: 'fixed',
  initialDiscountValue: 150,
  initialNotes:
    'Thank you for your partnership! Please remit payment via wire transfer or online payment link within 30 days. Contact billing@acmestudio.io for any questions.',
})

const emits = defineEmits<{
  (e: 'save-draft', payload: Record<string, any>): void
  (e: 'send-invoice', payload: Record<string, any>): void
  (e: 'preview-pdf'): void
}>()

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

// Form State
const invoiceNumber = ref(props.initialInvoiceNumber)
const issuerName = ref(props.initialIssuerName)
const issuerEmail = ref(props.initialIssuerEmail)
const issuerAddress = ref(props.initialIssuerAddress)
const issuerTaxId = ref(props.initialIssuerTaxId)

const selectedPreset = ref('c1')
const clientName = ref(props.initialClientName)
const clientCompany = ref(props.initialClientCompany)
const clientEmail = ref(props.initialClientEmail)
const clientAddress = ref(props.initialClientAddress)

const invoiceDate = ref(props.initialInvoiceDate)
const dueDate = ref(props.initialDueDate)
const paymentTerms = ref(props.initialPaymentTerms)
const currency = ref(props.initialCurrency)

const items = ref<InvoiceLineItem[]>(
  props.initialItems && props.initialItems.length > 0
    ? props.initialItems.map((i) => ({ ...i }))
    : DEFAULT_LINE_ITEMS.map((i) => ({ ...i })),
)

const taxRate = ref(props.initialTaxRate)
const discountType = ref<'fixed' | 'percent'>(props.initialDiscountType)
const discountValue = ref(props.initialDiscountValue)
const notes = ref(props.initialNotes)

// Notification banner state
const notification = ref<{ type: 'success' | 'info'; message: string } | null>(null)
let notifTimeout: ReturnType<typeof setTimeout> | null = null

function showNotification(message: string, type: 'success' | 'info' = 'success') {
  if (notifTimeout) clearTimeout(notifTimeout)
  notification.value = { message, type }
  notifTimeout = setTimeout(() => {
    notification.value = null
  }, 4000)
}

function handlePresetChange(presetId: unknown) {
  const id = String(presetId)
  selectedPreset.value = id
  if (id === 'custom') return

  const preset = CLIENT_PRESETS.find((c) => c.id === id)
  if (preset) {
    clientName.value = preset.name
    clientCompany.value = preset.company
    clientEmail.value = preset.email
    clientAddress.value = preset.address
  }
}

function addLineItem() {
  const newId = `item-${Date.now()}`
  items.value.push({
    id: newId,
    description: '',
    quantity: 1,
    unitPrice: 0,
  })
}

function removeLineItem(id: string) {
  if (items.value.length > 1) {
    items.value = items.value.filter((i) => i.id !== id)
  }
}

// Computations
const subtotal = computed(() => {
  return items.value.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unitPrice) || 0
    return acc + qty * price
  }, 0)
})

const discountAmount = computed(() => {
  const val = Number(discountValue.value) || 0
  if (discountType.value === 'percent') {
    return subtotal.value * (val / 100)
  }
  return val
})

const effectiveDiscount = computed(() => {
  return Math.min(subtotal.value, Math.max(0, discountAmount.value))
})

const taxableAmount = computed(() => {
  return Math.max(0, subtotal.value - effectiveDiscount.value)
})

const taxAmount = computed(() => {
  const rate = Number(taxRate.value) || 0
  return taxableAmount.value * (rate / 100)
})

const totalDue = computed(() => {
  return taxableAmount.value + taxAmount.value
})

function formatCurrency(amount: number, curr: string = currency.value) {
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
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  try {
    const [y, m, d] = dateStr.split('-').map(Number)
    if (!y || !m || !d) return dateStr
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function getPayload() {
  return {
    invoiceNumber: invoiceNumber.value,
    issuer: {
      name: issuerName.value,
      email: issuerEmail.value,
      address: issuerAddress.value,
      taxId: issuerTaxId.value,
    },
    client: {
      name: clientName.value,
      company: clientCompany.value,
      email: clientEmail.value,
      address: clientAddress.value,
    },
    dates: {
      issued: invoiceDate.value,
      due: dueDate.value,
      terms: paymentTerms.value,
    },
    currency: currency.value,
    items: items.value,
    calculations: {
      subtotal: subtotal.value,
      discount: effectiveDiscount.value,
      tax: taxAmount.value,
      total: totalDue.value,
    },
    notes: notes.value,
  }
}

function handleSaveDraft() {
  const payload = getPayload()
  emits('save-draft', payload)
  showNotification(`Draft invoice ${invoiceNumber.value} saved successfully.`, 'info')
}

function handleSendInvoice() {
  const payload = getPayload()
  emits('send-invoice', payload)
  showNotification(`Invoice ${invoiceNumber.value} sent to ${clientEmail.value || 'client'}.`, 'success')
}

function handlePreviewPdf() {
  emits('preview-pdf')
  showNotification(`Generating printable PDF preview for ${invoiceNumber.value}...`, 'info')
}
</script>

<template>
  <div data-slot="invoice-creator-wizard" :class="cn('mx-auto w-full max-w-7xl space-y-6', props.class)">
    <!-- Top Action Header -->
    <div class="border-border flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-3">
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Create New Invoice</h1>
          <Badge wrap variant="outline" class="px-2 py-0.5 font-mono text-xs font-semibold">
            {{ invoiceNumber }}
          </Badge>
          <Badge wrap variant="secondary" class="text-xs">Draft</Badge>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Build itemized invoices with live calculation, instant document preview, and client presets.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="handlePreviewPdf">
          <FileText class="size-3.5" aria-hidden="true" />
          Preview PDF
        </Button>
        <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="handleSaveDraft">
          <Save class="size-3.5" aria-hidden="true" />
          Save Draft
        </Button>
        <Button size="sm" class="gap-1.5 text-xs font-medium" @click="handleSendInvoice">
          <Send class="size-3.5" aria-hidden="true" />
          Send Invoice
        </Button>
      </div>
    </div>

    <!-- Notification Toast / Alert Banner -->
    <div
      v-if="notification"
      :class="
        cn(
          'flex flex-wrap items-center justify-between rounded-lg border px-4 py-2.5 text-xs transition-all sm:text-sm',
          notification.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'border-primary/30 bg-primary/10 text-primary',
        )
      "
      role="status"
    >
      <div class="flex flex-wrap items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0" aria-hidden="true" />
        <span>{{ notification.message }}</span>
      </div>
      <button
        type="button"
        class="min-h-6 text-xs font-semibold underline-offset-2 opacity-80 hover:underline hover:opacity-100"
        @click="notification = null"
      >
        Dismiss
      </button>
    </div>

    <!-- 2-Column Invoice Builder Layout -->
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <!-- Left Column: Form Builder -->
      <div class="space-y-6 lg:col-span-7">
        <!-- Section 1: Business & Client Details -->
        <Card>
          <CardHeader class="pb-4">
            <div class="flex flex-wrap items-center gap-2">
              <Building2 class="text-primary size-4" aria-hidden="true" />
              <CardTitle class="text-base font-semibold">Business & Client Details</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Configure your issuing entity information and bill-to client contact.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-5">
            <!-- Issuer Details -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">From (Issuer)</span>
                <span class="text-muted-foreground font-mono text-xs">ID: {{ invoiceNumber }}</span>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="space-y-1.5 sm:col-span-2">
                  <label for="issuer-name" class="text-foreground text-xs font-medium"
                    >Business / Organization Name</label
                  >
                  <Input id="issuer-name" v-model="issuerName" placeholder="Business name" size="small" />
                </div>
                <div class="space-y-1.5">
                  <label for="issuer-email" class="text-foreground text-xs font-medium">Billing Email</label>
                  <Input
                    id="issuer-email"
                    v-model="issuerEmail"
                    type="email"
                    placeholder="billing@company.com"
                    size="small"
                  />
                </div>
                <div class="space-y-1.5">
                  <label for="issuer-tax" class="text-foreground text-xs font-medium">Tax ID / VAT Registration</label>
                  <Input id="issuer-tax" v-model="issuerTaxId" placeholder="Tax ID / EIN" size="small" />
                </div>
                <div class="space-y-1.5 sm:col-span-2">
                  <label for="issuer-address" class="text-foreground text-xs font-medium">Business Address</label>
                  <Input
                    id="issuer-address"
                    v-model="issuerAddress"
                    placeholder="Street, City, State, ZIP"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <!-- Client Details -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                  >Bill To (Client)</span
                >
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-muted-foreground text-xs">Quick Preset:</span>
                  <div class="w-48">
                    <Select :model-value="selectedPreset" @update:model-value="handlePresetChange">
                      <SelectTrigger size="sm" class="h-7 text-xs">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="preset in CLIENT_PRESETS" :key="preset.id" :value="preset.id">
                          {{ preset.company }}
                        </SelectItem>
                        <SelectItem value="custom">Custom Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="space-y-1.5">
                  <label for="client-name" class="text-foreground text-xs font-medium">Contact Name</label>
                  <Input id="client-name" v-model="clientName" placeholder="Client contact name" size="small" />
                </div>
                <div class="space-y-1.5">
                  <label for="client-company" class="text-foreground text-xs font-medium">Company Name</label>
                  <Input id="client-company" v-model="clientCompany" placeholder="Client company name" size="small" />
                </div>
                <div class="space-y-1.5">
                  <label for="client-email" class="text-foreground text-xs font-medium">Client Email</label>
                  <Input
                    id="client-email"
                    v-model="clientEmail"
                    type="email"
                    placeholder="client@company.com"
                    size="small"
                  />
                </div>
                <div class="space-y-1.5">
                  <label for="client-address" class="text-foreground text-xs font-medium">Client Address</label>
                  <Input
                    id="client-address"
                    v-model="clientAddress"
                    placeholder="Street, City, Postal Code"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <!-- Invoice Timing & Currency -->
            <div class="grid gap-3 sm:grid-cols-4">
              <div class="space-y-1.5">
                <label for="invoice-date" class="text-foreground text-xs font-medium">Invoice Date</label>
                <Input id="invoice-date" v-model="invoiceDate" type="date" size="small" />
              </div>
              <div class="space-y-1.5">
                <label for="due-date" class="text-foreground text-xs font-medium">Due Date</label>
                <Input id="due-date" v-model="dueDate" type="date" size="small" />
              </div>
              <div class="space-y-1.5">
                <label for="payment-terms" class="text-foreground text-xs font-medium">Payment Terms</label>
                <Select v-model="paymentTerms">
                  <SelectTrigger id="payment-terms" size="sm" class="h-8 text-xs">
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
              <div class="space-y-1.5">
                <label for="currency-select" class="text-foreground text-xs font-medium">Currency</label>
                <Select v-model="currency">
                  <SelectTrigger id="currency-select" size="sm" class="h-8 text-xs">
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

        <!-- Section 2: Interactive Line Items -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <Receipt class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Line Items</CardTitle>
              </div>
              <Badge wrap variant="secondary" class="font-mono text-xs tabular-nums">
                {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Itemize deliverables, billable hours, software licenses, or custom services.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-border text-muted-foreground border-b">
                    <th class="pb-2 font-medium">Description</th>
                    <th class="w-20 pb-2 text-right font-medium">Qty</th>
                    <th class="w-28 pb-2 text-right font-medium">Unit Price</th>
                    <th class="w-24 pb-2 text-right font-medium">Line Total</th>
                    <th class="w-10 pb-2 text-center font-medium"></th>
                  </tr>
                </thead>
                <tbody class="divide-border/60 divide-y">
                  <tr v-for="item in items" :key="item.id" class="group">
                    <td class="py-2.5 pr-2">
                      <Input
                        v-model="item.description"
                        placeholder="Service or product description..."
                        size="small"
                        class="w-full"
                      />
                    </td>
                    <td class="px-2 py-2.5">
                      <Input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        step="1"
                        size="small"
                        class="w-20 text-right tabular-nums"
                      />
                    </td>
                    <td class="px-2 py-2.5">
                      <Input
                        v-model.number="item.unitPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        size="small"
                        class="w-28 text-right tabular-nums"
                      />
                    </td>
                    <td class="text-foreground py-2.5 pl-2 text-right font-medium whitespace-nowrap tabular-nums">
                      {{ formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)) }}
                    </td>
                    <td class="py-2.5 pl-1 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="text-muted-foreground hover:text-destructive size-7 transition-colors disabled:opacity-30"
                        :disabled="items.length <= 1"
                        aria-label="Remove item"
                        @click="removeLineItem(item.id)"
                      >
                        <Trash2 class="size-3.5" aria-hidden="true" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex flex-wrap items-center justify-between pt-2">
              <Button type="button" variant="outline" size="sm" class="gap-1 text-xs" @click="addLineItem">
                <Plus class="size-3.5" aria-hidden="true" />
                Add Line Item
              </Button>
              <div class="text-muted-foreground text-xs">
                Subtotal: <span class="text-foreground font-semibold tabular-nums">{{ formatCurrency(subtotal) }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Section 3: Adjustments & Payment Terms -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center gap-2">
              <Percent class="text-primary size-4" aria-hidden="true" />
              <CardTitle class="text-base font-semibold">Adjustments & Notes</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Itemize tax rates, discount subtractions, and client payment instructions.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Tax percentage -->
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center justify-between">
                  <label for="tax-rate" class="text-foreground text-xs font-medium">Tax Rate (%)</label>
                  <span class="text-muted-foreground text-xs tabular-nums">+{{ formatCurrency(taxAmount) }}</span>
                </div>
                <Input
                  id="tax-rate"
                  v-model.number="taxRate"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="8.5"
                  size="small"
                />
              </div>

              <!-- Discount -->
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center justify-between">
                  <label for="discount-val" class="text-foreground text-xs font-medium">Discount</label>
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      :class="
                        cn(
                          'min-h-6 rounded px-1.5 py-0.5 text-xs font-medium transition-colors',
                          discountType === 'fixed'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground',
                        )
                      "
                      @click="discountType = 'fixed'"
                    >
                      Fixed ($)
                    </button>
                    <button
                      type="button"
                      :class="
                        cn(
                          'min-h-6 rounded px-1.5 py-0.5 text-xs font-medium transition-colors',
                          discountType === 'percent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground',
                        )
                      "
                      @click="discountType = 'percent'"
                    >
                      Percent (%)
                    </button>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <Input
                    id="discount-val"
                    v-model.number="discountValue"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    size="small"
                    class="w-full"
                  />
                  <span
                    class="text-xs font-medium whitespace-nowrap text-emerald-600 tabular-nums dark:text-emerald-400"
                  >
                    -{{ formatCurrency(effectiveDiscount) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Notes / Terms -->
            <div class="space-y-1.5">
              <label for="invoice-notes" class="text-foreground text-xs font-medium">Notes & Terms for Client</label>
              <Textarea
                id="invoice-notes"
                v-model="notes"
                :rows="3"
                placeholder="Payment instructions, bank wire info, or a personal thank you note..."
                class="text-xs"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Live Paper Document Preview -->
      <div class="space-y-4 lg:sticky lg:top-6 lg:col-span-5">
        <div class="flex flex-wrap items-center justify-between px-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="relative flex size-2">
              <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <span class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
              <Eye class="size-3.5" aria-hidden="true" />
              Live Document Preview
            </span>
          </div>
          <span class="text-muted-foreground font-mono text-xs">Printable A4</span>
        </div>

        <!-- Paper Invoice Card -->
        <div
          class="bg-card text-card-foreground border-border/80 relative space-y-6 overflow-hidden rounded-xl border p-6 shadow-md transition-all sm:p-7"
        >
          <!-- Document Header -->
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <div
                  class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded border text-xs font-bold"
                >
                  AS
                </div>
                <div class="text-foreground text-sm leading-tight font-bold sm:text-base">
                  {{ issuerName || 'Business Name' }}
                </div>
              </div>
              <p class="text-muted-foreground max-w-[200px] text-xs leading-relaxed">
                {{ issuerAddress || 'Address not set' }}
              </p>
              <p class="text-muted-foreground font-mono text-xs">
                {{ issuerEmail || 'billing@domain.com' }}
              </p>
              <p v-if="issuerTaxId" class="text-muted-foreground/80 font-mono text-xs">Tax: {{ issuerTaxId }}</p>
            </div>

            <div class="shrink-0 space-y-1 text-right">
              <span class="text-muted-foreground text-xs font-bold tracking-wider uppercase">Invoice</span>
              <div class="text-foreground font-mono text-xs font-bold sm:text-sm">
                {{ invoiceNumber }}
              </div>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                Ready to Send
              </Badge>
            </div>
          </div>

          <Separator class="opacity-60" />

          <!-- Invoice Details: Bill To & Dates -->
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Billed To</span>
              <p class="text-foreground font-semibold">{{ clientName || 'Client Name' }}</p>
              <p v-if="clientCompany" class="text-muted-foreground font-medium">{{ clientCompany }}</p>
              <p class="text-muted-foreground leading-relaxed">{{ clientAddress || 'No address provided' }}</p>
              <p class="text-muted-foreground font-mono">{{ clientEmail || 'client@email.com' }}</p>
            </div>

            <div class="space-y-1 text-right">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Invoice Details</span>
              <div class="space-y-0.5">
                <div class="text-muted-foreground flex justify-between gap-2 sm:justify-end">
                  <span>Issued:</span>
                  <span class="text-foreground font-medium tabular-nums">{{ formatDate(invoiceDate) }}</span>
                </div>
                <div class="text-muted-foreground flex justify-between gap-2 sm:justify-end">
                  <span>Due:</span>
                  <span class="text-foreground font-medium tabular-nums">{{ formatDate(dueDate) }}</span>
                </div>
                <div class="text-muted-foreground flex justify-between gap-2 sm:justify-end">
                  <span>Terms:</span>
                  <span class="text-foreground font-medium">{{ PAYMENT_TERMS_MAP[paymentTerms] || paymentTerms }}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator class="opacity-60" />

          <!-- Line Items Table -->
          <div class="space-y-2">
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-border/80 text-muted-foreground border-b font-medium">
                    <th class="pb-2 text-left">Item & Description</th>
                    <th class="w-12 pb-2 text-center">Qty</th>
                    <th class="w-16 pb-2 text-right">Rate</th>
                    <th class="w-20 pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-border/40 divide-y">
                  <tr v-for="item in items" :key="item.id" class="text-foreground">
                    <td class="py-2 pr-2">
                      <p class="leading-snug font-medium">{{ item.description || 'Custom Deliverable' }}</p>
                    </td>
                    <td class="text-muted-foreground px-1 py-2 text-center tabular-nums">
                      {{ item.quantity }}
                    </td>
                    <td class="text-muted-foreground px-1 py-2 text-right tabular-nums">
                      {{ formatCurrency(Number(item.unitPrice) || 0) }}
                    </td>
                    <td class="py-2 pl-2 text-right font-medium tabular-nums">
                      {{ formatCurrency((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator class="opacity-60" />

          <!-- Calculations Summary -->
          <div class="space-y-2 text-xs">
            <div class="text-muted-foreground flex justify-between">
              <span>Subtotal</span>
              <span class="text-foreground font-medium tabular-nums">{{ formatCurrency(subtotal) }}</span>
            </div>

            <div
              v-if="effectiveDiscount > 0"
              class="flex justify-between font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span>
                Discount
                <template v-if="discountType === 'percent'">({{ discountValue }}%)</template>
              </span>
              <span class="tabular-nums">-{{ formatCurrency(effectiveDiscount) }}</span>
            </div>

            <div v-if="taxRate > 0" class="text-muted-foreground flex justify-between">
              <span>Tax ({{ taxRate }}%)</span>
              <span class="text-foreground font-medium tabular-nums">+{{ formatCurrency(taxAmount) }}</span>
            </div>

            <Separator class="my-1.5 opacity-80" />

            <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 pt-1">
              <span class="text-foreground text-sm font-bold">Total Due</span>
              <span class="text-foreground text-lg font-bold tabular-nums">{{ formatCurrency(totalDue) }}</span>
            </div>
          </div>

          <!-- Notes / Payment Info Callout -->
          <div class="bg-muted/50 border-border/70 space-y-2 rounded-lg border p-3.5 text-xs">
            <div class="text-foreground flex items-center gap-1.5 font-medium">
              <CreditCard class="text-primary size-3.5" aria-hidden="true" />
              <span>Payment Instructions</span>
            </div>
            <p v-if="notes" class="text-muted-foreground leading-relaxed">
              {{ notes }}
            </p>
            <div
              class="border-border/50 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-1.5 font-mono text-xs"
            >
              <span>ACH / Wire: **** 9104</span>
              <span>Routing: **** 4892</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
