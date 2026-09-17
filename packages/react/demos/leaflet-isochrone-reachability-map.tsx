import Story from '../../components/story/Story'
import { LeafletIsochroneReachabilityMap } from '@react-registry-blocks/leaflet-isochrone-reachability-map/LeafletIsochroneReachabilityMap'

export default function LeafletIsochroneReachabilityMapDemo() {
  return (
    <Story
      title="Reachability"
      description="Drive-time isochrone polygons with population reach and workforce analytics — free OpenStreetMap/Esri tiles, no API key."
    >
      <LeafletIsochroneReachabilityMap />
    </Story>
  )
}
