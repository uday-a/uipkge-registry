import Story from '../../components/story/Story'
import { DeliveryProofCard } from '@react-registry-blocks/delivery-proof-card/DeliveryProofCard'

export default function DeliveryProofCardDemo() {
  return (
    <Story
      title="Electronic Proof of Delivery (ePOD)"
      description="Last-mile delivery verification receipt with customer signature, doorstep photo verification, GPS geofence timestamp, courier telemetry, and package manifest."
    >
      <DeliveryProofCard />
    </Story>
  )
}
