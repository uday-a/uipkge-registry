import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'image-cropper',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Single image cropper. Drive look with props: aspectRatio, showZoom, rounded, minZoom, maxZoom, disabled.',
  files: [
    { path: 'image-cropper.tsx', target: 'components/ui/image-cropper/image-cropper.tsx' },
    { path: 'index.ts', target: 'components/ui/image-cropper/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
