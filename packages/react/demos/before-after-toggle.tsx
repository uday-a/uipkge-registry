import Story from '../../components/story/Story'
import { BeforeAfterToggle } from '@react-registry-blocks/before-after-toggle/BeforeAfterToggle'
// BeforeAfterToggle is the block file the user installs. Open
// `components/blocks/BeforeAfterToggle.tsx` after install to swap the two
// states for real screenshots; the panel holds a fixed height between them.

export default function BeforeAfterToggleDemo() {
  return (
    <Story
      title="Before & After — Toggle"
      description="One panel toggling between the old and new state of the same screen, captioned with what changed. The control keeps its position across switches."
    >
      <BeforeAfterToggle />
    </Story>
  )
}
