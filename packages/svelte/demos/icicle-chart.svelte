<script lang="ts">
  import { IcicleChart } from '@svelte-registry/icicle-chart'

  let { story }: { story: string } = $props()

  const volume = {
    name: 'Air cargo · 2,780 t',
    children: [
      {
        name: 'Transpacific',
        children: [
          { name: 'PVG–LAX', value: 520 },
          { name: 'ICN–ORD', value: 410 },
          { name: 'NRT–DFW', value: 350 },
        ],
      },
      {
        name: 'Intra-Asia',
        children: [
          { name: 'SIN–HKG', value: 380 },
          { name: 'HKG–ANC', value: 290 },
          { name: 'SIN–ICN', value: 190 },
        ],
      },
      {
        name: 'Europe',
        children: [
          { name: 'FRA–JFK', value: 360 },
          { name: 'DXB–SIN', value: 280 },
        ],
      },
    ],
  }

  const capacity = {
    name: 'Capacity · 2,200 t',
    children: [
      {
        name: 'Star Alliance',
        children: [
          { name: 'SQ', value: 380 },
          { name: 'LH', value: 320 },
          { name: 'BR', value: 240 },
        ],
      },
      {
        name: 'Oneworld',
        children: [
          { name: 'CX', value: 410 },
          { name: 'JL', value: 310 },
        ],
      },
      {
        name: 'SkyTeam',
        children: [
          { name: 'KE', value: 300 },
          { name: 'CI', value: 240 },
        ],
      },
    ],
  }
</script>

{#if story === 'Volume by trade lane'}
  <IcicleChart data={volume} height="360" />
{/if}

{#if story === 'Capacity by alliance'}
  <IcicleChart data={capacity} height="360" />
{/if}
