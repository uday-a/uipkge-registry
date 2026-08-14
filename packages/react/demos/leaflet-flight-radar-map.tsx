import Story from '../../components/story/Story'
import { LeafletFlightRadarMap } from '@react-registry-blocks/leaflet-flight-radar-map/LeafletFlightRadarMap'

export default function LeafletFlightRadarMapDemo() {
  return (
    <Story
      title="Flight Radar"
      description="Leaflet/OpenStreetMap aviation radar — no API key. Curved flight paths, callsigns, and live telemetry."
    >
      <LeafletFlightRadarMap />
    </Story>
  )
}
