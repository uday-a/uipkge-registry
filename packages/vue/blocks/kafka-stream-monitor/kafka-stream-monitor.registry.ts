import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'kafka-stream-monitor',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'data', 'app'],
  description:
    'Apache Kafka & Redpanda topic stream telemetry dashboard: partition offset monitor, leader broker distribution, consumer group lag tracker, and real-time message payload inspector with deserialized JSON viewer.',
  framework: 'vue',
  files: [{ path: 'KafkaStreamMonitor.vue', target: 'components/blocks/KafkaStreamMonitor.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
