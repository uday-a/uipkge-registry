import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'masked-input',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Input with a fixed format mask — phone numbers, credit cards, dates, postal codes. Pass a mask string (e.g. `(###) ###-####`) and the input enforces it as the user types. Customizable placeholder character, replacement marker and tokens; blocks invalid keystrokes, filters paste, reports complete / validation, and shows an inline error.',
  files: [
    { path: 'masked-input.component.ts', target: 'components/ui/masked-input/masked-input.component.ts' },
    { path: 'index.ts', target: 'components/ui/masked-input/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: [],
})
