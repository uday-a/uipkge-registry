import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'trademark-patent-portfolio',
  type: 'registry:block',
  categories: ['legal', 'app', 'table', 'dashboard'],
  description:
    'USPTO and WIPO intellectual property asset portfolio tracker, patent grant status, jurisdiction coverage, and maintenance fee timeline with docket action workflow.',
  framework: 'vue',
  files: [{ path: 'TrademarkPatentPortfolio.vue', target: 'components/blocks/TrademarkPatentPortfolio.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/table.json',
  ],
})
