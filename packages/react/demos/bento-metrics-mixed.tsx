import Story from '../../components/story/Story'
import { BentoMetricsMixed } from '@react-registry-blocks/bento-metrics-mixed/BentoMetricsMixed'
// BentoMetricsMixed is the block file the user installs. Open
// `components/blocks/BentoMetricsMixed.tsx` after install to wire real
// figures. The sparkline is inline SVG, no chart dependency.

export default function BentoMetricsMixedDemo() {
  return (
    <Story
      title="Bento — Mixed Metrics"
      description="Six tiles mixing headline numbers, a sparkline row, a short list, and a status tile — the summary band that sits beneath a hero."
    >
      <BentoMetricsMixed />
    </Story>
  )
}
