import Story from '../../components/story/Story'
import { DemoGuidedTour } from '@react-registry-blocks/demo-guided-tour/DemoGuidedTour'
// DemoGuidedTour is the block file the user installs. Open
// `components/blocks/DemoGuidedTour.tsx` after install to retarget the
// steps; each step names the element it highlights.

export default function DemoGuidedTourDemo() {
  return (
    <Story
      title="Demo — Guided Tour"
      description="Next and previous move a highlight across a mocked interface, with a step counter and a skip control for people who would rather just read."
    >
      <DemoGuidedTour />
    </Story>
  )
}
