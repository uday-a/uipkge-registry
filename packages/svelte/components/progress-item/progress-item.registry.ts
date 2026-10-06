import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-item',
  type: 'registry:ui',
  categories: ['feedback'],
  framework: 'svelte',
  description:
    'Labeled progress row — item name on the left, progress bar in the middle, percent or count on the right. Use for batched task lists, file upload queues, or onboarding checklists.',
  files: [
    { path: 'ProgressItem.svelte', target: 'components/ui/progress-item/ProgressItem.svelte' },
    { path: 'index.ts', target: 'components/ui/progress-item/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/progress.json'],
})
