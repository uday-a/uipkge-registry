import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'announcement-banner',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive release, security, and maintenance broadcast center with rotating live ticker, CLI copy button, and floating pill / top-bar modes.',
  framework: 'vue',
  files: [{ path: 'AnnouncementBanner.vue', target: 'components/blocks/AnnouncementBanner.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})
