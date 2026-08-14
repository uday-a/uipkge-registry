import Story from '../../components/story/Story'
import { AssetTrackingMap } from '@react-registry-blocks/asset-tracking-map/AssetTrackingMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function AssetTrackingMapDemo() {
  return (
    <Story
      title="Asset Tracking"
      description="Intermodal shipping container tracking with cold-chain sensors and geofence alarms."
    >
      <AssetTrackingMap accessToken={token} />
    </Story>
  )
}
