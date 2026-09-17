import Story from '../../components/story/Story'
import { LeafletFleetVehicleMap } from '@react-registry-blocks/leaflet-fleet-vehicle-map/LeafletFleetVehicleMap'

export default function LeafletFleetVehicleMapDemo() {
  return (
    <Story
      title="Fleet"
      description="Leaflet/OpenStreetMap live tracking — no API key. Select a vehicle to fly the camera."
    >
      <LeafletFleetVehicleMap />
    </Story>
  )
}
