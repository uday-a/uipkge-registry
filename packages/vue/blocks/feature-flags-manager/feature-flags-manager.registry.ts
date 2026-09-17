import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-flags-manager',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'app', 'data'],
  description:
    'LaunchDarkly and PostHog style feature flags management dashboard: top header with search and create flag button, summary KPI metric cards, master status switch, percentage rollout indicators, targeting rules summary, environment statuses, and action menus.',
  framework: 'vue',
  files: [{ path: 'FeatureFlagsManager.vue', target: 'components/blocks/FeatureFlagsManager.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
