import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stepper',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Multi-step indicator — horizontal or vertical, with completed / active / pending / error states, animated connectors, click-back navigation, disabled steps, icon templates and optional descriptions. Use for onboarding wizards and checkout flows.',
  files: [
    { path: 'stepper.component.ts', target: 'components/ui/stepper/stepper.component.ts' },
    { path: 'stepper.variants.ts', target: 'components/ui/stepper/stepper.variants.ts' },
    { path: 'index.ts', target: 'components/ui/stepper/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})
