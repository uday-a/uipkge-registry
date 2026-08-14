import { FeatureMetricGrowthStepper } from '@/components/blocks/feature-metric-growth-stepper'
import { Story } from '@/components/story/Story'

export default function FeatureMetricGrowthStepperDemo() {
  return (
    <Story
      title="Default"
      description="Interactive scale progression workbench showing infrastructure benchmarks by growth stage."
    >
      <FeatureMetricGrowthStepper />
    </Story>
  )
}
