<script lang="ts">
  import { BeeswarmChart } from '@svelte-registry/beeswarm-chart'

  let { story }: { story: string } = $props()

  const scores = [
    { group: 'Eng', value: 82 },
    { group: 'Eng', value: 88 },
    { group: 'Eng', value: 74 },
    { group: 'Eng', value: 91 },
    { group: 'Eng', value: 79 },
    { group: 'Design', value: 76 },
    { group: 'Design', value: 84 },
    { group: 'Design', value: 69 },
    { group: 'Design', value: 81 },
    { group: 'Sales', value: 64 },
    { group: 'Sales', value: 71 },
    { group: 'Sales', value: 58 },
    { group: 'Sales', value: 77 },
    { group: 'Sales', value: 66 },
  ]

  const latency = [
    { group: 'p99', value: 12 },
    { group: 'p99', value: 18 },
    { group: 'p99', value: 15 },
    { group: 'p99', value: 42 },
    { group: 'p99', value: 21 },
  ]
</script>

{#if story === 'Scores by team'}
  <BeeswarmChart data={scores} valueField="value" groupField="group" height="300" />
{/if}

{#if story === 'Latency sample'}
  <BeeswarmChart data={latency} height="200" />
{/if}
