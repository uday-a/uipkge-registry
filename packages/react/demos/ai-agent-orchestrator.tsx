import Story from '../../components/story/Story'
import { AiAgentOrchestrator } from '@react-registry-blocks/ai-agent-orchestrator/AiAgentOrchestrator'

export default function AiAgentOrchestratorDemo() {
  return (
    <Story
      title="Default"
      description="Multi-agent workflow visualizer and execution graph with real-time agent topology, reasoning thought streams, tool invocations, live artifact generation, and pipeline controls."
    >
      <AiAgentOrchestrator />
    </Story>
  )
}
