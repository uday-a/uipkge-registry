import Story from '../../components/story/Story'
import { VirtualTourPanorama } from '@react-registry-blocks/virtual-tour-panorama/VirtualTourPanorama'

export default function VirtualTourPanoramaDemo() {
  return (
    <Story
      title="Virtual Tour Panorama"
      description="360-degree immersive room tour container with interactive viewpoint hotspots, dynamic laser distance measurement mode, and real-time floor plan minimap with FOV radar cone."
    >
      <VirtualTourPanorama />
    </Story>
  )
}
