import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'event-list',
  type: 'registry:block',
  categories: ['productivity', 'dashboard'],
  description: 'List of upcoming events in a SectionCard. Each item shows title + date + optional status badge.',
  framework: 'vue',
  files: [{ path: 'EventList.vue', target: 'components/blocks/EventList.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/data-list.json',
    'https://uipkge.dev/r/badge.json',
  ],
})
