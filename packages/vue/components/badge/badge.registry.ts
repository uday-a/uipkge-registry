import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'badge',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'vue',
  description:
    'Small inline label for status, counts, or tags — sits beside other content, not as a standalone control. Seven variants: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `info`.',
  files: [
    { path: 'Badge.vue', target: 'components/ui/badge/Badge.vue' },
    { path: 'badge.variants.ts', target: 'components/ui/badge/badge.variants.ts' },
    { path: 'index.ts', target: 'components/ui/badge/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'class-variance-authority', 'reka-ui'],
  registryDependencies: [],
})
