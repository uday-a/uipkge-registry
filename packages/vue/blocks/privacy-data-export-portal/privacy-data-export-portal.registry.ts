import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'privacy-data-export-portal',
  type: 'registry:block',
  categories: ['legal', 'security', 'app'],
  description:
    'GDPR Article 15 and CCPA personal data export portal with privacy governance stat cards, granular category export selector, format chooser, and export archive history table.',
  framework: 'vue',
  files: [{ path: 'PrivacyDataExportPortal.vue', target: 'components/blocks/PrivacyDataExportPortal.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
