import Story from '../../components/story/Story'
import { PopulationPyramidChart } from '@react-registry/charts'

const users = [
  { band: '18–24', left: 12, right: 14 },
  { band: '25–34', left: 24, right: 26 },
  { band: '35–44', left: 19, right: 21 },
  { band: '45–54', left: 14, right: 15 },
  { band: '55+', left: 8, right: 10 },
]

export default function PopulationPyramidChartDemo() {
  return (
    <>
      <Story title="User age split" description="Mirrored bars; tooltips and labels show absolute values.">
        <PopulationPyramidChart data={users} height={320} />
      </Story>
      <Story title="Custom cohorts" description="Rename the sides for any A/B population.">
        <PopulationPyramidChart data={users.slice(0, 3)} names={['Control', 'Variant']} height={240} />
      </Story>
    </>
  )
}
