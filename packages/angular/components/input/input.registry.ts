import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'input',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'angular',
  description:
    'Text input — single-line. Three sizes, three variants (outlined / filled / borderless), error / warning status, prefix / suffix (text or ng-template), addonBefore / addonAfter, allow-clear, password toggle, char count, and composite InputGroup with addons and action buttons.',
  files: [
    { path: 'input.component.ts', target: 'components/ui/input/input.component.ts' },
    { path: 'index.ts', target: 'components/ui/input/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
