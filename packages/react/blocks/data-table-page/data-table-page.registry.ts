import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-table-page',
  type: 'registry:block',
  categories: ['layout', 'app', 'data'],
  description:
    'Full admin table page: toolbar with title, live row count, search, status filter, column-visibility dropdown, and a New action; a selectable user table (checkbox select-all with indeterminate state, avatar + name/email cells, role and color-coded status badges, relative last-active times, per-row kebab menu); a bulk-action bar with Export/Delete when rows are selected; and a pagination footer. Search and status filtering are functional against the stub rows; swap the data for your source.',
  files: [{ path: 'DataTablePage.tsx', target: 'components/blocks/DataTablePage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/table.json',
  ],
})
