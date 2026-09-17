import { FeatureCodePreviewSplit } from '@/components/blocks/feature-code-preview-split'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Dual-pane developer sandbox with live code generation and interactive preview">
      <div className="w-full">
        <FeatureCodePreviewSplit />
      </div>
    </Story>
  )
}
