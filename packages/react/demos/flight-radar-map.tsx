import Story from '../../components/story/Story'
import { FlightRadarMap } from '@react-registry-blocks/flight-radar-map/FlightRadarMap'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined

export default function FlightRadarMapDemo() {
  return (
    <Story
      title="Flight Radar"
      description="Live aviation airspace monitoring with aircraft altitudes, velocities, and telemetry."
    >
      <FlightRadarMap accessToken={token} />
    </Story>
  )
}
