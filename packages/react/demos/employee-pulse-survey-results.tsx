import Story from '../../components/story/Story'
import { EmployeePulseSurveyResults } from '@react-registry-blocks/employee-pulse-survey-results/EmployeePulseSurveyResults'

export default function EmployeePulseSurveyResultsDemo() {
  return (
    <Story
      title="Default"
      description="Culture Amp style company eNPS engagement survey results dashboard with executive metrics, department sentiment heatmaps, and priority sentiment drivers."
    >
      <EmployeePulseSurveyResults />
    </Story>
  )
}
