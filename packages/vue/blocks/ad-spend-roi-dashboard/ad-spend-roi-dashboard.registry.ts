import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ad-spend-roi-dashboard',
  type: 'registry:block',
  categories: ['marketing', 'dashboard', 'analytics'],
  description:
    'Multi-channel paid acquisition ad spend, blended ROAS, and CAC performance dashboard: 4 primary KPI cards (total spend, revenue with blended ROAS, CAC, conversions), channel performance comparison table with live toggle switches, and top 3 performing campaign breakdown.',
  framework: 'vue',
  files: [{ path: 'AdSpendRoiDashboard.vue', target: 'components/blocks/AdSpendRoiDashboard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
