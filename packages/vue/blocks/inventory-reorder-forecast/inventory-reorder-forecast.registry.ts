import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'inventory-reorder-forecast',
  type: 'registry:block',
  categories: ['logistics', 'app', 'ecommerce', 'dashboard'],
  description:
    'Supply chain inventory replenishment planner with lead-time demand forecasting, 4 forecasting KPI metric cards, safety stock triggers, multi-SKU demand table, and automated purchase order generation.',
  framework: 'vue',
  files: [{ path: 'InventoryReorderForecast.vue', target: 'components/blocks/InventoryReorderForecast.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
