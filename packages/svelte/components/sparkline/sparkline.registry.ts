import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sparkline',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Inline micro-chart for KPI tiles. Line, area, bar, and win/loss variants. Theme-aware via registry tokens.',
  files: [
    { path: 'Sparkline.svelte', target: 'components/ui/sparkline/Sparkline.svelte' },
    { path: 'index.ts', target: 'components/ui/sparkline/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/sparkline/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
