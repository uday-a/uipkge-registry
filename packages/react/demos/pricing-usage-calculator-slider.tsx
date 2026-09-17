import { PricingUsageCalculatorSlider } from '@/components/blocks/pricing-usage-calculator-slider'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Interactive frontend infrastructure ROI and cost calculator">
      <div className="w-full">
        <PricingUsageCalculatorSlider />
      </div>
    </Story>
  )
}
