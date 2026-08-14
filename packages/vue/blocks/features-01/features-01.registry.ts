import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-01',
  title: 'Tabbed Feature Matrix',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive enterprise product feature workbench with live module simulations, dynamic directory filters, real-time payroll calculations, continuous SOC 2 compliance verification, and TypeScript API code viewer.',
  framework: 'vue',
  files: [{ path: 'Features01.vue', target: 'components/blocks/Features01.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
