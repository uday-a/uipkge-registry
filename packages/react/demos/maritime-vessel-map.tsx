import Story from '../../components/story/Story'
import { MaritimeVesselMap } from '@react-registry-blocks/maritime-vessel-map/MaritimeVesselMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function MaritimeVesselMapDemo() {
  return (
    <Story
      title="Maritime AIS"
      description="Automatic Identification System vessel monitoring in congested international shipping lanes."
    >
      <MaritimeVesselMap accessToken={token} />
    </Story>
  )
}
