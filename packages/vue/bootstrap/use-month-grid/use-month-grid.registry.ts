import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-month-grid',
  type: 'registry:hook',
  description:
    'Headless month-grid + drag/shift range-select composable. Returns the 42-cell grid, today/cursor refs, range state, and mouse handlers. Domain-agnostic -- pair with EventCalendar or any month-shaped UI by reading the returned refs. Also exports isoDate / dateFromKey / dayDiff helpers.',
  framework: 'vue',
  files: [{ path: 'useMonthGrid.ts', target: '~/app/composables/useMonthGrid.ts' }],
  dependencies: [],
  registryDependencies: [],
})
