import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'angular',
  description:
    'Single-month calendar grid for date selection (react-day-picker semantics, native Date). Use inline or in a custom popover. For form fields, use Date Picker. Supports min/max, disabled dates, multi-month, and locale.',
  files: [
    { path: 'calendar.component.ts', target: 'components/ui/calendar/calendar.component.ts' },
    { path: 'day-picker.ts', target: 'components/ui/calendar/day-picker.ts' },
    { path: 'index.ts', target: 'components/ui/calendar/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
