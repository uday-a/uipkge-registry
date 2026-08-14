import Story from '../../components/story/Story'
import { WholesaleB2bQuickOrder } from '@react-registry-blocks/wholesale-b2b-quick-order/WholesaleB2bQuickOrder'

export default function WholesaleB2bQuickOrderDemo() {
  return (
    <>
      <Story
        title="Wholesale Bulk Order Matrix (Default)"
        description="Interactive wholesale B2B order matrix featuring tier 3 wholesale pricing, case pack multipliers, SKU paste bulk input, real-time freight threshold calculation, and sticky order checkout."
      >
        <WholesaleB2bQuickOrder />
      </Story>

      <Story
        title="Enterprise Partner & Custom Terms"
        description="B2B matrix configured for custom enterprise partner with Tier 4 volume discount, Net 60 invoicing terms, and customized PO reference."
      >
        <WholesaleB2bQuickOrder
          accountName="Apex Global Distribution"
          accountTier="Tier 4 Platinum Partner"
          tierDiscountPercent={42}
          paymentTerms="Net 60 Invoicing"
          poNumber="PO-2026-APEX-992"
        />
      </Story>
    </>
  )
}
