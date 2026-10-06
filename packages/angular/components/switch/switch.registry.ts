import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'switch',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'On/off toggle — visual analog of a hardware switch. Use for binary settings where the change takes effect immediately, not for form fields that submit later (use Checkbox there).',
  files: [
    { path: 'switch.component.ts', target: 'components/ui/switch/switch.component.ts' },
    { path: 'index.ts', target: 'components/ui/switch/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
