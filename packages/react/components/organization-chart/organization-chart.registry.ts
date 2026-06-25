import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'organization-chart',
  type: 'registry:ui',
  categories: ['display', 'data'],
  description:
    'Organization hierarchy visualization with a tree of nodes (name, title, avatar). Expand/collapse branches, top-down or left-right direction, connector lines, optional zoom/pan controls, node click events, and a customizable node render prop.',
  files: [
    { path: 'OrganizationChart.tsx', target: 'components/ui/organization-chart/OrganizationChart.tsx' },
    { path: 'OrgChartNode.tsx', target: 'components/ui/organization-chart/OrgChartNode.tsx' },
    {
      path: 'organization-chart.variants.ts',
      target: 'components/ui/organization-chart/organization-chart.variants.ts',
    },
    { path: 'organization-chart.css', target: 'components/ui/organization-chart/organization-chart.css' },
    { path: 'types.ts', target: 'components/ui/organization-chart/types.ts' },
    { path: 'index.ts', target: 'components/ui/organization-chart/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-react'],
  registryDependencies: [],
})
