import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'secrets-rotation-scheduler',
  type: 'registry:block',
  categories: ['security', 'app', 'devops', 'dashboard'],
  description:
    'AWS Secrets Manager style automated credential rotation scheduler and security key audit with lifecycle telemetry cards, zero-downtime dual-version rotation workflow, rotation lambda log inspection, and schedule configuration dialogs.',
  files: [{ path: 'SecretsRotationScheduler.tsx', target: 'components/blocks/SecretsRotationScheduler.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
