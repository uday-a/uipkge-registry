<script lang="ts">
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from '@svelte-registry/table'

  let { story }: { story: string } = $props()

  const invoices = [
    { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
    { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$420.00' },
  ]
  const totals = invoices.reduce((s, i) => s + parseFloat(i.amount.replace('$', '').replace(',', '')), 0)

  function statusClass(status: string): string {
    const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
    if (status === 'Paid') return `${base} bg-primary text-primary-foreground`
    if (status === 'Pending') return `${base} bg-secondary text-secondary-foreground`
    return `${base} border`
  }
</script>

{#if story === 'Default'}
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
      {#each invoices as i (i.invoice)}
        <TableRow>
          <TableCell class="font-medium">{i.invoice}</TableCell>
          <TableCell><span class={statusClass(i.status)}>{i.status}</span></TableCell>
          <TableCell class="text-muted-foreground">{i.method}</TableCell>
          <TableCell class="text-right font-medium tabular-nums">{i.amount}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
{/if}

{#if story === 'With caption'}
  <Table>
    <TableCaption>Showing {invoices.length} invoices · total ${totals.toFixed(2)}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each invoices as i (i.invoice)}
        <TableRow>
          <TableCell>{i.invoice}</TableCell>
          <TableCell class="text-right tabular-nums">{i.amount}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
{/if}

{#if story === 'Striped rows'}
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
      {#each invoices as i (i.invoice)}
        <TableRow class="odd:bg-muted/40">
          <TableCell class="font-medium">{i.invoice}</TableCell>
          <TableCell>{i.status}</TableCell>
          <TableCell class="text-muted-foreground">{i.method}</TableCell>
          <TableCell class="text-right tabular-nums">{i.amount}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
{/if}

{#if story === 'With footer / totals row'}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Method</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each invoices as i (i.invoice)}
        <TableRow>
          <TableCell class="font-medium">{i.invoice}</TableCell>
          <TableCell class="text-muted-foreground">{i.method}</TableCell>
          <TableCell class="text-right tabular-nums">{i.amount}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan={2}>Total</TableCell>
        <TableCell class="text-right font-bold tabular-nums">${totals.toFixed(2)}</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
{/if}

{#if story === 'Compact density'}
  <Table density="compact">
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each invoices as i (i.invoice)}
        <TableRow>
          <TableCell class="font-medium">{i.invoice}</TableCell>
          <TableCell><span class={statusClass(i.status)}>{i.status}</span></TableCell>
          <TableCell class="text-right tabular-nums">{i.amount}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
{/if}

{#if story === 'Sticky header'}
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
        {#each Array.from({ length: 12 }, (_, k) => k + 1) as n (n)}
          <TableRow>
            <TableCell class="font-medium">INV{String(n).padStart(3, '0')}</TableCell>
            <TableCell>{n % 3 === 0 ? 'Pending' : 'Paid'}</TableCell>
            <TableCell class="text-right tabular-nums">${(120 + n * 17).toFixed(2)}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>
{/if}

{#if story === 'Empty'}
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
        <TableCell colspan={3} class="text-muted-foreground h-24 text-center text-sm">No invoices yet.</TableCell>
      </TableRow>
    </TableBody>
  </Table>
{/if}
