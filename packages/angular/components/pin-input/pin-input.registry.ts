import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pin-input',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'One-time-code input — N separate boxes that auto-advance and accept paste. Use for SMS verification, 2FA, and short numeric codes. Length, masking, and per-slot status all configurable.',
  files: [
    { path: 'pin-input.component.ts', target: 'components/ui/pin-input/pin-input.component.ts' },
    { path: 'index.ts', target: 'components/ui/pin-input/index.ts' },
  ],
  dependencies: ['@angular/forms'],
  registryDependencies: [],
})
