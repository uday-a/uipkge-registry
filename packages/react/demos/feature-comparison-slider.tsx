import { FeatureComparisonSlider } from '@/components/blocks/feature-comparison-slider'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Interactive side-by-side architecture comparison slider">
      <div className="w-full">
        <FeatureComparisonSlider />
      </div>
    </Story>
  )
}
