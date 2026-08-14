import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'support-ticket-detail',
  type: 'registry:block',
  categories: ['communication', 'app', 'support'],
  description:
    'Customer support ticket conversation thread, SLA monitor & staff workbench with internal notes, canned response macros, and customer metadata sidebar.',
  framework: 'vue',
  files: [{ path: 'SupportTicketDetail.vue', target: 'components/blocks/SupportTicketDetail.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
