import Story from '../../components/story/Story'
import { BeforeAfterSideBySide } from '@react-registry-blocks/before-after-side-by-side/BeforeAfterSideBySide'
// BeforeAfterSideBySide is the block file the user installs. Open
// `components/blocks/BeforeAfterSideBySide.tsx` after install to replace the
// panels; the annotation row is what makes the difference legible.

export default function BeforeAfterSideBySideDemo() {
  return (
    <Story
      title="Before & After — Side by Side"
      description="Two labelled panels at equal height with a shared annotation row beneath — for comparisons where a drag slider hides half the evidence."
    >
      <BeforeAfterSideBySide />
    </Story>
  )
}
