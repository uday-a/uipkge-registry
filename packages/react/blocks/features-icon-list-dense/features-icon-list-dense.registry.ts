import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-icon-list-dense',
  title: 'Features — Dense Icon List',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Compact three-column list of twelve capabilities with small icons and one-line descriptions, for the lower half of a landing page where breadth matters more than depth.',
  files: [{ path: 'FeaturesIconListDense.tsx', target: 'components/blocks/FeaturesIconListDense.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
