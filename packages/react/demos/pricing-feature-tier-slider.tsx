import { PricingFeatureTierSlider } from '@/components/blocks/pricing-feature-tier-slider'
import { Story } from '@/components/story/Story'

export default function PricingFeatureTierSliderDemo() {
  return (
    <Story
      title="Default"
      description="Continuous MAU usage scale pricing slider with dynamic tier calculations and annual savings."
    >
      <PricingFeatureTierSlider />
    </Story>
  )
}
