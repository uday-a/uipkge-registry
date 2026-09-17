import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cron-job-scheduler',
  type: 'registry:block',
  categories: ['devops', 'app', 'dashboard'],
  description:
    'Temporal and AWS EventBridge style scheduled tasks and background cron worker manager with KPI overview, status indicators, execution details, action menus, and an interactive cron expression builder with upcoming run previews.',
  files: [{ path: 'CronJobScheduler.tsx', target: 'components/blocks/CronJobScheduler.tsx' }],
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
