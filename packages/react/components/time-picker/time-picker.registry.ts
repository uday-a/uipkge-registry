import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'time-picker',
  type: 'registry:ui',
  categories: ['date-time'],
  description:
    'Standalone time input — hours, minutes, optional seconds, and 12h/24h modes. Pairs with Date Picker for full datetime entry.',
  files: [
    { path: 'time-picker.tsx', target: 'components/ui/time-picker/time-picker.tsx' },
    { path: 'index.ts', target: 'components/ui/time-picker/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/scroll-area.json',
  ],
})
