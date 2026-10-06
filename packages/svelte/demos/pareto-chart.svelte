<script lang="ts">
  import { ParetoChart } from '@svelte-registry/pareto-chart'

  let { story }: { story: string } = $props()

  const defects = [
    { category: 'Typos', value: 142 },
    { category: 'Broken links', value: 98 },
    { category: 'Slow pages', value: 64 },
    { category: 'Auth errors', value: 31 },
    { category: 'Billing bugs', value: 18 },
    { category: 'Other', value: 12 },
  ]
</script>

{#if story === 'Defect Pareto'}
  <ParetoChart data={defects} height="320" />
{/if}

{#if story === 'Unsorted input'}
  <ParetoChart data={[...defects].reverse()} height="320" />
{/if}
