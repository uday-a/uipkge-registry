import Story from '../../components/story/Story'
import { MetricsGrid } from '@react-registry-blocks/metrics-grid/MetricsGrid'

export default function MetricsGridDemo() {
  return (
    <Story
      title="Default"
      description="Six KPI tiles. Each card pairs a stat header with a pie, donut, or horizontal bar that breaks the metric down."
    >
      <MetricsGrid />
    </Story>
  )
}
