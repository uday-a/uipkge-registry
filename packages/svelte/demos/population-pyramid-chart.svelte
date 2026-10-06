<script lang="ts">
  import { PopulationPyramidChart } from '@svelte-registry/population-pyramid-chart'

  let { story }: { story: string } = $props()

  const users = [
    { band: '18–24', left: 12, right: 14 },
    { band: '25–34', left: 24, right: 26 },
    { band: '35–44', left: 19, right: 21 },
    { band: '45–54', left: 14, right: 15 },
    { band: '55+', left: 8, right: 10 },
  ]
</script>

{#if story === 'User age split'}
  <PopulationPyramidChart data={users} height="320" />
{/if}

{#if story === 'Custom cohorts'}
  <PopulationPyramidChart data={users.slice(0, 3)} names={['Control', 'Variant']} height="240" />
{/if}
