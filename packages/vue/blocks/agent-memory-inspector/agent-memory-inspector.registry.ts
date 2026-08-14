import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'agent-memory-inspector',
  type: 'registry:block',
  categories: ['ai', 'app'],
  description:
    'Autonomous AI agent memory inspector featuring short-term context buffer utilization, long-term episodic vector memories with confidence scoring, and Neo4j-style entity relationship knowledge graph.',
  framework: 'vue',
  files: [{ path: 'AgentMemoryInspector.vue', target: 'components/blocks/AgentMemoryInspector.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
