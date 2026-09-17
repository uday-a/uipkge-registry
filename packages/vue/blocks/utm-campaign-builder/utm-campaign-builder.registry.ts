import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'utm-campaign-builder',
  type: 'registry:block',
  categories: ['marketing', 'app', 'form'],
  description:
    'Google Analytics 4 (GA4) campaign link generator with preset presets, shortlink generator, syntax-highlighted URL preview, parameter verification table, and vector QR code export.',
  framework: 'vue',
  files: [{ path: 'UtmCampaignBuilder.vue', target: 'components/blocks/UtmCampaignBuilder.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
