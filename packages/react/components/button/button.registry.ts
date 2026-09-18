import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'button',
  type: 'registry:ui',
  categories: ['control'],
  description:
    'Interactive button component with variants (default, destructive, outline, secondary, ghost, link), sizes, and composite ButtonGroup container for segmented toolbars and split buttons.',
  files: [
    { path: 'Button.tsx', target: 'components/ui/button/Button.tsx' },
    { path: 'ButtonGroup.tsx', target: 'components/ui/button/ButtonGroup.tsx' },
    { path: 'button.variants.ts', target: 'components/ui/button/button.variants.ts' },
    { path: 'index.ts', target: 'components/ui/button/index.ts' },
  ],
  dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
  registryDependencies: [],
})
