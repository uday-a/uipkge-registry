import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-month-grid',
  type: 'registry:hook',
  description:
    'Headless month-grid + drag/shift range-select hook (Svelte 5 runes). Returns the 42-cell grid, today/cursor state, range state, and mouse handlers. Domain-agnostic -- pair with EventCalendar or any month-shaped UI by reading the returned getters. Also exports isoDate / dateFromKey / dayDiff helpers.',
  framework: 'svelte',
  files: [{ path: 'useMonthGrid.svelte.ts', target: 'lib/composables/useMonthGrid.svelte.ts' }],
  dependencies: [],
  registryDependencies: [],
})
