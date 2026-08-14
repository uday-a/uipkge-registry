import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'before-after-toggle',
  title: 'Before & After — Toggle',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Single panel toggling between the old and new state of the same screen, with a caption naming what changed and a control that keeps its position between switches.',
  files: [{ path: 'BeforeAfterToggle.tsx', target: 'components/blocks/BeforeAfterToggle.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
