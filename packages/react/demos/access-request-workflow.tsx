import Story from '../../components/story/Story'
import { AccessRequestWorkflow } from '@react-registry-blocks/access-request-workflow/AccessRequestWorkflow'

export default function AccessRequestWorkflowDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Just-In-Time (JIT) IAM privilege elevation workflow with governance KPI cards, request dialog, live session countdowns, and manager approval queue."
      >
        <AccessRequestWorkflow />
      </Story>

      <Story
        title="Zero-Trust IAM & Production Access"
        description="Customized title and subtitle for production infrastructure and compliance security teams."
      >
        <AccessRequestWorkflow
          title="Zero-Trust Access Broker & JIT Elevation"
          subtitle="Temporary privileged role provisioning with multi-party authorization and immutable audit trail."
        />
      </Story>
    </>
  )
}
