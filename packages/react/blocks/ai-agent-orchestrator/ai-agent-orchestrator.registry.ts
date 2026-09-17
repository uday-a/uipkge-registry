import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ai-agent-orchestrator',
  type: 'registry:block',
  categories: ['ai', 'app'],
  description:
    'Multi-agent workflow visualizer and execution graph. Displays real-time agent pipeline topology, active reasoning streams, tool invocation metrics, live code artifact generation, and pipeline control actions.',
  files: [{ path: 'AiAgentOrchestrator.tsx', target: 'components/blocks/AiAgentOrchestrator.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
