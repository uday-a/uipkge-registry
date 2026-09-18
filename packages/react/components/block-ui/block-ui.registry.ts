import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'block-ui',
  type: 'registry:ui',
  categories: ['feedback', 'utility'],
  framework: 'react',
  description:
    'Overlay that blocks interaction during loading. Wraps content and shows a spinner + message overlay. The blocking prop toggles the blocked state with configurable overlay opacity, color, background blur, and custom icon/message slots. Composes the spinner primitive.',
  files: [
    { path: 'BlockUi.tsx', target: 'components/ui/block-ui/BlockUi.tsx' },
    { path: 'block-ui.variants.ts', target: 'components/ui/block-ui/block-ui.variants.ts' },
    { path: 'index.ts', target: 'components/ui/block-ui/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/spinner.json'],
})
