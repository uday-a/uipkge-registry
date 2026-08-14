import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'training-compliance-tracker',
  type: 'registry:block',
  categories: ['hr', 'app', 'security'],
  description:
    'Annual mandatory employee compliance training dashboard with certification badges, renewal deadlines, assessment scorecards, verified credential preview modal, and certificate export controls.',
  framework: 'vue',
  files: [{ path: 'TrainingComplianceTracker.vue', target: 'components/blocks/TrainingComplianceTracker.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
