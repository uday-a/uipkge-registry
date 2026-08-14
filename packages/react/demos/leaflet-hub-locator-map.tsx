import Story from '../../components/story/Story'
import { LeafletHubLocatorMap } from '@react-registry-blocks/leaflet-hub-locator-map/LeafletHubLocatorMap'

export default function LeafletHubLocatorMapDemo() {
  return (
    <Story
      title="Distribution hubs"
      description="Leaflet/OpenStreetMap coverage map — no API key. Select a hub to fly the camera and highlight its delivery radius."
    >
      <LeafletHubLocatorMap />
    </Story>
  )
}
