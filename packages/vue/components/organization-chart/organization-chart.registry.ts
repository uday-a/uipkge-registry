import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'organization-chart',
  type: 'registry:ui',
  categories: ['display', 'data'],
  framework: 'vue',
  description:
    'Organization hierarchy visualization with a tree of nodes (name, title, avatar). Expand/collapse branches, top-down or left-right direction, connector lines, optional zoom/pan controls, node click events, and a customizable node slot.',
  files: [
    { path: 'OrganizationChart.vue', target: 'components/ui/organization-chart/OrganizationChart.vue' },
    { path: 'OrgChartNode.vue', target: 'components/ui/organization-chart/OrgChartNode.vue' },
    {
      path: 'organization-chart.variants.ts',
      target: 'components/ui/organization-chart/organization-chart.variants.ts',
    },
    { path: 'types.ts', target: 'components/ui/organization-chart/types.ts' },
    { path: 'index.ts', target: 'components/ui/organization-chart/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: [],
})
