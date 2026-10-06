import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'video',
  type: 'registry:ui',
  categories: ['media', 'display'],
  framework: 'svelte',
  description:
    'Video player wrapper with a custom controls overlay on a native video element. Supports src, poster, autoplay, loop, muted, custom or native controls, playback rate, fullscreen, time display, a progress bar, play/pause, skip, and volume control.',
  files: [
    { path: 'Video.svelte', target: 'components/ui/video/Video.svelte' },
    { path: 'index.ts', target: 'components/ui/video/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
