import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pin-input',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'One-time-code input — N separate boxes that auto-advance and accept paste. Use for SMS verification, 2FA, and short numeric codes. Length, masking, and per-slot status all configurable.',
  files: [
    { path: 'pin-input.tsx', target: 'components/ui/pin-input/pin-input.tsx' },
    { path: 'index.ts', target: 'components/ui/pin-input/index.ts' },
  ],
  dependencies: ['input-otp', 'lucide-react'],
  registryDependencies: [],
})
