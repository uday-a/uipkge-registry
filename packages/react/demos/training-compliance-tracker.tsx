import Story from '../../components/story/Story'
import { TrainingComplianceTracker } from '@react-registry-blocks/training-compliance-tracker/TrainingComplianceTracker'

export default function TrainingComplianceTrackerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Annual mandatory employee compliance training dashboard with 100% compliance status, 4 KPI metric cards, verified credential badges, course table, interactive certificate modal, and PDF export."
      >
        <TrainingComplianceTracker />
      </Story>

      <Story
        title="Security & Privacy Modules"
        description="Pre-filtered view highlighting InfoSec data protection (SOC 2 / ISO 27001) and HIPAA health privacy regulatory compliance modules."
      >
        <TrainingComplianceTracker defaultFilter="security" />
      </Story>

      <Story
        title="Ethics & Corporate Governance"
        description="Pre-filtered view for California AB 1825 Harassment Prevention, FCPA Anti-Bribery, and SEC Insider Trading certifications."
      >
        <TrainingComplianceTracker defaultFilter="governance" />
      </Story>
    </>
  )
}
