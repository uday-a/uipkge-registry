import Story from '../../components/story/Story'
import { FeaturesChecklistSplit } from '@react-registry-blocks/features-checklist-split/FeaturesChecklistSplit'
// FeaturesChecklistSplit is the block file the user installs. Open
// `components/blocks/FeaturesChecklistSplit.tsx` after install to edit the
// `capabilities` array; the two columns fill from one flat list.

export default function FeaturesChecklistSplitDemo() {
  return (
    <Story
      title="Features — Checklist Split"
      description="Sticky pitch column beside a dense two-up capability checklist. Each line carries a short factual qualifier instead of an adjective, so the list stays scannable."
    >
      <FeaturesChecklistSplit />
    </Story>
  )
}
