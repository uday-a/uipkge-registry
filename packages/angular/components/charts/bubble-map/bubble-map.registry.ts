import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bubble-map',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Proportional symbol bubble map as dependency-free SVG. Eliminates geographic landmass distortion by scaling circle areas to continuous quantitative values with mathematical square-root radius normalization, pulsating concentric ripple rings, multi-tier size legend, and interactive hover cards.',
  files: [
    { path: 'bubble-map.component.ts', target: 'components/ui/charts/bubble-map/bubble-map.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/bubble-map/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})
