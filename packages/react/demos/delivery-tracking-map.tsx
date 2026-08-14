import Story from '../../components/story/Story'
import { DeliveryTrackingMap } from '@react-registry-blocks/delivery-tracking-map/DeliveryTrackingMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function DeliveryTrackingMapDemo() {
  return (
    <Story
      title="Delivery Tracking"
      description="Real-time order delivery route with courier telemetry and arrival countdown."
    >
      <DeliveryTrackingMap accessToken={token} />
    </Story>
  )
}
