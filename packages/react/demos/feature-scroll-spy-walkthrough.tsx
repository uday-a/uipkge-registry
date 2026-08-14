import { FeatureScrollSpyWalkthrough } from '@/components/blocks/feature-scroll-spy-walkthrough'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Step-by-step developer workflow progression with sticky live code terminal">
      <div className="w-full">
        <FeatureScrollSpyWalkthrough />
      </div>
    </Story>
  )
}
