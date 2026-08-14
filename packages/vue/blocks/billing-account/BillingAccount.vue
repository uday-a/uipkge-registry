<script setup lang="ts">
import { CreditCard, Download, Trash2 } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface UsageMetric {
  label: string
  used: number
  total: number
}

interface Invoice {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Open' | 'Past due'
}

const plan = {
  name: 'Pro',
  price: '$49',
  cadence: 'month',
  renewalDate: 'September 12, 2026',
}

const usage: UsageMetric[] = [
  { label: 'Seats', used: 18, total: 20 },
  { label: 'Projects', used: 7, total: 10 },
]

const paymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expiry: '04/28',
}

const invoices: Invoice[] = [
  { id: 'inv-2026-08', date: 'Aug 12, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'inv-2026-07', date: 'Jul 12, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'inv-2026-06', date: 'Jun 12, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'inv-2026-05', date: 'May 12, 2026', amount: '$49.00', status: 'Paid' },
]

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-slot="billing-account" :class="cn('mx-auto w-full max-w-2xl space-y-6', props.class)">
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <CardTitle>Current plan</CardTitle>
          <Badge>Pro</Badge>
        </div>
        <CardDescription>Your subscription renews automatically each month.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-2xl font-bold tracking-tight">
              {{ plan.price }}
              <span class="text-muted-foreground text-sm font-normal">/ {{ plan.cadence }}</span>
            </p>
            <p class="text-muted-foreground mt-1 text-xs">Renews on {{ plan.renewalDate }}</p>
          </div>
          <div class="flex items-center gap-2">
            <Button size="sm">Upgrade</Button>
            <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive">
              Cancel subscription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Consumption against your plan limits this cycle.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-5">
        <div v-for="metric in usage" :key="metric.label" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">{{ metric.label }}</span>
            <span class="text-muted-foreground text-xs tabular-nums">
              {{ metric.used }} of {{ metric.total }} used
            </span>
          </div>
          <Progress :model-value="(metric.used / metric.total) * 100" />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Payment method</CardTitle>
        <CardDescription>Charged when your subscription renews.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="bg-muted text-muted-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-md border shadow-xs"
              aria-hidden="true"
            >
              <CreditCard class="size-4" />
            </div>
            <div>
              <p class="text-sm font-medium tabular-nums">•••• •••• •••• {{ paymentMethod.last4 }}</p>
              <p class="text-muted-foreground text-xs">
                {{ paymentMethod.brand }} · Expires {{ paymentMethod.expiry }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm">Update</Button>
            <Button variant="ghost" size="icon-sm" aria-label="Delete payment method">
              <Trash2 class="text-muted-foreground size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Billing history</CardTitle>
        <CardDescription>Invoices from the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul class="-my-2 divide-y">
          <li v-for="invoice in invoices" :key="invoice.id" class="flex items-center justify-between gap-4 py-3">
            <div class="min-w-0">
              <p class="text-sm font-medium">{{ invoice.date }}</p>
              <p class="text-muted-foreground text-xs tabular-nums">{{ invoice.amount }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="success">{{ invoice.status }}</Badge>
              <Separator orientation="vertical" class="!h-4" />
              <Button variant="ghost" size="icon-sm" aria-label="Download invoice">
                <Download class="text-muted-foreground size-4" />
              </Button>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
