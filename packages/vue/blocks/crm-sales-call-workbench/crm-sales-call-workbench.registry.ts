import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'crm-sales-call-workbench',
  type: 'registry:block',
  categories: ['communication', 'app', 'crm'],
  description:
    'Live CRM sales call console with audio waveform dialer, real-time AI live transcription, objection handling battlecards, and CRM note logger.',
  framework: 'vue',
  files: [{ path: 'CrmSalesCallWorkbench.vue', target: 'components/blocks/CrmSalesCallWorkbench.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
