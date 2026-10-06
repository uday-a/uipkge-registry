<script lang="ts">
  import { QuadrantChart } from '@svelte-registry/quadrant-chart'

  let { story }: { story: string } = $props()

  const vendors = [
    { x: 8.2, y: 7.4, label: 'Acme' },
    { x: 6.1, y: 8.8, label: 'Globex' },
    { x: 4.4, y: 5.2, label: 'Initech' },
    { x: 7.8, y: 4.1, label: 'Umbrella' },
    { x: 3.2, y: 8.1, label: 'Hooli' },
    { x: 5.5, y: 6.0, label: 'Stark' },
  ]
</script>

{#if story === 'Vendor matrix'}
  <QuadrantChart data={vendors} xName="Completeness" yName="Satisfaction" height="340" />
{/if}

{#if story === 'Fixed splits'}
  <QuadrantChart data={vendors} xMid={6} yMid={6} height="340" />
{/if}
