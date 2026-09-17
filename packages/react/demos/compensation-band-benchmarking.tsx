import Story from '../../components/story/Story'
import { CompensationBandBenchmarking } from '@react-registry-blocks/compensation-band-benchmarking/CompensationBandBenchmarking'

export default function CompensationBandBenchmarkingDemo() {
  return (
    <Story
      title="Default"
      description="Pave/Levels.fyi style engineering salary and equity compensation band visualizer with percentiles (P25, P50, P75, P90), level progression matrix, and certified pay equity audit."
    >
      <CompensationBandBenchmarking />
    </Story>
  )
}
