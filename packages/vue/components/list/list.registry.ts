import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'list',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'vue',
  description:
    'List and Item row primitives with List, ListItem, ListItemMedia, ListItemContent, ListItemTitle, ListItemDescription, ListItemActions, and ListSubheader for structured rows, settings lists, and feeds.',
  files: [
    { path: 'List.vue', target: 'components/ui/list/List.vue' },
    { path: 'ListItem.vue', target: 'components/ui/list/ListItem.vue' },
    { path: 'ListItemMedia.vue', target: 'components/ui/list/ListItemMedia.vue' },
    { path: 'ListItemContent.vue', target: 'components/ui/list/ListItemContent.vue' },
    { path: 'ListItemTitle.vue', target: 'components/ui/list/ListItemTitle.vue' },
    { path: 'ListItemDescription.vue', target: 'components/ui/list/ListItemDescription.vue' },
    { path: 'ListItemActions.vue', target: 'components/ui/list/ListItemActions.vue' },
    { path: 'ListSubheader.vue', target: 'components/ui/list/ListSubheader.vue' },
    { path: 'index.ts', target: 'components/ui/list/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
