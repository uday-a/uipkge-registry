import Story from '../../components/story/Story'
import { LeafletAssetTrackingMap } from '@react-registry-blocks/leaflet-asset-tracking-map/LeafletAssetTrackingMap'

export default function LeafletAssetTrackingMapDemo() {
  return (
    <Story
      title="Asset Tracking"
      description="Leaflet/Esri satellite cargo tracking — no API key. Shipping lanes, cold-chain sensors, and geofence alarms."
    >
      <LeafletAssetTrackingMap />
    </Story>
  )
}
