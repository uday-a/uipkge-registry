import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'field-inspection-manager',
  type: 'registry:block',
  categories: ['logistics', 'app', 'forms', 'dashboard'],
  description:
    'Mobile/Desktop commercial property & equipment site inspection audit manager featuring GPS geostamp telemetry, 4 KPI metric cards, searchable audits table with pass/fail checklist scores, photo evidence thumbnail gallery with interactive lightbox modal, cryptographic sign-off badges, and work order dispatch workflows.',
  framework: 'vue',
  files: [{ path: 'FieldInspectionManager.vue', target: 'components/blocks/FieldInspectionManager.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
