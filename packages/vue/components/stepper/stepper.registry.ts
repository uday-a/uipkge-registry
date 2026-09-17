import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stepper',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'vue',
  description:
    'Multi-step indicator — horizontal or vertical, with completed / current / upcoming states and optional descriptions per step. Use for onboarding wizards and checkout flows.',
  files: [
    { path: 'Stepper.vue', target: 'components/ui/stepper/Stepper.vue' },
    { path: 'StepperItem.vue', target: 'components/ui/stepper/StepperItem.vue' },
    { path: 'StepperIndicator.vue', target: 'components/ui/stepper/StepperIndicator.vue' },
    { path: 'StepperHeader.vue', target: 'components/ui/stepper/StepperHeader.vue' },
    { path: 'StepperContent.vue', target: 'components/ui/stepper/StepperContent.vue' },
    { path: 'StepperTitle.vue', target: 'components/ui/stepper/StepperTitle.vue' },
    { path: 'StepperDescription.vue', target: 'components/ui/stepper/StepperDescription.vue' },
    { path: 'StepperStep.vue', target: 'components/ui/stepper/StepperStep.vue' },
    { path: 'context.ts', target: 'components/ui/stepper/context.ts' },
    { path: 'stepper.variants.ts', target: 'components/ui/stepper/stepper.variants.ts' },
    { path: 'types.ts', target: 'components/ui/stepper/types.ts' },
    { path: 'index.ts', target: 'components/ui/stepper/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: [],
})
