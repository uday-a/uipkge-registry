import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'theme-river',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Theme-river (streamgraph) wrapper around Apache ECharts. Stacked areas centred on a baseline along a time axis — good for topic-volume drift over time.',
  files: [
    { path: 'ThemeRiver.svelte', target: 'components/ui/theme-river/ThemeRiver.svelte' },
    { path: 'index.ts', target: 'components/ui/theme-river/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/theme-river/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
