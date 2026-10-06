<script lang="ts">
  import { WaterfallChart } from '@svelte-registry/waterfall-chart'

  let { story }: { story: string } = $props()

  const cashflow = [
    { label: 'Opening', value: 12000 },
    { label: 'Sales', value: 8400 },
    { label: 'Refunds', value: -1800 },
    { label: 'COGS', value: -5200 },
    { label: 'Opex', value: -3100 },
    { label: 'Tax', value: -1400 },
  ]

  const pnl = [
    { label: 'Revenue', value: 48000 },
    { label: 'Discounts', value: -4200 },
    { label: 'Returns', value: -1800 },
    { label: 'Gross profit', value: 0 },
  ]

  const noTotal = [
    { label: 'Q1', value: 3200 },
    { label: 'Q2', value: -800 },
    { label: 'Q3', value: 2400 },
    { label: 'Q4', value: 1800 },
  ]
</script>

{#if story === 'Cashflow waterfall'}
  <WaterfallChart data={cashflow} height="320" />
{/if}

{#if story === 'Without total'}
  <WaterfallChart data={noTotal} showTotal={false} height="280" />
{/if}

{#if story === 'P&L bridge'}
  <WaterfallChart data={pnl} height="300" />
{/if}

{#if story === 'Compact'}
  <WaterfallChart data={cashflow.slice(0, 4)} height="240" />
{/if}
