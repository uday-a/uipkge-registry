import { PricingFeatureAddonBuilder } from '@/components/blocks/pricing-feature-addon-builder'
import { Story } from '@/components/story/Story'

export default function PricingFeatureAddonBuilderDemo() {
  return (
    <Story
      title="Default"
      description="Interactive add-on pricing calculator with real-time tier bundling and seat scaling."
    >
      <PricingFeatureAddonBuilder />
    </Story>
  )
}
