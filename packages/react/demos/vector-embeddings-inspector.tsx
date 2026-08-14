import * as React from 'react'
import Story from '../../components/story/Story'
import { VectorEmbeddingsInspector } from '@react-registry-blocks/vector-embeddings-inspector/VectorEmbeddingsInspector'

export default function VectorEmbeddingsInspectorDemo() {
  return (
    <>
      <Story
        title="Vector Embeddings Inspector"
        description="Pinecone & Qdrant style vector database index inspector, similarity search tester, and dimensionality explorer. Features index telemetry metrics, interactive query playground with cosine similarity ranking, top-k and namespace filtering, and a color-coded 32-sample float vector heatmap visualizer."
      >
        <VectorEmbeddingsInspector />
      </Story>
    </>
  )
}
