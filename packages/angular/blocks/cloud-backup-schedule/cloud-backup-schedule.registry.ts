import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cloud-backup-schedule',
  type: 'registry:block',
  categories: ['dashboard', 'devops', 'data'],
  framework: 'angular',
  description:
    'Automated cloud snapshot scheduler with storage quota metering, encryption status, and recent snapshot timeline.',
  files: [
    {
      path: 'cloud-backup-schedule.component.ts',
      target: 'components/blocks/cloud-backup-schedule/cloud-backup-schedule.component.ts',
    },
    { path: 'index.ts', target: 'components/blocks/cloud-backup-schedule/index.ts' },
  ],
  dependencies: ['lucide-angular'],
  registryDependencies: [
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
