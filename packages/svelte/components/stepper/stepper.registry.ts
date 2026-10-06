import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stepper',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Multi-step indicator — horizontal or vertical, with completed / current / upcoming states and optional descriptions per step. Use for onboarding wizards and checkout flows.',
  files: [
    { path: 'Stepper.svelte', target: 'components/ui/stepper/Stepper.svelte' },
    { path: 'StepperItem.svelte', target: 'components/ui/stepper/StepperItem.svelte' },
    { path: 'StepperIndicator.svelte', target: 'components/ui/stepper/StepperIndicator.svelte' },
    { path: 'StepperHeader.svelte', target: 'components/ui/stepper/StepperHeader.svelte' },
    { path: 'StepperContent.svelte', target: 'components/ui/stepper/StepperContent.svelte' },
    { path: 'StepperTitle.svelte', target: 'components/ui/stepper/StepperTitle.svelte' },
    { path: 'StepperDescription.svelte', target: 'components/ui/stepper/StepperDescription.svelte' },
    { path: 'StepperStep.svelte', target: 'components/ui/stepper/StepperStep.svelte' },
    { path: 'context.ts', target: 'components/ui/stepper/context.ts' },
    { path: 'stepper.variants.ts', target: 'components/ui/stepper/stepper.variants.ts' },
    { path: 'types.ts', target: 'components/ui/stepper/types.ts' },
    { path: 'index.ts', target: 'components/ui/stepper/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  registryDependencies: [],
})
