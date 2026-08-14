import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-retention-policy-manager',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'app', 'data'],
  description:
    'Snowflake and BigQuery style automated data retention policy manager, partition TTL scheduler, and cold storage archive tiering with cost impact metrics, lifecycle action execution, and compliance tracking.',
  framework: 'vue',
  files: [{ path: 'DataRetentionPolicyManager.vue', target: 'components/blocks/DataRetentionPolicyManager.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
