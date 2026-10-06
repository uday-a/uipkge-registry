import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'textarea',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Multi-line text input with a linked label, five variants (outlined / filled / solo / underlined / plain), density, autoSize with min / max rows, showCount (with formatter), allowClear, prefix / suffix, rule validation, hint / error / success messages and a loading spinner.',
  files: [
    { path: 'textarea.component.ts', target: 'components/ui/textarea/textarea.component.ts' },
    { path: 'index.ts', target: 'components/ui/textarea/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: ['https://uipkge.dev/r/popper.json', 'https://uipkge.dev/r/label.json'],
})
