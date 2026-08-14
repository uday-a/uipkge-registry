import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'warehouse-inventory-grid',
  type: 'registry:block',
  categories: ['logistics', 'app', 'ecommerce', 'dashboard'],
  description:
    'WMS warehouse inventory and bin locator grid: facility selector, 4 summary metric cards for SKUs, capacity, low-stock triggers, and inbound shipments, searchable inventory table with multi-rack bin badges, on-hand/allocated/ATP counts, barcode scanning support, and slide-over bin relocation and receiving drawer.',
  framework: 'vue',
  files: [{ path: 'WarehouseInventoryGrid.vue', target: 'components/blocks/WarehouseInventoryGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/table.json',
  ],
})
