import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'alert',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Static, in-flow notice block with a leading icon, title, and description. Use for inline page-level messages — info banners, success confirmations, warning callouts. Two tones: `default` and `destructive`.',
  files: [
    { path: 'Alert.svelte', target: 'components/ui/alert/Alert.svelte' },
    { path: 'AlertDescription.svelte', target: 'components/ui/alert/AlertDescription.svelte' },
    { path: 'AlertTitle.svelte', target: 'components/ui/alert/AlertTitle.svelte' },
    { path: 'alert.variants.ts', target: 'components/ui/alert/alert.variants.ts' },
    { path: 'index.ts', target: 'components/ui/alert/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@lucide/svelte'],
  registryDependencies: [],
})
