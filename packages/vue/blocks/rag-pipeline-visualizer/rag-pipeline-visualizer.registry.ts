import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rag-pipeline-visualizer',
  type: 'registry:block',
  categories: ['ai', 'dashboard', 'database', 'app'],
  description:
    'LlamaIndex and LangChain style Retrieval-Augmented Generation (RAG) pipeline debugger and chunk retrieval inspector. Features 5-stage interactive DAG flow, HyDE expansion preview, hybrid dense/sparse search telemetry, cross-encoder reranking, and grounded response synthesis.',
  framework: 'vue',
  files: [{ path: 'RagPipelineVisualizer.vue', target: 'components/blocks/RagPipelineVisualizer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/slider.json',
    'https://uipkge.dev/r/switch.json',
  ],
})
