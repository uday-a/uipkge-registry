import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'spinner',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Lightweight loading indicator — circular spinner with three sizes and tone variants. Use inside buttons (replacing the icon when an action is in flight) or as a centered page loader.',
  files: [
    { path: 'Spinner.svelte', target: 'components/ui/spinner/Spinner.svelte' },
    { path: 'spinner.variants.ts', target: 'components/ui/spinner/spinner.variants.ts' },
    { path: 'index.ts', target: 'components/ui/spinner/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  registryDependencies: [],
})
