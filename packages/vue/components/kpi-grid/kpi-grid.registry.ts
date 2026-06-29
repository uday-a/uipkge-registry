import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'kpi-grid',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'vue',
  description:
    'Bare responsive grid wrapper (2 / 3 / 4 columns). Pass any children — Cards, inline charts, custom tiles. No items prop, no item rendering.',
  files: [
    { path: 'KpiGrid.vue', target: 'components/ui/kpi-grid/KpiGrid.vue' },
    { path: 'index.ts', target: 'components/ui/kpi-grid/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
