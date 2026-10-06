import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'image-cropper',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Single image cropper: drag / arrow keys to pan, wheel / + / - / range to zoom, cover-scaled with clamped panning. Drive look with aspectRatio, showZoom, rounded, minZoom, maxZoom, disabled; export with getCroppedCanvas() / getCroppedBlob().',
  files: [
    { path: 'image-cropper.component.ts', target: 'components/ui/image-cropper/image-cropper.component.ts' },
    { path: 'index.ts', target: 'components/ui/image-cropper/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
