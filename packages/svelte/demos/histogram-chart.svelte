<script lang="ts">
  import { HistogramChart } from '@svelte-registry/histogram-chart'

  let { story }: { story: string } = $props()

  const ages = [22, 24, 25, 27, 29, 31, 31, 33, 34, 35, 36, 38, 41, 44, 47, 52, 58, 63]
  const binned = [
    { bin: '0–10s', count: 42 },
    { bin: '100–200ms', count: 128 },
    { bin: '200–500ms', count: 86 },
    { bin: '500ms–1s', count: 24 },
    { bin: '1s+', count: 6 },
  ]
</script>

{#if story === 'Auto-binned'}
  <HistogramChart values={ages} bins={8} height="300" />
{/if}

{#if story === 'Pre-binned'}
  <HistogramChart data={binned} height="300" />
{/if}
