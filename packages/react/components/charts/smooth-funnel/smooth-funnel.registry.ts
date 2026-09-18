import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'smooth-funnel',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/smooth-funnel.',
  files: [
    { path: 'SmoothFunnel.tsx', target: 'components/ui/charts/smooth-funnel/SmoothFunnel.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/smooth-funnel/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
