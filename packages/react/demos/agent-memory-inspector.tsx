import Story from '../../components/story/Story'
import { AgentMemoryInspector } from '@react-registry-blocks/agent-memory-inspector/AgentMemoryInspector'

export default function AgentMemoryInspectorDemo() {
  return (
    <Story
      title="Default"
      description="Mem0/LangGraph-style autonomous AI agent memory store inspector featuring short-term context buffer utilization, long-term episodic memories with confidence scoring, and entity relationship knowledge graph."
    >
      <AgentMemoryInspector />
    </Story>
  )
}
