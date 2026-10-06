<script lang="ts">
  import { SankeyChart } from '@svelte-registry/sankey-chart'

  let { story }: { story: string } = $props()

  const funnelLinks = [
    { source: 'Visitors', target: 'Signups', value: 1200 },
    { source: 'Signups', target: 'Trials', value: 450 },
    { source: 'Signups', target: 'Churned', value: 750 },
    { source: 'Trials', target: 'Paid', value: 180 },
    { source: 'Trials', target: 'Churned', value: 270 },
  ]

  const energyLinks = [
    { source: 'Solar', target: 'Grid', value: 420 },
    { source: 'Wind', target: 'Grid', value: 380 },
    { source: 'Hydro', target: 'Grid', value: 240 },
    { source: 'Grid', target: 'Homes', value: 620 },
    { source: 'Grid', target: 'Industry', value: 420 },
  ]
</script>

{#if story === 'Acquisition funnel'}
  <SankeyChart links={funnelLinks} />
{/if}

{#if story === 'Energy mix'}
  <SankeyChart links={energyLinks} height={400} />
{/if}

{#if story === 'Straight ribbons'}
  <SankeyChart links={funnelLinks} curveness={0} />
{/if}
