import Story from '../../components/story/Story'
import { SecurityDataFlow } from '@react-registry-blocks/security-data-flow/SecurityDataFlow'
// SecurityDataFlow is the block file the user installs. Open
// `components/blocks/SecurityDataFlow.tsx` after install to relabel the
// zones. Arrows are drawn in a viewBox, so they scale with the card.

export default function SecurityDataFlowDemo() {
  return (
    <Story
      title="Security — Data Flow"
      description="Three labelled zones joined by drawn arrows showing what crosses the boundary and what never does, with a legend separating metadata from customer rows."
    >
      <SecurityDataFlow />
    </Story>
  )
}
