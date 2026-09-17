import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'advance-select',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Searchable, async-capable select with keyboard navigation, multi-select, and option grouping. Drop in when the native `<select>` or the basic Select primitive runs out of room — large lists, debounced server-side filtering, custom rendered items.',
  files: [
    { path: 'advance-select.tsx', target: 'components/ui/advance-select/advance-select.tsx' },
    { path: 'types.ts', target: 'components/ui/advance-select/types.ts' },
    { path: 'index.ts', target: 'components/ui/advance-select/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/command.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/select.json',
  ],
})
