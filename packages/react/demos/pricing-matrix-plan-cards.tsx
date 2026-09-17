import Story from '../../components/story/Story'
import { PricingMatrixPlanCards } from '@react-registry-blocks/pricing-matrix-plan-cards/PricingMatrixPlanCards'
// PricingMatrixPlanCards is the block file the user installs. Open
// `components/blocks/PricingMatrixPlanCards.tsx` after install to edit the
// `plans` array; inclusion is derived from one shared capability list.

export default function PricingMatrixPlanCardsDemo() {
  return (
    <Story
      title="Pricing — Per-Plan Comparison"
      description="Each plan as its own card of included and excluded capabilities — the shape a wide comparison matrix should take on a narrow screen."
    >
      <PricingMatrixPlanCards />
    </Story>
  )
}
