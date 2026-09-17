import Story from '../../components/story/Story'
import { UseCasesScenarioWalkthrough } from '@react-registry-blocks/use-cases-scenario-walkthrough/UseCasesScenarioWalkthrough'
// UseCasesScenarioWalkthrough is the block file the user installs. Open
// `components/blocks/UseCasesScenarioWalkthrough.tsx` after install to write
// your own scenario; one concrete story beats four abstract ones.

export default function UseCasesScenarioWalkthroughDemo() {
  return (
    <Story
      title="Use Cases — Scenario Walkthrough"
      description="A single scenario walked end to end: what happens, who does it, and what the system records at each step."
    >
      <UseCasesScenarioWalkthrough />
    </Story>
  )
}
