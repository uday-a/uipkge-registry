import Story from '../../components/story/Story'
import { LeafletDisasterResponseMap } from '@react-registry-blocks/leaflet-disaster-response-map/LeafletDisasterResponseMap'

export default function LeafletDisasterResponseMapDemo() {
  return (
    <Story
      title="Disaster Response"
      description="Emergency incident perimeter rings with shelter occupancy and relief staging on free tiles — no API key."
    >
      <LeafletDisasterResponseMap />
    </Story>
  )
}
