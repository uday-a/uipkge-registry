import Story from '../../components/story/Story'
import { StatsBandSparklines } from '@react-registry-blocks/stats-band-sparklines/StatsBandSparklines'
// StatsBandSparklines is the block file the user installs. Open
// `components/blocks/StatsBandSparklines.tsx` after install to feed real
// series; the sparkline is inline SVG with no chart dependency.

export default function StatsBandSparklinesDemo() {
  return (
    <Story
      title="Stats — Band with Sparklines"
      description="Each headline figure paired with an inline sparkline and its period, so the number arrives with the shape of the trend behind it."
    >
      <StatsBandSparklines />
    </Story>
  )
}
