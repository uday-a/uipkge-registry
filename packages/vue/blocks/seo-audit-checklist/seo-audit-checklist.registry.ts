import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'seo-audit-checklist',
  type: 'registry:block',
  categories: ['marketing', 'dashboard'],
  description:
    'Ahrefs and SEMrush style on-page SEO analyzer, meta tag auditor, Google SERP snippet preview simulator, heading hierarchy validator, and Core Web Vitals checklist.',
  framework: 'vue',
  files: [{ path: 'SeoAuditChecklist.vue', target: 'components/blocks/SeoAuditChecklist.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
