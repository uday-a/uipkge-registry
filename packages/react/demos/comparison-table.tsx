import Story from '../../components/story/Story'
import { ComparisonTable } from '@react-registry-blocks/comparison-table/ComparisonTable'

export default function ComparisonTableDemo() {
  return (
    <Story
      title="Comparison Table"
      description="Plan feature matrix with monthly/yearly toggle. Pro column highlighted with a 'Popular' badge and a primary tint down the column."
    >
      <ComparisonTable />
    </Story>
  )
}
