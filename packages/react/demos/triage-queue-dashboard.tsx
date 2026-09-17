import Story from '../../components/story/Story'
import { TriageQueueDashboard } from '@react-registry-blocks/triage-queue-dashboard/TriageQueueDashboard'

export default function TriageQueueDashboardDemo() {
  return (
    <Story
      title="Triage Queue Dashboard"
      description="Emergency Department (ED) and Urgent Care patient acuity triage queue and room allocation board with live ESI overview cards, vitals monitoring, and care team assignments."
    >
      <TriageQueueDashboard />
    </Story>
  )
}
