<script setup lang="ts">
import VectorEmbeddingsInspector from '@/components/blocks/vector-embeddings-inspector/VectorEmbeddingsInspector.vue'
</script>

<template>
  <Story
    title="Vector Embeddings Inspector"
    description="Pinecone & Qdrant style vector database index inspector, similarity search tester, and dimensionality explorer. Features index telemetry metrics, interactive query playground with cosine similarity ranking, top-k and namespace filtering, and a color-coded 32-sample float vector heatmap visualizer."
  >
    <VectorEmbeddingsInspector />
  </Story>
</template>
