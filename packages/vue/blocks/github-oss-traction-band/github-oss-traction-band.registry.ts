import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'github-oss-traction-band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Open source community traction and velocity band with real-time star metrics, recent releases changelog feed, and quickstart CLI install terminal.',
  framework: 'vue',
  files: [{ path: 'GithubOssTractionBand.vue', target: 'components/blocks/GithubOssTractionBand.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
