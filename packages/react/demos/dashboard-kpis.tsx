import Story from '../../components/story/Story'
import { DashboardKpis } from '@react-registry-blocks/dashboard-kpis/DashboardKpis'

export default function DashboardKpisDemo() {
  return (
    <Story
      title="Default"
      description="Four inline KPI tiles. Each Card spells out the label, number, signed trend, and sparkline."
    >
      <DashboardKpis />
    </Story>
  )
}
