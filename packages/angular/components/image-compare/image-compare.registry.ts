import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'image-compare',
  type: 'registry:ui',
  categories: ['display', 'media'],
  framework: 'angular',
  description:
    'Before/after image comparison slider with a draggable divider. Two images overlaid via clip-path, pointer-driven (mouse + touch), horizontal or vertical orientation, custom handle template, labels, and disabled state.',
  files: [
    { path: 'image-compare.component.ts', target: 'components/ui/image-compare/image-compare.component.ts' },
    { path: 'image-compare.variants.ts', target: 'components/ui/image-compare/image-compare.variants.ts' },
    { path: 'index.ts', target: 'components/ui/image-compare/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
