import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'angular',
  description:
    'Inline from→to calendar grid. Click two dates; the range fills between. For a form field with a trigger, use Date Picker type="range" instead. Same min/max and disabled-date support as Calendar.',
  files: [
    { path: 'range-calendar.component.ts', target: 'components/ui/range-calendar/range-calendar.component.ts' },
    { path: 'index.ts', target: 'components/ui/range-calendar/index.ts' },
  ],
  dependencies: [],
  // The react-day-picker engine (day-picker.ts) ships with Calendar.
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/calendar.json'],
})
