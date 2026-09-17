<script setup lang="ts">
import RagPipelineVisualizer from '@/components/blocks/rag-pipeline-visualizer/RagPipelineVisualizer.vue'
</script>

<template>
  <Story
    title="RAG Pipeline Visualizer"
    description="LlamaIndex and LangChain style Retrieval-Augmented Generation (RAG) pipeline debugger and chunk retrieval inspector. Features 5-stage interactive DAG flow, HyDE expansion preview, hybrid dense/sparse search telemetry, cross-encoder reranking, and grounded response synthesis."
  >
    <RagPipelineVisualizer />
  </Story>
</template>
