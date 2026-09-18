import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'badge',
  type: 'registry:ui',
  categories: ['data-display'],
  description:
    'Small inline label for status, counts, or tags — sits beside other content, not as a standalone control. Seven variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`.',
  files: [
    { path: 'Badge.tsx', target: 'components/ui/badge/Badge.tsx' },
    { path: 'badge.variants.ts', target: 'components/ui/badge/badge.variants.ts' },
    { path: 'index.ts', target: 'components/ui/badge/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@radix-ui/react-slot'],
  registryDependencies: [],
})
