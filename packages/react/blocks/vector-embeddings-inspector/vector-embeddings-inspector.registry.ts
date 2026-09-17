import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'vector-embeddings-inspector',
  type: 'registry:block',
  categories: ['ai', 'dashboard', 'database', 'app'],
  description:
    'Pinecone & Qdrant style vector database index inspector, similarity search tester, and dimensionality explorer with cosine distance scoring, vector heatmap visualization, and namespace filtering.',
  framework: 'react',
  files: [{ path: 'VectorEmbeddingsInspector.tsx', target: 'components/blocks/VectorEmbeddingsInspector.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
