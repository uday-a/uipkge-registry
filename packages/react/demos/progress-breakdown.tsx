import Story from '../../components/story/Story'
import { ProgressBreakdown } from '@react-registry-blocks/progress-breakdown/ProgressBreakdown'
import { TrendingUp } from 'lucide-react'

const items = [
  { name: 'Engineering', value: 35, secondaryLabel: '42 people' },
  { name: 'Product', value: 18, secondaryLabel: '22 people' },
  { name: 'Design', value: 12, secondaryLabel: '15 people' },
  { name: 'Sales', value: 15, secondaryLabel: '18 people' },
  { name: 'Marketing', value: 10, secondaryLabel: '12 people' },
  { name: 'Other', value: 10, secondaryLabel: '12 people' },
]

export default function ProgressBreakdownDemo() {
  return (
    <Story
      title="Default"
      description="Card with header icon and a stacked list of progress rows, each labeled with a secondary count."
    >
      <ProgressBreakdown
        title="Department Breakdown"
        description="Headcount distribution."
        items={items}
        headerIcon={TrendingUp}
      />
    </Story>
  )
}
