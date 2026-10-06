import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tooltip',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Small popover triggered by hover/focus, used for short labels — icon-button names, abbreviation expansions, keyboard shortcuts. Positioned by the built-in popper (flips and shifts to stay on screen) and respects `prefers-reduced-motion`.',
  files: [
    { path: 'tooltip.component.ts', target: 'components/ui/tooltip/tooltip.component.ts' },
    { path: 'index.ts', target: 'components/ui/tooltip/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
