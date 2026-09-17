import Story from '../../components/story/Story'
import { VirtualCardManager } from '@react-registry-blocks/virtual-card-manager/VirtualCardManager'

export default function VirtualCardManagerDemo() {
  return (
    <Story
      title="Default"
      description="Mercury/Ramp-style corporate virtual card manager with interactive card visual hero, live spending limit progress, freeze toggles, and active cards table."
    >
      <VirtualCardManager />
    </Story>
  )
}
