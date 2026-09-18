import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'image-cropper',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Single image cropper. Drive look with props: aspectRatio, showZoom, rounded, minZoom, maxZoom, disabled.',
  files: [
    { path: 'ImageCropper.vue', target: 'components/ui/image-cropper/ImageCropper.vue' },
    { path: 'index.ts', target: 'components/ui/image-cropper/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
