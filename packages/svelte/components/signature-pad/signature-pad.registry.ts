import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'signature-pad',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'svelte',
  description:
    'Canvas-based digital signature capture with pointer events (mouse + touch). bind:value emits a PNG data URL, with pen color/thickness, background, clear method, disabled/readonly states, and a live point count.',
  files: [
    { path: 'SignaturePad.svelte', target: 'components/ui/signature-pad/SignaturePad.svelte' },
    { path: 'signature-pad.variants.ts', target: 'components/ui/signature-pad/signature-pad.variants.ts' },
    { path: 'index.ts', target: 'components/ui/signature-pad/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  registryDependencies: [],
})
