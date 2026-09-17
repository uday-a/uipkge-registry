import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'vendor-supplier-portal',
  type: 'registry:block',
  categories: ['dashboard', 'data-display'],
  framework: 'vue',
  description:
    'Supplier and vendor relationship workbench with SLA scorecard metrics, purchase order status, and contracted pricing catalog.',
  files: [
    { path: 'VendorSupplierPortal.vue', target: 'components/blocks/vendor-supplier-portal/VendorSupplierPortal.vue' },
    { path: 'index.ts', target: 'components/blocks/vendor-supplier-portal/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/table.json',
  ],
})
