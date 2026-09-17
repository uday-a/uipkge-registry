import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'empty-states',
  type: 'registry:block',
  categories: ['layout', 'feedback', 'display'],
  description:
    'Gallery of six zero-data cards — no data, no search results, first-use, error recovery, no access, and sync complete — each with a matching isometric illustration, title, copy, and action pair. `variant` picks a single card, `size` compacts it, `layout` switches grid vs list. Override title, description, image, labels, hrefs, and callbacks. Pass `image=""` to hide the art.',
  files: [{ path: 'EmptyStates.tsx', target: 'components/blocks/EmptyStates.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
