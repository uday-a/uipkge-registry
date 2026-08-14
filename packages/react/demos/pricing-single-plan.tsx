import Story from '../../components/story/Story'
import { PricingSinglePlan } from '@react-registry-blocks/pricing-single-plan/PricingSinglePlan'
// PricingSinglePlan is the block file the user installs. Open
// `components/blocks/PricingSinglePlan.tsx` after install to edit the
// inclusions. Naming exclusions is what makes a single plan credible.

export default function PricingSinglePlanDemo() {
  return (
    <Story
      title="Pricing — Single Plan"
      description="A single plan stating the price, what is included, what explicitly is not, and the usage point at which a conversation becomes worthwhile."
    >
      <PricingSinglePlan />
    </Story>
  )
}
