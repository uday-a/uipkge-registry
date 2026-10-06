<script lang="ts">
  import { WaffleChart } from '@svelte-registry/waffle-chart'

  let { story }: { story: string } = $props()

  const share = [
    { name: 'Organic', value: 46 },
    { name: 'Paid', value: 28 },
    { name: 'Referral', value: 16 },
    { name: 'Other', value: 10 },
  ]
</script>

{#if story === 'Traffic share'}
  <WaffleChart data={share} height="260" />
{/if}

{#if story === 'Survey result'}
  <WaffleChart
    data={[
      { name: 'Yes', value: 72 },
      { name: 'No', value: 28 },
    ]}
    showLegend={false}
    height="220"
  />
{/if}
