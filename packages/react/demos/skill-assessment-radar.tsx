import Story from '../../components/story/Story'
import { SkillAssessmentRadar } from '@react-registry-blocks/skill-assessment-radar/SkillAssessmentRadar'

export default function SkillAssessmentRadarDemo() {
  return (
    <Story
      title="Default"
      description="Developer skill proficiency scorecard and radar matrix: domain percentile rankings, dual candidate vs industry benchmark progress bars, competency breakdown, radar telemetry polygon, and personalized learning pathways."
    >
      <SkillAssessmentRadar />
    </Story>
  )
}
