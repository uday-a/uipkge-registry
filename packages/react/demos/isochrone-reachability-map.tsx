import Story from '../../components/story/Story'
import { IsochroneReachabilityMap } from '@react-registry-blocks/isochrone-reachability-map/IsochroneReachabilityMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function IsochroneReachabilityMapDemo() {
  return (
    <Story
      title="Reachability"
      description="Drive-time isochrone polygons with population reach and workforce analytics."
    >
      <IsochroneReachabilityMap accessToken={token} />
    </Story>
  )
}
