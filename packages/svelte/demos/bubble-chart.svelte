<script lang="ts">
  import { BubbleChart } from '@svelte-registry/bubble-chart'

  let { story }: { story: string } = $props()

  const markets = [
    { x: 4.2, y: 68, size: 120, c: 'SMB' },
    { x: 6.8, y: 74, size: 320, c: 'SMB' },
    { x: 3.1, y: 52, size: 80, c: 'Enterprise' },
    { x: 8.4, y: 88, size: 540, c: 'Enterprise' },
    { x: 5.5, y: 61, size: 200, c: 'Mid-market' },
    { x: 7.2, y: 79, size: 410, c: 'Mid-market' },
  ]
</script>

{#if story === 'Deal landscape'}
  <BubbleChart data={markets} categoryField="c" height="320" />
{/if}

{#if story === 'Single series'}
  <BubbleChart data={markets.map(({ c, ...d }) => d)} height="300" />
{/if}

{#if story === 'Soft opacity'}
  <BubbleChart data={markets} categoryField="c" opacity={0.4} height="320" />
{/if}

{#if story === 'Size range'}
  <BubbleChart data={markets} categoryField="c" minSize={4} maxSize={64} height="320" />
{/if}
