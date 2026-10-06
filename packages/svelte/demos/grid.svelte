<script lang="ts">
  import { Grid } from '@svelte-registry/grid'
  import { Card, CardContent } from '@svelte-registry/card'

  let { story }: { story: string } = $props()
</script>

{#if story === '3 columns'}
  <Grid cols={3} gap={3}>
    {#each Array.from({ length: 6 }, (_, i) => i + 1) as i (i)}
      <Card><CardContent class="p-4 text-center text-sm">{i}</CardContent></Card>
    {/each}
  </Grid>
{/if}

{#if story === '4 columns'}
  <Grid cols={4} gap={6}>
    {#each Array.from({ length: 8 }, (_, i) => i + 1) as i (i)}
      <Card><CardContent class="p-3 text-center text-sm">{i}</CardContent></Card>
    {/each}
  </Grid>
{/if}

{#if story === 'Responsive'}
  <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
    {#each Array.from({ length: 8 }, (_, i) => i + 1) as i (i)}
      <Card><CardContent class="p-3 text-center text-sm">{i}</CardContent></Card>
    {/each}
  </Grid>
{/if}
