import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'access-request-workflow',
  type: 'registry:block',
  categories: ['security', 'iam', 'dashboard'],
  description:
    'Just-In-Time (JIT) IAM temporary privilege escalation request modal and approval queue: governance metrics cards, elevated session countdown timers, approval form dialog, and active session manager with instant revoke and audit logging.',
  framework: 'vue',
  files: [{ path: 'AccessRequestWorkflow.vue', target: 'components/blocks/AccessRequestWorkflow.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
