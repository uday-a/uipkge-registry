import { FeatureHoverTiltCards } from '@/components/blocks/feature-hover-tilt-cards'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="3D perspective tilt workbench cards with live mouse tracking and physics">
      <div className="w-full">
        <FeatureHoverTiltCards />
      </div>
    </Story>
  )
}
