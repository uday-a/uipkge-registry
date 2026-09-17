import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'banner-announcement-sticky',
  type: 'registry:block',
  categories: ['marketing'],
  description: 'Sticky release announcement banner with version pill, call-to-action link, and dismiss trigger.',
  framework: 'vue',
  files: [{ path: 'BannerAnnouncementSticky.vue', target: 'components/blocks/BannerAnnouncementSticky.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})
