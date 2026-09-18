import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'alert',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'vue',
  description:
    'Static, in-flow notice block with a leading icon, title, and description. Use for inline page-level messages — info banners, success confirmations, warning callouts. Two tones: `default` and `destructive`.',
  files: [
    { path: 'Alert.vue', target: 'components/ui/alert/Alert.vue' },
    { path: 'AlertDescription.vue', target: 'components/ui/alert/AlertDescription.vue' },
    { path: 'AlertTitle.vue', target: 'components/ui/alert/AlertTitle.vue' },
    { path: 'alert.variants.ts', target: 'components/ui/alert/alert.variants.ts' },
    { path: 'index.ts', target: 'components/ui/alert/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: [],
})
