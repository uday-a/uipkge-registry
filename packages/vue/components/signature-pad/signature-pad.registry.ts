import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'signature-pad',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'vue',
  description:
    'Canvas-based digital signature capture with pointer events (mouse + touch). v-model emits a PNG data URL, with pen color/thickness, background, clear method, disabled/readonly states, and a live point count.',
  files: [
    { path: 'SignaturePad.vue', target: 'components/ui/signature-pad/SignaturePad.vue' },
    { path: 'signature-pad.variants.ts', target: 'components/ui/signature-pad/signature-pad.variants.ts' },
    { path: 'index.ts', target: 'components/ui/signature-pad/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: [],
})
