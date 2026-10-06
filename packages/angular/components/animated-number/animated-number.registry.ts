import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'animated-number',
  type: 'registry:ui',
  categories: ['display', 'data'],
  framework: 'angular',
  description:
    'Tweened number display — counts up on mount and smoothly retargets when the value changes. Ease-out cubic via requestAnimationFrame, custom formatter (Intl-ready), delay/stagger support, honors prefers-reduced-motion, SSR-safe.',
  files: [
    { path: 'animated-number.component.ts', target: 'components/ui/animated-number/animated-number.component.ts' },
    { path: 'index.ts', target: 'components/ui/animated-number/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
