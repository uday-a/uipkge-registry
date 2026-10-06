<script lang="ts">
  import { MarimekkoChart } from '@svelte-registry/marimekko-chart'

  let { story }: { story: string } = $props()

  // Weekly tonnage: columns are trade regions (width = share), segments are carriers.
  const regions = [
    {
      name: 'Transpacific',
      values: [
        { name: 'SQ', value: 320 },
        { name: 'CX', value: 410 },
        { name: 'KE', value: 300 },
        { name: 'Other', value: 250 },
      ],
    },
    {
      name: 'Intra-Asia',
      values: [
        { name: 'SQ', value: 380 },
        { name: 'CX', value: 290 },
        { name: 'KE', value: 120 },
        { name: 'Other', value: 70 },
      ],
    },
    {
      name: 'Europe',
      values: [
        { name: 'SQ', value: 140 },
        { name: 'CX', value: 90 },
        { name: 'KE', value: 60 },
        { name: 'Other', value: 350 },
      ],
    },
  ]
</script>

{#if story === 'Carrier mix by region'}
  <MarimekkoChart columns={regions} height="360" />
{/if}

{#if story === 'Two regions'}
  <MarimekkoChart columns={regions.slice(0, 2)} height="320" />
{/if}
