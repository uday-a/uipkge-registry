import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'quick-actions',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'Vertical list of clickable shortcuts in a SectionCard. Pass linkComponent (Next.js Link or your router Link) for SPA routing.',
  files: [{ path: 'QuickActions.tsx', target: 'components/blocks/QuickActions.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/section-card.json', 'https://uipkge.dev/r/icon-box.json'],
})
