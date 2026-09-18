import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'alert-modal',
  type: 'registry:ui',
  categories: ['overlay'],
  description:
    'Props-driven shortcut for confirm and destructive prompts — pass `title`, `description`, `actionLabel`, and a `tone` and you get a fully styled modal with a leading icon ring, action button, and optional async loading state. Skip it and use Dialog when you need a free-form modal instead.',
  files: [
    { path: 'alert-modal.tsx', target: 'components/ui/alert-modal/alert-modal.tsx' },
    { path: 'index.ts', target: 'components/ui/alert-modal/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/dialog.json', 'https://uipkge.dev/r/button.json'],
})
