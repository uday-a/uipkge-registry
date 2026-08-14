import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'event-calendar',
  type: 'registry:block',
  categories: ['productivity', 'dashboard'],
  description:
    'Month-view event calendar with stats strip, drag/shift range select, side rail (selected day or range summary), upcoming list, and per-cell/per-event context menus. events / onEventsChange binds the source of truth; eventTypes config maps each type key to its label/icon/color theme so swapping the visual palette is one prop. Built on the use-month-grid headless hook.',
  files: [
    { path: 'EventCalendar.tsx', target: 'components/blocks/event-calendar/EventCalendar.tsx' },
    { path: 'defaults.ts', target: 'components/blocks/event-calendar/defaults.ts' },
    { path: 'types.ts', target: 'components/blocks/event-calendar/types.ts' },
    { path: 'index.ts', target: 'components/blocks/event-calendar/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/use-month-grid.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/skeleton.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/context-menu.json',
  ],
})
