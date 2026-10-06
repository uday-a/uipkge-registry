<script lang="ts">
  import { SlopeChart } from '@svelte-registry/slope-chart'

  let { story }: { story: string } = $props()

  const share = [
    { label: 'Desktop', values: [52, 44] },
    { label: 'Mobile', values: [38, 47] },
    { label: 'Tablet', values: [10, 9] },
  ]

  const ranks = [
    { label: 'Aurora', values: [3, 2, 1, 1] },
    { label: 'Boreal', values: [1, 1, 2, 3] },
    { label: 'Cirrus', values: [2, 3, 3, 2] },
  ]
</script>

{#if story === 'Traffic share shift'}
  <SlopeChart data={share} points={['2024', '2025']} height="300" />
{/if}

{#if story === 'Rank bump chart'}
  <SlopeChart data={ranks} points={['W1', 'W2', 'W3', 'W4']} height="320" />
{/if}
