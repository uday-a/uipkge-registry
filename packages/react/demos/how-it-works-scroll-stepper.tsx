import Story from '../../components/story/Story'
import { HowItWorksScrollStepper } from '@react-registry-blocks/how-it-works-scroll-stepper/HowItWorksScrollStepper'
// HowItWorksScrollStepper is the block file the user installs. Open
// `components/blocks/HowItWorksScrollStepper.tsx` after install to edit the
// `steps` array. The observer is set up on mount and torn down on unmount.

export default function HowItWorksScrollStepperDemo() {
  return (
    <Story
      title="How It Works — Scroll Stepper"
      description="Scroll-driven walkthrough. A sticky rail tracks which step is in view as the copy scrolls past; without IntersectionObserver it degrades to a plain list."
    >
      <HowItWorksScrollStepper />
    </Story>
  )
}
