import Story from '../../components/story/Story'
import { FeatureSegmentedCompare } from '@react-registry-blocks/feature-segmented-compare/FeatureSegmentedCompare'
// FeatureSegmentedCompare is the block file the user installs. Open
// `components/blocks/FeatureSegmentedCompare.tsx` after install to rename
// the modes; both panels render from one `modes` array.

export default function FeatureSegmentedCompareDemo() {
  return (
    <Story
      title="Features — Segmented Compare"
      description="A segmented control switches the section between two operating modes, swapping the capability list, the constraints, and the recommendation line."
    >
      <FeatureSegmentedCompare />
    </Story>
  )
}
