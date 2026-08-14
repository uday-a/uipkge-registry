import * as React from 'react'
import Story from '../../components/story/Story'
import { ThreatMapRadar } from '@react-registry-blocks/threat-map-radar/ThreatMapRadar'

export default function ThreatMapRadarDemo() {
  return (
    <Story
      title="Threat Radar"
      description="Mapbox world canvas with live attack arcs into edge PoPs. Click an origin to isolate its vector."
    >
      <ThreatMapRadar />
    </Story>
  )
}
