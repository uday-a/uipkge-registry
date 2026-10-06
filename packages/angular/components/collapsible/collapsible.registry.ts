import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'collapsible',
  type: 'registry:ui',
  categories: ['disclosure'],
  framework: 'angular',
  description:
    'Headless single-region show/hide primitive. Use it when Accordion is overkill — a single toggle reveals one panel of content. Root and trigger are directives, so they can sit on an existing element (asChild).',
  files: [
    { path: 'collapsible.component.ts', target: 'components/ui/collapsible/collapsible.component.ts' },
    { path: 'index.ts', target: 'components/ui/collapsible/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
