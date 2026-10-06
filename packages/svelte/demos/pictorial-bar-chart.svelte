<script lang="ts">
  import { PictorialBarChart } from '@svelte-registry/pictorial-bar-chart'

  let { story }: { story: string } = $props()

  const hiring = [
    { category: 'Eng', value: 24 },
    { category: 'Design', value: 12 },
    { category: 'Sales', value: 18 },
    { category: 'Support', value: 9 },
    { category: 'Ops', value: 6 },
  ]
</script>

{#if story === 'Headcount'}
  <PictorialBarChart data={hiring} height="300" />
{/if}

{#if story === 'Diamond symbols'}
  <PictorialBarChart data={hiring} symbol="diamond" height="300" />
{/if}

{#if story === 'Round symbols'}
  <PictorialBarChart data={hiring} symbol="circle" height="300" />
{/if}
