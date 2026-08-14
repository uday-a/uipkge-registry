import Story from '../../components/story/Story'
import { LollipopChart } from '@react-registry/charts'

const votes = [
  { category: 'Alpha', value: 84 },
  { category: 'Beta', value: 62 },
  { category: 'Gamma', value: 91 },
  { category: 'Delta', value: 45 },
  { category: 'Epsilon', value: 73 },
]

export default function LollipopChartDemo() {
  return (
    <>
      <Story title="Feature votes" description="Thin stems with dot endpoints; lighter than bars for ranked lists.">
        <LollipopChart data={votes} height={300} />
      </Story>
    </>
  )
}
