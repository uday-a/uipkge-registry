import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'select',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'angular',
  description:
    'Dropdown select primitive — Radix-style single-select (trigger + body-portalled listbox with groups, labels, separators, check indicators, scroll buttons, typeahead and keyboard navigation, popper or item-aligned positioning, form binding), plus a zero-JS styled NativeSelect for lightweight/mobile use.',
  files: [
    { path: 'select.component.ts', target: 'components/ui/select/select.component.ts' },
    { path: 'native-select.component.ts', target: 'components/ui/select/native-select.component.ts' },
    { path: 'index.ts', target: 'components/ui/select/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
