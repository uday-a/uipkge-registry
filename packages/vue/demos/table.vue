<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
const invoices = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$420.00' },
]
const totals = invoices.reduce((s, i) => s + parseFloat(i.amount.replace('$', '').replace(',', '')), 0)
</script>

<template>
  <Story title="Default" description="Plain Table with header + body. Use Badge in cells for status pills.">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-32">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in invoices" :key="i.invoice">
          <TableCell class="font-medium">{{ i.invoice }}</TableCell>
          <TableCell>
            <Badge :variant="i.status === 'Paid' ? 'default' : i.status === 'Pending' ? 'secondary' : 'outline'">{{
              i.status
            }}</Badge>
          </TableCell>
          <TableCell class="text-muted-foreground">{{ i.method }}</TableCell>
          <TableCell class="text-right font-medium tabular-nums">{{ i.amount }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Story>

  <Story title="With caption" description="Add a TableCaption at the bottom for a summary.">
    <Table>
      <TableCaption>Showing {{ invoices.length }} invoices · total ${{ totals.toFixed(2) }}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in invoices" :key="i.invoice">
          <TableCell>{{ i.invoice }}</TableCell>
          <TableCell class="text-right tabular-nums">{{ i.amount }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Story>

  <Story
    title="Striped rows"
    description="Apply odd:bg-muted/40 to TableRow for zebra striping. Improves row tracking at higher row counts."
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in invoices" :key="i.invoice" class="odd:bg-muted/40">
          <TableCell class="font-medium">{{ i.invoice }}</TableCell>
          <TableCell>{{ i.status }}</TableCell>
          <TableCell class="text-muted-foreground">{{ i.method }}</TableCell>
          <TableCell class="text-right tabular-nums">{{ i.amount }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Story>

  <Story
    title="With footer / totals row"
    description="TableFooter renders below the body — handy for column totals, counts, or summary stats."
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in invoices" :key="i.invoice">
          <TableCell class="font-medium">{{ i.invoice }}</TableCell>
          <TableCell class="text-muted-foreground">{{ i.method }}</TableCell>
          <TableCell class="text-right tabular-nums">{{ i.amount }}</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colspan="2">Total</TableCell>
          <TableCell class="text-right font-bold tabular-nums">${{ totals.toFixed(2) }}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </Story>

  <Story
    title="Compact density"
    description="Override the per-cell padding for tighter rows. Use py-1.5 on TableCell + TableHead when the table holds many rows in a limited viewport."
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="py-2">Invoice</TableHead>
          <TableHead class="py-2">Status</TableHead>
          <TableHead class="py-2 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="i in invoices" :key="i.invoice">
          <TableCell class="py-1.5 font-medium">{{ i.invoice }}</TableCell>
          <TableCell class="py-1.5">
            <Badge :variant="i.status === 'Paid' ? 'default' : i.status === 'Pending' ? 'secondary' : 'outline'">{{
              i.status
            }}</Badge>
          </TableCell>
          <TableCell class="py-1.5 text-right tabular-nums">{{ i.amount }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Story>

  <Story
    title="Sticky header"
    description="Wrap Table in a max-height scroller and keep TableHeader sticky so column labels stay visible."
  >
    <div class="max-h-48 overflow-auto rounded-md border">
      <Table>
        <TableHeader class="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="n in 12" :key="n">
            <TableCell class="font-medium">INV{{ String(n).padStart(3, '0') }}</TableCell>
            <TableCell>{{ n % 3 === 0 ? 'Pending' : 'Paid' }}</TableCell>
            <TableCell class="text-right tabular-nums">${{ (120 + n * 17).toFixed(2) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </Story>

  <Story
    title="Empty"
    description="A single spanning cell is enough for an empty ledger. Pair with a short prompt, not a blank tbody."
  >
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow class="hover:bg-transparent">
          <TableCell colspan="3" class="text-muted-foreground h-24 text-center text-sm">No invoices yet.</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Story>
</template>
