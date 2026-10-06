<script lang="ts">
  import { DonutChart } from '@svelte-registry/donut-chart'

  let { story }: { story: string } = $props()

  const share = [
    { name: 'Product', value: 45 },
    { name: 'Services', value: 25 },
    { name: 'Support', value: 20 },
    { name: 'Other', value: 10 },
  ]

  const devices = [
    { name: 'Desktop', value: 52 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 10 },
  ]
</script>

{#if story === 'Revenue split'}
  <DonutChart data={share} height="320" />
{/if}

{#if story === 'Device share'}
  <DonutChart data={devices} height="320" />
{/if}

{#if story === 'Filled donut'}
  <DonutChart data={share} thickness={0} height="320" />
{/if}

{#if story === 'Half donut'}
  <DonutChart data={devices} type="half" height="280" />
{/if}

{#if story === 'KPI ring'}
  <DonutChart
    data={[
      { name: 'Used', value: 68 },
      { name: 'Left', value: 32 },
    ]}
    centerLabel="68%"
    showTotal={true}
    height="280"
  />
{/if}
