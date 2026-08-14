import Story from '../../components/story/Story'
import { HowItWorksBeforeAfter } from '@react-registry-blocks/how-it-works-before-after/HowItWorksBeforeAfter'
// HowItWorksBeforeAfter is the block file the user installs. Open
// `components/blocks/HowItWorksBeforeAfter.tsx` after install to edit the
// `rows` array; each row pairs one before step with its after step.

export default function HowItWorksBeforeAfterDemo() {
  return (
    <Story
      title="How It Works — Before & After"
      description="The old workflow set against the new one, step for step, with matched row heights so the saving at each stage is legible without reading both columns."
    >
      <HowItWorksBeforeAfter />
    </Story>
  )
}
