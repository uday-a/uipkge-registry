<script setup lang="ts">
import type { Component } from 'vue'
import {
  Building2,
  ChevronRight,
  CreditCard,
  FileText,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
  UserPlus,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DataListRow {
  label: string
  value: string
}

interface Section {
  title: string
  icon: Component
  rows: DataListRow[]
}

interface ActivityEvent {
  icon: Component
  sentence: string
  time: string
}

interface Order {
  id: string
  amount: string
  status: 'Paid' | 'Pending' | 'Refunded'
}

const summaryRows: DataListRow[] = [
  { label: 'Account ID', value: 'CUS-004182' },
  { label: 'Plan', value: 'Business annual' },
  { label: 'Lifetime value', value: '$48,200' },
]

const sections: Section[] = [
  {
    title: 'Contact',
    icon: Mail,
    rows: [
      { label: 'Email', value: 'billing@acmecorp.com' },
      { label: 'Phone', value: '+1 (415) 555-0134' },
      { label: 'Website', value: 'acmecorp.com' },
      { label: 'Address', value: '500 Market St, San Francisco, CA' },
    ],
  },
  {
    title: 'Company',
    icon: Building2,
    rows: [
      { label: 'Industry', value: 'Logistics & supply chain' },
      { label: 'Employees', value: '240–500' },
      { label: 'Tax ID', value: 'US-84-2917365' },
      { label: 'Payment terms', value: 'Net 30' },
    ],
  },
]

const activity: ActivityEvent[] = [
  { icon: ReceiptText, sentence: 'Invoice INV-2091 paid — $12,400', time: '2h ago' },
  { icon: MessageSquare, sentence: 'Priya left a note on the renewal deal', time: 'Yesterday' },
  { icon: UserPlus, sentence: 'Dana Whitfield added as billing contact', time: '3d ago' },
  { icon: FileText, sentence: 'Contract Q3-amendment.pdf uploaded', time: '1w ago' },
]

const tags = ['enterprise', 'renewal-q4', 'priority-support']

const orders: Order[] = [
  { id: 'ORD-8841', amount: '$12,400.00', status: 'Paid' },
  { id: 'ORD-8790', amount: '$3,180.50', status: 'Pending' },
  { id: 'ORD-8612', amount: '$940.00', status: 'Refunded' },
]
</script>

<template>
  <div data-slot="record-detail-page" class="bg-background text-foreground w-full">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex min-w-0 items-center gap-1.5">
        <Button variant="link" size="sm" class="text-muted-foreground h-auto min-h-6 px-0">Customers</Button>
        <ChevronRight class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        <span class="truncate text-sm font-semibold">Acme Corp</span>
        <Badge variant="secondary" class="ml-2">Active</Badge>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Pencil class="size-4" aria-hidden="true" />
          Edit
        </Button>
        <Button variant="outline" size="sm" class="text-destructive hover:text-destructive">
          <Trash2 class="size-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-3">
      <div class="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader class="flex-row items-center gap-4 space-y-0">
            <Avatar size="2xl" class="size-14">
              <AvatarImage src="https://i.pravatar.cc/112?img=32" alt="Acme Corp logo" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div class="min-w-0">
              <CardTitle class="text-lg">Acme Corp</CardTitle>
              <CardDescription class="truncate">billing@acmecorp.com · Customer since March 2023</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Separator class="mb-4" />
            <dl class="grid gap-x-8 gap-y-3 sm:grid-cols-3">
              <div v-for="row in summaryRows" :key="row.label">
                <dt class="text-muted-foreground text-xs">{{ row.label }}</dt>
                <dd class="mt-0.5 text-sm font-medium">{{ row.value }}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Tabs default-value="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" class="space-y-6 pt-4">
            <section v-for="section in sections" :key="section.title">
              <h3 class="flex items-center gap-2 text-sm font-semibold">
                <component :is="section.icon" class="text-muted-foreground size-4" aria-hidden="true" />
                {{ section.title }}
              </h3>
              <dl class="border-border mt-3 divide-y rounded-lg border">
                <div v-for="row in section.rows" :key="row.label" class="px-4 py-2.5 sm:flex sm:items-center sm:gap-4">
                  <dt class="text-muted-foreground text-xs sm:w-36 sm:text-sm">{{ row.label }}</dt>
                  <dd class="mt-0.5 text-sm font-medium sm:mt-0">{{ row.value }}</dd>
                </div>
              </dl>
            </section>
          </TabsContent>

          <TabsContent value="activity" class="pt-4">
            <ol
              class="before:bg-border relative space-y-6 before:absolute before:inset-y-1 before:left-[15px] before:w-px"
            >
              <li v-for="event in activity" :key="event.sentence" class="relative flex items-start gap-4 pl-0">
                <span
                  class="bg-background ring-border relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-1"
                >
                  <component :is="event.icon" class="text-muted-foreground size-4" aria-hidden="true" />
                </span>
                <div class="min-w-0 pt-1">
                  <p class="truncate text-sm">{{ event.sentence }}</p>
                  <time class="text-muted-foreground text-xs">{{ event.time }}</time>
                </div>
              </li>
            </ol>
          </TabsContent>
        </Tabs>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-sm font-medium">Record meta</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-3">
              <Avatar class="size-8">
                <AvatarImage src="https://i.pravatar.cc/64?img=47" alt="Priya Raman" />
                <AvatarFallback>PR</AvatarFallback>
              </Avatar>
              <div class="min-w-0">
                <p class="text-muted-foreground text-xs">Owner</p>
                <p class="truncate text-sm font-medium">Priya Raman</p>
              </div>
            </div>
            <Separator />
            <dl class="space-y-3">
              <div class="flex items-center justify-between gap-4">
                <dt class="text-muted-foreground text-xs">Created</dt>
                <dd class="text-sm font-medium">Mar 14, 2023</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-muted-foreground text-xs">Updated</dt>
                <dd class="text-sm font-medium">2 hours ago</dd>
              </div>
            </dl>
            <Separator />
            <div>
              <p class="text-muted-foreground mb-2 text-xs">Tags</p>
              <div class="flex flex-wrap gap-1.5">
                <Badge v-for="tag in tags" :key="tag" variant="secondary">{{ tag }}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex-row items-center justify-between space-y-0">
            <CardTitle class="text-sm font-medium">Recent orders</CardTitle>
            <Button variant="ghost" size="icon" aria-label="View all orders">
              <CreditCard class="size-4" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent>
            <ul class="divide-y">
              <li v-for="order in orders" :key="order.id" class="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span class="font-mono text-xs">{{ order.id }}</span>
                <span class="text-muted-foreground ml-auto text-sm tabular-nums">{{ order.amount }}</span>
                <Badge
                  :variant="order.status === 'Paid' ? 'default' : order.status === 'Pending' ? 'secondary' : 'outline'"
                  class="min-w-[72px] justify-center"
                >
                  {{ order.status }}
                </Badge>
              </li>
            </ul>
            <Button variant="outline" size="sm" class="mt-4 w-full">
              <Plus class="size-4" aria-hidden="true" />
              New order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
