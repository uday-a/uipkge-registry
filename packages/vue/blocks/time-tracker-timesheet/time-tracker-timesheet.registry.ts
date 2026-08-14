import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'time-tracker-timesheet',
  type: 'registry:block',
  categories: ['productivity', 'app', 'billing'],
  description:
    'Toggl/Harvest-style live time tracker with active running stopwatch, project rate selection, billable status toggle, 4 weekly summary metric cards, and daily grouped timesheet activity ledger with resume actions.',
  framework: 'vue',
  files: [{ path: 'TimeTrackerTimesheet.vue', target: 'components/blocks/TimeTrackerTimesheet.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
