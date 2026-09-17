import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'webhooks',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'communication'],
  description:
    'Webhook manager in two SectionCards: endpoints with event chips, live success rate and a pause/resume switch, plus a delivery log pairing relative timestamps with HTTP status pills, durations, retry counts and retry actions. Includes an add-endpoint dialog. Stateful demo — swap the stub data for your source.',
  files: [{ path: 'Webhooks.tsx', target: 'components/blocks/Webhooks.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/chip.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/relative-time.json',
    'https://uipkge.dev/r/section-card.json',
  ],
})
