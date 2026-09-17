import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ai-crm-pipeline-dashboard',
  type: 'registry:block',
  categories: ['marketing', 'dashboard', 'data'],
  description:
    'High-craft AI CRM deal pipeline, deal velocity, AI win probability scoring, and sales activity tracker inspired by Wise / revenue intelligence platforms. Features revenue velocity metrics, 4-stage pipeline Kanban board with predictive win scores, deal progress bars, and AI meeting summaries with buying intent detection.',
  framework: 'vue',
  files: [{ path: 'AiCrmPipelineDashboard.vue', target: 'components/blocks/AiCrmPipelineDashboard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
