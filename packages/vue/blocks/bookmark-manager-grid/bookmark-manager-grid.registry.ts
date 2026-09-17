import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bookmark-manager-grid',
  type: 'registry:block',
  categories: ['productivity', 'app', 'dashboard', 'collaboration'],
  description:
    'Raindrop style visual web bookmarks and engineering resources manager with collection folders, tag cloud filtering, real-time search, favorite toggles, copy link, and add bookmark modal.',
  framework: 'vue',
  files: [{ path: 'BookmarkManagerGrid.vue', target: 'components/blocks/BookmarkManagerGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
