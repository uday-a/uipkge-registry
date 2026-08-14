import Story from '../../components/story/Story'
import { ExitInterviewSurvey } from '@react-registry-blocks/exit-interview-survey/ExitInterviewSurvey'

export default function ExitInterviewSurveyDemo() {
  return (
    <Story
      title="Default"
      description="Structured employee exit interview and offboarding review with sentiment analysis, departure drivers, 5-star dimension ratings, qualitative feedback textareas, and knowledge handover checklist."
    >
      <ExitInterviewSurvey />
    </Story>
  )
}
