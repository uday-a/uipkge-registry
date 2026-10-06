<script lang="ts">
  import { BoxplotChart } from '@svelte-registry/boxplot-chart'

  let { story }: { story: string } = $props()

  const latencies = [
    { category: 'US-W', values: [120, 145, 165, 180, 215] as [number, number, number, number, number] },
    { category: 'US-E', values: [115, 138, 152, 170, 220] as [number, number, number, number, number] },
    { category: 'EU', values: [130, 152, 172, 200, 260] as [number, number, number, number, number] },
    { category: 'APAC', values: [110, 128, 142, 158, 195] as [number, number, number, number, number] },
    { category: 'SA', values: [140, 168, 185, 210, 280] as [number, number, number, number, number] },
  ]

  const scores = [
    { category: 'Group A', values: [42, 56, 68, 78, 92] as [number, number, number, number, number] },
    { category: 'Group B', values: [48, 60, 71, 80, 94] as [number, number, number, number, number] },
    { category: 'Group C', values: [52, 65, 74, 84, 96] as [number, number, number, number, number] },
  ]

  // Build times across artifact size tiers — wider IQR at the large tier
  // shows the long-tail risk for big builds.
  const buildTimes = [
    { category: 'Small', values: [12, 18, 24, 32, 48] as [number, number, number, number, number] },
    { category: 'Medium', values: [28, 42, 58, 78, 110] as [number, number, number, number, number] },
    { category: 'Large', values: [55, 95, 140, 220, 380] as [number, number, number, number, number] },
    { category: 'XL', values: [110, 180, 260, 380, 620] as [number, number, number, number, number] },
  ]

  const noGridOption = {
    yAxis: { splitLine: { show: false } },
    grid: { left: 8, right: 8, top: 8, bottom: 24, containLabel: true },
  }
</script>

{#if story === 'Vertical box plot'}
  <BoxplotChart data={latencies} height="340" />
{/if}

{#if story === 'Horizontal'}
  <BoxplotChart data={latencies} horizontal={true} height="320" />
{/if}

{#if story === 'A/B/C cohort scores'}
  <BoxplotChart data={scores} height="320" />
{/if}

{#if story === 'Build times by tier (long-tail risk)'}
  <BoxplotChart data={buildTimes} horizontal={true} height="340" />
{/if}

{#if story === 'Compact / no gridlines'}
  <BoxplotChart data={latencies} option={noGridOption} height="180" />
{/if}
