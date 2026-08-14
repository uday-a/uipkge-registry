import Story from '../../components/story/Story'
import { LeafletStoreLocatorMap } from '@react-registry-blocks/leaflet-store-locator-map/LeafletStoreLocatorMap'

export default function LeafletStoreLocatorMapDemo() {
  return (
    <Story
      title="Stores"
      description="Leaflet/OpenStreetMap store locator — no API key. Click a pin for details, or select a store to fly the camera."
    >
      <LeafletStoreLocatorMap />
    </Story>
  )
}
