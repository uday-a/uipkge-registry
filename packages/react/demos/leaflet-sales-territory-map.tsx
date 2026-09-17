import Story from '../../components/story/Story'
import { LeafletSalesTerritoryMap } from '@react-registry-blocks/leaflet-sales-territory-map/LeafletSalesTerritoryMap'

export default function LeafletSalesTerritoryMapDemo() {
  return (
    <Story
      title="Territories"
      description="Region boundary polygons and quota pins on free OpenStreetMap/Esri tiles — no API key. Select a territory to fly the camera."
    >
      <LeafletSalesTerritoryMap />
    </Story>
  )
}
