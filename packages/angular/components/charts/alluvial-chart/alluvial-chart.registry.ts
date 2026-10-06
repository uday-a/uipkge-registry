import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'alluvial-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Alluvial (vertical sankey) chart around Apache ECharts. Stage-by-stage flows running top-to-bottom for cohorts, energy, and pipelines. Same fixed categorical palette as the sankey wrapper.',
  files: [
    { path: 'alluvial-chart.component.ts', target: 'components/ui/charts/alluvial-chart/alluvial-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/alluvial-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
