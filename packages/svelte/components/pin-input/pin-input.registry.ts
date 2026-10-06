import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pin-input',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'One-time-code input — N separate boxes that auto-advance and accept paste. Use for SMS verification, 2FA, and short numeric codes. Length, masking, and per-slot status all configurable.',
  files: [
    { path: 'PinInput.svelte', target: 'components/ui/pin-input/PinInput.svelte' },
    { path: 'PinInputGroup.svelte', target: 'components/ui/pin-input/PinInputGroup.svelte' },
    { path: 'PinInputSeparator.svelte', target: 'components/ui/pin-input/PinInputSeparator.svelte' },
    { path: 'PinInputSlot.svelte', target: 'components/ui/pin-input/PinInputSlot.svelte' },
    { path: 'index.ts', target: 'components/ui/pin-input/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
