import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'audit-log',
  type: 'registry:block',
  categories: ['legal', 'dashboard', 'data'],
  description:
    'Admin activity trail in a SectionCard: live indicator, search across actor/target, action-type filter, and rows pairing an avatar actor with a color-coded action badge, monospace target, IP and relative timestamp. Filtering is functional against the `entries` prop; swap the stub data for your source.',
  framework: 'vue',
  files: [{ path: 'AuditLog.vue', target: 'components/blocks/AuditLog.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/relative-time.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/select.json',
  ],
})
