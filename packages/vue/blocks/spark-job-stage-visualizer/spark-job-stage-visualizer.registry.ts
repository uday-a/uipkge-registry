import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'spark-job-stage-visualizer',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'analytics', 'data', 'app'],
  description:
    'Databricks and Apache Spark distributed job execution DAG visualizer with stage performance metrics, task skew distribution quantiles, and executor JVM GC telemetry.',
  framework: 'vue',
  files: [{ path: 'SparkJobStageVisualizer.vue', target: 'components/blocks/SparkJobStageVisualizer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
