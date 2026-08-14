import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'webhook-tester',
  type: 'registry:block',
  categories: ['devops', 'api', 'app', 'developer'],
  description:
    'Svix and Stripe style live webhook delivery inspector and event simulator with signature generation, payload editor, and request/response inspection.',
  files: [{ path: 'WebhookTester.tsx', target: 'components/blocks/WebhookTester.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
