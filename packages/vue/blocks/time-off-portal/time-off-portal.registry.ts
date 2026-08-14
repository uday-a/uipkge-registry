import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'time-off-portal',
  type: 'registry:block',
  categories: ['hr', 'app'],
  description:
    'Employee leave management & PTO portal: 4 PTO balance summary cards with progress meters, interactive visual month calendar with approved leave and holiday indicators, leave request dialog and inline form with working day calculations, manager pending approval cards with instant action buttons, upcoming team out-of-office tracker, and company holiday list.',
  framework: 'vue',
  files: [{ path: 'TimeOffPortal.vue', target: 'components/blocks/TimeOffPortal.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
