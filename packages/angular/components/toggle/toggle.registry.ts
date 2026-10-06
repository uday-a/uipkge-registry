import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'toggle',
  type: 'registry:ui',
  categories: ['action'],
  framework: 'angular',
  description:
    'Two-state press-and-latch button (Radix Toggle): controlled pressed or uncontrolled defaultPressed with pressedChange, aria-pressed + data-state, default / outline variants and three sizes. Doubles as a form control.',
  files: [
    { path: 'toggle.component.ts', target: 'components/ui/toggle/toggle.component.ts' },
    { path: 'toggle.variants.ts', target: 'components/ui/toggle/toggle.variants.ts' },
    { path: 'index.ts', target: 'components/ui/toggle/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@angular/forms'],
  registryDependencies: [],
})
