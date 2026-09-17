import Story from '../../components/story/Story'
import { FeatureStickyMediaScroll } from '@react-registry-blocks/feature-sticky-media-scroll/FeatureStickyMediaScroll'
// FeatureStickyMediaScroll is the block file the user installs. Open
// `components/blocks/FeatureStickyMediaScroll.tsx` after install to edit the
// `sections` array; the pinned pane keys off whichever section is centred.

export default function FeatureStickyMediaScrollDemo() {
  return (
    <Story
      title="Features — Sticky Media Scroll"
      description="The visual pins while copy scrolls beside it, swapping as each section enters view. Without IntersectionObserver it reads as stacked copy-and-visual pairs."
    >
      <FeatureStickyMediaScroll />
    </Story>
  )
}
