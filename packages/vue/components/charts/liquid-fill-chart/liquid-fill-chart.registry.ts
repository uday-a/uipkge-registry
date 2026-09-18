import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'liquid-fill-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Liquid fill gauge as dependency-free SVG. Animated dual waves rise to the value inside a ring with a centred label. Picks up chart tokens via CSS variables.',
  files: [
    { path: 'LiquidFillChart.vue', target: 'components/ui/charts/liquid-fill-chart/LiquidFillChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/liquid-fill-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
