<script lang="ts">
  import { ThemeRiver } from '@svelte-registry/theme-river'

  let { story }: { story: string } = $props()

  const topics: [string, number, string][] = [
    ['2024-01-01', 12, 'Design'],
    ['2024-02-01', 18, 'Design'],
    ['2024-03-01', 15, 'Design'],
    ['2024-04-01', 22, 'Design'],
    ['2024-05-01', 20, 'Design'],
    ['2024-06-01', 26, 'Design'],
    ['2024-01-01', 8, 'Engineering'],
    ['2024-02-01', 10, 'Engineering'],
    ['2024-03-01', 16, 'Engineering'],
    ['2024-04-01', 14, 'Engineering'],
    ['2024-05-01', 19, 'Engineering'],
    ['2024-06-01', 24, 'Engineering'],
    ['2024-01-01', 5, 'Research'],
    ['2024-02-01', 7, 'Research'],
    ['2024-03-01', 6, 'Research'],
    ['2024-04-01', 9, 'Research'],
    ['2024-05-01', 11, 'Research'],
    ['2024-06-01', 10, 'Research'],
  ]
</script>

{#if story === 'Default'}
  <ThemeRiver data={topics} />
{/if}

{#if story === 'Custom height'}
  <ThemeRiver data={topics} height={200} />
{/if}

{#if story === 'Without legend'}
  <ThemeRiver data={topics} option={{ legend: { show: false } }} />
{/if}
