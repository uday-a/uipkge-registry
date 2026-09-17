import Story from '../../components/story/Story'
import { IntegrationsHubDiagram } from '@react-registry-blocks/integrations-hub-diagram/IntegrationsHubDiagram'
// IntegrationsHubDiagram is the block file the user installs. Open
// `components/blocks/IntegrationsHubDiagram.tsx` after install to change the
// `nodes` array — positions are computed on a circle, so any count works.

export default function IntegrationsHubDiagramDemo() {
  return (
    <Story
      title="Integrations — Hub Diagram"
      description="Radial hub diagram. Drawn SVG spokes connect a central platform node to eight orbiting services, with a legend separating sources from destinations."
    >
      <IntegrationsHubDiagram />
    </Story>
  )
}
