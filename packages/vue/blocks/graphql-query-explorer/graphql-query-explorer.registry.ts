import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'graphql-query-explorer',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Apollo and GraphiQL style GraphQL query builder and response inspector with schema documentation sidebar, syntax-highlighted query & variables editor, query history presets, execution tracing, and formatted JSON response viewer.',
  framework: 'vue',
  files: [{ path: 'GraphqlQueryExplorer.vue', target: 'components/blocks/GraphqlQueryExplorer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
