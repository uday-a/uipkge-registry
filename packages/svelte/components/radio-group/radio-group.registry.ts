import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'radio-group',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Single-selection group of radio inputs. Vertical or horizontal layout, optional descriptions per item, and full keyboard navigation. Pair with Form for validation messages.',
  files: [
    { path: 'RadioGroup.svelte', target: 'components/ui/radio-group/RadioGroup.svelte' },
    { path: 'RadioGroupItem.svelte', target: 'components/ui/radio-group/RadioGroupItem.svelte' },
    { path: 'RadioButton.svelte', target: 'components/ui/radio-group/RadioButton.svelte' },
    { path: 'index.ts', target: 'components/ui/radio-group/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
