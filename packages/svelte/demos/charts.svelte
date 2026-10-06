<script lang="ts">
  import { CategoryDistributionChart } from '@svelte-registry/charts/category-distribution-chart'
  import { ChordChart } from '@svelte-registry/charts/chord-chart'
  import { ChoroplethMapChart } from '@svelte-registry/charts/choropleth-map-chart'
  import { WORLD_GEOJSON } from '../../lib/world-geo'

  let { story }: { story: string } = $props()

  // Meta-bundle gallery. Only this batch's charts are ported so far — other
  // chart batches extend this demo with their own stories at merge time.

  const budget = [
    { label: 'Marketing', percentage: 40, value: 4000 },
    { label: 'Sales', percentage: 25, value: 2500 },
    { label: 'Development', percentage: 20, value: 2000 },
    { label: 'Support', percentage: 15, value: 1500 },
  ]

  const worldData = [
    { id: 'United States of America', value: 92 },
    { id: 'Canada', value: 94 },
    { id: 'Germany', value: 93 },
    { id: 'Japan', value: 93 },
    { id: 'India', value: 52 },
    { id: 'Brazil', value: 81 },
  ]
</script>

{#if story === 'Category distribution'}
  <CategoryDistributionChart
    primaryValue="10,000"
    primaryLabel="Total spend"
    trend={{ value: '8.2%', direction: 'up' }}
    categories={budget}
    height="240"
  />
{/if}

{#if story === 'Chord'}
  <ChordChart
    nodes={[{ name: 'API' }, { name: 'DB' }, { name: 'Cache' }]}
    links={[
      { source: 'API', target: 'DB', value: 42 },
      { source: 'API', target: 'Cache', value: 30 },
    ]}
    height="320"
  />
{/if}

{#if story === 'Choropleth map'}
  <ChoroplethMapChart geoJson={WORLD_GEOJSON} mapName="uipkge-world" data={worldData} height="400" />
{/if}
