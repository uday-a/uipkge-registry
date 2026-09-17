import Story from '../../components/story/Story'
import { AiCrmPipelineDashboard } from '@react-registry-blocks/ai-crm-pipeline-dashboard/AiCrmPipelineDashboard'

export default function AiCrmPipelineDashboardDemo() {
  return (
    <>
      <Story
        title="Sales Pipeline & Revenue Velocity"
        description="Wise & modern AI revenue intelligence dashboard featuring revenue velocity metrics, 4-stage pipeline Kanban board with predictive AI win scores, deal progress bars, and automated multi-speaker AI meeting summaries with buying intent detection."
      >
        <AiCrmPipelineDashboard />
      </Story>

      <Story
        title="Table View Mode"
        description="Tabular spreadsheet/CRM list view with sortable stage progress meters, key stakeholder roles, target close dates, and direct AI next action recommendations."
      >
        <AiCrmPipelineDashboard initialViewMode="table" />
      </Story>

      <Story
        title="Negotiation & Closing Stage Focus"
        description="Pre-filtered stage view showing high-momentum, win-ready deals nearing contract finalization."
      >
        <AiCrmPipelineDashboard initialStageFilter="negotiation" />
      </Story>

      <Story
        title="Search Filtered (Fintech)"
        description="Pre-populated search query filtering multi-region infrastructure and modern banking deals."
      >
        <AiCrmPipelineDashboard initialSearch="Fintech" />
      </Story>

      <Story
        title="Pipeline Only (Insights Collapsed)"
        description="Streamlined pipeline board focusing exclusively on CRM health KPIs and the 4 stage columns."
      >
        <AiCrmPipelineDashboard showInsights={false} />
      </Story>
    </>
  )
}
