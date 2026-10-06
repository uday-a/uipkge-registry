import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'popper',
  // Internal building block (like Radix's own popper), installed as a dependency, not listed as a component.
  type: 'registry:lib',
  framework: 'angular',
  description:
    'Floating-layer toolkit behind the Angular overlay primitives (dropdown-menu, tooltip, sheet, sidebar): placement with flip + shift, a body portal, an Escape / outside-click dismiss stack, focus trap and scroll lock. The Angular counterpart of what Radix and reka-ui do internally; dependency-free so it runs on any Angular version.',
  files: [
    { path: 'popper.ts', target: 'components/ui/popper/popper.ts' },
    { path: 'index.ts', target: 'components/ui/popper/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
