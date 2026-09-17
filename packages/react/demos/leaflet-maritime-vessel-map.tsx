import Story from '../../components/story/Story'
import { LeafletMaritimeVesselMap } from '@react-registry-blocks/leaflet-maritime-vessel-map/LeafletMaritimeVesselMap'

export default function LeafletMaritimeVesselMapDemo() {
  return (
    <Story
      title="Maritime AIS"
      description="AIS vessel monitoring across Rotterdam shipping lanes on free OpenStreetMap/Esri tiles — no API key."
    >
      <LeafletMaritimeVesselMap />
    </Story>
  )
}
