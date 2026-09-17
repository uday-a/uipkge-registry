import Story from '../../components/story/Story'
import { UsageMeteringDashboard } from '@react-registry-blocks/usage-metering-dashboard/UsageMeteringDashboard'

export default function UsageMeteringDashboardDemo() {
  return (
    <Story
      title="Default"
      description="Real-time consumption metering and overage monitoring dashboard with billing cycle tracking, resource meters, cost projections, protection guardrails, and usage event logs."
    >
      <UsageMeteringDashboard />
    </Story>
  )
}
