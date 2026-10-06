<script lang="ts">
  import { DumbbellChart } from '@svelte-registry/dumbbell-chart'

  let { story }: { story: string } = $props()

  const churn = [
    { label: 'Acme', a: 4.2, b: 2.1 },
    { label: 'Globex', a: 3.8, b: 3.1 },
    { label: 'Initech', a: 5.1, b: 2.8 },
    { label: 'Umbrella', a: 2.4, b: 2.9 },
  ]

  const ratings = [
    { label: 'Speed', a: 3.1, b: 4.4 },
    { label: 'Support', a: 3.8, b: 4.1 },
    { label: 'Pricing', a: 4.0, b: 3.6 },
  ]
</script>

{#if story === 'Churn before/after'}
  <DumbbellChart data={churn} names={['Q1', 'Q2'] as [string, string]} height="300" />
{/if}

{#if story === 'Satisfaction shift'}
  <DumbbellChart data={ratings} names={['2024', '2025'] as [string, string]} height="260" />
{/if}
