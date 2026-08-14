import Story from '../../components/story/Story'
import { PricingMatrixStickyHeader } from '@react-registry-blocks/pricing-matrix-sticky-header/PricingMatrixStickyHeader'
// PricingMatrixStickyHeader is the block file the user installs. Open
// `components/blocks/PricingMatrixStickyHeader.tsx` after install to edit
// the `rows` array. The header pins with sticky positioning, no JS.

export default function PricingMatrixStickyHeaderDemo() {
  return (
    <Story
      title="Pricing — Sticky Header Matrix"
      description="Long feature matrix with a pinned plan header row, so a checkmark thirty rows down is still attributable to the right column."
    >
      <PricingMatrixStickyHeader />
    </Story>
  )
}
