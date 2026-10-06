import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'alluvial-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Alluvial (vertical sankey) chart around Apache ECharts. Stage-by-stage flows running top-to-bottom for cohorts, energy, and pipelines. Same fixed categorical palette as the sankey wrapper.',
  files: [
    { path: 'AlluvialChart.svelte', target: 'components/ui/charts/alluvial-chart/AlluvialChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/alluvial-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
