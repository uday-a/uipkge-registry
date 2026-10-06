<script lang="ts">
  import { PolarBarChart } from '@svelte-registry/polar-bar-chart'

  let { story }: { story: string } = $props()

  const traffic = [
    { category: 'Organic', value: 42 },
    { category: 'Paid', value: 28 },
    { category: 'Referral', value: 18 },
    { category: 'Social', value: 24 },
    { category: 'Email', value: 12 },
  ]

  const skills = [
    { category: 'Speed', value: 85 },
    { category: 'Reliability', value: 72 },
    { category: 'Comfort', value: 64 },
    { category: 'Safety', value: 91 },
    { category: 'Efficiency', value: 58 },
  ]
</script>

{#if story === 'Channel mix'}
  <PolarBarChart data={traffic} height="320" />
{/if}

{#if story === 'Scores'}
  <PolarBarChart data={skills} height="320" />
{/if}
