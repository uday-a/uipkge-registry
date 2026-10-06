<script lang="ts">
  import { CategoryDistributionChart } from '@svelte-registry/charts/category-distribution-chart'

  let { story }: { story: string } = $props()

  const budget = [
    { label: 'Marketing', percentage: 40, value: 4000 },
    { label: 'Sales', percentage: 25, value: 2500 },
    { label: 'Development', percentage: 20, value: 2000 },
    { label: 'Support', percentage: 15, value: 1500 },
  ]

  const traffic = [
    { label: 'Organic', percentage: 46 },
    { label: 'Paid', percentage: 28 },
    { label: 'Referral', percentage: 16 },
    { label: 'Other', percentage: 10 },
  ]
</script>

{#if story === 'Budget split'}
  <CategoryDistributionChart
    primaryValue="10,000"
    primaryLabel="Total spend"
    trend={{ value: '8.2%', direction: 'up' }}
    categories={budget}
    height="240"
  />
{/if}

{#if story === 'Traffic mix'}
  <CategoryDistributionChart primaryValue="84k" trend={{ value: '3.1%', direction: 'down' }} categories={traffic} height="240" />
{/if}
