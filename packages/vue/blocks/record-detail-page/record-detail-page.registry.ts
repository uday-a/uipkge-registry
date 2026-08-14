import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'record-detail-page',
  type: 'registry:block',
  categories: ['layout', 'app'],
  description:
    'Admin record detail page: breadcrumb header with status badge and Edit / Delete actions, two-column layout with a summary card (avatar, identity, key metrics), Details / Activity tabs (labeled description-list sections and an icon timeline feed), plus a side panel with owner metadata, relative timestamps, tag badges, and a recent-orders mini list. All data is hardcoded inline for you to replace.',
  framework: 'vue',
  files: [{ path: 'RecordDetailPage.vue', target: 'components/blocks/RecordDetailPage.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
