import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cta-split-demo-request-modal',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Split-pane enterprise demo request workbench with benefit highlights, team size selectors, framework focus filters, and interactive submission feedback.',
  framework: 'vue',
  files: [{ path: 'CtaSplitDemoRequestModal.vue', target: 'components/blocks/CtaSplitDemoRequestModal.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
  ],
})
