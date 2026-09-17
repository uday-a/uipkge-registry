import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'blog-post-card-grid',
  type: 'registry:block',
  categories: ['media', 'marketing', 'content'],
  description:
    'Modern editorial magazine 3-column article card grid with featured hero story, reading time pills, category filter badges, author avatars, and newsletter subscription box.',
  framework: 'vue',
  files: [{ path: 'BlogPostCardGrid.vue', target: 'components/blocks/BlogPostCardGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
