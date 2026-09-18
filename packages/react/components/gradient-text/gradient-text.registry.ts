import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'gradient-text',
  type: 'registry:ui',
  categories: ['display', 'typography'],
  framework: 'react',
  description:
    'Applies a CSS gradient as text color via background-clip: text. Supports preset gradients (sunset, ocean, forest, fire, candy, aurora, rainbow, gold, neon, grape), custom from/to colors with a direction, a fully custom CSS gradient string, and an animated mode that shifts the gradient.',
  files: [
    { path: 'GradientText.tsx', target: 'components/ui/gradient-text/GradientText.tsx' },
    { path: 'gradient-text.variants.ts', target: 'components/ui/gradient-text/gradient-text.variants.ts' },
    { path: 'index.ts', target: 'components/ui/gradient-text/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@radix-ui/react-slot'],
  registryDependencies: [],
})
