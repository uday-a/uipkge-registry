import Story from '../../components/story/Story'
import { LeafletDeliveryTrackingMap } from '@react-registry-blocks/leaflet-delivery-tracking-map/LeafletDeliveryTrackingMap'

export default function LeafletDeliveryTrackingMapDemo() {
  return (
    <Story
      title="Delivery Tracking"
      description="Real-time order delivery route on free OpenStreetMap tiles — no API key. Courier telemetry and arrival countdown."
    >
      <LeafletDeliveryTrackingMap />
    </Story>
  )
}
