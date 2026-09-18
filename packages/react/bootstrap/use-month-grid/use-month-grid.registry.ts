import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-month-grid',
  type: 'registry:hook',
  description:
    'Headless month-grid + drag/shift range-select hook. Returns the 42-cell grid, today/cursor state, range state, and mouse handlers. Domain-agnostic -- pair with EventCalendar or any month-shaped UI by reading the returned values. Also exports isoDate / dateFromKey / dayDiff helpers.',
  files: [{ path: 'useMonthGrid.ts', target: 'lib/use-month-grid.ts' }],
  dependencies: [],
  registryDependencies: [],
})
