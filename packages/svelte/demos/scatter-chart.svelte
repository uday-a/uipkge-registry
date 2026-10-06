<script lang="ts">
  import { ScatterChart } from '@svelte-registry/scatter-chart'

  let { story }: { story: string } = $props()

  const latency = [
    { x: 120, y: 42 }, { x: 200, y: 55 }, { x: 340, y: 48 }, { x: 480, y: 90 },
    { x: 520, y: 120 }, { x: 610, y: 88 }, { x: 720, y: 150 }, { x: 830, y: 132 },
  ]

  const indexed = [
    { x: 120, y: 42, n: 12 }, { x: 200, y: 55, n: 40 }, { x: 340, y: 48, n: 22 },
    { x: 480, y: 90, n: 65 }, { x: 610, y: 88, n: 30 }, { x: 720, y: 150, n: 90 },
  ]

  const regions = [
    { x: 120, y: 42, region: 'us' }, { x: 200, y: 55, region: 'us' },
    { x: 340, y: 48, region: 'eu' }, { x: 480, y: 90, region: 'eu' },
    { x: 520, y: 120, region: 'apac' }, { x: 610, y: 88, region: 'apac' },
    { x: 720, y: 150, region: 'us' }, { x: 830, y: 132, region: 'eu' },
  ]
</script>

{#if story === 'Single series'}
  <ScatterChart data={latency} />
{/if}

{#if story === 'Bubble sizing'}
  <ScatterChart data={indexed} sizeField="n" />
{/if}

{#if story === 'Categorized'}
  <ScatterChart data={regions} categoryField="region" height={360} />
{/if}
