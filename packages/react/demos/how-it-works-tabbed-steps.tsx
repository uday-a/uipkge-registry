import Story from '../../components/story/Story'
import { HowItWorksTabbedSteps } from '@react-registry-blocks/how-it-works-tabbed-steps/HowItWorksTabbedSteps'
// HowItWorksTabbedSteps is the block file the user installs. Open
// `components/blocks/HowItWorksTabbedSteps.tsx` after install to edit the
// `steps` array; panels are height-matched so tabbing never jumps the page.

export default function HowItWorksTabbedStepsDemo() {
  return (
    <Story
      title="How It Works — Tabbed Steps"
      description="Vertical step tabs beside a detail panel. Selecting a stage swaps the action, expected result, and a primitive-built screen without shifting the panel height."
    >
      <HowItWorksTabbedSteps />
    </Story>
  )
}
