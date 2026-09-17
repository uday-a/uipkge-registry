import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'faq-categorized-tabs',
  title: 'FAQ — Categorized Tabs',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Question set grouped behind category tabs, each panel holding its own accordion with a count badge, for support pages where one flat list would run past thirty entries.',
  framework: 'vue',
  files: [{ path: 'FaqCategorizedTabs.vue', target: 'components/blocks/FaqCategorizedTabs.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
