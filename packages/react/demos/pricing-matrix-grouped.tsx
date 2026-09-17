import Story from '../../components/story/Story'
import { PricingMatrixGrouped } from '@react-registry-blocks/pricing-matrix-grouped/PricingMatrixGrouped'
// PricingMatrixGrouped is the block file the user installs. Open
// `components/blocks/PricingMatrixGrouped.tsx` after install to edit the
// `groups` array; each group collapses independently.

export default function PricingMatrixGroupedDemo() {
  return (
    <Story
      title="Pricing — Grouped Matrix"
      description="Comparison matrix with collapsible capability groups — opens on summary rows and expands only the section the reader cares about."
    >
      <PricingMatrixGrouped />
    </Story>
  )
}
