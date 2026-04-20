import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'calendar',
  type: 'registry:ui',
  categories: ['date-time'],
  description:
    'Single-month calendar grid for date selection (react-day-picker). Use inline or in a custom popover. For form fields, use Date Picker. Supports min/max, disabled dates, multi-month, and locale.',
  files: [
    { path: 'Calendar.tsx', target: 'components/ui/calendar/Calendar.tsx' },
    { path: 'index.ts', target: 'components/ui/calendar/index.ts' },
  ],
  dependencies: ['react-day-picker', 'lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
