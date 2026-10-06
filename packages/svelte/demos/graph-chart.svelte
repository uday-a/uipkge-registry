<script lang="ts">
  import { GraphChart } from '@svelte-registry/graph-chart'

  let { story }: { story: string } = $props()

  const services = [
    { name: 'API', category: 0 },
    { name: 'Worker', category: 1 },
    { name: 'DB', category: 2 },
    { name: 'Cache', category: 3 },
    { name: 'Queue', category: 4 },
    { name: 'CDN', category: 0 },
  ]
  const serviceLinks = [
    { source: 'API', target: 'DB' },
    { source: 'API', target: 'Cache' },
    { source: 'API', target: 'Queue' },
    { source: 'Queue', target: 'Worker' },
    { source: 'Worker', target: 'DB' },
    { source: 'CDN', target: 'API' },
  ]
  const serviceCategories = ['Edge', 'Compute', 'Storage', 'Cache', 'Messaging']

  const ring = [
    { name: 'A', category: 0 },
    { name: 'B', category: 0 },
    { name: 'C', category: 1 },
    { name: 'D', category: 1 },
    { name: 'E', category: 2 },
    { name: 'F', category: 2 },
  ]
  const ringLinks = [
    { source: 'A', target: 'B' },
    { source: 'B', target: 'C' },
    { source: 'C', target: 'D' },
    { source: 'D', target: 'E' },
    { source: 'E', target: 'F' },
    { source: 'F', target: 'A' },
    { source: 'A', target: 'D' },
    { source: 'C', target: 'F' },
  ]

  // Knowledge graph — undirected concept network with weighted edges.
  const concepts = [
    { name: 'Vue', category: 0, symbolSize: 44 },
    { name: 'Reactivity', category: 0 },
    { name: 'Composition API', category: 0 },
    { name: 'Pinia', category: 1 },
    { name: 'Nuxt', category: 1, symbolSize: 38 },
    { name: 'Vite', category: 2 },
    { name: 'Tailwind', category: 3, symbolSize: 36 },
    { name: 'OKLCH tokens', category: 3 },
  ]
  const conceptLinks = [
    { source: 'Vue', target: 'Reactivity', value: 5 },
    { source: 'Vue', target: 'Composition API', value: 5 },
    { source: 'Vue', target: 'Pinia', value: 3 },
    { source: 'Vue', target: 'Nuxt', value: 5 },
    { source: 'Nuxt', target: 'Vite', value: 4 },
    { source: 'Nuxt', target: 'Tailwind', value: 3 },
    { source: 'Tailwind', target: 'OKLCH tokens', value: 4 },
  ]
  const conceptCategories = ['Core', 'State', 'Tooling', 'Styling']
</script>

{#if story === 'Service dependency map'}
  <GraphChart nodes={services} links={serviceLinks} categories={serviceCategories} height="420" />
{/if}

{#if story === 'Ring (circular layout)'}
  <GraphChart nodes={ring} links={ringLinks} layout="circular" directed={false} height="380" />
{/if}

{#if story === 'With roam (pan + zoom)'}
  <GraphChart nodes={services} links={serviceLinks} categories={serviceCategories} roam={true} height="420" />
{/if}

{#if story === 'Knowledge graph (undirected, weighted)'}
  <GraphChart
    nodes={concepts}
    links={conceptLinks}
    categories={conceptCategories}
    directed={false}
    roam={true}
    height="420"
  />
{/if}

{#if story === 'Compact'}
  <GraphChart nodes={services} links={serviceLinks} categories={serviceCategories} height="240" />
{/if}
