import Story from '../../components/story/Story'
import { NightingaleChart } from '@react-registry/charts'

const traffic = [
  { name: 'Organic', value: 480 },
  { name: 'Paid', value: 360 },
  { name: 'Referral', value: 220 },
  { name: 'Social', value: 150 },
  { name: 'Email', value: 90 },
]

export default function NightingaleChartDemo() {
  return (
    <>
      <Story title="Channel rose" description="Radius encodes value; bigger slices reach further.">
        <NightingaleChart data={traffic} height={340} />
      </Story>
    </>
  )
}
