<script lang="ts">
  import { EffectScatterChart } from '@svelte-registry/effect-scatter-chart'

  let { story }: { story: string } = $props()

  const incidents = [
    { x: 10, y: 22, c: 'p1' },
    { x: 18, y: 30, c: 'p1' },
    { x: 26, y: 18, c: 'p2' },
    { x: 34, y: 42, c: 'p2' },
    { x: 42, y: 28, c: 'p3' },
    { x: 50, y: 36, c: 'p3' },
  ]

  const fleet = [
    { lat: 12, lng: 18 },
    { lat: 22, lng: 28 },
    { lat: 30, lng: 24 },
    { lat: 38, lng: 36 },
  ]
</script>

{#if story === 'Alert ripple'}
  <EffectScatterChart data={incidents} xField="x" yField="y" categoryField="c" height="300" />
{/if}

{#if story === 'Single series'}
  <EffectScatterChart data={fleet} xField="lat" yField="lng" height="280" />
{/if}

{#if story === 'Slow ripple'}
  <EffectScatterChart data={incidents} xField="x" yField="y" categoryField="c" ripplePeriod={8} height="300" />
{/if}
