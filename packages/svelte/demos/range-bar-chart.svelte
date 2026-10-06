<script lang="ts">
  import { RangeBarChart } from '@svelte-registry/range-bar-chart'

  let { story }: { story: string } = $props()

  // Contracted rate bands ($/kg) by lane.
  const bands = [
    { label: 'PVG–LAX', low: 3.8, high: 6.2 },
    { label: 'ICN–ORD', low: 3.4, high: 5.1 },
    { label: 'NRT–DFW', low: 3.9, high: 5.6 },
    { label: 'FRA–JFK', low: 2.9, high: 4.4 },
    { label: 'SIN–HKG', low: 1.8, high: 3.0 },
  ]
</script>

{#if story === 'Rate bands'}
  <RangeBarChart data={bands} height={320} />
{/if}

{#if story === 'Horizontal bands'}
  <RangeBarChart data={bands.slice(0, 3)} orientation="horizontal" height={240} />
{/if}
