import { CtaSplitDemoRequestModal } from '@/components/blocks/cta-split-demo-request-modal'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story
      title="Default"
      description="Enterprise demo request workbench with interactive team size and framework options"
    >
      <div className="w-full">
        <CtaSplitDemoRequestModal />
      </div>
    </Story>
  )
}
