import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'case-study-filterable-list',
  title: 'Case Studies — Filterable List',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Filterable index of customer stories with industry chips above rows carrying the headline result, stack, and read time, plus an empty state.',
  framework: 'vue',
  files: [{ path: 'CaseStudyFilterableList.vue', target: 'components/blocks/CaseStudyFilterableList.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
