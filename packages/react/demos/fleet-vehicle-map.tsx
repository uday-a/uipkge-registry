import Story from '../../components/story/Story'
import { FleetVehicleMap } from '@react-registry-blocks/fleet-vehicle-map/FleetVehicleMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function FleetVehicleMapDemo() {
  return (
    <Story title="Fleet" description="Mapbox live tracking. Select a vehicle to fly the camera.">
      <FleetVehicleMap accessToken={token} />
    </Story>
  )
}
