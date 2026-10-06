import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'control-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Control (SPC) chart around Apache ECharts. Run line with auto-computed mean ± 2σ limits; out-of-spec points turn red. Theme-aware via registry tokens.',
  files: [
    { path: 'control-chart.component.ts', target: 'components/ui/charts/control-chart/control-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/control-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
