import Story from '../../components/story/Story'
import { AdSpendRoiDashboard } from '@react-registry-blocks/ad-spend-roi-dashboard/AdSpendRoiDashboard'

export default function AdSpendRoiDashboardDemo() {
  return (
    <Story
      title="Default"
      description="Multi-channel paid acquisition ad spend, blended ROAS, and CAC performance dashboard with channel comparison table and top campaigns."
    >
      <AdSpendRoiDashboard />
    </Story>
  )
}
