<script lang="ts">
  import { NightingaleChart } from '@svelte-registry/nightingale-chart'

  let { story }: { story: string } = $props()

  const traffic = [
    { name: 'Organic', value: 480 },
    { name: 'Paid', value: 360 },
    { name: 'Referral', value: 220 },
    { name: 'Social', value: 150 },
    { name: 'Email', value: 90 },
  ]
</script>

{#if story === 'Channel rose'}
  <NightingaleChart data={traffic} height="340" />
{/if}

{#if story === 'Compact'}
  <NightingaleChart data={traffic.slice(0, 3)} height="280" />
{/if}
