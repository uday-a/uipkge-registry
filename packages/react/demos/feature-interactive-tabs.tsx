import { FeatureInteractiveTabs } from '@/components/blocks/feature-interactive-tabs'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Master-detail architectural feature workbench with interactive code sandbox">
      <div className="w-full">
        <FeatureInteractiveTabs />
      </div>
    </Story>
  )
}
