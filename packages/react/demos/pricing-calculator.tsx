import Story from '../../components/story/Story'
import { PricingCalculator } from '@react-registry-blocks/pricing-calculator/PricingCalculator'

export default function PricingCalculatorDemo() {
  return (
    <Story
      title="Interactive Pricing Calculator"
      description="Dynamic SaaS & API pricing estimator with interactive sliders for seats, API requests, and cloud storage, annual billing toggle, enterprise add-ons, and sticky live estimated cost breakdown."
    >
      <PricingCalculator />
    </Story>
  )
}
