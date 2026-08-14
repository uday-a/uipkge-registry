import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'code-diff-review',
  title: 'Code — Diff Review',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Unified diff panel with added and removed lines, a file path header, a reviewer note anchored to a line, and a summary bar counting the changes.',
  framework: 'vue',
  files: [{ path: 'CodeDiffReview.vue', target: 'components/blocks/CodeDiffReview.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
