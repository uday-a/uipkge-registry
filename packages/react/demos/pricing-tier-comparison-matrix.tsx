import { PricingTierComparisonMatrix } from '@/components/blocks/pricing-tier-comparison-matrix'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Pricing tier cards with billing cycle switch and detailed feature matrix">
      <div className="w-full">
        <PricingTierComparisonMatrix />
      </div>
    </Story>
  )
}
