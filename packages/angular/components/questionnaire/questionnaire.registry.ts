import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'questionnaire',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Single multi-step question component. Pass items, shortcuts, and showProgress — variants are props, not extra files.',
  files: [
    { path: 'questionnaire.component.ts', target: 'components/ui/questionnaire/questionnaire.component.ts' },
    { path: 'questionnaire.variants.ts', target: 'components/ui/questionnaire/questionnaire.variants.ts' },
    { path: 'types.ts', target: 'components/ui/questionnaire/types.ts' },
    { path: 'index.ts', target: 'components/ui/questionnaire/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/kbd.json'],
})
