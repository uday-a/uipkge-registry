<script lang="ts">
  import { ViolinChart } from '@svelte-registry/violin-chart'

  let { story }: { story: string } = $props()

  // Customs clearance hours per AWB batch, by gateway.
  const gateways = [
    { group: 'SIN', values: [9.8, 11.2, 10.4, 12.1, 11.6, 10.9, 13.2, 11.0, 12.6, 10.2, 11.8, 12.0] },
    { group: 'HKG', values: [12.4, 14.1, 13.0, 15.2, 13.8, 12.9, 16.1, 13.5, 14.6, 26.5, 13.2, 14.0] },
    { group: 'FRA', values: [15.1, 17.4, 16.0, 18.2, 16.8, 15.9, 19.1, 17.0, 16.4, 18.0, 17.2, 16.6] },
  ]
</script>

{#if story === 'Clearance by gateway'}
  <ViolinChart groups={gateways} height="360" />
{/if}

{#if story === 'Two-gateway compare'}
  <ViolinChart groups={gateways.slice(0, 2)} height="340" />
{/if}
