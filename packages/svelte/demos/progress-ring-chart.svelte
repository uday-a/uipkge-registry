<script lang="ts">
  import { ProgressRingChart } from '@svelte-registry/progress-ring-chart'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Quota ring'}
  <ProgressRingChart rings={[{ value: 68, label: 'Quota' }]} height="220" />
{/if}

{#if story === 'Multi-ring'}
  <ProgressRingChart
    rings={[
      { value: 82, label: 'Revenue' },
      { value: 64, label: 'NPS' },
      { value: 45, label: 'Retention' },
    ]}
    height="260"
  />
{/if}

{#if story === 'Custom centre'}
  <ProgressRingChart rings={[{ value: 92 }]} centerLabel="A+" height="200" />
{/if}
