import Story from '../../components/story/Story'
import { HowItWorksSteps } from '@react-registry-blocks/how-it-works-steps/HowItWorksSteps'
// HowItWorksSteps is the block file the user installs. Open
// `components/blocks/HowItWorksSteps.tsx` after install to edit the `steps`
// array — swap icons, retitle, or add a fourth step (the connector rail is
// percentage-based, so it re-centres itself).

export default function HowItWorksStepsDemo() {
  return (
    <Story
      title="How It Works — Three Steps"
      description="Horizontal three-step explainer. Numbered markers sit on a connector rail, each step carries an icon, body copy, and a time estimate, and the section closes on a primary + ghost CTA row."
    >
      <HowItWorksSteps />
    </Story>
  )
}
