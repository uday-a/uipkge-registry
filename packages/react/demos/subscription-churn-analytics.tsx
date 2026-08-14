import Story from '../../components/story/Story'
import { SubscriptionChurnAnalytics } from '@react-registry-blocks/subscription-churn-analytics/SubscriptionChurnAnalytics'

export default function SubscriptionChurnAnalyticsDemo() {
  return (
    <Story
      title="Default"
      description="ChartMogul and Baremetrics style SaaS subscription churn and MRR analytics dashboard with metrics cards, waterfall movement breakdown, churn reasons table, and quick actions."
    >
      <SubscriptionChurnAnalytics />
    </Story>
  )
}
