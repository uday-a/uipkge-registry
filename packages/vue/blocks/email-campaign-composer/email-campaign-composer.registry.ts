import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'email-campaign-composer',
  type: 'registry:block',
  categories: ['marketing', 'app', 'dashboard'],
  description:
    'High-craft marketing email broadcast designer, audience segment selector, AI subject line optimizer, A/B testing split, live multi-device newsletter preview, and deliverability scorecard.',
  framework: 'vue',
  files: [{ path: 'EmailCampaignComposer.vue', target: 'components/blocks/EmailCampaignComposer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
  ],
})
