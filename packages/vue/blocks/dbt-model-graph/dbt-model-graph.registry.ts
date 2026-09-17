import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dbt-model-graph',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'dbt Cloud style data modeling DAG dependency graph, compiled SQL view, and model documentation with lineage tree, Jinja/SQL source editor, compiled warehouse query, and column contract test suite.',
  framework: 'vue',
  files: [{ path: 'DbtModelGraph.vue', target: 'components/blocks/DbtModelGraph.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
