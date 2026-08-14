import Story from '../../components/story/Story'
import { PropertyBoundaryMap } from '@react-registry-blocks/property-boundary-map/PropertyBoundaryMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function PropertyBoundaryMapDemo() {
  return (
    <Story
      title="Property Boundaries"
      description="Real estate cadastral parcel zoning and tax assessment boundary maps."
    >
      <PropertyBoundaryMap accessToken={token} />
    </Story>
  )
}
