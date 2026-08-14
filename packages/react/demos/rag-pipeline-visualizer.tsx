import * as React from 'react'
import Story from '../../components/story/Story'
import { RagPipelineVisualizer } from '@react-registry-blocks/rag-pipeline-visualizer/RagPipelineVisualizer'

export default function RagPipelineVisualizerDemo() {
  return (
    <>
      <Story
        title="RAG Pipeline Visualizer"
        description="LlamaIndex and LangChain style Retrieval-Augmented Generation (RAG) pipeline debugger and chunk retrieval inspector. Features 5-stage interactive DAG flow, HyDE expansion preview, hybrid dense/sparse search telemetry, cross-encoder reranking, and grounded response synthesis."
      >
        <RagPipelineVisualizer />
      </Story>
    </>
  )
}
