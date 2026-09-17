import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dashboard-kpis',
  type: 'registry:block',
  categories: ['analytics', 'dashboard'],
  framework: 'react',
  description:
    'Four-tile KPI row. Each tile is an inline Card: label, big number, signed trend pill, and a sparkline. No items prop — edit the tiles in place after install.',
  files: [{ path: 'DashboardKpis.tsx', target: 'components/blocks/DashboardKpis.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/kpi-grid.json',
    'https://uipkge.dev/r/sparkline.json',
  ],
})
