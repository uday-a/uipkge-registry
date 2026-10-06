import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'signature-pad',
  type: 'registry:ui',
  categories: ['control', 'form'],
  framework: 'angular',
  description:
    'Canvas-based digital signature capture with pointer events (mouse + touch). The value is a PNG data URL (modelValue / modelChange, form control), with pen color/thickness, background, clear / export methods, an actions template, disabled/readonly states, and a live point count.',
  files: [
    { path: 'signature-pad.component.ts', target: 'components/ui/signature-pad/signature-pad.component.ts' },
    { path: 'signature-pad.variants.ts', target: 'components/ui/signature-pad/signature-pad.variants.ts' },
    { path: 'index.ts', target: 'components/ui/signature-pad/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@angular/forms'],
  registryDependencies: [],
})
