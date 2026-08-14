import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'order-management-page',
  type: 'registry:block',
  categories: ['commerce', 'app', 'ecommerce'],
  description:
    'E-commerce and SaaS order fulfillment admin table: header with export CSV and new order action, 4 KPI summary metric cards, search and multi-status filter toolbar with date range selector, selectable order rows with customer avatars and status badges, slide-over order details drawer with line items breakdown and tracking info, bulk action bar, and pagination.',
  framework: 'vue',
  files: [{ path: 'OrderManagementPage.vue', target: 'components/blocks/OrderManagementPage.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/table.json',
  ],
})
