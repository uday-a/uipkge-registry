import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'label',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Accessible label (Radix Label port): a native label bound to its control via `for` / `htmlFor`, peer- and group-disabled dimming, and the Radix double-click text-selection guard.',
  files: [
    { path: 'label.component.ts', target: 'components/ui/label/label.component.ts' },
    { path: 'index.ts', target: 'components/ui/label/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
