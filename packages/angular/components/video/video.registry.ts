import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'video',
  type: 'registry:ui',
  categories: ['media', 'display'],
  framework: 'angular',
  description:
    'Video player wrapper with a custom controls overlay on a native video element. Supports src, poster, autoplay, loop, muted, custom or native controls, playback rate, fullscreen, time display, progress bar, play/pause, skip, and volume.',
  files: [
    { path: 'video.component.ts', target: 'components/ui/video/video.component.ts' },
    { path: 'index.ts', target: 'components/ui/video/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
