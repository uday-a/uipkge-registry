import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'aspect-ratio',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'vue',
  description:
    'Wraps content (typically images, video, or iframes) at a fixed width:height ratio so it never letterboxes or jumps as it loads. Common ratios: 16/9 for video, 1/1 for avatars, 4/3 for cards.',
  files: [
    { path: 'AspectRatio.vue', target: 'components/ui/aspect-ratio/AspectRatio.vue' },
    { path: 'index.ts', target: 'components/ui/aspect-ratio/index.ts' },
  ],
  dependencies: ['reka-ui'],
  registryDependencies: [],
})
