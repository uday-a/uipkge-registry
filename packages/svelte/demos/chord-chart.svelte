<script lang="ts">
  import { ChordChart } from '@svelte-registry/charts/chord-chart'

  let { story }: { story: string } = $props()

  const nodes = [{ name: 'API' }, { name: 'Worker' }, { name: 'DB' }, { name: 'Cache' }, { name: 'Queue' }]
  const links = [
    { source: 'API', target: 'DB', value: 42 },
    { source: 'API', target: 'Cache', value: 30 },
    { source: 'API', target: 'Queue', value: 24 },
    { source: 'Queue', target: 'Worker', value: 24 },
    { source: 'Worker', target: 'DB', value: 18 },
    { source: 'Worker', target: 'Cache', value: 8 },
  ]
</script>

{#if story === 'Service traffic'}
  <ChordChart {nodes} {links} height="380" />
{/if}

{#if story === 'Team handoffs'}
  <ChordChart
    nodes={[{ name: 'Design' }, { name: 'Eng' }, { name: 'QA' }]}
    links={[
      { source: 'Design', target: 'Eng', value: 30 },
      { source: 'Eng', target: 'QA', value: 26 },
      { source: 'QA', target: 'Design', value: 8 },
    ]}
    height="340"
  />
{/if}
