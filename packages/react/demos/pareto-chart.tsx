import Story from '../../components/story/Story'
import { ParetoChart } from '@react-registry/charts'

const defects = [
  { category: 'Typos', value: 142 },
  { category: 'Broken links', value: 98 },
  { category: 'Slow pages', value: 64 },
  { category: 'Auth errors', value: 31 },
  { category: 'Billing bugs', value: 18 },
  { category: 'Other', value: 12 },
]

export default function ParetoChartDemo() {
  return (
    <>
      <Story title="Defect Pareto" description="Rows auto-sort; cumulative % line finds the vital few.">
        <ParetoChart data={defects} height={320} />
      </Story>
    </>
  )
}
