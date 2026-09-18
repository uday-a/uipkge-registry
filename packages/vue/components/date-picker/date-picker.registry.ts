import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'date-picker',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'vue',
  description:
    'Form date control: trigger + popover + Calendar/RangeCalendar + optional time. Single/multiple/range, week/month/quarter/year pickers, presets, confirm mode, min/max and disabled dates. For an always-visible grid, use Calendar instead.',
  files: [
    { path: 'DatePicker.vue', target: 'components/ui/date-picker/DatePicker.vue' },
    { path: 'index.ts', target: 'components/ui/date-picker/index.ts' },
  ],
  dependencies: ['@internationalized/date', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/calendar.json',
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/range-calendar.json',
    'https://uipkge.dev/r/time-picker.json',
  ],
})
