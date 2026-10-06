<script lang="ts">
  import { WordCloudChart } from '@svelte-registry/word-cloud-chart'

  let { story }: { story: string } = $props()

  const topics = [
    { name: 'dashboards', value: 96 },
    { name: 'echarts', value: 82 },
    { name: 'tokens', value: 74 },
    { name: 'registry', value: 68 },
    { name: 'vue', value: 61 },
    { name: 'react', value: 58 },
    { name: 'a11y', value: 44 },
    { name: 'dark-mode', value: 39 },
    { name: 'sparklines', value: 28 },
    { name: 'funnels', value: 22 },
  ]

  const skills = [
    { name: 'TypeScript', value: 100 },
    { name: 'Tailwind', value: 88 },
    { name: 'ECharts', value: 76 },
    { name: 'Reka UI', value: 64 },
    { name: 'Radix', value: 52 },
    { name: 'Astro', value: 41 },
  ]
</script>

{#if story === 'Docs topics'}
  <WordCloudChart data={topics} height="280" />
{/if}

{#if story === 'Skill cloud'}
  <WordCloudChart data={skills} height="240" />
{/if}
