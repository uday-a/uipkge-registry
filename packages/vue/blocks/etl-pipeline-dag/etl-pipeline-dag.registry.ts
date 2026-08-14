import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'etl-pipeline-dag',
  type: 'registry:block',
  categories: ['devops', 'app', 'analytics'],
  description:
    'Airflow and Dagster style directed acyclic graph (DAG) pipeline visualizer with interactive node execution topologies, health metrics, and terminal stdout log inspector.',
  framework: 'vue',
  files: [{ path: 'EtlPipelineDag.vue', target: 'components/blocks/EtlPipelineDag.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
