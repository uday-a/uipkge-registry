import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'attachment',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'vue',
  description:
    'Single file or image chip. Drive look with props: state, size, orientation, media, src, removable. Not a dropzone (see file-upload).',
  files: [
    { path: 'Attachment.vue', target: 'components/ui/attachment/Attachment.vue' },
    { path: 'attachment.variants.ts', target: 'components/ui/attachment/attachment.variants.ts' },
    { path: 'index.ts', target: 'components/ui/attachment/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: [],
})
