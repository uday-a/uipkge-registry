import Story from '../../components/story/Story'
import { HowItWorksArrowFlow } from '@react-registry-blocks/how-it-works-arrow-flow/HowItWorksArrowFlow'
// HowItWorksArrowFlow is the block file the user installs. Open
// `components/blocks/HowItWorksArrowFlow.tsx` after install to edit the
// `stages` array — the arrows are drawn between cells, so any count works.

export default function HowItWorksArrowFlowDemo() {
  return (
    <Story
      title="How It Works — Arrow Flow"
      description="Four stages joined by drawn arrows, each with an icon tile, label, and the artefact it produces. Below the breakpoint the row becomes a vertical rail."
    >
      <HowItWorksArrowFlow />
    </Story>
  )
}
