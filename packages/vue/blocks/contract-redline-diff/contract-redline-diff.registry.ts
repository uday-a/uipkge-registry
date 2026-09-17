import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'contract-redline-diff',
  type: 'registry:block',
  categories: ['legal', 'app', 'management'],
  description:
    'Ironclad and DocuSign CLM style legal contract redline diff viewer with clause additions, deletions, liability super-cap shift analysis, and attorney comments negotiations sidebar.',
  framework: 'vue',
  files: [{ path: 'ContractRedlineDiff.vue', target: 'components/blocks/ContractRedlineDiff.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
