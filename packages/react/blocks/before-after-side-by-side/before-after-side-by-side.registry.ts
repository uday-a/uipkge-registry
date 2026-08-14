import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'before-after-side-by-side',
  title: 'Before & After — Side by Side',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two labelled panels set side by side at equal height with a shared annotation row beneath, for comparisons a slider would make harder rather than clearer.',
  files: [{ path: 'BeforeAfterSideBySide.tsx', target: 'components/blocks/BeforeAfterSideBySide.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
