import Story from '../../components/story/Story'
import { LeafletThreatMapRadar } from '@react-registry-blocks/leaflet-threat-map-radar/LeafletThreatMapRadar'

export default function LeafletThreatMapRadarDemo() {
  return (
    <Story
      title="Threat Radar"
      description="Leaflet dark world canvas with attack arcs into edge PoPs under a radar sweep — no API key. Click an origin to isolate its vector."
    >
      <LeafletThreatMapRadar />
    </Story>
  )
}
