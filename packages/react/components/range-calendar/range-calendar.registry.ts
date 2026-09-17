import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'range-calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  description:
    'Inline from→to calendar grid. Click two dates; the range fills between. For a form field with a trigger, use Date Picker type="range" instead. Same min/max and disabled-date support as Calendar.',
  files: [
    { path: 'RangeCalendar.tsx', target: 'components/ui/range-calendar/RangeCalendar.tsx' },
    { path: 'index.ts', target: 'components/ui/range-calendar/index.ts' },
  ],
  dependencies: ['react-day-picker', 'lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
