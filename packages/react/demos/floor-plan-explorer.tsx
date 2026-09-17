import Story from '../../components/story/Story'
import { FloorPlanExplorer } from '@react-registry-blocks/floor-plan-explorer/FloorPlanExplorer'

export default function FloorPlanExplorerDemo() {
  return (
    <Story
      title="Default"
      description="Architectural unit floor plan inspector with 2D layout dimensions, room breakdown, and available unit switcher."
    >
      <FloorPlanExplorer />
    </Story>
  )
}
