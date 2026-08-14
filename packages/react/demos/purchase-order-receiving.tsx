import Story from '../../components/story/Story'
import { PurchaseOrderReceiving } from '@react-registry-blocks/purchase-order-receiving'

export default function PurchaseOrderReceivingDemo() {
  return (
    <Story
      title="Default"
      description="Inbound dock receiving workbench with PO line item matching, QA discrepancy logging, and GRN generation."
    >
      <div className="p-4">
        <PurchaseOrderReceiving />
      </div>
    </Story>
  )
}
