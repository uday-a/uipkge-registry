import Story from '../../components/story/Story'
import { BulletChart } from '@react-registry/charts'

const kpis = [
  { label: 'Revenue', actual: 82, target: 90, ranges: [50, 75, 100] as [number, number, number] },
  { label: 'NPS', actual: 64, target: 70, ranges: [40, 60, 100] as [number, number, number] },
  { label: 'Uptime', actual: 99.2, target: 99.9, ranges: [95, 99, 100] as [number, number, number] },
  { label: 'CSAT', actual: 88, target: 85, ranges: [60, 80, 100] as [number, number, number] },
]

export default function BulletChartDemo() {
  return (
    <>
      <Story title="KPI vs target" description="Background bands, foreground actual bar, target tick per row.">
        <BulletChart data={kpis} height={300} />
      </Story>
    </>
  )
}
