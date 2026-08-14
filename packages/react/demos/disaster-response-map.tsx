import Story from '../../components/story/Story'
import { DisasterResponseMap } from '@react-registry-blocks/disaster-response-map/DisasterResponseMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function DisasterResponseMapDemo() {
  return (
    <Story
      title="Disaster Response"
      description="Emergency incident perimeter with shelter occupancy rates and relief staging hubs."
    >
      <DisasterResponseMap accessToken={token} />
    </Story>
  )
}
