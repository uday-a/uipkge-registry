import Story from '../../components/story/Story'
import { WavePickingConsole } from '@react-registry-blocks/wave-picking-console'

export default function WavePickingConsoleDemo() {
  return (
    <Story
      title="Default"
      description="Batch wave picking console with multi-order tote assignment and sequence optimization."
    >
      <div className="p-4">
        <WavePickingConsole />
      </div>
    </Story>
  )
}
