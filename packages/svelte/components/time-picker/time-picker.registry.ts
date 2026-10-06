import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'time-picker',
  type: 'registry:ui',
  categories: ['date-time'],
  framework: 'svelte',
  description:
    'Standalone time input — hours, minutes, optional seconds, and 12h/24h modes. Pairs with Date Picker for full datetime entry.',
  files: [
    { path: 'TimeColumns.svelte', target: 'components/ui/time-picker/TimeColumns.svelte' },
    { path: 'TimePicker.svelte', target: 'components/ui/time-picker/TimePicker.svelte' },
    { path: 'TimeRangePicker.svelte', target: 'components/ui/time-picker/TimeRangePicker.svelte' },
    { path: 'index.ts', target: 'components/ui/time-picker/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
