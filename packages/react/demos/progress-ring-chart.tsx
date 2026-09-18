import Story from '../../components/story/Story'
import { ProgressRingChart } from '@react-registry/charts'

export default function ProgressRingChartDemo() {
  return (
    <>
      <Story title="Quota ring" description="Single ring with a centred summary.">
        <ProgressRingChart rings={[{ value: 68, label: 'Quota' }]} height={220} />
      </Story>
      <Story title="Multi-ring" description="Concentric rings for stacked goals.">
        <ProgressRingChart
          rings={[
            { value: 82, label: 'Revenue' },
            { value: 64, label: 'NPS' },
            { value: 45, label: 'Retention' },
          ]}
          height={260}
        />
      </Story>
    </>
  )
}
