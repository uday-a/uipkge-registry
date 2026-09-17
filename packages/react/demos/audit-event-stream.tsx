import Story from '../../components/story/Story'
import { AuditEventStream } from '@react-registry-blocks/audit-event-stream/AuditEventStream'

export default function AuditEventStreamDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Real-time live streaming audit log viewer and security telemetry feed with status indicators, stream pause/resume controls, regex and keyword log filtering, severity badges, expandable JSON payload inspectors, and ingestion telemetry stats."
      >
        <AuditEventStream />
      </Story>

      <Story
        title="Critical incidents"
        description="Pre-filtered view showing only critical severity security violations, ingress changes, and privilege alerts."
      >
        <AuditEventStream initialSeverity="critical" />
      </Story>

      <Story
        title="Stream paused"
        description="Stream paused state with buffer frozen, telemetry indicator showing paused status, and resume toggle."
      >
        <AuditEventStream initialPaused={true} />
      </Story>

      <Story
        title="Search query filter"
        description="Pre-populated search query targeting IAM and authentication events."
      >
        <AuditEventStream initialSearch="iam.user" />
      </Story>

      <Story
        title="Empty stream"
        description="Empty state when stream buffer is cleared with affordance to restore default telemetry stream."
      >
        <AuditEventStream initialEvents={[]} />
      </Story>
    </>
  )
}
