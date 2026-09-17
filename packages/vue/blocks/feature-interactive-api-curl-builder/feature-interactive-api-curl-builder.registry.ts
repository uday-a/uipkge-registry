import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-interactive-api-curl-builder',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'vue',
  description: 'Interactive API cURL builder and live payload testing sandbox with multi-language code export.',
  files: [
    {
      path: 'FeatureInteractiveApiCurlBuilder.vue',
      target: 'components/blocks/feature-interactive-api-curl-builder/FeatureInteractiveApiCurlBuilder.vue',
    },
    { path: 'index.ts', target: 'components/blocks/feature-interactive-api-curl-builder/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})
