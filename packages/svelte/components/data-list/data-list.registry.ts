import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-list',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Vertical key/value list for showing read-only metadata — invoice details, settings summaries, profile fields. Pair items in label/value rows; supports inline edit triggers and trailing actions per row.',
  files: [
    { path: 'DataList.svelte', target: 'components/ui/data-list/DataList.svelte' },
    { path: 'DataListItem.svelte', target: 'components/ui/data-list/DataListItem.svelte' },
    { path: 'index.ts', target: 'components/ui/data-list/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
