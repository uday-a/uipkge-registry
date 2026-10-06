import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'control-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Control (SPC) chart around Apache ECharts. Run line with auto-computed mean ± 2σ limits; out-of-spec points turn red. Theme-aware via registry tokens.',
  files: [
    { path: 'ControlChart.svelte', target: 'components/ui/control-chart/ControlChart.svelte' },
    { path: 'useChartTheme.ts', target: 'components/ui/control-chart/useChartTheme.ts' },
    { path: 'index.ts', target: 'components/ui/control-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
