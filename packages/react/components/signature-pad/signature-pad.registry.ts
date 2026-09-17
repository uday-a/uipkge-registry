import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'signature-pad',
  type: 'registry:ui',
  categories: ['control', 'form'],
  description:
    'Canvas-based digital signature capture with pointer events (mouse + touch). The value is a PNG data URL, with pen color/thickness, background, clear method, disabled/readonly states, and a live point count.',
  files: [
    { path: 'SignaturePad.tsx', target: 'components/ui/signature-pad/SignaturePad.tsx' },
    { path: 'signature-pad.variants.ts', target: 'components/ui/signature-pad/signature-pad.variants.ts' },
    { path: 'index.ts', target: 'components/ui/signature-pad/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-react'],
  registryDependencies: [],
})
