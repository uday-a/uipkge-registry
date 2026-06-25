import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stepper',
  type: 'registry:ui',
  categories: ['navigation'],
  description:
    'Multi-step indicator — horizontal or vertical, with completed / current / upcoming states and optional descriptions per step. Use for onboarding wizards and checkout flows.',
  files: [
    { path: 'stepper.tsx', target: 'components/ui/stepper/stepper.tsx' },
    { path: 'context.ts', target: 'components/ui/stepper/context.ts' },
    { path: 'stepper.variants.ts', target: 'components/ui/stepper/stepper.variants.ts' },
    { path: 'types.ts', target: 'components/ui/stepper/types.ts' },
    { path: 'index.ts', target: 'components/ui/stepper/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-react'],
  registryDependencies: [],
})
