import Story from '../../components/story/Story'
import { LeafletPropertyBoundaryMap } from '@react-registry-blocks/leaflet-property-boundary-map/LeafletPropertyBoundaryMap'

export default function LeafletPropertyBoundaryMapDemo() {
  return (
    <Story
      title="Property Boundaries"
      description="Cadastral parcel polygons with zoning classes and assessed valuation on free Esri satellite tiles — no API key."
    >
      <LeafletPropertyBoundaryMap />
    </Story>
  )
}
