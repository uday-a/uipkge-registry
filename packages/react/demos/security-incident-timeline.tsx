import Story from '../../components/story/Story'
import { SecurityIncidentTimeline } from '@react-registry-blocks/security-incident-timeline/SecurityIncidentTimeline'

export default function SecurityIncidentTimelineDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Security Operations Center (SOC) incident response timeline and post-mortem tracker with telemetry KPIs, chronological audit trail, log snippets, and corrective action items."
      >
        <SecurityIncidentTimeline />
      </Story>

      <Story
        title="Active SEV-1 Incident Triage"
        description="In-flight incident triage state with active war room bridge and unmitigated containment status."
      >
        <SecurityIncidentTimeline
          incidentId="#SEC-INC-2026-0914"
          incidentTitle="Distributed API Gateway Credential Stuffing Attempt"
          severity="SEV-1 Critical"
          status="Active · In Triage"
          commanderName="Elena Rostova"
          commanderRole="Staff Security Architect · War Room Commander"
        />
      </Story>
    </>
  )
}
