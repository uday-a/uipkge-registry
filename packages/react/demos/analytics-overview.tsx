import Story from '../../components/story/Story'
import { AnalyticsOverview } from '@react-registry-blocks/analytics-overview/AnalyticsOverview'

export default function AnalyticsOverviewDemo() {
  return (
    <Story
      title="Default"
      description="Two-pane analytics dashboard. Stacked bar with a dual y-axis on top; click a bar to filter the line chart below."
    >
      <AnalyticsOverview />
    </Story>
  )
}
