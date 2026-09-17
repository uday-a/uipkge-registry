import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'stream-processing-flink-topology',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'data', 'app'],
  description:
    'Apache Flink & RisingWave stateful streaming graph: real-time DAG topology, window throughput, checkpointing duration, RocksDB state inspector, and backpressure heat monitor.',
  files: [
    {
      path: 'StreamProcessingFlinkTopology.tsx',
      target: 'components/blocks/StreamProcessingFlinkTopology.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
