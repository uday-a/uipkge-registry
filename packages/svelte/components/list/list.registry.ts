import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'list',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'List and Item row primitives with List, ListItem, ListItemMedia, ListItemContent, ListItemTitle, ListItemDescription, ListItemActions, and ListSubheader for structured rows, settings lists, and feeds.',
  files: [
    { path: 'List.svelte', target: 'components/ui/list/List.svelte' },
    { path: 'ListItem.svelte', target: 'components/ui/list/ListItem.svelte' },
    { path: 'ListItemMedia.svelte', target: 'components/ui/list/ListItemMedia.svelte' },
    { path: 'ListItemContent.svelte', target: 'components/ui/list/ListItemContent.svelte' },
    { path: 'ListItemTitle.svelte', target: 'components/ui/list/ListItemTitle.svelte' },
    { path: 'ListItemDescription.svelte', target: 'components/ui/list/ListItemDescription.svelte' },
    { path: 'ListItemActions.svelte', target: 'components/ui/list/ListItemActions.svelte' },
    { path: 'ListSubheader.svelte', target: 'components/ui/list/ListSubheader.svelte' },
    { path: 'index.ts', target: 'components/ui/list/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
