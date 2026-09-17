import Story from '../../components/story/Story'
import { VitalsTrackerChart } from '@react-registry-blocks/vitals-tracker-chart/VitalsTrackerChart'

export default function VitalsTrackerChartDemo() {
  return (
    <Story
      title="Default"
      description="Biometric vitals monitoring dashboard with multi-day trends, threshold bands, device sync status, 7-day vitals table with risk indicators, clinician alert limits, and quick-entry logging dialog."
    >
      <VitalsTrackerChart />
    </Story>
  )
}
