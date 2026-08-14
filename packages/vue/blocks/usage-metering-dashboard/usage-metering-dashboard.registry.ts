import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'usage-metering-dashboard',
  type: 'registry:block',
  categories: ['finance', 'billing', 'app'],
  description:
    'Real-time consumption metering and overage monitoring dashboard: billing cycle tracking with days remaining, 4 key resource meter cards (API requests, compute hours, vector storage, bandwidth) with color-shifting threshold progress bars and projected month-end usage, projected invoice cost summary with overage breakdown, auto-scale overage protection toggle, email alert threshold selector, and recent usage events audit log.',
  framework: 'vue',
  files: [{ path: 'UsageMeteringDashboard.vue', target: 'components/blocks/UsageMeteringDashboard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
