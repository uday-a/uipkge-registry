import Story from '../../components/story/Story'
import { BackorderSplitShipmentManager } from '@react-registry-blocks/backorder-split-shipment-manager'

export default function BackorderSplitShipmentManagerDemo() {
  return (
    <Story
      title="Default"
      description="Multi-warehouse split fulfillment console with inventory triage and partial dispatch controls."
    >
      <div className="p-4">
        <BackorderSplitShipmentManager />
      </div>
    </Story>
  )
}
