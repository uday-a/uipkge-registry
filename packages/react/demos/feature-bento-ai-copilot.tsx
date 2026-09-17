import { FeatureBentoAiCopilot } from '@/components/blocks/feature-bento-ai-copilot'
import { Story } from '@/components/story/Story'

export default function FeatureBentoAiCopilotDemo() {
  return (
    <Story
      title="Default"
      description="AI Copilot workbench bento with model hyperparameters and live token stream preview."
    >
      <FeatureBentoAiCopilot />
    </Story>
  )
}
